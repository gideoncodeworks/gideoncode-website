# City Location Pages — Build System

## How to Add a New City Page

1. Edit `data/city-pages.json` — add a new entry
2. Run `node scripts/build-city-pages.mjs`
3. Commit and push

Takes ~2 minutes. The script generates the HTML page, updates the sitemap, and handles all the schema/SEO.

## JSON Entry Structure

```json
{
  "slug": "atlanta",
  "city": "Atlanta",
  "state": "Georgia",
  "stateAbbr": "GA",
  "label": "SOUTHEAST HUB",
  "lat": 33.749,
  "lng": -84.388,
  "phone": "+12164632648",
  "localAngle": "2-3 sentences about why this city matters for small businesses",
  "suburbs": ["Decatur", "Marietta", "Roswell", ...],
  "keywords": "atlanta web design, atlanta website design, ..."
}
```

## What Gets Generated

- Individual HTML page at `/{slug}.html` (e.g., `/atlanta.html`)
- LocalBusiness + FAQPage + BreadcrumbList JSON-LD schema
- 5 unique FAQ items customized with city name
- Contact form with territory tracking
- Suburb/metro grid
- Sitemap entry (between `<!-- CITY PAGES START -->` and `<!-- CITY PAGES END -->`)

## After Adding Pages

- Add clean URL redirect in `_redirects` (e.g., `/atlanta /atlanta.html`)
- Push to deploy

## Current City Pages (30 total)

**Original 5:** Cleveland, Columbus, Pittsburgh, Toledo, Findlay

**Generated 25:** Atlanta, Houston, Dallas, San Antonio, Austin, Denver, Nashville, Charlotte, Indianapolis, Tampa, Miami, Orlando, Phoenix, Seattle, Portland, Minneapolis, Chicago, Detroit, Boston, Raleigh, Kansas City, San Diego, Los Angeles, San Jose, Jacksonville

## Expansion Targets (Underserved Markets)

### Boom Towns (easy to rank, fast-growing)
- Georgetown TX, New Braunfels TX, Huntsville AL, Ocala FL, Bentonville AR, St. George UT, Meridian ID, Fort Mill SC

### Military Towns (constant turnover, new businesses)
- Killeen TX, Clarksville TN, Fayetteville NC, Colorado Springs CO, Lawton OK, Sierra Vista AZ, Hinesville GA

### Wealthy Suburbs (high income, will pay premium)
- Prosper TX, Flower Mound TX, Fulshear TX, Castle Rock CO, Johns Creek GA, Queen Creek AZ, Eagle ID

### College Towns (restaurants, services)
- Athens GA, Ames IA, San Marcos TX, Bowling Green KY, Kalamazoo MI, Manhattan KS

### Retirement/Snowbird (healthcare, services, real estate)
- Cape Coral FL, Port St. Lucie FL, Palm Coast FL, Prescott AZ, Myrtle Beach SC

## Related Systems

- **Contractor niche pages:** `data/location-pages.json` + `scripts/build-location-pages.mjs` (generates pages like "SEO for plumbers in Columbus OH")
- **Service tier pages:** `services/starter.html`, `services/growth.html`, `services/domination.html`
- **Core service pages:** `services/web-design.html`, `services/seo.html`, `services/google-ads.html`
