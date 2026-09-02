// Vercel Serverless Function: WhatsApp Cloud API Dispatcher for bazara.in
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
    const { to, templateName, components } = req.body || {};

    if (!to || !templateName) {
      return res.status(400).json({ error: 'Recipient phone (to) and templateName are required' });
    }

    const token = process.env.WHATSAPP_TOKEN || process.env.VITE_WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '1360291297158291';

    if (!token) {
      return res.status(500).json({ error: 'Server configuration error: WHATSAPP_TOKEN is missing' });
    }

    const response = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en' },
          components
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Meta WhatsApp API error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Failed to dispatch WhatsApp message', details: data });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('WhatsApp API execution error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
