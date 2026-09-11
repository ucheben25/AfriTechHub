/* ==========================================================================
   AFRI TECH HUB - APPLICATION LOGIC & ROUTER
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  // Application State
  state: {
    opportunities: [],
    categories: [],
    theme: "light",
    currentPage: "home",
    visibleLimit: 6, // limit for opportunities page pagination
    homeVisibleLimit: 6, // limit for home page listings
    editingPostId: null, // holds ID of post being edited, if any
    activeDashboardTab: "overview", // 'overview', 'posts', 'create', 'categories', 'subscribers', 'messages', 'seo', 'analytics'
    currentPostId: null,
    analyticsRange: "7d",
    analyticsCustomFrom: null,
    analyticsCustomTo: null,
  },

  // DOM Cache for static container items
  nodes: {
    content: document.getElementById("app-content"),
    navLinks: document.querySelectorAll(".nav-link"),
    navBrand: document.getElementById("nav-brand"),
    themeToggle: document.getElementById("theme-toggle"),
    themeIcon: document.getElementById("theme-icon"),
    menuToggle: document.getElementById("menu-toggle"),
    navMenu: document.getElementById("nav-menu"),
    scrollTopBtn: document.getElementById("scroll-top-btn"),
    toast: document.getElementById("toast-alert"),
    toastMsg: document.getElementById("toast-message"),
    progressBar: document.getElementById("scroll-progress-bar"),
  },

  init() {
    // Show branded splash screen first
    this.initSplash();

    // Load database and categories
    this.refreshState();

    // Bind Event Listeners
    this.bindEvents();

    // Set Theme
    this.initTheme();

    // Trigger Initial Routing
    this.router();
  },

  initSplash() {
    const splash = document.getElementById('splash-screen');
    const fill   = document.getElementById('splash-progress-fill');
    const skipBtn = document.getElementById('splash-skip-btn');
    if (!splash) return;

    const DURATION = 15000; // 15 seconds
    const startTime = performance.now();
    let rafId;

    const dismiss = () => {
      cancelAnimationFrame(rafId);
      splash.classList.add('splash-exit');
      // Remove from DOM after the CSS fade-out (600ms)
      setTimeout(() => splash.remove(), 650);
    };

    // Animate progress bar frame-by-frame
    const tick = (now) => {
      const elapsed = now - startTime;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      if (fill) fill.style.width = pct + '%';
      if (elapsed >= DURATION) {
        dismiss();
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);

    // Skip button
    if (skipBtn) skipBtn.addEventListener('click', dismiss, { once: true });

    // Also allow any key press to skip
    document.addEventListener('keydown', dismiss, { once: true });
  },

  refreshState() {
    this.state.opportunities = DataStore.getOpportunities(true); // load all, filter in render
    this.state.categories = DataStore.getCategories();
  },

  bindEvents() {
    // Hash routing
    window.addEventListener("hashchange", () => this.router());

    // Intercept crawlable links (/opportunities/slug) for seamless client routing
    document.addEventListener("click", (e) => {
      const oppLink = e.target.closest('a[href^="/opportunities/"]');
      if (oppLink) {
        const href = oppLink.getAttribute("href");
        const slugMatch = href.match(/^\/opportunities\/([^/?#]+)/);
        if (slugMatch && slugMatch[1]) {
          e.preventDefault();
          window.location.hash = `#opportunities/${encodeURIComponent(slugMatch[1])}`;
        }
      }
    });

    // Theme toggle button
    this.nodes.themeToggle.addEventListener("click", () => this.toggleTheme());

    // Mobile nav toggle
    this.nodes.menuToggle.addEventListener("click", () => {
      const isActive = this.nodes.navMenu.classList.toggle("active");
      this.nodes.menuToggle.classList.toggle("active");
      // Accessibility: reflect expanded state
      this.nodes.menuToggle.setAttribute(
        "aria-expanded",
        isActive ? "true" : "false",
      );
      this.nodes.navMenu.setAttribute(
        "aria-hidden",
        isActive ? "false" : "true",
      );
    });

    // Close mobile nav when clicking a link
    this.nodes.navMenu.addEventListener("click", (e) => {
      if (e.target.classList.contains("nav-link")) {
        this.nodes.navMenu.classList.remove("active");
        this.nodes.menuToggle.classList.remove("active");
        this.nodes.menuToggle.setAttribute("aria-expanded", "false");
        this.nodes.navMenu.setAttribute("aria-hidden", "true");
      }
    });

    // Close mobile nav with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.nodes.navMenu.classList.contains("active")) {
          this.nodes.navMenu.classList.remove("active");
          this.nodes.menuToggle.classList.remove("active");
          this.nodes.menuToggle.setAttribute("aria-expanded", "false");
          this.nodes.navMenu.setAttribute("aria-hidden", "true");
        }
      }
    });

    // Scroll events: scroll-to-top visibility and progress calculation
    window.addEventListener("scroll", () => {
      // Scroll to Top visibility toggle
      if (this.nodes.scrollTopBtn) {
        if (window.scrollY > 300) {
          this.nodes.scrollTopBtn.classList.add("visible");
        } else {
          this.nodes.scrollTopBtn.classList.remove("visible");
        }
      }

      // Progress bar calculation
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      if (this.nodes.progressBar) {
        this.nodes.progressBar.style.width = scrolled + "%";
      }
    });

    // Scroll to Top action
    if (this.nodes.scrollTopBtn) {
      this.nodes.scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  },

  // --- Theme Management ---
  initTheme() {
    const savedTheme = localStorage.getItem("ath_theme") || "light";
    this.state.theme = savedTheme;
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      this.nodes.themeIcon.className = "fa-solid fa-sun";
      this.nodes.themeToggle.setAttribute("aria-pressed", "true");
    } else {
      document.body.classList.remove("dark-mode");
      this.nodes.themeIcon.className = "fa-solid fa-moon";
      this.nodes.themeToggle.setAttribute("aria-pressed", "false");
    }
  },

  toggleTheme() {
    if (this.state.theme === "light") {
      this.state.theme = "dark";
      document.body.classList.add("dark-mode");
      this.nodes.themeIcon.className = "fa-solid fa-sun";
      this.nodes.themeToggle.setAttribute("aria-pressed", "true");
    } else {
      this.state.theme = "light";
      document.body.classList.remove("dark-mode");
      this.nodes.themeIcon.className = "fa-solid fa-moon";
      this.nodes.themeToggle.setAttribute("aria-pressed", "false");
    }
    localStorage.setItem("ath_theme", this.state.theme);
  },

  // --- Toast Alert Helper ---
  showToast(message, type = "success") {
    this.nodes.toastMsg.textContent = message;
    this.nodes.toast.className = `alert-popup ${type} active`;
    this.nodes.toast.setAttribute("aria-hidden", "false");
    setTimeout(() => {
      this.nodes.toast.classList.remove("active");
      this.nodes.toast.setAttribute("aria-hidden", "true");
    }, 4000);
  },

  // --- Router Engine ---
  router() {
    const hash = window.location.hash || "#home";
    let route = hash;
    let queryParams = {};

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Parse Query Parameters (e.g. #opportunities?category=Jobs)
    if (hash.includes("?")) {
      const parts = hash.split("?");
      route = parts[0];
      const queryStr = parts[1];
      const params = new URLSearchParams(queryStr);
      for (const [key, value] of params.entries()) {
        queryParams[key] = value;
      }
    }

    // Dynamic Opportunity ID routing check (supports #opportunities/slug, #opportunity/slug, #post/slug)
    let postId = null;
    if (route.startsWith("#opportunities/")) {
      postId = route.substring(15);
    } else if (route.startsWith("#opportunity/")) {
      postId = route.substring(13);
    } else if (route.startsWith("#post/")) {
      postId = route.substring(6);
    }

    if (postId) {
      // Check for slug redirection (e.g. if an administrator updated the title & slug)
      const redirectSlug = DataStore.getRedirect ? DataStore.getRedirect(postId) : null;
      if (redirectSlug && redirectSlug !== postId) {
        window.location.hash = `#opportunities/${encodeURIComponent(redirectSlug)}`;
        return;
      }

      this.state.currentPage = "post-detail";
      this.state.currentPostId = postId;
      this.updateNavbarActiveState("opportunities");
      this.syncSEO("post-detail", { postId });

      // First-party analytics tracking
      if (window.ATHAnalytics && typeof window.ATHAnalytics.trackPageView === "function") {
        window.ATHAnalytics.trackPageView(`#opportunities/${encodeURIComponent(postId)}`);
        window.ATHAnalytics.trackOpportunityView(postId);
      }

      this.renderView("post-detail", { postId });
      return;
    }

    // Clean page name
    const pageName = route.substring(1) || "home";
    this.state.currentPage = pageName;
    this.state.currentPostId = null;
    this.updateNavbarActiveState(pageName);

    // Route guards
    if (pageName === "admin-dashboard") {
      if (sessionStorage.getItem("ath_admin_logged_in") !== "true") {
        window.location.hash = "#admin-login";
        this.showToast(
          "Authentication required to access the Admin Panel.",
          "error",
        );
        return;
      }
    }

    if (pageName === "admin-login") {
      if (sessionStorage.getItem("ath_admin_logged_in") === "true") {
        window.location.hash = "#admin-dashboard";
        return;
      }
    }

    // Update SEO headers dynamically
    this.syncSEO(pageName);

    // Track First-Party Analytics Page View
    if (window.ATHAnalytics && typeof window.ATHAnalytics.trackPageView === "function") {
      window.ATHAnalytics.trackPageView(hash || '#home');
    }

    // Route Mapping
    this.renderView(pageName, queryParams);
  },

  updateNavbarActiveState(pageName) {
    this.nodes.navLinks.forEach((link) => {
      if (link.getAttribute("data-route") === pageName) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  },

  // --- Dynamic SEO synchronization ---
  syncSEO(pageName, params = {}) {
    const metaDesc = document.querySelector('meta[name="description"]');
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const schemaScript = document.getElementById("dynamic-page-schema");
    const domain = (DataStore.SITE_CONFIG && DataStore.SITE_CONFIG.domain) || "https://afritechhub.xyz";

    let title = "Afri Tech Hub | Opportunities for African Talent";
    let desc = "Discover jobs, grants, fellowships, scholarships, internships and other opportunities for African talent on Afri Tech Hub.";
    let canonical = `${domain}/`;
    let isNoIndex = false;
    let ogType = "website";
    let ogImage = `${domain}/img/logo.png`;
    let dynamicSchema = null;

    if (pageName === "home") {
      title = "Afri Tech Hub | Opportunities for African Talent";
      desc = "Discover jobs, grants, fellowships, scholarships, internships and other opportunities for African talent on Afri Tech Hub.";
      canonical = `${domain}/`;
    } else if (pageName === "opportunities") {
      title = "Opportunities for African Talent | Afri Tech Hub";
      desc = "Browse verified tech jobs, startup grants, graduate fellowships, and academic scholarships tailored for African innovators.";
      canonical = `${domain}/opportunities/`;
    } else if (pageName === "categories") {
      title = "Explore Opportunity Categories | Afri Tech Hub";
      desc = "Navigate tailored lists of fellowships, internships, business funding, and tech vacancies.";
      canonical = `${domain}/opportunities/`;
    } else if (pageName === "about") {
      title = "About Us | Afri Tech Hub";
      desc = "Learn how Afri Tech Hub empowers African innovators, graduates, and entrepreneurs with open-access career resources.";
      canonical = `${domain}/about`;
    } else if (pageName === "faq") {
      title = "Frequently Asked Questions | Afri Tech Hub";
      desc = "Find answers on opportunity verification, application processes, and joining the Afri Tech Hub WhatsApp community.";
      canonical = `${domain}/faq`;
    } else if (pageName === "contact") {
      title = "Contact Afri Tech Hub | Support & Inquiries";
      desc = "Get in touch with Afri Tech Hub to share vacancy listings, submit feedback, or partner with us.";
      canonical = `${domain}/contact`;
    } else if (pageName === "privacy") {
      title = "Privacy Policy | Afri Tech Hub";
      desc = "Our commitment to protecting your privacy and maintaining a transparent, open-access opportunities directory.";
      canonical = `${domain}/privacy`;
    } else if (pageName === "terms") {
      title = "Terms of Use | Afri Tech Hub";
      desc = "Terms and conditions governing open-access use of the Afri Tech Hub platform.";
      canonical = `${domain}/terms`;
    } else if (pageName === "admin-login") {
      title = "Admin Portal Authentication | Afri Tech Hub";
      desc = "Secure gateway for administrators to login and edit active database postings.";
      canonical = `${domain}/#admin-login`;
      isNoIndex = true;
    } else if (pageName === "admin-dashboard") {
      title = "Admin Panel Overview | Afri Tech Hub";
      desc = "Database management panel for Afri Tech Hub administrators.";
      canonical = `${domain}/#admin-dashboard`;
      isNoIndex = true;
    } else if (pageName === "post-detail" && params.postId) {
      const opp = DataStore.getOpportunities(true).find(
        (o) => o.id === params.postId,
      );
      const isAdmin = sessionStorage.getItem("ath_admin_logged_in") === "true";
      const isPublished = opp && (opp.status === 'published' || !opp.status);

      if (opp && (isPublished || isAdmin)) {
        const seo = DataStore.getSEOMetadata(opp);
        title = seo.title;
        desc = seo.description;
        canonical = seo.canonical;
        ogType = "article";
        ogImage = seo.image;
        dynamicSchema = seo.structuredData;
        if (!isPublished) isNoIndex = true; // Protect drafts from indexing
      } else {
        title = "Opportunity Not Found | Afri Tech Hub";
        desc = "This opportunity may have expired, been archived, or removed from the directory.";
        canonical = `${domain}/opportunities/`;
        isNoIndex = true;
      }
    } else if (pageName === "404") {
      title = "Page Not Found | Afri Tech Hub";
      desc = "The requested page does not exist on Afri Tech Hub.";
      canonical = `${domain}/`;
      isNoIndex = true;
    }

    document.title = title;
    if (metaDesc) metaDesc.setAttribute("content", desc);
    if (canonicalLink) canonicalLink.setAttribute("href", canonical);

    if (robotsMeta) {
      robotsMeta.setAttribute(
        "content",
        isNoIndex
          ? "noindex, nofollow"
          : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      );
    }

    const setMeta = (sel, attr, val) => {
      const el = document.querySelector(sel);
      if (el) el.setAttribute(attr, val);
    };

    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[property="og:type"]', "content", ogType);
    setMeta('meta[property="og:image"]', "content", ogImage);

    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", desc);
    setMeta('meta[name="twitter:image"]', "content", ogImage);

    if (schemaScript) {
      if (dynamicSchema) {
        schemaScript.textContent = JSON.stringify(dynamicSchema, null, 2);
      } else {
        schemaScript.textContent = "";
      }
    }
  },

  // ==========================================================================
  // VIEW RENDERERS & TEMPLATES
  // ==========================================================================

  renderView(view, params = {}) {
    this.renderSkeleton();

    setTimeout(() => {
      let htmlContent = "";

      switch (view) {
        case "home":
          htmlContent = this.templateHome();
          break;
        case "opportunities":
          htmlContent = this.templateOpportunities(params);
          break;
        case "categories":
          htmlContent = this.templateCategories();
          break;
        case "about":
          htmlContent = this.templateAbout();
          break;
        case "faq":
          htmlContent = this.templateFAQ();
          break;
        case "contact":
          htmlContent = this.templateContact();
          break;
        case "privacy":
          htmlContent = this.templatePrivacy();
          break;
        case "terms":
          htmlContent = this.templateTerms();
          break;
        case "post-detail":
          htmlContent = this.templateSinglePost(params.postId);
          break;
        case "admin-login":
          htmlContent = this.templateAdminLogin();
          break;
        case "admin-dashboard":
          htmlContent = this.templateAdminDashboard(
            this.state.activeDashboardTab,
          );
          break;
        default:
          htmlContent = this.templateHome();
      }

      this.nodes.content.innerHTML = htmlContent;
      this.bindViewEvents(view, params);

      // Trigger card viewport observation for first-party impression tracking
      if (window.ATHAnalytics && typeof window.ATHAnalytics.observeCardImpressions === "function") {
        window.ATHAnalytics.observeCardImpressions(this.nodes.content);
      }
    }, 200); // Premium brief transition delay
  },

  renderSkeleton() {
    this.nodes.content.innerHTML = `
      <div class="container skeleton-container">
        <div class="skeleton-box skeleton-header-title"></div>
        <div class="opportunities-grid">
          ${Array(3)
            .fill()
            .map(
              () => `
            <div class="opportunity-card skeleton-card">
              <div class="skeleton-box skeleton-image"></div>
              <div class="skeleton-body">
                <div class="skeleton-box skeleton-meta"></div>
                <div class="skeleton-box skeleton-title"></div>
                <div class="skeleton-box skeleton-text"></div>
                <div class="skeleton-footer">
                  <div class="skeleton-box skeleton-timer"></div>
                  <div class="skeleton-box skeleton-btn"></div>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `;
  },

  bindViewEvents(view, params) {
    if (view === "home") {
      const searchInput = document.getElementById("home-search");
      const pills = document.querySelectorAll(".directory-tab");
      const quickTags = document.querySelectorAll(".quick-tag-pill");
      const cardsGrid = document.getElementById("home-opportunities-grid");
      const searchBtn = document.getElementById("home-search-btn");

      const filterHomeListings = () => {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const activePill = document.querySelector(".directory-tab.active");
        const cat = activePill
          ? activePill.getAttribute("data-category")
          : "All";

        let filtered = DataStore.getOpportunities();
        if (cat !== "All") {
          filtered = filtered.filter(
            (opp) => opp.category.toLowerCase() === cat.toLowerCase(),
          );
        }
        if (query) {
          filtered = filtered.filter(
            (opp) =>
              opp.title.toLowerCase().includes(query) ||
              opp.company.toLowerCase().includes(query) ||
              opp.shortDescription.toLowerCase().includes(query) ||
              (opp.skills &&
                opp.skills.some((s) => s.toLowerCase().includes(query))),
          );
        }

        const subset = filtered.slice(0, this.state.homeVisibleLimit);
        if (subset.length === 0) {
          cardsGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 40px 20px;">
              <i class="fa-solid fa-magnifying-glass" style="font-size: 40px; color: var(--text-muted); margin-bottom: 15px;"></i>
              <h3>No Opportunities Found</h3>
              <p>Try modifying your keywords or exploring another category tab.</p>
            </div>
          `;
        } else {
          cardsGrid.innerHTML = subset
            .map((opp) => this.cardTemplate(opp))
            .join("");
          if (window.ATHAnalytics && typeof window.ATHAnalytics.observeCardImpressions === "function") {
            window.ATHAnalytics.observeCardImpressions(cardsGrid);
          }
        }
      };

      if (pills && pills.length) {
        pills.forEach((pill) => {
          pill.addEventListener("click", () => {
            pills.forEach((p) => p.classList.remove("active"));
            pill.classList.add("active");
            filterHomeListings();
          });
        });
      }

      if (quickTags && quickTags.length) {
        quickTags.forEach((pill) => {
          pill.addEventListener("click", () => {
            const tagVal = pill.getAttribute("data-tag");
            if (searchInput) {
              searchInput.value = tagVal;
              filterHomeListings();
            }
          });
        });
      }

      if (searchInput) searchInput.addEventListener("input", filterHomeListings);
      if (searchBtn) searchBtn.addEventListener("click", filterHomeListings);

      // Accordions
      const faqItems = document.querySelectorAll(".faq-item");
      if (faqItems && faqItems.length) {
        faqItems.forEach((item) => {
          const btn = item.querySelector(".faq-question-btn");
          if (btn) {
            btn.addEventListener("click", () => {
              const isActive = item.classList.contains("active");
              faqItems.forEach((i) => i.classList.remove("active"));
              if (!isActive) item.classList.add("active");
            });
          }
        });
      }

      // Newsletter Public Subscription Form
      const newsletterForm = document.getElementById("home-newsletter-form");
      if (newsletterForm) {
        newsletterForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const emailInput = newsletterForm.querySelector("input");
          const submitBtn = newsletterForm.querySelector("button[type='submit']");
          const email = emailInput ? emailInput.value.trim() : "";

          if (!email) return;

          const originalText = submitBtn ? submitBtn.innerHTML : "Subscribe";
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...';
          }

          try {
            const res = DataStore.addSubscriber(email, "Homepage Newsletter Form");
            if (res.success) {
              this.showToast(res.message, "success");
              newsletterForm.reset();
            } else if (res.duplicate) {
              this.showToast(res.message, "info");
            } else {
              this.showToast(res.message || "Failed to subscribe. Please try again.", "error");
            }
          } catch (err) {
            console.error("Subscription error:", err);
            this.showToast("Something went wrong. Please try again.", "error");
          } finally {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
            }
          }
        });
      }
    }

    if (view === "opportunities") {
      const searchInput = document.getElementById("opp-search");
      const countrySelect = document.getElementById("opp-country-filter");
      const remoteSelect = document.getElementById("opp-remote-filter");
      const levelSelect = document.getElementById("opp-level-filter");
      const sortSelect = document.getElementById("opp-sort");
      const oppGrid = document.getElementById("opp-grid");

      const filterToggle = document.getElementById("adv-filter-toggle");
      const filterDrawer = document.getElementById("adv-filter-drawer");
      const tabs = document.querySelectorAll("#directory-nav-tabs .directory-tab");

      // Slide toggle advanced filters drawer
      if (filterToggle && filterDrawer) {
        filterToggle.addEventListener("click", () => {
          const isExpanded = filterToggle.getAttribute("aria-expanded") === "true";
          filterToggle.setAttribute("aria-expanded", !isExpanded);
          filterToggle.classList.toggle("active");
          filterDrawer.style.maxHeight = isExpanded ? "0px" : `${filterDrawer.scrollHeight + 30}px`;
        });
      }

      // Sync route query parameters if coming from dashboard categories click
      let activeCat = "All";
      if (params.category && tabs.length) {
        activeCat = params.category;
        tabs.forEach((tab) => {
          if (tab.getAttribute("data-category").toLowerCase() === activeCat.toLowerCase()) {
            tab.classList.add("active");
          } else {
            tab.classList.remove("active");
          }
        });
      }

      const updateList = () => {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const activeTab = document.querySelector("#directory-nav-tabs .directory-tab.active");
        const cat = activeTab ? activeTab.getAttribute("data-category") : "All";
        const country = countrySelect ? countrySelect.value : "All";
        const remote = remoteSelect ? remoteSelect.value : "All";
        const level = levelSelect ? levelSelect.value : "All";
        const sort = sortSelect ? sortSelect.value : "latest";

        let filtered = DataStore.getOpportunities();

        if (cat !== "All") {
          filtered = filtered.filter(
            (opp) => opp.category.toLowerCase() === cat.toLowerCase(),
          );
        }
        if (country !== "All") {
          filtered = filtered.filter(
            (opp) =>
              opp.country &&
              opp.country.toLowerCase() === country.toLowerCase(),
          );
        }
        if (remote !== "All") {
          filtered = filtered.filter(
            (opp) =>
              opp.remote && opp.remote.toLowerCase() === remote.toLowerCase(),
          );
        }
        if (level !== "All") {
          filtered = filtered.filter(
            (opp) =>
              opp.experienceLevel &&
              opp.experienceLevel.toLowerCase() === level.toLowerCase(),
          );
        }
        if (query) {
          filtered = filtered.filter(
            (opp) =>
              opp.title.toLowerCase().includes(query) ||
              opp.company.toLowerCase().includes(query) ||
              opp.shortDescription.toLowerCase().includes(query) ||
              opp.location.toLowerCase().includes(query) ||
              (opp.skills &&
                opp.skills.some((s) => s.toLowerCase().includes(query))),
          );
        }

        // Apply Sorting
        if (sort === "latest") {
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sort === "deadline") {
          filtered.sort((a, b) => {
            if (a.deadline === "Rolling") return 1;
            if (b.deadline === "Rolling") return -1;
            return new Date(a.deadline) - new Date(b.deadline);
          });
        }

        if (filtered.length === 0) {
          oppGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 40px 20px;">
              <i class="fa-solid fa-magnifying-glass" style="font-size: 40px; color: var(--text-muted); margin-bottom: 15px;"></i>
              <h3>No match found</h3>
              <p>Try modifying your keyword search.</p>
            </div>
          `;
        } else {
          oppGrid.innerHTML = filtered
            .map((opp) => this.cardTemplate(opp))
            .join("");
          if (window.ATHAnalytics && typeof window.ATHAnalytics.observeCardImpressions === "function") {
            window.ATHAnalytics.observeCardImpressions(oppGrid);
          }
        }
      };

      if (tabs && tabs.length) {
        tabs.forEach((tab) => {
          tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            updateList();
          });
        });
      }

      if (searchInput) searchInput.addEventListener("input", updateList);
      if (countrySelect) countrySelect.addEventListener("change", updateList);
      if (remoteSelect) remoteSelect.addEventListener("change", updateList);
      if (levelSelect) levelSelect.addEventListener("change", updateList);
      if (sortSelect) sortSelect.addEventListener("change", updateList);

      updateList(); // Run filters initially
    }

    if (view === "contact") {
      const contactForm = document.getElementById("contact-form");
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const subject = document.getElementById("contact-subject").value.trim();
        const body = document.getElementById("contact-message").value.trim();

        if (name && email && subject && body) {
          DataStore.addContactMessage({ name, email, subject, body });
          
          // Form submission is also sent via mailto
          const mailtoUri = `mailto:hubafritech@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${body}`)}`;
          window.location.href = mailtoUri;

          this.showToast(
            "Your message has been submitted. We will review and respond shortly!",
            "success",
          );
          contactForm.reset();
        }
      });
    }

    if (view === "post-detail") {
      // Dynamic share buttons logic
      const copyLinkBtn = document.getElementById("share-copy-link");
      if (copyLinkBtn) {
        copyLinkBtn.addEventListener("click", (e) => {
          e.preventDefault();
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => this.showToast("Link copied to clipboard!", "success"))
            .catch(() => this.showToast("Failed to copy link.", "error"));
        });
      }

      // Image Lightbox Modal logic
      const lightboxModal = document.getElementById("post-image-lightbox");
      const expandTrigger = document.getElementById("hero-img-expand-trigger");
      const mainHeroImg = document.getElementById("hero-main-img");
      const lightboxClose = document.getElementById("lightbox-close-trigger");

      const openLightbox = () => {
        if (lightboxModal) lightboxModal.classList.add("active");
        document.body.style.overflow = "hidden";
      };

      const closeLightbox = () => {
        if (lightboxModal) lightboxModal.classList.remove("active");
        document.body.style.overflow = "";
      };

      if (expandTrigger) expandTrigger.addEventListener("click", openLightbox);
      if (mainHeroImg) mainHeroImg.addEventListener("click", openLightbox);
      if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

      if (lightboxModal) {
        lightboxModal.addEventListener("click", (e) => {
          if (e.target === lightboxModal) closeLightbox();
        });
      }

      const escHandler = (e) => {
        if (e.key === "Escape" && lightboxModal && lightboxModal.classList.contains("active")) {
          closeLightbox();
        }
      };
      document.addEventListener("keydown", escHandler);
    }

    if (view === "admin-login") {
      const loginForm = document.getElementById("admin-login-form");
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = document.getElementById("admin-username").value.trim();
        const pass = document.getElementById("admin-password").value.trim();

        // Standard auth validation credentials
        if ((user === "admin" && pass === "adminpassword") || (user === "ugo" && pass === "ugo@afritech")) {
          sessionStorage.setItem("ath_admin_logged_in", "true");
          this.state.activeDashboardTab = "overview";
          window.location.hash = "#admin-dashboard";
          this.showToast(
            "Logged in successfully. Welcome to the Admin Panel!",
            "success",
          );
        } else {
          this.showToast(
            "Invalid administrator username or password.",
            "error",
          );
        }
      });
    }

    if (view === "admin-dashboard") {
      // Logout button
      const logoutBtn = document.getElementById("admin-logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          sessionStorage.removeItem("ath_admin_logged_in");
          this.showToast("Logged out of Admin Portal.", "info");
          window.location.hash = "#home";
        });
      }

      // Sidebar tab selectors
      const tabBtns = document.querySelectorAll(".dashboard-tab-btn");
      tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const tab = btn.getAttribute("data-tab");
          this.state.activeDashboardTab = tab;

          // Clear edit mode state if navigating away from create/edit tab
          if (tab !== "create") {
            this.state.editingPostId = null;
          }

          this.renderView("admin-dashboard");
        });
      });

      // Bind dynamic view controller event listeners based on active tab
      this.bindDashboardTabEvents(this.state.activeDashboardTab);
    }
  },

  bindDashboardTabEvents(tab) {
    const viewport = document.getElementById("dashboard-viewport");
    this.refreshState();

    if (tab === "posts") {
      const search = document.getElementById("admin-post-search");
      const tableBody = document.getElementById("admin-post-table-body");

      const filterTable = () => {
        const query = search.value.trim().toLowerCase();
        let filtered = DataStore.getOpportunities(true);
        if (query) {
          filtered = filtered.filter(
            (o) =>
              o.title.toLowerCase().includes(query) ||
              o.company.toLowerCase().includes(query) ||
              o.category.toLowerCase().includes(query),
          );
        }

        tableBody.innerHTML = filtered
          .map(
            (opp) => `
          <tr>
            <td>
              <div class="admin-table-title">${opp.title}</div>
              <div class="admin-table-company">${opp.company}</div>
            </td>
            <td>${opp.category}</td>
            <td>${opp.deadline}</td>
            <td>
              <span class="badge-status ${opp.status || "published"}">${opp.status || "published"}</span>
            </td>
            <td>
              <button class="btn btn-feature ${opp.featured ? "active" : ""} btn-sm btn-feat-toggle" data-id="${opp.id}">
                <i class="fa-solid fa-star"></i> ${opp.featured ? "Featured" : "Standard"}
              </button>
            </td>
            <td>
              <div class="admin-table-actions">
                <button class="btn btn-edit btn-sm btn-opp-edit" data-id="${opp.id}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                <button class="btn btn-delete btn-sm btn-opp-delete" data-id="${opp.id}"><i class="fa-solid fa-trash-can"></i> Delete</button>
              </div>
            </td>
          </tr>
        `,
          )
          .join("");

        // Re-bind actions
        this.bindTableActionListeners();
      };

      search.addEventListener("input", filterTable);
      filterTable(); // Run initial listing
    }

    if (tab === "create") {
      const form = document.getElementById("admin-opp-form");
      const fileInput = document.getElementById("adm-opp-img-file");
      const textUrlInput = document.getElementById("adm-opp-img-url");
      const filePreview = document.getElementById("adm-img-preview");
      const skillsInput = document.getElementById("adm-opp-skills");
      const skillsContainer = document.getElementById("adm-skills-tags");

      // SEO Preview elements
      const seoTitleInput = document.getElementById("adm-opp-seo-title");
      const seoDescInput = document.getElementById("adm-opp-seo-desc");
      const statusSelect = document.getElementById("adm-opp-status");
      const previewGoogleTitle = document.getElementById("preview-google-title");
      const previewGoogleDesc = document.getElementById("preview-google-desc");
      const seoTitleCount = document.getElementById("adm-seo-title-count");
      const seoDescCount = document.getElementById("adm-seo-desc-count");

      const updateGooglePreview = () => {
        const titleVal = (document.getElementById("adm-opp-title") ? document.getElementById("adm-opp-title").value.trim() : "") || "Opportunity Title";
        const descVal = (document.getElementById("adm-opp-desc") ? document.getElementById("adm-opp-desc").value.trim() : "");
        const customTitle = seoTitleInput ? seoTitleInput.value.trim() : "";
        const customDesc = seoDescInput ? seoDescInput.value.trim() : "";

        const effectiveTitle = customTitle || `${titleVal} | Afri Tech Hub`;
        const effectiveDesc = customDesc || (descVal ? descVal.slice(0, 150) + "..." : "Snippet preview will show how this opportunity listing appears on Google Search.");

        if (previewGoogleTitle) previewGoogleTitle.textContent = effectiveTitle;
        if (previewGoogleDesc) previewGoogleDesc.textContent = effectiveDesc;

        if (seoTitleCount && seoTitleInput) {
          seoTitleCount.textContent = `${seoTitleInput.value.length} / 70`;
        }
        if (seoDescCount && seoDescInput) {
          seoDescCount.textContent = `${seoDescInput.value.length} / 160`;
        }
      };

      if (seoTitleInput) seoTitleInput.addEventListener("input", updateGooglePreview);
      if (seoDescInput) seoDescInput.addEventListener("input", updateGooglePreview);
      const titleInput = document.getElementById("adm-opp-title");
      const descInput = document.getElementById("adm-opp-desc");
      if (titleInput) titleInput.addEventListener("input", updateGooglePreview);
      if (descInput) descInput.addEventListener("input", updateGooglePreview);

      // Edit Mode Preloading
      if (this.state.editingPostId) {
        const opp = this.state.opportunities.find(
          (o) => o.id === this.state.editingPostId,
        );
        if (opp) {
          const titleEl = document.getElementById("adm-opp-title");
          const catEl = document.getElementById("adm-opp-category");
          const deadlineEl = document.getElementById("adm-opp-deadline");
          const descEl = document.getElementById("adm-opp-desc");
          const urlEl = document.getElementById("adm-opp-url");

          if (titleEl) titleEl.value = opp.title || "";
          if (catEl) catEl.value = opp.category || "";
          if (deadlineEl) deadlineEl.value = opp.deadline || "";
          if (descEl) descEl.value = opp.description || "";
          if (urlEl) urlEl.value = opp.applyUrl || "";
          if (statusSelect) statusSelect.value = opp.status || "published";
          if (seoTitleInput) seoTitleInput.value = opp.seoTitle || "";
          if (seoDescInput) seoDescInput.value = opp.seoDescription || "";

          updateGooglePreview();

          if (opp.image && filePreview) {
            filePreview.innerHTML = `<img src="${opp.image}" alt="Preview">`;
            if (textUrlInput && opp.image.startsWith("http")) {
              textUrlInput.value = opp.image;
            }
          }
        }
      }

      // Cancel edit mode listener
      const cancelBtn = document.getElementById("btn-cancel-edit");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
          this.state.editingPostId = null;
          this.state.activeDashboardTab = "posts";
          this.renderView("admin-dashboard");
        });
      }

      // Handle Skills comma trigger if element exists
      if (skillsInput) {
        skillsInput.addEventListener("keydown", (e) => {
          if (e.key === "," || e.key === "Enter") {
            e.preventDefault();
            const val = skillsInput.value.trim().replace(/,/g, "");
            if (val && !currentSkills.includes(val)) {
              currentSkills.push(val);
              if (skillsContainer) this.renderSkillsTags(currentSkills, skillsContainer);
            }
            skillsInput.value = "";
          }
        });
      }

      // Handle Image File Preloading Preview
      if (fileInput) {
        fileInput.addEventListener("change", () => {
          const file = fileInput.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              filePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
          }
        });
      }

      // Handle Image URL input sync preview
      if (textUrlInput) {
        textUrlInput.addEventListener("input", () => {
          const val = textUrlInput.value.trim();
          if (val && filePreview) {
            filePreview.innerHTML = `<img src="${val}" alt="Preview">`;
          }
        });
      }

      // Form Submit CRUD (Create & Edit Handler)
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById("adm-submit-btn");
        const isEditing = !!this.state.editingPostId;
        const originalBtnText = submitBtn ? submitBtn.innerHTML : "Save Opportunity";

        // Handle Loading State & Disable Button
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px;"></i> Saving...`;
        }

        const restoreSubmitBtn = () => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        };

        try {
          const title = document.getElementById("adm-opp-title").value.trim();
          const category = document.getElementById("adm-opp-category").value;
          const deadline = document.getElementById("adm-opp-deadline").value;
          const description = document.getElementById("adm-opp-desc").value.trim();
          const applyUrl = document.getElementById("adm-opp-url").value.trim();
          const status = statusSelect ? statusSelect.value : "published";
          const seoTitle = seoTitleInput ? seoTitleInput.value.trim() : "";
          const seoDescription = seoDescInput ? seoDescInput.value.trim() : "";
          const file = fileInput && fileInput.files ? fileInput.files[0] : null;
          const textUrl = textUrlInput ? textUrlInput.value.trim() : "";

          const savePost = (imgDataFromFile) => {
            try {
              let id = this.state.editingPostId;
              let existingPost = null;
              let previousSlug = null;
              if (id) {
                existingPost = this.state.opportunities.find((o) => o.id === id);
                previousSlug = existingPost ? existingPost.id : null;
              }

              if (!id) {
                id = DataStore.generateUniqueSlug ? DataStore.generateUniqueSlug(title) : (title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4));
              }

              let finalImage = imgDataFromFile;
              if (!finalImage) {
                if (textUrl) {
                  finalImage = textUrl;
                } else if (existingPost && existingPost.image) {
                  finalImage = existingPost.image;
                }
              }

              const targetPost = {
                id,
                title,
                company: existingPost ? existingPost.company : "Afri Tech Hub",
                category,
                experienceLevel: existingPost ? existingPost.experienceLevel : "Graduate",
                remote: existingPost ? existingPost.remote : "Remote",
                country: existingPost ? existingPost.country : "Global",
                location: existingPost ? existingPost.location : "Global / Online",
                date: existingPost ? existingPost.date : new Date().toISOString().split("T")[0],
                deadline,
                image: finalImage || "",
                shortDescription: existingPost && existingPost.shortDescription ? existingPost.shortDescription : (description ? description.slice(0, 150) + "..." : ""),
                description,
                requirements: existingPost && existingPost.requirements ? existingPost.requirements : [],
                benefits: existingPost && existingPost.benefits ? existingPost.benefits : [],
                skills: existingPost && existingPost.skills ? existingPost.skills : [],
                applyUrl,
                featured: existingPost ? existingPost.featured : false,
                trending: existingPost ? existingPost.trending : false,
                status,
                seoTitle: seoTitle || undefined,
                seoDescription: seoDescription || undefined,
              };

              // Persist all changes to central DataStore (with previousSlug for redirects)
              DataStore.saveOpportunity(targetPost, previousSlug);

              // Reset editing state & set tab back to Manage Posts
              this.state.editingPostId = null;
              this.state.activeDashboardTab = "posts";

              // Refresh app state & re-render view
              this.refreshState();
              this.renderView("admin-dashboard");

              // Display success notification
              const successMessage = isEditing
                ? "Opportunity updated successfully."
                : "Opportunity published successfully.";
              this.showToast(successMessage, "success");

            } catch (err) {
              console.error("Error persisting opportunity:", err);
              restoreSubmitBtn();
              const errorMessage = isEditing
                ? "Failed to update opportunity. Please try again."
                : "Failed to publish opportunity. Please try again.";
              this.showToast(errorMessage, "error");
            }
          };

          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => savePost(ev.target.result);
            reader.onerror = () => {
              restoreSubmitBtn();
              this.showToast("Failed to process image file. Please try again.", "error");
            };
            reader.readAsDataURL(file);
          } else {
            savePost(null);
          }
        } catch (outerErr) {
          console.error("Form processing error:", outerErr);
          restoreSubmitBtn();
          const errorMessage = isEditing
            ? "Failed to update opportunity. Please try again."
            : "Failed to publish opportunity. Please try again.";
          this.showToast(errorMessage, "error");
        }
      });
    }

    if (tab === "categories") {
      const form = document.getElementById("admin-cat-form");
      const listContainer = document.getElementById(
        "admin-categories-editor-list",
      );

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("adm-cat-name").value.trim();
        const icon = document.getElementById("adm-cat-icon").value.trim();
        const desc = document.getElementById("adm-cat-desc").value.trim();

        if (name && icon && desc) {
          DataStore.saveCategory({ name, icon, count: 0, description: desc });
          this.refreshState();
          form.reset();
          this.showToast("Category created successfully.", "success");
          this.renderView("admin-dashboard");
        }
      });

      // Delete listener
      listContainer.addEventListener("click", (e) => {
        const delBtn = e.target.closest(".btn-cat-delete");
        if (delBtn) {
          const name = delBtn.getAttribute("data-name");
          if (
            confirm(
              `Are you sure you want to delete the "${name}" category? Posts under this category will remain, but counts will be removed.`,
            )
          ) {
            DataStore.deleteCategory(name);
            this.refreshState();
            this.showToast(`Category "${name}" deleted.`, "info");
            this.renderView("admin-dashboard");
          }
        }
      });
    }

    if (tab === "subscribers") {
      const searchInput = document.getElementById("adm-sub-search");
      const filterTabs = document.querySelectorAll("#adm-sub-filter-tabs .sub-filter-btn");
      const listContainer = document.getElementById("admin-subscribers-list");
      const exportCsvBtn = document.getElementById("adm-sub-export-csv");
      const createNewsBtn = document.getElementById("adm-sub-create-newsletter");

      const composerModal = document.getElementById("newsletter-composer-modal");
      const composerForm = document.getElementById("newsletter-composer-form");
      const btnCloseComposer = document.getElementById("btn-close-composer");

      const previewModal = document.getElementById("newsletter-preview-modal");
      const btnPreview = document.getElementById("btn-preview-newsletter");
      const btnClosePreview = document.getElementById("btn-close-preview");
      const btnBackPreview = document.getElementById("btn-back-from-preview");

      let currentStatusFilter = "all";

      const filterSubscribers = () => {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        let filtered = DataStore.getSubscribers();

        if (currentStatusFilter !== "all") {
          filtered = filtered.filter(s => s.status === currentStatusFilter);
        }

        if (query) {
          filtered = filtered.filter(s => s.email.toLowerCase().includes(query));
        }

        if (listContainer) {
          listContainer.innerHTML = this.renderSubscribersList(filtered);
        }
      };

      if (searchInput) {
        searchInput.addEventListener("input", filterSubscribers);
      }

      if (filterTabs && filterTabs.length) {
        filterTabs.forEach(btn => {
          btn.addEventListener("click", () => {
            filterTabs.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentStatusFilter = btn.getAttribute("data-filter");
            filterSubscribers();
          });
        });
      }

      if (exportCsvBtn) {
        exportCsvBtn.addEventListener("click", () => {
          const csvData = DataStore.exportSubscribersCSV(currentStatusFilter);
          const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", `afritechhub_subscribers_${currentStatusFilter}_${Date.now()}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.showToast("Subscribers CSV exported successfully.", "success");
        });
      }

      // Action buttons delegation: toggle & delete
      if (listContainer) {
        listContainer.addEventListener("click", (e) => {
          const toggleBtn = e.target.closest(".btn-sub-toggle");
          const deleteBtn = e.target.closest(".btn-sub-delete");

          if (toggleBtn) {
            const id = toggleBtn.getAttribute("data-id");
            const currentStatus = toggleBtn.getAttribute("data-status");
            const newStatus = currentStatus === "active" ? "unsubscribed" : "active";
            DataStore.updateSubscriberStatus(id, newStatus);
            this.showToast(`Subscriber status updated to ${newStatus}.`, "success");
            this.renderView("admin-dashboard");
          }

          if (deleteBtn) {
            const id = deleteBtn.getAttribute("data-id");
            const email = deleteBtn.getAttribute("data-email");
            if (confirm(`Are you sure you want to permanently delete ${email}?`)) {
              DataStore.deleteSubscriber(id);
              this.showToast("Subscriber removed successfully.", "info");
              this.renderView("admin-dashboard");
            }
          }
        });
      }

      // Modal triggers for newsletter composition
      if (createNewsBtn && composerModal) {
        createNewsBtn.addEventListener("click", () => {
          composerModal.classList.add("active");
        });
      }

      if (btnCloseComposer && composerModal) {
        btnCloseComposer.addEventListener("click", () => {
          composerModal.classList.remove("active");
        });
      }

      if (btnPreview && composerModal && previewModal) {
        btnPreview.addEventListener("click", () => {
          const subject = document.getElementById("composer-subject").value.trim();
          const content = document.getElementById("composer-content").value.trim();
          if (!subject || !content) {
            this.showToast("Please enter subject line and content before previewing.", "info");
            return;
          }
          document.getElementById("preview-subject-text").innerText = subject;
          document.getElementById("preview-body-text").innerText = content;
          composerModal.classList.remove("active");
          previewModal.classList.add("active");
        });
      }

      if (btnClosePreview && previewModal) {
        btnClosePreview.addEventListener("click", () => {
          previewModal.classList.remove("active");
        });
      }

      if (btnBackPreview && previewModal && composerModal) {
        btnBackPreview.addEventListener("click", () => {
          previewModal.classList.remove("active");
          composerModal.classList.add("active");
        });
      }

      if (composerForm) {
        composerForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const subject = document.getElementById("composer-subject").value.trim();
          const audience = document.getElementById("composer-audience").value;
          const content = document.getElementById("composer-content").value.trim();

          const sendBtn = document.getElementById("btn-send-newsletter");
          const originalText = sendBtn ? sendBtn.innerHTML : "Send Newsletter";

          if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
          }

          try {
            const res = await DataStore.sendNewsletter({ subject, content, audience });
            if (res.success) {
              this.showToast(res.message, "success");
              composerForm.reset();
              if (composerModal) composerModal.classList.remove("active");
            } else {
              this.showToast(res.message || "Failed to send newsletter.", "error");
            }
          } catch (err) {
            console.error("Newsletter send error:", err);
            this.showToast("Something went wrong. Please try again.", "error");
          } finally {
            if (sendBtn) {
              sendBtn.disabled = false;
              sendBtn.innerHTML = originalText;
            }
          }
        });
      }
    }

    if (tab === "messages") {
      const listContainer = document.getElementById("admin-messages-list");

      listContainer.addEventListener("click", (e) => {
        const replyToggle = e.target.closest(".btn-msg-reply");
        const deleteBtn = e.target.closest(".btn-msg-delete");

        if (replyToggle) {
          const id = replyToggle.getAttribute("data-id");
          DataStore.toggleReplyMessage(id);
          this.renderView("admin-dashboard");
        }

        if (deleteBtn) {
          const id = deleteBtn.getAttribute("data-id");
          if (confirm("Delete this message permanently?")) {
            DataStore.deleteMessage(id);
            this.showToast("Inquiry message deleted.", "info");
            this.renderView("admin-dashboard");
          }
        }
      });
    }

    if (tab === "seo") {
      const sitemapPreview = document.getElementById("admin-sitemap-preview");
      const btnDownloadSitemap = document.getElementById("btn-download-sitemap");
      const btnCopySitemap = document.getElementById("btn-copy-sitemap");
      const btnDownloadRobots = document.getElementById("btn-download-robots");

      const currentXml = DataStore.generateSitemapXml ? DataStore.generateSitemapXml() : "";
      if (sitemapPreview) {
        sitemapPreview.textContent = currentXml;
      }

      if (btnDownloadSitemap) {
        btnDownloadSitemap.addEventListener("click", () => {
          const blob = new Blob([currentXml], { type: "application/xml;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "sitemap.xml";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          this.showToast("sitemap.xml downloaded successfully.", "success");
        });
      }

      if (btnCopySitemap) {
        btnCopySitemap.addEventListener("click", () => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(currentXml).then(() => {
              this.showToast("Sitemap XML copied to clipboard.", "success");
            }).catch(() => {
              this.showToast("Failed to copy to clipboard.", "error");
            });
          } else {
            const textarea = document.createElement("textarea");
            textarea.value = currentXml;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            this.showToast("Sitemap XML copied to clipboard.", "success");
          }
        });
      }

      if (btnDownloadRobots) {
        btnDownloadRobots.addEventListener("click", () => {
          const domain = (DataStore.SITE_CONFIG && DataStore.SITE_CONFIG.domain) || "https://afritechhub.xyz";
          const robotsTxt = `# robots.txt for Afri Tech Hub
User-agent: *
Allow: /
Allow: /opportunities/
Allow: /about
Allow: /faq
Allow: /contact
Allow: /privacy
Allow: /terms

# Disallow private admin directories and draft endpoints
Disallow: /admin
Disallow: /dashboard
Disallow: /#admin-login
Disallow: /#admin-dashboard

# Dynamic XML Sitemap location
Sitemap: ${domain}/sitemap.xml
`;
          const blob = new Blob([robotsTxt], { type: "text/plain;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "robots.txt";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          this.showToast("robots.txt downloaded successfully.", "success");
        });
      }
    }

    if (tab === "analytics") {
      this.bindAnalyticsTabEvents();
    }
  },

  renderSkillsTags(skills, container) {
    container.innerHTML = skills
      .map(
        (skill) => `
      <span class="skill-tag">
        ${skill}
        <button type="button" class="btn-skill-remove" data-val="${skill}"><i class="fa-solid fa-xmark"></i></button>
      </span>
    `,
      )
      .join("");

    // Bind remove button clicks
    container.querySelectorAll(".btn-skill-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const skill = btn.getAttribute("data-val");
        const index = skills.indexOf(skill);
        if (index > -1) {
          skills.splice(index, 1);
          this.renderSkillsTags(skills, container);
        }
      });
    });
  },

  bindTableActionListeners() {
    const tableBody = document.getElementById("admin-post-table-body");

    // Toggle Featured Status
    tableBody.querySelectorAll(".btn-feat-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const opp = this.state.opportunities.find((o) => o.id === id);
        if (opp) {
          opp.featured = !opp.featured;
          DataStore.saveOpportunity(opp);
          this.refreshState();
          this.showToast(`Opportunity featured status updated.`, "success");
          this.renderView("admin-dashboard");
        }
      });
    });

    // Delete Opportunity
    tableBody.querySelectorAll(".btn-opp-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (
          confirm(
            "Are you sure you want to delete this opportunity posting permanently?",
          )
        ) {
          DataStore.deleteOpportunity(id);
          this.refreshState();
          this.showToast("Opportunity deleted.", "info");
          this.renderView("admin-dashboard");
        }
      });
    });

    // Edit Opportunity
    tableBody.querySelectorAll(".btn-opp-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.state.editingPostId = id;
        this.state.activeDashboardTab = "create";
        this.renderView("admin-dashboard");
      });
    });
  },

  // ==========================================================================
  // VIEW TEMPLATES LITERALS
  // ==========================================================================

  renderSubscribersList(subs) {
    if (!subs || subs.length === 0) {
      return '<tr><td colspan="5" class="text-center" style="padding:40px; color:var(--text-muted);">No subscribers match the criteria.</td></tr>';
    }

    return subs.map(s => `
      <tr>
        <td style="font-weight:600; color:var(--text-primary);">${s.email}</td>
        <td style="color:var(--text-secondary); font-size:13px;">${s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString() : 'N/A'}</td>
        <td>
          <span class="badge-sub-status ${s.status}">
            <i class="fa-solid ${s.status === 'active' ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
            ${s.status}
          </span>
        </td>
        <td style="color:var(--text-muted); font-size:13px;">${s.source || 'Homepage'}</td>
        <td style="text-align:right;">
          <div style="display:flex; justify-content:flex-end; gap:8px;">
            <button class="btn btn-secondary btn-sm btn-sub-toggle" data-id="${s.id}" data-status="${s.status}" title="${s.status === 'active' ? 'Unsubscribe' : 'Reactivate'}">
              <i class="fa-solid ${s.status === 'active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
            </button>
            <button class="btn btn-delete btn-sm btn-sub-delete" data-id="${s.id}" data-email="${s.email}" title="Remove subscriber">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  cardTemplate(opp) {
    const formattedDeadline =
      opp.deadline === "Rolling" ? "Rolling" : opp.deadline;
    const skillsBadges = opp.skills
      ? opp.skills
          .slice(0, 3)
          .map((s) => `<span class="card-skill-badge">${s}</span>`)
          .join("")
      : "";
    const catKey = opp.category ? opp.category.toLowerCase() : "jobs";
    const fallbackImg = CATEGORY_IMAGES[catKey] || CATEGORY_IMAGES["jobs"];
    const hasApplyUrl = opp.applyUrl && opp.applyUrl.trim() !== "" && opp.applyUrl !== "#";

    const escapedTitle = (opp.title || '').replace(/"/g, '&quot;');

    return `
      <article class="opportunity-card animate-fade-in-up" data-opp-id="${opp.id}" data-opp-title="${escapedTitle}">
        <div class="card-image-container">
          <a href="/opportunities/${opp.id}" data-slug="${opp.id}" data-analytics="opportunity-click" data-opp-id="${opp.id}" aria-label="View details for ${opp.title}">
            <img src="${opp.image || fallbackImg}" alt="${opp.company} Cover" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImg}';">
          </a>
          <span class="category-badge cat-${opp.category.toLowerCase().replace(/[^a-z0-9]/g, "")}">${opp.category}</span>
          ${opp.remote ? `<span class="remote-badge">${opp.remote}</span>` : ""}
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span class="company-name"><i class="fa-solid fa-building"></i> ${opp.company}</span>
            <span class="location"><i class="fa-solid fa-location-dot"></i> ${opp.location}</span>
          </div>
          <h3 class="card-title"><a href="/opportunities/${opp.id}" data-slug="${opp.id}" data-analytics="opportunity-click" data-opp-id="${opp.id}">${opp.title}</a></h3>
          <p class="card-desc">${opp.shortDescription || opp.description || ""}</p>
          <div class="card-skills-strip">
            ${skillsBadges}
          </div>
        </div>
        <div class="card-footer">
          <span class="deadline-timer"><i class="fa-solid fa-clock-rotate-left"></i> ${formattedDeadline}</span>
          <div class="card-actions">
            <a href="/opportunities/${opp.id}" data-slug="${opp.id}" data-analytics="opportunity-click" data-opp-id="${opp.id}" class="btn btn-secondary btn-sm" aria-label="Details for ${opp.title}">Details</a>
            ${hasApplyUrl ? `
              <a href="${opp.applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" data-analytics="apply-click" data-opp-id="${opp.id}" aria-label="Apply for ${opp.title}">Apply <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
            ` : `
              <button class="btn btn-secondary btn-sm" disabled title="Application URL Unavailable">Closed</button>
            `}
          </div>
        </div>
      </article>
    `;
  },

  compactCardTemplate(opp, isActive = false) {
    const activeClass = isActive ? 'active' : '';
    const escapedTitle = (opp.title || '').replace(/"/g, '&quot;');
    return `
      <div class="compact-opp-card ${activeClass}" data-id="${opp.id}" data-opp-id="${opp.id}" data-opp-title="${escapedTitle}" data-analytics="opportunity-click" role="button" tabindex="0">
        <div class="compact-card-header">
          <span class="category-badge cat-${opp.category.toLowerCase().replace(/[^a-z0-9]/g, '')}">${opp.category}</span>
          <span class="compact-card-date">${opp.date}</span>
        </div>
        <h4 class="compact-card-title">${opp.title}</h4>
        <div class="compact-card-meta">
          <span><i class="fa-solid fa-building"></i> ${opp.company}</span>
          <span><i class="fa-solid fa-location-dot"></i> ${opp.location}</span>
        </div>
        <div class="compact-card-footer">
          <span class="badge-status ${opp.remote === 'Remote' ? 'draft' : 'published'}">${opp.remote || 'Onsite'}</span>
          <span class="compact-card-deadline"><i class="fa-solid fa-calendar-xmark"></i> ${opp.deadline}</span>
        </div>
      </div>
    `;
  },

  renderSplitDetails(oppId) {
    const detailsPane = document.getElementById('split-pane-details');
    if (!detailsPane) return;

    if (!oppId) {
      detailsPane.innerHTML = `
        <div class="split-details-placeholder">
          <i class="fa-solid fa-briefcase"></i>
          <h3>No Opportunity Selected</h3>
          <p>Choose an item from the left pane to view full requirements, compensation packages, and application details.</p>
        </div>
      `;
      return;
    }

    const opp = DataStore.getOpportunities(true).find(o => o.id === oppId);
    if (!opp) {
      detailsPane.innerHTML = `
        <div class="split-details-placeholder">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <h3>Post Not Found</h3>
          <p>This listing may have been archived, removed, or expired.</p>
        </div>
      `;
      return;
    }

    const requirementsList = opp.requirements.map(req => `<li><i class="fa-regular fa-square-check"></i> ${req}</li>`).join('');
    const benefitsList = opp.benefits.map(ben => `<li><i class="fa-regular fa-star"></i> ${ben}</li>`).join('');
    const skillsBadges = opp.skills ? opp.skills.map(s => `<span class="badge-skill">${s}</span>`).join('') : '';

    detailsPane.innerHTML = `
      <div class="split-details-header">
        <button id="detail-close-btn" class="detail-close-btn" aria-label="Back to List">
          <i class="fa-solid fa-arrow-left"></i> Back to List
        </button>
        <div class="split-details-meta-top">
          <span class="category-badge cat-${opp.category.toLowerCase().replace(/[^a-z0-9]/g, '')}">${opp.category}</span>
          ${opp.remote ? `<span class="badge-status draft">${opp.remote}</span>` : ''}
          ${opp.experienceLevel ? `<span class="badge-status published">${opp.experienceLevel}</span>` : ''}
        </div>
        <h2 class="split-details-title">${opp.title}</h2>
        <div class="split-details-company-strip">
          <span class="company-logo-placeholder"><i class="fa-solid fa-building"></i></span>
          <div class="company-strip-info">
            <h4>${opp.company}</h4>
            <p><i class="fa-solid fa-location-dot"></i> ${opp.location} • Posted: ${opp.date}</p>
          </div>
        </div>
      </div>

      <div class="split-details-scroll-content">
        <!-- Visual cover image -->
        <div class="split-details-image">
          <img src="${opp.image}" alt="${opp.company} cover" loading="lazy">
        </div>

        <div class="split-details-body">
          <div class="split-details-section">
            <h3>Description</h3>
            <p class="pre-wrap">${opp.description}</p>
          </div>

          ${requirementsList ? `
          <div class="split-details-section">
            <h3>Requirements & Eligibility</h3>
            <ul class="custom-list">
              ${requirementsList}
            </ul>
          </div>
          ` : ''}

          ${benefitsList ? `
          <div class="split-details-section">
            <h3>Benefits & Compensation</h3>
            <ul class="custom-list">
              ${benefitsList}
            </ul>
          </div>
          ` : ''}

          ${skillsBadges ? `
          <div class="split-details-section">
            <h3>Target Skills</h3>
            <div class="detail-skills-container">
              ${skillsBadges}
            </div>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="split-details-action-bar">
        <div class="deadline-indicator">
          <i class="fa-solid fa-calendar-days"></i>
          <div>
            <h5>Deadline</h5>
            <p>${opp.deadline}</p>
          </div>
        </div>
        <a href="${opp.applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-apply-now-split" data-analytics="apply-click" data-opp-id="${opp.id}">Apply Now <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
      </div>
    `;

    // Bind back button listener for mobile view
    const closeBtn = document.getElementById('detail-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        detailsPane.classList.remove('active');
      });
    }
  },

  templateHome() {
    const opps = this.state.opportunities.filter((opp) => opp.status === 'published' || !opp.status);
    const featuredOpps = opps.filter((opp) => opp.featured).slice(0, 4);
    const latestOpps = opps.slice(0, 6);

    // Dynamic Stats
    const jobsCount = opps.filter((o) => o.category.toLowerCase() === 'jobs').length;
    const grantsCount = opps.filter((o) => o.category.toLowerCase() === 'grants' || o.category.toLowerCase() === 'business-funding').length;
    const scholarshipsCount = opps.filter((o) => o.category.toLowerCase() === 'scholarships').length;
    const internshipsCount = opps.filter((o) => o.category.toLowerCase() === 'internships').length;

    const categoriesGrid = this.state.categories
      .slice(0, 8)
      .map(
        (cat) => `
          <a href="#opportunities?category=${encodeURIComponent(cat.name)}" class="category-card animate-fade-in-up">
            <div class="category-icon"><i class="fa-solid fa-${cat.icon}"></i></div>
            <div class="category-body">
              <h4 class="category-title">${cat.name}</h4>
              <span class="category-count">${cat.count} Listings</span>
            </div>
          </a>
        `,
      )
      .join('');

    return `
      <!-- Home Hero Screen -->
      <section class="home-hero full-bleed">
        <div class="hero-bg-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
        </div>
        <div class="container hero-inner-centered">
          <div class="hero-content animate-fade-in">
            <span class="hero-tagline"><span class="pulse-dot"></span> Live Opportunity Desk</span>
            <h1 class="hero-title">Connecting African Talent to Global Resources</h1>
            <p class="hero-lead">We verify and curate high-impact startup grants, remote tech vacancies, graduate internships, and fully-funded scholarships. No profiles, no accounts, 100% free open access.</p>

            <div class="hero-search-console">
              <div class="hero-search-input-group">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input id="home-search" type="text" class="admin-form-control" placeholder="Search title, skills, organization...">
                <button id="home-search-btn" class="btn btn-primary">Search Feed</button>
              </div>
              <div class="hero-quick-tags">
                <span class="quick-tag-label">Popular tags:</span>
                <button class="quick-tag-pill" data-tag="Remote">Remote</button>
                <button class="quick-tag-pill" data-tag="Google">Google</button>
                <button class="quick-tag-pill" data-tag="Fully Funded">Fully Funded</button>
                <button class="quick-tag-pill" data-tag="Fellowship">Fellowship</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Advanced Count Metrics Grid -->
      <section class="section section-stats">
        <div class="container">
          <div class="advanced-stats-grid">
            <a href="#opportunities?category=Jobs" class="stat-counter-card">
              <div class="stat-icon-wrapper jobs"><i class="fa-solid fa-briefcase"></i></div>
              <div class="stat-details">
                <h3>${jobsCount}</h3>
                <p>Remote Jobs</p>
              </div>
            </a>
            <a href="#opportunities?category=Grants" class="stat-counter-card">
              <div class="stat-icon-wrapper grants"><i class="fa-solid fa-hand-holding-dollar"></i></div>
              <div class="stat-details">
                <h3>${grantsCount}</h3>
                <p>Startup Grants</p>
              </div>
            </a>
            <a href="#opportunities?category=Scholarships" class="stat-counter-card">
              <div class="stat-icon-wrapper scholarships"><i class="fa-solid fa-graduation-cap"></i></div>
              <div class="stat-details">
                <h3>${scholarshipsCount}</h3>
                <p>Scholarships</p>
              </div>
            </a>
            <a href="#opportunities?category=Internships" class="stat-counter-card">
              <div class="stat-icon-wrapper internships"><i class="fa-solid fa-user-gear"></i></div>
              <div class="stat-details">
                <h3>${internshipsCount}</h3>
                <p>Tech Internships</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- Explore Categories grid (Moved above feed) -->
      <section class="section section-alt">
        <div class="container">
          <div class="section-title-block">
            <h2>Explore by Interest</h2>
          </div>
          <div class="categories-grid">
            ${categoriesGrid}
          </div>
        </div>
      </section>

      <!-- Main Directory Feed Switcher (Moved below categories) -->
      <section class="section">
        <div class="container container-feed">
          <div class="section-title-block">
            <h2>Recent Opportunities</h2>
          </div>

          <!-- Feed tabs -->
          <div class="directory-tabs-wrapper animate-fade-in-up">
            <div class="directory-tabs">
              <button class="directory-tab active" data-category="All">All Resources</button>
              <button class="directory-tab" data-category="Jobs">Jobs</button>
              <button class="directory-tab" data-category="Grants">Grants</button>
              <button class="directory-tab" data-category="Scholarships">Scholarships</button>
              <button class="directory-tab" data-category="Internships">Internships</button>
            </div>
          </div>

          <div class="opportunities-grid single-column-feed" id="home-opportunities-grid">
            ${latestOpps.map((opp) => this.cardTemplate(opp)).join('')}
          </div>
          
          <div class="opp-dir-btn-wrap">
            <a href="#opportunities" class="btn btn-outline">See Full Opportunities Directory <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      </section>

      <!-- Community Alert Outreach (WhatsApp alerts + Email Newsletter) -->
      <section class="section">
        <div class="container container-narrow">
          <div class="newsletter-card animate-fade-in-up">
            <div class="newsletter-content">
              <h3>Join our WhatsApp Alerts</h3>
              <p>Receive rolling grants, developer jobs, and academic scholarships straight to your phone. Community members already subscribed.</p>
              <a href="https://chat.whatsapp.com/Bd2MI5seG7y8HoJjbfpQrH" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp mt-2"><i class="fa-brands fa-whatsapp"></i> Join Community</a>
            </div>
            <div class="newsletter-form-container">
              <h4>Get Weekly Email Roundups</h4>
              <p class="muted">A weekly summary of high-impact opportunities.</p>
              <form id="home-newsletter-form" class="newsletter-form">
                <input type="email" class="admin-form-control" placeholder="Enter your email address" required aria-label="Email address">
                <button type="submit" class="btn btn-primary">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  templateOpportunities(params) {
    const opps = DataStore.getOpportunities();
    
    // Extract unique countries dynamically for country filter
    const countries = ['All', ...new Set(opps.map(o => o.country).filter(Boolean))];
    const countryOptions = countries.map(c => `<option value="${c}">${c}</option>`).join('');

    // Categories filter options
    const categoryOptions = ['All', ...new Set(opps.map(o => o.category))].map(c => `<option value="${c}">${c}</option>`).join('');

    return `
      <!-- Opportunities Directory Page Hero Banner -->
      <section class="page-hero-banner">
        <div class="container">
          <h1>Opportunities</h1>
          <p>Discover verified tech vacancies, startup grants, graduate fellowships, and academic scholarships tailored for African innovators.</p>
        </div>
      </section>

      <section class="section">
        <div class="container container-feed">
          <!-- Advanced Tab Switcher -->
          <div class="directory-tabs-wrapper animate-fade-in-up">
            <div class="directory-tabs" id="directory-nav-tabs">
              <button class="directory-tab active" data-category="All">All Resources</button>
              <button class="directory-tab" data-category="Jobs">Jobs</button>
              <button class="directory-tab" data-category="Grants">Grants</button>
              <button class="directory-tab" data-category="Scholarships">Scholarships</button>
              <button class="directory-tab" data-category="Internships">Internships</button>
            </div>
          </div>

          <!-- Centered Filter Console -->
          <div class="directory-filter-console animate-fade-in-up">
            <div class="filter-primary-row">
              <div class="filter-search-wrapper">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="opp-search" class="admin-form-control" placeholder="Search title, organization, skills...">
              </div>
              <button id="adv-filter-toggle" class="btn btn-outline" aria-expanded="false" aria-controls="adv-filter-drawer">
                <i class="fa-solid fa-sliders"></i> <span>Filters</span>
              </button>
            </div>
            
            <!-- Collapsible Filters Drawer -->
            <div id="adv-filter-drawer" class="directory-advanced-filters" style="max-height: 0; overflow: hidden; transition: max-height var(--transition-normal);">
              <div class="advanced-filters-grid">
                <div class="form-group-filter">
                  <label for="opp-country-filter">Country Target</label>
                  <select id="opp-country-filter" class="admin-form-control">
                    <option value="All">All Countries</option>
                    ${countryOptions}
                  </select>
                </div>

                <div class="form-group-filter">
                  <label for="opp-remote-filter">Workplace Setting</label>
                  <select id="opp-remote-filter" class="admin-form-control">
                    <option value="All">All Settings</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>

                <div class="form-group-filter">
                  <label for="opp-level-filter">Target Level</label>
                  <select id="opp-level-filter" class="admin-form-control">
                    <option value="All">All Target Levels</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>

                <div class="form-group-filter">
                  <label for="opp-sort">Sort Listings By</label>
                  <select id="opp-sort" class="admin-form-control">
                    <option value="latest">Latest Added</option>
                    <option value="deadline">Approaching Deadline</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Centered Single Column Feed Grid -->
          <div class="opportunities-grid single-column-feed" id="opp-grid">
            <!-- Filled dynamically by updateList -->
          </div>

          <!-- Pagination -->
          <div class="flex-center mt-4">
            <button class="btn btn-outline" id="load-more-btn" style="display: none;"><i class="fa-solid fa-spinner animate-spin"></i> Load More Opportunities</button>
          </div>
        </div>
      </section>
    `;
  },

  templateCategories() {
    const list = this.state.categories
      .map(
        (cat) => `
      <a href="#opportunities?category=${encodeURIComponent(cat.name)}" class="category-card animate-fade-in-up">
        <div class="category-icon">
          <i class="fa-solid fa-${cat.icon}"></i>
        </div>
        <h3 class="category-title">${cat.name}</h3>
        <p class="category-desc">${cat.description}</p>
        <span class="category-count">${cat.count} listings</span>
      </a>
    `,
      )
      .join("");

    return `
      <section class="section">
        <div class="container">
          <div class="section-title-block">
            <h2>Opportunity Categories</h2>
          </div>
          <div class="categories-grid">
            ${list}
          </div>
        </div>
      </section>
    `;
  },

  templateAbout() {
    return `
      <!-- About Page Hero Banner -->
      <section class="page-hero-banner">
        <div class="container">
          <h1>About</h1>
          <p>Building the largest open-access opportunity network for African technologists and innovators.</p>
        </div>
      </section>

      <!-- Mission Section -->
      <section class="section">
        <div class="container">
          <div class="about-columns">
            <div class="about-col-main">
              <div class="about-block">
                <div class="about-block-icon"><i class="fa-solid fa-bullseye"></i></div>
                <div class="about-block-body">
                  <h3>Our Mission</h3>
                  <p><strong>Afri Tech Hub</strong> is an open-access platform built to catalog high-impact growth channels for African developers, engineers, and startup founders. We believe that access to careers, grants, fellowships, and quality education should be free and democratized.</p>
                  <p>Unlike traditional job boards, we do not require users to create accounts, fill profiles, or pass login gateways. Every opportunity listed contains a direct button leading to the official application portal of the provider.</p>
                </div>
              </div>

              <div class="about-block">
                <div class="about-block-icon"><i class="fa-solid fa-shield-halved"></i></div>
                <div class="about-block-body">
                  <h3>Verified Sources Only</h3>
                  <p>Every post is curated and verified by our board team from reputable multinational companies, international development organizations, venture capital organizations, and top academic bodies.</p>
                </div>
              </div>

              <div class="about-block">
                <div class="about-block-icon"><i class="fa-brands fa-whatsapp"></i></div>
                <div class="about-block-body">
                  <h3>Community Outreach</h3>
                  <p>To support real-time alerts, we host an active WhatsApp community with over 5,000+ members receiving instant alerts on rolling grants, vacancies, and scholarship openings directly to their phones.</p>
                  <a href="https://chat.whatsapp.com/Bd2MI5seG7y8HoJjbfpQrH" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp mt-2"><i class="fa-brands fa-whatsapp"></i> Join Community</a>
                </div>
              </div>
            </div>

            <div class="about-col-aside">
              <div class="about-stats-card">
                <h4>Platform Highlights</h4>
                <ul class="about-stats-list">
                  <li><i class="fa-solid fa-check-circle"></i> 100% Free — No login, no registration</li>
                  <li><i class="fa-solid fa-check-circle"></i> Verified listings from trusted sources</li>
                  <li><i class="fa-solid fa-check-circle"></i> 5,000+ WhatsApp community members</li>
                  <li><i class="fa-solid fa-check-circle"></i> Jobs, Grants, Scholarships & Internships</li>
                  <li><i class="fa-solid fa-check-circle"></i> Weekly email roundups available</li>
                  <li><i class="fa-solid fa-check-circle"></i> Active across 54 African countries</li>
                </ul>
              </div>
              <div class="about-contact-card">
                <h4>Contact Us</h4>
                <p><i class="fa-solid fa-envelope"></i> hubafritech@gmail.com</p>
                <p><i class="fa-solid fa-phone"></i> <a href="tel:09159701354" style="color:inherit;">09159701354</a></p>
                <a href="#contact" class="btn btn-outline btn-sm" style="margin-top:12px;">Send a Message</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  templateFAQ() {
    return `
      <!-- FAQ Page Hero Banner -->
      <section class="page-hero-banner">
        <div class="container">
          <h1>FAQs</h1>
          <p>Common questions about using the platform, submitting opportunities, and our verification process.</p>
        </div>
      </section>

      <section class="section">
        <div class="container container-narrow">
          <div class="faq-search-wrapper">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="faq-search" class="admin-form-control faq-search-input" placeholder="Search questions...">
          </div>

          <div class="faq-list" id="faq-results">
            ${DataStore.getFaqs()
              .map(
                (faq) => `
              <div class="faq-item">
                <button class="faq-question-btn">
                  <span>${faq.question}</span>
                  <i class="fa-solid fa-chevron-down"></i>
                </button>
                <div class="faq-answer">
                  <p>${faq.answer}</p>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  },

  templateContact() {
    return `
      <!-- Contact Page Hero Banner -->
      <section class="page-hero-banner">
        <div class="container">
          <h1>Contact</h1>
          <p>Have a question, partnership proposal, or found an issue? We're here to help.</p>
        </div>
      </section>

      <!-- Quick Contact Chips -->
      <section class="contact-chips-section">
        <div class="container">
          <div class="contact-chips-grid">
            <a href="mailto:hubafritech@gmail.com" class="contact-chip">
              <div class="contact-chip-icon"><i class="fa-solid fa-envelope"></i></div>
              <div class="contact-chip-body">
                <span class="contact-chip-label">Email Us</span>
                <span class="contact-chip-value">hubafritech@gmail.com</span>
              </div>
            </a>
            <a href="tel:09159701354" class="contact-chip">
              <div class="contact-chip-icon phone"><i class="fa-solid fa-phone"></i></div>
              <div class="contact-chip-body">
                <span class="contact-chip-label">Call Us</span>
                <span class="contact-chip-value">09159701354</span>
              </div>
            </a>
            <a href="https://chat.whatsapp.com/Bd2MI5seG7y8HoJjbfpQrH" target="_blank" rel="noopener noreferrer" class="contact-chip">
              <div class="contact-chip-icon whatsapp"><i class="fa-brands fa-whatsapp"></i></div>
              <div class="contact-chip-body">
                <span class="contact-chip-label">WhatsApp Community</span>
                <span class="contact-chip-value">Join Community</span>
              </div>
            </a>
            <div class="contact-chip no-link">
              <div class="contact-chip-icon location"><i class="fa-solid fa-location-dot"></i></div>
              <div class="contact-chip-body">
                <span class="contact-chip-label">Our Office</span>
                <span class="contact-chip-value">Aba, Abia State, Nigeria</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Contact Grid -->
      <section class="section contact-main-section">
        <div class="container">
          <div class="contact-advanced-grid">

            <!-- LEFT: Info Panel -->
            <div class="contact-panel-left">
              <div class="contact-panel-header">
                <h2>Let's Talk</h2>
                <p>Whether you're submitting a vacancy, proposing a partnership, or have a question about the platform — we are available.</p>
              </div>

              <div class="contact-office-hours">
                <h4><i class="fa-solid fa-clock"></i> Response Times</h4>
                <ul>
                  <li><span>General Enquiries</span><strong>Within 24 hrs</strong></li>
                  <li><span>Listing Submissions</span><strong>Within 48 hrs</strong></li>
                  <li><span>Partnership Proposals</span><strong>Within 72 hrs</strong></li>
                </ul>
              </div>

              <div class="contact-panel-socials">
                <h4>Follow Us</h4>
                <div class="social-links">
                  <a href="https://twitter.com/afritechhub" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
                  <a href="https://linkedin.com/company/afritechhub" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                  <a href="https://www.facebook.com/afritechub/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                  <a href="https://instagram.com/afritechhub" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                </div>
              </div>
            </div>

            <!-- RIGHT: Form Panel -->
            <div class="contact-panel-right">
              <div class="contact-form-card">
                <h3>Send a Message</h3>
                <form id="contact-form">
                  <div class="contact-form-row">
                    <div class="admin-form-group">
                      <label class="form-label" for="contact-name">Full Name *</label>
                      <input type="text" id="contact-name" class="admin-form-control" placeholder="John Doe" required>
                    </div>
                    <div class="admin-form-group">
                      <label class="form-label" for="contact-email">Email Address *</label>
                      <input type="email" id="contact-email" class="admin-form-control" placeholder="john@example.com" required>
                    </div>
                  </div>
                  <div class="admin-form-group">
                    <label class="form-label" for="contact-subject">Subject *</label>
                    <select id="contact-subject" class="admin-form-control" required>
                      <option value="" disabled selected>Select an enquiry type...</option>
                      <option value="listing">Submit a Vacancy / Listing</option>
                      <option value="partnership">Partnership Proposal</option>
                      <option value="report">Report a Listing Issue</option>
                      <option value="media">Media & Press Enquiry</option>
                      <option value="other">General Enquiry</option>
                    </select>
                  </div>
                  <div class="admin-form-group">
                    <label class="form-label" for="contact-message">Your Message *</label>
                    <textarea id="contact-message" class="admin-form-control" rows="6" placeholder="Describe your enquiry in detail..." required></textarea>
                  </div>
                  <div class="contact-form-footer">
                    <p class="contact-form-note"><i class="fa-solid fa-shield-halved"></i> Your information is kept private and never shared.</p>
                    <button type="submit" class="btn btn-primary btn-submit">Send Message <i class="fa-solid fa-paper-plane"></i></button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom CTA Strip -->
      <section class="contact-cta-strip">
        <div class="container">
          <div class="contact-cta-inner">
            <div class="contact-cta-text">
              <h3>Need instant answers?</h3>
              <p>Join our WhatsApp community for real-time updates on new listings, grants, and opportunities.</p>
            </div>
            <a href="https://chat.whatsapp.com/Bd2MI5seG7y8HoJjbfpQrH" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
              <i class="fa-brands fa-whatsapp"></i> Join Community
            </a>
          </div>
        </div>
      </section>
    `;
  },


  templateSinglePost(postId) {
    const opp = DataStore.getOpportunities(true).find((o) => o.id === postId);
    const isAdmin = sessionStorage.getItem("ath_admin_logged_in") === "true";
    const isPublished = opp && (opp.status === "published" || !opp.status);

    if (!opp || (!isPublished && !isAdmin)) {
      return `
        <section class="section">
          <div class="container text-center" style="padding: 80px 24px;">
            <div class="error-404-box" style="max-width: 540px; margin: 0 auto; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--border-radius-lg); padding: 48px 24px; box-shadow: var(--shadow-md);">
              <i class="fa-solid fa-triangle-exclamation" style="font-size: 56px; color: var(--color-accent); margin-bottom: 20px;"></i>
              <h2 style="font-size: 26px; margin-bottom: 12px; color: var(--text-primary);">Opportunity Not Found</h2>
              <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">This posting may have expired, been archived, is currently in draft, or removed from the directory.</p>
              <a href="#opportunities" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i> Back to Opportunities Directory</a>
            </div>
          </div>
        </section>
      `;
    }

    const catKey = opp.category ? opp.category.toLowerCase() : "jobs";
    const fallbackImage = CATEGORY_IMAGES[catKey] || CATEGORY_IMAGES["jobs"];
    const formattedDeadline = opp.deadline === "Rolling" ? "Rolling" : opp.deadline;

    const requirementsList = (opp.requirements || [])
      .map((req) => `<li><i class="fa-solid fa-circle-check req-check"></i> <span>${req}</span></li>`)
      .join("");

    const benefitsList = (opp.benefits || [])
      .map((ben) => `<li><i class="fa-solid fa-star ben-star"></i> <span>${ben}</span></li>`)
      .join("");

    const skillsBadges = opp.skills && opp.skills.length
      ? opp.skills.map((s) => `<span class="badge-skill">${s}</span>`).join("")
      : "";

    const isUrgent = opp.deadline && opp.deadline.toLowerCase().includes('rolling') === false && !opp.deadline.toLowerCase().includes('open');

    // Related Opportunities using DataStore similarity matching
    const relatedList = DataStore.getRelatedOpportunities(opp.id, 3);
    const relatedGrid = relatedList.length
      ? relatedList.map((o) => this.cardTemplate(o)).join("")
      : "";

    const hasApplyUrl = opp.applyUrl && opp.applyUrl.trim() !== "" && opp.applyUrl !== "#";
    const postHeroImage = opp.image || fallbackImage;

    return `
      <section class="section post-detail-section">
        <div class="container">
          <!-- Breadcrumb Navigation -->
          <div class="post-detail-top-nav">
            <nav class="post-breadcrumb" aria-label="Breadcrumb">
              <a href="#opportunities" class="breadcrumb-back-btn">
                <i class="fa-solid fa-arrow-left"></i> Back to Directory
              </a>
              <span class="breadcrumb-sep"><i class="fa-solid fa-chevron-right"></i></span>
              <a href="#opportunities" class="breadcrumb-link">Opportunities</a>
              <span class="breadcrumb-sep"><i class="fa-solid fa-chevron-right"></i></span>
              <span class="breadcrumb-current cat-${opp.category.toLowerCase().replace(/[^a-z0-9]/g, '')}">${opp.category}</span>
            </nav>
          </div>

          <!-- 1. Post Header & Title -->
          <div class="post-detail-header">
            <div class="post-header-badges">
              <span class="category-badge-chip cat-${opp.category.toLowerCase().replace(/[^a-z0-9]/g, "")}">
                <i class="fa-solid fa-tag"></i> ${opp.category}
              </span>
              <span class="badge-status-chip ${opp.remote === 'Remote' ? 'badge-remote' : 'badge-onsite'}">
                <i class="fa-solid ${opp.remote === 'Remote' ? 'fa-house-laptop' : 'fa-building'}"></i> ${opp.remote || 'Onsite'}
              </span>
              ${opp.experienceLevel ? `
                <span class="badge-status-chip badge-level">
                  <i class="fa-solid fa-graduation-cap"></i> ${opp.experienceLevel}
                </span>
              ` : ''}
              <span class="badge-status-chip badge-verified">
                <i class="fa-solid fa-circle-check"></i> Verified Listing
              </span>
            </div>
            
            <h1 class="post-detail-title">${opp.title}</h1>
            
            <!-- Metadata Summary Strip -->
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
                  <p>${opp.country || opp.location}</p>
                </div>
              </div>
              <div class="strip-item">
                <div class="strip-icon"><i class="fa-solid fa-calendar-days"></i></div>
                <div class="strip-info">
                  <h5>Date Posted</h5>
                  <p>${opp.date}</p>
                </div>
              </div>
              <div class="strip-item ${isUrgent ? 'strip-urgent' : ''}">
                <div class="strip-icon ${isUrgent ? 'icon-urgent' : ''}"><i class="fa-solid fa-clock-rotate-left"></i></div>
                <div class="strip-info">
                  <h5>Application Deadline</h5>
                  <p class="${isUrgent ? 'text-urgent' : ''}">${formattedDeadline}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Landscape Post Image (Strict 16:9 Aspect Ratio, Responsive, Object-fit Cover) -->
          <div class="post-detail-hero-image-wrap" id="hero-image-container">
            <img 
              src="${postHeroImage}" 
              alt="${opp.title}" 
              class="post-detail-hero-img" 
              id="hero-main-img"
              loading="eager" 
              onerror="this.onerror=null; this.src='${fallbackImage}';"
            >
            <div class="hero-image-badge-pill">
              <i class="fa-solid fa-shield-halved"></i> Official Opportunity
            </div>
            <button type="button" class="hero-image-expand-btn" id="hero-img-expand-trigger" title="View Full Image">
              <i class="fa-solid fa-up-right-and-down-left-from-center"></i> <span>View Full Image</span>
            </button>
          </div>

          <!-- 3. Opportunity Details & Main Layout -->
          <div class="post-detail-grid">
            <div class="post-main-content">
              <div class="post-body-content">
                <!-- Overview -->
                <div class="content-block">
                  <div class="content-block-header">
                    <div class="block-icon"><i class="fa-solid fa-circle-info"></i></div>
                    <h3>Opportunity Overview</h3>
                  </div>
                  <div class="post-description-text">${opp.description ? opp.description.replace(/\n/g, '<br>') : ''}</div>
                </div>

                <!-- Requirements -->
                ${requirementsList ? `
                <div class="content-block">
                  <div class="content-block-header">
                    <div class="block-icon"><i class="fa-solid fa-list-check"></i></div>
                    <h3>Eligibility & Requirements</h3>
                  </div>
                  <ul class="post-detail-list">
                    ${requirementsList}
                  </ul>
                </div>
                ` : ''}

                <!-- Benefits -->
                ${benefitsList ? `
                <div class="content-block">
                  <div class="content-block-header">
                    <div class="block-icon"><i class="fa-solid fa-award"></i></div>
                    <h3>Benefits & Compensation</h3>
                  </div>
                  <ul class="post-detail-list">
                    ${benefitsList}
                  </ul>
                </div>
                ` : ''}

                <!-- Target Skills -->
                ${skillsBadges ? `
                <div class="content-block">
                  <div class="content-block-header">
                    <div class="block-icon"><i class="fa-solid fa-bullseye"></i></div>
                    <h3>Target Skills</h3>
                  </div>
                  <div class="detail-skills-container">
                    ${skillsBadges}
                  </div>
                </div>
                ` : ''}
              </div>

              <!-- 4. Apply Call-to-Action Section -->
              <div class="post-apply-cta-section">
                <div class="apply-cta-card">
                  <div class="apply-cta-text">
                    <h4>Ready to Submit Your Application?</h4>
                    <p>Apply directly via the provider's official portal. Afri Tech Hub provides direct verified links with zero registration required.</p>
                    <div class="apply-cta-perks">
                      <span><i class="fa-solid fa-circle-check"></i> 100% Free Access</span>
                      <span><i class="fa-solid fa-circle-check"></i> Direct Official Portal</span>
                      <span><i class="fa-solid fa-circle-check"></i> No Intermediary Fees</span>
                    </div>
                  </div>
                  <div class="apply-cta-actions">
                    ${hasApplyUrl ? `
                      <a href="${opp.applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-apply-cta" data-analytics="apply-click" data-opp-id="${opp.id}">
                        Apply Now <i class="fa-solid fa-arrow-up-right-from-square"></i>
                      </a>
                    ` : `
                      <button class="btn btn-secondary btn-apply-cta" disabled>
                        <i class="fa-solid fa-circle-xmark"></i> Applications Closed
                      </button>
                    `}
                  </div>
                </div>

                <!-- Social Share Bar -->
                <div class="post-share-bar">
                  <span class="share-label"><i class="fa-solid fa-share-nodes"></i> Share this opportunity:</span>
                  <div class="share-icons">
                    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(opp.title)}" target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share on X / Twitter"><i class="fa-brands fa-x-twitter"></i></a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share on LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(opp.title + " " + window.location.href)}" target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share on WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                    <button class="share-btn" id="share-copy-link" title="Copy Link" aria-label="Copy link to clipboard"><i class="fa-solid fa-link"></i></button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar Summary -->
            <aside class="post-sidebar-sticky">
              <div class="apply-card-box">
                <div class="apply-card-header">
                  <h4 class="apply-card-title"><i class="fa-solid fa-clipboard-check"></i> Quick Summary</h4>
                  <span class="badge-status-chip badge-verified" style="padding: 4px 10px; font-size: 11px;"><i class="fa-solid fa-check"></i> Verified</span>
                </div>
                <table class="summary-table">
                  <tr>
                    <td><i class="fa-solid fa-building"></i> Organization</td>
                    <td>${opp.company}</td>
                  </tr>
                  <tr>
                    <td><i class="fa-solid fa-tag"></i> Category</td>
                    <td>${opp.category}</td>
                  </tr>
                  <tr>
                    <td><i class="fa-solid fa-layer-group"></i> Target Level</td>
                    <td>${opp.experienceLevel || "Open to All"}</td>
                  </tr>
                  <tr>
                    <td><i class="fa-solid fa-house-laptop"></i> Work Setting</td>
                    <td>${opp.remote || "Onsite"}</td>
                  </tr>
                  <tr>
                    <td><i class="fa-solid fa-earth-africa"></i> Location</td>
                    <td>${opp.country || opp.location}</td>
                  </tr>
                  <tr class="deadline-row">
                    <td><i class="fa-solid fa-hourglass-half"></i> Deadline</td>
                    <td>${formattedDeadline}</td>
                  </tr>
                </table>

                ${hasApplyUrl ? `
                  <a href="${opp.applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-apply-now" data-analytics="apply-click" data-opp-id="${opp.id}">
                    Apply Now <i class="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                ` : `
                  <button class="btn btn-secondary btn-apply-now" disabled>
                    Application Closed
                  </button>
                `}
                <div class="sidebar-guarantee-note">
                  <i class="fa-solid fa-shield-halved"></i> Verified opportunity curated for African innovators.
                </div>
              </div>

              <!-- WhatsApp Community Box -->
              <div class="sidebar-whatsapp-card">
                <div class="wa-header">
                  <div class="wa-icon"><i class="fa-brands fa-whatsapp"></i></div>
                  <div>
                    <h4>Never Miss an Opportunity</h4>
                  </div>
                </div>
                <p>Join 5,000+ Africans receiving verified tech vacancies, fellowships, and scholarships directly on WhatsApp.</p>
                <a href="https://chat.whatsapp.com/Bd2MI5seG7y8HoJjbfpQrH" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-join">
                  <i class="fa-brands fa-whatsapp"></i> Join WhatsApp Group
                </a>
              </div>
            </aside>
          </div>

          <!-- 5. Related Opportunities Section -->
          ${relatedGrid ? `
            <div class="related-listings-section">
              <div class="section-title-block" style="text-align: left; padding: 40px 0 20px 0;">
                <h2>Related Opportunities</h2>
              </div>
              <div class="opportunities-grid">
                ${relatedGrid}
              </div>
            </div>
          ` : ''}

          <!-- 6. Lightbox Modal for Uncropped Full Image Inspection -->
          <div class="image-lightbox-modal" id="post-image-lightbox" role="dialog" aria-modal="true" aria-label="Opportunity image preview">
            <div class="lightbox-dialog">
              <button type="button" class="lightbox-close-btn" id="lightbox-close-trigger" aria-label="Close image preview">
                <i class="fa-solid fa-xmark"></i>
              </button>
              <img src="${postHeroImage}" alt="${opp.title} Full View" id="lightbox-full-img" onerror="this.onerror=null; this.src='${fallbackImage}';">
            </div>
          </div>
        </div>
      </section>
    `;
  },

  templateAdminLogin() {
    return `
      <div class="admin-login-wrapper">
        <div class="admin-login-card animate-fade-in-up">
          <div class="admin-login-header">
            <i class="fa-solid fa-user-lock"></i>
            <h2>Admin Authentication</h2>
            <p>Access restricted to authorized platform administrators</p>
          </div>
          <form id="admin-login-form">
            <div class="admin-form-group">
              <label class="form-label" for="admin-username">Username *</label>
              <input type="text" id="admin-username" class="admin-form-control" placeholder="Enter username" required autocomplete="username">
            </div>
            <div class="admin-form-group">
              <label class="form-label" for="admin-password">Password *</label>
              <input type="password" id="admin-password" class="admin-form-control" placeholder="Enter password" required autocomplete="current-password">
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
              Verify Credentials <i class="fa-solid fa-right-to-bracket" style="margin-left: 8px;"></i>
            </button>
          </form>
        </div>
      </div>
    `;
  },

  templateAdminDashboard(activeTab) {
    if (sessionStorage.getItem("ath_admin_logged_in") !== "true") {
      return this.templateAdminLogin();
    }

    const allOpps = DataStore.getOpportunities(true);
    const totalOpps = allOpps.length;
    const publishedOpps = allOpps.filter(
      (o) => o.status === "published" || !o.status,
    ).length;
    const draftOpps = allOpps.filter((o) => o.status === "draft").length;
    const archivedOpps = allOpps.filter((o) => o.status === "archived").length;

    const categoriesCount = DataStore.getCategories().length;
    const subscribersCount = DataStore.getSubscribers().length;
    const messagesCount = DataStore.getContactMessages().length;
    const featuredCount = allOpps.filter((o) => o.featured).length;

    return `
      <div class="container dashboard-container">
        <!-- Dashboard Header -->
        <div class="dashboard-header animate-fade-in-up">
          <div class="dashboard-title-area">
            <h2>Admin Operations Portal</h2>
            <p>Empowering Afri Tech Hub management & controls</p>
          </div>
          <div class="dashboard-actions">
            <button id="admin-logout-btn" class="btn btn-danger btn-sm">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
            </button>
          </div>
        </div>

        <!-- Dashboard Layout -->
        <div class="dashboard-layout">
          <!-- Sidebar Navigation Tabs -->
          <aside class="dashboard-sidebar animate-fade-in-up">
            <button class="dashboard-tab-btn ${activeTab === "overview" ? "active" : ""}" data-tab="overview">
              <i class="fa-solid fa-chart-pie"></i> Overview
            </button>
            <button class="dashboard-tab-btn ${activeTab === "posts" ? "active" : ""}" data-tab="posts">
              <i class="fa-solid fa-table-list"></i> Manage Posts
            </button>
            <button class="dashboard-tab-btn ${activeTab === "create" ? "active" : ""}" data-tab="create">
              <i class="fa-solid fa-square-plus"></i> ${this.state.editingPostId ? "Edit Post" : "Add New Post"}
            </button>
            <button class="dashboard-tab-btn ${activeTab === "categories" ? "active" : ""}" data-tab="categories">
              <i class="fa-solid fa-tags"></i> Edit Categories
            </button>
            <button class="dashboard-tab-btn ${activeTab === "subscribers" ? "active" : ""}" data-tab="subscribers">
              <i class="fa-solid fa-envelope-open-text"></i> Subscribers (${subscribersCount})
            </button>
            <button class="dashboard-tab-btn ${activeTab === "messages" ? "active" : ""}" data-tab="messages">
              <i class="fa-solid fa-inbox"></i> Inbox Inquiries (${messagesCount})
            </button>
            <button class="dashboard-tab-btn ${activeTab === "seo" ? "active" : ""}" data-tab="seo">
              <i class="fa-solid fa-chart-line"></i> SEO &amp; Sitemap
            </button>
            <button class="dashboard-tab-btn ${activeTab === "analytics" ? "active" : ""}" data-tab="analytics">
              <i class="fa-solid fa-chart-simple"></i> Website Statistics
            </button>
          </aside>

          <!-- Main Panel Content Viewport -->
          <main class="dashboard-main animate-fade-in" id="dashboard-viewport">
            ${this.renderDashboardTab(activeTab, {
              totalOpps,
              publishedOpps,
              draftOpps,
              archivedOpps,
              categoriesCount,
              subscribersCount,
              messagesCount,
              featuredCount,
              allOpps,
            })}
          </main>
        </div>
      </div>
    `;
  },

  renderDashboardTab(tab, data) {
    if (tab === "overview") {
      return `
        <!-- Metrics Grid -->
        <div class="stats-grid animate-fade-in-up">
          <div class="stat-card">
            <div class="stat-card-info">
              <h3>Total Posts</h3>
              <div class="value">${data.totalOpps}</div>
            </div>
            <div class="stat-card-icon"><i class="fa-solid fa-folder-open"></i></div>
          </div>
          <div class="stat-card">
            <div class="stat-card-info">
              <h3>Published</h3>
              <div class="value" style="color:var(--color-primary);">${data.publishedOpps}</div>
            </div>
            <div class="stat-card-icon" style="background-color:var(--color-primary-light); color:var(--color-primary);"><i class="fa-solid fa-circle-check"></i></div>
          </div>
          <div class="stat-card">
            <div class="stat-card-info">
              <h3>Drafts</h3>
              <div class="value" style="color:hsl(35, 95%, 40%);">${data.draftOpps}</div>
            </div>
            <div class="stat-card-icon" style="background-color:hsl(35, 95%, 93%); color:hsl(35, 95%, 45%);"><i class="fa-solid fa-pencil"></i></div>
          </div>
          <div class="stat-card">
            <div class="stat-card-info">
              <h3>Archived</h3>
              <div class="value" style="color:hsl(320, 95%, 40%);">${data.archivedOpps}</div>
            </div>
            <div class="stat-card-icon" style="background-color:hsl(320, 95%, 93%); color:hsl(320, 95%, 45%);"><i class="fa-solid fa-archive"></i></div>
          </div>
        </div>

        <div class="stats-grid animate-fade-in-up" style="animation-delay: 0.1s; margin-top:-20px;">
          <div class="stat-card">
            <div class="stat-card-info">
              <h3>Newsletter Subs</h3>
              <div class="value">${data.subscribersCount}</div>
            </div>
            <div class="stat-card-icon" style="background-color:hsl(200, 95%, 93%); color:hsl(200, 95%, 35%);"><i class="fa-solid fa-envelope"></i></div>
          </div>
          <div class="stat-card">
            <div class="stat-card-info">
              <h3>User Messages</h3>
              <div class="value">${data.messagesCount}</div>
            </div>
            <div class="stat-card-icon" style="background-color:hsl(270, 95%, 93%); color:hsl(270, 95%, 35%);"><i class="fa-solid fa-message"></i></div>
          </div>
          <div class="stat-card">
            <div class="stat-card-info">
              <h3>Featured Posts</h3>
              <div class="value">${data.featuredCount}</div>
            </div>
            <div class="stat-card-icon" style="background-color:var(--color-accent-light); color:hsl(var(--hue-accent), 92%, 35%);"><i class="fa-solid fa-star"></i></div>
          </div>
          <div class="stat-card">
            <div class="stat-card-info">
              <h3>Categories</h3>
              <div class="value">${data.categoriesCount}</div>
            </div>
            <div class="stat-card-icon"><i class="fa-solid fa-tag"></i></div>
          </div>
        </div>

        <!-- Quick Summary Lists -->
        <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:30px; margin-top:10px;" class="animate-fade-in-up">
          <div class="admin-card-body">
            <h3 style="margin-bottom:20px; font-size:16px;"><i class="fa-solid fa-arrows-rotate" style="color:var(--color-primary); margin-right:8px;"></i> Recent Post Updates</h3>
            <table style="width:100%; border-collapse:collapse; font-size:13px;">
              ${data.allOpps
                .slice(0, 5)
                .map(
                  (o) => `
                <tr style="border-bottom:1px solid var(--border-color);">
                  <td style="padding:10px 0; font-weight:700; color:var(--text-primary);">${o.title}</td>
                  <td style="padding:10px 0; text-align:right;"><span class="badge-status ${o.status || "published"}">${o.status || "published"}</span></td>
                </tr>
              `,
                )
                .join("")}
            </table>
          </div>

          <div class="admin-card-body">
            <h3 style="margin-bottom:20px; font-size:16px;"><i class="fa-solid fa-inbox" style="color:var(--color-primary); margin-right:8px;"></i> Recent Inquiries</h3>
            ${
              DataStore.getContactMessages().slice(0, 3).length === 0
                ? '<p style="font-size:13px; color:var(--text-muted);">No messages in mailbox.</p>'
                : DataStore.getContactMessages()
                    .slice(0, 3)
                    .map(
                      (m) => `
                <div style="border-bottom:1px solid var(--border-color); padding:10px 0; font-size:13px;">
                  <div style="font-weight:700; color:var(--text-primary);">${m.name} <span style="font-weight:400; color:var(--text-muted); font-size:11px;">(${m.email})</span></div>
                  <div style="color:var(--text-secondary); margin-top:2px;">"${m.subject}"</div>
                </div>
              `,
                    )
                    .join("")
            }
          </div>
        </div>
      `;
    }

    if (tab === "posts") {
      return `
        <div class="admin-card-body animate-fade-in-up">
          <div style="display:flex; justify-content:between; align-items:center; gap:20px; margin-bottom:25px; flex-wrap:wrap;">
            <h3 style="font-size:18px;">Opportunities Catalog</h3>
            <input type="text" id="admin-post-search" class="admin-form-control" style="max-width:300px; padding:8px 12px; font-size:13px;" placeholder="Search catalog by title, company...">
          </div>

          <div class="admin-table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Post Details</th>
                  <th>Category</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Feature</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="admin-post-table-body">
                <!-- Filled dynamically by script -->
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === "create") {
      const isEditing = !!this.state.editingPostId;
      const categories = DataStore.getCategories();
      const categoryOptions = categories
        .map((c) => `<option value="${c.name}">${c.name}</option>`)
        .join("");

      return `
        <div class="admin-card-body animate-fade-in-up">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:12px; margin-bottom:25px;">
            <h3 style="font-size:18px; margin:0;">
              <i class="fa-solid fa-${isEditing ? "pen-to-square" : "bullhorn"}" style="color:var(--color-primary); margin-right:8px;"></i>
              ${isEditing ? "Edit Opportunity Details" : "Publish New Opportunity"}
            </h3>
            ${
              isEditing
                ? `
              <button type="button" id="btn-cancel-edit" class="btn btn-secondary btn-sm">
                <i class="fa-solid fa-xmark"></i> Cancel Edit
              </button>
            `
                : ""
            }
          </div>

          <form id="admin-opp-form">
            <!-- Field 1: Title -->
            <div class="admin-form-group">
              <label class="form-label" for="adm-opp-title">1. Opportunity Title *</label>
              <input type="text" id="adm-opp-title" class="admin-form-control" placeholder="e.g. Call for Applications: Tech Fellowship 2026" required>
            </div>

            <!-- Field 2 & 3: Category & Deadline -->
            <div class="admin-form-row" style="grid-template-columns: 1fr 1fr;">
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-category">2. Category *</label>
                <select id="adm-opp-category" class="admin-form-control" required>
                  <option value="" disabled selected>Select category</option>
                  ${categoryOptions}
                </select>
              </div>
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-deadline">3. Application Deadline *</label>
                <input type="date" id="adm-opp-deadline" class="admin-form-control" required>
              </div>
            </div>

            <!-- Field 4: Details of the Opportunity -->
            <div class="admin-form-group">
              <label class="form-label" for="adm-opp-desc">4. Details of the Opportunity *</label>
              <textarea id="adm-opp-desc" class="admin-form-control" rows="8" placeholder="Enter all relevant details, overview, eligibility criteria, benefits, and instructions..." required></textarea>
            </div>

            <!-- Field 5: Application Link -->
            <div class="admin-form-group">
              <label class="form-label" for="adm-opp-url">5. Official Application Link *</label>
              <input type="url" id="adm-opp-url" class="admin-form-control" placeholder="https://provider-portal.com/apply" required>
            </div>

            <!-- Field 6: Publication Status -->
            <div class="admin-form-group">
              <label class="form-label" for="adm-opp-status">6. Publication Status *</label>
              <select id="adm-opp-status" class="admin-form-control" required>
                <option value="published" selected>Published (Public &amp; Search Engines)</option>
                <option value="draft">Draft (Admin Only - Hidden from Public &amp; Sitemap)</option>
              </select>
              <small style="color:var(--text-muted); font-size:12px; margin-top:4px; display:block;">
                Draft opportunities are excluded from sitemaps, public searches, and search engine crawlers.
              </small>
            </div>

            <!-- Field 7: Image Upload & Preview -->
            <div class="admin-form-group">
              <label class="form-label">7. Opportunity Cover Image</label>
              <div class="admin-form-row">
                <div class="admin-form-group" style="margin-bottom:0;">
                  <input type="file" id="adm-opp-img-file" class="admin-form-control" accept="image/*">
                </div>
                <div class="admin-form-group" style="margin-bottom:0;">
                  <input type="url" id="adm-opp-img-url" class="admin-form-control" placeholder="Or enter Web Image URL https://...">
                </div>
              </div>
              <div class="image-preview-box" id="adm-img-preview" style="margin-top:12px;">
                <span>No cover selected</span>
              </div>
            </div>

            <!-- Section: Search Engine Optimization (SEO) Settings -->
            <div class="admin-seo-settings-box" style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:var(--border-radius-md); padding:20px; margin-top:20px;">
              <h4 style="margin:0 0 12px 0; font-size:15px; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-magnifying-glass" style="color:var(--color-primary);"></i> Search Engine Optimization (SEO)
              </h4>
              <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">
                Customize how this opportunity appears on Google Search results and social media shares. Defaults will be automatically generated if left blank.
              </p>

              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-seo-title">Custom SEO Meta Title (Optional)</label>
                <input type="text" id="adm-opp-seo-title" class="admin-form-control" placeholder="e.g. Call for Applications: Tech Fellowship 2026 | Afri Tech Hub" maxlength="70">
                <small style="color:var(--text-muted); font-size:11px; display:flex; justify-content:space-between; margin-top:4px;">
                  <span>Recommended: 50-60 characters</span>
                  <span id="adm-seo-title-count">0 / 70</span>
                </small>
              </div>

              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-seo-desc">Custom SEO Meta Description (Optional)</label>
                <textarea id="adm-opp-seo-desc" class="admin-form-control" rows="3" placeholder="Brief, compelling summary for Google Search snippets..." maxlength="160"></textarea>
                <small style="color:var(--text-muted); font-size:11px; display:flex; justify-content:space-between; margin-top:4px;">
                  <span>Recommended: 120-155 characters</span>
                  <span id="adm-seo-desc-count">0 / 160</span>
                </small>
              </div>

              <!-- Live Google Search Result Preview -->
              <div style="margin-top:16px;">
                <label class="form-label" style="font-size:12px; margin-bottom:8px; display:block;">Live Google Search Snippet Preview</label>
                <div id="adm-google-preview" style="background:#ffffff; color:#202124; padding:16px; border-radius:8px; border:1px solid #dadce0; font-family:arial,sans-serif; text-align:left;">
                  <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; font-size:12px; color:#202124;">
                    <div style="width:18px; height:18px; border-radius:50%; background:#10b981; display:flex; align-items:center; justify-content:center; color:#fff; font-size:10px; font-weight:bold;">A</div>
                    <span style="font-weight:500;">Afri Tech Hub</span>
                    <span style="color:#5f6368;" id="preview-google-url">https://afritechhub.xyz &rsaquo; opportunities</span>
                  </div>
                  <div id="preview-google-title" style="color:#1a0dab; font-size:18px; line-height:1.3; font-weight:400; text-decoration:none; cursor:pointer; margin-bottom:4px; word-break:break-word;">
                    Opportunity Title | Afri Tech Hub
                  </div>
                  <div id="preview-google-desc" style="color:#4d5156; font-size:13px; line-height:1.5; word-break:break-word;">
                    Snippet preview will show how this opportunity listing appears on Google Search.
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" id="adm-submit-btn" class="btn btn-primary" style="width:100%; margin-top:20px; font-size:15px; font-weight:700;">
              <i class="fa-solid fa-floppy-disk" style="margin-right:8px;"></i> ${isEditing ? "Update Opportunity" : "Save Opportunity"}
            </button>
          </form>
        </div>
      `;
    }

    if (tab === "categories") {
      const categories = DataStore.getCategories();
      const list = categories
        .map(
          (c) => `
        <div class="category-editor-card">
          <div class="category-editor-info">
            <div class="category-editor-icon"><i class="fa-solid fa-${c.icon}"></i></div>
            <div class="category-editor-details">
              <h4>${c.name}</h4>
              <p>${c.description}</p>
            </div>
          </div>
          <button class="btn btn-delete btn-sm btn-cat-delete" data-name="${c.name}"><i class="fa-solid fa-trash-can"></i> Delete</button>
        </div>
      `,
        )
        .join("");

      return `
        <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:30px;" class="animate-fade-in-up">
          <!-- Form to add Category -->
          <div class="admin-card-body" style="height:fit-content;">
            <h3 style="margin-bottom:20px; font-size:16px;">Add New Category</h3>
            <form id="admin-cat-form">
              <div class="admin-form-group">
                <label class="form-label" for="adm-cat-name">Category Name *</label>
                <input type="text" id="adm-cat-name" class="admin-form-control" placeholder="e.g. Fellowships" required>
              </div>
              <div class="admin-form-group">
                <label class="form-label" for="adm-cat-icon">FontAwesome Icon name *</label>
                <input type="text" id="adm-cat-icon" class="admin-form-control" placeholder="e.g. users, gift, briefcase" required>
              </div>
              <div class="admin-form-group">
                <label class="form-label" for="adm-cat-desc">Short Description *</label>
                <textarea id="adm-cat-desc" class="admin-form-control" rows="3" placeholder="Explain listings in this category..." required></textarea>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;"><i class="fa-solid fa-plus"></i> Add Category</button>
            </form>
          </div>

          <!-- Existing Categories -->
          <div class="admin-card-body">
            <h3 style="margin-bottom:20px; font-size:16px;">Active Categories</h3>
            <div class="category-editor-list" id="admin-categories-editor-list">
              ${list}
            </div>
          </div>
        </div>
      `;
    }

    if (tab === "subscribers") {
      const stats = DataStore.getSubscriberStats();
      const subs = DataStore.getSubscribers();

      return `
        <div class="animate-fade-in-up">
          <!-- Stat Summary Cards -->
          <div class="sub-stats-grid">
            <div class="sub-stat-card">
              <div class="sub-stat-icon"><i class="fa-solid fa-users"></i></div>
              <div class="sub-stat-info">
                <h4>${stats.total}</h4>
                <p>Total Subscribers</p>
              </div>
            </div>
            <div class="sub-stat-card">
              <div class="sub-stat-icon active-icon"><i class="fa-solid fa-user-check"></i></div>
              <div class="sub-stat-info">
                <h4>${stats.active}</h4>
                <p>Active Subscribers</p>
              </div>
            </div>
            <div class="sub-stat-card">
              <div class="sub-stat-icon unsub-icon"><i class="fa-solid fa-user-slash"></i></div>
              <div class="sub-stat-info">
                <h4>${stats.unsubscribed}</h4>
                <p>Unsubscribed</p>
              </div>
            </div>
            <div class="sub-stat-card">
              <div class="sub-stat-icon month-icon"><i class="fa-solid fa-calendar-plus"></i></div>
              <div class="sub-stat-info">
                <h4>${stats.newThisMonth}</h4>
                <p>New This Month</p>
              </div>
            </div>
          </div>

          <div class="admin-card-body">
            <!-- Toolbar: Search, Filters & Export/Compose Actions -->
            <div class="sub-toolbar">
              <div class="sub-toolbar-left">
                <div class="sub-search-box">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <input type="text" id="adm-sub-search" class="admin-form-control" placeholder="Search subscribers by email...">
                </div>
                <div class="sub-filter-tabs" id="adm-sub-filter-tabs">
                  <button class="sub-filter-btn active" data-filter="all">All (${stats.total})</button>
                  <button class="sub-filter-btn" data-filter="active">Active (${stats.active})</button>
                  <button class="sub-filter-btn" data-filter="unsubscribed">Unsubscribed (${stats.unsubscribed})</button>
                </div>
              </div>
              <div class="sub-actions-right">
                <button class="btn btn-secondary btn-sm" id="adm-sub-export-csv"><i class="fa-solid fa-file-csv"></i> Export CSV</button>
                <button class="btn btn-primary btn-sm" id="adm-sub-create-newsletter"><i class="fa-solid fa-paper-plane"></i> Create Newsletter</button>
              </div>
            </div>

            <!-- Subscribers Table -->
            <div class="admin-table-wrapper">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Subscriber Email</th>
                    <th>Date Subscribed</th>
                    <th>Status</th>
                    <th>Source</th>
                    <th style="width: 140px; text-align:right;">Actions</th>
                  </tr>
                </thead>
                <tbody id="admin-subscribers-list">
                  ${this.renderSubscribersList(subs)}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Create / Send Newsletter Modal -->
        <div class="ath-modal-overlay" id="newsletter-composer-modal">
          <div class="ath-modal-card">
            <div class="ath-modal-header">
              <h3><i class="fa-solid fa-paper-plane" style="color:var(--color-primary);"></i> Create & Send Newsletter</h3>
              <button class="ath-modal-close" id="btn-close-composer"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form id="newsletter-composer-form">
              <div class="ath-modal-body">
                <div class="admin-form-group">
                  <label class="form-label" for="composer-subject">Newsletter Subject Line *</label>
                  <input type="text" id="composer-subject" class="admin-form-control" placeholder="e.g. New High-Impact Grants & Developer Jobs for August" required>
                </div>
                <div class="admin-form-group">
                  <label class="form-label" for="composer-audience">Target Audience *</label>
                  <select id="composer-audience" class="admin-form-control" required>
                    <option value="active" selected>Active Subscribers Only (${stats.active})</option>
                    <option value="all">All Subscribers (${stats.total})</option>
                  </select>
                </div>
                <div class="admin-form-group">
                  <label class="form-label" for="composer-content">Newsletter Content Body *</label>
                  <textarea id="composer-content" class="admin-form-control" rows="8" placeholder="Enter newsletter content, announcements, or opportunity links..." required></textarea>
                </div>
              </div>
              <div class="ath-modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" id="btn-preview-newsletter"><i class="fa-solid fa-eye"></i> Preview</button>
                <button type="submit" class="btn btn-primary btn-sm" id="btn-send-newsletter"><i class="fa-solid fa-paper-plane"></i> Send Newsletter</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Preview Modal -->
        <div class="ath-modal-overlay" id="newsletter-preview-modal">
          <div class="ath-modal-card">
            <div class="ath-modal-header">
              <h3><i class="fa-solid fa-eye" style="color:var(--color-primary);"></i> Newsletter Preview</h3>
              <button class="ath-modal-close" id="btn-close-preview"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="ath-modal-body" style="background:var(--bg-secondary);">
              <div style="border:1px solid var(--border-color); border-radius:var(--border-radius-md); padding:20px; background:var(--bg-card);">
                <div style="font-weight:800; font-size:16px; margin-bottom:10px; color:var(--text-primary);" id="preview-subject-text"></div>
                <div style="color:var(--text-muted); font-size:12px; margin-bottom:16px;">From: Afri Tech Hub &lt;hubafritech@gmail.com&gt;</div>
                <hr style="border:none; border-top:1px solid var(--border-color); margin-bottom:16px;">
                <div style="color:var(--text-secondary); line-height:1.6; white-space:pre-wrap;" id="preview-body-text"></div>
              </div>
            </div>
            <div class="ath-modal-footer">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-back-from-preview">Back to Editor</button>
            </div>
          </div>
        </div>
      `;
    }

    if (tab === "messages") {
      const msgs = DataStore.getContactMessages();
      return `
        <div class="animate-fade-in-up" id="admin-messages-list">
          <h3 style="margin-bottom:25px; font-size:18px;">Inbox Inquiries</h3>
          ${
            msgs.length === 0
              ? '<div class="admin-card-body text-center" style="padding:60px;">No messages received in mailbox yet.</div>'
              : msgs
                  .map(
                    (m) => `
              <div class="message-card ${m.replied ? "replied" : ""}">
                <div class="message-card-header">
                  <div>
                    <div class="message-sender-name">${m.name}</div>
                    <div class="message-sender-email">${m.email}</div>
                  </div>
                  <div class="message-date">${new Date(m.date).toLocaleString()}</div>
                </div>
                <div style="font-weight:700; margin-bottom:8px; color:var(--text-primary);">Subject: ${m.subject}</div>
                <div class="message-body">${m.body}</div>
                <div class="message-actions">
                  <button class="btn btn-edit btn-sm btn-msg-reply" data-id="${m.id}">
                    <i class="fa-solid ${m.replied ? "fa-envelope" : "fa-envelope-open"}"></i> 
                    ${m.replied ? "Mark Unread" : "Mark Replied"}
                  </button>
                  <button class="btn btn-delete btn-sm btn-msg-delete" data-id="${m.id}"><i class="fa-solid fa-trash-can"></i> Delete</button>
                </div>
              </div>
            `,
                  )
                  .join("")
          }
        </div>
      `;
    }

    if (tab === "seo") {
      const allOpps = DataStore.getOpportunities(true);
      const published = allOpps.filter((o) => o.status === "published" || !o.status);
      const drafts = allOpps.filter((o) => o.status === "draft");
      const domain = (DataStore.SITE_CONFIG && DataStore.SITE_CONFIG.domain) || "https://afritechhub.xyz";

      return `
        <div class="animate-fade-in-up">
          <div style="margin-bottom:25px;">
            <h3 style="font-size:18px; margin:0 0 6px 0;">
              <i class="fa-solid fa-chart-line" style="color:var(--color-primary); margin-right:8px;"></i>
              SEO, Crawlability &amp; Dynamic Sitemap
            </h3>
            <p style="color:var(--text-muted); font-size:13px; margin:0;">
              Real-time Google search readiness and XML sitemap generator for ${domain}
            </p>
          </div>

          <!-- SEO Status Cards -->
          <div class="stats-grid" style="margin-bottom:24px;">
            <div class="stat-card">
              <div class="stat-card-info">
                <h3>Indexed Pages (Sitemap)</h3>
                <div class="value" style="color:var(--color-primary);">${published.length + 7}</div>
              </div>
              <div class="stat-card-icon" style="background-color:var(--color-primary-light); color:var(--color-primary);"><i class="fa-solid fa-sitemap"></i></div>
            </div>
            <div class="stat-card">
              <div class="stat-card-info">
                <h3>Published Opportunities</h3>
                <div class="value">${published.length}</div>
              </div>
              <div class="stat-card-icon"><i class="fa-solid fa-circle-check"></i></div>
            </div>
            <div class="stat-card">
              <div class="stat-card-info">
                <h3>Excluded Drafts</h3>
                <div class="value" style="color:hsl(35, 95%, 40%);">${drafts.length}</div>
              </div>
              <div class="stat-card-icon" style="background-color:hsl(35, 95%, 93%); color:hsl(35, 95%, 45%);"><i class="fa-solid fa-pencil"></i></div>
            </div>
            <div class="stat-card">
              <div class="stat-card-info">
                <h3>Robots Directives</h3>
                <div class="value" style="font-size:16px; font-weight:700;">Active / Verified</div>
              </div>
              <div class="stat-card-icon" style="background-color:hsl(200, 95%, 93%); color:hsl(200, 95%, 35%);"><i class="fa-solid fa-robot"></i></div>
            </div>
          </div>

          <!-- Actions Grid -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; margin-bottom:24px;">
            <div class="admin-card-body">
              <h4 style="font-size:15px; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-file-code" style="color:var(--color-primary);"></i> Dynamic XML Sitemap
              </h4>
              <p style="font-size:13px; color:var(--text-secondary); line-height:1.6; margin-bottom:16px;">
                Sitemap automatically stays synchronized with your published opportunity directory. Drafts and admin URLs are strictly excluded.
              </p>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <button type="button" class="btn btn-primary btn-sm" id="btn-download-sitemap">
                  <i class="fa-solid fa-download"></i> Download sitemap.xml
                </button>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-copy-sitemap">
                  <i class="fa-solid fa-copy"></i> Copy XML to Clipboard
                </button>
              </div>
            </div>

            <div class="admin-card-body">
              <h4 style="font-size:15px; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-robot" style="color:var(--color-primary);"></i> Search Engine Robots.txt
              </h4>
              <p style="font-size:13px; color:var(--text-secondary); line-height:1.6; margin-bottom:16px;">
                Directs Googlebot and Bingbot to the XML sitemap while disallowing private admin directories and internal authentication endpoints.
              </p>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-download-robots">
                <i class="fa-solid fa-download"></i> Download robots.txt
              </button>
            </div>
          </div>

          <!-- Live Sitemap XML Preview -->
          <div class="admin-card-body">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h4 style="font-size:15px; margin:0;">
                <i class="fa-solid fa-code" style="color:var(--color-primary); margin-right:8px;"></i> Generated sitemap.xml Preview
              </h4>
              <span style="font-size:12px; color:var(--text-muted);">${domain}/sitemap.xml</span>
            </div>
            <pre id="admin-sitemap-preview" style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:var(--border-radius-sm); padding:16px; max-height:320px; overflow:auto; font-family:monospace; font-size:12px; color:var(--text-primary); margin:0;"></pre>
          </div>
        </div>
      `;
    }

    if (tab === "analytics") {
      return this.templateAdminAnalytics();
    }

    return "";
  },

  templateAdminAnalytics() {
    const range = this.state.analyticsRange || "7d";
    const now = new Date();
    let dateFrom = null;
    let dateTo = new Date().toISOString();

    if (range === "today") {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      dateFrom = startOfToday.toISOString();
    } else if (range === "7d") {
      dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (range === "30d") {
      dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (range === "90d") {
      dateFrom = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    } else if (range === "year") {
      dateFrom = new Date(now.getFullYear(), 0, 1).toISOString();
    } else if (range === "custom" && this.state.analyticsCustomFrom) {
      dateFrom = new Date(this.state.analyticsCustomFrom).toISOString();
      if (this.state.analyticsCustomTo) {
        const endCustom = new Date(this.state.analyticsCustomTo);
        endCustom.setHours(23, 59, 59, 999);
        dateTo = endCustom.toISOString();
      }
    }

    const overview = DataStore.getAnalyticsOverview(dateFrom, dateTo);
    const opps = DataStore.getAnalyticsByOpportunity(dateFrom, dateTo);
    const countries = DataStore.getAnalyticsByCountry(dateFrom, dateTo);
    const recentActivity = DataStore.getRecentAnalyticsActivity(12);

    const rangeLabels = {
      today: "Today",
      "7d": "Last 7 Days",
      "30d": "Last 30 Days",
      "90d": "Last 90 Days",
      year: "This Year",
      all: "All Time",
      custom: "Custom Range"
    };

    const currentRangeLabel = rangeLabels[range] || "Last 7 Days";

    return `
      <div class="animate-fade-in-up">
        <!-- Analytics Header -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
          <div>
            <h3 style="font-size:20px; font-weight:800; margin:0 0 6px 0; color:var(--text-primary); display:flex; align-items:center; gap:10px;">
              <i class="fa-solid fa-chart-simple" style="color:var(--color-primary);"></i>
              Website Statistics &amp; Engagement Analytics
            </h3>
            <p style="color:var(--text-muted); font-size:13px; margin:0;">
              Real-time, privacy-first analytics directly powered by your existing Afri Tech Hub database.
            </p>
          </div>
          <div class="analytics-live-pulse">
            <span class="pulse-dot"></span>
            <span>First-Party Tracking: <strong>Active</strong></span>
          </div>
        </div>

        <!-- Date Range Filter Toolbar -->
        <div class="analytics-toolbar">
          <div class="analytics-toolbar-left">
            <button class="analytics-range-btn ${range === "today" ? "active" : ""}" data-range="today">Today</button>
            <button class="analytics-range-btn ${range === "7d" ? "active" : ""}" data-range="7d">Last 7 Days</button>
            <button class="analytics-range-btn ${range === "30d" ? "active" : ""}" data-range="30d">Last 30 Days</button>
            <button class="analytics-range-btn ${range === "90d" ? "active" : ""}" data-range="90d">Last 90 Days</button>
            <button class="analytics-range-btn ${range === "year" ? "active" : ""}" data-range="year">This Year</button>
            <button class="analytics-range-btn ${range === "all" ? "active" : ""}" data-range="all">All Time</button>
            <div class="analytics-custom-dates">
              <input type="date" id="analytics-date-from" class="analytics-date-input" value="${this.state.analyticsCustomFrom || ""}" title="Start Date">
              <span style="font-size:12px; color:var(--text-muted);">to</span>
              <input type="date" id="analytics-date-to" class="analytics-date-input" value="${this.state.analyticsCustomTo || ""}" title="End Date">
              <button class="btn btn-secondary btn-sm" id="btn-analytics-apply-custom" style="padding:4px 10px; font-size:12px;">Apply</button>
            </div>
          </div>
          <div class="analytics-toolbar-right">
            <button class="btn btn-secondary btn-sm" id="btn-analytics-refresh" title="Refresh metrics">
              <i class="fa-solid fa-rotate"></i> Refresh
            </button>
            <button class="btn btn-primary btn-sm" id="btn-analytics-export-csv" title="Export CSV Report">
              <i class="fa-solid fa-file-csv"></i> Export CSV
            </button>
            <button class="btn btn-delete btn-sm" id="btn-analytics-clear" title="Reset Analytics">
              <i class="fa-solid fa-trash-can"></i> Reset
            </button>
          </div>
        </div>

        <!-- 8-Metric High Level KPI Grid -->
        <div class="analytics-stats-grid">
          <!-- Total Impressions -->
          <div class="analytics-kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Total Impressions</span>
              <div class="kpi-icon sky"><i class="fa-solid fa-eye"></i></div>
            </div>
            <div class="kpi-value">${overview.impressions.toLocaleString()}</div>
            <div class="kpi-subtext"><i class="fa-solid fa-check"></i> In-viewport card views</div>
          </div>

          <!-- Total Page Views -->
          <div class="analytics-kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Total Page Views</span>
              <div class="kpi-icon primary"><i class="fa-solid fa-file-lines"></i></div>
            </div>
            <div class="kpi-value">${overview.pageViews.toLocaleString()}</div>
            <div class="kpi-subtext"><i class="fa-solid fa-compass"></i> All platform routes</div>
          </div>

          <!-- Opportunity Views -->
          <div class="analytics-kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Opportunity Views</span>
              <div class="kpi-icon purple"><i class="fa-solid fa-book-open-reader"></i></div>
            </div>
            <div class="kpi-value">${overview.opportunityViews.toLocaleString()}</div>
            <div class="kpi-subtext"><i class="fa-solid fa-arrow-trend-up"></i> Detail page reads</div>
          </div>

          <!-- Opportunity Clicks -->
          <div class="analytics-kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Opportunity Clicks</span>
              <div class="kpi-icon amber"><i class="fa-solid fa-arrow-pointer"></i></div>
            </div>
            <div class="kpi-value">${overview.opportunityClicks.toLocaleString()}</div>
            <div class="kpi-subtext"><i class="fa-solid fa-bullseye"></i> Card title &amp; link clicks</div>
          </div>

          <!-- Apply CTA Clicks -->
          <div class="analytics-kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Apply Clicks</span>
              <div class="kpi-icon emerald"><i class="fa-solid fa-paper-plane"></i></div>
            </div>
            <div class="kpi-value" style="color:var(--color-primary);">${overview.applyClicks.toLocaleString()}</div>
            <div class="kpi-subtext"><i class="fa-solid fa-circle-check"></i> Outbound official applications</div>
          </div>

          <!-- Unique Visitors -->
          <div class="analytics-kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Unique Visitors</span>
              <div class="kpi-icon teal"><i class="fa-solid fa-users"></i></div>
            </div>
            <div class="kpi-value">${overview.uniqueVisitors.toLocaleString()}</div>
            <div class="kpi-subtext"><i class="fa-solid fa-user-shield"></i> Anonymous device tokens</div>
          </div>

          <!-- Browsing Sessions -->
          <div class="analytics-kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Active Sessions</span>
              <div class="kpi-icon indigo"><i class="fa-solid fa-clock-rotate-left"></i></div>
            </div>
            <div class="kpi-value">${overview.uniqueSessions.toLocaleString()}</div>
            <div class="kpi-subtext"><i class="fa-solid fa-laptop"></i> Discrete user sessions</div>
          </div>

          <!-- Overall CTR -->
          <div class="analytics-kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Click-Through Rate</span>
              <div class="kpi-icon rose"><i class="fa-solid fa-bullseye"></i></div>
            </div>
            <div class="kpi-value">${overview.ctr}%</div>
            <div class="kpi-subtext"><i class="fa-solid fa-chart-pie"></i> Card clicks / impressions</div>
          </div>
        </div>

        <!-- Charts Grid (Timeline + Device Breakdown) -->
        <div class="analytics-charts-grid">
          <!-- Main Timeline Chart -->
          <div class="analytics-chart-box">
            <div class="analytics-chart-header">
              <div>
                <h4><i class="fa-solid fa-chart-line" style="color:var(--color-primary);"></i> Visitor Activity &amp; Engagement Trends</h4>
                <p>Daily volume of page views, impressions, opportunity clicks, and apply CTA clicks (${currentRangeLabel})</p>
              </div>
            </div>
            <div class="chart-canvas-container" id="analytics-trend-wrapper">
              <canvas id="analytics-trend-chart"></canvas>
            </div>
          </div>

          <!-- Device Breakdown Chart -->
          <div class="analytics-chart-box">
            <div class="analytics-chart-header">
              <div>
                <h4><i class="fa-solid fa-mobile-screen-button" style="color:var(--color-primary);"></i> Device Breakdown</h4>
                <p>Visitor hardware distribution</p>
              </div>
            </div>
            <div class="chart-canvas-container" id="analytics-device-wrapper">
              <canvas id="analytics-device-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Opportunity Performance Breakdown Table -->
        <div class="analytics-table-card">
          <div class="analytics-table-header">
            <div>
              <h4><i class="fa-solid fa-list-check" style="color:var(--color-primary);"></i> Opportunity Performance Breakdown</h4>
              <p style="color:var(--text-muted); font-size:12px; margin:2px 0 0 0;">
                Comprehensive metrics for every listing (impressions, card clicks, detailed views, application conversions)
              </p>
            </div>
            <div class="analytics-table-search">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" id="analytics-opp-search" class="admin-form-control" placeholder="Search by opportunity, company, or category...">
            </div>
          </div>

          <div class="admin-table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th style="min-width:240px;">Opportunity &amp; Sponsor</th>
                  <th>Category</th>
                  <th style="text-align:center;">Impressions</th>
                  <th style="text-align:center;">Card Clicks</th>
                  <th style="text-align:center;">Full Views</th>
                  <th style="text-align:center;">Apply Clicks</th>
                  <th style="text-align:center;">CTR</th>
                  <th style="text-align:center;">Conversion Rate</th>
                </tr>
              </thead>
              <tbody id="analytics-opp-table-body">
                ${
                  opps.length === 0
                    ? '<tr><td colspan="8" class="text-center" style="padding:40px; color:var(--text-muted);">No opportunity engagement records found for this period.</td></tr>'
                    : opps
                        .map(
                          (o) => `
                    <tr>
                      <td>
                        <div class="admin-table-title">
                          <a href="/opportunities/${o.id}" data-slug="${o.id}" target="_blank" style="color:inherit; text-decoration:none;">
                            ${o.title}
                          </a>
                        </div>
                        <div class="admin-table-company">${o.company}</div>
                      </td>
                      <td>
                        <span class="category-badge cat-${(o.category || "").toLowerCase().replace(/[^a-z0-9]/g, "")}">${o.category}</span>
                      </td>
                      <td style="text-align:center; font-weight:600;">${o.impressions.toLocaleString()}</td>
                      <td style="text-align:center; font-weight:600;">${o.clicks.toLocaleString()}</td>
                      <td style="text-align:center; font-weight:600;">${o.views.toLocaleString()}</td>
                      <td style="text-align:center; font-weight:700; color:var(--color-primary);">${o.applyClicks.toLocaleString()}</td>
                      <td style="text-align:center;">
                        <span class="badge-ctr">${o.ctr}%</span>
                      </td>
                      <td style="text-align:center;">
                        <span class="badge-conv">${o.conversion}%</span>
                      </td>
                    </tr>
                  `,
                        )
                        .join("")
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Geographic Visitor Distribution & Architecture Split Section -->
        <div class="analytics-split-grid">
          <!-- Geographic Breakdown Table -->
          <div class="analytics-table-card" style="margin-bottom:0;">
            <div style="margin-bottom:16px;">
              <h4 style="font-size:15px; font-weight:700; margin:0 0 4px 0; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-earth-africa" style="color:var(--color-primary);"></i> Geographic Visitor Distribution
              </h4>
              <p style="color:var(--text-muted); font-size:12px; margin:0;">Country traffic breakdown based on client-side IP geolocation</p>
            </div>
            <div class="admin-table-wrapper">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Country</th>
                    <th style="text-align:center;">Visitors</th>
                    <th style="text-align:center;">Views</th>
                    <th style="text-align:center;">Applies</th>
                    <th style="width:130px;">Traffic Share</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    countries.length === 0
                      ? '<tr><td colspan="5" class="text-center" style="padding:30px; color:var(--text-muted);">No geographic events logged yet.</td></tr>'
                      : countries
                          .slice(0, 8)
                          .map(
                            (c) => `
                      <tr>
                        <td>
                          <div class="country-flag-badge">
                            <span class="country-code-pill">${c.countryCode}</span>
                            <span>${c.country}</span>
                          </div>
                        </td>
                        <td style="text-align:center; font-weight:600;">${c.visitors.toLocaleString()}</td>
                        <td style="text-align:center;">${c.pageViews.toLocaleString()}</td>
                        <td style="text-align:center; font-weight:700; color:var(--color-primary);">${c.applyClicks.toLocaleString()}</td>
                        <td>
                          <div class="metric-bar-wrap">
                            <div style="flex:1; background:var(--bg-secondary); border-radius:3px; height:6px; overflow:hidden;">
                              <div class="metric-bar-fill" style="width:${Math.max(c.percentage, 5)}%;"></div>
                            </div>
                            <span style="font-size:11px; font-weight:700; color:var(--text-secondary); width:32px; text-align:right;">${c.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    `,
                          )
                          .join("")
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Privacy & Architecture Assurance Card -->
          <div class="analytics-table-card" style="margin-bottom:0; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="margin-bottom:16px;">
                <h4 style="font-size:15px; font-weight:700; margin:0 0 4px 0; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
                  <i class="fa-solid fa-shield-halved" style="color:var(--color-primary);"></i> First-Party Privacy Architecture
                </h4>
                <p style="color:var(--text-muted); font-size:12px; margin:0;">Zero external tracking cookies, zero third-party data sharing</p>
              </div>

              <div class="analytics-info-list">
                <div class="analytics-info-item">
                  <i class="fa-solid fa-database"></i>
                  <div>
                    <strong>Native DataStore Storage</strong>
                    <span>Events are captured directly into the client database with automated 8,000-record quota protection.</span>
                  </div>
                </div>
                <div class="analytics-info-item">
                  <i class="fa-solid fa-user-ninja"></i>
                  <div>
                    <strong>No Personal Identifiers (PII)</strong>
                    <span>No personal names, contact info, or raw IP addresses are ever stored or exposed in analytics logs.</span>
                  </div>
                </div>
                <div class="analytics-info-item">
                  <i class="fa-solid fa-stopwatch"></i>
                  <div>
                    <strong>Non-Blocking Event Pipeline</strong>
                    <span>Asynchronous dispatch and IntersectionObserver execution ensure 0ms latency for website visitors.</span>
                  </div>
                </div>
                <div class="analytics-info-item">
                  <i class="fa-solid fa-scale-balanced"></i>
                  <div>
                    <strong>GDPR &amp; NDPR Compliant</strong>
                    <span>Complies with Nigerian and international data privacy frameworks with built-in data reset and CSV export tools.</span>
                  </div>
                </div>
              </div>
            </div>

            <div style="margin-top:16px; padding:12px; background:rgba(0,135,81,0.08); border:1px solid rgba(0,135,81,0.2); border-radius:var(--border-radius-sm); font-size:12px; color:var(--text-secondary);">
              <i class="fa-solid fa-circle-info" style="color:var(--color-primary); margin-right:6px;"></i>
              Need to archive records? Use the <strong>Export CSV</strong> action above to download complete event records.
            </div>
          </div>
        </div>

        <!-- Real-Time Activity Feed -->
        <div class="analytics-table-card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <h4 style="font-size:15px; font-weight:700; margin:0 0 4px 0; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-bolt" style="color:var(--color-primary);"></i> Live Event Activity Feed
              </h4>
              <p style="color:var(--text-muted); font-size:12px; margin:0;">Real-time feed of recent visitor interactions across the platform</p>
            </div>
            <span style="font-size:12px; color:var(--text-muted);"><i class="fa-solid fa-clock"></i> Auto-logging active</span>
          </div>

          <div class="analytics-feed-list">
            ${
              recentActivity.length === 0
                ? '<div class="text-center" style="padding:30px; color:var(--text-muted);">No activity recorded yet. Browse around the website to watch live events log here!</div>'
                : recentActivity
                    .map((item) => {
                      const timeStr = this.formatRelativeTime(item.created_at);
                      const displayTitle = item.opportunity_title || item.opportunity_id || item.page_path || "Website Route";
                      const deviceIcon = item.device_type === "Mobile" ? "fa-mobile-screen" : item.device_type === "Tablet" ? "fa-tablet-screen-button" : "fa-laptop";

                      return `
                        <div class="analytics-feed-item">
                          <div class="feed-item-left">
                            <span class="feed-type-badge ${item.event_type}">${item.event_type.replace(/_/g, " ")}</span>
                            <div class="feed-details">
                              <div class="feed-title">${displayTitle}</div>
                              <div class="feed-meta">
                                <span><i class="fa-solid ${deviceIcon}"></i> ${item.device_type}</span>
                                <span>•</span>
                                <span><i class="fa-solid fa-location-dot"></i> ${item.country || "Nigeria"}</span>
                                <span>•</span>
                                <span><i class="fa-solid fa-arrow-right-to-bracket"></i> ${item.referrer || "Direct"}</span>
                              </div>
                            </div>
                          </div>
                          <div class="feed-item-right">${timeStr}</div>
                        </div>
                      `;
                    })
                    .join("")
            }
          </div>
        </div>
      </div>
    `;
  },

  bindAnalyticsTabEvents() {
    const range = this.state.analyticsRange || "7d";
    const now = new Date();
    let dateFrom = null;
    let dateTo = new Date().toISOString();

    if (range === "today") {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      dateFrom = startOfToday.toISOString();
    } else if (range === "7d") {
      dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (range === "30d") {
      dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (range === "90d") {
      dateFrom = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    } else if (range === "year") {
      dateFrom = new Date(now.getFullYear(), 0, 1).toISOString();
    } else if (range === "custom" && this.state.analyticsCustomFrom) {
      dateFrom = new Date(this.state.analyticsCustomFrom).toISOString();
      if (this.state.analyticsCustomTo) {
        const endCustom = new Date(this.state.analyticsCustomTo);
        endCustom.setHours(23, 59, 59, 999);
        dateTo = endCustom.toISOString();
      }
    }

    // 1. Range Button click listeners
    const rangeBtns = document.querySelectorAll(".analytics-range-btn");
    rangeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedRange = btn.getAttribute("data-range");
        this.state.analyticsRange = selectedRange;
        const vp = document.getElementById("dashboard-viewport");
        if (vp) {
          vp.innerHTML = this.renderDashboardTab("analytics");
          this.bindDashboardTabEvents("analytics");
        }
      });
    });

    // 2. Custom Date Range apply
    const applyCustomBtn = document.getElementById("btn-analytics-apply-custom");
    if (applyCustomBtn) {
      applyCustomBtn.addEventListener("click", () => {
        const fromInput = document.getElementById("analytics-date-from");
        const toInput = document.getElementById("analytics-date-to");
        if (fromInput && fromInput.value) {
          this.state.analyticsRange = "custom";
          this.state.analyticsCustomFrom = fromInput.value;
          this.state.analyticsCustomTo = toInput ? toInput.value : "";
          const vp = document.getElementById("dashboard-viewport");
          if (vp) {
            vp.innerHTML = this.renderDashboardTab("analytics");
            this.bindDashboardTabEvents("analytics");
          }
        } else {
          this.showToast("Please enter a starting date.", "info");
        }
      });
    }

    // 3. Refresh Action
    const refreshBtn = document.getElementById("btn-analytics-refresh");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        const vp = document.getElementById("dashboard-viewport");
        if (vp) {
          vp.innerHTML = this.renderDashboardTab("analytics");
          this.bindDashboardTabEvents("analytics");
          this.showToast("Analytics refreshed.", "success");
        }
      });
    }

    // 4. Export CSV Action
    const exportBtn = document.getElementById("btn-analytics-export-csv");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const csv = DataStore.exportAnalyticsCsv(dateFrom, dateTo);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ath-analytics-report-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast("Analytics CSV report exported successfully.", "success");
      });
    }

    // 5. Clear Analytics Action
    const clearBtn = document.getElementById("btn-analytics-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset all analytics tracking history? This will delete stored event logs.")) {
          DataStore.clearAnalyticsData();
          const vp = document.getElementById("dashboard-viewport");
          if (vp) {
            vp.innerHTML = this.renderDashboardTab("analytics");
            this.bindDashboardTabEvents("analytics");
          }
          this.showToast("Analytics logs have been reset.", "info");
        }
      });
    }

    // 6. Table search filter
    const searchInput = document.getElementById("analytics-opp-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase().trim();
        const rows = document.querySelectorAll("#analytics-opp-table-body tr");
        rows.forEach((row) => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(q) ? "" : "none";
        });
      });
    }

    // 7. Render Charts
    this.renderAnalyticsCharts(dateFrom, dateTo);
  },

  renderAnalyticsCharts(dateFrom, dateTo) {
    const timeSeries = DataStore.getAnalyticsTimeSeries(dateFrom, dateTo);
    const devices = DataStore.getAnalyticsDeviceBreakdown(dateFrom, dateTo);

    const trendCanvas = document.getElementById("analytics-trend-chart");
    const deviceCanvas = document.getElementById("analytics-device-chart");

    if (!trendCanvas || !deviceCanvas) return;

    // Destroy existing chart instances to avoid canvas reuse errors
    if (this._analyticsTrendChart) {
      try { this._analyticsTrendChart.destroy(); } catch (e) {}
      this._analyticsTrendChart = null;
    }
    if (this._analyticsDeviceChart) {
      try { this._analyticsDeviceChart.destroy(); } catch (e) {}
      this._analyticsDeviceChart = null;
    }

    // Determine current theme colors
    const isDark = document.body.classList.contains("dark-theme");
    const textColor = isDark ? "#94a3b8" : "#64748b";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)";

    if (typeof window.Chart !== "undefined") {
      try {
        // 1. Line/Area Trend Chart
        this._analyticsTrendChart = new window.Chart(trendCanvas, {
          type: "line",
          data: {
            labels: timeSeries.labels,
            datasets: [
              {
                label: "Page Views",
                data: timeSeries.pageViews,
                borderColor: "#008751",
                backgroundColor: "rgba(0, 135, 81, 0.12)",
                borderWidth: 2.5,
                tension: 0.35,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: "#008751"
              },
              {
                label: "Impressions",
                data: timeSeries.impressions,
                borderColor: "#0284c7",
                backgroundColor: "rgba(2, 132, 199, 0.05)",
                borderWidth: 2,
                tension: 0.35,
                pointRadius: 3,
                pointBackgroundColor: "#0284c7"
              },
              {
                label: "Opportunity Clicks",
                data: timeSeries.clicks,
                borderColor: "#d97706",
                borderWidth: 2,
                tension: 0.35,
                pointRadius: 3,
                pointBackgroundColor: "#d97706"
              },
              {
                label: "Apply Clicks",
                data: timeSeries.applyClicks,
                borderColor: "#10b981",
                borderWidth: 2.5,
                borderDash: [4, 4],
                tension: 0.35,
                pointRadius: 4,
                pointBackgroundColor: "#10b981"
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: "index",
              intersect: false
            },
            plugins: {
              legend: {
                position: "top",
                labels: {
                  boxWidth: 12,
                  font: { size: 12, weight: "600" },
                  color: textColor
                }
              },
              tooltip: {
                padding: 10,
                cornerRadius: 8
              }
            },
            scales: {
              x: {
                grid: { color: gridColor },
                ticks: { color: textColor, font: { size: 11 } }
              },
              y: {
                beginAtZero: true,
                grid: { color: gridColor },
                ticks: { color: textColor, font: { size: 11 }, precision: 0 }
              }
            }
          }
        });

        // 2. Device Breakdown Doughnut Chart
        this._analyticsDeviceChart = new window.Chart(deviceCanvas, {
          type: "doughnut",
          data: {
            labels: ["Desktop", "Mobile", "Tablet"],
            datasets: [
              {
                data: [devices.counts.Desktop, devices.counts.Mobile, devices.counts.Tablet],
                backgroundColor: ["#008751", "#0284c7", "#d97706"],
                borderWidth: 2,
                borderColor: isDark ? "#1e293b" : "#ffffff"
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "68%",
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  boxWidth: 12,
                  font: { size: 12, weight: "600" },
                  color: textColor
                }
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.label || "";
                    const value = context.raw || 0;
                    const pct = devices.percentages[label] || 0;
                    return ` ${label}: ${value} (${pct}%)`;
                  }
                }
              }
            }
          }
        });
        return;
      } catch (err) {
        console.warn("Chart.js render error, fallback to SVG:", err);
      }
    }

    // Fallback: Render SVG chart if Chart.js is not loaded or errors
    this.renderAnalyticsSvgChart(trendCanvas.parentElement, timeSeries);
    this.renderAnalyticsDeviceSvg(deviceCanvas.parentElement, devices);
  },

  renderAnalyticsSvgChart(container, timeSeries) {
    if (!container) return;
    const maxVal = Math.max(...timeSeries.pageViews, ...timeSeries.impressions, 10);
    const count = timeSeries.labels.length;
    const width = 600;
    const height = 240;

    const pointsPV = timeSeries.pageViews.map((v, i) => {
      const x = 40 + (i / Math.max(count - 1, 1)) * (width - 80);
      const y = height - 40 - (v / maxVal) * (height - 80);
      return `${x},${y}`;
    }).join(" ");

    container.innerHTML = `
      <div class="svg-chart-container">
        <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%;">
          <line x1="40" y1="${height - 40}" x2="${width - 20}" y2="${height - 40}" stroke="var(--border-color)" stroke-width="1" />
          <polyline fill="none" stroke="#008751" stroke-width="3" points="${pointsPV}" />
        </svg>
        <div style="display:flex; justify-content:center; gap:20px; font-size:12px; margin-top:8px;">
          <span style="color:#008751;"><i class="fa-solid fa-circle"></i> Page Views</span>
        </div>
      </div>
    `;
  },

  renderAnalyticsDeviceSvg(container, devices) {
    if (!container) return;
    container.innerHTML = `
      <div style="padding:20px 10px; display:flex; flex-direction:column; justify-content:center; height:100%; gap:12px;">
        <div>
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px; font-weight:600;">
            <span><i class="fa-solid fa-laptop" style="color:#008751;"></i> Desktop</span>
            <span>${devices.percentages.Desktop}% (${devices.counts.Desktop})</span>
          </div>
          <div style="background:var(--bg-secondary); height:8px; border-radius:4px; overflow:hidden;">
            <div style="background:#008751; height:100%; width:${devices.percentages.Desktop}%;"></div>
          </div>
        </div>
        <div>
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px; font-weight:600;">
            <span><i class="fa-solid fa-mobile-screen" style="color:#0284c7;"></i> Mobile</span>
            <span>${devices.percentages.Mobile}% (${devices.counts.Mobile})</span>
          </div>
          <div style="background:var(--bg-secondary); height:8px; border-radius:4px; overflow:hidden;">
            <div style="background:#0284c7; height:100%; width:${devices.percentages.Mobile}%;"></div>
          </div>
        </div>
        <div>
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px; font-weight:600;">
            <span><i class="fa-solid fa-tablet-screen-button" style="color:#d97706;"></i> Tablet</span>
            <span>${devices.percentages.Tablet}% (${devices.counts.Tablet})</span>
          </div>
          <div style="background:var(--bg-secondary); height:8px; border-radius:4px; overflow:hidden;">
            <div style="background:#d97706; height:100%; width:${devices.percentages.Tablet}%;"></div>
          </div>
        </div>
      </div>
    `;
  },

  formatRelativeTime(dateStr) {
    if (!dateStr) return "Just now";
    try {
      const now = Date.now();
      const diff = Math.floor((now - new Date(dateStr).getTime()) / 1000);
      if (diff < 5) return "Just now";
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    } catch (e) {
      return "Recently";
    }
  },

  templatePrivacy() {
    return `
      <!-- Privacy Policy Page Hero Banner -->
      <section class="page-hero-banner">
        <div class="container">
          <h1>Privacy</h1>
          <p>Our commitment to protecting your privacy and maintaining a transparent, open-access platform.</p>
        </div>
      </section>

      <section class="section reading-section">
        <div class="container container-narrow">
          <div class="reading-container">
            <div class="reading-meta">Last updated: July 4, 2026</div>
            <div class="reading-content">
              <p>At Afri Tech Hub, we value the trust you place in us. This Privacy Policy details how we collect, use, and safeguard any information when you visit and interact with our open-access portal.</p>
              
              <h2>1. Our Open-Access Principle</h2>
              <p>Afri Tech Hub is built as a zero-barrier, open-access opportunities portal. We do not require account registration, login credentials, or profiles to browse our directories. Consequently, we do not track your browsing history or maintain personal profiles.</p>
              
              <h2>2. Information We Collect</h2>
              <p>We only receive information that you voluntarily submit to us. This occurs in the following ways:</p>
              <ul>
                <li><strong>Contact Inquiry:</strong> If you use our Contact Form, we collect your full name, email address, and the content of your message to address your inquiry.</li>
                <li><strong>Newsletter Subscription:</strong> If you subscribe to our Weekly Email Roundups, we collect your email address solely to send you verified opportunity listings.</li>
              </ul>
              
              <h2>3. How We Use Your Information</h2>
              <p>Your information is used strictly for its intended purpose:</p>
              <ul>
                <li>To respond to comments, questions, or issues sent through the contact form.</li>
                <li>To deliver the weekly newsletters with the latest opportunities.</li>
                <li>To monitor and maintain system security and prevent spam.</li>
              </ul>
              <p>We will never sell, lease, distribute, or share your email address or personal details with third-party advertisers or sponsors.</p>
              
              <h2>4. Cookies &amp; First-Party Analytics</h2>
              <p>We are firmly committed to user privacy and open access. We do not use third-party tracking cookies, behavioral ad pixels, or commercial tracking services (such as Google Analytics or Meta Pixel) to track you across the web.</p>
              <p>To continually improve our curation and understand which opportunities best serve African talent, we operate a lightweight, privacy-focused <strong>First-Party Analytics System</strong>. This system collects strictly anonymous engagement signals (such as page views, opportunity card impressions, and application button clicks) using pseudo-anonymous session and device tokens stored locally in your browser session.</p>
              <p>We do not store your IP address, name, email, or device fingerprints in our analytics logs, and analytics data is never sold, shared, or transferred to third-party ad networks. You may also disable local storage or clear your browser cache at any time without impacting your ability to freely browse Afri Tech Hub.</p>
              
              <h2>5. External Application Portals</h2>
              <p>Our service indexes and curates external vacancies, grants, and scholarships. Clicking "Apply" redirects you to the official registration portals of external organizations (e.g. Google, Mastercard Foundation). Afri Tech Hub does not manage these external sites and is not liable for their privacy practices. We recommend reading their respective privacy policies before applying.</p>
              
              <h2>6. Data Security</h2>
              <p>We implement appropriate physical, technical, and administrative security measures to protect your submitted contact form entries and newsletter subscribers database from unauthorized access, alteration, or disclosure.</p>
              
              <h2>7. Opt-Out & Deletion Rights</h2>
              <p>You can opt-out of our newsletter at any time by clicking the "Unsubscribe" link at the bottom of our emails, or by contacting us directly to request that your email address and message entries be deleted from our systems.</p>
              
              <h2>8. Contact Us</h2>
              <p>If you have any questions regarding this Privacy Policy or how we handle your data, please contact us at:</p>
              <p><strong>Email:</strong> hubafritech@gmail.com<br><strong>Phone:</strong> <a href="tel:09159701354" style="color:inherit;">09159701354</a></p>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  templateTerms() {
    return `
      <!-- Terms of Use Page Hero Banner -->
      <section class="page-hero-banner">
        <div class="container">
          <h1>Terms</h1>
          <p>Terms and conditions governing open-access use of the Afri Tech Hub platform.</p>
        </div>
      </section>

      <section class="section reading-section">
        <div class="container container-narrow">
          <div class="reading-container">
            <div class="reading-meta">Last updated: June 28, 2026</div>
            <div class="reading-content">
              <p>By accessing Afri Tech Hub, you agree to these Terms of Use. Access is provided completely free of charge and "as is".</p>
              <h3>User Constraints</h3>
              <p>You may browse listings and apply. You must not attempt to breach admin security protocols, scrape database arrays maliciously, or submit spam messages through our contact channels.</p>
              <h3>Liability Disclaimer</h3>
              <p>While we curate and verify listings, Afri Tech Hub does not represent official sponsors or employers. We do not guarantee selection, and are not liable for any outcomes arising from external applications.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  },
};
