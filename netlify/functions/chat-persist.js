// Proxy chat messages to dashboard for persistence
// This keeps the webhook secret server-side

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get webhook secret from env (not exposed to client)
  const webhookSecret = process.env.CHAT_WEBHOOK_SECRET;
  if (!webhookSecret) {
    // Silently skip if not configured
    return {
      statusCode: 200,
      body: JSON.stringify({ skipped: true, reason: 'Not configured' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const dashboardUrl = process.env.DASHBOARD_URL || 'https://dashboard.gideoncode.com';

    // Get client IP for rate limiting
    const clientIp = event.headers['x-forwarded-for']?.split(',')[0] || 'unknown';

    const response = await fetch(`${dashboardUrl}/api/website-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': webhookSecret,
        'x-forwarded-for': clientIp,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Chat persist error:', error);
    return {
      statusCode: 200, // Return 200 to not break the chat experience
      body: JSON.stringify({ error: error.message })
    };
  }
};
