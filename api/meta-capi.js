import crypto from 'crypto';

// Vercel Serverless Function: Meta Conversions API (CAPI) Dispatcher
// Pixel / Dataset ID: 946148641877992

const PIXEL_ID = '946148641877992';

/**
 * SHA-256 hash helper function for Meta user data normalization
 */
function hashSha256(value) {
  if (!value) return undefined;
  return crypto
    .createHash('sha256')
    .update(String(value).trim().toLowerCase())
    .digest('hex');
}

/**
 * Normalize and hash Indian/international phone numbers for Meta
 */
function normalizeAndHashPhone(phone) {
  if (!phone) return undefined;
  // Remove non-digit characters
  let clean = String(phone).replace(/\D/g, '');
  if (clean.length === 10) {
    clean = '91' + clean; // Default to India country code 91
  }
  return crypto.createHash('sha256').update(clean).digest('hex');
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
      eventName = 'Purchase', 
      eventId, 
      eventSourceUrl, 
      userData = {}, 
      customData = {},
      testEventCode
    } = req.body || {};

    const accessToken = 
      process.env.META_ACCESS_TOKEN || 
      process.env.FB_ACCESS_TOKEN || 
      process.env.META_CONVERSIONS_API_TOKEN ||
      process.env.VITE_META_ACCESS_TOKEN;

    if (!accessToken) {
      // Graceful return if access token is not yet configured in Vercel env
      return res.status(200).json({ 
        success: true, 
        warning: 'META_ACCESS_TOKEN not configured in environment variables. Server-side CAPI skipped.' 
      });
    }

    const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
    const userAgent = req.headers['user-agent'] || '';

    // Normalize user data for Meta CAPI Advanced Matching
    const normalizedUserData = {
      client_ip_address: clientIp || undefined,
      client_user_agent: userAgent || undefined
    };

    if (userData.email) {
      normalizedUserData.em = [hashSha256(userData.email)];
    }
    if (userData.phone) {
      normalizedUserData.ph = [normalizeAndHashPhone(userData.phone)];
    }
    if (userData.name) {
      const parts = String(userData.name).trim().split(/\s+/);
      if (parts[0]) normalizedUserData.fn = [hashSha256(parts[0])];
      if (parts.length > 1) normalizedUserData.ln = [hashSha256(parts.slice(1).join(' '))];
    }

    const activeTestCode = testEventCode || process.env.META_TEST_EVENT_CODE;

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId || undefined,
          event_source_url: eventSourceUrl || 'https://bazara.in/checkout',
          action_source: 'website',
          user_data: normalizedUserData,
          custom_data: {
            currency: customData.currency || 'INR',
            value: Number(customData.value || 0),
            content_type: customData.content_type || 'product',
            content_name: customData.content_name || undefined,
            content_category: customData.content_category || undefined,
            content_ids: customData.content_ids || undefined,
            num_items: customData.num_items || 1,
            order_id: customData.order_id || eventId || undefined
          }
        }
      ]
    };

    if (activeTestCode) {
      payload.test_event_code = activeTestCode;
    }

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.warn('[Meta CAPI] Graph API response warning:', result);
      return res.status(response.status).json({ success: false, error: result });
    }

    return res.status(200).json({ 
      success: true, 
      events_received: result.events_received,
      fbtrace_id: result.fbtrace_id 
    });

  } catch (err) {
    console.error('[Meta CAPI] Server execution error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
