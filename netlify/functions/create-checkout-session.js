const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { customerData } = JSON.parse(event.body);

    // Validate required fields
    if (!customerData || !customerData.email || !customerData.firstName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required customer information' })
      };
    }

    if (!customerData.depositAmount || !customerData.planName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing plan information' })
      };
    }

    // Generate unique client reference ID
    const clientReferenceId = `web_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Determine URLs based on environment
    const baseUrl = process.env.URL || 'https://gideoncode.com';
    const successUrl = `${baseUrl}/checkout-success.html?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/checkout.html?plan=${customerData.selectedPlan}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerData.email,
      client_reference_id: clientReferenceId,
      metadata: {
        firstName: customerData.firstName,
        lastName: customerData.lastName || '',
        phone: customerData.phone || '',
        company: customerData.company || '',
        website: customerData.website || '',
        projectDetails: customerData.projectDetails || '',
        planName: customerData.planName,
        selectedPlan: customerData.selectedPlan,
        source: 'website',
        totalPrice: customerData.totalPrice?.toString() || '',
        monthlyPrice: customerData.monthlyPrice?.toString() || ''
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${customerData.planName} - 50% Deposit`,
              description: `Initial deposit for ${customerData.planName}. Remaining balance due upon project completion.`,
              images: ['https://gideoncode.com/images/gcw-logo.png'],
            },
            unit_amount: Math.round(parseFloat(customerData.depositAmount) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          planName: customerData.planName,
          clientName: `${customerData.firstName} ${customerData.lastName || ''}`.trim(),
          source: 'website'
        },
      },
    });

    console.log('Checkout session created:', {
      sessionId: session.id,
      email: customerData.email,
      plan: customerData.planName,
      amount: customerData.depositAmount
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
      })
    };

  } catch (error) {
    console.error('Error creating checkout session:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        message: error.message || 'Unknown error occurred',
      })
    };
  }
};
