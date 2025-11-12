# Service Business Starter Template

**Tier:** Starter ($2,497)
**Type:** Service Business (Roadside Assistance, HVAC, Plumbing, Landscaping, etc.)
**Built:** November 2024
**First Client:** Turnpike Recovery (Cleveland Roadside Assistance)

---

## Overview

Professional 5-page React website template for service-based businesses. Perfect for roadside assistance, contractors, home services, and local service providers.

## Features

### Pages (5 total)
1. **Home** - Hero with CTA, stats, services preview, guarantees
2. **Services** - Detailed service breakdown with features
3. **About** - Owner story, company values, trust-building
4. **Contact** - Contact cards + working form
5. **Service Detail Views** - Individual service pages (via routing)

### Technical Features
- ✅ React 19 + Vite
- ✅ React Router for multi-page navigation
- ✅ Sticky navigation with logo and active states
- ✅ Professional footer with links and contact info
- ✅ Working contact form with validation
- ✅ Mobile-first responsive design
- ✅ SEO optimized (meta tags, structured data)
- ✅ Fast performance (< 80KB gzipped)

### Design Elements
- Clean, modern professional aesthetic
- Trust-building elements (stats, guarantees, testimonials)
- Multiple CTAs throughout
- Emergency/urgency messaging
- Personal touch (owner story, direct contact)

---

## How to Use This Template

### 1. Copy Template
```bash
cp -r templates/service-business-starter /path/to/new-client-project
cd /path/to/new-client-project
npm install
```

### 2. Customize Business Info

**Update these files with client details:**

#### `index.html`
- Title tag
- Meta description
- Keywords
- Phone number
- Business name
- Location/city
- Structured data (JSON-LD)

#### `src/components/Navigation.jsx`
- Logo path
- Business name

#### `src/components/Footer.jsx`
- Logo path
- Business name
- Phone number
- Email
- Service areas
- Links

#### `src/pages/Home.jsx`
- Hero headline and copy
- Owner name
- Phone number
- Email
- Stats (response time, availability, etc.)
- Services list (update 5 services)
- Location/city references

#### `src/pages/Services.jsx`
- Update all 5 services:
  - Icons
  - Titles
  - Descriptions
  - Features
- Phone number
- Email

#### `src/pages/About.jsx`
- Owner name and story
- Company history
- Values
- Location/city references
- Phone number

#### `src/pages/Contact.jsx`
- Phone number
- Email
- Service areas
- Form submission endpoint (needs backend integration)

#### `src/index.css`
- Brand colors (update CSS variables)
- Font choices

### 3. Replace Assets

**Update in `/public` and `/src/assets`:**
- `turnpikelogo.png` → Client logo
- Favicon
- Any additional images

### 4. Customize Services

The template has 5 services. Adjust based on client:

**Service Structure:**
```javascript
{
  id: 'service-slug',
  icon: '🔧', // Emoji or replace with icon component
  title: 'Service Name',
  description: 'Full description...',
  features: [
    'Feature 1',
    'Feature 2',
    'Feature 3',
    'Feature 4',
  ],
}
```

### 5. Update Colors

**In `src/index.css`:**
```css
:root {
  --turnpike-red: #E20000;     /* Primary brand color */
  --turnpike-black: #000000;   /* Secondary/dark color */
  --font-display: 'Bebas Neue', sans-serif;
  --font-body: system-ui, -apple-system, sans-serif;
}
```

### 6. SEO Optimization

**For local SEO:**
- Update city/location in all copy
- Update structured data with correct service areas
- Add Google Business Profile link
- Add schema markup for local business
- Update sitemap.xml
- Update robots.txt

### 7. Form Integration

The contact form needs a backend. Options:
- **Formspree** (easiest)
- **SendGrid** + serverless function
- **Netlify Forms**
- **Custom API endpoint**

Update form action in `Contact.jsx`

### 8. Deploy

```bash
npm run build

# Deploy to Vercel, Netlify, or hosting of choice
vercel --prod
```

---

## Customization Tips

### For Different Service Industries

**HVAC/Plumbing/Electrical:**
- Services: Installation, Repair, Maintenance, Emergency, Inspection
- Emphasize: 24/7, licensed/certified, warranty
- Add: Service areas map, certifications

**Landscaping/Lawn Care:**
- Services: Mowing, Trimming, Design, Irrigation, Seasonal Cleanup
- Emphasize: Before/after photos, seasonal packages
- Add: Portfolio/gallery page

**Auto Services (non-emergency):**
- Services: Oil Change, Brakes, Inspection, Detailing, Tires
- Emphasize: Expertise, warranty, parts quality
- Add: Booking system, appointment scheduler

**Home Services (Cleaning, Pest Control, etc.):**
- Services: Regular cleaning, Deep cleaning, Special services
- Emphasize: Trust, background checks, satisfaction guarantee
- Add: Pricing calculator, recurring service options

---

## What's NOT Included (Upsell Opportunities)

This is a Starter tier build. Upsell to Growth or add-ons:

**Growth Tier Additions ($3,497):**
- Blog/news system
- More pages (10+)
- Photo gallery
- Customer reviews/testimonials system
- Enhanced SEO package

**Add-Ons:**
- Online booking system ($900)
- Customer login portal ($1,200)
- E-commerce for parts/products ($1,500)
- Live chat widget ($400)
- Email marketing integration ($500)

**Monthly Management ($250-$297/mo):**
- Ongoing updates
- Content changes
- Security monitoring
- Performance optimization

---

## File Structure

```
service-business-starter/
├── public/
│   ├── turnpikelogo.png      # Replace with client logo
│   ├── robots.txt
│   ├── sitemap.xml
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── turnpikelogo.png  # Replace with client logo
│   ├── components/
│   │   ├── Navigation.jsx/css # Header navigation
│   │   └── Footer.jsx/css     # Footer
│   ├── pages/
│   │   ├── Home.jsx/css       # Landing page
│   │   ├── Services.jsx/css   # Services page
│   │   ├── About.jsx/css      # About page
│   │   └── Contact.jsx/css    # Contact page with form
│   ├── App.jsx                # Router setup
│   ├── App.css
│   ├── index.css              # Global styles + CSS variables
│   └── main.jsx               # Entry point
├── index.html                 # SEO meta tags
├── package.json
└── vite.config.js
```

---

## Color Schemes for Common Industries

**Emergency Services (Current):**
- Primary: Red (#E20000)
- Secondary: Black (#000000)

**Home Services (Trust):**
- Primary: Blue (#0066CC)
- Secondary: Gray (#4A5568)

**Luxury Services:**
- Primary: Gold (#D4AF37)
- Secondary: Navy (#1A1A2E)

**Eco/Green Services:**
- Primary: Green (#2D7A3E)
- Secondary: Brown (#6B4423)

**Tech Services:**
- Primary: Purple (#6B46C1)
- Secondary: Dark (#1A202C)

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

---

## Performance Targets

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total Bundle Size: < 250KB
- Lighthouse Score: 90+

---

## Notes

- Built from Turnpike Recovery (Cleveland roadside assistance)
- Optimized for local service businesses
- Mobile-first design
- Conversion-focused CTAs
- Portfolio-quality code
- Includes Git history for reference

---

**Questions?** Review the original client build at:
- GitHub: https://github.com/gideoncodeworks/turnpike-recovery
- Live: Check Vercel deployments
