/**
 * Gideon AI Assistant - Conversational Chatbot
 * Natural, friendly conversation with smart lead capture
 */

class GideonChatbot {
  constructor() {
    this.isOpen = false;
    this.isMobile = window.innerWidth < 640;
    this.basePath = window.location.pathname.includes('/blog/') ? '../' : '';

    // Conversation state
    this.conversationStage = 'greeting'; // greeting, discovery, capturing, chatting
    this.lead = { name: null, phone: null, email: null, reason: null };
    this.askedFor = [];
    this.messageCount = 0;

    if (window.location.pathname.includes('chat.html')) return;
    this.init();
  }

  // Everything we know
  info = {
    phone: "216-463-2648",
    email: "josh@gideoncode.com",
    hours: "Mon-Fri 9am-6pm ET",
    timeline: "2-4 weeks",

    monthlyPricing: {
      starter: "$497 setup + $212.50/mo",
      growth: "$697 setup + $252.50/mo (most popular)",
      domination: "$997 setup + $299/mo"
    },

    onetimePricing: {
      starter: "$2,497",
      growth: "$3,497",
      domination: "$4,997"
    },

    locations: "Cleveland, Findlay (Ohio), Phoenix (Arizona), and nationwide",

    team: {
      josh: "Josh Stone, Founder - Cleveland",
      findlay: "Kenley, Marqelle, Jake, Hayden - Findlay",
      phoenix: "Luke - Phoenix"
    },

    services: "website design, hosting, SEO, Google Ads, e-commerce, content writing",

    industries: "contractors, medical/dental, restaurants, salons, real estate, professional services"
  };

  // Conversation responses - more natural and varied
  responses = {
    greetings: [
      "Hey there! 👋 I'm the Gideon AI. What brings you here today?",
      "Hi! 👋 Welcome to Gideon Codeworks. What can I help you with?",
      "Hey! 👋 I'm here to help. Looking for a website or just exploring?"
    ],

    askName: [
      "By the way, what's your name? I'd love to know who I'm chatting with!",
      "I didn't catch your name - what should I call you?",
      "What's your name, by the way?"
    ],

    gotName: [
      "Nice to meet you, {name}! 🙌",
      "Great to meet you, {name}!",
      "Hey {name}! Love it. 👊"
    ],

    askPhone: [
      "What's the best number to reach you at? Our team can give you a quick call to discuss.",
      "Got a phone number? We can have someone reach out to chat more about your project.",
      "What's your phone number? We'd love to connect you with our team."
    ],

    askEmail: [
      "And your email? Just so we can send you some info.",
      "What email should we use to follow up?",
      "Drop your email and we'll send you details."
    ],

    askReason: [
      "What kind of project are you thinking about?",
      "Tell me a bit about what you're looking for.",
      "What's on your mind - new website, redesign, something else?"
    ],

    thanks: [
      "Perfect! Our team will reach out within 24 hours. In the meantime, anything else I can help with?",
      "Awesome, you're all set! Someone will call you soon. Anything else you want to know?",
      "Got it! We'll be in touch. Want to know more about our process or pricing while you wait?"
    ],

    pricing: `Here's the quick breakdown:

**Monthly Plans** (best value):
• Starter: $497 setup + $212/mo
• Growth: $697 setup + $252/mo ⭐
• Domination: $997 setup + $299/mo

**One-Time Builds**:
• Starter: $2,497
• Growth: $3,497
• Domination: $4,997

Monthly includes hosting, updates, and support. Which sounds right for you?`,

    process: `Super simple:

1️⃣ **Free consultation** - we chat about your business
2️⃣ **We build it** - you send logo/content, we do the rest
3️⃣ **Review together** - quick calls to refine
4️⃣ **Launch!** - usually 2-4 weeks

Want to get started?`,

    services: `We do it all:

🌐 **Websites** - custom, mobile-friendly, fast
🔧 **Hosting & support** - we handle everything
✍️ **Content** - we write or polish your copy
📈 **SEO** - get found on Google
🛒 **E-commerce** - sell products online
📱 **Google Ads** - drive traffic fast

What sounds most relevant to you?`,

    whyUs: `Here's why people choose us:

✅ **We handle everything** - no DIY builders
✅ **Real humans** - call or text us anytime
✅ **Fast** - most sites live in 2-4 weeks
✅ **Affordable** - from $212/month
✅ **Guarantee** - 30-day satisfaction promise

Want to chat with the team?`,

    contact: `Here's how to reach us:

📞 **216-463-2648** (Mon-Fri 9-6 ET)
📧 josh@gideoncode.com

Or I can grab your info and have someone call you - which works better?`
  };

  init() {
    this.createWidget();
    this.attachEvents();
    if (!this.isMobile) {
      setTimeout(() => this.greet(), 800);
    }
  }

  createWidget() {
    const w = document.createElement('div');
    if (this.isMobile) {
      w.innerHTML = `<a href="${this.basePath}chat.html" class="chatbot-toggle"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span class="chatbot-notification-badge">1</span></a>`;
    } else {
      w.innerHTML = `
        <button id="chatbot-toggle" class="chatbot-toggle">
          <svg class="chatbot-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <svg class="close-icon hidden" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          <span class="chatbot-notification-badge">1</span>
        </button>
        <div id="chatbot-window" class="chatbot-window hidden">
          <div class="chatbot-header">
            <div class="flex items-center">
              <div class="chatbot-avatar"><img src="${this.basePath}images/gcw-g-icon.png" alt="G"></div>
              <div>
                <div class="chatbot-title">Gideon AI</div>
                <div class="chatbot-status"><span class="status-dot"></span> Online</div>
              </div>
            </div>
            <button id="chatbot-minimize" class="chatbot-minimize"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
          </div>
          <div id="chatbot-messages" class="chatbot-messages"></div>
          <div id="chatbot-quick-actions" class="chatbot-quick-actions"></div>
          <div class="chatbot-input-container">
            <input type="text" id="chatbot-input" class="chatbot-input" placeholder="Type here..." autocomplete="off">
            <button id="chatbot-send" class="chatbot-send-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
          </div>
        </div>`;
    }
    document.body.appendChild(w);
  }

  attachEvents() {
    if (this.isMobile) return;
    document.getElementById('chatbot-toggle').onclick = () => this.toggle();
    document.getElementById('chatbot-minimize').onclick = () => this.toggle();
    document.getElementById('chatbot-send').onclick = () => this.send();
    document.getElementById('chatbot-input').onkeypress = (e) => { if (e.key === 'Enter') this.send(); };
  }

  toggle() {
    this.isOpen = !this.isOpen;
    document.getElementById('chatbot-window').classList.toggle('hidden');
    document.querySelector('.chatbot-icon').classList.toggle('hidden');
    document.querySelector('.close-icon').classList.toggle('hidden');
    const badge = document.querySelector('.chatbot-notification-badge');
    if (badge && this.isOpen) badge.style.display = 'none';
    if (this.isOpen) document.getElementById('chatbot-input').focus();
  }

  pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  greet() {
    this.say(this.pick(this.responses.greetings));
    this.quickActions([
      { text: "💰 Pricing", action: "pricing" },
      { text: "🎨 Services", action: "services" },
      { text: "📞 Talk to someone", action: "contact" }
    ]);
  }

  say(text, delay = 0) {
    setTimeout(() => {
      const c = document.getElementById('chatbot-messages');
      if (!c) return;
      const d = document.createElement('div');
      d.className = 'chatbot-message chatbot-message-bot';
      d.innerHTML = `<div class="message-avatar"><img src="${this.basePath}images/gcw-g-icon.png" alt="G"></div><div class="message-bubble">${this.format(text)}</div>`;
      c.appendChild(d);
      c.scrollTop = c.scrollHeight;
    }, delay);
  }

  userSay(text) {
    const c = document.getElementById('chatbot-messages');
    if (!c) return;
    const d = document.createElement('div');
    d.className = 'chatbot-message chatbot-message-user';
    d.innerHTML = `<div class="message-bubble">${text}</div>`;
    c.appendChild(d);
    c.scrollTop = c.scrollHeight;
    this.messageCount++;
  }

  format(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  quickActions(actions) {
    const c = document.getElementById('chatbot-quick-actions');
    if (!c) return;
    c.innerHTML = actions.map(a => `<button class="quick-action-btn" data-action="${a.action}">${a.text}</button>`).join('');
    c.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.onclick = (e) => {
        this.userSay(e.target.textContent);
        this.clearActions();
        this.handleAction(e.target.dataset.action);
      };
    });
  }

  clearActions() {
    const c = document.getElementById('chatbot-quick-actions');
    if (c) c.innerHTML = '';
  }

  handleAction(action) {
    setTimeout(() => {
      switch(action) {
        case 'pricing':
          this.say(this.responses.pricing);
          this.tryCapture();
          break;
        case 'services':
          this.say(this.responses.services);
          this.tryCapture();
          break;
        case 'process':
          this.say(this.responses.process);
          this.tryCapture();
          break;
        case 'whyus':
          this.say(this.responses.whyUs);
          this.tryCapture();
          break;
        case 'contact':
          this.say(this.responses.contact);
          setTimeout(() => this.startCapture(), 1500);
          break;
        case 'yes_call':
          this.startCapture();
          break;
        case 'no_thanks':
          this.say("No problem! Let me know if you have any other questions. 😊");
          this.quickActions([
            { text: "💰 Pricing", action: "pricing" },
            { text: "⚡ How it works", action: "process" }
          ]);
          break;
      }
    }, 400);
  }

  tryCapture() {
    // After showing info, try to get their contact if we don't have it
    if (!this.lead.name && !this.lead.phone) {
      setTimeout(() => {
        this.quickActions([
          { text: "📞 Have someone call me", action: "yes_call" },
          { text: "Just browsing", action: "no_thanks" }
        ]);
      }, 500);
    } else {
      setTimeout(() => {
        this.quickActions([
          { text: "💰 Pricing", action: "pricing" },
          { text: "⚡ Process", action: "process" },
          { text: "🏆 Why us", action: "whyus" }
        ]);
      }, 500);
    }
  }

  startCapture() {
    this.conversationStage = 'capturing';
    if (!this.lead.name) {
      this.say(this.pick(this.responses.askName));
      this.askedFor.push('name');
    } else if (!this.lead.phone) {
      this.say(this.pick(this.responses.askPhone));
      this.askedFor.push('phone');
    } else if (!this.lead.email) {
      this.say(this.pick(this.responses.askEmail));
      this.askedFor.push('email');
    } else {
      this.finishCapture();
    }
  }

  send() {
    const input = document.getElementById('chatbot-input');
    const msg = input.value.trim();
    if (!msg) return;
    this.userSay(msg);
    input.value = '';
    this.clearActions();

    setTimeout(() => this.process(msg), 400);
  }

  process(msg) {
    const m = msg.toLowerCase();

    // If we're capturing info
    if (this.conversationStage === 'capturing') {
      this.captureInfo(msg);
      return;
    }

    // Check if they gave us info naturally
    if (this.extractInfo(msg)) return;

    // Intent matching
    if (m.match(/price|cost|how much|pricing|package|plan/)) {
      this.say(this.responses.pricing);
      this.tryCapture();
    }
    else if (m.match(/service|what do you|offer|help with/)) {
      this.say(this.responses.services);
      this.tryCapture();
    }
    else if (m.match(/process|how does|how do you|work|timeline|long/)) {
      this.say(this.responses.process);
      this.tryCapture();
    }
    else if (m.match(/why|different|better|choose you/)) {
      this.say(this.responses.whyUs);
      this.tryCapture();
    }
    else if (m.match(/contact|call|phone|talk|speak|human|person|email/)) {
      this.say(this.responses.contact);
      setTimeout(() => this.startCapture(), 1500);
    }
    else if (m.match(/hello|hi|hey|howdy|yo|sup/)) {
      if (!this.lead.name) {
        this.say("Hey! 👋 " + this.pick(this.responses.askName));
        this.askedFor.push('name');
        this.conversationStage = 'capturing';
      } else {
        this.say(`Hey ${this.lead.name}! What can I help you with?`);
        this.quickActions([
          { text: "💰 Pricing", action: "pricing" },
          { text: "🎨 Services", action: "services" }
        ]);
      }
    }
    else if (m.match(/thank|thanks|thx/)) {
      this.say("You're welcome! 😊 Anything else I can help with?");
    }
    else if (m.match(/website|site|web/)) {
      this.say("Nice! We build custom websites for small businesses. Are you looking for a new site or redesigning an existing one?");
      this.quickActions([
        { text: "🆕 New website", action: "new_site" },
        { text: "🔄 Redesign", action: "redesign" }
      ]);
    }
    else if (m.match(/new|start|need a site|build/)) {
      this.lead.reason = "New website";
      this.say("Awesome! A new website - exciting! " + this.pick(this.responses.askName));
      this.conversationStage = 'capturing';
      this.askedFor.push('name');
    }
    else if (m.match(/redesign|redo|update|existing|current/)) {
      this.lead.reason = "Redesign";
      this.say("Got it, a redesign! We can definitely help. " + this.pick(this.responses.askName));
      this.conversationStage = 'capturing';
      this.askedFor.push('name');
    }
    else if (m.match(/ecommerce|e-commerce|shop|store|sell/)) {
      this.lead.reason = "E-commerce";
      this.say("E-commerce, nice! We do Shopify and WooCommerce. " + this.pick(this.responses.askName));
      this.conversationStage = 'capturing';
      this.askedFor.push('name');
    }
    else {
      // They said something we don't understand - maybe it's their name?
      if (msg.split(' ').length <= 3 && !m.match(/[0-9@]/)) {
        // Probably a name
        this.lead.name = msg.split(' ')[0];
        this.say(this.pick(this.responses.gotName).replace('{name}', this.lead.name) + " What brings you to Gideon Codeworks today?");
        this.quickActions([
          { text: "🆕 Need a website", action: "new_site" },
          { text: "🔄 Redesign existing", action: "redesign" },
          { text: "💰 Just checking pricing", action: "pricing" }
        ]);
      } else {
        this.say("I'm here to help! I can tell you about our pricing, services, or connect you with the team. What sounds good?");
        this.quickActions([
          { text: "💰 Pricing", action: "pricing" },
          { text: "🎨 Services", action: "services" },
          { text: "📞 Talk to someone", action: "contact" }
        ]);
      }
    }
  }

  extractInfo(msg) {
    // Check if they naturally gave us contact info
    const phoneMatch = msg.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
    const emailMatch = msg.match(/([^\s@]+@[^\s@]+\.[^\s@]+)/);

    if (phoneMatch && !this.lead.phone) {
      this.lead.phone = phoneMatch[1];
      this.say("Got your number! 📱");
      if (!this.lead.email) {
        setTimeout(() => {
          this.say(this.pick(this.responses.askEmail));
          this.conversationStage = 'capturing';
          this.askedFor.push('email');
        }, 800);
      } else {
        this.finishCapture();
      }
      return true;
    }

    if (emailMatch && !this.lead.email) {
      this.lead.email = emailMatch[1];
      this.say("Got your email! 📧");
      if (!this.lead.phone) {
        setTimeout(() => {
          this.say(this.pick(this.responses.askPhone));
          this.conversationStage = 'capturing';
          this.askedFor.push('phone');
        }, 800);
      } else {
        this.finishCapture();
      }
      return true;
    }

    return false;
  }

  captureInfo(msg) {
    const lastAsked = this.askedFor[this.askedFor.length - 1];

    if (lastAsked === 'name') {
      this.lead.name = msg.split(' ')[0]; // Take first word as name
      this.say(this.pick(this.responses.gotName).replace('{name}', this.lead.name));

      setTimeout(() => {
        this.say(this.pick(this.responses.askPhone));
        this.askedFor.push('phone');
      }, 800);
    }
    else if (lastAsked === 'phone') {
      const phoneMatch = msg.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{10})/);
      if (phoneMatch) {
        this.lead.phone = phoneMatch[1];
        this.say("Perfect! 📱");
        setTimeout(() => {
          this.say(this.pick(this.responses.askEmail));
          this.askedFor.push('email');
        }, 600);
      } else {
        this.say("Hmm, I need a 10-digit phone number. Try again?");
      }
    }
    else if (lastAsked === 'email') {
      const emailMatch = msg.match(/([^\s@]+@[^\s@]+\.[^\s@]+)/);
      if (emailMatch) {
        this.lead.email = emailMatch[1];
        this.say("Got it! 📧");
        setTimeout(() => {
          if (!this.lead.reason) {
            this.say(this.pick(this.responses.askReason));
            this.askedFor.push('reason');
          } else {
            this.finishCapture();
          }
        }, 600);
      } else {
        this.say("That doesn't look like an email. Can you double-check it?");
      }
    }
    else if (lastAsked === 'reason') {
      this.lead.reason = msg;
      this.finishCapture();
    }
  }

  finishCapture() {
    this.conversationStage = 'chatting';
    this.sendLead();

    this.say(this.pick(this.responses.thanks));
    setTimeout(() => {
      this.quickActions([
        { text: "💰 See pricing", action: "pricing" },
        { text: "⚡ How it works", action: "process" }
      ]);
    }, 500);
  }

  sendLead() {
    console.log('🎉 Lead captured:', this.lead);

    // Send to backend
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...this.lead,
          source: 'chatbot',
          page: window.location.href,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {});
    } catch(e) {}
  }
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new GideonChatbot());
} else {
  new GideonChatbot();
}
// Cache bust: 1772837843
