# Deployment Guide - Gideon Code Works

## Quick Start: Deploy to Netlify in 3 Minutes

### Method 1: Drag & Drop (Easiest)

1. **Prepare your files**
   - No preparation needed! The site is ready to deploy as-is.

2. **Go to Netlify**
   - Visit [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - Create a free account if you don't have one

3. **Deploy**
   - Drag the entire `gideoncode-website` folder onto the Netlify drop zone
   - Wait 10-30 seconds for deployment
   - Your site is live! 🎉

4. **Custom Domain (Optional)**
   - In Netlify dashboard, go to "Domain Settings"
   - Add your custom domain (gideoncode.com)
   - Follow the DNS configuration instructions

### Method 2: GitHub + Netlify (Recommended for Updates)

1. **Push to GitHub**
   ```bash
   cd gideoncode-website
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `.` (or leave empty)
   - Click "Deploy site"

3. **Future Updates**
   - Just push to GitHub and Netlify auto-deploys!
   ```bash
   git add .
   git commit -m "Update content"
   git push
   ```

### Method 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd gideoncode-website
netlify init
netlify deploy --prod
```

## Before Going Live

### 1. Replace Placeholder Content

- **Logo**: Replace `images/logo.svg` with your actual logo
- **Images**: Add real project screenshots to `/images/` folder
- **Update portfolio.html** with actual project images

### 2. Set Up Forms

The contact and careers forms currently log to console. To make them work:

**Option A: Use Netlify Forms (Easiest)**

In `contact.html` and `careers.html`, update the form tags:

```html
<!-- Current -->
<form id="contact-form">

<!-- Change to -->
<form name="contact" method="POST" data-netlify="true">
```

Then in `js/main.js`, remove or comment out the `e.preventDefault()` lines.

**Option B: Use a Form Service**
- [Formspree](https://formspree.io/)
- [Getform](https://getform.io/)
- [EmailJS](https://www.emailjs.com/)

### 3. Add Analytics (Optional)

Add Google Analytics or other tracking to all pages before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 4. Update Contact Information

Search and replace placeholder emails in all files:
- `josh@gideoncode.com` → Your actual email
- `info@gideoncode.com` → Your actual info email

### 5. Social Media Links

Update social media links in the footer (currently placeholder `#`):
```html
<a href="https://twitter.com/yourusername">
<a href="https://github.com/yourusername">
<a href="https://linkedin.com/in/yourprofile">
```

## Post-Deployment Checklist

- [ ] Test all pages on desktop
- [ ] Test all pages on mobile
- [ ] Test contact form submission
- [ ] Test careers form submission
- [ ] Verify all internal links work
- [ ] Check loading speed (use [PageSpeed Insights](https://pagespeed.web.dev/))
- [ ] Verify meta descriptions for SEO
- [ ] Set up custom domain
- [ ] Enable HTTPS (automatic on Netlify)
- [ ] Submit sitemap to Google Search Console

## Troubleshooting

**Forms not working?**
- Make sure `data-netlify="true"` is in the form tag
- Remove `e.preventDefault()` from JavaScript
- Check Netlify form submissions in dashboard

**Styles not loading?**
- Check Tailwind CDN is accessible
- Verify `css/styles.css` path is correct
- Clear browser cache

**404 errors?**
- Ensure all file paths are relative (no leading `/`)
- Check file names match exactly (case-sensitive)

**Images not showing?**
- Verify image files exist in `/images/` folder
- Check image paths in HTML

## Performance Optimization

The site is already optimized, but for even better performance:

1. **Optimize images**: Use tools like TinyPNG or ImageOptim
2. **Add lazy loading**: Add `loading="lazy"` to images
3. **Self-host Tailwind**: Download and host Tailwind CSS locally instead of CDN

## Need Help?

Contact josh@gideoncode.com for deployment assistance.

## Estimated Deployment Time

- First time: 5-10 minutes
- Subsequent updates: 30 seconds

Ready to deploy? Let's go! 🚀
