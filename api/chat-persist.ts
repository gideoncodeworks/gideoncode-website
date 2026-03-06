import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const webhookSecret = process.env.CHAT_WEBHOOK_SECRET
  if (!webhookSecret) {
    // Silently skip if not configured
    return res.status(200).json({ skipped: true, reason: 'Not configured' })
  }

  try {
    const body = req.body
    const dashboardUrl = process.env.DASHBOARD_URL || 'https://dashboard.gideoncode.com'

    // Get client IP for rate limiting
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown'

    const response = await fetch(`${dashboardUrl}/api/website-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': webhookSecret,
        'x-forwarded-for': clientIp,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (error) {
    console.error('Chat persist error:', error)
    return res.status(200).json({ error: (error as Error).message })
  }
}
