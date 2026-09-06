// Vercel Serverless Function: WhatsApp CRM Operations API
// Robust server-side handler for Conversations, Messages, Status, Notes & Realtime fallback

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://zhwdaimprkmqljjwrbpk.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_eDWmwO-eoswzD8cdjudEJQ_ie4y7w9v';

function getSupabaseAdmin() {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false }
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabase = getSupabaseAdmin();
  const { action } = req.query;

  try {
    // 1. GET ALL CONVERSATIONS (WITH CUSTOMER DETAILS)
    if (req.method === 'GET' && (!action || action === 'conversations')) {
      const { filter = 'all', search = '' } = req.query;

      let query = supabase
        .from('whatsapp_conversations')
        .select(`
          id,
          customer_id,
          status,
          last_message_preview,
          last_message_type,
          last_message_at,
          last_customer_message_at,
          unread_count,
          is_archived,
          created_at,
          updated_at,
          whatsapp_customers (
            id,
            whatsapp_number,
            name,
            profile_photo_url,
            status,
            notes,
            unread_count
          )
        `)
        .order('last_message_at', { ascending: false });

      if (filter === 'unread') {
        query = query.gt('unread_count', 0);
      } else if (['new', 'pending', 'resolved'].includes(filter)) {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) {
        console.error('[CRM API] Fetch conversations error:', error);
        return res.status(200).json({ data: [], error: error.message, hint: 'Please verify supabase_whatsapp_crm.sql is executed in Supabase' });
      }

      let results = data || [];
      if (search && search.trim()) {
        const s = search.trim().toLowerCase();
        results = results.filter(conv => {
          const cust = conv.whatsapp_customers;
          return (
            cust?.name?.toLowerCase().includes(s) ||
            cust?.whatsapp_number?.includes(s) ||
            conv.last_message_preview?.toLowerCase().includes(s)
          );
        });
      }

      return res.status(200).json({ data: results });
    }

    // 2. GET MESSAGES FOR A CONVERSATION
    if (req.method === 'GET' && action === 'messages') {
      const { conversation_id } = req.query;
      if (!conversation_id) {
        return res.status(400).json({ error: 'conversation_id is required' });
      }

      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('conversation_id', conversation_id)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('[CRM API] Fetch messages error:', error);
        return res.status(200).json({ data: [], error: error.message });
      }

      return res.status(200).json({ data: data || [] });
    }

    // 3. GET DASHBOARD STATS
    if (req.method === 'GET' && action === 'stats') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [
        { count: totalCustomers },
        { count: unreadConversations },
        { count: activeConversations },
        { count: pendingConversations },
        { count: resolvedConversations },
        { count: messagesToday }
      ] = await Promise.all([
        supabase.from('whatsapp_customers').select('*', { count: 'exact', head: true }),
        supabase.from('whatsapp_conversations').select('*', { count: 'exact', head: true }).gt('unread_count', 0),
        supabase.from('whatsapp_conversations').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('whatsapp_conversations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('whatsapp_conversations').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
        supabase.from('whatsapp_messages').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString())
      ]);

      return res.status(200).json({
        totalCustomers: totalCustomers || 0,
        unreadConversations: unreadConversations || 0,
        activeConversations: activeConversations || 0,
        pendingConversations: pendingConversations || 0,
        resolvedConversations: resolvedConversations || 0,
        messagesToday: messagesToday || 0
      });
    }

    // 4. MARK AS READ
    if (req.method === 'POST' && action === 'mark_read') {
      const { conversationId, customerId, lastMetaMessageId } = req.body || {};

      if (conversationId) {
        await supabase
          .from('whatsapp_conversations')
          .update({ unread_count: 0, updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      }

      if (customerId) {
        await supabase
          .from('whatsapp_customers')
          .update({ unread_count: 0, updated_at: new Date().toISOString() })
          .eq('id', customerId);
      }

      return res.status(200).json({ success: true });
    }

    // 5. UPDATE STATUS
    if (req.method === 'POST' && action === 'update_status') {
      const { conversationId, customerId, status } = req.body || {};

      if (conversationId) {
        await supabase
          .from('whatsapp_conversations')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      }

      if (customerId) {
        await supabase
          .from('whatsapp_customers')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', customerId);
      }

      return res.status(200).json({ success: true, status });
    }

    // 6. UPDATE CUSTOMER DETAILS
    if (req.method === 'POST' && action === 'update_customer') {
      const { customerId, name, notes } = req.body || {};
      const updates = { updated_at: new Date().toISOString() };
      if (name !== undefined) updates.name = name;
      if (notes !== undefined) updates.notes = notes;

      const { data, error } = await supabase
        .from('whatsapp_customers')
        .update(updates)
        .eq('id', customerId)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, customer: data });
    }

    return res.status(400).json({ error: 'Invalid or missing action parameter' });
  } catch (error) {
    console.error('[WhatsApp CRM API] Server error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
