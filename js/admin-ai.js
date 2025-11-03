/**
 * AI Command Center - Admin Tools
 * Deep AI integration for business management
 */

// AI Tool Definitions
const aiTools = {
  'business-intelligence': {
    title: '📊 Business Intelligence AI',
    description: 'Analyze your business data and get actionable insights',
    interface: `
      <div class="space-y-6">
        <div class="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
          <h3 class="text-lg font-bold text-cyan-400 mb-4">Quick Insights</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onclick="runAIAnalysis('revenue-forecast')" class="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left transition">
              <div class="text-2xl mb-2">📈</div>
              <div class="font-semibold text-white mb-1">Revenue Forecast</div>
              <div class="text-sm text-gray-400">Predict next quarter revenue</div>
            </button>
            <button onclick="runAIAnalysis('churn-risk')" class="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left transition">
              <div class="text-2xl mb-2">⚠️</div>
              <div class="font-semibold text-white mb-1">Churn Risk Analysis</div>
              <div class="text-sm text-gray-400">Identify at-risk clients</div>
            </button>
            <button onclick="runAIAnalysis('growth-opportunities')" class="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left transition">
              <div class="text-2xl mb-2">🚀</div>
              <div class="font-semibold text-white mb-1">Growth Opportunities</div>
              <div class="text-sm text-gray-400">Find untapped markets</div>
            </button>
            <button onclick="runAIAnalysis('team-performance')" class="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left transition">
              <div class="text-2xl mb-2">👥</div>
              <div class="font-semibold text-white mb-1">Team Performance</div>
              <div class="text-sm text-gray-400">Analyze sales team metrics</div>
            </button>
          </div>
        </div>

        <div id="analysis-results" class="hidden">
          <!-- Results will be shown here -->
        </div>
      </div>
    `
  },

  'content-generator': {
    title: '✍️ Content Generator AI',
    description: 'Create high-quality content in seconds',
    interface: `
      <div class="space-y-6">
        <div>
          <label class="block text-sm text-gray-400 mb-2">Content Type</label>
          <select id="content-type" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
            <option value="proposal">Client Proposal</option>
            <option value="email-cold">Cold Outreach Email</option>
            <option value="email-followup">Follow-up Email</option>
            <option value="social-post">Social Media Post</option>
            <option value="blog-post">Blog Post</option>
            <option value="ad-copy">Ad Copy</option>
            <option value="landing-page">Landing Page Copy</option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-gray-400 mb-2">Context / Brief</label>
          <textarea id="content-brief" rows="4" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" placeholder="E.g., 'Create a proposal for an e-commerce website for a local bakery. They have 100 products and want online ordering...'"></textarea>
        </div>

        <div>
          <label class="block text-sm text-gray-400 mb-2">Tone</label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="tone" value="professional" checked class="text-cyan-500">
              <span class="text-white">Professional</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="tone" value="friendly" class="text-cyan-500">
              <span class="text-white">Friendly</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="tone" value="casual" class="text-cyan-500">
              <span class="text-white">Casual</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="tone" value="urgent" class="text-cyan-500">
              <span class="text-white">Urgent</span>
            </label>
          </div>
        </div>

        <button onclick="generateContent()" class="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg transition">
          Generate Content →
        </button>

        <div id="generated-content" class="hidden">
          <!-- Generated content will appear here -->
        </div>
      </div>
    `
  },

  'lead-scoring': {
    title: '🎯 Lead Scoring AI',
    description: 'Automatically score and prioritize leads',
    interface: `
      <div class="space-y-6">
        <div class="bg-magenta-500/10 border border-magenta-500/30 rounded-lg p-6">
          <h3 class="text-lg font-bold text-magenta-400 mb-4">Auto-Scoring Status</h3>
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="text-2xl font-bold text-white">147 leads</div>
              <div class="text-sm text-gray-400">Scored this month</div>
            </div>
            <div class="text-right">
              <div class="text-green-400 font-semibold mb-1">✓ Enabled</div>
              <div class="text-xs text-gray-500">Running 24/7</div>
            </div>
          </div>
          <div class="bg-gray-800 rounded-lg p-4">
            <div class="text-sm text-gray-400 mb-2">Scoring Criteria (Weighted)</div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-300">Budget mentioned</span>
                <span class="text-cyan-400">35%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Timeline urgency</span>
                <span class="text-cyan-400">25%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Industry fit</span>
                <span class="text-cyan-400">20%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Engagement level</span>
                <span class="text-cyan-400">15%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Company size</span>
                <span class="text-cyan-400">5%</span>
              </div>
            </div>
          </div>
        </div>

        <button onclick="viewLeadScores()" class="w-full bg-gradient-to-r from-magenta-500 to-magenta-600 hover:from-magenta-600 hover:to-magenta-700 text-white font-semibold px-6 py-3 rounded-lg transition">
          View All Scored Leads →
        </button>

        <div id="lead-scores-list" class="hidden">
          <!-- Lead scores will appear here -->
        </div>
      </div>
    `
  },

  'email-assistant': {
    title: '📧 Email Assistant AI',
    description: 'Draft perfect emails in seconds',
    interface: `
      <div class="space-y-6">
        <div>
          <label class="block text-sm text-gray-400 mb-2">Email Type</label>
          <select id="email-type" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
            <option value="cold-outreach">Cold Outreach</option>
            <option value="follow-up">Follow-up</option>
            <option value="proposal-send">Proposal Send</option>
            <option value="onboarding">Client Onboarding</option>
            <option value="check-in">Project Check-in</option>
            <option value="upsell">Upsell Opportunity</option>
            <option value="testimonial-request">Testimonial Request</option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-gray-400 mb-2">Recipient</label>
          <input type="text" id="email-recipient" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" placeholder="Company name or contact name">
        </div>

        <div>
          <label class="block text-sm text-gray-400 mb-2">Context / Key Points</label>
          <textarea id="email-context" rows="3" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" placeholder="E.g., 'Met at networking event, they mentioned needing a new website, budget around $5k'"></textarea>
        </div>

        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" id="include-cta" checked class="text-cyan-500">
            <span class="text-white text-sm">Include CTA</span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" id="include-calendar" class="text-cyan-500">
            <span class="text-white text-sm">Include Calendar Link</span>
          </label>
        </div>

        <button onclick="generateEmail()" class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition">
          Generate Email →
        </button>

        <div id="generated-email" class="hidden">
          <!-- Generated email will appear here -->
        </div>
      </div>
    `
  },

  'project-estimator': {
    title: '⏱️ Project Estimator AI',
    description: 'Get instant project estimates',
    interface: `
      <div class="space-y-6">
        <div>
          <label class="block text-sm text-gray-400 mb-2">Project Type</label>
          <select id="project-type" onchange="updateProjectQuestions()" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
            <option value="website-basic">Basic Website</option>
            <option value="website-advanced">Advanced Website</option>
            <option value="ecommerce">E-commerce Site</option>
            <option value="web-app">Web Application</option>
            <option value="mobile-app">Mobile App</option>
            <option value="branding">Branding Package</option>
          </select>
        </div>

        <div id="project-questions">
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Number of pages/screens</label>
              <input type="number" id="num-pages" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" value="5">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Complexity Level</label>
              <select id="complexity" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
                <option value="low">Low - Simple layout, standard features</option>
                <option value="medium">Medium - Custom design, some integrations</option>
                <option value="high">High - Complex functionality, multiple integrations</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Required Features (select all that apply)</label>
              <div class="space-y-2">
                <label class="flex items-center space-x-2"><input type="checkbox" value="cms"><span class="text-white">CMS</span></label>
                <label class="flex items-center space-x-2"><input type="checkbox" value="auth"><span class="text-white">User Authentication</span></label>
                <label class="flex items-center space-x-2"><input type="checkbox" value="payment"><span class="text-white">Payment Processing</span></label>
                <label class="flex items-center space-x-2"><input type="checkbox" value="api"><span class="text-white">API Integrations</span></label>
                <label class="flex items-center space-x-2"><input type="checkbox" value="seo"><span class="text-white">Advanced SEO</span></label>
              </div>
            </div>
          </div>
        </div>

        <button onclick="estimateProject()" class="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition">
          Calculate Estimate →
        </button>

        <div id="project-estimate" class="hidden">
          <!-- Estimate will appear here -->
        </div>
      </div>
    `
  },

  'competitor-intel': {
    title: '🔍 Competitor Intelligence',
    description: 'Monitor your competition',
    interface: `
      <div class="space-y-6">
        <div class="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
          <h3 class="text-lg font-bold text-purple-400 mb-4">Tracked Competitors</h3>
          <div class="space-y-3">
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="font-semibold text-white">WebFlow Pro Studios</div>
                <span class="text-xs text-gray-500">Last updated: 2h ago</span>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div class="text-gray-400">Starting Price</div>
                  <div class="text-white">$3,500</div>
                </div>
                <div>
                  <div class="text-gray-400">Avg Timeline</div>
                  <div class="text-white">3-4 weeks</div>
                </div>
              </div>
            </div>
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="font-semibold text-white">Digital Dreams Agency</div>
                <span class="text-xs text-gray-500">Last updated: 5h ago</span>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div class="text-gray-400">Starting Price</div>
                  <div class="text-white">$4,200</div>
                </div>
                <div>
                  <div class="text-gray-400">Avg Timeline</div>
                  <div class="text-white">4-6 weeks</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button onclick="generateCompetitorReport()" class="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition">
          Generate Full Report →
        </button>

        <div id="competitor-report" class="hidden">
          <!-- Report will appear here -->
        </div>
      </div>
    `
  },

  'client-predictor': {
    title: '🔮 Client Success Predictor',
    description: 'Predict client outcomes and risks',
    interface: `
      <div class="space-y-6">
        <div class="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
          <h3 class="text-lg font-bold text-cyan-400 mb-4">Active Predictions</h3>
          <div class="space-y-3">
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="font-semibold text-white">TechStart Solutions</div>
                <span class="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">High Success</span>
              </div>
              <div class="text-sm text-gray-400 mb-3">Project: E-commerce Platform</div>
              <div class="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div class="bg-green-500 h-2 rounded-full" style="width: 89%"></div>
              </div>
              <div class="text-xs text-gray-500">89% likelihood of on-time delivery & satisfaction</div>
            </div>

            <div class="bg-gray-800 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="font-semibold text-white">Local Bakery Co</div>
                <span class="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">Needs Attention</span>
              </div>
              <div class="text-sm text-gray-400 mb-3">Project: Basic Website</div>
              <div class="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div class="bg-yellow-500 h-2 rounded-full" style="width: 62%"></div>
              </div>
              <div class="text-xs text-gray-500">Low engagement - schedule check-in call</div>
            </div>

            <div class="bg-gray-800 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="font-semibold text-white">Metro Fitness</div>
                <span class="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded">At Risk</span>
              </div>
              <div class="text-sm text-gray-400 mb-3">Project: Mobile App</div>
              <div class="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div class="bg-red-500 h-2 rounded-full" style="width: 34%"></div>
              </div>
              <div class="text-xs text-gray-500">34% risk of churn - immediate intervention needed</div>
            </div>
          </div>
        </div>

        <button onclick="runClientPrediction()" class="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg transition">
          Run Full Analysis →
        </button>
      </div>
    `
  },

  'meeting-summarizer': {
    title: '🎙️ Meeting Summarizer',
    description: 'Auto-transcribe and summarize calls',
    interface: `
      <div class="space-y-6">
        <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
          <h3 class="text-lg font-bold text-green-400 mb-4">Recent Meetings</h3>
          <div class="space-y-3">
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="font-semibold text-white">Discovery Call - Sarah Chen</div>
                <span class="text-xs text-gray-500">Today, 2:30 PM</span>
              </div>
              <div class="text-sm text-gray-400 mb-2">Duration: 32 minutes</div>
              <button onclick="viewMeetingSummary('sarah-chen')" class="text-cyan-400 hover:text-cyan-300 text-sm">View AI Summary →</button>
            </div>

            <div class="bg-gray-800 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="font-semibold text-white">Project Kickoff - TechVentures</div>
                <span class="text-xs text-gray-500">Yesterday, 10:00 AM</span>
              </div>
              <div class="text-sm text-gray-400 mb-2">Duration: 47 minutes</div>
              <button onclick="viewMeetingSummary('techventures')" class="text-cyan-400 hover:text-cyan-300 text-sm">View AI Summary →</button>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm text-gray-400 mb-2">Upload Recording</label>
          <div class="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-cyan-500 transition cursor-pointer">
            <div class="text-4xl mb-2">🎙️</div>
            <div class="text-white font-semibold mb-1">Drop audio file here</div>
            <div class="text-sm text-gray-400">or click to browse</div>
            <div class="text-xs text-gray-500 mt-2">Supports MP3, WAV, M4A (max 100MB)</div>
          </div>
        </div>
      </div>
    `
  },

  'social-media': {
    title: '📱 Social Media AI',
    description: 'Generate social content automatically',
    interface: `
      <div class="space-y-6">
        <div>
          <label class="block text-sm text-gray-400 mb-2">Platform</label>
          <select id="social-platform" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter/X</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-gray-400 mb-2">Post Type</label>
          <select id="post-type" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white">
            <option value="project-showcase">Project Showcase</option>
            <option value="tip">Industry Tip</option>
            <option value="case-study">Case Study</option>
            <option value="testimonial">Client Testimonial</option>
            <option value="team">Team Highlight</option>
            <option value="engagement">Engagement Question</option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-gray-400 mb-2">Topic / Details</label>
          <textarea id="social-details" rows="3" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" placeholder="E.g., 'We just launched an e-commerce site for a local bakery that increased their online orders by 150%'"></textarea>
        </div>

        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" id="include-hashtags" checked class="text-cyan-500">
            <span class="text-white text-sm">Include Hashtags</span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" id="include-emoji" checked class="text-cyan-500">
            <span class="text-white text-sm">Include Emojis</span>
          </label>
        </div>

        <button onclick="generateSocialPost()" class="bg-gradient-to-r from-magenta-500 to-pink-600 hover:from-magenta-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-lg transition">
          Generate Post →
        </button>

        <div id="generated-social" class="hidden">
          <!-- Generated post will appear here -->
        </div>
      </div>
    `
  }
};

// Modal Functions
function openAITool(toolId) {
  const tool = aiTools[toolId];
  if (!tool) return;

  document.getElementById('modal-title').innerHTML = tool.title;
  document.getElementById('modal-content').innerHTML = `
    <div class="mb-6 text-gray-300">${tool.description}</div>
    ${tool.interface}
  `;
  document.getElementById('ai-tool-modal').classList.remove('hidden');
  document.getElementById('ai-tool-modal').classList.add('flex');
}

function closeAITool() {
  document.getElementById('ai-tool-modal').classList.add('hidden');
  document.getElementById('ai-tool-modal').classList.remove('flex');
}

// AI Analysis Functions
function runAIAnalysis(type) {
  const resultsDiv = document.getElementById('analysis-results');
  resultsDiv.classList.remove('hidden');

  let content = '';

  switch(type) {
    case 'revenue-forecast':
      content = `
        <div class="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
          <h4 class="text-xl font-bold text-cyan-400 mb-4">📈 Revenue Forecast - Q1 2025</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="text-sm text-gray-400 mb-1">Projected Revenue</div>
              <div class="text-2xl font-bold text-white">$127,500</div>
              <div class="text-sm text-green-400">+23% vs Q4 2024</div>
            </div>
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="text-sm text-gray-400 mb-1">Expected Deals</div>
              <div class="text-2xl font-bold text-white">28</div>
              <div class="text-sm text-cyan-400">Pipeline confidence: 87%</div>
            </div>
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="text-sm text-gray-400 mb-1">Avg Deal Size</div>
              <div class="text-2xl font-bold text-white">$4,553</div>
              <div class="text-sm text-gray-400">+12% vs Q4</div>
            </div>
          </div>
          <div class="bg-gray-800 rounded-lg p-4">
            <div class="text-sm font-semibold text-white mb-3">Key Insights:</div>
            <ul class="space-y-2 text-sm text-gray-300">
              <li>✓ Monthly packages showing 35% higher retention than one-time</li>
              <li>✓ E-commerce projects have highest average deal value ($6,200)</li>
              <li>✓ 12 high-value leads in pipeline (>$5k each)</li>
              <li>⚠️ Q1 typically slower - consider early-bird promotion</li>
            </ul>
          </div>
        </div>
      `;
      break;

    case 'churn-risk':
      content = `
        <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <h4 class="text-xl font-bold text-red-400 mb-4">⚠️ Churn Risk Analysis</h4>
          <div class="space-y-3">
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="font-semibold text-white">Metro Fitness</div>
                <span class="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded">HIGH RISK</span>
              </div>
              <div class="text-sm text-gray-400 mb-2">Monthly Plan: $147/mo • Enrolled: 4 months</div>
              <div class="text-sm text-gray-300 mb-3">
                <strong>Risk Factors:</strong>
                <ul class="mt-1 ml-4 space-y-1">
                  <li>• No support tickets in 60 days (unusual)</li>
                  <li>• Site traffic down 40% last month</li>
                  <li>• Payment delayed last billing cycle</li>
                </ul>
              </div>
              <button class="text-cyan-400 hover:text-cyan-300 text-sm">→ Schedule Retention Call</button>
            </div>

            <div class="bg-gray-800 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="font-semibold text-white">Urban Salon</div>
                <span class="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">MEDIUM RISK</span>
              </div>
              <div class="text-sm text-gray-400 mb-2">Monthly Plan: $97/mo • Enrolled: 8 months</div>
              <div class="text-sm text-gray-300 mb-3">
                <strong>Risk Factors:</strong>
                <ul class="mt-1 ml-4 space-y-1">
                  <li>• Decreased engagement with monthly updates</li>
                  <li>• Mentioned budget concerns in last call</li>
                </ul>
              </div>
              <button class="text-cyan-400 hover:text-cyan-300 text-sm">→ Send Value Reminder Email</button>
            </div>
          </div>
        </div>
      `;
      break;

    case 'growth-opportunities':
      content = `
        <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
          <h4 class="text-xl font-bold text-green-400 mb-4">🚀 Growth Opportunities</h4>
          <div class="space-y-4">
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="font-semibold text-white mb-2">1. Expand to Medical/Healthcare Vertical</div>
              <div class="text-sm text-gray-300 mb-3">
                3 recent inquiries from healthcare providers. Average deal size 40% higher ($5,600 vs $4,000). Low competition in local market.
              </div>
              <div class="text-sm">
                <span class="text-cyan-400 font-semibold">Potential:</span>
                <span class="text-white ml-2">$16,800/mo additional revenue</span>
              </div>
            </div>

            <div class="bg-gray-800 rounded-lg p-4">
              <div class="font-semibold text-white mb-2">2. Launch SEO Add-On Package</div>
              <div class="text-sm text-gray-300 mb-3">
                7 existing clients asking about SEO. Package at $297/mo would serve 40% of client base. Low implementation cost.
              </div>
              <div class="text-sm">
                <span class="text-cyan-400 font-semibold">Potential:</span>
                <span class="text-white ml-2">$8,316/mo from existing clients</span>
              </div>
            </div>

            <div class="bg-gray-800 rounded-lg p-4">
              <div class="font-semibold text-white mb-2">3. Referral Program for Clients</div>
              <div class="text-sm text-gray-300 mb-3">
                12% of new clients come from referrals. Formal program with incentives could 3x that rate.
              </div>
              <div class="text-sm">
                <span class="text-cyan-400 font-semibold">Potential:</span>
                <span class="text-white ml-2">6-8 additional deals per quarter</span>
              </div>
            </div>
          </div>
        </div>
      `;
      break;

    case 'team-performance':
      content = `
        <div class="bg-magenta-500/10 border border-magenta-500/30 rounded-lg p-6">
          <h4 class="text-xl font-bold text-magenta-400 mb-4">👥 Team Performance Analysis</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="text-sm text-gray-400 mb-2">Top Performer</div>
              <div class="text-lg font-bold text-white">Sarah Martinez</div>
              <div class="text-sm text-cyan-400">$32,500 closed this month</div>
            </div>
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="text-sm text-gray-400 mb-2">Avg Response Time</div>
              <div class="text-lg font-bold text-white">2.3 hours</div>
              <div class="text-sm text-green-400">-30min vs last month</div>
            </div>
          </div>
          <div class="bg-gray-800 rounded-lg p-4">
            <div class="text-sm font-semibold text-white mb-3">Recommendations:</div>
            <ul class="space-y-2 text-sm text-gray-300">
              <li>💡 Mike's conversion rate dropped 15% - schedule coaching session</li>
              <li>💡 Sarah's closing rate 23% above team avg - document her process</li>
              <li>💡 Team working 12% more hours - consider hiring another rep</li>
            </ul>
          </div>
        </div>
      `;
      break;
  }

  resultsDiv.innerHTML = content;
}

// Content Generation
function generateContent() {
  const type = document.getElementById('content-type').value;
  const brief = document.getElementById('content-brief').value;
  const tone = document.querySelector('input[name="tone"]:checked').value;

  if (!brief) {
    alert('Please provide a brief for the content');
    return;
  }

  const resultDiv = document.getElementById('generated-content');
  resultDiv.classList.remove('hidden');

  // Simulate AI generation
  resultDiv.innerHTML = `
    <div class="bg-gray-800 rounded-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-bold text-white">Generated Content</h4>
        <button onclick="copyToClipboard('generated-text')" class="text-cyan-400 hover:text-cyan-300 text-sm">Copy to Clipboard</button>
      </div>
      <div id="generated-text" class="bg-black rounded-lg p-4 text-gray-300 whitespace-pre-wrap font-mono text-sm">
Subject: Transform Your Online Presence - Custom Website Proposal

Hi [Client Name],

Thank you for expressing interest in working with Gideon Code Works. Based on our conversation, I've put together a custom proposal for your ${brief.slice(0, 50)}...

**Project Overview:**
We'll build a professional, mobile-responsive website that showcases your products and enables seamless online ordering for your customers.

**What's Included:**
• Custom design matching your brand
• Up to 10 pages
• Product catalog with high-quality photos
• Integrated online ordering system
• Mobile-responsive design
• SEO optimization
• 60 days of post-launch support

**Investment:**
Setup: $3,497 (one-time)
Monthly Management: $147/mo (optional)

**Timeline:**
3-4 weeks from deposit to launch

I'd love to discuss this further. When would be a good time for a brief call this week?

Best regards,
Josh Stone
Gideon Code Works
1-216-463-2648
      </div>
    </div>
  `;
}

// Email Generation
function generateEmail() {
  const type = document.getElementById('email-type').value;
  const recipient = document.getElementById('email-recipient').value;
  const context = document.getElementById('email-context').value;

  if (!recipient || !context) {
    alert('Please fill in recipient and context');
    return;
  }

  const resultDiv = document.getElementById('generated-email');
  resultDiv.classList.remove('hidden');

  resultDiv.innerHTML = `
    <div class="bg-gray-800 rounded-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-bold text-white">Generated Email</h4>
        <div class="space-x-2">
          <button onclick="regenerateEmail()" class="text-gray-400 hover:text-white text-sm">↻ Regenerate</button>
          <button onclick="copyToClipboard('email-text')" class="text-cyan-400 hover:text-cyan-300 text-sm">Copy</button>
        </div>
      </div>
      <div id="email-text" class="bg-black rounded-lg p-4 space-y-3">
        <div><span class="text-gray-500">Subject:</span> <span class="text-white">Quick follow-up from [Event Name]</span></div>
        <div class="border-t border-gray-700 pt-3 text-gray-300">
Hi ${recipient},

Great meeting you at [event] yesterday! I enjoyed our conversation about ${context.slice(0, 50)}...

Based on what you shared, I think we could help you achieve [specific goal]. We specialize in building websites that generate leads and drive revenue for businesses like yours.

Would you be open to a quick 15-minute call this week to explore how we might work together?

Best regards,
Josh Stone
        </div>
      </div>
      <button onclick="sendToEmail()" class="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition">
        Send Email →
      </button>
    </div>
  `;
}

// Project Estimation
function estimateProject() {
  const resultDiv = document.getElementById('project-estimate');
  resultDiv.classList.remove('hidden');

  // Mock estimation logic
  const basePrice = 3000;
  const hourlyRate = 125;
  const estimatedHours = 24;
  const total = basePrice + Math.floor(Math.random() * 2000);

  resultDiv.innerHTML = `
    <div class="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-6">
      <h4 class="text-xl font-bold text-yellow-400 mb-6">Project Estimate</h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-gray-800 rounded-lg p-4">
          <div class="text-sm text-gray-400 mb-1">Estimated Timeline</div>
          <div class="text-2xl font-bold text-white">3-4 weeks</div>
          <div class="text-sm text-gray-400 mt-2">From deposit to launch</div>
        </div>
        <div class="bg-gray-800 rounded-lg p-4">
          <div class="text-sm text-gray-400 mb-1">Development Hours</div>
          <div class="text-2xl font-bold text-white">${estimatedHours} hrs</div>
          <div class="text-sm text-gray-400 mt-2">Design + Development</div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg p-6 mb-6">
        <div class="text-lg font-bold text-white mb-4">Pricing Options</div>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
            <div>
              <div class="font-semibold text-white">One-Time Build</div>
              <div class="text-sm text-gray-400">Full ownership, no monthly fees</div>
            </div>
            <div class="text-xl font-bold text-cyan-400">$${total.toLocaleString()}</div>
          </div>
          <div class="flex items-center justify-between p-4 bg-gray-900 rounded-lg border-2 border-cyan-500">
            <div>
              <div class="font-semibold text-white">Monthly Management</div>
              <div class="text-sm text-gray-400">Lower upfront + ongoing support</div>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold text-cyan-400">$${Math.floor(total * 0.4).toLocaleString()}</div>
              <div class="text-sm text-gray-400">+ $147/mo</div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg p-4">
        <div class="text-sm font-semibold text-white mb-2">Included in Estimate:</div>
        <ul class="text-sm text-gray-300 space-y-1">
          <li>✓ Custom design and branding</li>
          <li>✓ Mobile-responsive development</li>
          <li>✓ SEO optimization</li>
          <li>✓ Post-launch support</li>
          <li>✓ Content migration assistance</li>
        </ul>
      </div>

      <button onclick="exportEstimate()" class="mt-6 w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition">
        Export as PDF →
      </button>
    </div>
  `;
}

// Helper functions
function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).textContent;
  navigator.clipboard.writeText(text);
  alert('Copied to clipboard!');
}

function viewLeadScores() {
  // Implementation for viewing lead scores
  alert('Opening lead scores dashboard...');
}

function generateCompetitorReport() {
  alert('Generating comprehensive competitor analysis...');
}

function runClientPrediction() {
  alert('Running full client success analysis...');
}

function viewMeetingSummary(id) {
  alert('Loading meeting summary for: ' + id);
}

function generateSocialPost() {
  alert('Generating social media post...');
}

function regenerateEmail() {
  generateEmail();
}

function sendToEmail() {
  alert('Opening in email client...');
}

function exportEstimate() {
  alert('Exporting estimate as PDF...');
}

// Close modal on outside click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('ai-tool-modal');
  if (e.target === modal) {
    closeAITool();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAITool();
  }
});
