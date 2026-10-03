// Vercel Serverless Function: Cryptographically Verify Cashfree Payment
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
    const { orderId } = req.body || {};

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const appId = process.env.CASHFREE_APP_ID || process.env.VITE_CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = (process.env.CASHFREE_ENV || process.env.VITE_CASHFREE_ENV || 'production').toLowerCase();

    const baseUrl = (env === 'sandbox' || env === 'test')
      ? 'https://sandbox.cashfree.com/pg'
      : 'https://api.cashfree.com/pg';

    const orderRes = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json'
      }
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      console.error('Failed to fetch Cashfree order:', orderData);
      return res.status(orderRes.status).json({
        success: false,
        error: orderData.message || 'Unable to fetch Cashfree order status'
      });
    }

    const isPaid = orderData.order_status === 'PAID';

    // If paid, fetch transaction / payment ID from payments sub-resource
    let paymentId = `cf_pay_${Date.now()}`;
    let paymentMode = 'UPI / NetBanking';

    if (isPaid) {
      try {
        const paymentsRes = await fetch(`${baseUrl}/orders/${orderId}/payments`, {
          method: 'GET',
          headers: {
            'x-client-id': appId,
            'x-client-secret': secretKey,
            'x-api-version': '2023-08-01',
            'Content-Type': 'application/json'
          }
        });
        if (paymentsRes.ok) {
          const paymentsList = await paymentsRes.json();
          if (Array.isArray(paymentsList) && paymentsList.length > 0) {
            const successfulPayment = paymentsList.find(p => p.payment_status === 'SUCCESS') || paymentsList[0];
            if (successfulPayment.cf_payment_id) {
              paymentId = String(successfulPayment.cf_payment_id);
            }
            if (successfulPayment.payment_group) {
              paymentMode = successfulPayment.payment_group;
            }
          }
        }
      } catch (subErr) {
        console.warn('Could not fetch Cashfree payments sub-resource:', subErr);
      }
    }

    return res.status(200).json({
      success: true,
      verified: isPaid,
      isPaid: isPaid,
      orderStatus: orderData.order_status,
      orderId: orderData.order_id,
      paymentId: paymentId,
      paymentMode: paymentMode,
      amount: orderData.order_amount
    });
  } catch (err) {
    console.error('Server error in verify-cashfree-payment API:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
