/* ==========================================================================
   AFRI TECH HUB - APPLICATION LOGIC & ROUTER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize Application ---
  App.init();
});

const App = {
  // App State
  state: {
    opportunities: [],
    categories: [],
    theme: 'light',
    currentPage: 'home',
    searchQuery: '',
    selectedCategory: 'All',
    sortBy: 'latest', // 'latest', 'deadline'
    visibleLimit: 6, // for opportunities page pagination
    homeVisibleLimit: 6 // for home page listings
  },

  // DOM Cache
  nodes: {
    content: document.getElementById('app-content'),
    navLinks: document.querySelectorAll('.nav-link'),
    navBrand: document.getElementById('nav-brand'),
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    menuToggle: document.getElementById('menu-toggle'),
    navMenu: document.getElementById('nav-menu'),
    floatingAddBtn: document.getElementById('floating-add-btn'),
    modal: document.getElementById('add-post-modal'),
    modalClose: document.getElementById('modal-close-btn'),
    addForm: document.getElementById('add-opportunity-form'),
    toast: document.getElementById('toast-alert'),
    toastMsg: document.getElementById('toast-message')
  },

  init() {
    // Load state from local storage or mock database
    this.state.opportunities = DataStore.getOpportunities();
    this.state.categories = DataStore.getCategories();
    
    // Bind Event Listeners
    this.bindEvents();
    
    // Set Theme
    this.initTheme();

    // Trigger Initial Route
    this.router();
  },

  bindEvents() {
    // Hash routing
    window.addEventListener('hashchange', () => this.router());

    // Theme toggle
    this.nodes.themeToggle.addEventListener('click', () => this.toggleTheme());

    // Mobile nav toggle
    this.nodes.menuToggle.addEventListener('click', () => {
      this.nodes.navMenu.classList.toggle('active');
      const icon = this.nodes.menuToggle.querySelector('i');
      if (this.nodes.navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close mobile nav when clicking a link
    this.nodes.navMenu.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link')) {
        this.nodes.navMenu.classList.remove('active');
        this.nodes.menuToggle.querySelector('i').className = 'fa-solid fa-bars';
      }
    });

    // Modal triggers
    this.nodes.floatingAddBtn.addEventListener('click', () => this.openModal());
    this.nodes.modalClose.addEventListener('click', () => this.closeModal());
    this.nodes.modal.addEventListener('click', (e) => {
      if (e.target === this.nodes.modal) this.closeModal();
    });

    // Submit new opportunity
    this.nodes.addForm.addEventListener('submit', (e) => this.handleNewOpportunity(e));
  },

  // --- Theme Management ---
  initTheme() {
    const savedTheme = localStorage.getItem('ath_theme') || 'light';
    this.state.theme = savedTheme;
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      this.nodes.themeIcon.className = 'fa-solid fa-sun';
    } else {
      document.body.classList.remove('dark-mode');
      this.nodes.themeIcon.className = 'fa-solid fa-moon';
    }
  },

  toggleTheme() {
    if (this.state.theme === 'light') {
      this.state.theme = 'dark';
      document.body.classList.add('dark-mode');
      this.nodes.themeIcon.className = 'fa-solid fa-sun';
    } else {
      this.state.theme = 'light';
      document.body.classList.remove('dark-mode');
      this.nodes.themeIcon.className = 'fa-solid fa-moon';
    }
    localStorage.setItem('ath_theme', this.state.theme);
  },

  // --- Modal Controllers ---
  openModal() {
    this.nodes.modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  },

  closeModal() {
    this.nodes.modal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock background scroll
    this.nodes.addForm.reset();
  },

  // --- Router Engine ---
  router() {
    const hash = window.location.hash || '#home';
    let route = hash;
    let queryParams = {};

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Parse Query Parameters (e.g. #opportunities?category=Jobs)
    if (hash.includes('?')) {
      const parts = hash.split('?');
      route = parts[0];
      const queryStr = parts[1];
      const params = new URLSearchParams(queryStr);
      for (const [key, value] of params.entries()) {
        queryParams[key] = value;
      }
    }

    // Dynamic ID routing check (e.g. #post/tef-entrepreneurship-2026)
    if (route.startsWith('#post/')) {
      const postId = route.substring(6); // Extract ID
      this.state.currentPage = 'post-detail';
      this.updateNavbarActiveState('opportunities');
      this.renderView('post-detail', { postId });
      return;
    }

    // Clean page name
    const pageName = route.substring(1);
    this.state.currentPage = pageName;
    this.updateNavbarActiveState(pageName);

    // Route Mapping
    switch (pageName) {
      case 'home':
        this.renderView('home');
        break;
      case 'opportunities':
        this.renderView('opportunities', queryParams);
        break;
      case 'categories':
        this.renderView('categories');
        break;
      case 'about':
        this.renderView('about');
        break;
      case 'faq':
        this.renderView('faq');
        break;
      case 'contact':
        this.renderView('contact');
        break;
      case 'privacy':
        this.renderView('privacy');
        break;
      case 'terms':
        this.renderView('terms');
        break;
      default:
        // Default to Home if route not found
        window.location.hash = '#home';
    }
  },

  updateNavbarActiveState(pageName) {
    this.nodes.navLinks.forEach(link => {
      if (link.getAttribute('data-route') === pageName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  // --- Toast Alert Helper ---
  showToast(message, type = 'success') {
    this.nodes.toastMsg.textContent = message;
    this.nodes.toast.className = `alert-popup ${type} active`;
    setTimeout(() => {
      this.nodes.toast.classList.remove('active');
    }, 4000);
  },

  // --- New Opportunity Creation ---
  handleNewOpportunity(e) {
    e.preventDefault();
    
    const title = document.getElementById('opp-title').value.trim();
    const company = document.getElementById('opp-company').value.trim();
    const category = document.getElementById('opp-category').value;
    const location = document.getElementById('opp-location').value.trim();
    const deadline = document.getElementById('opp-deadline').value;
    const shortDesc = document.getElementById('opp-short').value.trim();
    const description = document.getElementById('opp-desc').value.trim();
    const reqText = document.getElementById('opp-req').value.trim();
    const benText = document.getElementById('opp-ben').value.trim();
    const applyUrl = document.getElementById('opp-url').value.trim();
    const imgFile = document.getElementById('opp-img-file').files[0];

    const saveAndPublish = (imageSrc) => {
      // Map requirements & benefits text lines to arrays
      const requirements = reqText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      const benefits = benText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

      // Create unique ID slug
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

      // Date today
      const today = new Date().toISOString().split('T')[0];

      const newOpp = {
        id: slug,
        title,
        company,
        category,
        location,
        date: today,
        deadline,
        image: imageSrc,
        shortDescription: shortDesc,
        description,
        requirements,
        benefits,
        applyUrl,
        featured: false,
        trending: false
      };

      // Save and update state
      this.state.opportunities = DataStore.saveOpportunity(newOpp);
      this.state.categories = DataStore.getCategories(); // Refresh counts

      this.closeModal();
      this.showToast('Opportunity published successfully! Added to listings.', 'success');

      // Force re-render of current view if it is home or opportunities to reflect changes instantly
      if (this.state.currentPage === 'home' || this.state.currentPage === 'opportunities') {
        this.router();
      }
    };

    if (imgFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        saveAndPublish(event.target.result);
      };
      reader.onerror = (err) => {
        console.error("FileReader error: ", err);
        this.showToast('Failed to process image file.', 'error');
      };
      reader.readAsDataURL(imgFile);
    } else {
      saveAndPublish('');
    }
  },

  // ==========================================================================
  // VIEW RENDERERS & TEMPLATES
  // ==========================================================================
  
  renderView(view, params = {}) {
    // Show smooth skeleton transition before rendering content
    this.renderSkeleton();

    setTimeout(() => {
      let htmlContent = '';
      
      switch (view) {
        case 'home':
          htmlContent = this.templateHome();
          break;
        case 'opportunities':
          htmlContent = this.templateOpportunities(params);
          break;
        case 'categories':
          htmlContent = this.templateCategories();
          break;
        case 'about':
          htmlContent = this.templateAbout();
          break;
        case 'faq':
          htmlContent = this.templateFAQ();
          break;
        case 'contact':
          htmlContent = this.templateContact();
          break;
        case 'privacy':
          htmlContent = this.templatePrivacy();
          break;
        case 'terms':
          htmlContent = this.templateTerms();
          break;
        case 'post-detail':
          htmlContent = this.templateSinglePost(params.postId);
          break;
      }
      
      this.nodes.content.innerHTML = htmlContent;
      
      // Bind event listeners specific to the rendered view
      this.bindViewEvents(view, params);
    }, 250); // Simulated network delay for premium feel
  },

  renderSkeleton() {
    this.nodes.content.innerHTML = `
      <div class="container animate-fade-in" style="padding-top: 60px; padding-bottom: 60px;">
        <div class="skeleton-box" style="height: 40px; width: 300px; margin-bottom: 45px;"></div>
        <div class="opportunities-grid">
          ${Array(3).fill().map(() => `
            <div class="opportunity-card skeleton-card">
              <div class="card-header" style="flex-direction: column; gap: 15px;">
                <div class="skeleton-box" style="height: 20px; width: 120px;"></div>
                <div class="skeleton-box" style="height: 30px; width: 100%;"></div>
              </div>
              <div class="card-body">
                <div class="skeleton-box" style="height: 15px; width: 100%; margin-bottom: 10px;"></div>
                <div class="skeleton-box" style="height: 15px; width: 90%; margin-bottom: 10px;"></div>
                <div class="skeleton-box" style="height: 15px; width: 75%;"></div>
              </div>
              <div class="card-footer">
                <div class="skeleton-box" style="height: 15px; width: 80px;"></div>
                <div class="skeleton-box" style="height: 35px; width: 100px; border-radius: 8px;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  bindViewEvents(view, params) {
    if (view === 'home') {
      // Home Page Filters
      const searchInput = document.getElementById('home-search');
      const pills = document.querySelectorAll('.home-filter-pill');
      const cardsGrid = document.getElementById('home-opportunities-grid');
      const searchBtn = document.getElementById('home-search-btn');

      const filterHomeListings = () => {
        const query = searchInput.value.trim().toLowerCase();
        const activePill = document.querySelector('.home-filter-pill.active');
        const cat = activePill ? activePill.getAttribute('data-category') : 'All';
        
        let filtered = this.state.opportunities;
        if (cat !== 'All') {
          filtered = filtered.filter(opp => opp.category.toLowerCase() === cat.toLowerCase());
        }
        if (query) {
          filtered = filtered.filter(opp => 
            opp.title.toLowerCase().includes(query) || 
            opp.company.toLowerCase().includes(query) || 
            opp.shortDescription.toLowerCase().includes(query)
          );
        }

        // Render matching cards
        const subset = filtered.slice(0, this.state.homeVisibleLimit);
        if (subset.length === 0) {
          cardsGrid.innerHTML = `
            <div class="no-results">
              <i class="fa-solid fa-magnifying-glass"></i>
              <h3>No Opportunities Found</h3>
              <p>We couldn't find matches for your search. Try adjusting the query or check another category.</p>
            </div>
          `;
        } else {
          cardsGrid.innerHTML = subset.map(opp => this.cardTemplate(opp)).join('');
        }
      };

      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          filterHomeListings();
        });
      });

      searchInput.addEventListener('input', filterHomeListings);
      searchBtn.addEventListener('click', filterHomeListings);

      // FAQ accordions
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question-btn');
        btn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          // Collapse other active ones
          faqItems.forEach(i => i.classList.remove('active'));
          if (!isActive) item.classList.add('active');
        });
      });

      // Newsletter signup form
      const newsletterForm = document.getElementById('home-newsletter-form');
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value.trim();
        if (email) {
          this.showToast(`Thank you! ${email} has been subscribed to updates.`, 'success');
          newsletterForm.reset();
        }
      });
    }

    if (view === 'opportunities') {
      // Opportunities Browser Page
      const searchInput = document.getElementById('opp-search');
      const categorySelect = document.getElementById('opp-cat-filter');
      const sortSelect = document.getElementById('opp-sort');
      const cardsGrid = document.getElementById('opp-grid');
      const loadMoreBtn = document.getElementById('load-more-btn');

      // Check pre-filled query params
      if (params.category) {
        categorySelect.value = params.category.charAt(0).toUpperCase() + params.category.slice(1);
      }
      if (params.search) {
        searchInput.value = params.search;
      }

      const updateList = () => {
        const query = searchInput.value.trim().toLowerCase();
        const cat = categorySelect.value;
        const sort = sortSelect.value;

        let filtered = [...this.state.opportunities];

        // Apply category filter
        if (cat !== 'All') {
          filtered = filtered.filter(opp => opp.category.toLowerCase() === cat.toLowerCase());
        }

        // Apply search query
        if (query) {
          filtered = filtered.filter(opp => 
            opp.title.toLowerCase().includes(query) || 
            opp.company.toLowerCase().includes(query) || 
            opp.shortDescription.toLowerCase().includes(query) || 
            opp.location.toLowerCase().includes(query)
          );
        }

        // Apply sorting
        if (sort === 'latest') {
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sort === 'deadline') {
          filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        }

        // Handle load more
        const totalMatching = filtered.length;
        const subset = filtered.slice(0, this.state.visibleLimit);

        if (subset.length === 0) {
          cardsGrid.innerHTML = `
            <div class="no-results">
              <i class="fa-solid fa-magnifying-glass"></i>
              <h3>No opportunities match your filter</h3>
              <p>Try clearing the search query or selecting a different category.</p>
            </div>
          `;
          if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        } else {
          cardsGrid.innerHTML = subset.map(opp => this.cardTemplate(opp)).join('');
          
          if (loadMoreBtn) {
            if (subset.length < totalMatching) {
              loadMoreBtn.style.display = 'inline-flex';
            } else {
              loadMoreBtn.style.display = 'none';
            }
          }
        }
      };

      searchInput.addEventListener('input', updateList);
      categorySelect.addEventListener('change', updateList);
      sortSelect.addEventListener('change', updateList);

      if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
          this.state.visibleLimit += 6;
          updateList();
        });
      }

      // Initial run
      updateList();
    }

    if (view === 'faq') {
      // FAQ page accordions
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question-btn');
        btn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          faqItems.forEach(i => i.classList.remove('active'));
          if (!isActive) item.classList.add('active');
        });
      });

      // FAQ search filter
      const faqSearch = document.getElementById('faq-search');
      const faqResults = document.getElementById('faq-results');
      const faqData = DataStore.getFaqs();

      faqSearch.addEventListener('input', () => {
        const query = faqSearch.value.trim().toLowerCase();
        
        const filtered = faqData.filter(faq => 
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
          faqResults.innerHTML = `
            <div class="no-results">
              <i class="fa-solid fa-question-circle"></i>
              <h3>No FAQs Found</h3>
              <p>We couldn't find any FAQs matching your query.</p>
            </div>
          `;
        } else {
          faqResults.innerHTML = filtered.map((faq, idx) => `
            <div class="faq-item">
              <button class="faq-question-btn">
                <span>${faq.question}</span>
                <div class="faq-icon-box">
                  <i class="fa-solid fa-chevron-down"></i>
                </div>
              </button>
              <div class="faq-answer-wrapper">
                <div class="faq-answer">
                  <p>${faq.answer}</p>
                </div>
              </div>
            </div>
          `).join('');

          // Re-bind click listeners
          const newItems = faqResults.querySelectorAll('.faq-item');
          newItems.forEach(item => {
            const btn = item.querySelector('.faq-question-btn');
            btn.addEventListener('click', () => {
              const isActive = item.classList.contains('active');
              newItems.forEach(i => i.classList.remove('active'));
              if (!isActive) item.classList.add('active');
            });
          });
        }
      });
    }

    if (view === 'contact') {
      const contactForm = document.getElementById('ath-contact-form');
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('c-name').value.trim();
        const email = document.getElementById('c-email').value.trim();
        const subject = document.getElementById('c-subject').value.trim();
        const msg = document.getElementById('c-msg').value.trim();

        if (name && email && subject && msg) {
          this.showToast(`Thank you, ${name}! Your inquiry has been sent. We'll reply within 24 hours.`, 'success');
          contactForm.reset();
        }
      });
    }

    if (view === 'post-detail') {
      // Setup dynamic back button behavior
      const backBtn = document.getElementById('post-back-btn');
      if (backBtn) {
        backBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (document.referrer && window.location.hash.includes('post/')) {
            window.history.back();
          } else {
            window.location.hash = '#opportunities';
          }
        });
      }

      // Share links setup
      const copyBtn = document.getElementById('share-copy');
      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          navigator.clipboard.writeText(window.location.href).then(() => {
            this.showToast('Opportunity link copied to clipboard!', 'success');
          }).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        });
      }
    }
  },

  // ==========================================================================
  // VIEW TEMPLATE LITERALS
  // ==========================================================================

  // Opportunity Card HTML Generator
  cardTemplate(opp) {
    const iconClass = opp.category.toLowerCase().replace(' ', '-');
    const displayDate = this.formatDate(opp.date);
    const deadlineDate = this.formatDate(opp.deadline);

    return `
      <article class="opportunity-card animate-fade-in-up">
        <div class="card-image-container">
          <img src="${opp.image}" alt="${opp.title}">
          <span class="category-tag category-${iconClass} card-badge-floating">${opp.category}</span>
        </div>
        <div class="card-header">
          <div class="company-badge">
            <div class="company-logo-placeholder">
              ${opp.company.charAt(0)}
            </div>
            <span>${opp.company}</span>
          </div>
        </div>
        <div class="card-body">
          <h3 class="card-title">${opp.title}</h3>
          <p class="card-desc">${opp.shortDescription}</p>
          <div class="card-meta">
            <div class="meta-item">
              <i class="fa-solid fa-location-dot"></i>
              <span>${opp.location}</span>
            </div>
            <div class="meta-item">
              <i class="fa-solid fa-calendar-times"></i>
              <span>Deadline: ${deadlineDate}</span>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <span class="date">Posted: ${displayDate}</span>
          <a href="#post/${opp.id}" class="btn btn-primary btn-sm">
            Read More <i class="fa-solid fa-arrow-right" style="margin-left: 4px;"></i>
          </a>
        </div>
      </article>
    `;
  },

  formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  },

  // --- View: HOME ---
  templateHome() {
    const featuredOpp = this.state.opportunities.find(o => o.featured) || this.state.opportunities[0];
    const trendingOpps = this.state.opportunities.filter(o => o.trending).slice(0, 4);
    const latestOpps = this.state.opportunities.slice(0, this.state.homeVisibleLimit);

    return `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-grid">
          <div class="hero-text">
            <div class="hero-tag">
              <i class="fa-solid fa-fire"></i> Shared 2,500+ Active Opportunities
            </div>
            <h1 class="hero-title">
              Empowering the Next Generation of <span>African Entrepreneurs</span>
            </h1>
            <p class="hero-subtitle">
              Discover fully-funded grants, scholarships, local and remote jobs, vacancies, internships, and seed funding. Completely open-access. No login, no registration, no hidden fees.
            </p>
            <div class="hero-ctas">
              <a href="#opportunities" class="btn btn-primary">
                Explore Opportunities <i class="fa-solid fa-compass" style="margin-left: 8px;"></i>
              </a>
              <a href="https://chat.whatsapp.com/Bd2MI5seG7y8HoJjbfpQrH" target="_blank" rel="noopener" class="btn btn-secondary">
                Join Telegram / WhatsApp <i class="fa-brands fa-whatsapp" style="margin-left: 8px; color: #25d366;"></i>
              </a>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-illustration-bg"></div>
            <div class="hero-glass-card">
              <div class="icon">
                <i class="fa-solid fa-rocket"></i>
              </div>
              <h3>Afri Tech Hub</h3>
              <p>Connecting African talent to regional & global empowerment funds.</p>
              
              <div class="hero-stats-row">
                <div class="stat-item">
                  <div class="stat-number">54</div>
                  <div class="stat-label">Countries</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">15K+</div>
                  <div class="stat-label">Members</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">Zero</div>
                  <div class="stat-label">Fees</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Banner Section -->
      ${featuredOpp ? `
      <section class="featured-section container">
        <div class="featured-banner">
          <div class="featured-content">
            <h4>Featured Opportunity</h4>
            <h2>${featuredOpp.title}</h2>
            <p>${featuredOpp.shortDescription}</p>
            <div class="featured-meta">
              <div class="featured-meta-item">
                <i class="fa-solid fa-building"></i>
                <span>${featuredOpp.company}</span>
              </div>
              <div class="featured-meta-item">
                <i class="fa-solid fa-location-dot"></i>
                <span>${featuredOpp.location}</span>
              </div>
              <div class="featured-meta-item">
                <i class="fa-solid fa-hourglass-half"></i>
                <span>Deadline: ${this.formatDate(featuredOpp.deadline)}</span>
              </div>
            </div>
            <a href="#post/${featuredOpp.id}" class="btn btn-accent">
              View Opportunity Details <i class="fa-solid fa-arrow-right" style="margin-left: 8px;"></i>
            </a>
          </div>
          <div class="featured-visual-placeholder" style="display: flex; justify-content: center; align-items: center;">
            <div style="background-color: rgba(255, 255, 255, 0.05); padding: 40px; border-radius: 50%; border: 1px dashed rgba(255,255,255,0.15);">
              <i class="fa-solid fa-award" style="font-size: 100px; color: var(--color-accent); text-shadow: 0 0 20px rgba(245,158,11,0.5);"></i>
            </div>
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Popular Categories Grid -->
      <section class="container" style="padding-top: 40px; padding-bottom: 80px;">
        <div class="section-header">
          <div>
            <h2 class="section-title">Popular Categories</h2>
            <p class="section-subtitle">Browse curated programs based on your career or business objectives.</p>
          </div>
          <a href="#categories" class="btn btn-secondary btn-sm">All Categories <i class="fa-solid fa-grid-2" style="margin-left: 6px;"></i></a>
        </div>
        <div class="categories-grid">
          ${this.state.categories.slice(0, 3).map(cat => `
            <div class="category-card" onclick="window.location.hash='#opportunities?category=${cat.name}'">
              <div class="category-icon-box">
                <i class="fa-solid fa-${cat.icon}"></i>
              </div>
              <h3 class="category-name">${cat.name}</h3>
              <p class="category-desc">${cat.description}</p>
              <div class="category-count">${cat.count} Active Postings</div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Trending Section -->
      ${trendingOpps.length > 0 ? `
      <section class="container" style="padding-bottom: 80px;">
        <div class="section-header">
          <div>
            <h2 class="section-title">Trending Opportunities</h2>
            <p class="section-subtitle">Highly sought-after programs closing soon. Apply early to stand out.</p>
          </div>
        </div>
        <div class="opportunities-grid">
          ${trendingOpps.map(opp => this.cardTemplate(opp)).join('')}
        </div>
      </section>
      ` : ''}

      <!-- Main Directory / Browser (Search & Categories Pills) -->
      <section class="browser-section">
        <div class="container">
          <div class="section-header">
            <div>
              <h2 class="section-title">Latest Opportunities</h2>
              <p class="section-subtitle">Stay updated with newly posted vacancies, scholarships, and funds.</p>
            </div>
          </div>

          <!-- Dynamic Search & Filter Pills -->
          <div class="search-filter-wrapper">
            <div class="search-bar-row">
              <div class="search-input-container">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="home-search" class="search-input" placeholder="Search by title, organization, or keywords...">
              </div>
              <button id="home-search-btn" class="btn btn-primary">Find Posts</button>
            </div>
            
            <div class="filter-pills-row">
              <span class="filter-label">Quick Filters:</span>
              <button class="filter-pill home-filter-pill active" data-category="All">All Categories</button>
              ${this.state.categories.map(cat => `
                <button class="filter-pill home-filter-pill" data-category="${cat.name}">${cat.name}</button>
              `).join('')}
            </div>
          </div>

          <!-- Opportunities Listing Grid -->
          <div class="opportunities-grid" id="home-opportunities-grid">
            ${latestOpps.map(opp => this.cardTemplate(opp)).join('')}
          </div>

          <div class="load-more-container">
            <a href="#opportunities" class="btn btn-secondary">
              Browse All Listings <i class="fa-solid fa-list-ul" style="margin-left: 8px;"></i>
            </a>
          </div>
        </div>
      </section>

      <!-- FAQ Accordion section -->
      <section class="faq-section">
        <div class="container">
          <div class="section-header" style="justify-content: center; text-align: center; margin-bottom: 50px;">
            <div>
              <h2 class="section-title" style="margin: 0 auto;">Frequently Asked Questions</h2>
              <p class="section-subtitle">Everything you need to know about navigating opportunities on Afri Tech Hub.</p>
            </div>
          </div>
          <div class="faq-container">
            ${this.state.opportunities.length > 0 ? DataStore.getFaqs().slice(0, 4).map(faq => `
              <div class="faq-item">
                <button class="faq-question-btn">
                  <span>${faq.question}</span>
                  <div class="faq-icon-box">
                    <i class="fa-solid fa-chevron-down"></i>
                  </div>
                </button>
                <div class="faq-answer-wrapper">
                  <div class="faq-answer">
                    <p>${faq.answer}</p>
                  </div>
                </div>
              </div>
            `).join('') : ''}
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="#faq" class="btn btn-secondary btn-sm">View More FAQs</a>
          </div>
        </div>
      </section>

      <!-- Newsletter Section -->
      <section class="newsletter-section container">
        <div class="newsletter-card">
          <h2 class="newsletter-title">Subscribe to Opportunity Alerts</h2>
          <p class="newsletter-desc">Get direct email notifications about new grants, scholarships, and vacancies. Weekly digests, strictly zero spam.</p>
          <form class="newsletter-form" id="home-newsletter-form">
            <input type="email" class="newsletter-input" placeholder="Enter your email address" required>
            <button type="submit" class="btn btn-accent btn-sm">Subscribe</button>
          </form>
        </div>
      </section>
    `;
  },

  // --- View: OPPORTUNITIES BROWSER ---
  templateOpportunities(params) {
    return `
      <section class="container" style="padding-top: 60px; padding-bottom: 80px;">
        <div class="section-header" style="flex-direction: column; align-items: flex-start; margin-bottom: 30px;">
          <h1 style="font-size: 38px;">Discover Opportunities</h1>
          <p style="color: var(--text-secondary); margin-top: 8px;">Explore and filter active jobs, funding programs, and fellowships across Africa.</p>
        </div>

        <!-- Advanced Filter Row -->
        <div class="search-filter-wrapper" style="padding: 24px;">
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 20px;">
            <div class="search-input-container">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" id="opp-search" class="search-input" placeholder="Search roles, sponsors, locations, or key terms...">
            </div>
            
            <div>
              <select id="opp-cat-filter" class="form-control" style="background-color: var(--bg-secondary); height: 56px;">
                <option value="All">All Categories</option>
                ${this.state.categories.map(cat => `
                  <option value="${cat.name}">${cat.name}</option>
                `).join('')}
              </select>
            </div>

            <div>
              <select id="opp-sort" class="form-control" style="background-color: var(--bg-secondary); height: 56px;">
                <option value="latest">Sort by: Date Posted</option>
                <option value="deadline">Sort by: Closest Deadline</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Listings Grid -->
        <div class="opportunities-grid" id="opp-grid">
          <!-- Dynamic cards injected by updateList() in app.js -->
        </div>

        <!-- Load More Pagination Button -->
        <div class="load-more-container">
          <button id="load-more-btn" class="btn btn-secondary" style="display: none;">
            Load More Listings <i class="fa-solid fa-chevron-down" style="margin-left: 8px;"></i>
          </button>
        </div>
      </section>
    `;
  },

  // --- View: CATEGORIES GRID ---
  templateCategories() {
    return `
      <section class="container" style="padding-top: 60px; padding-bottom: 80px;">
        <div class="section-header" style="flex-direction: column; align-items: flex-start; margin-bottom: 50px;">
          <h1 style="font-size: 38px;">Browse by Category</h1>
          <p style="color: var(--text-secondary); margin-top: 8px;">Find targeted support, grants, vacancies, or academic paths tailored for you.</p>
        </div>

        <div class="categories-grid">
          ${this.state.categories.map(cat => `
            <div class="category-card" onclick="window.location.hash='#opportunities?category=${cat.name}'">
              <div class="category-icon-box">
                <i class="fa-solid fa-${cat.icon}"></i>
              </div>
              <h3 class="category-name">${cat.name}</h3>
              <p class="category-desc">${cat.description}</p>
              <div class="category-count">${cat.count} Active Listings &rarr;</div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  },

  // --- View: ABOUT PAGE ---
  templateAbout() {
    return `
      <!-- About Hero -->
      <section class="about-hero">
        <div class="container animate-fade-in">
          <h1>Our Mission & Community</h1>
          <p>Connecting African talent to regional & global empowerment funds.</p>
        </div>
      </section>

      <!-- About Narrative -->
      <section class="container about-content-section">
        <div class="about-grid">
          <div class="about-text animate-fade-in-up">
            <h2>Bridging the Opportunity Gap in Africa</h2>
            <p>
              Afri Tech Hub was founded with a single driving mission: to democratize access to economic empowerment for African youth, tech founders, and graduates. 
            </p>
            <p>
              Oftentimes, life-changing resources, business grants, fully funded scholarships, and high-paying remote job listings exist but are scattered across complex databases, requiring paid subscriptions or complicated login credentials to discover.
            </p>
            <p>
              We believe that information is power, and access should be open. That's why Afri Tech Hub maintains a completely open platform with no logins, no user profiles, and no paywalls. We focus on simplicity and speed to deliver high-quality, verified opportunities directly to those who need them.
            </p>
          </div>
          
          <div class="about-visual-grid">
            <div class="about-stat-card">
              <div class="about-stat-num">20+</div>
              <div class="about-stat-label">Curated Daily Listings</div>
            </div>
            <div class="about-stat-card">
              <div class="about-stat-num">100%</div>
              <div class="about-stat-label">Free & Open Access</div>
            </div>
            <div class="about-stat-card">
              <div class="about-stat-num">54</div>
              <div class="about-stat-label">African Nations Served</div>
            </div>
            <div class="about-stat-card">
              <div class="about-stat-num">15K+</div>
              <div class="about-stat-label">Active Members</div>
            </div>
          </div>
        </div>

        <!-- Core Values -->
        <div style="margin-top: 80px;">
          <h2 style="text-align: center; margin-bottom: 45px; font-size: 32px;">Our Driving Values</h2>
          <div class="values-grid">
            <div class="value-card">
              <div class="value-icon"><i class="fa-solid fa-shield-halved"></i></div>
              <h3 class="value-title">Direct Verification</h3>
              <p class="value-desc">Every vacancy, grant, and scholarship is carefully verified against official databases to protect applicants from fraudulent postings.</p>
            </div>
            <div class="value-card">
              <div class="value-icon"><i class="fa-solid fa-lock-open"></i></div>
              <h3 class="value-title">Radical Accessibility</h3>
              <p class="value-desc">No accounts, no user data collection, and no logins. Access any link, description, and application guidelines in one click.</p>
            </div>
            <div class="value-card">
              <div class="value-icon"><i class="fa-solid fa-users"></i></div>
              <h3 class="value-title">Community Driven</h3>
              <p class="value-desc">Built for collaboration. Users can easily contribute new roles, and our instant notification updates keep the community ahead of deadlines.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  // --- View: FAQ PAGE ---
  templateFAQ() {
    const allFaqs = DataStore.getFaqs();
    return `
      <section class="container" style="padding-top: 60px; padding-bottom: 80px;">
        <div class="section-header" style="flex-direction: column; align-items: center; text-align: center; margin-bottom: 50px;">
          <h1 style="font-size: 38px;">Frequently Asked Questions</h1>
          <p style="color: var(--text-secondary); margin-top: 8px; max-width: 600px;">
            Find quick answers to common queries regarding application links, posting verification, and our WhatsApp community hubs.
          </p>
          <div class="search-input-container" style="max-width: 500px; width: 100%; margin-top: 30px; border: 1px solid var(--border-color); background-color: var(--bg-secondary);">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="faq-search" class="search-input" placeholder="Search FAQ topics (e.g. apply, verify, register)...">
          </div>
        </div>

        <div class="faq-container" id="faq-results">
          ${allFaqs.map(faq => `
            <div class="faq-item">
              <button class="faq-question-btn">
                <span>${faq.question}</span>
                <div class="faq-icon-box">
                  <i class="fa-solid fa-chevron-down"></i>
                </div>
              </button>
              <div class="faq-answer-wrapper">
                <div class="faq-answer">
                  <p>${faq.answer}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  },

  // --- View: CONTACT PAGE ---
  templateContact() {
    return `
      <section class="contact-hero">
        <div class="container animate-fade-in">
          <h1>Connect With Our Team</h1>
          <p>Have inquiries, media requests, or want to partner with us? We'd love to hear from you.</p>
        </div>
      </section>

      <section class="container contact-section">
        <div class="contact-grid">
          <!-- Info Panel -->
          <div class="contact-info-panel">
            <div class="contact-info-header">
              <h2>Help Us Reach More Founders</h2>
              <p>
                If you are a corporate brand, development bank, academic institution, or accelerator manager looking to promote opportunities, drop us a line. We list legitimate opportunities for free.
              </p>
            </div>

            <div class="contact-details-list">
              <div class="contact-card-item">
                <div class="contact-card-icon"><i class="fa-solid fa-envelope"></i></div>
                <div class="contact-card-content">
                  <h4>Email Support</h4>
                  <p>info@afritechhub.org</p>
                </div>
              </div>
              <div class="contact-card-item">
                <div class="contact-card-icon"><i class="fa-solid fa-phone"></i></div>
                <div class="contact-card-content">
                  <h4>Phone Hotline</h4>
                  <p>+2349159701354</p>
                </div>
              </div>
              <div class="contact-card-item">
                <div class="contact-card-icon"><i class="fa-solid fa-map-pin"></i></div>
                <div class="contact-card-content">
                  <h4>HQ Office</h4>
                  <p>Victoria Island, Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Card -->
          <div class="contact-form-card">
            <h3>Send a Message</h3>
            <form id="ath-contact-form">
              <div class="form-group">
                <label for="c-name" class="form-label">Full Name</label>
                <input type="text" id="c-name" class="form-control" placeholder="John Doe" required>
              </div>
              <div class="form-group">
                <label for="c-email" class="form-label">Email Address</label>
                <input type="email" id="c-email" class="form-control" placeholder="john@example.com" required>
              </div>
              <div class="form-group">
                <label for="c-subject" class="form-label">Subject</label>
                <input type="text" id="c-subject" class="form-control" placeholder="e.g. Partnership Request, Listing Bug" required>
              </div>
              <div class="form-group">
                <label for="c-msg" class="form-label">Your Message</label>
                <textarea id="c-msg" class="form-control" rows="5" placeholder="How can we assist you today?" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%;">Send Message <i class="fa-solid fa-paper-plane" style="margin-left: 8px;"></i></button>
            </form>
          </div>
        </div>
      </section>
    `;
  },

  // --- View: SINGLE POST DETAIL PAGE ---
  templateSinglePost(postId) {
    const opp = this.state.opportunities.find(o => o.id === postId);
    if (!opp) {
      return `
        <div class="container" style="padding-top: 100px; padding-bottom: 100px; text-align: center;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 64px; color: var(--color-accent); margin-bottom: 24px;"></i>
          <h2>Opportunity Not Found</h2>
          <p style="color: var(--text-secondary); margin-bottom: 30px;">The link you followed may be broken or the listing has expired.</p>
          <a href="#opportunities" class="btn btn-primary">Return to Directory</a>
        </div>
      `;
    }

    const iconClass = opp.category.toLowerCase().replace(' ', '-');
    const displayDate = this.formatDate(opp.date);
    const deadlineDate = this.formatDate(opp.deadline);

    // Filter similar items
    const similarOpps = this.state.opportunities
      .filter(o => o.category === opp.category && o.id !== opp.id)
      .slice(0, 3);

    return `
      <section class="container post-detail-section">
        <!-- Back Navigation Link -->
        <div style="margin-bottom: 32px;">
          <a href="#" id="post-back-btn" class="btn btn-secondary btn-sm">
            <i class="fa-solid fa-arrow-left" style="margin-right: 8px;"></i> Back to Listings
          </a>
        </div>

        <div class="post-detail-grid">
          <!-- Main Content Pane -->
          <article class="post-main-content">
            <div class="post-header-meta">
              <span class="category-tag category-${iconClass}">${opp.category}</span>
              <span style="color: var(--text-muted); font-size: 14px;"><i class="fa-solid fa-calendar" style="margin-right: 6px;"></i>Posted: ${displayDate}</span>
            </div>
            
            <div class="post-detail-image-container">
              <img src="${opp.image}" alt="${opp.title}">
            </div>
            
            <h1 class="post-title">${opp.title}</h1>

            <!-- Quick Metadata Bar -->
            <div class="post-meta-details-strip">
              <div class="strip-item">
                <div class="strip-icon"><i class="fa-solid fa-building"></i></div>
                <div class="strip-info">
                  <h5>Organization</h5>
                  <p>${opp.company}</p>
                </div>
              </div>
              <div class="strip-item">
                <div class="strip-icon"><i class="fa-solid fa-location-dot"></i></div>
                <div class="strip-info">
                  <h5>Location</h5>
                  <p>${opp.location}</p>
                </div>
              </div>
              <div class="strip-item">
                <div class="strip-icon"><i class="fa-solid fa-hourglass-half"></i></div>
                <div class="strip-info">
                  <h5>Deadline</h5>
                  <p>${deadlineDate}</p>
                </div>
              </div>
            </div>

            <!-- Body Details -->
            <div class="post-body-content">
              <h3>Description</h3>
              <p>${opp.description}</p>

              <h3>Requirements & Eligibility</h3>
              <ul>
                ${opp.requirements.map(req => `<li>${req}</li>`).join('')}
              </ul>

              <h3>Benefits & Offerings</h3>
              <ul>
                ${opp.benefits.map(ben => `<li>${ben}</li>`).join('')}
              </ul>
            </div>
          </article>

          <!-- Sidebar Pane -->
          <aside>
            <div class="post-sidebar-sticky">
              <!-- Call to Action Box -->
              <div class="apply-card-box">
                <h4 class="apply-card-title">Application Status</h4>
                <div class="apply-card-deadline">
                  <i class="fa-solid fa-stopwatch"></i> ${deadlineDate}
                </div>
                <a href="${opp.applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%; font-size: 16px; padding: 14px;">
                  Apply Now <i class="fa-solid fa-external-link-alt" style="margin-left: 8px;"></i>
                </a>
                
                <!-- Share Button Strip -->
                <div class="share-strip">
                  <span class="share-label">Share:</span>
                  <div class="share-icons">
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(opp.title + ' ' + window.location.href)}" target="_blank" rel="noopener noreferrer" class="share-btn" title="Share on Twitter"><i class="fa-brands fa-x-twitter"></i></a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener noreferrer" class="share-btn" title="Share on LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(opp.title + ' - ' + window.location.href)}" target="_blank" rel="noopener noreferrer" class="share-btn" title="Share on WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                    <a href="#" id="share-copy" class="share-btn" title="Copy Link"><i class="fa-solid fa-link"></i></a>
                  </div>
                </div>
              </div>

              <!-- Similar Opportunities Widget -->
              ${similarOpps.length > 0 ? `
              <div class="sidebar-widget">
                <h3 class="widget-title">Similar Opportunities</h3>
                <div class="widget-list">
                  ${similarOpps.map(so => `
                    <a href="#post/${so.id}" class="widget-item-link">
                      <h4>${so.title}</h4>
                      <div class="widget-item-meta">
                        <span>${so.company}</span>
                        <span>Deadline: ${this.formatDate(so.deadline)}</span>
                      </div>
                    </a>
                  `).join('')}
                </div>
              </div>
              ` : ''}
            </div>
          </aside>
        </div>
      </section>
    `;
  },

  // --- View: PRIVACY POLICY ---
  templatePrivacy() {
    return `
      <section class="reading-section">
        <div class="container reading-container">
          <h1>Privacy Policy</h1>
          <div class="reading-meta">
            <span>Last Updated: June 25, 2026</span>
          </div>
          <div class="reading-content">
            <p>
              At Afri Tech Hub, accessible from our portal, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Afri Tech Hub and how we use it.
            </p>
            <h2>No User Accounts</h2>
            <p>
              Afri Tech Hub is designed as an open directory. We do not require or allow user accounts, registrations, profiles, or passwords. Consequently, we do not collect personal profiles, email addresses (except when you voluntarily sign up for our newsletter or contact us via our contact form), or user configurations.
            </p>
            <h2>Log Files</h2>
            <p>
              Afri Tech Hub follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
            </p>
            <h2>Cookies and Web Beacons</h2>
            <p>
              Like any other website, Afri Tech Hub uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            </p>
            <h2>Third-Party Links</h2>
            <p>
              Our directory contains links to external application portals. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </p>
            <h2>Consent</h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
          </div>
        </div>
      </section>
    `;
  },

  // --- View: TERMS OF USE ---
  templateTerms() {
    return `
      <section class="reading-section">
        <div class="container reading-container">
          <h1>Terms of Use</h1>
          <div class="reading-meta">
            <span>Last Updated: June 25, 2026</span>
          </div>
          <div class="reading-content">
            <p>
              Welcome to Afri Tech Hub. These Terms of Use govern your access to and use of our platform. By accessing the website, you accept these terms in full. If you disagree with these terms or any part of them, you must not use this website.
            </p>
            <h2>Directory Service Only</h2>
            <p>
              Afri Tech Hub functions solely as an informational directory of third-party opportunities (jobs, grants, scholarships, funding, vacancies). We do not recruit candidates, award funds, or evaluate academic applications directly. We are not an agent of the opportunity providers and hold no responsibility for their decisions, application processes, or hiring guidelines.
            </p>
            <h2>No Fees / Scam Warning</h2>
            <p>
              All access to Afri Tech Hub is completely free. We will never ask you for payments, application fees, search commissions, or bank details. Beware of scams: if any third-party site pretending to be associated with Afri Tech Hub requests money to evaluate your application, report them immediately.
            </p>
            <h2>User-Generated Posts</h2>
            <p>
              Our platform allows authorized community members and administrators to publish opportunity cards. By publishing opportunities on our platform, you warrant that the information is accurate, legal, and does not violate any copyright or intellectual property rights. Afri Tech Hub reserves the right to review, edit, or delete any listing that we deem fraudulent, inaccurate, or inappropriate without notice.
            </p>
            <h2>Disclaimer of Warranties</h2>
            <p>
              This website is provided "as is" without any representations or warranties, express or implied. Afri Tech Hub makes no representations or warranties in relation to the availability, accuracy, or completeness of the opportunities listed on this site.
            </p>
            <h2>Limitation of Liability</h2>
            <p>
              Afri Tech Hub will not be liable to you in relation to the contents of, or use of, or otherwise in connection with, this website for any indirect, special or consequential loss; or for any business losses, loss of revenue, income, profits or anticipated savings, loss of contracts or business relationships, or loss of reputation.
            </p>
          </div>
        </div>
      </section>
    `;
  }
};
