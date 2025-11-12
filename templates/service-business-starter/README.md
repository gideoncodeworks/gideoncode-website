# Turnpike Recovery Marketing Site

Single-page React + Vite build that tells the Turnpike Recovery story with hero stats, capability panels, incident timeline, and partner guarantee blocks. The page is tuned for quick lighthouse wins (compressed bundle, SEO tags, JSON-LD schema, sitemap/robots, etc.).

## Run locally

```bash
npm install
npm run dev
```

The app mounts at `http://localhost:5173` with hot module reload enabled.

## Production build

```bash
npm run build
```

This emits a static bundle in `dist/`. Serve it locally with `npm run preview` or drop it into any static host (Vercel, Netlify, S3).

## Deploying to Vercel

1. Push this repo to GitHub (e.g., `turnpike-recovery-site`).
2. In Vercel, “Add New Project” → import the repo.
3. Set **Build Command** `npm run build` and **Output Directory** `dist`.
4. Connect your custom domain (e.g., `turnpikerecovery.com`) and re-run the deployment.

The project already ships with `robots.txt`, `sitemap.xml`, OpenGraph/Twitter meta tags, and LocalBusiness schema—no extra SEO setup needed post-deploy.
