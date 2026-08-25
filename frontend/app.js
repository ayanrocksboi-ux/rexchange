// ═════════════════════════════════════════════════════════════════════════
//  REXchange — SRMIST KTR Intelligent Campus Ecosystem Logic (v9.1)
// ═════════════════════════════════════════════════════════════════════════

const API = '';
let campusMap = null;
let currentChatThread = 'harini';
let soundEnabled = true;
let countdownInterval = null;

// ── Web Audio Synthesizer ──────────────────────────────────────────────
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playChime() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch (e) {}
}

function playCoinSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(987.77, ctx.currentTime);
    osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch (e) {}
}

function playMessagePop() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  } catch (e) {}
}

function playSuccessFanfare() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.16, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.31);
    });
  } catch (e) {}
}

function triggerConfetti() {
  if (window.confetti) {
    window.confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00f2fe', '#4facfe', '#8b5cf6', '#10b981', '#f59e0b']
    });
  }
}

// ── State ──────────────────────────────────────────────────────────────
const state = {
  currentView: 'home', // Core Home ecosystem is primary default
  user: {
    full_name: 'Ayan Saha',
    dept: 'CSE Core',
    year: '1st Year',
    hostel: 'Paari Hostel',
    karma_score: 1240,
    rex_score: 92,
    rating: 4.9,
    exchanges_count: 23,
    ticket_transfers: 12,
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  },
  listings: [],
  smartMatches: [],
  demands: [],
  tickets: [],
  mapPins: []
};

// ── Init on DOM Ready ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  setupKeyboardShortcuts();
  await loadAllData();
  startCountdownEngine();
  lucide.createIcons();
  showView('home'); // Default to home view
});

async function loadAllData() {
  await Promise.all([
    fetchListings(),
    fetchSmartMatches(),
    fetchDemands(),
    fetchCampusPulse(),
    fetchLeaderboard(),
    fetchTickets(),
    fetchMapPins()
  ]);
}

function apiFetch(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  return fetch(API + url, { ...options, headers });
}

// ── Toast Alerts ───────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const colors = {
    success: 'bg-emerald-950/95 border-emerald-500/40 text-emerald-300',
    info:    'bg-cyan-950/95 border-cyan-500/40 text-cyan-300',
    warning: 'bg-amber-950/95 border-amber-500/40 text-amber-300',
    error:   'bg-rose-950/95 border-rose-500/40 text-rose-300',
  };
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = `px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl border backdrop-blur-xl flex items-center gap-2 pointer-events-auto transition duration-300 translate-y-2 opacity-0 ${colors[type] || colors.info}`;
  el.innerHTML = `<span>${msg}</span>`;
  container.appendChild(el);
  requestAnimationFrame(() => { el.classList.remove('translate-y-2', 'opacity-0'); });
  setTimeout(() => { el.classList.add('opacity-0', 'translate-y-2'); setTimeout(() => el.remove(), 300); }, 3800);
}

// ── View Switcher ──────────────────────────────────────────────────────
function showView(viewId) {
  playChime();
  state.currentView = viewId;

  const views = ['home', 'tickets', 'smart-match', 'demands', 'network', 'explore', 'messages', 'map', 'reputation', 'impact', 'leaderboard'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.classList.add('hidden');
    const navEl = document.getElementById(`nav-${v}`);
    if (navEl) navEl.classList.remove('active');
  });

  const target = document.getElementById(`view-${viewId}`);
  if (target) target.classList.remove('hidden');

  const targetNav = document.getElementById(`nav-${viewId}`);
  if (targetNav) targetNav.classList.add('active');

  const mobViews = ['home', 'smart-match', 'tickets', 'messages'];
  mobViews.forEach(v => {
    const mobEl = document.getElementById(`mob-${v}`);
    if (mobEl) mobEl.className = v === viewId ? 'flex flex-col items-center gap-1 text-cyan-400 font-bold' : 'flex flex-col items-center gap-1 text-slate-400';
  });

  if (viewId === 'map') setTimeout(initCampusMap, 150);
  if (viewId === 'smart-match') executeSmartMatchQuery();

  lucide.createIcons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Keyboard Shortcuts (Ctrl + K) ──────────────────────────────────────
function setupKeyboardShortcuts() {
  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const input = document.getElementById('globalSearchInput');
      if (input) { input.focus(); input.select(); }
    }
  });
}

function handleSearch(q) {
  clearTimeout(window._searchTimer);
  window._searchTimer = setTimeout(async () => {
    await fetchListings(null, q);
    if (state.currentView !== 'home' && state.currentView !== 'explore') showView('home');
  }, 250);
}

function filterCategory(cat) {
  playChime();
  const select = document.getElementById('exploreCategorySelect');
  if (select) select.value = cat;
  showView('explore');
  fetchListings(cat);
}

function handleExploreFilter(cat) {
  playChime();
  fetchListings(cat);
}

// ── 1. Fetch & Render Listings ─────────────────────────────────────────
async function fetchListings(cat = null, search = null) {
  try {
    const params = new URLSearchParams();
    if (cat && cat.toLowerCase() !== 'all') params.append('category', cat);
    if (search) params.append('search', search);

    const res = await apiFetch(`/api/listings?${params}`);
    const data = await res.json();
    state.listings = data.listings || [];
    renderListings();
  } catch (e) {}
}

function renderListings() {
  const homeGrid = document.getElementById('homeListingsGrid');
  const exploreGrid = document.getElementById('exploreGrid');
  const countBadge = document.getElementById('homeFeedCountBadge');

  if (countBadge) countBadge.textContent = `${state.listings.length} Active Resources in Campus`;

  const html = state.listings.map(item => `
    <div class="glass-card overflow-hidden flex flex-col group">
      <div class="relative h-44 bg-slate-900 overflow-hidden">
        <img src="${item.image_url}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-[#090c14] to-transparent pointer-events-none"></div>
        <span class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider badge-${item.exchange_type}">
          ${item.exchange_type}
        </span>
        <span class="absolute bottom-2.5 left-3 text-[10px] text-white font-bold flex items-center gap-1">
          <i data-lucide="map-pin" class="w-3 h-3 text-cyan-400"></i> ${item.distance_tag || item.location}
        </span>
      </div>

      <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span class="text-[10px] font-black text-cyan-400 uppercase tracking-wider">${item.category}</span>
          <h4 class="text-sm font-black text-white line-clamp-2 mt-0.5 group-hover:text-cyan-300 transition">${item.title}</h4>
          <p class="text-xs text-slate-400 mt-1 line-clamp-2 font-normal">${item.description}</p>
        </div>

        <div class="pt-3 border-t border-white/5 flex items-center justify-between">
          <div>
            <span class="text-base font-black ${item.price === 0 ? 'text-emerald-400' : 'text-white'}">
              ${item.price === 0 ? 'FREE / SWAP' : `₹${item.price}`}
            </span>
            <div class="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
              <span>⭐ ${item.seller_rating || '4.9'}</span>
              <span>·</span>
              <span class="text-cyan-300 font-bold">✓ Verified SRM</span>
            </div>
          </div>

          <button onclick="startChatWithSeller('${item.seller_name}', '${item.title.replace(/'/g, "\\'")}', '${item.image_url}')" class="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs shadow-md transition flex items-center gap-1">
            <span>Exchange →</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (homeGrid) homeGrid.innerHTML = html;
  if (exploreGrid) exploreGrid.innerHTML = html;
  lucide.createIcons();
}

// ── 2. REX Smart Match™ AI Recommendation Engine ──────────────────────
async function fetchSmartMatches(q = null) {
  try {
    const params = q ? `?query=${encodeURIComponent(q)}` : '';
    const res = await apiFetch(`/api/smart-match${params}`);
    const data = await res.json();
    state.smartMatches = data.recommendations || [];
    renderSmartMatches();
  } catch (e) {}
}

function renderSmartMatches() {
  const homeGrid = document.getElementById('homeSmartMatchGrid');
  const resultsList = document.getElementById('smartMatchResultsList');

  if (homeGrid) {
    homeGrid.innerHTML = state.smartMatches.slice(0, 2).map(item => `
      <div class="p-3 rounded-2xl bg-white/[0.02] border border-cyan-400/20 hover:border-cyan-400/40 transition flex items-center gap-3 cursor-pointer" onclick="showView('smart-match')">
        <img src="${item.image_url}" class="w-14 h-14 rounded-xl object-cover shrink-0">
        <div class="overflow-hidden flex-1">
          <div class="flex items-center justify-between">
            <span class="text-[9px] font-black text-cyan-400 uppercase">🧠 ${item.match_score || 94}% Match</span>
            <span class="text-xs font-black text-emerald-400">${item.price === 0 ? 'FREE' : `₹${item.price}`}</span>
          </div>
          <h5 class="text-xs font-bold text-white truncate">${item.title}</h5>
          <p class="text-[10px] text-slate-400 truncate">${item.distance_tag || 'Nearby'}</p>
        </div>
      </div>
    `).join('');
  }

  if (resultsList) {
    resultsList.innerHTML = state.smartMatches.map((item) => `
      <div class="glass-card p-5 border-cyan-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group">
        <div class="flex items-start gap-4 flex-1">
          <img src="${item.image_url}" class="w-24 h-24 rounded-2xl object-cover shrink-0 border border-white/10 group-hover:scale-105 transition duration-300">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/50">
                🧠 REX Match Score: ${item.match_score || 95}%
              </span>
              <span class="text-xs font-bold text-slate-400">📍 ${item.distance_tag || '4 min away'}</span>
              <span class="text-xs font-bold text-cyan-300">✓ Verified SRM Student</span>
            </div>
            <h3 class="text-base font-black text-white group-hover:text-cyan-300 transition">${item.title}</h3>
            <p class="text-xs text-slate-300 italic bg-white/[0.02] p-2 rounded-xl border border-white/5">
              "Reason: ${item.match_reason || 'Within your budget, 4 min walk away, and 4.9⭐ seller rating.'}"
            </p>
            <div class="flex items-center gap-3 pt-1 text-xs">
              <span class="text-lg font-black text-emerald-400">${item.price === 0 ? 'FREE' : `₹${item.price}`}</span>
              <span class="text-slate-400">Seller: <strong>${item.seller_name}</strong> (${item.seller_dept} · ⭐ ${item.seller_rating || 4.9})</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto shrink-0">
          <button onclick="startChatWithSeller('${item.seller_name}', '${item.title.replace(/'/g, "\\'")}', '${item.image_url}')" class="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs shadow-lg shadow-cyan-500/25 transition">
            Chat & Exchange →
          </button>
        </div>
      </div>
    `).join('');
  }

  lucide.createIcons();
}

function setSmartMatchQuery(q) {
  document.getElementById('smartMatchInput').value = q;
  executeSmartMatchQuery();
}

function executeSmartMatchQuery() {
  const q = document.getElementById('smartMatchInput').value.trim();
  playCoinSound();
  showToast(`REX AI calculated match scores for: "${q}"`, 'info');
  fetchSmartMatches(q);
}

// ── 3. 🙋‍♂️ "Need Something?" Demand System ──────────────────────────────
async function fetchDemands() {
  try {
    const res = await apiFetch('/api/demands');
    const data = await res.json();
    state.demands = data.demands || [];
    const container = document.getElementById('demandsGrid');
    if (container) {
      container.innerHTML = state.demands.map(d => `
        <div class="glass-card p-4 rounded-3xl border-amber-400/30 flex flex-col justify-between space-y-3">
          <div>
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300">DEMAND</span>
              <span class="text-xs font-black text-emerald-400">${d.budget_type || 'Free'}</span>
            </div>
            <h4 class="text-sm font-black text-white mt-2">${d.item_needed}</h4>
            <p class="text-xs text-slate-400 mt-1">Needed by: <strong class="text-slate-200">${d.needed_by}</strong></p>
          </div>
          <button onclick="startChatWithSeller('${d.requester_name}', 'Fulfill Need: ${d.item_needed.replace(/'/g, "\\'")}', '')" class="w-full py-1.5 rounded-xl bg-amber-400 text-black font-black text-xs shadow">
            I Have This →
          </button>
        </div>
      `).join('');
    }
  } catch (e) {}
}

function openCreateDemandModal() { playChime(); openModal('createDemandModal'); }
async function handleCreateDemandSubmit(e) {
  e.preventDefault();
  const item = document.getElementById('demandItem').value.trim();
  const body = { item_needed: item, category: 'Notes', budget_type: 'Free', max_budget: 0.0, needed_by: 'Tomorrow for Exam', preferred_location: 'Paari Hostel / UB Lobby' };
  const res = await apiFetch('/api/demands', { method: 'POST', body: JSON.stringify(body) });
  if (res.ok) {
    playSuccessFanfare();
    triggerConfetti();
    showToast('Need broadcasted to SRM campus network! Alert sent to matching peers.', 'success');
    closeModal('createDemandModal');
    await fetchDemands();
    showView('demands');
  }
}

// ── 4. 🎟️ REX Tickets Engine (Extra Portal Feature) ────────────────────
async function fetchTickets(cat = null) {
  try {
    const params = cat && cat.toLowerCase() !== 'all' ? `?category=${encodeURIComponent(cat)}` : '';
    const res = await apiFetch(`/api/tickets${params}`);
    const data = await res.json();
    state.tickets = data.tickets || [];
    renderTickets();
  } catch (e) {}
}

function renderTickets() {
  const lastMinuteGrid = document.getElementById('lastMinuteTicketsGrid');
  const allGrid = document.getElementById('allTicketsGrid');

  const lastMinuteItems = state.tickets.filter(t => t.is_last_minute);

  if (lastMinuteGrid) {
    lastMinuteGrid.innerHTML = lastMinuteItems.map(t => createTicketCardHTML(t)).join('');
  }
  if (allGrid) {
    allGrid.innerHTML = state.tickets.map(t => createTicketCardHTML(t)).join('');
  }
  lucide.createIcons();
}

function createTicketCardHTML(t) {
  return `
    <div class="digital-ticket-card p-5 flex flex-col justify-between group">
      <div>
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            ${t.category}
          </span>
          <span class="countdown-badge-urgent px-2.5 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1">
            ⏳ Starts in <span class="countdown-timer" data-seconds="${Math.floor(t.event_timestamp_hours_left * 3600)}">03:42:18</span>
          </span>
        </div>

        <h4 class="text-sm font-black text-white group-hover:text-cyan-300 transition line-clamp-1">${t.event_name}</h4>
        <p class="text-xs text-slate-400 mt-0.5">🎟️ ${t.ticket_type} · ${t.venue}</p>
      </div>

      <div>
        <div class="ticket-perforated-divider my-3"><div class="ticket-notch-left"></div><div class="ticket-notch-right"></div></div>
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-baseline gap-1.5">
              <span class="text-lg font-black text-white">₹${t.asking_price}</span>
              ${t.original_price > t.asking_price ? `<span class="text-xs text-slate-500 line-through">₹${t.original_price}</span>` : ''}
              ${t.discount_pct ? `<span class="text-[10px] font-black text-emerald-400">${t.discount_pct}% lower</span>` : ''}
            </div>
            <p class="text-[10px] text-cyan-300 font-bold">✓ Verified Student</p>
          </div>
          <button onclick="startChatWithSeller('${t.seller_name}', '${t.event_name.replace(/'/g, "\\'")}', '')" class="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-xs shadow-md transition">
            Get Ticket →
          </button>
        </div>
      </div>
    </div>
  `;
}

function startCountdownEngine() {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    document.querySelectorAll('.countdown-timer').forEach(el => {
      let sec = parseInt(el.getAttribute('data-seconds'), 10) || 13338;
      if (sec > 0) sec--;
      el.setAttribute('data-seconds', sec);

      const h = String(Math.floor(sec / 3600)).padStart(2, '0');
      const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
      const s = String(sec % 60).padStart(2, '0');
      el.textContent = `${h}:${m}:${s}`;
    });
  }, 1000);
}

function filterTicketsByCategory(cat) {
  playChime();
  fetchTickets(cat);
}

function openHaveTicketModal() { playChime(); openModal('haveTicketModal'); }
async function handleCreateTicketSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('ticketEventName').value.trim();
  const cat = document.getElementById('ticketCategory').value;
  const price = parseFloat(document.getElementById('ticketAskingPrice').value) || 450;
  const body = { event_name: name, category: cat, ticket_type: 'General Pass', event_date: 'Today', event_time: '7:00 PM', venue: 'TP Ganesan Auditorium', original_price: 600, asking_price: price };
  const res = await apiFetch('/api/tickets', { method: 'POST', body: JSON.stringify(body) });
  if (res.ok) {
    playSuccessFanfare();
    triggerConfetti();
    showToast('Ticket listed on REX Tickets portal! +25 XP 🎟️', 'success');
    closeModal('haveTicketModal');
    await fetchTickets();
  }
}

// ── 5. 📡 Live Campus Activity Feed ────────────────────────────────────
async function fetchCampusPulse() {
  try {
    const res = await apiFetch('/api/campus/pulse');
    const data = await res.json();
    const feedList = document.getElementById('liveActivityFeedList');
    if (feedList) {
      feedList.innerHTML = data.activity_feed.map(a => `
        <div class="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
          <p class="text-slate-200 leading-snug"><span>${a.icon}</span> ${a.text}</p>
          <span class="text-[9px] text-slate-500 shrink-0 ml-2 font-bold">${a.time}</span>
        </div>
      `).join('');
    }
  } catch (e) {}
}

// ── 6. 🎉 One-Click Exchange Completion Flow (+150 XP) ──────────────────
async function triggerCompleteExchangeDemo() {
  playSuccessFanfare();
  triggerConfetti();

  try {
    const body = { listing_id: 1, seller_name: 'Harini Venkatesh', buyer_name: 'Ayan Saha', meetup_spot: 'University Building (UB) Ground Floor Lobby', exchange_mode: 'Buy', savings_amount: 650.0 };
    const res = await apiFetch('/api/exchanges/complete', { method: 'POST', body: JSON.stringify(body) });
    const data = await res.json();

    state.user.karma_score += 150;
    state.user.rex_score = 94;
    document.getElementById('sidebarUserXP').textContent = state.user.karma_score.toLocaleString();
    if (document.getElementById('repKarmaDisplay')) document.getElementById('repKarmaDisplay').textContent = state.user.karma_score.toLocaleString();

    openModal('exchangeCompleteCelebrationModal');
    showToast('EXCHANGE COMPLETE! 🎉 +150 XP awarded to Ayan and Harini!', 'success');
  } catch (e) {
    openModal('exchangeCompleteCelebrationModal');
  }
}

// ── 7. 🚀 90-Second Guided Judge Demo Flow ──────────────────────────────
async function start90SecondDemo() {
  playSuccessFanfare();
  triggerConfetti();
  showToast('🚀 Starting 90-Second Guided Judge Demo Flow…', 'info');

  showView('home');
  await new Promise(r => setTimeout(r, 1400));

  showView('smart-match');
  setSmartMatchQuery('Casio FX-991EX calculator under ₹800 near Paari');
  await new Promise(r => setTimeout(r, 2200));

  startChatWithSeller('Harini Venkatesh', 'Casio FX-991EX ClassWiz Solar Calculator', 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?w=150');
  await new Promise(r => setTimeout(r, 2200));

  showView('map');
  setTimeout(animateNearestExchangeRoute, 300);
  await new Promise(r => setTimeout(r, 2500));

  triggerCompleteExchangeDemo();
  await new Promise(r => setTimeout(r, 2000));

  closeModal('exchangeCompleteCelebrationModal');
  showView('impact');
  showToast('🎉 "REXchange turns the campus itself into a resource network!"', 'success');
}

// ── 8. Real-Time Chat Engine ───────────────────────────────────────────
function startChatWithSeller(sellerName, itemTitle, itemImg) {
  showView('messages');
  document.getElementById('chatItemTitle').textContent = itemTitle;
  document.getElementById('chatItemMeta').textContent = `Listed by ${sellerName} · ✓ Verified SRM Student`;
  if (itemImg) document.getElementById('chatItemImg').src = itemImg;
  playMessagePop();
  showToast(`Connected live with ${sellerName}!`, 'info');
}

function selectChatThread(threadId) {
  currentChatThread = threadId;
  playMessagePop();
}

function sendChatMessage() {
  const inp = document.getElementById('chatInputBox');
  const text = inp.value.trim();
  if (!text) return;

  playMessagePop();
  const container = document.getElementById('chatMessagesContainer');
  container.innerHTML += `
    <div class="chat-bubble-seller p-3 max-w-md ml-auto text-right">
      <p class="text-xs font-bold text-cyan-300 text-[10px]">You • Just now</p>
      <p class="text-xs text-white mt-1">${text}</p>
    </div>
  `;
  inp.value = '';
  container.scrollTop = container.scrollHeight;
}

// ── 9. Interactive Campus Map ──────────────────────────────────────────
async function fetchMapPins() {
  try {
    const res = await apiFetch('/api/map-pins');
    const data = await res.json();
    state.mapPins = data.pins || [];
    if (campusMap) renderPinsOnMap();
  } catch (e) {}
}

function initCampusMap() {
  if (campusMap) { campusMap.invalidateSize(); return; }
  campusMap = L.map('campusMapContainer').setView([12.8234, 80.0442], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(campusMap);
  renderPinsOnMap();
}

function renderPinsOnMap() {
  if (!campusMap) return;
  state.mapPins.forEach(p => {
    const marker = L.marker([p.lat, p.lng]).addTo(campusMap);
    marker.bindPopup(`
      <div class="p-2 text-xs">
        <strong class="text-white">${p.title}</strong>
        <p class="text-slate-300 text-[10px]">${p.description}</p>
      </div>
    `);
  });
}

function animateNearestExchangeRoute() {
  playChime();
  if (!campusMap) return;
  const latlngs = [[12.8255, 80.0418], [12.8245, 80.0430], [12.8234, 80.0442]];
  const polyline = L.polyline(latlngs, { color: '#00f2fe', weight: 4, opacity: 0.85, dashArray: '8, 8' }).addTo(campusMap);
  campusMap.fitBounds(polyline.getBounds());
  showToast('Animated safe route calculated: 4 min walk to UB Lobby (350m)! 🚶', 'success');
}

// ── 10. Leaderboard ────────────────────────────────────────────────────
async function fetchLeaderboard() {
  try {
    const res = await apiFetch('/api/campus/leaderboard');
    const data = await res.json();
    const container = document.getElementById('leaderboardContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="p-4 bg-white/[0.02] border-b border-white/5 font-black text-xs text-slate-400 grid grid-cols-12">
        <span class="col-span-1">RANK</span>
        <span class="col-span-6">STUDENT</span>
        <span class="col-span-2">REX SCORE</span>
        <span class="col-span-3 text-right">TOTAL XP</span>
      </div>
      <div class="divide-y divide-white/5 text-xs">
        ${data.leaderboard.map((u, i) => `
          <div class="p-4 grid grid-cols-12 items-center hover:bg-white/[0.02] transition">
            <span class="col-span-1 font-black ${i === 0 ? 'text-amber-400 text-base' : 'text-slate-400'}">#${i + 1}</span>
            <div class="col-span-6 flex items-center gap-3">
              <img src="${u.avatar_url}" class="w-9 h-9 rounded-xl object-cover border border-white/10">
              <div>
                <p class="font-black text-white">${u.full_name} <span class="text-cyan-400 text-[10px]">✓</span></p>
                <p class="text-[10px] text-slate-400">${u.dept} · ${u.level_title}</p>
              </div>
            </div>
            <span class="col-span-2 font-black text-cyan-300">${u.rex_score || 92}/100</span>
            <span class="col-span-3 text-right font-black text-amber-400">⭐ ${u.karma_score} XP</span>
          </div>
        `).join('')}
      </div>
    `;
  } catch (e) {}
}

// ── 11. 🤖 REX AI Assistant ────────────────────────────────────────────
function openREXAIDrawer() { playChime(); openModal('rexAIDrawerModal'); }
async function sendREXMessage() {
  const inp = document.getElementById('rexAIChatInput');
  const text = inp.value.trim();
  if (!text) return;
  playMessagePop();
  const box = document.getElementById('rexAIChatBox');
  box.innerHTML += `<div class="p-3 bg-cyan-900/40 border border-cyan-400/30 rounded-2xl text-xs text-white"><strong>You:</strong> ${text}</div>`;
  inp.value = '';
  box.scrollTop = box.scrollHeight;

  try {
    const res = await apiFetch('/api/ai/chat', { method: 'POST', body: JSON.stringify({ prompt: text }) });
    const data = await res.json();
    box.innerHTML += `<div class="p-3 bg-white/[0.02] rounded-2xl border border-white/5 text-xs text-slate-200">🤖 <strong>REX:</strong> ${data.reply}</div>`;
    playCoinSound();
  } catch (e) {}
}

// ── 12. Create Listing Modal ───────────────────────────────────────────
function openCreateListingModal() { playChime(); openModal('createListingModal'); }
async function handleCreateListingSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('createTitle').value.trim();
  const price = parseFloat(document.getElementById('createPrice').value) || 0;
  const desc = document.getElementById('createDescription').value.trim();
  const body = { title, category: 'Notes', exchange_type: price === 0 ? 'give' : 'sell', price, location: 'Paari Hostel', safe_meet_spot: 'University Building (UB) Ground Floor Lobby', description: desc, image_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600', tags: ['SRMIST'] };
  const res = await apiFetch('/api/listings', { method: 'POST', body: JSON.stringify(body) });
  if (res.ok) {
    playSuccessFanfare();
    triggerConfetti();
    showToast('Listing published to SRM campus feed! +25 XP 🚀', 'success');
    closeModal('createListingModal');
    await fetchListings();
  }
}

// ── Modal Helpers ──────────────────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('hidden'); el.classList.add('flex'); }
  lucide.createIcons();
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('hidden'); el.classList.remove('flex'); }
}
function openProfileModal() { playChime(); openModal('profileModal'); }
