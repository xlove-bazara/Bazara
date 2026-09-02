// WhatsApp Cloud API Service for bazara.in
// Sends real-time Order Deliveries (Product-specific Google Drive URLs) & Authentication OTPs

const DEFAULT_PHONE_ID = '1360291297158291';

/**
 * Format Indian / International phone numbers into standard format without '+' or spaces.
 * e.g. "98373 71137" -> "919837371137", "+919837371137" -> "919837371137"
 */
export function formatPhoneNumber(phone) {
  if (!phone) return null;
  const digits = phone.toString().replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  return digits;
}

/**
 * Send WhatsApp Message with Template
 */
async function sendMetaTemplateMessage({ to, templateName, components }) {
  const cleanPhone = formatPhoneNumber(to);
  if (!cleanPhone) {
    console.warn('Invalid phone number for WhatsApp dispatch:', to);
    return { success: false, error: 'Invalid phone number' };
  }

  // Attempt 1: Serverless API endpoint
  try {
    const res = await fetch('/api/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: cleanPhone,
        templateName,
        components
      })
    });

    if (res.ok) {
      const data = await res.json();
      console.log('WhatsApp template dispatched via serverless:', data);
      return { success: true, data };
    }
  } catch (err) {
    console.warn('Serverless WhatsApp endpoint unavailable, attempting direct fallback...');
  }

  // Attempt 2: Direct Meta Graph API fallback
  const token = import.meta.env.VITE_WHATSAPP_TOKEN;
  const phoneId = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || DEFAULT_PHONE_ID;

  if (!token) {
    console.warn('VITE_WHATSAPP_TOKEN not configured.');
    return { success: false, error: 'WhatsApp Token missing' };
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
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
      console.error('Meta Graph API WhatsApp dispatch failed:', data);
      return { success: false, error: data.error?.message || 'Dispatch failed' };
    }

    console.log('Direct Meta Graph API WhatsApp Success:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Direct WhatsApp fetch exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Send automated order confirmation with product Google Drive link via WhatsApp
 */
export async function sendWhatsAppOrderDelivery({
  customerPhone,
  customerName,
  productTitle,
  driveUrl
}) {
  if (!customerPhone) {
    console.warn('Customer phone missing, skipping WhatsApp delivery');
    return { success: false, error: 'Missing customer phone' };
  }

  const safeName = (customerName || 'Creator').trim();
  const safeTitle = (productTitle || 'Digital Product').trim();
  const safeDriveUrl = (driveUrl || 'https://bazara.in').trim();

  const components = [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: safeName },
        { type: 'text', text: safeTitle },
        { type: 'text', text: safeDriveUrl }
      ]
    }
  ];

  return sendMetaTemplateMessage({
    to: customerPhone,
    templateName: 'bazara_order_delivery',
    components
  });
}

/**
 * Send login / verification OTP via WhatsApp
 */
export async function sendWhatsAppOtp({ customerPhone, otpCode }) {
  if (!customerPhone || !otpCode) {
    return { success: false, error: 'Missing phone or OTP code' };
  }

  const cleanOtp = otpCode.toString().trim();

  const components = [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: cleanOtp }
      ]
    },
    {
      type: 'button',
      sub_type: 'url',
      index: '0',
      parameters: [
        { type: 'text', text: cleanOtp }
      ]
    }
  ];

  return sendMetaTemplateMessage({
    to: customerPhone,
    templateName: 'bazara_otp',
    components
  });
}
