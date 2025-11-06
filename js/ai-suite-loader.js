document.addEventListener('DOMContentLoaded', () => {
  const needsAISuite = document.querySelector('#vision-gate-form, #scope-form, #reel-form, #ai-concierge-toggle, [data-ai-suite]');
  if (!needsAISuite) {
    return;
  }
  const script = document.createElement('script');
  script.src = 'js/ai-suite.js?v=2';
  script.defer = true;
  document.body.appendChild(script);
});
