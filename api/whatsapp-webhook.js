// Vercel Serverless Function: Meta WhatsApp Cloud API Webhook Handler
// Robustly handles both Production Webhooks and Meta Test Payloads

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
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET: META WEBHOOK VERIFICATION HANDSHAKE
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || process.env.META_VERIFY_TOKEN || 'bazara_whatsapp_crm_verify_token_2026';

    if (mode === 'subscribe' && token === expectedToken) {
      console.log('[WhatsApp Webhook] Verification successful');
      return res.status(200).send(challenge);
    } else {
      console.warn('[WhatsApp Webhook] Verification failed: Token mismatch or bad mode');
      return res.status(403).json({ error: 'Verification token mismatch' });
    }
  }

  // 2. POST: INCOMING MESSAGES & STATUS EVENTS
  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const supabase = getSupabaseAdmin();

      // Normalize changes/values from both production Meta wrapper and test console payloads
      const changeValues = [];

      if (body.entry && Array.isArray(body.entry)) {
        for (const entry of body.entry) {
          if (entry.changes && Array.isArray(entry.changes)) {
            for (const change of entry.changes) {
              if (change.value) changeValues.push(change.value);
            }
          }
        }
      } else if (body.value) {
        changeValues.push(body.value);
      } else if (body.messages) {
        changeValues.push(body);
      }

      for (const value of changeValues) {
        // A. PROCESS DELIVERY / READ STATUS UPDATES
        if (value.statuses && Array.isArray(value.statuses)) {
          for (const statusObj of value.statuses) {
            const metaMsgId = statusObj.id;
            const status = statusObj.status; // 'sent', 'delivered', 'read', 'failed'
            const error = statusObj.errors ? JSON.stringify(statusObj.errors) : null;

            if (metaMsgId && status) {
              await supabase
                .from('whatsapp_messages')
                .update({
                  delivery_status: status,
                  error_message: error
                })
                .eq('meta_message_id', metaMsgId);
            }
          }
        }

        // B. PROCESS INCOMING MESSAGES
        if (value.messages && Array.isArray(value.messages)) {
          const contacts = value.contacts || [];
          const contactMap = {};
          contacts.forEach(c => {
            contactMap[c.wa_id] = c.profile?.name || c.wa_id;
          });

          for (const msg of value.messages) {
            const fromNumber = msg.from; // e.g. "919876543210"
            const senderName = contactMap[fromNumber] || fromNumber;
            const metaMsgId = msg.id || `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            const msgType = msg.type || 'text';
            const timestamp = msg.timestamp ? new Date(parseInt(msg.timestamp, 10) * 1000).toISOString() : new Date().toISOString();

            // Check Idempotency: avoid duplicate message processing
            const { data: existingMsg } = await supabase
              .from('whatsapp_messages')
              .select('id')
              .eq('meta_message_id', metaMsgId)
              .maybeSingle();

            if (existingMsg) {
              console.log(`[WhatsApp Webhook] Duplicate message ${metaMsgId} ignored.`);
              continue;
            }

            // 1. Get or Create Customer
            let { data: customer } = await supabase
              .from('whatsapp_customers')
              .select('*')
              .eq('whatsapp_number', fromNumber)
              .maybeSingle();

            if (!customer) {
              const { data: newCustomer, error: custErr } = await supabase
                .from('whatsapp_customers')
                .insert({
                  whatsapp_number: fromNumber,
                  name: senderName,
                  status: 'new',
                  unread_count: 1,
                  last_message_at: timestamp
                })
                .select()
                .single();

              if (custErr) {
                console.error('[WhatsApp Webhook] Customer insert error:', custErr);
                throw custErr;
              }
              customer = newCustomer;
            } else {
              // Update customer activity and increment unread count
              await supabase
                .from('whatsapp_customers')
                .update({
                  name: customer.name === fromNumber ? senderName : customer.name,
                  unread_count: (customer.unread_count || 0) + 1,
                  last_message_at: timestamp,
                  status: customer.status === 'resolved' ? 'new' : customer.status,
                  updated_at: new Date().toISOString()
                })
                .eq('id', customer.id);
            }

            // 2. Get or Create Conversation
            let { data: conversation } = await supabase
              .from('whatsapp_conversations')
              .select('*')
              .eq('customer_id', customer.id)
              .maybeSingle();

            let previewText = '';
            let textContent = null;
            let mediaId = null;
            let filename = null;
            let mimeType = null;
            let fileSize = null;
            let mediaUrl = null;

            if (msgType === 'text') {
              textContent = msg.text?.body || '';
              previewText = textContent;
            } else if (msgType === 'image') {
              mediaId = msg.image?.id;
              mimeType = msg.image?.mime_type;
              textContent = msg.image?.caption || null;
              previewText = '📷 Photo' + (textContent ? `: ${textContent}` : '');
              mediaUrl = mediaId ? `/api/whatsapp-media?media_id=${mediaId}` : null;
            } else if (msgType === 'document') {
              mediaId = msg.document?.id;
              filename = msg.document?.filename;
              mimeType = msg.document?.mime_type;
              textContent = msg.document?.caption || null;
              previewText = `📄 Document: ${filename || 'PDF'}`;
              mediaUrl = mediaId ? `/api/whatsapp-media?media_id=${mediaId}` : null;
            } else if (msgType === 'audio') {
              mediaId = msg.audio?.id;
              mimeType = msg.audio?.mime_type;
              const isVoice = msg.audio?.voice === true;
              previewText = isVoice ? '🎙️ Voice message' : '🎵 Audio file';
              mediaUrl = mediaId ? `/api/whatsapp-media?media_id=${mediaId}` : null;
            } else if (msgType === 'video') {
              mediaId = msg.video?.id;
              mimeType = msg.video?.mime_type;
              textContent = msg.video?.caption || null;
              previewText = '🎥 Video' + (textContent ? `: ${textContent}` : '');
              mediaUrl = mediaId ? `/api/whatsapp-media?media_id=${mediaId}` : null;
            } else if (msgType === 'sticker') {
              mediaId = msg.sticker?.id;
              mimeType = msg.sticker?.mime_type;
              previewText = '💟 Sticker';
              mediaUrl = mediaId ? `/api/whatsapp-media?media_id=${mediaId}` : null;
            } else {
              previewText = `📎 ${msgType} message`;
            }

            if (!conversation) {
              const { data: newConv, error: convErr } = await supabase
                .from('whatsapp_conversations')
                .insert({
                  customer_id: customer.id,
                  status: 'new',
                  last_message_preview: previewText,
                  last_message_type: ['text', 'image', 'document', 'audio', 'video', 'template'].includes(msgType) ? msgType : 'other',
                  last_message_at: timestamp,
                  last_customer_message_at: timestamp,
                  unread_count: 1
                })
                .select()
                .single();

              if (convErr) {
                console.error('[WhatsApp Webhook] Conversation insert error:', convErr);
                throw convErr;
              }
              conversation = newConv;
            } else {
              await supabase
                .from('whatsapp_conversations')
                .update({
                  status: conversation.status === 'resolved' ? 'new' : conversation.status,
                  last_message_preview: previewText,
                  last_message_type: ['text', 'image', 'document', 'audio', 'video', 'template'].includes(msgType) ? msgType : 'other',
                  last_message_at: timestamp,
                  last_customer_message_at: timestamp,
                  unread_count: (conversation.unread_count || 0) + 1,
                  updated_at: new Date().toISOString()
                })
                .eq('id', conversation.id);
            }

            // 3. Insert Inbound Message
            const { error: msgInsertErr } = await supabase
              .from('whatsapp_messages')
              .insert({
                conversation_id: conversation.id,
                customer_id: customer.id,
                meta_message_id: metaMsgId,
                direction: 'inbound',
                message_type: ['text', 'image', 'document', 'audio', 'video', 'template', 'sticker'].includes(msgType) ? msgType : 'other',
                text_content: textContent,
                media_id: mediaId,
                media_url: mediaUrl,
                filename: filename,
                mime_type: mimeType,
                file_size: fileSize,
                delivery_status: 'delivered',
                timestamp: timestamp,
                raw_payload: msg
              });

            if (msgInsertErr) {
              console.error('[WhatsApp Webhook] Message insert error:', msgInsertErr);
            } else {
              console.log(`[WhatsApp Webhook] Inbound message ${metaMsgId} from ${fromNumber} stored successfully.`);
            }
          }
        }
      }

      return res.status(200).json({ success: true, processed: changeValues.length });
    } catch (error) {
      console.error('[WhatsApp Webhook] Error processing event:', error);
      return res.status(200).json({ error: error.message || 'Internal error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
