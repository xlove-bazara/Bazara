// Vercel Serverless Function: Secure Server-to-Server Brevo Email Dispatcher
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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
      customerEmail, 
      customerName, 
      productTitle, 
      driveUrl, 
      upsellIncluded, 
      upsellTitle, 
      upsellDriveUrl, 
      orderId, 
      amount 
    } = req.body || {};

    if (!customerEmail || !driveUrl) {
      return res.status(400).json({ error: 'customerEmail and driveUrl are required' });
    }

    const brevoApiKey = process.env.BREVO_API_KEY || process.env.VITE_BREVO_API_KEY;
    const senderEmail = process.env.EMAIL_SENDER || process.env.VITE_EMAIL_SENDER || 'supporthubindia@gmail.com';

    if (!brevoApiKey) {
      console.warn('BREVO_API_KEY environment variable is missing on server');
      return res.status(500).json({ error: 'Server configuration error: BREVO_API_KEY is missing' });
    }

    const bumpSectionHtml = upsellIncluded && (upsellDriveUrl || driveUrl) ? `
      <!-- Add-on Bump Offer Section -->
      <tr>
        <td style="padding: 0 30px 25px 30px;">
          <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.05) 100%); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 16px; padding: 20px; text-align: center;">
            <div style="display: inline-block; padding: 4px 12px; background: rgba(245, 158, 11, 0.2); border-radius: 50px; font-size: 11px; font-weight: 800; color: #fbbf24; margin-bottom: 10px;">
              ⚡ SPECIAL ADD-ON UNLOCKED
            </div>
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #ffffff; font-weight: 800;">
              ${upsellTitle || '15,000+ AI Prompts Vault (ChatGPT, Gemini, Claude & More)'}
            </h3>
            <p style="margin: 0 0 16px 0; font-size: 12px; color: #fde68a; line-height: 1.5;">
              Lifetime access to 15,000+ master prompts and growth templates.
            </p>
            <a href="${upsellDriveUrl || driveUrl}" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); color: #451a03; text-decoration: none; padding: 14px 20px; border-radius: 12px; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);">
              ⚡ OPEN 15,000+ PROMPTS VAULT (GOOGLE DRIVE) →
            </a>
            <p style="margin: 10px 0 0 0; font-size: 11px; color: #94a3b8;">
              Direct Link: <a href="${upsellDriveUrl || driveUrl}" style="color: #fbbf24; word-break: break-all; text-decoration: none;">${upsellDriveUrl || driveUrl}</a>
            </p>
          </div>
        </td>
      </tr>
    ` : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your bazara.in Digital Order</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #08090E; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #08090E; padding: 30px 15px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #121626; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 30px 30px 20px 30px; text-align: center; background: linear-gradient(180deg, #182035 0%, #121626 100%);">
                    <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                      bazara<span style="color: #10b981;">.in</span>
                    </h1>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">
                      Official Order Confirmation & Digital Vault Access
                    </p>
                  </td>
                </tr>

                <!-- Success Banner -->
                <tr>
                  <td style="padding: 20px 30px; text-align: center;">
                    <div style="display: inline-block; padding: 6px 16px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 50px; font-size: 12px; font-weight: 800; color: #34d399;">
                      ✓ PAYMENT CONFIRMED & ACCESS UNLOCKED
                    </div>
                    <h2 style="margin: 15px 0 8px 0; font-size: 20px; color: #ffffff; font-weight: 800;">
                      Thank you, ${customerName || 'Creator'}! 🎉
                    </h2>
                    <p style="margin: 0; font-size: 14px; color: #cbd5e1; line-height: 1.6;">
                      Your enrollment in <strong>${productTitle || 'Digital Product'}</strong> ${upsellIncluded ? `and <strong>${upsellTitle || 'Add-on Vault'}</strong>` : ''} is complete. Your Google Drive digital vault is ready for instant lifetime access.
                    </p>
                  </td>
                </tr>

                <!-- Order Summary Card -->
                <tr>
                  <td style="padding: 0 30px 20px 30px;">
                    <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #090c14; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); font-size: 13px;">
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Main Bundle:</td>
                        <td align="right" style="color: #ffffff; font-weight: 700;">${productTitle}</td>
                      </tr>
                      ${upsellIncluded ? `
                      <tr>
                        <td style="color: #64748b; font-weight: 600; border-top: 1px solid rgba(255,255,255,0.05);">Special Add-on:</td>
                        <td align="right" style="color: #fbbf24; font-weight: 700; border-top: 1px solid rgba(255,255,255,0.05);">${upsellTitle || '15,000+ AI Prompts Vault'}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="color: #64748b; font-weight: 600; border-top: 1px solid rgba(255,255,255,0.05);">Order ID:</td>
                        <td align="right" style="color: #10b981; font-family: monospace; font-weight: 700; border-top: 1px solid rgba(255,255,255,0.05);">${orderId || 'ORD-COMPLETED'}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600; border-top: 1px solid rgba(255,255,255,0.05);">Amount Paid:</td>
                        <td align="right" style="color: #ffffff; font-weight: 800; border-top: 1px solid rgba(255,255,255,0.05);">₹${amount || 1}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600; border-top: 1px solid rgba(255,255,255,0.05);">License:</td>
                        <td align="right" style="color: #38bdf8; font-weight: 700; border-top: 1px solid rgba(255,255,255,0.05);">Lifetime Google Drive Access</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Primary CTA Button (Main Product) -->
                <tr>
                  <td style="padding: 10px 30px 25px 30px; text-align: center;">
                    <a href="${driveUrl}" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background: linear-gradient(90deg, #10b981 0%, #059669 100%); color: #022c22; text-decoration: none; padding: 16px 24px; border-radius: 14px; font-size: 15px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);">
                      📁 OPEN 4-IN-1 E-BOOKS (GOOGLE DRIVE) →
                    </a>
                    <p style="margin: 12px 0 0 0; font-size: 11px; color: #94a3b8;">
                      Direct Link: <a href="${driveUrl}" style="color: #34d399; word-break: break-all; text-decoration: none;">${driveUrl}</a>
                    </p>
                  </td>
                </tr>

                ${bumpSectionHtml}

                <!-- Instructions Strip -->
                <tr>
                  <td style="padding: 20px 30px; background-color: #0a0d16; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #94a3b8; line-height: 1.6;">
                    <strong style="color: #ffffff; display: block; margin-bottom: 6px;">💡 How to use your digital vault:</strong>
                    1. Bookmark the Google Drive link so you never lose it.<br>
                    2. You can download all 4 PDF E-Books & prompts directly to your smartphone or laptop.<br>
                    3. Access this and all future purchases on your profile dashboard at <a href="https://bazara.in" style="color: #10b981; text-decoration: none;">bazara.in</a>.<br>
                    4. Need support? Reply directly to this email.
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 30px; text-align: center; font-size: 11px; color: #64748b;">
                    © 2026 bazara.in • All Rights Reserved.<br>
                    India's Premier Digital Learning & Creator Marketplace.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'bazara.in',
          email: senderEmail
        },
        to: [
          {
            email: customerEmail,
            name: customerName || 'Learner'
          }
        ],
        subject: `🎉 Access Unlocked! ${productTitle || 'Digital Order'} (Google Drive Link) - bazara.in`,
        htmlContent: htmlContent
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Server error in send-delivery API:', error);
    return res.status(500).json({ error: error.message });
  }
}
