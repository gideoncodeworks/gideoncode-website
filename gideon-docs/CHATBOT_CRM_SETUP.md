# Claude Code Instructions for Gideon Codeworks

## Connecting Client Chatbots to Gideon Dashboard

When you add a chatbot to a client website, it needs to send lead data to the Gideon Dashboard so the client can see their leads in their portal.

### How It Works

Single endpoint for all clients:
```
POST https://dashboard.gideoncode.com/api/public/[domain]/leads
```

The webhook automatically:
- Looks up the client by domain
- Creates lead under that client's account
- Client sees it in their portal

### New Client Setup (3 Steps)

1. **Copy the chatbot code** with lead extraction + webhook call (see below)
2. **Set env vars on Vercel**:
   - `GIDEON_WEBHOOK_URL=https://dashboard.gideoncode.com`
   - `SITE_DOMAIN=clients-domain.vercel.app`
3. **Update client record** in Gideon Dashboard with matching domain

That's it. No new endpoints needed.

---

### 1. Environment Variables

Add these to the client's `.env.local`:

```
GIDEON_WEBHOOK_URL=https://dashboard.gideoncode.com
SITE_DOMAIN=their-domain.vercel.app
```

Also add them to Vercel:
```bash
vercel env add GIDEON_WEBHOOK_URL production <<< "https://dashboard.gideoncode.com"
vercel env add SITE_DOMAIN production <<< "their-domain.vercel.app"
```

### 2. Chat API Route Integration

In the chat API route (e.g., `/app/api/chat/route.ts`), add this code:

```typescript
// At the top of the file
const GIDEON_WEBHOOK_URL = process.env.GIDEON_WEBHOOK_URL || 'https://dashboard.gideoncode.com';
const SITE_DOMAIN = process.env.SITE_DOMAIN || '';

// Function to extract lead info from conversation
function extractLeadData(messages: { role: string; content: string }[]) {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content).join(' ');
  const data: Record<string, string> = {};

  // Phone
  const phone = userMessages.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phone) data.visitorPhone = phone[0];

  // Email
  const email = userMessages.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (email) data.visitorEmail = email[0];

  // Name patterns
  const namePatterns = [
    /my name is ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
    /i'm ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
    /this is ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
    /call me ([A-Z][a-z]+)/i,
  ];
  for (const pattern of namePatterns) {
    const match = userMessages.match(pattern);
    if (match) { data.visitorName = match[1]; break; }
  }

  // Urgency detection
  if (/asap|emergency|urgent|right away|immediately|today/i.test(userMessages)) {
    data.urgency = 'asap';
  } else if (/this week|few days|soon/i.test(userMessages)) {
    data.urgency = 'this_week';
  } else if (/this month|couple weeks|no rush/i.test(userMessages)) {
    data.urgency = 'this_month';
  }

  // Job type detection (customize per client)
  const jobTypes = ['repair', 'installation', 'consultation', 'quote', 'service'];
  for (const job of jobTypes) {
    if (userMessages.toLowerCase().includes(job)) {
      data.jobType = job.charAt(0).toUpperCase() + job.slice(1);
      break;
    }
  }

  return data;
}

// Fire-and-forget function to send leads
async function sendLeadToGideon(messages: { role: string; content: string }[], visitorId: string) {
  try {
    if (!SITE_DOMAIN) return;
    const leadData = extractLeadData(messages);
    if (Object.keys(leadData).length === 0 && messages.length < 3) return;

    await fetch(`${GIDEON_WEBHOOK_URL}/api/public/${SITE_DOMAIN}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId, ...leadData, messages }),
    });
  } catch (e) {
    console.error('Lead webhook failed:', e);
  }
}

// In your POST handler, call it (non-blocking):
// sendLeadToGideon(messages, visitorId);
```

### 3. Visitor ID Tracking

The chat widget/page needs to track visitors with a persistent visitorId:

```typescript
const [visitorId] = useState(() => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('CLIENTNAME_visitor_id');
    if (stored) return stored;
    const newId = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('CLIENTNAME_visitor_id', newId);
    return newId;
  }
  return `visitor-${Date.now()}`;
});
```

Then include `visitorId` in the fetch body when calling the chat API:

```typescript
body: JSON.stringify({
  visitorId,
  messages: [...messages, userMessage].map((m) => ({
    role: m.role,
    content: m.content,
  })),
}),
```

### 4. Important Notes

- The `SITE_DOMAIN` must match exactly what's set in the client's record in Gideon Dashboard
- Leads POST to: `https://dashboard.gideoncode.com/api/public/{SITE_DOMAIN}/leads`
- The webhook is fire-and-forget - errors don't affect the chat
- Customize job types per client's industry

### 5. Example Client Sites with Chatbots

- **KS Masonry**: `ks-masonry-new.vercel.app` - Masonry contractor in Cleveland
  - Job types: tuckpointing, chimney, porch, brick, masonry, concrete, stone, repair, wall

---

## Gideon Codeworks Pricing (for AI Chatbot Knowledge)

Keep the AI gateway (`netlify/functions/ai-gateway.js`) updated with current pricing:

### Entry-Level
- Landing Page: $199 setup + $49.99/mo
- Website Care Plan: $99/mo

### Website-as-a-Service (WaaS)
- Starter: $497 setup + $250/mo (12-month) or $212.50/mo (24-month)
- Growth: $697 setup + $297/mo (12-month) or $252.50/mo (24-month)
- Domination: $997 setup + $349/mo (12-month) or $299/mo (24-month)

### One-Time Builds
- Starter: $2,497
- Growth: $3,497
- Domination: $4,997

### SEO Packages
- SEO Basic: $297/mo
- SEO Pro: $597/mo
- SEO Advanced: $997/mo

### CRM Platform
- Demo: platform.gideoncode.com
- Custom pricing for purchase or rental
