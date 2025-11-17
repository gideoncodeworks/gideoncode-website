# SendGrid Email Setup - Gideon Codeworks

## Current Status: ✅ Almost Complete

### ✅ Already Configured:
- [x] Branded link domain verified: `em2589.gideoncode.com` → `u56645946.wl197.sendgrid.net`
- [x] DKIM records verified:
  - `s1._domainkey.gideoncode.com`
  - `s2._domainkey.gideoncode.com`
- [x] DMARC record added: `_dmarc.gideoncode.com`

### 🔄 To Complete:

#### 1. SPF Record
Check your current SPF record includes SendGrid:
```
v=spf1 include:_spf.google.com include:sendgrid.net ~all
```

**How to check:**
```bash
nslookup -type=txt gideoncode.com
```

**If SendGrid not included:**
Add `include:sendgrid.net` to your existing SPF record in your DNS settings.

#### 2. Generate API Key
1. Go to SendGrid Dashboard → Settings → API Keys
2. Click "Create API Key"
3. Name: `Gideon-Website-Checkout`
4. Permissions: **Full Access** (or at minimum: Mail Send, Marketing, Template Engine)
5. Copy the key (you won't see it again!)
6. Store in environment variables:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxx
   ```

#### 3. Verify Sender Identity
**Option A: Single Sender (Quick)**
1. SendGrid → Settings → Sender Authentication → Single Sender Verification
2. Verify `support@gideoncode.com`

**Option B: Domain Authentication (Better)**
1. Already done if branded link domain is working
2. Can send from any `@gideoncode.com` address

#### 4. Test Send
```bash
curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "personalizations": [{"to": [{"email": "josh@gideoncode.com"}]}],
    "from": {"email": "support@gideoncode.com", "name": "Gideon Codeworks"},
    "subject": "SendGrid Test",
    "content": [{"type": "text/plain", "value": "Test successful!"}]
  }'
```

---

## Email Workflows Configured

### 1. Checkout Confirmation
- **Trigger:** Successful payment on checkout page
- **From:** `support@gideoncode.com`
- **To:** Customer email
- **Template:** `checkout-confirmation.html`
- **Includes:**
  - Order details
  - Client portal link
  - Next steps
  - Contact information

### 2. Client Portal Access
- **Trigger:** Account creation
- **From:** `support@gideoncode.com`
- **To:** Customer email
- **Template:** `portal-access.html`
- **Includes:**
  - Unique portal URL
  - Login instructions
  - Questionnaire reminder
  - 24-48hr onboarding timeline

### 3. Onboarding Confirmation
- **Trigger:** Questionnaire submission
- **From:** `support@gideoncode.com`
- **To:** Customer email
- **Template:** `onboarding-confirmation.html`
- **Includes:**
  - Confirmation of submission
  - What happens next
  - Team assignment notification
  - Timeline expectations

### 4. Project Kickoff
- **Trigger:** Manual send by admin
- **From:** `josh@gideoncode.com` (personal touch)
- **To:** Customer email
- **Template:** `project-kickoff.html`
- **Includes:**
  - Team introduction
  - Project timeline
  - Communication plan
  - First milestone

---

## API Integration

### Node.js Example:
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendCheckoutEmail = async (customerData) => {
  const msg = {
    to: customerData.email,
    from: 'support@gideoncode.com',
    subject: 'Order Confirmation - Gideon Codeworks',
    templateId: 'd-xxxxxxxxxxxxx', // Get from SendGrid templates
    dynamicTemplateData: {
      firstName: customerData.firstName,
      planName: customerData.planName,
      depositAmount: customerData.depositAmount,
      portalUrl: customerData.portalUrl,
      orderNumber: customerData.orderNumber
    }
  };

  await sgMail.send(msg);
};
```

### Firebase Cloud Function Example:
```javascript
const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendCheckoutEmail = functions.https.onCall(async (data, context) => {
  const msg = {
    to: data.email,
    from: 'support@gideoncode.com',
    subject: 'Welcome to Gideon Codeworks!',
    html: generateEmailHTML(data)
  };

  return await sgMail.send(msg);
});
```

---

## Monitoring & Analytics

### SendGrid Dashboard Metrics:
- **Deliverability Rate:** Target 98%+
- **Open Rate:** Industry avg 20-25%
- **Click Rate:** Industry avg 2-5%
- **Bounce Rate:** Keep under 2%
- **Spam Reports:** Keep under 0.1%

### Email Categories to Track:
- `checkout-confirmation`
- `portal-access`
- `onboarding`
- `project-kickoff`
- `follow-up`

---

## Troubleshooting

### Email Not Sending?
1. Check API key is valid
2. Verify sender email is authenticated
3. Check SendGrid Activity Feed for errors
4. Ensure SPF/DKIM/DMARC are passing

### Going to Spam?
1. Warm up domain (start with low volume)
2. Encourage recipients to whitelist
3. Include unsubscribe link
4. Monitor spam complaint rate

### Links Not Working?
1. Check branded link domain DNS
2. Verify SSL certificate
3. Test links in multiple email clients

---

## Next Steps

1. ✅ Verify SPF includes SendGrid
2. ✅ Generate API key
3. ✅ Test send to josh@gideoncode.com
4. ✅ Create email templates in SendGrid
5. ✅ Set up Firebase Cloud Function for checkout emails
6. ✅ Configure client portal email workflow
7. ✅ Add email categories for tracking
8. ✅ Set up monitoring alerts

---

## Recommended Sender Addresses

- `support@gideoncode.com` - Transactional emails (order confirmations, portal access)
- `josh@gideoncode.com` - Personal outreach (project kickoffs, check-ins)
- `team@gideoncode.com` - Team notifications (project updates, milestones)
- `noreply@gideoncode.com` - System notifications (avoid if possible, use support@ instead)

---

## Email Best Practices

✅ **DO:**
- Use clear, descriptive subject lines
- Include unsubscribe option
- Mobile-responsive HTML
- Plain text fallback
- Clear call-to-action
- Brand consistency

❌ **DON'T:**
- Use all caps in subject
- Send from noreply@
- Include too many links
- Use spam trigger words
- Send without testing

---

## Support

- **SendGrid Docs:** https://docs.sendgrid.com
- **API Reference:** https://docs.sendgrid.com/api-reference
- **Gideon Code Support:** 1-216-463-2648
