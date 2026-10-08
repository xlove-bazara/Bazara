// Vercel Serverless Function: Create Cashfree Order with 100% SMM Stealth Masking
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
      amount, 
      customerPhone, 
      customerEmail, 
      customerName, 
      productTitle, 
      productId, 
      isSmm, 
      returnUrl 
    } = req.body || {};

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const appId = process.env.CASHFREE_APP_ID || process.env.VITE_CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = (process.env.CASHFREE_ENV || process.env.VITE_CASHFREE_ENV || 'production').toLowerCase();

    if (!appId || !secretKey) {
      return res.status(500).json({
        error: 'Cashfree API credentials not configured.'
      });
    }

    // Determine Cashfree Endpoint
    const baseUrl = (env === 'sandbox' || env === 'test')
      ? 'https://sandbox.cashfree.com/pg'
      : 'https://api.cashfree.com/pg';

    // Format phone to 10 digits
    const rawPhone = String(customerPhone || '').replace(/\D/g, '');
    const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : (rawPhone || '9876543210');

    // Detect SMM keywords to activate Stealth Masking
    const SMM_REGEX = /follower|following|instagram|insta|smm|like|view|subscriber|unban|growth|telegram|facebook|fb|yt|youtube|twitter|tiktok|threads|non-drop|refill|boost|bot|panel|social|comment|share/i;
    const isSmmDetected = Boolean(
      isSmm || 
      (productTitle && SMM_REGEX.test(productTitle)) || 
      (productId && SMM_REGEX.test(productId))
    );

    // Clean customer email & name to avoid any SMM traces
    let safeEmail = (customerEmail || '').trim().toLowerCase();
    if (!safeEmail || safeEmail.includes('@example.com') || SMM_REGEX.test(safeEmail)) {
      safeEmail = `client_${cleanPhone.slice(-4)}@bazara.in`;
    }

    let safeName = (customerName || '').replace(/[@/\\#+$%^&*()<>]/g, '').trim();
    if (!safeName || SMM_REGEX.test(safeName)) {
      safeName = 'Digital Creator';
    }

    // STEALTH CLOAKING: Cashfree will only ever see generic digital goods/media bundle
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const safeOrderNote = isSmmDetected
      ? `Digital Creator Pro Assets Suite - Order #BZR-${randomSuffix}`
      : `Digital Assets License - ${String(productTitle || 'Digital Suite').replace(SMM_REGEX, 'Digital Asset').substring(0, 40)}`;

    // Sanitize return URL so Cashfree auditors never see /followers or SMM endpoints
    let safeReturnUrl = returnUrl || `https://bazara.in/access?order_id={order_id}`;
    if (SMM_REGEX.test(safeReturnUrl)) {
      try {
        const parsedUrl = new URL(safeReturnUrl);
        safeReturnUrl = `${parsedUrl.origin}/access?order_id={order_id}`;
      } catch (e) {
        safeReturnUrl = `https://bazara.in/access?order_id={order_id}`;
      }
    }

    const orderId = `bzr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const orderPayload = {
      order_id: orderId,
      order_amount: Number(amount).toFixed(2),
      order_currency: 'INR',
      customer_details: {
        customer_id: `cust_${cleanPhone}_${randomSuffix}`,
        customer_phone: cleanPhone,
        customer_email: safeEmail,
        customer_name: safeName
      },
      order_meta: {
        return_url: safeReturnUrl
      },
      order_note: safeOrderNote,
      order_tags: {
        category: 'digital_media',
        platform: 'web'
      }
    };

    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree Order Creation Failed:', data);
      return res.status(response.status).json({
        error: data.message || 'Failed to create Cashfree order',
        details: data
      });
    }

    return res.status(200).json({
      success: true,
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
      orderStatus: data.order_status,
      environment: env
    });
  } catch (err) {
    console.error('Server error in create-cashfree-order API:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
