import type { VercelRequest, VercelResponse } from '@vercel/node'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

// Simple in-memory rate limiting (resets on cold start)
const rateLimits = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 20
const RATE_WINDOW = 60 * 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimits.get(ip) || { count: 0, resetAt: now + RATE_WINDOW }

  if (now > record.resetAt) {
    record.count = 0
    record.resetAt = now + RATE_WINDOW
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  rateLimits.set(ip, record)
  return true
}

function buildPrompt(kind: string, payload: Record<string, unknown>) {
  const companyContext = `
You are Gideon, the AI Concierge for Gideon Codeworks.

WHO YOU ARE:
You're not just a chatbot - you're a strategic partner who helps businesses scale and print revenue.

CORE PERSONALITY:
- Strategic thinker, data-driven but empathetic
- Direct and honest (no corporate speak)
- Occasionally playful with strategic emoji use
- Short, punchy sentences for insights

WHAT GIDEON CODE WORKS DOES:
We build digital products that drive revenue - websites, apps, SaaS platforms.

PRICING (key items):
- Starter Website: $2,497 one-time or $250/mo WaaS
- Growth Website: $3,497 one-time or $297/mo WaaS
- Domination: $4,997 one-time or $349/mo WaaS
- Landing Page: $199 setup + $49.99/mo
- SEO: $297-997/mo
- Apps: Starting at $4,997

HOW YOU RESPOND:
- BOLD and direct—no corporate fluff
- Give EXACT numbers with value explanation
- Always end with clear next action
- Keep it under 80 words when possible
  `.trim()

  switch (kind) {
    case 'concierge':
      return {
        system: companyContext,
        user: `
Context: ${payload.context}
Question: "${payload.question || 'What should I do next?'}"

Reply as Gideon:
- Be BOLD and direct
- Give specific answers with real numbers/timelines
- Always end with a clear next action
- Keep it under 80 words

If they mention scheduling/booking/call/meeting, set needsBooking to true.

Return valid JSON only:
{
  "message": "Your response",
  "needsBooking": false
}
        `.trim()
      }

    case 'vision':
      return {
        system: companyContext,
        user: `
Vision request:
- Focus: ${payload.focus}
- Intent: ${payload.intentVerb || 'build'}
- Timeline: ${payload.timeline || '12 weeks'}
- Budget: ${payload.budget || 'not specified'}

Create:
1. A punchy headline (10-15 words)
2. A brief summary (2-3 sentences)

Return JSON: { "headline": "...", "summary": "..." }
        `.trim()
      }

    case 'plan':
      return {
        system: companyContext,
        user: `
Plan selector results:
- Business type: ${payload.businessType || 'not provided'}
- Primary goal: ${payload.primaryGoal || 'not provided'}
- Website scale: ${payload.siteScale || 'not provided'}
- Budget: ${payload.budget || 'not provided'}
- Recommended: ${(payload.recommendedPlan as Record<string, unknown>)?.name || 'unknown'}

Return JSON:
{
  "headline": "Bold 8-12 word line",
  "summary": "Two punchy sentences",
  "bullets": ["Three benefit bullets"],
  "ctaLabel": "Button text",
  "disclaimer": "Short disclaimer",
  "toneNote": "One adjective"
}
        `.trim()
      }

    default:
      return null
  }
}

async function callAnthropic(prompt: { system: string; user: string }) {
  if (!ANTHROPIC_API_KEY) throw new Error('Anthropic API key not configured')

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
      messages: [{ role: 'user', content: prompt.user + '\n\nRespond with valid JSON only.' }]
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Anthropic ${response.status}: ${error.substring(0, 200)}`)
  }

  const data = await response.json()
  const content = data.content[0].text
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  return JSON.parse(jsonMatch ? jsonMatch[0] : content)
}

async function callOpenAI(prompt: { system: string; user: string }) {
  if (!OPENAI_API_KEY) throw new Error('OpenAI API key not configured')

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
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI ${response.status}: ${error.substring(0, 200)}`)
  }

  const data = await response.json()
  return JSON.parse(data.choices[0].message.content)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown'

    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many requests', retryAfter: 3600 })
    }

    const { kind, payload } = req.body

    if (!kind || !payload) {
      return res.status(400).json({ error: 'Missing kind or payload' })
    }

    const prompt = buildPrompt(kind, payload)
    if (!prompt) {
      return res.status(400).json({ error: 'Invalid request kind' })
    }

    let result
    try {
      result = await callAnthropic(prompt)
    } catch {
      result = await callOpenAI(prompt)
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('AI Gateway error:', error)
    return res.status(500).json({
      error: 'AI service temporarily unavailable',
      message: (error as Error).message
    })
  }
}
