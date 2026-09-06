// Vercel Serverless Function: Outbound WhatsApp Message Dispatcher
// Dispatches Text, Images, Documents/PDFs, Audio/Voice Notes, Videos, and Templates via Meta Cloud API

import { createClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://zhwdaimprkmqljjwrbpk.supabase.co';
const FALLBACK_SUPABASE_KEY = 'sb_publishable_eDWmwO-eoswzD8cdjudEJQ_ie4y7w9v';
const FALLBACK_TOKEN = 'EAAkgatRDZCW8BSWVA4MZCreNM5en1XQZBm17OreaWvsPPiYBv32KLrEOKRA7TSlENSwuV0ZBhgxaJtZBEV2Y5ykBNEEg6ZBoFpmEl11NwI0GaCGaH1XRx4WrOt7cwAWZBZBdEDwzmr14PJrAecQax2Psbv8TXtHZB8Np8ZBqgzjFMSPa2gafbjn6qcOqQzwk3ltawtbv1toFtNZBPBZA4DZCC03GhaCSZA6bRMe4bLLpIUAiJHV99qFW4JKyvHvqmMWKESWQed5eROzmYuCs9iENY1MTvDpUZAiNHhsvPNiZCPMZD';
const FALLBACK_PHONE_ID = '1360291297158291';

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
      to,
      messageType = 'text',
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

    const token = process.env.WHATSAPP_TOKEN || process.env.VITE_WHATSAPP_TOKEN || process.env.META_ACCESS_TOKEN || FALLBACK_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.VITE_WHATSAPP_PHONE_NUMBER_ID || process.env.META_PHONE_NUMBER_ID || FALLBACK_PHONE_ID;

    // Helper: Upload Base64/Data URI to Meta Graph API Media endpoint
    async function uploadMediaToMeta(mediaInput, customFilename, msgType) {
      if (!mediaInput || typeof mediaInput !== 'string') {
        throw new Error('Media input is required');
      }

      // If already an HTTP/HTTPS URL, Meta can fetch it directly
      if (mediaInput.startsWith('http://') || mediaInput.startsWith('https://')) {
        return { link: mediaInput };
      }

      let mimeType = 'application/octet-stream';
      let buffer;
      let fname = customFilename;

      if (mediaInput.startsWith('data:')) {
        const parts = mediaInput.split(',');
        const header = parts[0];
        const base64Data = parts.slice(1).join(',');
        const mimeMatch = header.match(/data:([^;]+)/);
        if (mimeMatch) {
          mimeType = mimeMatch[1];
        }
        buffer = Buffer.from(base64Data, 'base64');
      } else {
        buffer = Buffer.from(mediaInput, 'base64');
      }

      // Default filename and mime if missing
      if (!fname) {
        if (msgType === 'image') {
          fname = 'photo.jpg';
          if (mimeType === 'application/octet-stream') mimeType = 'image/jpeg';
        } else if (msgType === 'document') {
          fname = 'document.pdf';
          if (mimeType === 'application/octet-stream') mimeType = 'application/pdf';
        } else if (msgType === 'audio') {
          fname = 'voice_note.ogg';
          if (mimeType === 'application/octet-stream') mimeType = 'audio/ogg';
        } else if (msgType === 'video') {
          fname = 'video.mp4';
          if (mimeType === 'application/octet-stream') mimeType = 'video/mp4';
        }
      }

      const cleanMimeType = mimeType.split(';')[0].trim();

      const formData = new FormData();
      formData.append('messaging_product', 'whatsapp');
      formData.append('type', cleanMimeType);
      const blob = new Blob([buffer], { type: cleanMimeType });
      formData.append('file', blob, fname);

      const metaUploadRes = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const uploadData = await metaUploadRes.json();
      if (!metaUploadRes.ok || !uploadData.id) {
        console.error('[WhatsApp Send] Meta Media Upload Error:', uploadData);
        throw new Error(uploadData.error?.message || 'Failed to upload media to WhatsApp Meta Server');
      }

      return {
        mediaId: uploadData.id,
        mimeType: cleanMimeType,
        filename: fname,
        fileSize: buffer.length
      };
    }

    // Build payload according to Meta WhatsApp Cloud API specs
    const metaPayload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, '') // sanitize number to digits only
    };

    let previewText = '';
    let finalMediaId = mediaId || null;
    let finalMimeType = null;
    let finalFileSize = null;
    let finalFilename = filename || null;
    let finalMediaUrl = mediaUrl || null;

    if (messageType === 'text') {
      if (!textContent) {
        return res.status(400).json({ error: 'textContent is required for text message' });
      }
      metaPayload.type = 'text';
      metaPayload.text = { preview_url: true, body: textContent };
      previewText = textContent;
    } else if (messageType === 'image') {
      metaPayload.type = 'image';
      if (!finalMediaId && mediaUrl) {
        const uploadResult = await uploadMediaToMeta(mediaUrl, filename || 'photo.jpg', 'image');
        if (uploadResult.mediaId) {
          finalMediaId = uploadResult.mediaId;
          finalMimeType = uploadResult.mimeType;
          finalFileSize = uploadResult.fileSize;
          metaPayload.image = { id: finalMediaId, caption: textContent || undefined };
        } else if (uploadResult.link) {
          metaPayload.image = { link: uploadResult.link, caption: textContent || undefined };
        }
      } else if (finalMediaId) {
        metaPayload.image = { id: finalMediaId, caption: textContent || undefined };
      } else {
        return res.status(400).json({ error: 'Image file or mediaUrl is required' });
      }
      previewText = '📷 Photo' + (textContent ? `: ${textContent}` : '');
    } else if (messageType === 'document') {
      metaPayload.type = 'document';
      if (!finalMediaId && mediaUrl) {
        const uploadResult = await uploadMediaToMeta(mediaUrl, filename || 'document.pdf', 'document');
        if (uploadResult.mediaId) {
          finalMediaId = uploadResult.mediaId;
          finalMimeType = uploadResult.mimeType;
          finalFileSize = uploadResult.fileSize;
          finalFilename = uploadResult.filename;
          metaPayload.document = { id: finalMediaId, filename: finalFilename, caption: textContent || undefined };
        } else if (uploadResult.link) {
          metaPayload.document = { link: uploadResult.link, filename: filename || 'document.pdf', caption: textContent || undefined };
        }
      } else if (finalMediaId) {
        metaPayload.document = { id: finalMediaId, filename: filename || 'document.pdf', caption: textContent || undefined };
      } else {
        return res.status(400).json({ error: 'Document file or mediaUrl is required' });
      }
      previewText = `📄 Document: ${finalFilename || filename || 'PDF'}`;
    } else if (messageType === 'audio') {
      metaPayload.type = 'audio';
      if (!finalMediaId && mediaUrl) {
        const uploadResult = await uploadMediaToMeta(mediaUrl, filename || 'voice_note.ogg', 'audio');
        if (uploadResult.mediaId) {
          finalMediaId = uploadResult.mediaId;
          finalMimeType = uploadResult.mimeType;
          finalFileSize = uploadResult.fileSize;
          metaPayload.audio = { id: finalMediaId };
        } else if (uploadResult.link) {
          metaPayload.audio = { link: uploadResult.link };
        }
      } else if (finalMediaId) {
        metaPayload.audio = { id: finalMediaId };
      } else {
        return res.status(400).json({ error: 'Audio recording or mediaUrl is required' });
      }
      previewText = '🎙️ Voice note';
    } else if (messageType === 'video') {
      metaPayload.type = 'video';
      if (!finalMediaId && mediaUrl) {
        const uploadResult = await uploadMediaToMeta(mediaUrl, filename || 'video.mp4', 'video');
        if (uploadResult.mediaId) {
          finalMediaId = uploadResult.mediaId;
          finalMimeType = uploadResult.mimeType;
          finalFileSize = uploadResult.fileSize;
          metaPayload.video = { id: finalMediaId, caption: textContent || undefined };
        } else if (uploadResult.link) {
          metaPayload.video = { link: uploadResult.link, caption: textContent || undefined };
        }
      } else if (finalMediaId) {
        metaPayload.video = { id: finalMediaId, caption: textContent || undefined };
      } else {
        return res.status(400).json({ error: 'Video file or mediaUrl is required' });
      }
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
          media_id: finalMediaId,
          media_url: finalMediaId ? `/api/whatsapp-media?media_id=${finalMediaId}` : finalMediaUrl,
          filename: finalFilename || filename,
          mime_type: finalMimeType,
          file_size: finalFileSize,
          delivery_status: 'sent',
          timestamp: timestamp,
          raw_payload: metaData
        })
        .select()
        .single();

      if (!msgErr) {
        insertedMessage = msgRow;
      }

      await supabase
        .from('whatsapp_conversations')
        .update({
          last_message_preview: previewText,
          last_message_type: messageType,
          last_message_at: timestamp,
          updated_at: timestamp
        })
        .eq('id', finalConvId);

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
