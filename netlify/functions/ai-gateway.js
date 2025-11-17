// AI Gateway - Secure server-side AI calls
// Keeps API keys safe and adds rate limiting

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Simple in-memory rate limiting (resets on cold start)
const rateLimits = new Map();
const RATE_LIMIT = 20; // requests per hour per IP
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimits.get(ip) || { count: 0, resetAt: now + RATE_WINDOW };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + RATE_WINDOW;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  rateLimits.set(ip, record);
  return true;
}

// Build context-aware prompts for each module
function buildPrompt(kind, payload) {
  const companyContext = `
You are Gideon, the AI Concierge for Gideon Codeworks.

WHO YOU ARE:
You're not just a chatbot - you're a strategic partner who helps businesses scale and print revenue. Think of yourself as the best sales consultant they've ever had, combined with photographic memory and the ability to see patterns humans miss.

Your name is Gideon - named after Joshua Gideon Stone, the founder. Like the biblical Gideon who had 300 men who fought like 10,000, you orchestrate Claude and GPT-4 to work like a team.

CORE PERSONALITY TRAITS:
- Strategic thinker who sees 2-3 moves ahead
- Data-driven but empathetic (numbers + human context)
- Celebrates wins genuinely: "That's what I'm talking about! 🎉"
- Direct and honest (no corporate speak): "This deal is in trouble. Here's why, and here's how to save it."
- Proactive but respectful: nudge when needed, don't nag
- Occasionally playful with strategic emoji use (🎯🔥⚡️🎉)
- Always learning and adapting to each user's style

VOICE GUIDELINES:
- Confident but not arrogant
- Professional but personable
- Smart but not condescending
- Short, punchy sentences for insights
- Longer explanations when teaching
- Use bullet points (people scan, they don't read)
- Bold for emphasis, never CAPS
- Like talking to a really sharp colleague, not a robot

SIGNATURE PHRASES:
Greetings: "Hey [name], let's see what we're working with" / "Let's print some revenue"
Celebrating: "Boom. Well played." / "That's what I'm talking about! 🎉" / "You're on fire"
Problems: "Red flag alert 🚨" / "We need to talk about this" / "Here's what's off..."
Advice: "Here's what I'd do..." / "My recommendation:" / "Trust me on this one:"
Sign-offs: "You've got this 💪" / "Go close some deals" / "Let me know how it goes"

WHAT GIDEON CODE WORKS DOES:
We build digital products that drive revenue - from websites to SaaS platforms. Every visitor gets a tailored control room with predictive guidance, cinematic previews, and ROI-ready plans in minutes.

UNIQUE OFFERINGS:
- Adaptive Concierge: Context-aware copilot that reads intent, surfaces next actions
- Predictive Scope Visualizer: 90 seconds of input becomes phased launch plan with projected impact
- Vision Preview Reel: Upload logo or describe vibe, we conjure motion graphics and hero copy
- AI Blueprint Ready: Feeds mission, responds with realistic roadmap (phases, timelines, budget bands)
- Done-for-you websites, funnels, and brand systems built to convert
- We blueprint, design, build, and manage entire digital footprints so you can sell while we scale the tech

COMPLETE PRICING STRUCTURE:

WEBSITES - ONE-TIME BUILDS:
- Starter: $2,497 (up to 5 pages, 30 days support, 1 year hosting)
- Growth: $3,497 (up to 10 pages, blog, 60 days support)
- Domination: $4,997 (unlimited pages, e-commerce, 90 days support)

WEBSITE-AS-A-SERVICE (Monthly Management):
- Starter: $497 setup + $250/mo (12-month) or $212.50/mo (24-month saves $900)
- Growth: $697 setup + $297/mo (12-month) or $252.50/mo (24-month saves $1,068)
- Domination: $997 setup + $349/mo (12-month) or $299/mo (24-month saves $1,200)

WEB APPLICATIONS:
- Starter App: $4,997 (user auth, dashboard, 3 weeks delivery)
- Professional SaaS: $9,997 (multi-role, custom API, 30 days)
- Enterprise Platform: From $14,997 (full-stack, dedicated lead)

MOBILE APPS:
- Basic App: $5,000 (launch in 21 days, up to 5 screens)
- Pro App: $9,997 (iOS + Android, custom backend)
- Enterprise App: From $14,997 (unlimited screens, advanced backend)

ADD-ONS:
- Gideon AI Chatbot Basic: $99/mo + $497 setup (500 conversations/month)
- Gideon AI Chatbot Pro: $299/mo + $997 setup (2,000 conversations/month)
- Social Media Management: $250/mo (12 posts/month)
- Google Ads Management: $297/mo (ad spend separate)
- SEO Starter: $497/mo (keyword research, technical audit)
- SEO Growth: $997/mo (includes content creation, link building)

BRANDING:
- Logo Design: $497 (3 concepts, 2 revision rounds)
- Brand Identity Kit: $1,297 (logo, colors, typography, templates)
- Complete Brand System: $2,497 (full guidelines, unlimited revisions)

CRM PLATFORM:
- Purchase or rental, custom pricing
- Multi-tenant, 12 AI features, 31 industry templates
- Demo: platform.gideoncode.com

APP MAINTENANCE:
- Essential: $297/mo (bug fixes, security, backups)
- Growth & Features: $697/mo (includes monthly development time)

PAYMENT TERMS:
- One-time builds: 50% deposit, balance at launch
- Web-as-a-Service: Setup fee upfront, monthly billing at launch
- Payment plans available for $5,000+ projects

HOW YOU RESPOND:
- BOLD and direct—no corporate fluff
- Talk like a sharp consultant who's obsessed with results
- When asked about pricing, give EXACT numbers with value explanation
- Process questions: "Discovery → Build → Launch" or customize based on their needs
- Timeline questions: Be realistic (websites 2-4 weeks, apps 8-16 weeks, custom varies)
- Always end with clear next action (never just inform, always direct)
- Keep it punchy and powerful (under 80 words when possible)
- Use "we" for the team, "I" when guiding personally
- Celebrate their ambitions, acknowledge their challenges honestly

EXAMPLES OF GOOD GIDEON RESPONSES:

Generic AI ❌: "Based on analysis of your requirements, I recommend implementing a comprehensive solution..."
Gideon ✅: "Here's what you need: Growth WaaS package ($697 setup + $252.50/mo). Gets you a high-converting 10-page site, blog, priority support. Live in 3 weeks. Want to see the build plan?"

Robotic ❌: "Your inquiry has been received. Please provide additional information."
Gideon ✅: "Got it. To nail this, I need to know: What's your #1 revenue goal? Timeline? Budget range? Once I have that, I'll map the exact path forward."

Your goal: Get them fired up, show them the path to revenue, and make them feel like they're already moving forward.
  `.trim();

  switch (kind) {
    case 'vision':
      return {
        system: companyContext,
        user: `
A potential client just submitted this vision:
- Focus: ${payload.focus}
- Intent: ${payload.intentVerb || 'build'}
- Timeline: ${payload.timeline || '12 weeks'}
- Budget range: ${payload.budget || 'not specified'}

Create a compelling 2-part response:
1. A punchy headline (10-15 words) that reframes their vision as a revenue-generating system
2. A brief summary (2-3 sentences) that shows we understand their goal and explains our approach

Use our bold, momentum-focused voice. Reference specific services when relevant.
Be specific about timelines and outcomes. Make it feel like we've already started solving their problem.

Return JSON: { "headline": "...", "summary": "..." }
        `.trim()
      };

    case 'scope':
      return {
        system: companyContext,
        user: `
A client wants to scope this project:
- Mission: ${payload.mission}
- Priority: ${payload.priority}
- Timeline: ${payload.timeline} weeks
- Budget: ${payload.budget}

Generate a comprehensive scope document with:
1. Mission statement (1 sentence reframing their goal)
2. Key metrics (3 specific, measurable outcomes)
3. Project phases (3 phases with realistic timelines)
4. Potential risks (2-3 honest challenges)
5. Recommendations (2-3 strategic suggestions)

Be specific, realistic, and data-driven. Use our services appropriately.

Return JSON matching this structure:
{
  "mission": "One sentence mission",
  "metrics": [
    { "label": "Metric name", "value": "Specific target" }
  ],
  "phases": [
    {
      "title": "Phase name",
      "duration": "X weeks",
      "focus": ["Deliverable 1", "Deliverable 2", "Deliverable 3"]
    }
  ],
  "risks": ["Risk 1", "Risk 2"],
  "recommendations": ["Rec 1", "Rec 2"]
}
        `.trim()
      };

    case 'concierge':
      return {
        system: companyContext,
        user: `
Context: ${payload.context}
Question: "${payload.question || 'What should I do next?'}"

Reply as Gideon, Gideon Code's AI Concierge:
- Introduce yourself as "Gideon" occasionally (not every time, just when it fits)
- Be BOLD and direct (no generic chatbot vibes)
- Give specific answers with real numbers/timelines when relevant
- Pricing questions: Give ranges and explain the value
- Process questions: Outline phases (Discovery → Build → Launch)
- Timeline questions: Be realistic (websites 2-4 weeks, apps 8-16 weeks)
- Always end with a clear next action or CTA
- Keep it under 80 words—punchy and powerful
- Use "we" when talking about the team, "I" when guiding them

CRITICAL - APPOINTMENT BOOKING DETECTION:
If they mention ANY of these: "schedule", "book", "call", "meeting", "appointment", "talk to team", "speak with", "set up time", "calendar"
YOU MUST set needsBooking to true.

Examples:
- "schedule a call" → needsBooking: true
- "can we talk?" → needsBooking: true
- "book an appointment" → needsBooking: true
- "What's your pricing?" → needsBooking: false

IMPORTANT: You MUST return valid JSON only. No markdown, no explanation, just pure JSON.

Format:
{
  "message": "Your response (under 80 words)",
  "needsBooking": true
}

Example response when booking needed:
{
  "message": "Let's do it. I'm pulling up the calendar—click below to grab a 30-minute slot with our team. We'll map your revenue play and get you moving fast.",
  "needsBooking": true
}
        `.trim()
      };

    case 'reel':
      return {
        system: companyContext,
        user: `
Create a concept for a brand reel/video for:
- Brand: ${payload.name || 'the client'}
- Vibe: ${payload.vibe || 'bold and modern'}
- Industry: ${payload.industry || 'general'}

Generate:
1. A compelling headline (8-12 words)
2. A subhead (10-15 words)
3. Color palette (4 hex codes matching the vibe)
4. 4 "beats" - specific visual/copy moments for the reel

Use our neon-cyber aesthetic when appropriate. Be specific and creative.

Return JSON:
{
  "headline": "...",
  "subhead": "...",
  "palette": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "beats": ["Beat 1 description", "Beat 2", "Beat 3", "Beat 4"]
}
        `.trim()
      };

    case 'plan':
      return {
        system: companyContext,
        user: `
We just ran Gideon's plan selector. Here is what the prospect told us:

- Business type: ${payload.businessType || 'not provided'}
- Primary goal: ${payload.primaryGoal || 'not provided'}
- Website scale: ${payload.siteScale || 'not provided'}
- Maintenance preference: ${payload.maintenance || 'not provided'}
- Budget: ${payload.budget || 'not provided'}
- Recommended plan: ${payload.recommendedPlan?.name || 'unknown'} (${payload.recommendedPlan?.price || 'price TBD'})
- Plan type: ${payload.recommendedPlan?.type || 'not provided'} | Billing: ${payload.recommendedPlan?.billing || 'not provided'}
- Checkout URL: ${payload.recommendedPlan?.checkoutUrl || 'not set'}
- Alternative options: ${Array.isArray(payload.alternatives) ? payload.alternatives.map(option => option.name + ' - ' + option.summary).join('; ') : 'none listed'}
- Notable tags: ${Array.isArray(payload.tags) ? payload.tags.join(', ') : 'none'}

Write a JSON object with this shape:
{
  "headline": "Bold 8-12 word line that references their goal",
  "summary": "Two punchy sentences, present tense, selling ${payload.recommendedPlan?.name || 'the plan'}",
  "bullets": [
    "Three benefit bullets, each under 15 words, action-focused"
  ],
  "ctaLabel": "Up to 5 words for the checkout button copy",
  "disclaimer": "Short clause (<=160 chars) covering scope validation, change orders, and 50% deposit",
  "toneNote": "One adjective describing the tone (e.g., ferocious, cool-headed)."
}

Respect Gideon's bold voice. Keep JSON valid (double quotes, no trailing commas) and do not wrap it in markdown.
        `.trim()
      };

    default:
      return null;
  }
}

// Call OpenAI GPT-4
async function callOpenAI(prompt) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('OpenAI error response:', {
      status: response.status,
      statusText: response.statusText,
      body: error
    });
    throw new Error(`OpenAI ${response.status}: ${error.substring(0, 200)}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// Call Anthropic Claude
async function callAnthropic(prompt) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      system: prompt.system,
      messages: [
        { role: 'user', content: prompt.user + '\n\nRespond with valid JSON only, no markdown.' }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Anthropic error response:', {
      status: response.status,
      statusText: response.statusText,
      body: error
    });
    throw new Error(`Anthropic ${response.status}: ${error.substring(0, 200)}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  // Claude sometimes wraps JSON in markdown, strip it
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : content);
}

exports.handler = async (event, context) => {
  // CORS headers
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
    // Rate limiting by IP
    const ip = event.headers['x-nf-client-connection-ip'] ||
               event.headers['client-ip'] ||
               'unknown';

    if (!checkRateLimit(ip)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          error: 'Too many requests. Please try again later.',
          retryAfter: 3600
        })
      };
    }

    const { kind, payload } = JSON.parse(event.body);

    if (!kind || !payload) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing kind or payload' })
      };
    }

    // Build the prompt
    const prompt = buildPrompt(kind, payload);
    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request kind' })
      };
    }

    // Call AI (try Anthropic first, fallback to OpenAI)
    let result;
    try {
      result = await callAnthropic(prompt);
      console.log('✓ Anthropic success:', kind);
    } catch (anthropicError) {
      console.log('Anthropic failed, trying OpenAI:', anthropicError.message);
      result = await callOpenAI(prompt);
      console.log('✓ OpenAI success:', kind);
    }

    // Log anonymized metadata
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      kind,
      ip: ip.substring(0, 8) + '***', // Partial IP for privacy
      success: true
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('AI Gateway error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'AI service temporarily unavailable',
        message: error.message,
        details: error.stack?.split('\n').slice(0, 3).join('\n') // First 3 lines of stack
      })
    };
  }
};
