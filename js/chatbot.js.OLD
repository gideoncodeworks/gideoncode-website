/**
 * AI Chatbot Widget for Gideon Code Works
 * Provides live help and guidance to visitors
 */

class GideonChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.init();
  }

  init() {
    this.createChatWidget();
    this.attachEventListeners();
    this.addWelcomeMessage();
  }

  createChatWidget() {
    const widget = document.createElement('div');
    widget.innerHTML = `
      <!-- Chat Button -->
      <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Open chat">
        <svg class="chatbot-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg class="close-icon hidden" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span class="chatbot-notification-badge">1</span>
      </button>

      <!-- Chat Window -->
      <div id="chatbot-window" class="chatbot-window hidden">
        <div class="chatbot-header">
          <div class="flex items-center">
            <div class="chatbot-avatar">🤖</div>
            <div>
              <div class="chatbot-title">Gideon AI Assistant</div>
              <div class="chatbot-status">
                <span class="status-dot"></span>
                Online
              </div>
            </div>
          </div>
          <button id="chatbot-minimize" class="chatbot-minimize" aria-label="Minimize chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        <div id="chatbot-messages" class="chatbot-messages">
          <!-- Messages will be inserted here -->
        </div>

        <div class="chatbot-quick-actions" id="quick-actions">
          <!-- Quick action buttons will be inserted here -->
        </div>

        <div class="chatbot-input-container">
          <input
            type="text"
            id="chatbot-input"
            class="chatbot-input"
            placeholder="Type your message..."
            autocomplete="off"
          />
          <button id="chatbot-send" class="chatbot-send-btn" aria-label="Send message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(widget);
  }

  attachEventListeners() {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const minimizeBtn = document.getElementById('chatbot-minimize');
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');

    toggleBtn.addEventListener('click', () => this.toggleChat());
    minimizeBtn.addEventListener('click', () => this.toggleChat());
    sendBtn.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const window = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    const badge = toggle.querySelector('.chatbot-notification-badge');
    const chatIcon = toggle.querySelector('.chatbot-icon');
    const closeIcon = toggle.querySelector('.close-icon');

    if (this.isOpen) {
      window.classList.remove('hidden');
      chatIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
      badge.style.display = 'none';
      document.getElementById('chatbot-input').focus();
    } else {
      window.classList.add('hidden');
      chatIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    }
  }

  addWelcomeMessage() {
    setTimeout(() => {
      this.addBotMessage(
        "Hi! 👋 I'm the Gideon AI Assistant. I'm here to help you find the perfect web solution for your business. What can I help you with today?"
      );
      this.showQuickActions([
        { text: "💰 Pricing & Plans", action: "pricing" },
        { text: "🎨 Services Overview", action: "services" },
        { text: "⚡ How It Works", action: "how-it-works" },
        { text: "📞 Talk to a Human", action: "contact" }
      ]);
    }, 1000);
  }

  showQuickActions(actions) {
    const container = document.getElementById('quick-actions');
    container.innerHTML = actions.map(action =>
      `<button class="quick-action-btn" data-action="${action.action}">${action.text}</button>`
    ).join('');

    container.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        this.handleQuickAction(action, e.target.textContent);
      });
    });
  }

  handleQuickAction(action, text) {
    this.addUserMessage(text);

    setTimeout(() => {
      switch(action) {
        case 'pricing':
          this.handlePricingQuestion();
          break;
        case 'services':
          this.handleServicesQuestion();
          break;
        case 'how-it-works':
          this.handleHowItWorksQuestion();
          break;
        case 'contact':
          this.handleContactRequest();
          break;
        case 'plan-selector':
          this.handlePlanSelector();
          break;
        case 'checkout':
          window.location.href = 'checkout.html?plan=website-growth-monthly';
          break;
      }
    }, 500);
  }

  handlePricingQuestion() {
    this.addBotMessage(
      "We offer flexible pricing options to fit your budget:\n\n" +
      "💼 **Website Packages:**\n" +
      "• Starter: $997 upfront + $97/mo (or $2,497 one-time)\n" +
      "• Growth: $1,497 upfront + $147/mo (or $3,497 one-time)\n" +
      "• Domination: $1,997 upfront + $197/mo (or $4,997 one-time)\n\n" +
      "📱 **CRM Platform:** Custom pricing, starting at $97/mo\n\n" +
      "All projects require 50% deposit, with the balance due on completion. Monthly charges start 30 days after delivery."
    );
    this.showQuickActions([
      { text: "🤖 Find My Perfect Plan", action: "plan-selector" },
      { text: "📋 See All Services", action: "services" },
      { text: "💳 Ready to Checkout", action: "checkout" }
    ]);
  }

  handleServicesQuestion() {
    this.addBotMessage(
      "We specialize in helping small businesses succeed online:\n\n" +
      "🌐 **Website Development**\n" +
      "Professional, mobile-responsive websites that convert visitors into customers\n\n" +
      "💼 **CRM Platform**\n" +
      "Manage your sales team, track commissions, and grow revenue\n\n" +
      "📱 **Mobile Apps**\n" +
      "Native iOS & Android applications\n\n" +
      "🎨 **Branding & Design**\n" +
      "Logo design and complete brand identity systems\n\n" +
      "All solutions include SEO, analytics, and ongoing support options."
    );
    this.showQuickActions([
      { text: "💰 View Pricing", action: "pricing" },
      { text: "🤖 Find My Perfect Plan", action: "plan-selector" },
      { text: "📞 Talk to Sales", action: "contact" }
    ]);
  }

  handleHowItWorksQuestion() {
    this.addBotMessage(
      "Our process is simple and transparent:\n\n" +
      "**1️⃣ Choose Your Plan**\n" +
      "Use our AI Plan Selector or browse our packages\n\n" +
      "**2️⃣ Checkout & Questionnaire**\n" +
      "Pay 50% deposit and fill out the project questionnaire\n\n" +
      "**3️⃣ Onboarding Call**\n" +
      "We'll call you within 24-48 hours to discuss your project\n\n" +
      "**4️⃣ Build & Launch**\n" +
      "We build your site with regular updates. Launch when you're happy!\n\n" +
      "**5️⃣ Ongoing Support**\n" +
      "Monthly plans include updates, maintenance, and optimization"
    );
    this.showQuickActions([
      { text: "🤖 Find My Perfect Plan", action: "plan-selector" },
      { text: "💰 View Pricing", action: "pricing" },
      { text: "🚀 Get Started Now", action: "checkout" }
    ]);
  }

  handleContactRequest() {
    this.addBotMessage(
      "Great! Here are the best ways to reach our team:\n\n" +
      "📞 **Phone:** [1-216-463-2648](tel:+12164632648)\n" +
      "Available for sales and onboarding support\n\n" +
      "📧 **Email:** josh@gideoncode.com\n\n" +
      "💬 **Contact Form:** [Click here to send us a message](/contact.html)\n\n" +
      "We typically respond within a few hours during business hours!"
    );
    this.showQuickActions([
      { text: "📋 Fill Contact Form", action: "contact-form" },
      { text: "💰 View Pricing First", action: "pricing" },
      { text: "🤖 Find My Perfect Plan", action: "plan-selector" }
    ]);
  }

  handlePlanSelector() {
    this.addBotMessage(
      "Perfect! Our AI Plan Selector will ask you a few quick questions and recommend the best package for your needs.\n\n" +
      "It only takes about 2 minutes. Ready to get started?"
    );
    this.showQuickActions([
      { text: "✨ Start Plan Selector", action: "start-plan-selector" },
      { text: "💰 Just Show Me Pricing", action: "pricing" }
    ]);
  }

  sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();

    if (!message) return;

    this.addUserMessage(message);
    input.value = '';

    // Process message
    setTimeout(() => {
      this.processUserMessage(message);
    }, 500);
  }

  processUserMessage(message) {
    const lowercaseMsg = message.toLowerCase();

    // Keyword detection
    if (lowercaseMsg.includes('price') || lowercaseMsg.includes('cost') || lowercaseMsg.includes('pricing')) {
      this.handlePricingQuestion();
    } else if (lowercaseMsg.includes('service') || lowercaseMsg.includes('what do you do')) {
      this.handleServicesQuestion();
    } else if (lowercaseMsg.includes('how') || lowercaseMsg.includes('process') || lowercaseMsg.includes('work')) {
      this.handleHowItWorksQuestion();
    } else if (lowercaseMsg.includes('contact') || lowercaseMsg.includes('call') || lowercaseMsg.includes('talk') || lowercaseMsg.includes('human')) {
      this.handleContactRequest();
    } else if (lowercaseMsg.includes('crm')) {
      this.addBotMessage(
        "Our CRM Platform is perfect for businesses with sales teams!\n\n" +
        "**Features include:**\n" +
        "• Sales pipeline management\n" +
        "• Commission tracking\n" +
        "• Team performance analytics\n" +
        "• Real-time dashboards\n" +
        "• Mobile access\n\n" +
        "Pricing is custom based on your team size. Want to see a demo?"
      );
      this.showQuickActions([
        { text: "🎯 View CRM Demo", action: "crm-demo" },
        { text: "💰 Get Pricing Quote", action: "contact" },
        { text: "📞 Call Sales Team", action: "contact" }
      ]);
    } else if (lowercaseMsg.includes('timeline') || lowercaseMsg.includes('how long')) {
      this.addBotMessage(
        "Project timelines vary based on complexity:\n\n" +
        "⚡ **Starter sites:** 1-2 weeks\n" +
        "🚀 **Growth sites:** 2-3 weeks\n" +
        "💎 **Domination sites:** 3-4 weeks\n" +
        "📱 **Mobile apps:** 4-8 weeks\n\n" +
        "We can often expedite for urgent needs! Monthly support begins 30 days after launch."
      );
      this.showQuickActions([
        { text: "🤖 Find My Perfect Plan", action: "plan-selector" },
        { text: "💬 Discuss My Timeline", action: "contact" }
      ]);
    } else {
      // Generic response
      this.addBotMessage(
        "I'm here to help! I can answer questions about:\n\n" +
        "💰 Pricing and packages\n" +
        "🎨 Services we offer\n" +
        "⚡ How our process works\n" +
        "📱 CRM and mobile apps\n" +
        "⏰ Project timelines\n\n" +
        "What would you like to know more about?"
      );
      this.showQuickActions([
        { text: "💰 Pricing", action: "pricing" },
        { text: "🎨 Services", action: "services" },
        { text: "⚡ How It Works", action: "how-it-works" },
        { text: "📞 Contact Team", action: "contact" }
      ]);
    }
  }

  addUserMessage(text) {
    this.addMessage(text, 'user');
  }

  addBotMessage(text) {
    this.addMessage(text, 'bot');
  }

  addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message chatbot-message-${sender}`;

    // Convert markdown-style links and bold text
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="chatbot-link">$1</a>')
      .replace(/\n/g, '<br>');

    messageDiv.innerHTML = `
      ${sender === 'bot' ? '<div class="message-avatar">🤖</div>' : ''}
      <div class="message-bubble">${formattedText}</div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Hide quick actions when user sends message
    if (sender === 'user') {
      document.getElementById('quick-actions').innerHTML = '';
    }
  }
}

// Special action handlers
document.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  if (action === 'start-plan-selector') {
    window.location.href = 'plan-selector.html';
  } else if (action === 'crm-demo') {
    window.location.href = 'crm-demo.html';
  } else if (action === 'contact-form') {
    window.location.href = 'contact.html';
  }
});

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new GideonChatbot();
  });
} else {
  new GideonChatbot();
}
