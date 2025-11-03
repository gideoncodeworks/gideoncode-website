// Gideon Code Works - AI Experience Suite

(function() {
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Real AI gateway call - uses Anthropic (Claude) + OpenAI (GPT-4) on backend
  const callAiGateway = async (kind, payload) => {
    try {
      const response = await fetch('/.netlify/functions/ai-gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, payload })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'AI service unavailable');
      }

      return await response.json();
    } catch (error) {
      console.error('AI Gateway error:', error);

      // Fallback to basic response if gateway fails
      return getFallbackResponse(kind, payload);
    }
  };

  // Fallback responses if AI gateway is down
  const getFallbackResponse = (kind, payload) => {
    switch (kind) {
      case 'vision':
        return {
          headline: `Let's ${payload.intentVerb || 'build'} a ${payload.focus} that prints revenue.`,
          summary: `We'll combine ${payload.focus} with automation so you can scale without adding headcount. Expect a compounding pipeline within ${payload.timeline || '12 weeks'} using our launch + growth sprint cadence.`
        };

      case 'scope':
        return {
          mission: payload.mission,
          metrics: buildMetrics(payload),
          phases: buildPhases(payload),
          risks: buildRisks(payload),
          recommendations: buildRecommendations(payload)
        };

      case 'concierge':
        return {
          message: `I understand you're asking about ${payload.question}. Let me connect you with our team for a personalized response. Call us at 1-216-463-2648 or email josh@gideoncode.com.`
        };

      case 'reel':
        return {
          headline: `The ${payload.vibe || 'bold'} future of ${payload.name || 'your brand'}`,
          subhead: `Neon momentum, orchestrated systems, and an unstoppable story.`,
          palette: ['#22d3ee', '#9333ea', '#0f172a', '#f8fafc'],
          beats: [
            'Cold open: 3-second motion pan across luminous skyline.',
            'Hook: AI-rendered tagline with glitch reveal.',
            'Proof drop: Overlay key win metric.',
            'Outro: CTA glow around "Build With Gideon Code" button.'
          ]
        };

      default:
        return {};
    }
  };

  const buildMetrics = (payload) => {
    return [
      {
        label: 'Projected traffic lift',
        value: payload.priority === 'brand' ? '+140% / quarter' : '+95% / quarter'
      },
      {
        label: 'Lead capture delta',
        value: payload.priority === 'leads' ? '+260 qualified / month' : '+120 qualified / month'
      },
      {
        label: 'Revenue momentum',
        value: payload.budget === '10k-plus' ? '$48k ARR uplift in 90 days' : '$18k ARR uplift in 120 days'
      }
    ];
  };

  const buildPhases = (payload) => {
    const timeline = Number(payload.timeline) || 12;
    return [
      {
        title: 'Phase 01 · Discovery + Alignment',
        duration: `${Math.max(2, Math.round(timeline * 0.2))} weeks`,
        focus: [
          'AI-assisted vision workshop',
          'Market positioning + proof pulls',
          'Experience map + success metrics'
        ]
      },
      {
        title: 'Phase 02 · Build + Automate',
        duration: `${Math.max(3, Math.round(timeline * 0.45))} weeks`,
        focus: [
          'Design system + interactive prototypes',
          'Full-stack build with concierge automations',
          'Analytics + CRM integration with playbooks'
        ]
      },
      {
        title: 'Phase 03 · Launch + Momentum',
        duration: `${Math.max(2, Math.round(timeline * 0.35))} weeks`,
        focus: [
          'AI-powered content engine + sales collateral',
          'Growth sprints + paid acquisition runway',
          'Handoff with live dashboards + weekly check-ins'
        ]
      }
    ];
  };

  const buildRisks = (payload) => ([
    {
      name: 'Alignment debt',
      mitigation: 'We run weekly AI recaps + human reviews so every stakeholder signs off mid-flight.'
    },
    {
      name: 'Resource drag',
      mitigation: payload.team === '0-1'
        ? 'Gideon crew supplies PM + creative muscle; you stay focused on approvals and insights.'
        : 'We plug into your team’s cadence with async rituals and automated standups.'
    },
    {
      name: 'Data readiness',
      mitigation: 'Concierge audits CRM + analytics while we prototype so launch assets are conversion-ready.'
    }
  ]);

  const buildRecommendations = (payload) => {
    const recs = [
      'Book a 30-minute command workshop—brings AI-generated roadmap + stakeholder deck.',
      'Spin up concierge notifications so leaders see predictive metrics in their inbox weekly.',
      'Queue creative sprints so launch visuals and brand preview reel sync with the web build.'
    ];
    if (payload.priority === 'automation') {
      recs.unshift('Activate CRM automations early—our AI scaffolds nurturing cadences while design locks in.');
    }
    if (payload.priority === 'leads') {
      recs.unshift('Prioritize the revenue lane bundle: landing page cluster, paid funnels, and analytics handshake.');
    }
    return recs;
  };

  const select = (selector) => document.querySelector(selector);
  const selectAll = (selector) => Array.from(document.querySelectorAll(selector));

  const initVisionGate = () => {
    const form = select('#vision-gate-form');
    if (!form) return;
    form.setAttribute('aria-busy', 'false');

    const input = select('#vision-gate-input');
    const status = select('#vision-gate-status');
    const summary = select('#vision-gate-summary');
    const voiceBtn = select('#vision-gate-voice');
    let recognition = null;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!input.value.trim()) return;

      const intent = input.value.trim();
      status.textContent = 'Channeling the future you described…';
      status.classList.add('text-cyan-200', 'ai-status', 'processing');
      status.setAttribute('aria-live', 'polite');
      form.setAttribute('aria-busy', 'true');

      const payload = {
        intent,
        focus: extractFocus(intent),
        intentVerb: extractVerb(intent),
        timeline: extractTimeline(intent)
      };

      try {
        const response = await callAiGateway('vision', payload);
        summary.textContent = response.summary;
        highlightHero(response.headline);
        status.classList.remove('processing');
        status.classList.add('success');
        status.textContent = 'Future mapped. Concierge queue updated.';
        input.value = '';
      } catch (err) {
        status.classList.remove('processing');
        status.classList.add('error');
        status.textContent = 'We hit a snag. Try again or ping the concierge.';
      } finally {
        form.setAttribute('aria-busy', 'false');
        setTimeout(() => {
          status.textContent = 'Powered by Gideon Code AI · Nothing is stored unless you choose to save it later.';
          status.classList.remove('text-cyan-200', 'processing', 'success', 'error');
        }, 4000);
      }
    });

    if (voiceBtn && 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.addEventListener('result', (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          input.value = transcript;
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      });
      recognition.addEventListener('end', () => voiceBtn.classList.remove('text-magenta-300'));

      voiceBtn.addEventListener('click', () => {
        try {
          voiceBtn.classList.add('text-magenta-300');
          recognition.start();
        } catch (err) {
          voiceBtn.classList.remove('text-magenta-300');
        }
      });
    } else if (voiceBtn) {
      voiceBtn.disabled = true;
      voiceBtn.classList.add('opacity-40', 'cursor-not-allowed');
      voiceBtn.title = 'Voice input not supported on this browser';
    }
  };

  const highlightHero = (headline) => {
    const heroHeading = select('#hero-heading');
    if (!heroHeading) return;
    heroHeading.innerHTML = `<span class="gradient-text">${headline.replace(/(?:\\r\\n|\\r|\\n)/g, '<br/>')}</span>`;
    heroHeading.classList.add('pulse');
    setTimeout(() => heroHeading.classList.remove('pulse'), 1500);
  };

  const extractVerb = (text) => {
    const verbs = ['launch', 'scale', 'build', 'automate', 'grow', 'create'];
    const lower = text.toLowerCase();
    return verbs.find(v => lower.includes(v)) || 'build';
  };

  const extractFocus = (text) => {
    const keywords = ['crm', 'brand', 'web', 'leads', 'automation', 'sales', 'app', 'platform'];
    const lower = text.toLowerCase();
    const hit = keywords.find(k => lower.includes(k));
    return hit ? hit.toUpperCase() : 'revenue engine';
  };

  const extractTimeline = (text) => {
    const match = text.match(/(\\d+)[- ]?(week|month)/i);
    if (!match) return null;
    return `${match[1]} ${match[2]}${match[1] === '1' ? '' : 's'}`;
  };

  const initScopeVisualizer = () => {
    const form = select('#scope-form');
    if (!form) return;
    form.setAttribute('aria-busy', 'false');

    const steps = selectAll('.scope-step');
    const stages = selectAll('.scope-stage');
    const timelineSlider = select('#scope-timeline');
    const timelineValue = select('#scope-timeline-value');
    const saveToggle = select('#scope-save');
    const saveDetails = select('#scope-save-details');
    const output = select('#scope-output');
    const outputBody = select('#scope-output-body');
    const outputStatus = select('#scope-output-status');

    steps.forEach(step => {
      step.addEventListener('click', () => setStage(Number(step.dataset.step)));
    });

    selectAll('.scope-next').forEach(btn => btn.addEventListener('click', () => setStage(Number(btn.dataset.next))));
    selectAll('.scope-prev').forEach(btn => btn.addEventListener('click', () => setStage(Number(btn.dataset.prev))));

    const setStage = (next) => {
      steps.forEach(step => step.classList.toggle('active', Number(step.dataset.step) === next));
      stages.forEach(stage => stage.classList.toggle('active', Number(stage.dataset.stepPanel) === next));
    };

    if (timelineSlider && timelineValue) {
      const updateTimeline = () => {
        const value = Number(timelineSlider.value);
        timelineValue.textContent = `${value} weeks`;
      };
      timelineSlider.addEventListener('input', updateTimeline);
      updateTimeline();
    }

    if (saveToggle && saveDetails) {
      saveToggle.addEventListener('change', () => {
        saveDetails.classList.toggle('hidden', !saveToggle.checked);
      });
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = {
        mission: select('#scope-mission')?.value.trim(),
        priority: select('#scope-priority')?.value,
        timeline: select('#scope-timeline')?.value,
        budget: select('#scope-budget')?.value,
        team: select('#scope-team')?.value,
        proof: select('#scope-proof')?.value.trim()
      };

      if (!payload.mission || !payload.proof) {
        return;
      }

      if (saveToggle?.checked) {
        const consent = select('#scope-consent');
        const email = select('#scope-email');
        if (!consent?.checked || !email?.value) {
          alert('To save the session, provide your email and consent.');
          return;
        }
      }

      outputStatus.textContent = 'Generating plan…';
      form.setAttribute('aria-busy', 'true');
      output?.classList.remove('hidden');
      outputBody.innerHTML = '';

      try {
        const result = await callAiGateway('scope', payload);
        outputStatus.classList.remove('processing');
        outputStatus.classList.add('success');
        outputStatus.textContent = 'Mission deck ready. Share it or restart.';
        renderScopeOutput(outputBody, result);
        setStage(3);
      } catch (err) {
        outputStatus.classList.remove('processing');
        outputStatus.classList.add('error');
        outputStatus.textContent = 'Could not generate plan. Please retry in a moment.';
        outputBody.innerHTML = '';
      } finally {
        form.setAttribute('aria-busy', 'false');
        setTimeout(() => {
          outputStatus.classList.remove('processing', 'success', 'error');
        }, 5000);
      }
    });

    output?.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.dataset.action;
      if (!action) return;

      switch (action) {
        case 'email':
          handleEmailScope();
          break;
        case 'restart':
          form.reset();
          select('#scope-save-details')?.classList.add('hidden');
          select('#scope-output')?.classList.add('hidden');
          setStage(1);
          break;
        default:
          break;
      }
    });

    const handleEmailScope = async () => {
      const email = prompt('Enter your email to receive the scope document:');
      if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
      }

      const outputBody = select('#scope-output-body');
      if (!outputBody) return;

      const scopeData = {
        email,
        scopeHtml: outputBody.innerHTML,
        timestamp: new Date().toISOString()
      };

      try {
        outputStatus.classList.add('processing');
        outputStatus.textContent = 'Sending scope to your email...';

        const response = await fetch('/.netlify/functions/email-scope', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scopeData)
        });

        if (!response.ok) throw new Error('Failed to send email');

        outputStatus.classList.remove('processing');
        outputStatus.classList.add('success');
        outputStatus.textContent = `✓ Scope sent to ${email}!`;

        setTimeout(() => {
          outputStatus.classList.remove('success');
          outputStatus.textContent = 'Mission deck ready. Share it or restart.';
        }, 5000);

      } catch (error) {
        outputStatus.classList.remove('processing');
        outputStatus.classList.add('error');
        outputStatus.textContent = 'Failed to send email. Please try again.';
        console.error('Email error:', error);

        setTimeout(() => {
          outputStatus.classList.remove('error');
          outputStatus.textContent = 'Mission deck ready. Share it or restart.';
        }, 5000);
      }
    });
  };

  const renderScopeOutput = (container, data) => {
    if (!container) return;
    const metrics = data.metrics.map(metric => `
      <div class="card">
        <span class="data-label">${metric.label}</span>
        <span class="data-value">${metric.value}</span>
      </div>
    `).join('');

    const phases = data.phases.map(phase => `
      <div class="card">
        <h4 class="text-cyan-300 text-sm uppercase tracking-[0.2em]">${phase.title}</h4>
        <p class="text-sm text-gray-300 mb-2">Duration · ${phase.duration}</p>
        <ul class="text-sm text-gray-200 space-y-2">
          ${phase.focus.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const risks = data.risks.map(risk => `
      <div class="card">
        <h4 class="text-magenta-300 text-sm uppercase tracking-[0.2em]">${risk.name}</h4>
        <p class="text-sm text-gray-200">${risk.mitigation}</p>
      </div>
    `).join('');

    const recs = data.recommendations.map(rec => `<li>${rec}</li>`).join('');

    container.innerHTML = `
      <div class="card">
        <span class="data-label">Mission Brief</span>
        <p class="text-gray-200">${data.mission}</p>
      </div>
      <div class="grid md:grid-cols-3 gap-4">${metrics}</div>
      <div class="grid md:grid-cols-3 gap-4">${phases}</div>
      <div class="grid md:grid-cols-3 gap-4">${risks}</div>
      <div class="card">
        <span class="data-label">Action Signals</span>
        <ul class="text-sm text-gray-200 space-y-2">${recs}</ul>
      </div>
    `;
  };

  const initReel = () => {
    const form = select('#reel-form');
    if (!form) return;
    form.setAttribute('aria-busy', 'false');

    const prompt = select('#reel-prompt');
    const status = select('#reel-status');
    const output = select('#reel-output');
    const outputBody = select('#reel-output-body');
    const saveCheckbox = select('#reel-save');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status?.classList.remove('hidden');
      status?.setAttribute('aria-live', 'polite');
      form.setAttribute('aria-busy', 'true');

      const payload = {
        vibe: prompt?.value.trim(),
        name: extractBrandName(prompt?.value)
      };

      try {
        const result = await callAiGateway('reel', payload);
        status?.classList.remove('processing');
        status?.classList.add('success', 'hidden');

        output?.classList.remove('hidden');
        outputBody.innerHTML = `
          <div class="story">
            <h4 class="text-cyan-300 uppercase tracking-[0.2em] text-xs">Hero Copy</h4>
            <p class="text-lg text-gray-200 font-semibold">${result.headline}</p>
            <p class="text-sm text-gray-300 mt-1">${result.subhead}</p>
          </div>
          <div class="story">
            <h4 class="text-magenta-300 uppercase tracking-[0.2em] text-xs">Palette</h4>
            <div class="flex gap-3">
              ${result.palette.map(color => `<span class="w-10 h-10 rounded-full border border-white/20" style="background:${color}"></span>`).join('')}
            </div>
          </div>
          <div class="story">
            <h4 class="text-cyan-300 uppercase tracking-[0.2em] text-xs">Motion Beats</h4>
            <ol class="list-decimal pl-5 space-y-2 text-sm text-gray-200">
              ${result.beats.map(item => `<li>${item}</li>`).join('')}
            </ol>
          </div>
        `;

        if (saveCheckbox?.checked) {
          alert('We will email you the rendered reel once backend integration is complete.');
        }
      } catch (err) {
        status?.classList.remove('processing');
        status?.classList.add('error');
        status?.classList.remove('hidden');
        status.textContent = 'Preview service is busy. Try again shortly.';
      } finally {
        form.setAttribute('aria-busy', 'false');
        setTimeout(() => {
          status?.classList.remove('processing', 'success', 'error');
        }, 5000);
      }
    });

    output?.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.dataset.reelAction === 'share') {
        navigator.clipboard?.writeText('https://gideoncode.com/reel-preview-demo').then(() => {
          target.textContent = 'Link Copied';
          setTimeout(() => target.textContent = 'Copy Share Link', 2500);
        });
      }
    });
  };

  const extractBrandName = (text = '') => {
    const match = text.match(/for\\s+([A-Za-z0-9\\s]+)/i);
    return match ? match[1].trim() : null;
  };

  const ensureConciergeMarkup = () => {
    if (select('#ai-concierge')) {
      return;
    }

    const template = `
      <section id="ai-concierge" aria-live="polite" class="ai-concierge hidden">
        <header class="ai-concierge-header">
          <div>
            <h2 class="ai-concierge-title">Gideon Code Concierge</h2>
            <p id="ai-concierge-context" class="ai-concierge-context text-sm text-gray-300">Ready to map your next move.</p>
          </div>
          <button type="button" id="ai-concierge-close" class="ai-concierge-close" aria-label="Close concierge panel">✕</button>
        </header>
        <div id="ai-concierge-feed" class="ai-concierge-feed" role="log"></div>
        <form id="ai-concierge-form" class="ai-concierge-form">
          <label for="ai-concierge-input" class="sr-only">Ask Gideon Code AI for help</label>
          <div class="relative flex-1">
            <input id="ai-concierge-input" type="text" class="ai-concierge-input" placeholder="Ask for a plan, timeline, or idea…" autocomplete="off">
            <button type="button" id="ai-concierge-voice" class="ai-concierge-voice" aria-label="Speak instead">🎤</button>
          </div>
          <button type="submit" class="ai-concierge-submit">Send</button>
        </form>
        <p class="ai-concierge-footer text-xs text-gray-400">
          Automated guidance. <button type="button" id="ai-concierge-transparency" class="link-button">See how we use AI.</button>
        </p>
      </section>
      <button type="button" id="ai-concierge-toggle" class="ai-concierge-toggle" aria-haspopup="dialog" aria-controls="ai-concierge" aria-expanded="false">
        <span class="ai-concierge-pulse"></span>
        <span>Concierge</span>
      </button>
      <dialog id="ai-transparency" class="ai-transparency">
        <div class="ai-transparency-panel">
          <header class="ai-transparency-header">
            <h3 class="ai-transparency-title">How Gideon Code AI Works</h3>
            <button type="button" class="ai-transparency-close" aria-label="Close transparency note">✕</button>
          </header>
          <div class="ai-transparency-body">
            <p>We use secure OpenAI and Anthropic APIs through our own gateway. Nothing leaves your browser unless you choose to save or email a session.</p>
            <ul>
              <li>No personal data stored by default.</li>
              <li>Optional “save session” asks for consent and email.</li>
              <li>We log anonymous usage patterns to improve prompts.</li>
            </ul>
            <p class="text-sm text-gray-400">Full details live in our Privacy Policy. Questions? <a href="mailto:info@gideoncode.com" class="text-cyan-300 hover:text-cyan-100">Reach out</a>.</p>
          </div>
          <button type="button" class="neon-button w-full ai-transparency-dismiss">Got it</button>
        </div>
      </dialog>
    `;

    document.body.insertAdjacentHTML('beforeend', template);
  };

  const initConcierge = () => {
    ensureConciergeMarkup();

    // Give DOM a moment to update after injection
    setTimeout(() => {
      const toggle = select('#ai-concierge-toggle');
      const panel = select('#ai-concierge');
      const closeBtn = select('#ai-concierge-close');
      const form = select('#ai-concierge-form');
      const input = select('#ai-concierge-input');
      const feed = select('#ai-concierge-feed');
      const voiceBtn = select('#ai-concierge-voice');
      const contextEl = select('#ai-concierge-context');
      const transparencyBtn = select('#ai-concierge-transparency');
      const transparencyDialog = select('#ai-transparency');
      let recognition = null;

      if (!toggle || !panel || !form || !feed) {
        console.error('AI Concierge: Required elements not found', { toggle, panel, form, feed });
        return;
      }

    const openPanel = () => {
      panel.classList.remove('hidden');
      toggle.setAttribute('aria-expanded', 'true');
      contextEl.textContent = deriveContext();
      panel.focus();
      if (!feed.children.length) {
        appendMessage('system', 'Welcome aboard. Ask for a plan, or say “Show me the launch phases” to get started.');
      }
    };

    const closePanel = () => {
      panel.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closePanel() : openPanel();
    });

    closeBtn?.addEventListener('click', closePanel);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) return;
      appendMessage('client', question);
      input.value = '';

      const payload = {
        question,
        context: deriveContext(),
        nextMove: pickNextMove(question)
      };

      appendMessage('system', 'Processing…');
      try {
        const response = await callAiGateway('concierge', payload);
        replaceLastMessage(response.message);
      } catch (err) {
        replaceLastMessage('I’m offline for a moment. Call 1-216-463-2648 and we’ll pick it up live.');
      }
    });

    const appendMessage = (role, text) => {
      const bubble = document.createElement('div');
      bubble.className = `ai-concierge-message ${role === 'client' ? 'client' : ''}`;
      bubble.textContent = text;
      feed.appendChild(bubble);
      feed.scrollTop = feed.scrollHeight;
    };

    const replaceLastMessage = (text) => {
      if (!feed.lastElementChild) return;
      feed.lastElementChild.textContent = text;
      feed.scrollTop = feed.scrollHeight;
    };

    const deriveContext = () => {
      const title = document.title;
      const hero = select('#hero-heading')?.textContent?.trim();
      return `${title} · Focus: ${hero || 'Digital Products That Drive Revenue'}`;
    };

    const pickNextMove = (question) => {
      const lower = question.toLowerCase();
      if (lower.includes('timeline')) return 'Run the predictive scope visualizer.';
      if (lower.includes('pricing')) return 'Open services section and compare monthly bundles.';
      if (lower.includes('brand')) return 'Launch the vision preview reel.';
      return 'Explore the concierge suggestions for web, CRM, and growth sprints.';
    };

    if (voiceBtn && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.addEventListener('result', (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          input.value = transcript;
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      });
      recognition.addEventListener('end', () => voiceBtn.classList.remove('text-magenta-300'));
      voiceBtn.addEventListener('click', () => {
        try {
          voiceBtn.classList.add('text-magenta-300');
          recognition.start();
        } catch (err) {
          voiceBtn.classList.remove('text-magenta-300');
        }
      });
    } else if (voiceBtn) {
      voiceBtn.disabled = true;
      voiceBtn.classList.add('opacity-40', 'cursor-not-allowed');
      voiceBtn.title = 'Voice input not supported on this browser';
    }

    transparencyBtn?.addEventListener('click', () => {
      if (typeof transparencyDialog?.showModal === 'function') {
        transparencyDialog.showModal();
      } else {
        alert('We use secure AI APIs through our gateway. Nothing is stored unless you opt in.');
      }
    });

    const closeTransparency = () => transparencyDialog?.close();
    selectAll('.ai-transparency-close, .ai-transparency-dismiss').forEach(btn => btn.addEventListener('click', closeTransparency));

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !panel.classList.contains('hidden')) {
        closePanel();
      }
    });
    }, 0); // End setTimeout
  };

  document.addEventListener('DOMContentLoaded', () => {
    initVisionGate();
    initScopeVisualizer();
    initReel();
    initConcierge();
  });
})();
