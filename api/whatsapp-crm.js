// Vercel Serverless Function: WhatsApp CRM Operations API
// Handles status updates, marking as read with Meta sync, notes, tags, and dashboard analytics

import { createClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://vkmjrqkptqgtyqfhzrqx.supabase.co';
const FALLBACK_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbWpycWtwdHFndHlxZmh6cnF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzY4NTYsImV4cCI6MjA1NjgxMjg1Nn0.8aA54k9iLwz6l-844_ZzB9hF-e0P8f1gU4uR4pW3z-g';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_KEY;
  return createClient(supabaseUrl, supabaseKey, {
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
    // 1. GET DASHBOARD STATS
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

    // 2. MARK AS READ (Syncs CRM + Meta Read Receipt)
    if (req.method === 'POST' && action === 'mark_read') {
      const { conversationId, customerId, lastMetaMessageId } = req.body || {};

      if (!conversationId && !customerId) {
        return res.status(400).json({ error: 'conversationId or customerId is required' });
      }

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

      // Sync Meta Read Receipt if message ID provided
      if (lastMetaMessageId) {
        const token = process.env.WHATSAPP_TOKEN || process.env.VITE_WHATSAPP_TOKEN || process.env.META_ACCESS_TOKEN;
        const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.VITE_WHATSAPP_PHONE_NUMBER_ID || process.env.META_PHONE_NUMBER_ID;

        if (token && phoneId) {
          try {
            await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                status: 'read',
                message_id: lastMetaMessageId
              })
            });
          } catch (e) {
            console.warn('[WhatsApp CRM] Meta mark-read dispatch ignored:', e.message);
          }
        }
      }

      return res.status(200).json({ success: true });
    }

    // 3. UPDATE STATUS (new, pending, resolved)
    if (req.method === 'POST' && action === 'update_status') {
      const { conversationId, customerId, status } = req.body || {};

      if (!['new', 'pending', 'resolved'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be new, pending, or resolved.' });
      }

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

    // 4. UPDATE CUSTOMER DETAILS & NOTES
    if (req.method === 'POST' && action === 'update_customer') {
      const { customerId, name, notes } = req.body || {};

      if (!customerId) {
        return res.status(400).json({ error: 'customerId is required' });
      }

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
    console.error('[WhatsApp CRM API] Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
