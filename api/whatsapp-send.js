// Vercel Serverless Function: Outbound WhatsApp Message Dispatcher
// Dispatches Text, Images, Documents/PDFs, Audio/Voice Notes, Videos, and Templates via Meta Cloud API

import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or Key is missing in environment');
  }
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
}

export default async function handler(req, res) {
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      customerId,
      conversationId,
      to, // WhatsApp phone number e.g. "919876543210"
      messageType = 'text', // 'text', 'image', 'document', 'audio', 'video', 'template'
      textContent,
      mediaUrl,
      mediaId,
      filename,
      templateName,
      templateComponents,
      templateLanguage = 'en'
    } = req.body || {};

    if (!to) {
      return res.status(400).json({ error: 'Recipient phone (to) is required' });
    }

    const token = process.env.WHATSAPP_TOKEN || process.env.VITE_WHATSAPP_TOKEN || process.env.META_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.VITE_WHATSAPP_PHONE_NUMBER_ID || process.env.META_PHONE_NUMBER_ID || '1360291297158291';

    if (!token) {
      return res.status(500).json({ error: 'Server configuration error: WHATSAPP_TOKEN / META_ACCESS_TOKEN is missing' });
    }

    // Build payload according to Meta WhatsApp Cloud API specs
    const metaPayload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, '') // sanitize number to digits only
    };

    let previewText = '';

    if (messageType === 'text') {
      if (!textContent) {
        return res.status(400).json({ error: 'textContent is required for text message' });
      }
      metaPayload.type = 'text';
      metaPayload.text = { preview_url: true, body: textContent };
      previewText = textContent;
    } else if (messageType === 'image') {
      metaPayload.type = 'image';
      metaPayload.image = mediaId ? { id: mediaId, caption: textContent || undefined } : { link: mediaUrl, caption: textContent || undefined };
      previewText = '📷 Photo' + (textContent ? `: ${textContent}` : '');
    } else if (messageType === 'document') {
      metaPayload.type = 'document';
      metaPayload.document = mediaId
        ? { id: mediaId, filename: filename || 'document.pdf', caption: textContent || undefined }
        : { link: mediaUrl, filename: filename || 'document.pdf', caption: textContent || undefined };
      previewText = `📄 Document: ${filename || 'PDF'}`;
    } else if (messageType === 'audio') {
      metaPayload.type = 'audio';
      metaPayload.audio = mediaId ? { id: mediaId } : { link: mediaUrl };
      previewText = '🎙️ Voice note';
    } else if (messageType === 'video') {
      metaPayload.type = 'video';
      metaPayload.video = mediaId ? { id: mediaId, caption: textContent || undefined } : { link: mediaUrl, caption: textContent || undefined };
      previewText = '🎥 Video' + (textContent ? `: ${textContent}` : '');
    } else if (messageType === 'template') {
      if (!templateName) {
        return res.status(400).json({ error: 'templateName is required for template message' });
      }
      metaPayload.type = 'template';
      metaPayload.template = {
        name: templateName,
        language: { code: templateLanguage },
        components: templateComponents || []
      };
      previewText = `📋 Template: ${templateName}`;
    } else {
      return res.status(400).json({ error: `Unsupported messageType: ${messageType}` });
    }

    // Call Meta WhatsApp Cloud API
    const metaResponse = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metaPayload)
    });

    const metaData = await metaResponse.json();

    if (!metaResponse.ok) {
      console.error('[WhatsApp Send] Meta API error:', metaData);
      return res.status(metaResponse.status).json({
        error: metaData.error?.message || 'Meta Cloud API dispatch failed',
        details: metaData
      });
    }

    const metaMessageId = metaData.messages?.[0]?.id || `wamid.outbound_${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Store the outbound message in Supabase
    const supabase = getSupabaseAdmin();

    // Determine target customer & conversation IDs if not passed
    let finalCustId = customerId;
    let finalConvId = conversationId;

    if (!finalCustId || !finalConvId) {
      const { data: cust } = await supabase
        .from('whatsapp_customers')
        .select('id')
        .eq('whatsapp_number', metaPayload.to)
        .maybeSingle();

      if (cust) {
        finalCustId = cust.id;
        const { data: conv } = await supabase
          .from('whatsapp_conversations')
          .select('id')
          .eq('customer_id', cust.id)
          .maybeSingle();
        if (conv) finalConvId = conv.id;
      }
    }

    let insertedMessage = null;

    if (finalConvId && finalCustId) {
      const { data: msgRow, error: msgErr } = await supabase
        .from('whatsapp_messages')
        .insert({
          conversation_id: finalConvId,
          customer_id: finalCustId,
          meta_message_id: metaMessageId,
          direction: 'outbound',
          message_type: messageType,
          text_content: textContent,
          media_id: mediaId,
          media_url: mediaUrl,
          filename: filename,
          delivery_status: 'sent',
          timestamp: timestamp,
          raw_payload: metaData
        })
        .select()
        .single();

      if (!msgErr) {
        insertedMessage = msgRow;
      }

      // Update conversation last message
      await supabase
        .from('whatsapp_conversations')
        .update({
          last_message_preview: previewText,
          last_message_type: messageType,
          last_message_at: timestamp,
          updated_at: timestamp
        })
        .eq('id', finalConvId);

      // Update customer last contact
      await supabase
        .from('whatsapp_customers')
        .update({
          last_message_at: timestamp,
          updated_at: timestamp
        })
        .eq('id', finalCustId);
    }

    return res.status(200).json({
      success: true,
      metaMessageId,
      message: insertedMessage,
      metaData
    });
  } catch (error) {
    console.error('[WhatsApp Send] Internal error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
