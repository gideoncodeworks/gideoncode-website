# Gideon Code Works Website

**Status:** ✅ Production Ready
**Last Updated:** November 8, 2025

A modern, cyberpunk-themed website for Gideon Code Works - AI-powered web development, CRM platforms, and digital infrastructure for businesses that want to scale fast.

---

## 🚀 What's Complete

### Core Pages
✅ **Home** (`index.html`) - Hero with Gideon video, AI command center showcase, service offerings
✅ **Services** (`services.html`) - Complete pricing for websites, apps, branding, add-ons
✅ **Portfolio** (`portfolio.html`) - Project showcase grid with case studies
✅ **About** (`about.html`) - Founder story (Josh Stone) with photo and mission
✅ **Contact** (`contact.html`) - Working Netlify form with honeypot protection
✅ **FAQ** (`faq.html`) - Comprehensive Q&A covering all services
✅ **Careers** (`careers.html`) - Account Executive program details
✅ **Get Started** (`get-started.html`) - Onboarding flow and CTA hub
✅ **Blog** (`blog.html`) - 4 published posts with full content

### Blog Posts
✅ **Nov 7, 2025** - "How I Built a Multi-Tenant AI CRM in 4 Weeks" (with bpi1-4 images)
✅ **Oct 31, 2025** - "Launching the Account Executive Program" (with bpi5-10 images)
✅ **Oct 24, 2025** - "Why I Built Gideon" (with gideonlives.mp4 video)
✅ **Oct 17, 2025** - "Day One: From Layoff to Launch" (founder's personal journey)

### Interactive Features
✅ **Gideon AI Chatbot** - Full persona with pricing knowledge, booking detection, HTML rendering
✅ **Package Builder** - Interactive tool for service recommendations
✅ **Vision Preview** - AI-powered project scoping
✅ **Calendly Integration** - Auto-triggers booking links when needed
✅ **Mobile Responsive** - Works perfectly on all devices
✅ **Netlify Forms** - Contact and careers submissions

### AI & Automation
✅ **Gideon Persona** - Complete personality from gideon-framework (strategic partner, not generic chatbot)
✅ **Pricing Knowledge** - All services, packages, add-ons, payment terms
✅ **Booking Detection** - Auto-detects when users want to schedule calls
✅ **Auto-linkification** - URLs in chat responses become clickable

---

## 📁 File Structure

```
gideoncode-website/
├── index.html                  # Homepage with Gideon video
├── services.html               # Pricing and packages
├── portfolio.html              # Case studies
├── about.html                  # Founder story
├── contact.html                # Contact form
├── faq.html                    # FAQ page
├── careers.html                # AE program
├── blog.html                   # Blog listing (4 posts)
├── get-started.html            # Onboarding
├── package-builder.html        # Interactive tool
├── blog/
│   ├── day-one-layoff-to-launch.html
│   ├── why-i-built-gideon.html
│   ├── launching-ae-program.html
│   └── multi-tenant-crm-4-weeks.html
├── css/
│   └── styles.css              # Custom cyberpunk theme
├── js/
│   ├── main.js                 # Core JS + Gideon chatbot
│   └── package-builder.js      # Interactive package tool
├── images/
│   ├── gcw-logo.png
│   ├── josh-photo.jpg
│   ├── blogs/
│   │   ├── ae-program/         # bpi5-10 images
│   │   └── multi-tenant-crm/   # bpi1-4 images
│   └── portfolio/
├── media/
│   └── gideon-lives.mp4        # Gideon AI animation
├── netlify/
│   └── functions/
│       └── ai-gateway.js       # Gideon AI backend
├── docs/
│   ├── PRICING-REFERENCE.md    # Complete pricing structure
│   └── PACKAGE-BUILDER-IMPLEMENTATION.md
└── README.md                   # This file
```

---

## 🎨 Tech Stack

- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript
- **AI Backend:** Netlify Functions (OpenAI + Anthropic)
- **Deployment:** Netlify (connected to GitHub)
- **Forms:** Netlify Forms with honeypot protection
- **Video:** Self-hosted MP4 (gideon-lives.mp4)
- **Analytics:** Ready for GA4 integration

---

## 🎯 Brand Identity

### Colors
- **Primary Cyan:** #22D3EE (electric, tech-forward)
- **Primary Magenta:** #EC4899 (bold, energetic)
- **Background:** #000000 (deep black)
- **Text:** #FFFFFF (crisp white)
- **Accent Blue:** #06B6D4
- **Accent Pink:** #DB2777

### Voice & Tone
- Bold and direct, no corporate fluff
- Strategic partner, not generic chatbot
- "Let's print some revenue" energy
- Celebrates ambition, acknowledges reality
- Uses phrases like "Boom. Well played." and "You've got this 💪"

### Typography
- **Headings:** Inter, 700-800 weight
- **Body:** Inter, 400 weight
- **Code/Tech:** Monospace for technical elements

---

## 🔧 Key Features

### Gideon AI Chatbot
The AI concierge that powers the entire experience:
- **Full Persona:** Strategic sales partner, sees patterns, gives bold advice
- **Complete Knowledge:** All pricing, services, processes, payment terms
- **Smart Booking:** Auto-detects scheduling intent, triggers Calendly
- **HTML Rendering:** Can send formatted messages with links and buttons
- **Voice Guidelines:** Confident but not arrogant, punchy and powerful
- **Signature Phrases:** Greetings, celebrations, advice, sign-offs

### Package Builder
Interactive tool that recommends services based on:
- Business type and goals
- Budget range and timeline
- Maintenance preferences
- Scale requirements

### Blog System
- Clean, readable typography (prose styling)
- Author bio sections
- Back-to-blog navigation
- Featured posts with video/images
- 2-column grid layout
- Mobile responsive

---

## 📊 Pricing Structure (November 2025)

### Websites
**One-Time Builds:**
- Starter: $2,497
- Growth: $3,497
- Domination: $4,997

**Website-as-a-Service:**
- Starter: $497 setup + $212.50-250/mo
- Growth: $697 setup + $252.50-297/mo
- Domination: $997 setup + $299-349/mo

### Applications
- Starter App: $4,997
- Professional SaaS: $9,997
- Enterprise Platform: From $14,997

### Mobile Apps
- Basic: $5,000
- Pro: $9,997
- Enterprise: From $14,997

### Add-Ons
- Gideon AI Chatbot: $99-299/mo
- Social Media: $250/mo
- Google Ads: $297/mo
- SEO: $497-997/mo

### Branding
- Logo: $497
- Brand Kit: $1,297
- Complete System: $2,497

Full pricing details in `docs/PRICING-REFERENCE.md`

---

## 🚀 Deployment

### Current Setup
- **Hosting:** Netlify
- **Domain:** gideoncode.com
- **Git:** Connected to GitHub (auto-deploy on push to main)
- **Functions:** Netlify Functions for AI gateway
- **Forms:** Netlify Forms for contact/careers

### Deploy Process
1. Push to GitHub `main` branch
2. Netlify auto-deploys within 1-2 minutes
3. Functions rebuild automatically
4. No build step required (static site)

### Environment Variables (Netlify)
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 📈 Analytics & Tracking

Ready to integrate:
- Google Analytics 4
- Meta Pixel
- LinkedIn Insight Tag
- Calendly event tracking

---

## 🎓 Documentation

- **Pricing Reference:** `docs/PRICING-REFERENCE.md`
- **Package Builder:** `docs/PACKAGE-BUILDER-IMPLEMENTATION.md`
- **Gideon Framework:** `../gideon-framework/` (knowledge base system)

---

## ✅ Production Checklist

- [x] All pages complete with content
- [x] Blog posts written and published
- [x] Pricing finalized and documented
- [x] Gideon chatbot fully functional
- [x] Mobile responsive across all pages
- [x] Forms working (Netlify integration)
- [x] Images optimized and in place
- [x] Navigation working everywhere
- [x] Footer links correct
- [x] SEO meta tags on all pages
- [x] Favicon in place
- [x] 404 page ready
- [x] Git repository clean and pushed

---

## 🔮 Future Enhancements

- [ ] Google Analytics 4 integration
- [ ] Additional blog posts (ongoing content)
- [ ] Customer testimonials section
- [ ] Video testimonials from clients
- [ ] Case study deep dives
- [ ] Newsletter signup integration
- [ ] Advanced portfolio filtering
- [ ] Gideon knowledge base auto-updates

---

## 📞 Contact

**Josh Stone** - Founder
📧 josh@gideoncode.com
📧 info@gideoncode.com
📞 1-216-463-2648
🌐 https://gideoncode.com
🔗 https://platform.gideoncode.com (CRM Demo)
📅 https://calendly.com/josh-gideoncode/30min

---

## 📄 License

© 2025 Gideon Code Works. All rights reserved.

**Built with Claude Code** 🤖
