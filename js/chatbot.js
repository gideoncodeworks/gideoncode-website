/**
 * Gideon AI Assistant - REAL AI Chatbot
 * Connected to Claude/GPT via /api/ai-gateway
 */

class GideonChatbot {
  constructor() {
    this.isOpen = false;
    this.isMobile = window.innerWidth < 640;
    this.basePath = window.location.pathname.includes('/blog/') ? '../' : '';

    // Conversation history for context
    this.history = [];
    this.lead = { name: null, phone: null, email: null };
    this.isTyping = false;

    if (window.location.pathname.includes('chat.html')) return;
    this.init();
  }

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

  greet() {
    this.say("Hey there! 👋 I'm Gideon, your AI concierge. I can help you figure out exactly what you need - whether it's a new website, app, or just exploring your options. What brings you here today?");
    this.quickActions([
      { text: "💰 Pricing info", action: "pricing" },
      { text: "🚀 I need a website", action: "website" },
      { text: "💬 Just exploring", action: "exploring" }
    ]);
  }

  say(text) {
    const c = document.getElementById('chatbot-messages');
    if (!c) return;
    const d = document.createElement('div');
    d.className = 'chatbot-message chatbot-message-bot';
    d.innerHTML = `<div class="message-avatar"><img src="${this.basePath}images/gcw-g-icon.png" alt="G"></div><div class="message-bubble">${this.format(text)}</div>`;
    c.appendChild(d);
    c.scrollTop = c.scrollHeight;
    this.history.push({ role: 'assistant', content: text });
  }

  userSay(text) {
    const c = document.getElementById('chatbot-messages');
    if (!c) return;
    const d = document.createElement('div');
    d.className = 'chatbot-message chatbot-message-user';
    d.innerHTML = `<div class="message-bubble">${text}</div>`;
    c.appendChild(d);
    c.scrollTop = c.scrollHeight;
    this.history.push({ role: 'user', content: text });

    // Extract any contact info they share
    this.extractInfo(text);
  }

  format(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  showTyping() {
    const c = document.getElementById('chatbot-messages');
    if (!c) return;
    const d = document.createElement('div');
    d.className = 'chatbot-message chatbot-message-bot typing-indicator';
    d.id = 'typing-indicator';
    d.innerHTML = `<div class="message-avatar"><img src="${this.basePath}images/gcw-g-icon.png" alt="G"></div><div class="message-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
    c.appendChild(d);
    c.scrollTop = c.scrollHeight;
  }

  hideTyping() {
    const t = document.getElementById('typing-indicator');
    if (t) t.remove();
  }

  quickActions(actions) {
    const c = document.getElementById('chatbot-quick-actions');
    if (!c) return;
    c.innerHTML = actions.map(a => `<button class="quick-action-btn" data-action="${a.action}">${a.text}</button>`).join('');
    c.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.onclick = (e) => {
        const text = e.target.textContent;
        const action = e.target.dataset.action;
        this.userSay(text);
        this.clearActions();
        this.handleAction(action, text);
      };
    });
  }

  clearActions() {
    const c = document.getElementById('chatbot-quick-actions');
    if (c) c.innerHTML = '';
  }

  async handleAction(action, text) {
    // Map quick actions to good prompts for the AI
    const prompts = {
      pricing: "Tell me about your pricing and packages",
      website: "I need a new website for my business",
      exploring: "I'm just exploring my options right now",
      contact: "I'd like to talk to someone on your team",
      services: "What services do you offer?"
    };

    await this.getAIResponse(prompts[action] || text);
  }

  async send() {
    const input = document.getElementById('chatbot-input');
    const msg = input.value.trim();
    if (!msg || this.isTyping) return;

    this.userSay(msg);
    input.value = '';
    this.clearActions();

    await this.getAIResponse(msg);
  }

  async getAIResponse(userMessage) {
    this.isTyping = true;
    this.showTyping();

    // Build context from conversation history
    const context = this.history.slice(-10).map(m => `${m.role}: ${m.content}`).join('\n');
    const leadInfo = this.lead.name ? `\nVisitor name: ${this.lead.name}` : '';
    const pageInfo = `\nCurrent page: ${window.location.pathname}`;

    try {
      const response = await fetch('/api/ai-gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'concierge',
          payload: {
            context: context + leadInfo + pageInfo,
            question: userMessage
          }
        })
      });

      this.hideTyping();
      this.isTyping = false;

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      this.say(data.message || "I'm having trouble connecting right now. Give us a call at 216-463-2648!");

      // Show booking CTA if AI suggests it
      if (data.needsBooking) {
        this.quickActions([
          { text: "📞 Call 216-463-2648", action: "call" },
          { text: "📅 Schedule a call", action: "schedule" }
        ]);
      } else {
        // Show relevant follow-ups
        this.showContextualActions(userMessage);
      }

    } catch (error) {
      console.error('Chat error:', error);
      this.hideTyping();
      this.isTyping = false;

      // Fallback response
      this.say("I'm having a moment here 😅 But don't worry - you can reach our team directly at **216-463-2648** or shoot an email to **josh@gideoncode.com**. We typically respond within a few hours!");
      this.quickActions([
        { text: "📞 Call now", action: "call" },
        { text: "💰 Show pricing", action: "pricing" }
      ]);
    }
  }

  showContextualActions(lastMessage) {
    const m = lastMessage.toLowerCase();

    if (m.includes('price') || m.includes('cost')) {
      this.quickActions([
        { text: "📞 Talk to sales", action: "contact" },
        { text: "🚀 Get started", action: "website" }
      ]);
    } else if (m.includes('website') || m.includes('site')) {
      this.quickActions([
        { text: "💰 See pricing", action: "pricing" },
        { text: "📞 Talk to someone", action: "contact" }
      ]);
    } else {
      this.quickActions([
        { text: "💰 Pricing", action: "pricing" },
        { text: "🎨 Services", action: "services" },
        { text: "📞 Contact", action: "contact" }
      ]);
    }
  }

  extractInfo(msg) {
    // Extract phone
    const phoneMatch = msg.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
    if (phoneMatch) this.lead.phone = phoneMatch[1];

    // Extract email
    const emailMatch = msg.match(/([^\s@]+@[^\s@]+\.[^\s@]+)/);
    if (emailMatch) this.lead.email = emailMatch[1];

    // Extract name from "I'm X" or "my name is X"
    const nameMatch = msg.match(/(?:i'm|im|i am|my name is|call me|this is) ([a-z]+)/i);
    if (nameMatch) this.lead.name = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);

    // Send lead data if we have contact info
    if (this.lead.phone || this.lead.email) {
      this.sendLead();
    }
  }

  sendLead() {
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...this.lead,
          source: 'chatbot-ai',
          page: window.location.href,
          conversation: this.history.slice(-6),
          timestamp: new Date().toISOString()
        })
      }).catch(() => {});
    } catch(e) {}
  }
}

// Add typing indicator styles
const style = document.createElement('style');
style.textContent = `
  .typing-indicator .message-bubble {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 12px 16px;
  }
  .typing-indicator .dot {
    width: 8px;
    height: 8px;
    background: #64748b;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }
  .typing-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
  .typing-indicator .dot:nth-child(2) { animation-delay: -0.16s; }
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;
document.head.appendChild(style);

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new GideonChatbot());
} else {
  new GideonChatbot();
}
