// Resilient Brevo Transactional Email Service for Automated Order Confirmations
export async function sendOrderDeliveryEmail({
  customerEmail,
  customerName,
  productTitle,
  driveUrl,
  orderId,
  amount
}) {
  if (!customerEmail) {
    console.warn('Customer email missing, skipping delivery email');
    return { success: false, error: 'Missing customer email' };
  }

  // Attempt 1: Try serverless backend endpoint
  try {
    const response = await fetch('/api/send-delivery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerEmail,
        customerName,
        productTitle,
        driveUrl,
        orderId,
        amount
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Automated Delivery Email (Serverless) Success:', data);
      return { success: true, data };
    }
  } catch (err) {
    console.warn('Serverless endpoint not reachable, trying direct fallback...');
  }

  // Attempt 2: Direct Brevo API client fallback (if VITE_BREVO_API_KEY is defined)
  const brevoApiKey = import.meta.env.VITE_BREVO_API_KEY;
  const senderEmail = import.meta.env.VITE_EMAIL_SENDER || 'xlovevipu@gmail.com';

  if (!brevoApiKey) {
    return { success: false, error: 'Brevo API key not configured' };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 0; background-color: #08090E; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e2e8f0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 15px;">
        <tr>
          <td align="center">
            <div style="max-width: 560px; background: #121626; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 26px; color: #fff;">bazara<span style="color: #10b981;">.in</span></h1>
              <div style="margin: 20px 0; padding: 6px 16px; background: rgba(16,185,129,0.15); border-radius: 50px; display: inline-block; font-size: 12px; font-weight: 800; color: #34d399;">
                ✓ PAYMENT CONFIRMED & ACCESS UNLOCKED
              </div>
              <h2 style="margin: 10px 0; color: #fff; font-size: 20px;">Thank you, ${customerName || 'Creator'}! 🎉</h2>
              <p style="color: #cbd5e1; font-size: 14px;">Your order for <strong>${productTitle}</strong> is confirmed.</p>
              
              <div style="margin: 25px 0;">
                <a href="${driveUrl}" target="_blank" style="display: block; background: #10b981; color: #022c22; text-decoration: none; padding: 16px; border-radius: 12px; font-weight: 900; font-size: 15px;">
                  📁 OPEN GOOGLE DRIVE VAULT & DOWNLOAD →
                </a>
              </div>
              <p style="font-size: 11px; color: #64748b;">© 2026 bazara.in • Instant Digital Delivery Engine</p>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'bazara.in', email: senderEmail },
        to: [{ email: customerEmail, name: customerName || 'Learner' }],
        subject: `🎉 Access Unlocked! ${productTitle} (Google Drive Link) - bazara.in`,
        htmlContent: htmlContent
      })
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
