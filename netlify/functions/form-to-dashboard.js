// Forward Netlify form submissions to the Gideon Dashboard
// This creates leads in the CRM for follow-up

exports.handler = async (event, context) => {
  // Only process POST requests from Netlify form submissions
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body);

    // Netlify wraps form data in a 'payload' object for submission-created events
    const formData = payload.data || payload;

    console.log('Form submission received:', formData);

    // Extract form fields (matching get-started.html form)
    const {
      name,
      email,
      phone,
      company,
      website,
      message,
      'project-details': projectDetails,
      'product-interest': productInterest,
    } = formData;

    // Skip if no email (required field)
    if (!email) {
      console.log('Skipping submission - no email provided');
      return {
        statusCode: 200,
        body: JSON.stringify({ skipped: true, reason: 'No email' })
      };
    }

    // Send to dashboard
    const dashboardUrl = process.env.DASHBOARD_URL || 'https://dashboard.gideoncode.com';
    const webhookSecret = process.env.LEADS_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('LEADS_WEBHOOK_SECRET not configured');
      return {
        statusCode: 200,
        body: JSON.stringify({ skipped: true, reason: 'Webhook not configured' })
      };
    }

    const response = await fetch(`${dashboardUrl}/api/leads/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': webhookSecret,
      },
      body: JSON.stringify({
        name: name || 'Website Visitor',
        email,
        phone: phone || null,
        company: company || null,
        website: website || null,
        message: projectDetails || message || null,
        product_interest: productInterest || null,
        source: 'gideoncode.com',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Dashboard webhook failed:', result);
      return {
        statusCode: 200, // Return 200 to avoid Netlify retries
        body: JSON.stringify({ success: false, error: result.error })
      };
    }

    console.log('Lead created in dashboard:', result);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, leadId: result.leadId })
    };

  } catch (error) {
    console.error('Error forwarding form to dashboard:', error);
    return {
      statusCode: 200, // Return 200 to avoid Netlify retries
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
