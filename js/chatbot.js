/**
 * AI Chatbot Widget for Gideon Codeworks
 * Smart chatbot with lead capture and comprehensive knowledge
 */

class GideonChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.isMobile = window.innerWidth < 640;
    this.basePath = window.location.pathname.includes('/blog/') ? '../' : '';

    // Lead capture state
    this.leadData = { name: null, email: null, phone: null, interest: null, captured: false };
    this.collectingLead = false;
    this.leadStep = null;

    // Visitor tracking
    this.visitorId = this.getOrCreateVisitorId();
    this.sessionId = null;

    if (window.location.pathname.includes('chat.html')) return;

    this.init();
    window.addEventListener('resize', () => { this.isMobile = window.innerWidth < 640; });
  }

  // Comprehensive knowledge base
  knowledge = {
    company: {
      name: "Gideon Codeworks",
      tagline: "Professional websites for small businesses. Simple pricing, full service, real support.",
      phone: "216-463-2648",
      email: "josh@gideoncode.com",
      hours: "Mon-Fri 9am-6pm ET",
      responseTime: "24 hours",
      launchTime: "2-4 weeks",
      guarantee: "30-day satisfaction guarantee"
    },
    pricing: {
      monthly: {
        starter: { setup: 497, monthly: 212.50, pages: 5, contract: "24 months", savings: 900 },
        growth: { setup: 697, monthly: 252.50, pages: 10, contract: "24 months", savings: 1068, popular: true },
        domination: { setup: 997, monthly: 299, pages: "Unlimited", contract: "24 months", savings: 1200 }
      },
      onetime: {
        starter: { price: 2497, pages: 5, support: "30 days" },
        growth: { price: 3497, pages: 10, support: "60 days" },
        domination: { price: 4997, pages: "Unlimited", support: "90 days" }
      }
    },
    addons: {
      seoBasic: { price: 297, keywords: 10, desc: "Local SEO + Google Business optimization, monthly Loom walkthrough" },
      seoPro: { price: 597, keywords: 20, desc: "Daily rank checks, weekly AI summary, quarterly strategy call" },
      googleAds: { price: 297, desc: "Campaign setup, keyword research, bid management, monthly reports + ad spend" },
      ecommerce: { setup: 500, monthly: 50, products: 25, desc: "Shopify/WooCommerce, payment processing, order notifications" }
    },
    team: {
      cleveland: ["Josh Stone - Founder"],
      findlay: ["Kenley Statkiewicz", "Marqelle Birchfield", "Jake Hotes", "Hayden McCray"],
      phoenix: ["Luke Jennings"]
    },
    locations: ["Cleveland OH", "Findlay OH", "Phoenix AZ", "Nationwide"],
    industries: ["Contractors & Trades", "Medical & Dental (HIPAA-aware)", "Professional Services", "Restaurants & Cafes", "Salons & Spas", "Real Estate"],
    process: [
      { step: "Free Consultation", desc: "Discuss your business and goals - no obligation" },
      { step: "We Build It", desc: "Send logo, colors, content - we handle the rest" },
      { step: "Review & Refine", desc: "2-3 short review calls, changes as needed" },
      { step: "Launch & Support", desc: "Go live and get ongoing support" }
    ],
    features: {
      all: ["Mobile responsive", "SEO-ready setup", "SSL security", "24/7 AI chatbot", "Contact forms"],
      monthly: ["Hosting included", "Ongoing updates", "Security monitoring", "Priority support"],
      growth: ["Blog setup", "Advanced forms", "Weekly updates"],
      domination: ["E-commerce ready", "Custom features", "Daily monitoring", "24/7 support"]
    },
    faqs: {
      "how fast": "Most websites launch in 2-4 weeks. Need it faster? Just ask!",
      "mobile": "100% yes! Every site is fully responsive and tested on all devices.",
      "cancel": "Monthly plans have 12 or 24-month terms. One-time builds have no ongoing commitment after support period.",
      "payment": "We accept credit cards, ACH, and wire transfers. 50% deposit to start, balance at launch.",
      "refund": "30-day guarantee - if we don't deliver, we'll make it right or refund your setup fee.",
      "content": "Yes! We write content from scratch or polish what you have.",
      "existing site": "We can redesign your existing site while preserving SEO rankings.",
      "hosting": "Hosting is included in all monthly plans. One-time builds include 1 year.",
      "support": "Email, phone, and text support. We respond within 24 hours, usually much faster."
    }
  };

  getOrCreateVisitorId() {
    let id = localStorage.getItem('gideon_visitor_id');
    if (!id) {
      id = 'v_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('gideon_visitor_id', id);
    }
    return id;
  }

  init() {
    this.createChatWidget();
    this.attachEventListeners();
    if (!this.isMobile) this.addWelcomeMessage();
  }

  createChatWidget() {
    const widget = document.createElement('div');
    if (this.isMobile) {
      widget.innerHTML = `<a href="${this.basePath}chat.html" id="chatbot-toggle" class="chatbot-toggle"><svg class="chatbot-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg><span class="chatbot-notification-badge">1</span></a>`;
      document.body.appendChild(widget);
      return;
    }
    widget.innerHTML = `
      <button id="chatbot-toggle" class="chatbot-toggle"><svg class="chatbot-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg><svg class="close-icon hidden" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg><span class="chatbot-notification-badge">1</span></button>
      <div id="chatbot-window" class="chatbot-window hidden">
        <div class="chatbot-header"><div class="flex items-center"><div class="chatbot-avatar"><img src="${this.basePath}images/gcw-g-icon.png" alt="G"></div><div><div class="chatbot-title">Gideon AI Assistant</div><div class="chatbot-status"><span class="status-dot"></span> Online now</div></div></div><button id="chatbot-minimize" class="chatbot-minimize"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button></div>
        <div id="chatbot-messages" class="chatbot-messages"></div>
        <div id="chatbot-quick-actions" class="chatbot-quick-actions"></div>
        <div class="chatbot-input-container"><input type="text" id="chatbot-input" class="chatbot-input" placeholder="Type your message..." autocomplete="off"><button id="chatbot-send" class="chatbot-send-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button></div>
      </div>`;
    document.body.appendChild(widget);
  }

  attachEventListeners() {
    if (this.isMobile) return;
    document.getElementById('chatbot-toggle').addEventListener('click', () => this.toggleChat());
    document.getElementById('chatbot-minimize').addEventListener('click', () => this.toggleChat());
    document.getElementById('chatbot-send').addEventListener('click', () => this.sendMessage());
    document.getElementById('chatbot-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') this.sendMessage(); });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const win = document.getElementById('chatbot-window');
    const chatIcon = document.querySelector('.chatbot-icon');
    const closeIcon = document.querySelector('.close-icon');
    const badge = document.querySelector('.chatbot-notification-badge');
    win.classList.toggle('hidden');
    chatIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
    if (badge && this.isOpen) badge.style.display = 'none';
    if (this.isOpen) document.getElementById('chatbot-input').focus();
  }

  addWelcomeMessage() {
    setTimeout(() => {
      this.addMessage("bot", "Hi! 👋 I'm the Gideon AI Assistant.\n\nI know everything about our **services, pricing, and process**. I can also connect you with our team!\n\nWhat can I help you with?");
      this.showQuickActions([
        { text: "💰 Pricing & Plans", action: "pricing" },
        { text: "🎨 Our Services", action: "services" },
        { text: "📞 Free Consultation", action: "consultation" },
        { text: "❓ I Have Questions", action: "questions" }
      ]);
    }, 800);
  }

  showQuickActions(actions) {
    const c = document.getElementById('chatbot-quick-actions');
    if (!c) return;
    c.innerHTML = actions.map(a => `<button class="quick-action-btn" data-action="${a.action}">${a.text}</button>`).join('');
    c.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleQuickAction(e.target.dataset.action, e.target.textContent));
    });
  }

  clearQuickActions() {
    const c = document.getElementById('chatbot-quick-actions');
    if (c) c.innerHTML = '';
  }

  handleQuickAction(action, text) {
    this.addMessage("user", text);
    this.clearQuickActions();
    setTimeout(() => {
      if (action.startsWith('lead_')) { this.completeLead(action.replace('lead_', '')); return; }
      const handlers = {
        'pricing': () => this.handlePricing(),
        'services': () => this.handleServices(),
        'consultation': () => this.startLeadCapture(),
        'questions': () => this.handleQuestions(),
        'monthly': () => this.handleMonthly(),
        'onetime': () => this.handleOnetime(),
        'addons': () => this.handleAddons(),
        'process': () => this.handleProcess(),
        'whyus': () => this.handleWhyUs(),
        'locations': () => this.handleLocations(),
        'contact': () => this.handleContact(),
        'faq': () => this.handleFAQ(),
        'industries': () => this.handleIndustries()
      };
      (handlers[action] || this.handleUnknown.bind(this))();
    }, 300);
  }

  // === CONTENT HANDLERS ===

  handlePricing() {
    this.addMessage("bot", "We offer **two ways** to work with us:\n\n**📅 Monthly Plans** (Most Popular)\n• Lower upfront: $497-$997 setup\n• From **$212.50/month**\n• Ongoing updates & support included\n• Save up to $1,200!\n\n**💵 One-Time Builds**\n• Pay once, own forever\n• From **$2,497**\n• 30-90 days support included\n\nWhich interests you?");
    this.showQuickActions([
      { text: "📅 Monthly Details", action: "monthly" },
      { text: "💵 One-Time Details", action: "onetime" },
      { text: "➕ Add-On Services", action: "addons" },
      { text: "📞 Get Custom Quote", action: "consultation" }
    ]);
  }

  handleMonthly() {
    const p = this.knowledge.pricing.monthly;
    this.addMessage("bot", `**Monthly Plans** (24-month contract)\n\n**Starter** - $${p.starter.setup} setup + $${p.starter.monthly}/mo\n• Up to ${p.starter.pages} pages\n• Mobile responsive, SEO-ready\n• Monthly updates, hosting included\n• Save $${p.starter.savings} vs one-time!\n\n**Growth** ⭐ MOST POPULAR\n$${p.growth.setup} setup + $${p.growth.monthly}/mo\n• Up to ${p.growth.pages} pages\n• Blog setup, advanced forms\n• Weekly updates, priority support\n• Save $${p.growth.savings}!\n\n**Domination**\n$${p.domination.setup} setup + $${p.domination.monthly}/mo\n• ${p.domination.pages} pages\n• E-commerce ready, custom features\n• Daily monitoring, 24/7 support\n• Save $${p.domination.savings}!\n\n✅ All include: Hosting, SSL, AI chatbot, SEO setup`);
    this.showQuickActions([
      { text: "📞 Get Started", action: "consultation" },
      { text: "💵 See One-Time", action: "onetime" },
      { text: "❓ Questions", action: "faq" }
    ]);
  }

  handleOnetime() {
    const p = this.knowledge.pricing.onetime;
    this.addMessage("bot", `**One-Time Builds** (Pay once, own it)\n\n**Starter** - $${p.starter.price.toLocaleString()}\n• Up to ${p.starter.pages} pages\n• ${p.starter.support} support included\n• 50% deposit to start\n\n**Growth** - $${p.growth.price.toLocaleString()}\n• Up to ${p.growth.pages} pages\n• ${p.growth.support} support included\n• Blog setup\n\n**Domination** - $${p.domination.price.toLocaleString()}\n• ${p.domination.pages} pages\n• ${p.domination.support} support\n• E-commerce ready\n\n💡 **Pro Tip:** Monthly plans include ongoing updates & support - better value for most businesses!`);
    this.showQuickActions([
      { text: "📞 Get Quote", action: "consultation" },
      { text: "📅 See Monthly", action: "monthly" },
      { text: "❓ Questions", action: "faq" }
    ]);
  }

  handleAddons() {
    const a = this.knowledge.addons;
    this.addMessage("bot", `**Add-On Services**\n\n**SEO Basic** - $${a.seoBasic.price}/mo\n${a.seoBasic.keywords} keywords tracked\n${a.seoBasic.desc}\n\n**SEO Pro** - $${a.seoPro.price}/mo\n${a.seoPro.keywords} keywords tracked\n${a.seoPro.desc}\n\n**Google Ads** - $${a.googleAds.price}/mo\n${a.googleAds.desc}\n\n**E-commerce** - $${a.ecommerce.monthly}/mo + $${a.ecommerce.setup} setup\nUp to ${a.ecommerce.products} products\n${a.ecommerce.desc}`);
    this.showQuickActions([
      { text: "📞 Get Custom Quote", action: "consultation" },
      { text: "💰 Base Pricing", action: "pricing" }
    ]);
  }

  handleServices() {
    this.addMessage("bot", "**What We Do:**\n\n🌐 **Website Design & Development**\nCustom, mobile-responsive sites that convert visitors to customers\n\n🔧 **Hosting & Support**\nWe handle hosting, security, backups, updates - everything\n\n✍️ **Content & Copywriting**\nWe write your content or polish what you have\n\n📈 **SEO & Marketing**\nGet found on Google with our SEO packages\n\n🛒 **E-commerce**\nSell products with Shopify or WooCommerce\n\n**Industries:** " + this.knowledge.industries.slice(0,3).join(", ") + " and more!");
    this.showQuickActions([
      { text: "💰 See Pricing", action: "pricing" },
      { text: "⚡ How It Works", action: "process" },
      { text: "🏆 Why Choose Us", action: "whyus" },
      { text: "📞 Free Consultation", action: "consultation" }
    ]);
  }

  handleProcess() {
    const steps = this.knowledge.process;
    this.addMessage("bot", `**Our Simple 4-Step Process:**\n\n1️⃣ **${steps[0].step}**\n${steps[0].desc}\n\n2️⃣ **${steps[1].step}**\n${steps[1].desc}\n\n3️⃣ **${steps[2].step}**\n${steps[2].desc}\n\n4️⃣ **${steps[3].step}**\n${steps[3].desc}\n\n⏱️ **Timeline:** Most sites launch in **2-4 weeks**!`);
    this.showQuickActions([
      { text: "📞 Start Now", action: "consultation" },
      { text: "💰 See Pricing", action: "pricing" }
    ]);
  }

  handleWhyUs() {
    this.addMessage("bot", "**Why Small Businesses Choose Us:**\n\n✅ **Simple, transparent pricing**\nNo surprise fees - ever\n\n✅ **We handle everything**\nNo DIY website builders\n\n✅ **Real support**\nCall, email, or text real people\n\n✅ **Fast turnaround**\nMost sites live in 2-4 weeks\n\n✅ **Affordable**\nMonthly plans from $212.50/mo\n\n✅ **100% satisfaction**\nWe deliver on our promises\n\n🛡️ **30-Day Guarantee:** If we don't deliver, we make it right or refund your setup fee.");
    this.showQuickActions([
      { text: "📞 Free Consultation", action: "consultation" },
      { text: "💰 See Pricing", action: "pricing" }
    ]);
  }

  handleLocations() {
    const t = this.knowledge.team;
    this.addMessage("bot", `**We Serve Clients Nationwide!**\n\n📍 **Cleveland, Ohio** (HQ)\n${t.cleveland.join(", ")}\n\n📍 **Findlay, Ohio**\n${t.findlay.join(", ")}\n\n📍 **Phoenix, Arizona**\n${t.phoenix.join(", ")}\n\n🌎 **Nationwide service available!**\n\n📞 Call us: **${this.knowledge.company.phone}**`);
    this.showQuickActions([
      { text: "📞 Contact Us", action: "consultation" },
      { text: "💰 See Pricing", action: "pricing" }
    ]);
  }

  handleContact() {
    const c = this.knowledge.company;
    this.addMessage("bot", `**Ready to Talk?**\n\n📞 **Phone:** ${c.phone}\n${c.hours}\n\n📧 **Email:** ${c.email}\n\n⏰ **Response:** Within ${c.responseTime}\n\nOr I can collect your info and have someone call you!`);
    this.showQuickActions([
      { text: "📝 Request Callback", action: "consultation" },
      { text: "💰 See Pricing First", action: "pricing" }
    ]);
  }

  handleFAQ() {
    this.addMessage("bot", "**Common Questions:**\n\n⏱️ **How fast?** 2-4 weeks for most sites\n\n📱 **Mobile-friendly?** 100% yes, all sites responsive\n\n🔄 **Can I cancel?** Monthly: 12/24-month terms. One-time: no commitment\n\n✍️ **Content help?** Yes, we write or polish your content\n\n🔧 **Existing site?** We can redesign & preserve SEO\n\n💰 **Payment?** 50% deposit, balance at launch\n\nType your question or pick a topic!");
    this.showQuickActions([
      { text: "📞 Talk to Human", action: "consultation" },
      { text: "💰 Pricing", action: "pricing" }
    ]);
  }

  handleIndustries() {
    this.addMessage("bot", `**Industries We Serve:**\n\n🔨 Contractors & Trades\n🏥 Medical & Dental (HIPAA-aware)\n💼 Professional Services\n🍽️ Restaurants & Cafes\n💇 Salons & Spas\n🏠 Real Estate\n\n...and any small business needing a professional web presence!`);
    this.showQuickActions([
      { text: "📞 Free Consultation", action: "consultation" },
      { text: "💰 Pricing", action: "pricing" }
    ]);
  }

  handleQuestions() {
    this.addMessage("bot", "I can help with:\n\n💰 **Pricing** - packages & costs\n🎨 **Services** - what we offer\n⚡ **Process** - how we work\n📍 **Locations** - where we're based\n🏢 **Industries** - who we help\n❓ **FAQs** - common questions\n\nJust type your question or pick a topic!");
    this.showQuickActions([
      { text: "💰 Pricing", action: "pricing" },
      { text: "⚡ Process", action: "process" },
      { text: "❓ FAQs", action: "faq" },
      { text: "📍 Locations", action: "locations" }
    ]);
  }

  // === LEAD CAPTURE ===

  startLeadCapture() {
    this.collectingLead = true;
    this.leadStep = 'name';
    this.addMessage("bot", "Great! I'd love to connect you with our team for a **free, no-obligation consultation**.\n\nWhat's your **name**?");
    this.clearQuickActions();
  }

  processLeadCapture(msg) {
    switch(this.leadStep) {
      case 'name':
        this.leadData.name = msg;
        this.leadStep = 'email';
        this.addMessage("bot", `Nice to meet you, **${msg}**! 👋\n\nWhat's the best **email** to reach you?`);
        break;
      case 'email':
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(msg)) {
          this.leadData.email = msg;
          this.leadStep = 'phone';
          this.addMessage("bot", "Perfect! And your **phone number**? (We only call if you want us to)");
        } else {
          this.addMessage("bot", "That doesn't look like a valid email. Could you try again?");
        }
        break;
      case 'phone':
        this.leadData.phone = msg;
        this.leadStep = 'interest';
        this.addMessage("bot", "Last question - what type of website are you looking for?");
        this.showQuickActions([
          { text: "🆕 New Website", action: "lead_new" },
          { text: "🔄 Redesign Existing", action: "lead_redesign" },
          { text: "🛒 E-commerce", action: "lead_ecommerce" },
          { text: "🤔 Not Sure Yet", action: "lead_notsure" }
        ]);
        break;
    }
  }

  completeLead(interest) {
    const interestMap = { 'new': 'New Website', 'redesign': 'Redesign', 'ecommerce': 'E-commerce', 'notsure': 'Not sure yet' };
    this.leadData.interest = interestMap[interest] || interest;
    this.leadData.captured = true;
    this.collectingLead = false;
    this.leadStep = null;

    // Send to backend/console
    console.log('🎉 Lead captured:', this.leadData);
    this.sendLeadData();

    this.addMessage("bot", `🎉 **Thanks, ${this.leadData.name}!**\n\nHere's what happens next:\n\n1. Our team reviews your info\n2. Someone calls you within **24 hours**\n3. We discuss your project & give you a custom quote\n\n**No pressure, no obligation** - just a friendly chat!\n\n📞 Want to talk sooner?\nCall us: **${this.knowledge.company.phone}**`);
    this.showQuickActions([
      { text: "💰 See Pricing", action: "pricing" },
      { text: "🎨 Our Services", action: "services" }
    ]);
  }

  sendLeadData() {
    // Send to your backend API
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...this.leadData,
          visitorId: this.visitorId,
          source: 'chatbot',
          page: window.location.href,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {});
    } catch(e) {}
  }

  // === MESSAGE HANDLING ===

  sendMessage() {
    const input = document.getElementById('chatbot-input');
    const msg = input.value.trim();
    if (!msg) return;
    this.addMessage('user', msg);
    input.value = '';
    this.clearQuickActions();

    if (this.collectingLead && this.leadStep !== 'interest') {
      setTimeout(() => this.processLeadCapture(msg), 300);
      return;
    }
    setTimeout(() => this.processUserMessage(msg), 300);
  }

  processUserMessage(msg) {
    const m = msg.toLowerCase();

    // Check FAQs first
    for (const [key, answer] of Object.entries(this.knowledge.faqs)) {
      if (m.includes(key)) {
        this.addMessage("bot", answer);
        this.showQuickActions([{ text: "📞 Free Consultation", action: "consultation" }, { text: "💰 Pricing", action: "pricing" }]);
        return;
      }
    }

    // Intent matching
    if (m.match(/price|cost|how much|pricing|quote/)) this.handlePricing();
    else if (m.match(/monthly.*(plan|price)/)) this.handleMonthly();
    else if (m.match(/one.?time|onetime/)) this.handleOnetime();
    else if (m.match(/seo|google ads|add.?on/)) this.handleAddons();
    else if (m.match(/service|what do you|offer|do you do/)) this.handleServices();
    else if (m.match(/process|how does|how do you|work/)) this.handleProcess();
    else if (m.match(/why.*(choose|different|better|you)/)) this.handleWhyUs();
    else if (m.match(/location|where|team|who/)) this.handleLocations();
    else if (m.match(/contact|call|phone|email|reach/)) this.handleContact();
    else if (m.match(/faq|question/)) this.handleFAQ();
    else if (m.match(/industry|business type|work with/)) this.handleIndustries();
    else if (m.match(/consult|quote|started|talk|speak|human|person/)) this.startLeadCapture();
    else if (m.match(/hello|hi|hey|howdy/)) {
      this.addMessage("bot", "Hey there! 👋 I'm here to help. What can I do for you?");
      this.showQuickActions([{ text: "💰 Pricing", action: "pricing" }, { text: "🎨 Services", action: "services" }, { text: "📞 Free Consultation", action: "consultation" }]);
    }
    else if (m.match(/thank/)) {
      this.addMessage("bot", "You're welcome! 😊 Anything else I can help with?");
      this.showQuickActions([{ text: "📞 Free Consultation", action: "consultation" }, { text: "💰 Pricing", action: "pricing" }]);
    }
    else this.handleUnknown();
  }

  handleUnknown() {
    this.addMessage("bot", "I'm not sure I understood that. I can help with:\n\n💰 **Pricing** - our packages\n🎨 **Services** - what we offer\n⚡ **Process** - how we work\n📞 **Consultation** - talk to our team\n\nWhat would you like to know?");
    this.showQuickActions([{ text: "💰 Pricing", action: "pricing" }, { text: "🎨 Services", action: "services" }, { text: "📞 Talk to Human", action: "consultation" }]);
  }

  addMessage(sender, text) {
    const c = document.getElementById('chatbot-messages');
    if (!c) return;
    const div = document.createElement('div');
    div.className = `chatbot-message chatbot-message-${sender}`;
    const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="chatbot-link">$1</a>').replace(/\n/g, '<br>');
    div.innerHTML = `${sender === 'bot' ? `<div class="message-avatar"><img src="${this.basePath}images/gcw-g-icon.png" alt="G"></div>` : ''}<div class="message-bubble">${formatted}</div>`;
    c.appendChild(div);
    c.scrollTop = c.scrollHeight;
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new GideonChatbot());
} else {
  new GideonChatbot();
}
