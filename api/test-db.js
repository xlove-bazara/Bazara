// Diagnostic API to verify Supabase table connectivity and test data insertion

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://zhwdaimprkmqljjwrbpk.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_eDWmwO-eoswzD8cdjudEJQ_ie4y7w9v';

export default async function handler(req, res) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });

    const { action } = req.query;

    if (action === 'insert_demo') {
      // Create demo customer
      const { data: cust, error: custErr } = await supabase
        .from('whatsapp_customers')
        .insert({
          whatsapp_number: '919837371137',
          name: 'Vipu (Test Customer)',
          status: 'new',
          unread_count: 1
        })
        .select()
        .single();

      if (custErr) return res.status(500).json({ error: custErr.message, step: 'customer' });

      // Create conversation
      const { data: conv, error: convErr } = await supabase
        .from('whatsapp_conversations')
        .insert({
          customer_id: cust.id,
          status: 'new',
          last_message_preview: 'Hello Bazara! This is a test message.',
          unread_count: 1
        })
        .select()
        .single();

      if (convErr) return res.status(500).json({ error: convErr.message, step: 'conv' });

      // Create message
      const { data: msg, error: msgErr } = await supabase
        .from('whatsapp_messages')
        .insert({
          conversation_id: conv.id,
          customer_id: cust.id,
          direction: 'inbound',
          message_type: 'text',
          text_content: 'Hello Bazara! This is a test message.',
          delivery_status: 'delivered'
        })
        .select()
        .single();

      if (msgErr) return res.status(500).json({ error: msgErr.message, step: 'msg' });

      return res.status(200).json({ success: true, cust, conv, msg });
    }

    // Default: Check tables
    const [custRes, convRes, msgRes] = await Promise.all([
      supabase.from('whatsapp_customers').select('*').limit(5),
      supabase.from('whatsapp_conversations').select('*').limit(5),
      supabase.from('whatsapp_messages').select('*').limit(5)
    ]);

    return res.status(200).json({
      supabase_url: SUPABASE_URL,
      customers: custRes.data || [],
      customers_error: custRes.error?.message || null,
      conversations: convRes.data || [],
      conversations_error: convRes.error?.message || null,
      messages: msgRes.data || [],
      messages_error: msgRes.error?.message || null
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
