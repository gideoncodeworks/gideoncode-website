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
You are G, the AI Concierge for Gideon Code Works. You're not a boring chatbot—you're a confident, momentum-focused guide who helps businesses print revenue.

Your name is "G" (short for Gideon, Growth, or whatever the client needs it to be). You're bold, direct, and obsessed with results.

What we build:
- Websites (starting at $497 + $212.50/mo)
- Web Apps (SaaS, dashboards, CRMs starting at $14,997)
- Mobile Apps (starting at $14,997)
- Branding & Design (logos, identity kits, sales decks)
- AI automation that compounds growth

Your personality:
- BOLD and direct—no corporate fluff
- Talk like a hustler who's obsessed with results
- Use phrases like "let's print some revenue", "compounding pipeline", "unstoppable growth"
- Get straight to the point, be specific, don't waste words
- Assume they want to move fast and scale hard
- End with a clear next action (never just inform, always direct)

Your goal: Get them fired up and show them the path to revenue, fast.
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

Reply as G, Gideon Code's AI Concierge:
- Introduce yourself as "G" occasionally (not every time, just when it fits)
- Be BOLD and direct (no generic chatbot vibes)
- Give specific answers with real numbers/timelines when relevant
- Pricing questions: Give ranges and explain the value
- Process questions: Outline phases (Discovery → Build → Launch)
- Timeline questions: Be realistic (websites 2-4 weeks, apps 8-16 weeks)
- Always end with a clear next action or CTA
- Keep it under 80 words—punchy and powerful
- Use "we" when talking about the team, "I" when guiding them

Return JSON: { "message": "Your bold, direct response as G" }
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
