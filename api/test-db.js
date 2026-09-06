// Diagnostic API to verify Supabase connectivity and Meta WABA webhook subscription

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://zhwdaimprkmqljjwrbpk.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_eDWmwO-eoswzD8cdjudEJQ_ie4y7w9v';
const BAZARA_TOKEN = 'EAAkgatRDZCW8BSWVA4MZCreNM5en1XQZBm17OreaWvsPPiYBv32KLrEOKRA7TSlENSwuV0ZBhgxaJtZBEV2Y5ykBNEEg6ZBoFpmEl11NwI0GaCGaH1XRx4WrOt7cwAWZBZBdEDwzmr14PJrAecQax2Psbv8TXtHZB8Np8ZBqgzjFMSPa2gafbjn6qcOqQzwk3ltawtbv1toFtNZBPBZA4DZCC03GhaCSZA6bRMe4bLLpIUAiJHV99qFW4JKyvHvqmMWKESWQed5eROzmYuCs9iENY1MTvDpUZAiNHhsvPNiZCPMZD';

export default async function handler(req, res) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });

    const { action } = req.query;
    const token = process.env.WHATSAPP_TOKEN || process.env.VITE_WHATSAPP_TOKEN || BAZARA_TOKEN;
    const wabaId = process.env.WHATSAPP_WABA_ID || process.env.VITE_WHATSAPP_WABA_ID || '1061585893433054';

    // 1. SUBSCRIBE WABA TO BAZARA APP VIA META GRAPH API
    if (action === 'subscribe_waba') {
      const response = await fetch(`https://graph.facebook.com/v20.0/${wabaId}/subscribed_apps`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const metaData = await response.json();
      return res.status(response.status).json({
        waba_id: wabaId,
        meta_response: metaData,
        status: response.ok ? 'Bazara App Subscribed Successfully to WABA!' : 'Subscription Failed'
      });
    }

    if (action === 'insert_demo') {
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
      conversations: convRes.data || [],
      messages: msgRes.data || []
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
