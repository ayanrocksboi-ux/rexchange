// RExchange Core Application Logic - Single College (BITS Bangalore Focus)
(function () {
  // State Initialization
  const STATE = {
    college: null,
    currentUser: null,
    users: [],
    listings: [],
    savedItemIds: new Set(),
    activeTab: 'home', // home, marketplace, categories, events, campus, dashboard, how-it-works, trust
    dashboardTab: 'listings', // listings, saved, offers, messages, profile
    filters: {
      search: '',
      category: 'all',
      type: 'all', // all, sale, exchange, free
      condition: 'all',
      maxPrice: 3000,
      sortBy: 'recommended',
      verifiedOnly: false
    },
    activeChatSellerId: null,
    messages: {},
    myOffers: [],
    currentDetailItem: null,
    authTab: 'signin'
  };

  // LocalStorage Keys
  const LS_KEYS = {
    CURRENT_USER: 'rexchange_active_user_id',
    CUSTOM_USERS: 'rexchange_custom_users',
    CUSTOM_LISTINGS: 'rexchange_custom_listings',
    SAVED: 'rexchange_saved',
    OFFERS: 'rexchange_offers',
    MESSAGES: 'rexchange_messages'
  };

  // Initialize Data
  function initData() {
    STATE.college = window.REXCHANGE_DATA.college;

    // Load Users
    const customUsers = JSON.parse(localStorage.getItem(LS_KEYS.CUSTOM_USERS) || '[]');
    STATE.users = [...window.REXCHANGE_DATA.registeredUsers, ...customUsers];

    // Load Active User
    const savedUserId = localStorage.getItem(LS_KEYS.CURRENT_USER);
    if (savedUserId) {
      STATE.currentUser = STATE.users.find(u => u.id === savedUserId) || STATE.users[0];
    } else {
      // Default to logged-in as Aarav Patel for immediate demo exploration
      STATE.currentUser = STATE.users[0];
      localStorage.setItem(LS_KEYS.CURRENT_USER, STATE.currentUser.id);
    }

    // Load Listings
    const customListings = JSON.parse(localStorage.getItem(LS_KEYS.CUSTOM_LISTINGS) || '[]');
    STATE.listings = [...customListings, ...window.REXCHANGE_DATA.listings];

    // Load Saved Items
    const saved = JSON.parse(localStorage.getItem(LS_KEYS.SAVED) || '[]');
    const initialSaved = STATE.currentUser ? (STATE.currentUser.savedItems || []) : [];
    STATE.savedItemIds = new Set([...initialSaved, ...saved]);

    // Load Messages
    const savedMsgs = JSON.parse(localStorage.getItem(LS_KEYS.MESSAGES) || '{}');
    STATE.messages = { ...window.REXCHANGE_DATA.initialMessages, ...savedMsgs };

    // Load Offers
    STATE.myOffers = JSON.parse(localStorage.getItem(LS_KEYS.OFFERS) || '[]');
    if (STATE.myOffers.length === 0) {
      STATE.myOffers = [
        {
          id: "off_1",
          itemId: "item_03",
          itemTitle: "BITS Founders & Startup Meetup Ticket",
          offeredAmount: 420,
          type: "Cash Offer",
          status: "Accepted by Rahul Sharma",
          statusColor: "emerald",
          date: "Yesterday"
        },
        {
          id: "off_2",
          itemId: "item_09",
          itemTitle: "Logitech Silent Click Wireless Mouse M221",
          offeredAmount: 400,
          type: "Exchange Proposal",
          proposal: "Traded with 64GB OTG SanDisk Flash Drive",
          status: "Completed",
          statusColor: "cyan",
          date: "3 days ago"
        }
      ];
    }
  }

  // Toast Notification System
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md text-sm font-medium ${
      type === 'success' 
        ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
        : type === 'info'
        ? 'bg-cyan-950/90 border-cyan-500/50 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
        : 'bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
    }`;

    const iconName = type === 'success' ? 'check-circle' : (type === 'info' ? 'info' : 'alert-triangle');
    toast.innerHTML = `
      <i data-lucide="${iconName}" class="w-5 h-5 flex-shrink-0"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    lucide.createIcons({ root: toast });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Auth Guard Helper
  function requireAuth(actionCallback) {
    if (!STATE.currentUser) {
      showToast("Please sign in with your BITS College account to continue.", "info");
      openAuthModal('signin');
      return false;
    }
    if (actionCallback) actionCallback();
    return true;
  }

  // Update Auth State in Navigation Bar & UI
  function updateNavAuthUI() {
    const authContainer = document.getElementById('nav-auth-container');
    if (!authContainer) return;

    if (STATE.currentUser) {
      authContainer.innerHTML = `
        <div class="relative group">
          <button onclick="document.getElementById('user-dropdown-menu').classList.toggle('hidden')" 
                  class="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-all shadow-md">
            <img src="${STATE.currentUser.avatar}" alt="${STATE.currentUser.name}" class="w-7 h-7 rounded-lg object-cover border border-emerald-500/50 flex-shrink-0" />
            <div class="text-left hidden sm:block">
              <div class="text-xs font-semibold text-slate-200 flex items-center gap-1">
                ${STATE.currentUser.name}
                <i data-lucide="badge-check" class="w-3.5 h-3.5 text-emerald-400"></i>
              </div>
              <div class="text-[10px] text-emerald-400 font-mono">BITS • ${STATE.currentUser.rating || 5.0}★</div>
            </div>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>
          </button>

          <!-- Dropdown Menu -->
          <div id="user-dropdown-menu" class="hidden absolute right-0 mt-2 w-56 glass-card rounded-2xl border border-slate-700/80 p-2 shadow-2xl z-50">
            <div class="p-3 border-b border-slate-800 mb-1">
              <div class="text-xs font-bold text-slate-100">${STATE.currentUser.name}</div>
              <div class="text-[10px] text-emerald-400 font-mono truncate">${STATE.currentUser.email}</div>
              <div class="text-[10px] text-slate-400 mt-0.5">${STATE.currentUser.branch}</div>
            </div>
            <button onclick="window.REXCHANGE.openTab('dashboard'); document.getElementById('user-dropdown-menu').classList.add('hidden')" class="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800/80 flex items-center gap-2">
              <i data-lucide="layout-dashboard" class="w-4 h-4 text-emerald-400"></i> Student Dashboard
            </button>
            <button onclick="window.REXCHANGE.openTab('dashboard'); window.REXCHANGE.setDashTab('listings'); document.getElementById('user-dropdown-menu').classList.add('hidden')" class="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800/80 flex items-center gap-2">
              <i data-lucide="package" class="w-4 h-4 text-cyan-400"></i> My Listings
            </button>
            <button onclick="window.REXCHANGE.openTab('dashboard'); window.REXCHANGE.setDashTab('saved'); document.getElementById('user-dropdown-menu').classList.add('hidden')" class="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800/80 flex items-center gap-2">
              <i data-lucide="heart" class="w-4 h-4 text-rose-400"></i> Saved Wishlist
            </button>
            <button onclick="window.REXCHANGE.openTab('dashboard'); window.REXCHANGE.setDashTab('messages'); document.getElementById('user-dropdown-menu').classList.add('hidden')" class="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800/80 flex items-center gap-2">
              <i data-lucide="message-square" class="w-4 h-4 text-purple-400"></i> Messages
            </button>
            <div class="border-t border-slate-800 my-1"></div>
            <button onclick="window.REXCHANGE.handleSignOut()" class="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/50 flex items-center gap-2">
              <i data-lucide="log-out" class="w-4 h-4"></i> Sign Out
            </button>
          </div>
        </div>
      `;
    } else {
      authContainer.innerHTML = `
        <div class="flex items-center gap-2">
          <button onclick="window.REXCHANGE.openAuthModal('signin')" 
                  class="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-1.5">
            <i data-lucide="log-in" class="w-3.5 h-3.5 text-emerald-400"></i>
            <span>Sign In</span>
          </button>
          <button onclick="window.REXCHANGE.openAuthModal('signup')" 
                  class="neon-btn-secondary px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
            <i data-lucide="user-plus" class="w-3.5 h-3.5"></i>
            <span>Register</span>
          </button>
        </div>
      `;
    }

    lucide.createIcons({ root: authContainer });
  }

  // Auth Portal Modal Logic
  function openAuthModal(initialTab = 'signin') {
    STATE.authTab = initialTab;
    const modal = document.getElementById('modal-auth');
    if (!modal) return;

    switchAuthTab(initialTab);
    renderAuthQuickLogins();
    modal.classList.remove('hidden');
    lucide.createIcons({ root: modal });
  }

  function closeAuthModal() {
    const modal = document.getElementById('modal-auth');
    if (modal) modal.classList.add('hidden');
  }

  function switchAuthTab(tab) {
    STATE.authTab = tab;
    const tabSignIn = document.getElementById('auth-tab-signin');
    const tabSignUp = document.getElementById('auth-tab-signup');
    const formSignIn = document.getElementById('auth-form-signin');
    const formSignUp = document.getElementById('auth-form-signup');

    if (tab === 'signin') {
      tabSignIn.classList.add('text-emerald-400', 'border-emerald-500', 'bg-emerald-500/10');
      tabSignIn.classList.remove('text-slate-400', 'border-transparent');
      tabSignUp.classList.remove('text-emerald-400', 'border-emerald-500', 'bg-emerald-500/10');
      tabSignUp.classList.add('text-slate-400', 'border-transparent');

      formSignIn.classList.remove('hidden');
      formSignUp.classList.add('hidden');
    } else {
      tabSignUp.classList.add('text-emerald-400', 'border-emerald-500', 'bg-emerald-500/10');
      tabSignUp.classList.remove('text-slate-400', 'border-transparent');
      tabSignIn.classList.remove('text-emerald-400', 'border-emerald-500', 'bg-emerald-500/10');
      tabSignIn.classList.add('text-slate-400', 'border-transparent');

      formSignUp.classList.remove('hidden');
      formSignIn.classList.add('hidden');
    }
  }

  function renderAuthQuickLogins() {
    const container = document.getElementById('auth-quick-logins');
    if (!container) return;

    container.innerHTML = STATE.users.slice(0, 3).map(u => `
      <div onclick="window.REXCHANGE.quickLoginAs('${u.id}')" 
           class="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 cursor-pointer flex items-center justify-between transition-all group">
        <div class="flex items-center gap-2.5 min-w-0">
          <img src="${u.avatar}" alt="${u.name}" class="w-8 h-8 rounded-lg object-cover border border-slate-700 flex-shrink-0" />
          <div class="min-w-0">
            <div class="text-xs font-bold text-slate-200 group-hover:text-emerald-400 truncate">${u.name}</div>
            <div class="text-[10px] text-slate-400 truncate">${u.branch}</div>
          </div>
        </div>
        <span class="text-[10px] px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex-shrink-0 font-mono font-semibold">
          1-Click Login
        </span>
      </div>
    `).join('');
  }

  function quickLoginAs(userId) {
    const user = STATE.users.find(u => u.id === userId);
    if (!user) return;

    STATE.currentUser = user;
    localStorage.setItem(LS_KEYS.CURRENT_USER, user.id);
    closeAuthModal();
    updateNavAuthUI();
    showToast(`Welcome back, ${user.name}! Connected to BITS Campus Network.`, 'success');

    if (STATE.activeTab === 'dashboard') renderDashboard();
  }

  function handleSignIn(e) {
    if (e) e.preventDefault();

    const emailInput = document.getElementById('signin-email')?.value.trim();
    const passwordInput = document.getElementById('signin-password')?.value;

    if (!emailInput || !passwordInput) {
      showToast("Please enter your BITS college email and password", "error");
      return;
    }

    // Auto-complete domain if only username/roll is typed
    let searchEmail = emailInput.toLowerCase();
    if (!searchEmail.includes('@')) {
      searchEmail = `${searchEmail}@bits-bangalore.edu.in`;
    }

    const matchedUser = STATE.users.find(u => 
      u.email.toLowerCase() === searchEmail || 
      (u.usn && u.usn.toLowerCase() === emailInput.toLowerCase())
    );

    if (matchedUser) {
      STATE.currentUser = matchedUser;
      localStorage.setItem(LS_KEYS.CURRENT_USER, matchedUser.id);
      closeAuthModal();
      updateNavAuthUI();
      showToast(`Signed in successfully as ${matchedUser.name}!`, 'success');
      if (STATE.activeTab === 'dashboard') renderDashboard();
    } else {
      showToast("Invalid credentials. Use a registered BITS student account or register below.", "error");
    }
  }

  function handleSignUp(e) {
    if (e) e.preventDefault();

    const name = document.getElementById('signup-name')?.value.trim();
    let email = document.getElementById('signup-email')?.value.trim().toLowerCase();
    const usn = document.getElementById('signup-usn')?.value.trim().toUpperCase();
    const department = document.getElementById('signup-dept')?.value;
    const year = document.getElementById('signup-year')?.value;
    const hostel = document.getElementById('signup-hostel')?.value;
    const password = document.getElementById('signup-password')?.value;
    const confirmPassword = document.getElementById('signup-confirm-password')?.value;

    if (!name || !email || !usn || !password) {
      showToast("Please fill all required registration fields", "error");
      return;
    }

    // Format BITS domain
    if (!email.includes('@')) {
      email = `${email}@bits-bangalore.edu.in`;
    } else if (!email.endsWith('@bits-bangalore.edu.in')) {
      showToast("Only official @bits-bangalore.edu.in student emails are allowed for this campus portal.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match. Please verify.", "error");
      return;
    }

    // Check if email already registered
    const existing = STATE.users.find(u => u.email.toLowerCase() === email || (u.usn && u.usn === usn));
    if (existing) {
      showToast("A student with this college email / USN is already registered. Please sign in.", "info");
      switchAuthTab('signin');
      return;
    }

    const avatars = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newUser = {
      id: "u_" + Date.now(),
      name: name,
      email: email,
      usn: usn,
      password: password,
      avatar: randomAvatar,
      college: "Bangalore Institute of Technology & Sciences (BITS)",
      branch: `${department} (${year})`,
      department: department,
      year: year,
      hostel: hostel,
      verified: true,
      rating: 5.0,
      exchangeCount: 0,
      savedItems: []
    };

    // Save custom user
    const customUsers = JSON.parse(localStorage.getItem(LS_KEYS.CUSTOM_USERS) || '[]');
    customUsers.push(newUser);
    localStorage.setItem(LS_KEYS.CUSTOM_USERS, JSON.stringify(customUsers));

    STATE.users.push(newUser);
    STATE.currentUser = newUser;
    localStorage.setItem(LS_KEYS.CURRENT_USER, newUser.id);

    closeAuthModal();
    updateNavAuthUI();
    showToast(`Welcome to BITS RExchange, ${name}! Your verified student account is active.`, "success");

    if (STATE.activeTab === 'dashboard') renderDashboard();
  }

  function handleSignOut() {
    STATE.currentUser = null;
    localStorage.removeItem(LS_KEYS.CURRENT_USER);
    updateNavAuthUI();
    showToast("You have signed out of RExchange BITS Portal.", "info");
    
    if (STATE.activeTab === 'dashboard') {
      setActiveTab('home');
    }
  }

  // Navigation / Tabs
  function setActiveTab(tabName, categoryFilter = null) {
    if (tabName === 'dashboard' && !STATE.currentUser) {
      requireAuth(() => setActiveTab('dashboard'));
      return;
    }

    STATE.activeTab = tabName;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update Nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      const target = link.getAttribute('data-tab');
      if (target === tabName) {
        link.classList.add('text-emerald-400', 'bg-emerald-500/10', 'border-emerald-500/30');
        link.classList.remove('text-slate-300', 'border-transparent');
      } else {
        link.classList.remove('text-emerald-400', 'bg-emerald-500/10', 'border-emerald-500/30');
        link.classList.add('text-slate-300', 'border-transparent');
      }
    });

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));

    // Show target section
    const targetSection = document.getElementById(`view-${tabName}`);
    if (targetSection) {
      targetSection.classList.remove('hidden');
    }

    if (tabName === 'marketplace') {
      if (categoryFilter) {
        STATE.filters.category = categoryFilter;
        const catSelect = document.getElementById('filter-category');
        if (catSelect) catSelect.value = categoryFilter;
      }
      renderMarketplace();
    } else if (tabName === 'dashboard') {
      renderDashboard();
    } else if (tabName === 'campus') {
      renderCampusExchange();
    } else if (tabName === 'events') {
      renderEvents();
    } else if (tabName === 'categories') {
      renderCategoriesView();
    }

    // Refresh icons
    lucide.createIcons();
  }

  // Render Category Cards on Home and Categories View
  function renderCategoryCards(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = window.REXCHANGE_DATA.categories.map(cat => {
      return `
        <div class="glass-card glass-card-interactive p-5 rounded-2xl cursor-pointer group flex flex-col justify-between"
             onclick="window.REXCHANGE.openCategory('${cat.id}')">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${cat.color} border border-white/10 group-hover:border-emerald-500/40 transition-all">
              <i data-lucide="${cat.icon}" class="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform"></i>
            </div>
            <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 group-hover:text-emerald-300">
              ${cat.count} items
            </span>
          </div>
          <div>
            <h4 class="font-heading font-semibold text-lg text-slate-100 group-hover:text-emerald-400 transition-colors mb-1.5 flex items-center justify-between">
              ${cat.name}
              <i data-lucide="arrow-up-right" class="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-emerald-400"></i>
            </h4>
            <p class="text-xs text-slate-400 line-clamp-2">${cat.desc}</p>
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons({ root: container });
  }

  // Render Listing Cards
  function createListingCardHTML(item) {
    const isSaved = STATE.savedItemIds.has(item.id);
    const badgeClass = item.listingType === 'free' 
      ? 'badge-free' 
      : (item.listingType === 'exchange' ? 'badge-exchange' : 'badge-sale');
    const badgeText = item.listingType === 'free' 
      ? '🎁 FREE GIVEAWAY' 
      : (item.listingType === 'exchange' ? '🔄 EXCHANGE' : '⚡ FOR SALE');

    const priceDisplay = item.listingType === 'free' 
      ? '<span class="text-cyan-400 font-extrabold text-xl">FREE</span>' 
      : `<span class="text-emerald-400 font-extrabold text-xl">₹${item.price.toLocaleString('en-IN')}</span>` +
        (item.originalPrice ? `<span class="text-xs text-slate-500 line-through ml-1.5">₹${item.originalPrice}</span>` : '');

    return `
      <div class="glass-card glass-card-interactive rounded-2xl overflow-hidden flex flex-col group border border-slate-800/80 hover:border-emerald-500/40">
        <!-- Image & Badges -->
        <div class="relative h-48 overflow-hidden bg-slate-950/60 cursor-pointer" onclick="window.REXCHANGE.openDetail('${item.id}')">
          <img src="${item.images[0]}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30"></div>
          
          <!-- Top Badges -->
          <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span class="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase backdrop-blur-md ${badgeClass}">
              ${badgeText}
            </span>
            <button onclick="event.stopPropagation(); window.REXCHANGE.toggleSave('${item.id}')" 
                    class="pointer-events-auto w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 flex items-center justify-center transition-all ${isSaved ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'}">
              <i data-lucide="heart" class="w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}"></i>
            </button>
          </div>

          <!-- Bottom Info Overlay -->
          <div class="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
            <span class="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-slate-200">
              ${item.condition}
            </span>
            <span class="flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/50">
              <i data-lucide="map-pin" class="w-3 h-3 text-emerald-400"></i> ${item.distance}
            </span>
          </div>
        </div>

        <!-- Content Body -->
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-[11px] font-medium text-slate-400 uppercase tracking-wider">${item.categoryName}</span>
              <span class="text-slate-600 text-xs">•</span>
              <span class="text-[11px] text-slate-400 font-mono">${item.timeAgo}</span>
            </div>
            
            <h3 class="font-heading font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1 text-base cursor-pointer mb-2"
                onclick="window.REXCHANGE.openDetail('${item.id}')">
              ${item.title}
            </h3>

            <p class="text-xs text-slate-400 line-clamp-2 mb-3">${item.description}</p>
          </div>

          <!-- Price & Seller Row -->
          <div class="pt-3 border-t border-slate-800/80">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-baseline">
                ${priceDisplay}
              </div>
              <span class="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-cyan-400"></i> BITS Campus
              </span>
            </div>

            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 min-w-0">
                <img src="${item.seller.avatar}" alt="${item.seller.name}" class="w-7 h-7 rounded-full object-cover border border-emerald-500/40 flex-shrink-0" />
                <div class="min-w-0">
                  <div class="text-xs font-semibold text-slate-200 truncate flex items-center gap-1">
                    ${item.seller.name}
                    ${item.seller.verified ? '<i data-lucide="badge-check" class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0"></i>' : ''}
                  </div>
                  <div class="text-[10px] text-slate-400 flex items-center gap-1">
                    <i data-lucide="star" class="w-2.5 h-2.5 text-amber-400 fill-amber-400"></i> ${item.seller.rating}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1.5 flex-shrink-0">
                <button onclick="window.REXCHANGE.openDetail('${item.id}')" 
                        class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500/40 transition-all">
                  Details
                </button>
                <button onclick="window.REXCHANGE.openOfferModal('${item.id}')" 
                        class="px-3 py-1.5 rounded-lg text-xs font-bold ${item.listingType === 'free' ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'} transition-all shadow-md">
                  ${item.listingType === 'free' ? 'Claim' : (item.listingType === 'exchange' ? 'Swap' : 'Offer')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Render Marketplace Filtered Results
  function renderMarketplace() {
    const container = document.getElementById('marketplace-listings-grid');
    if (!container) return;

    let filtered = [...STATE.listings];

    // Search filter
    if (STATE.filters.search) {
      const q = STATE.filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q) ||
        item.seller.name.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (STATE.filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === STATE.filters.category);
    }

    // Type filter
    if (STATE.filters.type !== 'all') {
      filtered = filtered.filter(item => item.listingType === STATE.filters.type);
    }

    // Condition filter
    if (STATE.filters.condition !== 'all') {
      filtered = filtered.filter(item => item.condition.toLowerCase().includes(STATE.filters.condition.toLowerCase()));
    }

    // Price filter
    filtered = filtered.filter(item => item.price <= STATE.filters.maxPrice);

    // Sort By
    if (STATE.filters.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (STATE.filters.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (STATE.filters.sortBy === 'newest') {
      filtered.sort((a, b) => (b.id > a.id ? 1 : -1));
    }

    // Update Result count
    const countEl = document.getElementById('marketplace-result-count');
    if (countEl) countEl.innerText = `${filtered.length} BITS campus listings found`;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center glass-panel rounded-2xl border border-slate-800">
          <div class="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <i data-lucide="search-x" class="w-8 h-8 text-emerald-400"></i>
          </div>
          <h3 class="font-heading text-lg font-semibold text-slate-200 mb-1">No student listings matched your criteria</h3>
          <p class="text-sm text-slate-400 mb-5 max-w-md mx-auto">Try clearing some filters or searching for different keywords like "calculator", "notes", "pass", or "headphones".</p>
          <button onclick="window.REXCHANGE.resetFilters()" class="neon-btn-secondary px-5 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Reset Filters
          </button>
        </div>
      `;
    } else {
      container.innerHTML = filtered.map(item => createListingCardHTML(item)).join('');
    }

    lucide.createIcons({ root: container });
  }

  // Render Campus Exchange Section
  function renderCampusExchange() {
    // Trending items
    const trendingGrid = document.getElementById('campus-trending-grid');
    if (trendingGrid) {
      const trending = STATE.listings.filter(item => item.featured || item.listingType === 'exchange').slice(0, 4);
      trendingGrid.innerHTML = trending.map(item => createListingCardHTML(item)).join('');
      lucide.createIcons({ root: trendingGrid });
    }

    // Free items
    const freeGrid = document.getElementById('campus-free-grid');
    if (freeGrid) {
      const freeItems = STATE.listings.filter(item => item.listingType === 'free').slice(0, 4);
      freeGrid.innerHTML = freeItems.map(item => createListingCardHTML(item)).join('');
      lucide.createIcons({ root: freeGrid });
    }

    // Live Ticker
    const tickerContainer = document.getElementById('campus-ticker-stream');
    if (tickerContainer) {
      tickerContainer.innerHTML = window.REXCHANGE_DATA.campusTicker.map(t => `
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all text-xs">
          <div class="flex items-center gap-2 text-slate-200">
            <span class="w-2 h-2 rounded-full bg-emerald-400 live-pulse"></span>
            <span>${t.text}</span>
          </div>
          <span class="text-slate-500 font-mono text-[11px]">${t.time}</span>
        </div>
      `).join('');
    }
  }

  // Render Events View
  function renderEvents() {
    const container = document.getElementById('events-grid');
    if (!container) return;

    container.innerHTML = window.REXCHANGE_DATA.events.map(evt => {
      return `
        <div class="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col group hover:border-cyan-500/40 transition-all">
          <div class="relative h-48 overflow-hidden bg-slate-950">
            <img src="${evt.image}" alt="${evt.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
            
            <div class="absolute top-3 left-3">
              <span class="text-xs font-bold px-3 py-1 rounded-md bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 backdrop-blur-md">
                ${evt.category}
              </span>
            </div>

            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
              <span class="flex items-center gap-1.5 text-cyan-300 font-medium bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-md">
                <i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${evt.date}
              </span>
              <span class="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                ${evt.availableTickets} tickets left
              </span>
            </div>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="font-heading font-bold text-lg text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors">
                ${evt.title}
              </h3>
              
              <div class="space-y-1.5 text-xs text-slate-400 mb-4">
                <div class="flex items-center gap-2">
                  <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-500"></i>
                  <span>${evt.time}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-500"></i>
                  <span>${evt.venue}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i data-lucide="user" class="w-3.5 h-3.5 text-slate-500"></i>
                  <span>Organized by ${evt.organizer}</span>
                </div>
              </div>

              <div class="flex flex-wrap gap-1.5 mb-4">
                ${evt.tags.map(tag => `<span class="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">#${tag}</span>`).join('')}
              </div>
            </div>

            <div class="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div class="text-[11px] text-slate-400">Student Price</div>
                <div class="flex items-baseline gap-1.5">
                  <span class="text-xl font-extrabold text-cyan-400 font-heading">₹${evt.price}</span>
                  <span class="text-xs text-slate-500 line-through">₹${evt.originalPrice}</span>
                </div>
              </div>
              <button onclick="window.REXCHANGE.openEventModal('${evt.id}')" 
                      class="neon-btn-cyan px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <i data-lucide="ticket" class="w-4 h-4"></i> Get Ticket
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons({ root: container });
  }

  // Render Categories View
  function renderCategoriesView() {
    renderCategoryCards('all-categories-grid');
  }

  // Render Student Dashboard
  function renderDashboard() {
    if (!STATE.currentUser) {
      requireAuth(() => renderDashboard());
      return;
    }

    const user = STATE.currentUser;

    // Set user metrics
    const nameEl = document.getElementById('dash-user-name');
    const emailEl = document.getElementById('dash-user-email');
    const collegeEl = document.getElementById('dash-user-college');
    const branchEl = document.getElementById('dash-user-branch');
    const avatarEl = document.getElementById('dash-user-avatar');
    const repEl = document.getElementById('dash-user-rep');
    const exCountEl = document.getElementById('dash-user-excount');

    if (nameEl) nameEl.innerText = user.name;
    if (emailEl) emailEl.innerText = user.email;
    if (collegeEl) collegeEl.innerText = user.college;
    if (branchEl) branchEl.innerText = user.branch;
    if (avatarEl) avatarEl.src = user.avatar;
    if (repEl) repEl.innerText = `${user.rating || 5.0} ★`;
    if (exCountEl) exCountEl.innerText = user.exchangeCount || 0;

    // Subtab switching
    document.querySelectorAll('.dash-nav-btn').forEach(btn => {
      const tab = btn.getAttribute('data-dashtab');
      if (tab === STATE.dashboardTab) {
        btn.classList.add('bg-emerald-500/15', 'text-emerald-400', 'border-emerald-500/40');
        btn.classList.remove('text-slate-400', 'border-transparent');
      } else {
        btn.classList.remove('bg-emerald-500/15', 'text-emerald-400', 'border-emerald-500/40');
        btn.classList.add('text-slate-400', 'border-transparent');
      }
    });

    document.querySelectorAll('.dash-view').forEach(v => v.classList.add('hidden'));
    const activeDashView = document.getElementById(`dash-view-${STATE.dashboardTab}`);
    if (activeDashView) activeDashView.classList.remove('hidden');

    if (STATE.dashboardTab === 'listings') {
      renderMyListings();
    } else if (STATE.dashboardTab === 'saved') {
      renderSavedItems();
    } else if (STATE.dashboardTab === 'offers') {
      renderMyOffers();
    } else if (STATE.dashboardTab === 'messages') {
      renderMessagesInbox();
    } else if (STATE.dashboardTab === 'profile') {
      renderProfileDetails();
    }

    lucide.createIcons();
  }

  function renderProfileDetails() {
    const user = STATE.currentUser;
    if (!user) return;

    const usnEl = document.getElementById('dash-profile-usn');
    const deptEl = document.getElementById('dash-profile-dept');
    const hostelEl = document.getElementById('dash-profile-hostel');
    const emailEl = document.getElementById('dash-profile-email');

    if (usnEl) usnEl.innerText = user.usn || "1BT23CS084";
    if (deptEl) deptEl.innerText = user.department || user.branch;
    if (hostelEl) hostelEl.innerText = user.hostel || "Hostel Block 1 (Senior Wing)";
    if (emailEl) emailEl.innerText = user.email;
  }

  // Render My Listings Tab in Dashboard
  function renderMyListings() {
    const container = document.getElementById('dash-my-listings-list');
    if (!container) return;

    const currentUserId = STATE.currentUser ? STATE.currentUser.id : null;
    const myListings = STATE.listings.filter(i => i.seller.id === currentUserId);

    if (myListings.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center glass-panel rounded-2xl border border-slate-800">
          <p class="text-sm text-slate-400 mb-4">You have not published any items in the BITS marketplace yet.</p>
          <button onclick="window.REXCHANGE.openCreateListingModal()" class="neon-btn-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5">
            <i data-lucide="plus" class="w-4 h-4"></i> Post New Resource
          </button>
        </div>
      `;
      lucide.createIcons({ root: container });
      return;
    }

    container.innerHTML = myListings.map(item => `
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all">
        <div class="flex items-center gap-4">
          <img src="${item.images[0]}" alt="${item.title}" class="w-16 h-16 rounded-xl object-cover border border-slate-700 flex-shrink-0" />
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs px-2 py-0.5 rounded uppercase font-mono text-[10px] ${item.listingType === 'free' ? 'badge-free' : (item.listingType === 'exchange' ? 'badge-exchange' : 'badge-sale')}">
                ${item.listingType}
              </span>
              <span class="text-xs text-slate-400 font-mono">${item.timeAgo}</span>
            </div>
            <h4 class="font-heading font-semibold text-slate-100 text-sm mb-1">${item.title}</h4>
            <div class="text-emerald-400 font-bold text-sm">
              ${item.listingType === 'free' ? 'FREE' : '₹' + item.price}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button onclick="window.REXCHANGE.openDetail('${item.id}')" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
            Preview
          </button>
          <button onclick="window.REXCHANGE.deleteMyListing('${item.id}')" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50">
            Remove
          </button>
        </div>
      </div>
    `).join('');

    lucide.createIcons({ root: container });
  }

  // Render Saved Items Tab
  function renderSavedItems() {
    const container = document.getElementById('dash-saved-list');
    if (!container) return;

    const savedItems = STATE.listings.filter(i => STATE.savedItemIds.has(i.id));

    if (savedItems.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center glass-panel rounded-2xl border border-slate-800">
          <p class="text-sm text-slate-400 mb-4">No saved items yet. Tap the heart icon on any campus resource to save it here.</p>
          <button onclick="window.REXCHANGE.openTab('marketplace')" class="neon-btn-secondary px-4 py-2 rounded-xl text-xs font-bold">
            Explore Marketplace
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${savedItems.map(item => createListingCardHTML(item)).join('')}
      </div>
    `;
    lucide.createIcons({ root: container });
  }

  // Render My Offers Tab
  function renderMyOffers() {
    const container = document.getElementById('dash-offers-list');
    if (!container) return;

    if (STATE.myOffers.length === 0) {
      container.innerHTML = `<p class="text-sm text-slate-400 py-6 text-center">No active offers or exchange proposals.</p>`;
      return;
    }

    container.innerHTML = STATE.myOffers.map(off => `
      <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
              ${off.type}
            </span>
            <span class="text-xs text-slate-500 font-mono">${off.date}</span>
          </div>
          <h4 class="font-heading font-semibold text-slate-200 text-sm">${off.itemTitle}</h4>
          ${off.proposal ? `<p class="text-xs text-slate-400 mt-1">${off.proposal}</p>` : ''}
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <div class="text-emerald-400 font-bold text-base">₹${off.offeredAmount}</div>
            <div class="text-[11px] text-${off.statusColor}-400 font-semibold">${off.status}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render Messages Inbox
  function renderMessagesInbox() {
    const contactsContainer = document.getElementById('chat-contacts-list');
    if (!contactsContainer) return;

    const sellers = Object.keys(STATE.messages);
    if (!STATE.activeChatSellerId && sellers.length > 0) {
      STATE.activeChatSellerId = sellers[0];
    }

    contactsContainer.innerHTML = sellers.map(sellerId => {
      const msgs = STATE.messages[sellerId] || [];
      const lastMsg = msgs[msgs.length - 1];
      const isActive = STATE.activeChatSellerId === sellerId;
      const sellerData = STATE.users.find(u => u.id === sellerId) || {
        name: lastMsg?.senderName || "BITS Student",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
      };

      return `
        <div onclick="window.REXCHANGE.selectChatContact('${sellerId}')" 
             class="p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${isActive ? 'bg-emerald-500/15 border border-emerald-500/40' : 'bg-slate-900/40 hover:bg-slate-900 border border-slate-800'}">
          <img src="${sellerData.avatar}" alt="${sellerData.name}" class="w-10 h-10 rounded-full object-cover border border-slate-700 flex-shrink-0" />
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-200 truncate">${sellerData.name}</span>
              <span class="text-[10px] text-slate-500 font-mono">${lastMsg?.timestamp || ''}</span>
            </div>
            <p class="text-xs text-slate-400 truncate mt-0.5">${lastMsg?.text || 'No messages'}</p>
          </div>
        </div>
      `;
    }).join('');

    renderActiveChatMessages();
  }

  function renderActiveChatMessages() {
    const container = document.getElementById('chat-messages-container');
    const headerName = document.getElementById('chat-active-name');
    if (!container || !STATE.activeChatSellerId) return;

    const msgs = STATE.messages[STATE.activeChatSellerId] || [];
    const sellerData = STATE.users.find(u => u.id === STATE.activeChatSellerId) || {
      name: "BITS Student",
      college: "Bangalore Institute of Technology & Sciences"
    };

    if (headerName) {
      headerName.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="font-semibold text-slate-100">${sellerData.name}</span>
          <span class="text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
          </span>
        </div>
        <div class="text-[11px] text-slate-400">📍 BITS Bangalore • Verified Student</div>
      `;
    }

    container.innerHTML = msgs.map(m => `
      <div class="flex flex-col ${m.isUser ? 'items-end' : 'items-start'} mb-3">
        <div class="max-w-[80%] rounded-2xl p-3.5 text-xs ${
          m.isUser 
            ? 'bg-emerald-600 text-white rounded-br-none shadow-lg' 
            : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
        }">
          <p>${m.text}</p>
        </div>
        <span class="text-[10px] text-slate-500 mt-1 font-mono px-1">${m.timestamp}</span>
      </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
  }

  // Send a Chat Message with Smart Simulation Auto-Reply
  function sendMessage() {
    if (!requireAuth()) return;

    const input = document.getElementById('chat-input-text');
    if (!input || !input.value.trim() || !STATE.activeChatSellerId) return;

    const text = input.value.trim();
    input.value = '';

    const newMsg = {
      id: "m_" + Date.now(),
      sender: STATE.currentUser.id,
      senderName: STATE.currentUser.name,
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };

    if (!STATE.messages[STATE.activeChatSellerId]) {
      STATE.messages[STATE.activeChatSellerId] = [];
    }

    STATE.messages[STATE.activeChatSellerId].push(newMsg);
    localStorage.setItem(LS_KEYS.MESSAGES, JSON.stringify(STATE.messages));
    renderActiveChatMessages();
    renderMessagesInbox();

    // Auto simulated response
    setTimeout(() => {
      const replies = [
        "Sounds good! Let's meet near the Central Library discussion area around 4:30 PM.",
        "Sure, I'll bring the item to the Student Activity Center cafeteria.",
        "Yes, it is in great condition as described. See you on campus!",
        "Thanks for confirming! I'll carry it after my 3rd period lecture."
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const sellerReply = {
        id: "m_reply_" + Date.now(),
        sender: STATE.activeChatSellerId,
        senderName: "Student",
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false
      };

      STATE.messages[STATE.activeChatSellerId].push(sellerReply);
      localStorage.setItem(LS_KEYS.MESSAGES, JSON.stringify(STATE.messages));
      renderActiveChatMessages();
      renderMessagesInbox();
      showToast("New message received from BITS peer", "info");
    }, 1200);
  }

  // Toggle Saved / Wishlist
  function toggleSave(itemId) {
    if (!requireAuth()) return;

    if (STATE.savedItemIds.has(itemId)) {
      STATE.savedItemIds.delete(itemId);
      showToast("Removed from your saved items", "info");
    } else {
      STATE.savedItemIds.add(itemId);
      showToast("Saved to your BITS wishlist!", "success");
    }

    localStorage.setItem(LS_KEYS.SAVED, JSON.stringify(Array.from(STATE.savedItemIds)));
    
    // Refresh current view
    if (STATE.activeTab === 'marketplace') renderMarketplace();
    if (STATE.activeTab === 'dashboard') renderDashboard();
    if (STATE.activeTab === 'campus') renderCampusExchange();
  }

  // Open Item Detail Modal
  function openDetail(itemId) {
    const item = STATE.listings.find(i => i.id === itemId);
    if (!item) return;

    STATE.currentDetailItem = item;
    const modal = document.getElementById('modal-item-detail');
    const content = document.getElementById('modal-item-detail-content');
    if (!modal || !content) return;

    const isSaved = STATE.savedItemIds.has(item.id);
    const badgeClass = item.listingType === 'free' ? 'badge-free' : (item.listingType === 'exchange' ? 'badge-exchange' : 'badge-sale');
    const badgeText = item.listingType === 'free' ? '🎁 FREE GIVEAWAY' : (item.listingType === 'exchange' ? '🔄 STUDENT EXCHANGE' : '⚡ AVAILABLE FOR SALE');

    content.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <!-- Left: Image Gallery -->
        <div class="md:col-span-6 flex flex-col gap-3">
          <div class="h-80 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
            <img src="${item.images[0]}" alt="${item.title}" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-md ${badgeClass}">
              ${badgeText}
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <i data-lucide="shield-alert" class="w-4 h-4 text-amber-400 flex-shrink-0"></i>
            <span>Meet inside BITS daylight zones: Central Library, SAC, or Cafeteria.</span>
          </div>
        </div>

        <!-- Right: Details -->
        <div class="md:col-span-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono uppercase tracking-wider text-emerald-400">${item.categoryName}</span>
              <span class="text-xs text-slate-400 font-mono">${item.timeAgo}</span>
            </div>

            <h2 class="font-heading font-bold text-2xl text-slate-100 mb-2">${item.title}</h2>

            <div class="flex items-baseline gap-2 mb-4">
              ${item.listingType === 'free' 
                ? '<span class="text-3xl font-extrabold text-cyan-400 font-heading">FREE</span>' 
                : `<span class="text-3xl font-extrabold text-emerald-400 font-heading">₹${item.price.toLocaleString('en-IN')}</span>` + 
                  (item.originalPrice ? `<span class="text-sm text-slate-500 line-through">MRP ₹${item.originalPrice}</span>` : '')
              }
              <span class="text-xs px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 ml-2">
                ${item.condition}
              </span>
            </div>

            <p class="text-sm text-slate-300 leading-relaxed mb-5">${item.description}</p>

            ${item.exchangeFor ? `
              <div class="mb-4 p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 text-xs text-purple-200">
                <span class="font-bold flex items-center gap-1.5 mb-1"><i data-lucide="arrow-left-right" class="w-4 h-4 text-purple-400"></i> Preferred Swap Terms:</span>
                ${item.exchangeFor}
              </div>
            ` : ''}

            <!-- Seller Card -->
            <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-6">
              <div class="text-[11px] uppercase font-mono tracking-wider text-slate-400 mb-2">Verified BITS Student Seller</div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <img src="${item.seller.avatar}" alt="${item.seller.name}" class="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/40" />
                  <div>
                    <div class="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                      ${item.seller.name}
                      <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono">
                        BITS Verified
                      </span>
                    </div>
                    <div class="text-xs text-slate-400">📍 BITS Main Campus • ${item.pickupSpot || 'Campus Quad'}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs font-bold text-amber-400 flex items-center justify-end gap-1">
                    <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i> ${item.seller.rating}
                  </div>
                  <div class="text-[10px] text-slate-500">${item.seller.reviewsCount} campus trades</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2 pt-2 border-t border-slate-800">
            <div class="grid grid-cols-2 gap-3">
              <button onclick="window.REXCHANGE.openOfferModal('${item.id}')" 
                      class="neon-btn-primary py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                <i data-lucide="tag" class="w-4 h-4"></i> Make Offer
              </button>
              <button onclick="window.REXCHANGE.startChatWithSeller('${item.seller.id}', '${item.title}')" 
                      class="neon-btn-secondary py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                <i data-lucide="message-square" class="w-4 h-4"></i> Message Student
              </button>
            </div>

            <div class="flex items-center justify-between pt-2">
              <button onclick="window.REXCHANGE.toggleSave('${item.id}'); window.REXCHANGE.openDetail('${item.id}');" 
                      class="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 py-1 px-2">
                <i data-lucide="heart" class="w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}"></i>
                ${isSaved ? 'Saved in Wishlist' : 'Save for Later'}
              </button>
              <button onclick="window.REXCHANGE.openReportModal('${item.id}')" 
                      class="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 py-1 px-2">
                <i data-lucide="flag" class="w-3.5 h-3.5"></i> Report Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    lucide.createIcons({ root: modal });
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  }

  // Open Offer Modal
  function openOfferModal(itemId) {
    if (!requireAuth()) return;

    const item = STATE.listings.find(i => i.id === itemId);
    if (!item) return;

    STATE.currentDetailItem = item;
    const modal = document.getElementById('modal-offer');
    const titleEl = document.getElementById('offer-item-title');
    const priceEl = document.getElementById('offer-item-original-price');
    const inputVal = document.getElementById('offer-amount-input');

    if (titleEl) titleEl.innerText = item.title;
    if (priceEl) priceEl.innerText = item.listingType === 'free' ? 'FREE' : `₹${item.price}`;
    if (inputVal) inputVal.value = item.price > 0 ? Math.max(0, item.price - 50) : 0;

    modal.classList.remove('hidden');
    lucide.createIcons({ root: modal });
  }

  function submitOffer() {
    if (!requireAuth()) return;

    const item = STATE.currentDetailItem;
    if (!item) return;

    const offerVal = document.getElementById('offer-amount-input')?.value || item.price;
    const notesVal = document.getElementById('offer-notes-input')?.value || 'Available for campus pickup at Central Library';

    const newOffer = {
      id: "off_" + Date.now(),
      itemId: item.id,
      itemTitle: item.title,
      offeredAmount: Number(offerVal),
      type: item.listingType === 'exchange' ? 'Exchange Proposal' : 'Cash Offer',
      proposal: notesVal,
      status: "Offer Sent to " + item.seller.name,
      statusColor: "emerald",
      date: "Just now"
    };

    STATE.myOffers.unshift(newOffer);
    localStorage.setItem(LS_KEYS.OFFERS, JSON.stringify(STATE.myOffers));

    closeModal('modal-offer');
    closeModal('modal-item-detail');
    showToast(`Offer of ₹${offerVal} sent to ${item.seller.name}!`, 'success');
  }

  // Create Listing Modal
  function openCreateListingModal() {
    if (!requireAuth()) return;

    const modal = document.getElementById('modal-create-listing');
    if (!modal) return;
    modal.classList.remove('hidden');
    updateListingPreview();
    lucide.createIcons({ root: modal });
  }

  // Live Preview inside Create Listing Form
  function updateListingPreview() {
    const title = document.getElementById('new-item-title')?.value || 'Your Item Title';
    const categorySelect = document.getElementById('new-item-category');
    const categoryName = categorySelect?.options[categorySelect.selectedIndex]?.text || 'Study Materials';
    const price = document.getElementById('new-item-price')?.value || '0';
    const type = document.querySelector('input[name="new-item-type"]:checked')?.value || 'sale';
    const condition = document.getElementById('new-item-condition')?.value || 'Good Condition';
    const desc = document.getElementById('new-item-desc')?.value || 'Add a clear description about your item, edition, condition, and preferred BITS campus meetup point.';
    const imgPreview = document.getElementById('preview-card-img');
    const titlePreview = document.getElementById('preview-card-title');
    const catPreview = document.getElementById('preview-card-cat');
    const pricePreview = document.getElementById('preview-card-price');
    const condPreview = document.getElementById('preview-card-cond');
    const descPreview = document.getElementById('preview-card-desc');
    const badgePreview = document.getElementById('preview-card-badge');

    if (titlePreview) titlePreview.innerText = title;
    if (catPreview) catPreview.innerText = categoryName;
    if (condPreview) condPreview.innerText = condition;
    if (descPreview) descPreview.innerText = desc;

    if (pricePreview) {
      pricePreview.innerHTML = type === 'free' 
        ? '<span class="text-cyan-400 font-extrabold text-lg">FREE</span>' 
        : `<span class="text-emerald-400 font-extrabold text-lg">₹${Number(price).toLocaleString('en-IN')}</span>`;
    }

    if (badgePreview) {
      badgePreview.innerText = type === 'free' ? '🎁 FREE' : (type === 'exchange' ? '🔄 EXCHANGE' : '⚡ SALE');
    }
  }

  function handleImagePresetSelect(url) {
    const imgPreview = document.getElementById('preview-card-img');
    const hiddenInput = document.getElementById('new-item-image-url');
    if (imgPreview) imgPreview.src = url;
    if (hiddenInput) hiddenInput.value = url;
    showToast("Template image applied", "info");
  }

  function submitNewListing(e) {
    if (e) e.preventDefault();
    if (!requireAuth()) return;

    const title = document.getElementById('new-item-title')?.value;
    const category = document.getElementById('new-item-category')?.value;
    const categoryName = document.getElementById('new-item-category')?.selectedOptions[0]?.text;
    const price = Number(document.getElementById('new-item-price')?.value || 0);
    const type = document.querySelector('input[name="new-item-type"]:checked')?.value || 'sale';
    const condition = document.getElementById('new-item-condition')?.value || 'Good Condition';
    const desc = document.getElementById('new-item-desc')?.value;
    const pickupSpot = document.getElementById('new-item-pickup')?.value || 'Central Library Quad';
    const imageUrl = document.getElementById('new-item-image-url')?.value || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

    if (!title || !desc) {
      showToast("Please fill in the required item title and description", "error");
      return;
    }

    const newItem = {
      id: "item_custom_" + Date.now(),
      title: title,
      category: category,
      categoryName: categoryName,
      price: type === 'free' ? 0 : price,
      originalPrice: type === 'free' ? 0 : Math.round(price * 1.5),
      listingType: type,
      condition: condition,
      distance: "0.1 km away",
      pickupSpot: pickupSpot,
      timeAgo: "Just now",
      featured: true,
      images: [imageUrl],
      description: desc,
      seller: {
        id: STATE.currentUser.id,
        name: STATE.currentUser.name,
        college: "Bangalore Institute of Technology & Sciences (BITS)",
        avatar: STATE.currentUser.avatar,
        verified: true,
        rating: STATE.currentUser.rating || 5.0,
        reviewsCount: (STATE.currentUser.exchangeCount || 0) + 1,
        responseTime: "< 5 mins"
      }
    };

    // Save custom listings
    const customListings = JSON.parse(localStorage.getItem(LS_KEYS.CUSTOM_LISTINGS) || '[]');
    customListings.unshift(newItem);
    localStorage.setItem(LS_KEYS.CUSTOM_LISTINGS, JSON.stringify(customListings));

    STATE.listings.unshift(newItem);

    closeModal('modal-create-listing');
    showToast("Resource listed successfully on BITS RExchange!", "success");
    setActiveTab('marketplace');
  }

  function deleteMyListing(itemId) {
    STATE.listings = STATE.listings.filter(i => i.id !== itemId);
    const customListings = JSON.parse(localStorage.getItem(LS_KEYS.CUSTOM_LISTINGS) || '[]').filter(i => i.id !== itemId);
    localStorage.setItem(LS_KEYS.CUSTOM_LISTINGS, JSON.stringify(customListings));
    renderMyListings();
    showToast("Listing deleted", "info");
  }

  // Start Chat directly from listing
  function startChatWithSeller(sellerId, itemTitle) {
    if (!requireAuth()) return;

    closeModal('modal-item-detail');
    STATE.activeChatSellerId = sellerId;
    STATE.dashboardTab = 'messages';
    setActiveTab('dashboard');

    if (itemTitle && (!STATE.messages[sellerId] || STATE.messages[sellerId].length === 0)) {
      STATE.messages[sellerId] = [
        {
          id: "m_auto_" + Date.now(),
          sender: STATE.currentUser.id,
          senderName: STATE.currentUser.name,
          text: `Hi! I am interested in your listing: "${itemTitle}". Is it still available for BITS campus pickup?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUser: true
        }
      ];
      localStorage.setItem(LS_KEYS.MESSAGES, JSON.stringify(STATE.messages));
    }
  }

  // Event Ticket Modal
  function openEventModal(eventId) {
    if (!requireAuth()) return;

    const evt = window.REXCHANGE_DATA.events.find(e => e.id === eventId);
    if (!evt) return;

    const modal = document.getElementById('modal-event-ticket');
    const content = document.getElementById('modal-event-ticket-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="p-6 text-center">
        <div class="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto mb-4 text-cyan-400">
          <i data-lucide="qr-code" class="w-8 h-8"></i>
        </div>
        <span class="text-[11px] font-mono uppercase px-2.5 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
          Digital BITS Campus Pass
        </span>
        <h3 class="font-heading font-bold text-xl text-slate-100 mt-2 mb-1">${evt.title}</h3>
        <p class="text-xs text-slate-400 mb-4">📍 ${evt.venue} • ${evt.date}</p>

        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-5 flex items-center justify-between text-left">
          <div>
            <div class="text-[11px] text-slate-500">Student Attendee</div>
            <div class="text-xs font-bold text-slate-200">${STATE.currentUser.name} (${STATE.currentUser.usn || 'BITS'})</div>
          </div>
          <div class="text-right">
            <div class="text-[11px] text-slate-500">Price</div>
            <div class="text-sm font-extrabold text-cyan-400">₹${evt.price}</div>
          </div>
        </div>

        <button onclick="window.REXCHANGE.confirmEventBooking('${evt.id}')" 
                class="neon-btn-cyan w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
          <i data-lucide="check-circle" class="w-4 h-4"></i> Confirm Student Pass (₹${evt.price})
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
    lucide.createIcons({ root: modal });
  }

  function confirmEventBooking(eventId) {
    closeModal('modal-event-ticket');
    showToast("Event pass reserved! Check in with your BITS student ID at the entrance.", "success");
  }

  // Report Modal
  function openReportModal(itemId) {
    const modal = document.getElementById('modal-report');
    if (modal) modal.classList.remove('hidden');
    lucide.createIcons({ root: modal });
  }

  function submitReport() {
    closeModal('modal-report');
    showToast("Thank you for keeping our college community safe. Report submitted for student moderator review.", "info");
  }

  // Reset Filters
  function resetFilters() {
    STATE.filters = {
      search: '',
      category: 'all',
      type: 'all',
      condition: 'all',
      maxPrice: 3000,
      sortBy: 'recommended',
      verifiedOnly: false
    };

    const sInput = document.getElementById('search-input');
    const catSelect = document.getElementById('filter-category');
    const typeSelect = document.getElementById('filter-type');
    const sortSelect = document.getElementById('filter-sort');
    const priceSlider = document.getElementById('filter-price-range');
    const priceVal = document.getElementById('filter-price-val');

    if (sInput) sInput.value = '';
    if (catSelect) catSelect.value = 'all';
    if (typeSelect) typeSelect.value = 'all';
    if (sortSelect) sortSelect.value = 'recommended';
    if (priceSlider) priceSlider.value = 3000;
    if (priceVal) priceVal.innerText = '₹3,000';

    renderMarketplace();
  }

  // Initialize Event Listeners
  function initListeners() {
    // Search inputs
    const mainSearch = document.getElementById('search-input');
    if (mainSearch) {
      mainSearch.addEventListener('input', (e) => {
        STATE.filters.search = e.target.value;
        renderMarketplace();
      });
    }

    const heroSearch = document.getElementById('hero-search-input');
    if (heroSearch) {
      heroSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          STATE.filters.search = heroSearch.value;
          if (mainSearch) mainSearch.value = heroSearch.value;
          setActiveTab('marketplace');
        }
      });
    }

    // Filter controls
    const catFilter = document.getElementById('filter-category');
    if (catFilter) {
      catFilter.addEventListener('change', (e) => {
        STATE.filters.category = e.target.value;
        renderMarketplace();
      });
    }

    const typeFilter = document.getElementById('filter-type');
    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        STATE.filters.type = e.target.value;
        renderMarketplace();
      });
    }

    const sortFilter = document.getElementById('filter-sort');
    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        STATE.filters.sortBy = e.target.value;
        renderMarketplace();
      });
    }

    const priceRange = document.getElementById('filter-price-range');
    const priceVal = document.getElementById('filter-price-val');
    if (priceRange) {
      priceRange.addEventListener('input', (e) => {
        STATE.filters.maxPrice = Number(e.target.value);
        if (priceVal) priceVal.innerText = `₹${Number(e.target.value).toLocaleString('en-IN')}`;
        renderMarketplace();
      });
    }

    // Live preview listeners for Create Listing
    const formFields = ['new-item-title', 'new-item-category', 'new-item-price', 'new-item-condition', 'new-item-desc'];
    formFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateListingPreview);
    });

    document.querySelectorAll('input[name="new-item-type"]').forEach(r => {
      r.addEventListener('change', updateListingPreview);
    });
  }

  // Public API
  window.REXCHANGE = {
    init: function () {
      initData();
      renderCategoryCards('home-categories-grid');
      renderCampusExchange();
      renderMarketplace();
      renderEvents();
      initListeners();
      updateNavAuthUI();
    },
    openTab: function (tabName) {
      setActiveTab(tabName);
    },
    openCategory: function (categoryId) {
      setActiveTab('marketplace', categoryId);
    },
    setDashTab: function (dashTab) {
      STATE.dashboardTab = dashTab;
      renderDashboard();
    },
    openDetail: openDetail,
    closeModal: closeModal,
    toggleSave: toggleSave,
    openOfferModal: openOfferModal,
    submitOffer: submitOffer,
    openCreateListingModal: openCreateListingModal,
    submitNewListing: submitNewListing,
    deleteMyListing: deleteMyListing,
    handleImagePresetSelect: handleImagePresetSelect,
    startChatWithSeller: startChatWithSeller,
    selectChatContact: function (sellerId) {
      STATE.activeChatSellerId = sellerId;
      renderMessagesInbox();
    },
    sendMessage: sendMessage,
    openEventModal: openEventModal,
    confirmEventBooking: confirmEventBooking,
    openReportModal: openReportModal,
    submitReport: submitReport,
    resetFilters: resetFilters,
    showToast: showToast,
    // Auth portal
    openAuthModal: openAuthModal,
    closeAuthModal: closeAuthModal,
    switchAuthTab: switchAuthTab,
    quickLoginAs: quickLoginAs,
    handleSignIn: handleSignIn,
    handleSignUp: handleSignUp,
    handleSignOut: handleSignOut
  };

  // Start on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.REXCHANGE.init();
  });
})();
