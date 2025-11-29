# CMS Implementation Guide - After You Close the Deal

**Created:** November 21, 2025
**Purpose:** Step-by-step guide to building a custom website with CMS after closing your first sale

---

## 🎯 **THE BIG PICTURE**

### **What You're Building:**

A **custom-designed website** where:
- ✅ **YOU control:** Design, layout, structure, styling (locked)
- ✅ **CLIENT controls:** Text, images, schedules, content (editable via CMS)

### **How It Works:**

1. **You design beautiful HTML/CSS** (the "frame")
2. **You install a CMS** (WordPress, Sanity, etc.)
3. **You connect them** (custom theme/template)
4. **Client edits content** through CMS admin panel
5. **Your design stays intact** - they can't break it

---

## 🎨 **CONCEPT: Custom Code + CMS**

### **What's Locked (Your Custom Code):**
- Header design & navigation layout
- Color scheme & fonts
- Page layouts & spacing
- Animations & interactions
- Footer design
- CSS styling
- HTML structure

### **What's Editable (Through CMS):**
- Page titles & headings
- Body text & paragraphs
- Images & photos
- Class schedules (for gyms)
- Staff bios
- Contact info (phone, email, address)
- Blog posts
- Testimonials

### **Real Example:**

**Class Schedule Page:**

**Your locked design:**
```html
<section class="schedule-grid">
  <div class="class-card">
    <!-- CLIENT EDITS THESE THROUGH CMS: -->
    <h3>[Class Name]</h3>
    <p>[Description]</p>
    <span>[Time]</span>
    <img src="[Photo]">
    <button>Register</button>
  </div>
</section>

<style>
  /* YOUR LOCKED STYLING */
  .schedule-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .class-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
</style>
```

**Client edits in CMS:**
- Class Name: "Beginner Tumbling Ages 6-8"
- Description: "Learn cartwheels, handstands, and forward rolls"
- Time: "Tuesday 4:00 PM"
- Photo: Upload image file
- Click "Publish"

**Result:** Content updates, design stays the same.

---

## 🚀 **IMPLEMENTATION OPTIONS**

### **Option 1: WordPress (RECOMMENDED FOR BEGINNERS)**

**Best for:**
- Your first 10 clients
- Clients who aren't tech-savvy
- Simple content management
- Proven, reliable, huge community

**Timeline:** 5-7 days to learn + 2-3 weeks to build

---

### **Option 2: Headless CMS (Sanity/Contentful + Next.js)**

**Best for:**
- Modern tech stack lovers
- Better performance
- More flexibility
- Developer-friendly

**Timeline:** 7-10 days to learn + 3-4 weeks to build

---

### **Option 3: Static Site + Netlify CMS**

**Best for:**
- Simple sites (5-10 pages)
- No dynamic features needed
- Super fast performance
- Low complexity

**Timeline:** 2-3 days to learn + 1-2 weeks to build

---

## 📚 **STEP-BY-STEP: WORDPRESS IMPLEMENTATION**

### **Phase 1: Learning WordPress (Days 1-5)**

#### **Day 1: WordPress Basics**

**Watch these YouTube tutorials:**
1. "WordPress Tutorial for Beginners 2024" by WPBeginner (2 hours)
2. "How WordPress Works" by Traversy Media (30 mins)

**Install WordPress locally:**
```bash
# Option A: Use Local by Flywheel (easiest)
# Download from localwp.com

# Option B: Use MAMP/XAMPP
# Install MAMP, create database, install WordPress
```

**Play around:**
- Create pages
- Create posts
- Upload images
- Change themes
- Install plugins

#### **Day 2: Custom Themes Basics**

**Watch:**
1. "How to Build a Custom WordPress Theme" by Traversy Media (1.5 hours)
2. "WordPress Theme Development 2024" by Brad Hussey (2 hours)

**Understand:**
- Theme folder structure
- Template files (header.php, footer.php, page.php)
- The Loop (WordPress content output)
- Template tags (the_title(), the_content(), etc.)

**Create a simple custom theme:**
```
/wp-content/themes/my-custom-theme/
  ├── style.css (theme info)
  ├── index.php (main template)
  ├── header.php (site header)
  ├── footer.php (site footer)
  ├── functions.php (theme functions)
  └── screenshot.png (theme preview)
```

#### **Day 3: Advanced Custom Fields (ACF)**

**What it is:**
A plugin that lets you create custom fields for clients to edit.

**Example:**
- Add "Class Time" field to Class pages
- Add "Coach Bio" field to Staff pages
- Add "Facility Photo Gallery" to About page

**Watch:**
- "Advanced Custom Fields Tutorial" by WPCrafter (45 mins)

**Practice:**
- Install ACF plugin
- Create custom fields
- Display them in your theme

#### **Day 4: Custom Post Types**

**What they are:**
Custom content types beyond pages/posts.

**For JS Gymnastics:**
- Classes (custom post type)
- Staff (custom post type)
- Testimonials (custom post type)

**Watch:**
- "Custom Post Types in WordPress" by Traversy Media (30 mins)

**Practice:**
- Create "Classes" post type
- Add custom fields to it
- Display classes on a page

#### **Day 5: Final Polish & Practice**

**Build a complete practice site:**
- Homepage
- Classes page (custom post type)
- Staff page (custom post type)
- Contact page
- Blog

**Make it look custom:**
- Add your own CSS
- Custom header/footer design
- Custom colors/fonts
- Responsive (mobile-friendly)

---

### **Phase 2: Building JS Gymnastics Site (Days 6-26)**

#### **Week 1: Setup & Structure**

**Day 6-7: Client Kickoff & Planning**
- Kickoff call with client
- Gather content (text, images, logo)
- Get brand colors, fonts
- Discuss page structure

**Day 8-9: WordPress Setup**
1. Buy domain (if needed) - Namecheap, Google Domains
2. Set up hosting - Cloudways, SiteGround, or Kinsta
3. Install WordPress
4. Install SSL certificate
5. Set up daily backups

**Day 10-11: Theme Foundation**
1. Create custom theme folder
2. Build header.php (navigation, logo)
3. Build footer.php (contact info, social links)
4. Build base CSS (colors, fonts, global styles)
5. Make it responsive

#### **Week 2: Custom Post Types & Fields**

**Day 12-13: Classes Post Type**
```php
// functions.php
function create_classes_post_type() {
    register_post_type('classes',
        array(
            'labels' => array(
                'name' => 'Classes',
                'singular_name' => 'Class'
            ),
            'public' => true,
            'has_archive' => true,
            'menu_icon' => 'dashicons-welcome-learn-more',
            'supports' => array('title', 'editor', 'thumbnail')
        )
    );
}
add_action('init', 'create_classes_post_type');
```

**Add custom fields with ACF:**
- Age Group
- Class Time
- Instructor
- Skill Level
- Price

**Day 14-15: Staff Post Type**
- Create Staff custom post type
- Add fields: Bio, Role, Photo, Email
- Build staff template

**Day 16: Testimonials & Other Content**
- Create Testimonials post type
- Add any other custom content types they need

#### **Week 3: Design & Build Pages**

**Day 17-18: Homepage**
- Hero section with custom design
- Classes overview (pulls from Classes post type)
- Testimonials slider
- Call-to-action sections

**Day 19: Classes Page**
- Display all classes in grid
- Filter by age group
- Custom design for class cards
- "Register" buttons

**Day 20: Staff Page**
- Display all coaches
- Custom design for staff cards
- Modal popups for full bios (optional)

**Day 21: About & Contact Pages**
- About page with facility photos
- Contact page with form (Contact Form 7 plugin)
- Embedded Google Maps

**Day 22: Blog Setup**
- Blog listing page
- Single blog post template
- Categories & tags
- Social sharing

#### **Week 4: Polish, Test, Launch**

**Day 23: E-commerce (If Needed)**
- Install WooCommerce plugin
- Set up products (class registrations)
- Configure payment gateway (Stripe)
- Test checkout process

**Day 24: Final Polish**
- SEO optimization (Yoast plugin)
- Speed optimization
- Mobile responsiveness check
- Cross-browser testing

**Day 25: Client Training**
- 1-hour video call
- Show them how to:
  - Add/edit classes
  - Add/edit staff
  - Create blog posts
  - Upload images
  - Update contact info
- Record the call for their reference
- Send them CMS_MANAGEMENT_GUIDE.md

**Day 26: Launch**
- Final client review
- Make any last changes
- Flip to live (change DNS)
- Celebrate! 🎉

---

## 🎓 **WHAT CLIENT SEES IN WORDPRESS ADMIN**

### **WordPress Dashboard:**

```
WordPress Admin Panel
├── Dashboard (overview)
├── Posts (blog posts)
├── Media (images/files)
├── Pages
│   ├── Home
│   ├── About
│   ├── Contact
│   └── (Add New Page)
├── Classes (custom post type)
│   ├── Beginner Tumbling
│   ├── Intermediate Vault
│   └── (Add New Class)
├── Staff (custom post type)
│   ├── Coach Sarah
│   ├── Coach Mike
│   └── (Add New Staff)
├── Testimonials (custom post type)
└── Settings
```

### **Editing a Class:**

**What they see:**
1. Click "Classes" → "Beginner Tumbling"
2. See fields:
   - Title: [Beginner Tumbling Ages 6-8]
   - Description: [Large text editor]
   - Age Group: [6-8 years]
   - Class Time: [Tuesday 4:00 PM - 5:00 PM]
   - Instructor: [Coach Sarah]
   - Price: [$120/month]
   - Featured Image: [Upload button]
3. Click "Update"
4. Done!

**What they DON'T see:**
- No code
- No HTML/CSS
- No file structure
- No database
- No server settings

**They just edit content in form fields. That's it.**

---

## 🛡️ **PROTECTING YOUR DESIGN (What They Can't Break)**

### **Lock Down the Theme:**

**1. Restrict Theme Editing:**
```php
// wp-config.php
define('DISALLOW_FILE_EDIT', true);  // Disables theme/plugin editor
```

**2. User Role Restrictions:**
- Give client "Editor" role (not "Administrator")
- Editors can edit content but NOT theme files

**3. CSS Protection:**
- All styling in your theme files (locked)
- Client has no access to CSS files
- Changes they make in CMS don't affect styling

### **What CAN'T Be Broken:**

✅ **Layout** - Grid/flexbox structures locked in your theme
✅ **Colors** - Defined in your CSS, not editable
✅ **Fonts** - Loaded in your theme, not changeable
✅ **Navigation** - Menu structure controlled by you
✅ **Footer** - Design locked, content editable (if you set it up that way)
✅ **Responsive Design** - Media queries in your CSS

### **What CAN Be Changed (And That's Okay):**

✅ **Text content** - They can rewrite anything
✅ **Images** - They can upload/replace photos
✅ **Blog posts** - They can add/remove/edit
✅ **Classes** - They can add new classes, edit times
✅ **Staff bios** - They can update coach info

---

## 🎯 **ALTERNATIVE: HEADLESS CMS (Advanced)**

### **Tech Stack:**
- **Frontend:** Next.js (React framework)
- **Backend:** Sanity CMS or Contentful
- **Hosting:** Vercel
- **Styling:** Tailwind CSS

### **How It Works:**

**1. You Build:**
- Custom Next.js website (beautiful, fast, modern)
- Sanity Studio (CMS admin panel)
- API connection between them

**2. Client Edits:**
- Logs into Sanity Studio (studio.yoursite.com)
- Edits content in structured fields
- Clicks "Publish"

**3. Site Updates:**
- Vercel auto-deploys when content changes
- Site rebuilds with new content
- Design stays locked

**4. Benefits:**
- 🚀 Super fast (static site generation)
- 🔒 More secure (no WordPress vulnerabilities)
- 💪 More flexible (modern React components)
- 🎨 Better developer experience

**5. Drawbacks:**
- 📚 Steeper learning curve (need to know React)
- ⏰ Takes longer to build
- 💰 Might cost more (Sanity/Contentful pricing)

---

## 📊 **COMPARISON: WordPress vs Headless CMS**

| Feature | WordPress | Headless CMS |
|---------|-----------|--------------|
| **Learning Curve** | Easy (1 week) | Hard (2-3 weeks) |
| **Build Time** | 2-3 weeks | 3-4 weeks |
| **Client Ease** | Very easy | Moderate |
| **Performance** | Good | Excellent |
| **Cost** | $5-20/mo hosting | $0-50/mo (Sanity free tier) |
| **Flexibility** | Moderate | Very high |
| **Plugins** | 60,000+ | Limited |
| **Best For** | First 10 clients | After you're comfortable |

**For JS Gymnastics:** Use **WordPress**. It's easier, faster, and proven.

---

## 🎓 **LEARNING RESOURCES**

### **WordPress:**
- **Free Course:** "WordPress for Beginners" on YouTube by WPCrafter
- **Paid Course:** "The Complete WordPress Developer Course" on Udemy ($15)
- **Documentation:** wordpress.org/support
- **Community:** Reddit r/wordpress

### **Headless CMS:**
- **Sanity Docs:** sanity.io/docs
- **Next.js Tutorial:** nextjs.org/learn
- **Free Course:** "Next.js + Sanity" on YouTube by CodeWithAntonio
- **Community:** Sanity Slack community

### **Web Development Basics:**
- **HTML/CSS:** FreeCodeCamp (free)
- **JavaScript:** JavaScript.info (free)
- **React:** React.dev/learn (free)

---

## 💡 **PRO TIPS**

### **1. Start with a Starter Theme**
Don't build from scratch. Use:
- **Underscores (_s):** underscores.me - Bare-bones WordPress starter
- **Sage:** roots.io/sage - Modern WordPress theme framework
- **GeneratePress:** generatepress.com - Lightweight, fast

### **2. Use Page Builders (Carefully)**
- **Elementor:** Popular drag-and-drop builder
- **Oxygen:** More developer-friendly
- **Bricks:** Modern, flexible

**Pros:** Faster development, client can edit layouts
**Cons:** Code bloat, performance issues, less control

**My take:** Use for first 1-2 clients while learning, then switch to custom themes.

### **3. Essential WordPress Plugins**
- **Advanced Custom Fields (ACF):** Custom fields
- **Contact Form 7:** Contact forms
- **Yoast SEO:** SEO optimization
- **WP Rocket:** Caching/performance
- **UpdraftPlus:** Backups
- **Wordfence:** Security

### **4. Local Development**
Test everything locally before going live:
- **Local by Flywheel:** localwp.com (easiest)
- **MAMP:** mamp.info (Mac)
- **XAMPP:** apachefriends.org (Windows/Mac/Linux)

### **5. Version Control**
Use Git from day 1:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin [your-repo]
git push -u origin main
```

Benefits:
- Track all changes
- Roll back if something breaks
- Professional workflow

---

## 🚨 **COMMON MISTAKES TO AVOID**

### **1. Giving Client "Administrator" Role**
❌ **Wrong:** Client has full admin access
✅ **Right:** Give them "Editor" role

**Why:** Editors can't break the theme or install plugins.

### **2. Not Locking Down Theme Editor**
❌ **Wrong:** Client can edit theme files in WordPress
✅ **Right:** Disable file editor in wp-config.php

### **3. Building Everything from Scratch**
❌ **Wrong:** Write every line of code yourself
✅ **Right:** Use starter themes, plugins, frameworks

**Why:** Faster, more reliable, better for beginners.

### **4. Not Training the Client**
❌ **Wrong:** "Figure it out yourself"
✅ **Right:** 1-hour training call + documentation

**Why:** Happy clients = referrals + testimonials.

### **5. Overcomplicating It**
❌ **Wrong:** Use 50 plugins, custom everything, complex features
✅ **Right:** Keep it simple, use proven solutions

**Why:** Easier to build, easier to maintain, fewer bugs.

---

## ✅ **FINAL CHECKLIST - BEFORE LAUNCHING**

**Technical:**
- [ ] SSL certificate installed (HTTPS)
- [ ] Daily backups configured
- [ ] Security plugin installed (Wordfence)
- [ ] Speed optimization (WP Rocket or similar)
- [ ] SEO plugin installed (Yoast)
- [ ] Contact forms working
- [ ] Mobile responsive on all devices
- [ ] Cross-browser tested (Chrome, Safari, Firefox)
- [ ] Google Analytics installed (if requested)
- [ ] Favicon added

**Content:**
- [ ] All placeholder content replaced
- [ ] All images optimized (compressed)
- [ ] All links working (no 404s)
- [ ] Spelling/grammar checked
- [ ] Client review completed
- [ ] Final revisions made

**Client Training:**
- [ ] 1-hour training call completed
- [ ] Training video recorded
- [ ] CMS_MANAGEMENT_GUIDE.md sent
- [ ] Login credentials provided
- [ ] Emergency contact (your phone) shared

**Legal/Business:**
- [ ] Final payment received
- [ ] Contract signed
- [ ] Domain ownership transferred (if applicable)
- [ ] Hosting credentials provided
- [ ] Maintenance agreement discussed (if applicable)

---

## 🎉 **YOU'RE READY!**

**After reading this guide, you should know:**
1. ✅ How custom code + CMS work together
2. ✅ What clients can edit vs what's locked
3. ✅ How to build a WordPress site with custom theme
4. ✅ How to train clients on the CMS
5. ✅ How to launch and deliver

**Now go:**
1. Close the JS Gymnastics deal today
2. Learn WordPress this weekend (5-7 days)
3. Build their site in 2-3 weeks
4. Train them on the CMS
5. Launch and celebrate your first client! 🚀

---

*You've got this. You're not selling something you can't build - you're selling something you WILL build after they sign. That's how web development works.*

*Good luck!*
