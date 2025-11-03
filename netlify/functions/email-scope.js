// Email Scope - Send project scope documents via SendGrid
const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    if (!SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }

    const { email, scopeHtml, timestamp } = JSON.parse(event.body);

    if (!email || !scopeHtml) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing email or scope data' })
      };
    }

    // Send email to customer
    const customerEmail = {
      to: email,
      from: 'info@gideoncode.com',
      subject: '📋 Your Gideon Code Project Scope',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #1a1a1a;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 32px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 32px;
              padding-bottom: 24px;
              border-bottom: 2px solid #00ffff;
            }
            .header h1 {
              color: #00ffff;
              margin: 0 0 8px 0;
              font-size: 28px;
            }
            .scope-content {
              margin: 24px 0;
              padding: 20px;
              background: #f9f9f9;
              border-left: 4px solid #00ffff;
              border-radius: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 32px;
              padding-top: 24px;
              border-top: 1px solid #e0e0e0;
              color: #666;
              font-size: 14px;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #00ffff, #ff00ff);
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 8px;
              margin: 16px 0;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Your Project Scope</h1>
              <p>AI-powered blueprint from Gideon Code Works</p>
            </div>

            <p>Here's the project scope you generated with our AI Scope Visualizer:</p>

            <div class="scope-content">
              ${scopeHtml}
            </div>

            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Review the mission, metrics, and phases</li>
              <li>Consider the risks and recommendations</li>
              <li>Ready to move forward? Let's talk strategy</li>
            </ol>

            <center>
              <a href="https://gideoncode.com/contact.html" class="cta-button">Schedule a Strategy Call</a>
            </center>

            <div class="footer">
              <p><strong>Gideon Code Works</strong><br>
              Digital products that drive revenue<br>
              <a href="https://gideoncode.com">gideoncode.com</a> | <a href="tel:+12164632648">1-216-463-2648</a></p>

              <p style="font-size: 12px; color: #999;">
                This scope was generated on ${new Date(timestamp).toLocaleString()}<br>
                🤖 Powered by Gideon Code AI (Claude + GPT-4)
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await sgMail.send(customerEmail);
    console.log(`✓ Scope emailed to ${email}`);

    // Also notify the team
    const teamEmail = {
      to: 'info@gideoncode.com',
      from: 'info@gideoncode.com',
      subject: `🎯 New Scope Generated: ${email}`,
      html: `
        <h2>New Scope Visualizer Submission</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>

        <h3>Generated Scope:</h3>
        <div style="border-left: 4px solid #00ffff; padding-left: 16px;">
          ${scopeHtml}
        </div>

        <p><a href="mailto:${email}">Reply to prospect</a></p>
      `
    };

    await sgMail.send(teamEmail);
    console.log('✓ Team notified');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Scope emailed successfully' })
    };

  } catch (error) {
    console.error('Email scope error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to send scope email',
        message: error.message
      })
    };
  }
};
