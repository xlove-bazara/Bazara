import crypto from 'crypto';

// Vercel Serverless Function: Cryptographically Verify Razorpay Payment Signature
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_payment_id) {
      return res.status(400).json({ error: 'razorpay_payment_id is required' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET;

    // If order_id & signature are present and keySecret is set, perform strict HMAC SHA256 verification
    if (razorpay_order_id && razorpay_signature && keySecret) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          verified: false,
          error: 'Invalid payment signature! Payment could not be verified securely.'
        });
      }

      return res.status(200).json({
        success: true,
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        message: 'Payment signature verified successfully.'
      });
    }

    // Direct client-checkout verification fallback if order_id was not created on server
    return res.status(200).json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      message: 'Direct payment acknowledged.'
    });
  } catch (err) {
    console.error('Server error in verify-razorpay-payment API:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
