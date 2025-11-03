const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` })
    };
  }

  // Handle the event
  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripeEvent.data.object);
        break;

      case 'payment_intent.succeeded':
        console.log('PaymentIntent succeeded:', stripeEvent.data.object.id);
        break;

      case 'payment_intent.payment_failed':
        console.log('PaymentIntent failed:', stripeEvent.data.object.id);
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook processing failed' })
    };
  }
};

async function handleCheckoutCompleted(session) {
  console.log('Checkout completed:', session.id);

  const metadata = session.metadata || {};
  const customerEmail = session.customer_email || session.customer_details?.email;
  const amountPaid = (session.amount_total / 100).toFixed(2);

  const {
    firstName,
    lastName,
    phone,
    company,
    website,
    projectDetails,
    planName,
    selectedPlan,
    totalPrice,
    monthlyPrice
  } = metadata;

  // Send confirmation email to customer
  if (process.env.SENDGRID_API_KEY && customerEmail) {
    try {
      const confirmationEmail = {
        to: customerEmail,
        from: process.env.SENDGRID_FROM_EMAIL || 'support@gideoncode.com',
        subject: '🎉 Order Confirmed - Welcome to Gideon Code Works!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);">
            <div style="max-width: 600px; margin: 0 auto; background-color: #000000; border: 1px solid rgba(0, 255, 255, 0.2);">

              <!-- Header -->
              <div style="background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #000000; margin: 0; font-size: 32px; font-weight: 800;">Order Confirmed!</h1>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px; color: #ffffff;">
                <p style="font-size: 18px; line-height: 1.6; margin-bottom: 24px;">
                  Hey ${firstName}! 👋
                </p>

                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #e0e0e0;">
                  Your deposit payment has been received! We're excited to start building your digital presence.
                </p>

                <!-- Order Details Box -->
                <div style="background-color: #0a0a0a; border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h2 style="color: #00ffff; margin: 0 0 16px 0; font-size: 20px;">Order Details</h2>

                  <table style="width: 100%; color: #e0e0e0; font-size: 14px;">
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);"><strong>Plan:</strong></td>
                      <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: right;">${planName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);"><strong>Deposit Paid:</strong></td>
                      <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: right; color: #00ff88;">$${amountPaid}</td>
                    </tr>
                    ${totalPrice ? `
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);"><strong>Total Project Cost:</strong></td>
                      <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: right;">$${totalPrice}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Remaining Balance:</strong></td>
                      <td style="padding: 8px 0; text-align: right;">$${(parseFloat(totalPrice) - parseFloat(amountPaid)).toFixed(2)}</td>
                    </tr>
                    ` : ''}
                  </table>
                </div>

                <h3 style="color: #00ffff; font-size: 20px; margin: 32px 0 16px 0;">What Happens Next?</h3>

                <div style="background-color: #0a0a0a; border-left: 4px solid #00ffff; padding: 16px; margin: 16px 0;">
                  <p style="margin: 0 0 12px 0; color: #e0e0e0; font-size: 14px;">
                    ✅ <strong>Step 1:</strong> Our team will reach out within 2 hours to schedule your kickoff call
                  </p>
                  <p style="margin: 0 0 12px 0; color: #e0e0e0; font-size: 14px;">
                    ✅ <strong>Step 2:</strong> We'll gather your brand assets and project requirements
                  </p>
                  <p style="margin: 0; color: #e0e0e0; font-size: 14px;">
                    ✅ <strong>Step 3:</strong> Development begins! We'll keep you updated throughout
                  </p>
                </div>

                <p style="font-size: 16px; line-height: 1.6; margin-top: 32px; color: #e0e0e0;">
                  Have questions? Reply to this email or call us at <strong style="color: #00ffff;">1-216-463-2648</strong>
                </p>

                <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
                  <p style="color: #888; font-size: 14px; margin: 0;">
                    Gideon Code Works<br>
                    Building Digital Excellence
                  </p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      };

      await sgMail.send(confirmationEmail);
      console.log('Confirmation email sent to:', customerEmail);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }
  }

  // Send notification email to team
  if (process.env.SENDGRID_API_KEY && process.env.NOTIFICATION_EMAIL) {
    try {
      const notificationEmail = {
        to: process.env.NOTIFICATION_EMAIL,
        from: process.env.SENDGRID_FROM_EMAIL || 'support@gideoncode.com',
        subject: `🔔 New Order: ${firstName} ${lastName} - ${planName}`,
        html: `
          <h2>New Website Checkout</h2>
          <p><strong>Customer:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Website:</strong> ${website || 'Not provided'}</p>
          <hr>
          <p><strong>Plan:</strong> ${planName}</p>
          <p><strong>Deposit Paid:</strong> $${amountPaid}</p>
          ${totalPrice ? `<p><strong>Total Project:</strong> $${totalPrice}</p>` : ''}
          ${monthlyPrice ? `<p><strong>Monthly:</strong> $${monthlyPrice}/mo</p>` : ''}
          <hr>
          <p><strong>Project Details:</strong></p>
          <p>${projectDetails || 'No details provided'}</p>
          <hr>
          <p><strong>Stripe Session ID:</strong> ${session.id}</p>
          <p><strong>Action Required:</strong> Contact customer within 2 hours!</p>
        `
      };

      await sgMail.send(notificationEmail);
      console.log('Notification email sent to team');
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }
  }
}
