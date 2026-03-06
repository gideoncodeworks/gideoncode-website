import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse form data (could be JSON or URL-encoded)
    let formData = req.body

    // If URL-encoded (from HTML form), it's already parsed by Vercel
    const {
      name,
      email,
      phone,
      company,
      website,
      message,
      'project-details': projectDetails,
      'product-interest': productInterest,
      'assigned-rep': assignedRep,
      'territory': territory,
      '_redirect': redirectUrl,
    } = formData

    // Determine success page
    const successPage = redirectUrl || '/quote-success.html'

    // Validate required fields
    if (!email) {
      return res.redirect(302, `${successPage}?error=email-required`)
    }

    if (!name) {
      return res.redirect(302, `${successPage}?error=name-required`)
    }

    // Send to dashboard
    const dashboardUrl = process.env.DASHBOARD_URL || 'https://dashboard.gideoncode.com'
    const webhookSecret = process.env.LEADS_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('LEADS_WEBHOOK_SECRET not configured')
      // Still redirect to success - don't break UX
      return res.redirect(302, successPage)
    }

    // Build message with extra context
    let fullMessage = projectDetails || message || ''
    if (territory) fullMessage = `Territory: ${territory}\n${fullMessage}`
    if (assignedRep) fullMessage = `Assigned Rep: ${assignedRep}\n${fullMessage}`

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
        message: fullMessage || null,
        product_interest: productInterest || null,
        source: 'gideoncode.com',
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Dashboard webhook failed:', result)
    } else {
      console.log('Lead created:', result.leadId)
    }

    // Redirect to success page
    return res.redirect(302, successPage)
  } catch (error) {
    console.error('Form submission error:', error)
    // Still redirect to success - don't break UX for user
    return res.redirect(302, '/quote-success.html')
  }
}
