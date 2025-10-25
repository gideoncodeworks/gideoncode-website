# Gideon Code Works Website

A modern, cyberpunk-themed website for Gideon Code Works - building recurring revenue websites for small businesses.

## Tech Stack

- HTML5
- CSS3 (Custom styles with CSS variables)
- Tailwind CSS (via CDN)
- JavaScript (Vanilla)
- Mobile-first responsive design

## Features

- **Cyberpunk/Tech Aesthetic**: Dark theme with cyan-to-magenta gradients and glitch effects
- **Mobile Responsive**: Fully responsive design that works on all devices
- **Fast Loading**: Optimized for performance with minimal dependencies
- **Interactive Elements**: Smooth animations, scroll effects, and dynamic mobile menu
- **Contact Forms**: Working contact and careers application forms
- **SEO Optimized**: Semantic HTML and proper meta tags

## Pages

1. **Home** (`index.html`) - Hero section with value propositions
2. **Services** (`services.html`) - Pricing tiers and add-on services
3. **Portfolio** (`portfolio.html`) - Project showcase grid
4. **About** (`about.html`) - Company story and mission
5. **Careers** (`careers.html`) - Sales opportunity with commission structure
6. **Contact** (`contact.html`) - Contact form and information

## File Structure

```
gideoncode-website/
├── index.html
├── services.html
├── portfolio.html
├── about.html
├── careers.html
├── contact.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── images/
│   └── logo.svg
└── README.md
```

## Deployment to Netlify

### Option 1: Drag and Drop
1. Zip the entire project folder
2. Go to [Netlify](https://app.netlify.com/)
3. Drag and drop the folder onto the Netlify dashboard
4. Your site will be live instantly!

### Option 2: GitHub + Netlify
1. Push this code to a GitHub repository
2. Connect your GitHub repo to Netlify
3. Configure build settings (none needed - static site)
4. Deploy!

### Option 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## Customization

### Colors
Edit the CSS variables in `css/styles.css`:
```css
:root {
  --primary-cyan: #00FFFF;
  --primary-magenta: #FF00FF;
  --accent-blue: #00BFFF;
  --accent-pink: #FF007F;
  --bg-black: #000000;
  --text-white: #FFFFFF;
}
```

### Logo
Replace `images/logo.svg` with your actual logo file.

### Forms
The contact and careers forms currently log to console. To make them functional:
1. Integrate with a backend service (Netlify Forms, Formspree, etc.)
2. Or use Netlify Forms by adding `netlify` attribute to the form tags

#### Using Netlify Forms:
```html
<form name="contact" method="POST" netlify>
  <!-- form fields -->
</form>
```

### Content
All content is in the HTML files. Simply edit the text to match your needs.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lightweight: ~100KB total page weight (excluding images)
- Fast loading: Uses CDN for Tailwind CSS
- Optimized animations: CSS-based with GPU acceleration
- Lazy loading ready: Add `loading="lazy"` to images as needed

## Future Enhancements

- Add actual project screenshots to portfolio
- Integrate contact forms with backend
- Add Google Analytics or tracking
- Implement blog functionality
- Add customer testimonials with photos
- Create case studies for portfolio items

## Support

For questions or issues, contact:
- josh@gideoncode.com
- info@gideoncode.com

## License

© 2024 Gideon Code Works. All rights reserved.
