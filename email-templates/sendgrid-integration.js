/**
 * SendGrid Email Integration
 * For use with Firebase Cloud Functions or Node.js backend
 */

// Install: npm install @sendgrid/mail
const sgMail = require('@sendgrid/mail');

// Set API key from environment
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send checkout confirmation email
 */
async function sendCheckoutConfirmation(customerData) {
  const msg = {
    to: customerData.email,
    from: {
      email: 'support@gideoncode.com',
      name: 'Gideon Codeworks'
    },
    subject: 'Order Confirmed - Welcome to Gideon Codeworks! 🎉',
    html: generateCheckoutEmail(customerData),
    categories: ['checkout-confirmation'],
    customArgs: {
      orderId: customerData.orderId,
      planType: customerData.planName
    }
  };

  try {
    await sgMail.send(msg);
    console.log('Checkout email sent to:', customerData.email);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Send client portal access email
 */
async function sendPortalAccessEmail(customerData) {
  const msg = {
    to: customerData.email,
    from: {
      email: 'support@gideoncode.com',
      name: 'Gideon Codeworks'
    },
    subject: 'Access Your Client Portal - Gideon Codeworks',
    html: generatePortalEmail(customerData),
    categories: ['portal-access']
  };

  try {
    await sgMail.send(msg);
    console.log('Portal email sent to:', customerData.email);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Send onboarding confirmation email
 */
async function sendOnboardingConfirmation(customerData) {
  const msg = {
    to: customerData.email,
    from: {
      email: 'support@gideoncode.com',
      name: 'Gideon Codeworks'
    },
    subject: 'Questionnaire Received - We\'re On It!',
    html: generateOnboardingEmail(customerData),
    categories: ['onboarding-confirmation']
  };

  try {
    await sgMail.send(msg);
    console.log('Onboarding email sent to:', customerData.email);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Generate checkout confirmation HTML
 * (In production, use the checkout-confirmation.html template)
 */
function generateCheckoutEmail(data) {
  // Read from checkout-confirmation.html and replace {{variables}}
  const template = require('fs').readFileSync('./checkout-confirmation.html', 'utf8');

  return template
    .replace(/{{firstName}}/g, data.firstName)
    .replace(/{{orderNumber}}/g, data.orderNumber)
    .replace(/{{planName}}/g, data.planName)
    .replace(/{{depositAmount}}/g, data.depositAmount)
    .replace(/{{orderDate}}/g, new Date().toLocaleDateString())
    .replace(/{{portalUrl}}/g, data.portalUrl);
}

/**
 * Generate portal access email
 */
function generatePortalEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 1px solid rgba(0,255,255,0.2); border-radius: 8px; padding: 40px;">
        <h1 style="color: #00ffff;">🎯 Your Client Portal is Ready!</h1>
        <p>Hi ${data.firstName},</p>
        <p>Your client portal is now active. Click below to access it:</p>
        <a href="${data.portalUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #00ffff, #00cccc); color: #000; text-decoration: none; font-weight: bold; border-radius: 6px; margin: 20px 0;">
          Access Portal →
        </a>
        <p>Complete the questionnaire so we can get started on your project!</p>
        <hr style="border: 1px solid rgba(0,255,255,0.2); margin: 32px 0;">
        <p style="color: #a0a0a0; font-size: 14px;">
          Questions? Reply to this email or call 1-216-463-2648
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate onboarding confirmation email
 */
function generateOnboardingEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 1px solid rgba(0,255,255,0.2); border-radius: 8px; padding: 40px;">
        <h1 style="color: #00ffff;">✅ Questionnaire Received!</h1>
        <p>Hi ${data.firstName},</p>
        <p>Thanks for completing your project questionnaire! Our team is reviewing your responses and will be in touch within 24-48 hours to schedule your kickoff call.</p>
        <div style="background: rgba(0,255,255,0.05); border: 1px solid rgba(0,255,255,0.2); border-radius: 6px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #00ffff; margin-top: 0;">What's Next:</h3>
          <ul style="color: #d0d0d0; line-height: 1.8;">
            <li>Our team reviews your requirements</li>
            <li>We'll assign your project team</li>
            <li>You'll receive a call to schedule kickoff</li>
            <li>We'll start building your project!</li>
          </ul>
        </div>
        <p>We're excited to work with you!</p>
        <p style="margin-top: 32px;">
          <strong>The Gideon Codeworks Team</strong><br>
          <a href="tel:+12164632648" style="color: #00ffff;">1-216-463-2648</a> |
          <a href="mailto:support@gideoncode.com" style="color: #00ffff;">support@gideoncode.com</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

// ===========================================
// FIREBASE CLOUD FUNCTIONS INTEGRATION
// ===========================================

/**
 * Firebase Cloud Function to send checkout email
 * Deploy: firebase deploy --only functions:sendCheckoutEmail
 */
exports.sendCheckoutEmail = functions.https.onCall(async (data, context) => {
  // Validate authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  // Send email
  return await sendCheckoutConfirmation({
    email: data.email,
    firstName: data.firstName,
    orderNumber: data.orderNumber,
    planName: data.planName,
    depositAmount: data.depositAmount,
    portalUrl: data.portalUrl
  });
});

/**
 * Firebase Cloud Function triggered on Stripe webhook
 * Deploy: firebase deploy --only functions:onStripeCheckout
 */
exports.onStripeCheckout = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = functions.config().stripe.webhook_secret;

  let event;

  try {
    // Verify Stripe webhook signature
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Extract customer data
    const customerData = {
      email: session.customer_details.email,
      firstName: session.customer_details.name.split(' ')[0],
      orderNumber: `GCW-${Date.now()}`,
      planName: session.metadata.planName,
      depositAmount: (session.amount_total / 100).toFixed(2),
      portalUrl: `https://gideoncode.com/client-portal.html?id=${session.client_reference_id}`
    };

    // Send confirmation email
    await sendCheckoutConfirmation(customerData);

    // Auto-add to CRM (separate function)
    await addClientToCRM(customerData);
  }

  res.json({ received: true });
});

/**
 * Add client to CRM automatically
 */
async function addClientToCRM(customerData) {
  const admin = require('firebase-admin');

  await admin.firestore().collection('clients').add({
    email: customerData.email,
    firstName: customerData.firstName,
    planName: customerData.planName,
    depositAmount: customerData.depositAmount,
    status: 'onboarding',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    source: 'website-checkout'
  });

  console.log('Client added to CRM:', customerData.email);
}

// ===========================================
// EXPORTS
// ===========================================

module.exports = {
  sendCheckoutConfirmation,
  sendPortalAccessEmail,
  sendOnboardingConfirmation
};
