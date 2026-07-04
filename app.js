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
    activeDashboardTab: "overview", // 'overview', 'posts', 'create', 'categories', 'subscribers', 'messages'
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

    // Dynamic ID routing check (e.g. #post/tef-entrepreneurship-2026)
    if (route.startsWith("#post/")) {
      const postId = route.substring(6); // Extract ID
      this.state.currentPage = "post-detail";
      this.updateNavbarActiveState("opportunities");
      this.syncSEO("post-detail", { postId });
      this.renderView("post-detail", { postId });
      return;
    }

    // Clean page name
    const pageName = route.substring(1);
    this.state.currentPage = pageName;
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
    let title = "Afri Tech Hub | Opportunities Directory";
    let desc =
      "Empowering African innovators by curating jobs, grants, scholarships, and fellowships. Zero signup required.";

    if (pageName === "home") {
      title = "Afri Tech Hub | Empowering African Entrepreneurs & Youth";
      desc =
        "Discover verified entry-level tech opportunities, grants, and scholarships across Africa. Access is completely open and free with no login required.";
    } else if (pageName === "opportunities") {
      title = "Browse Tech Opportunities & Funding | Afri Tech Hub";
      desc =
        "Search and filter active tech jobs, graduate trainee programmes, fully-funded scholarships, and startup grants.";
    } else if (pageName === "categories") {
      title = "Explore Opportunity Categories | Afri Tech Hub";
      desc =
        "Navigate tailored lists of fellowships, internships, business funding, and tech vacancies.";
    } else if (pageName === "about") {
      title = "About Us | Afri Tech Hub Mission & Team";
      desc =
        "Learn how Afri Tech Hub curates resource listings to support the next generation of African digital professionals.";
    } else if (pageName === "faq") {
      title = "Frequently Asked Questions | Afri Tech Hub";
      desc =
        "Find answers on opportunity verification, application processes, and joining the WhatsApp community.";
    } else if (pageName === "contact") {
      title = "Contact Support & Inquiry | Afri Tech Hub";
      desc =
        "Get in touch with Afri Tech Hub to share vacancy listings, submit feedback, or partner with us.";
    } else if (pageName === "admin-login") {
      title = "Admin Portal Authentication | Afri Tech Hub";
      desc =
        "Secure gateway for administrators to login and edit active database postings.";
    } else if (pageName === "admin-dashboard") {
      title = "Admin Panel Overview | Afri Tech Hub";
      desc = "Database management panel for Afri Tech Hub administrators.";
    } else if (pageName === "post-detail" && params.postId) {
      const opp = DataStore.getOpportunities(true).find(
        (o) => o.id === params.postId,
      );
      if (opp) {
        title = `${opp.title} at ${opp.company} | Afri Tech Hub`;
        desc = opp.shortDescription;
      }
    }

    document.title = title;
    if (metaDesc) metaDesc.setAttribute("content", desc);
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

      // Update browser document title
      const titleMap = {
        "home": "Dashboard Overview",
        "opportunities": "Opportunities Directory",
        "categories": "Opportunity Categories",
        "about": "About AfriTech Hub",
        "faq": "Frequently Asked Questions",
        "contact": "Contact Support",
        "privacy": "Privacy Policy",
        "terms": "Terms of Use",
        "admin-login": "Admin Authentication",
        "admin-dashboard": "Admin Control Panel"
      };
      document.title = titleMap[view] ? `${titleMap[view]} | AfriTech Hub` : "AfriTech Hub";

      this.nodes.content.innerHTML = htmlContent;
      this.bindViewEvents(view, params);
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

      // Newsletter
      const newsletterForm = document.getElementById("home-newsletter-form");
      if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const email = newsletterForm.querySelector("input").value.trim();
          if (email) {
            const added = DataStore.addSubscriber(email);
            if (added) {
              this.showToast(
                "Thank you! You have been successfully subscribed to newsletter updates.",
                "success",
              );
            } else {
              this.showToast(
                "You are already subscribed to the newsletter!",
                "info",
              );
            }
            newsletterForm.reset();
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
    }

    if (view === "admin-login") {
      const loginForm = document.getElementById("admin-login-form");
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = document.getElementById("admin-username").value.trim();
        const pass = document.getElementById("admin-password").value.trim();

        // Standard auth validation credentials
        if (user === "admin" && pass === "adminpassword") {
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

      let currentSkills = [];

      // Edit Mode Preloading
      if (this.state.editingPostId) {
        const opp = this.state.opportunities.find(
          (o) => o.id === this.state.editingPostId,
        );
        if (opp) {
          document.getElementById("adm-opp-title").value = opp.title;
          document.getElementById("adm-opp-company").value = opp.company;
          document.getElementById("adm-opp-category").value = opp.category;
          document.getElementById("adm-opp-experience").value =
            opp.experienceLevel || "Graduate";
          document.getElementById("adm-opp-remote").value =
            opp.remote || "Onsite";
          document.getElementById("adm-opp-country").value = opp.country || "";
          document.getElementById("adm-opp-location").value = opp.location;
          document.getElementById("adm-opp-deadline").value = opp.deadline;
          document.getElementById("adm-opp-short").value = opp.shortDescription;
          document.getElementById("adm-opp-desc").value = opp.description;
          document.getElementById("adm-opp-req").value =
            opp.requirements.join("\n");
          document.getElementById("adm-opp-ben").value =
            opp.benefits.join("\n");
          document.getElementById("adm-opp-url").value = opp.applyUrl;
          document.getElementById("adm-opp-status").value =
            opp.status || "published";
          document.getElementById("adm-opp-featured").checked =
            opp.featured || false;

          if (
            opp.image &&
            !opp.image.startsWith("https://images.unsplash.com")
          ) {
            filePreview.innerHTML = `<img src="${opp.image}" alt="Preview">`;
          } else if (opp.image) {
            textUrlInput.value = opp.image;
            filePreview.innerHTML = `<img src="${opp.image}" alt="Preview">`;
          }

          if (opp.skills) {
            currentSkills = [...opp.skills];
            this.renderSkillsTags(currentSkills, skillsContainer);
          }
        }
      }

      // Handle Skills comma trigger
      skillsInput.addEventListener("keydown", (e) => {
        if (e.key === "," || e.key === "Enter") {
          e.preventDefault();
          const val = skillsInput.value.trim().replace(/,/g, "");
          if (val && !currentSkills.includes(val)) {
            currentSkills.push(val);
            this.renderSkillsTags(currentSkills, skillsContainer);
          }
          skillsInput.value = "";
        }
      });

      // Handle Image File Preloading Preview
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

      // Handle Image URL input sync preview
      textUrlInput.addEventListener("input", () => {
        const val = textUrlInput.value.trim();
        if (val) {
          filePreview.innerHTML = `<img src="${val}" alt="Preview">`;
        }
      });

      // Form Submit CRUD
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("adm-opp-title").value.trim();
        const company = document.getElementById("adm-opp-company").value.trim();
        const category = document.getElementById("adm-opp-category").value;
        const exp = document.getElementById("adm-opp-experience").value;
        const remote = document.getElementById("adm-opp-remote").value;
        const country = document.getElementById("adm-opp-country").value.trim();
        const location = document
          .getElementById("adm-opp-location")
          .value.trim();
        const deadline = document.getElementById("adm-opp-deadline").value;
        const shortDesc = document.getElementById("adm-opp-short").value.trim();
        const description = document
          .getElementById("adm-opp-desc")
          .value.trim();
        const reqText = document.getElementById("adm-opp-req").value.trim();
        const benText = document.getElementById("adm-opp-ben").value.trim();
        const applyUrl = document.getElementById("adm-opp-url").value.trim();
        const status = document.getElementById("adm-opp-status").value;
        const featured = document.getElementById("adm-opp-featured").checked;
        const file = fileInput.files[0];
        const textUrl = textUrlInput.value.trim();

        const savePost = (imgData) => {
          const requirements = reqText
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);
          const benefits = benText
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);

          let id = this.state.editingPostId;
          if (!id) {
            id =
              title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "") +
              "-" +
              Date.now().toString().slice(-4);
          }

          const targetPost = {
            id,
            title,
            company,
            category,
            experienceLevel: exp,
            remote,
            country: country || "Global",
            location,
            date: this.state.editingPostId
              ? this.state.opportunities.find((o) => o.id === id).date
              : new Date().toISOString().split("T")[0],
            deadline,
            image: imgData || textUrl || "",
            shortDescription: shortDesc,
            description,
            requirements,
            benefits,
            skills: currentSkills,
            applyUrl,
            featured,
            trending: this.state.editingPostId
              ? this.state.opportunities.find((o) => o.id === id).trending
              : false,
            status,
          };

          DataStore.saveOpportunity(targetPost);
          this.refreshState();

          this.state.editingPostId = null;
          this.state.activeDashboardTab = "posts";
          this.renderView("admin-dashboard");

          this.showToast("Opportunity saved successfully!", "success");
        };

        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => savePost(ev.target.result);
          reader.readAsDataURL(file);
        } else {
          // If editing and no image is uploaded/inserted, preserve existing
          let existingImg = "";
          if (this.state.editingPostId) {
            const current = this.state.opportunities.find(
              (o) => o.id === this.state.editingPostId,
            );
            if (current) existingImg = current.image;
          }
          savePost(existingImg);
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
      const copyBtn = document.getElementById("admin-sub-copy");
      const listContainer = document.getElementById("admin-subscribers-list");

      if (copyBtn) {
        copyBtn.addEventListener("click", () => {
          const emails = DataStore.getSubscribers();
          if (emails.length === 0) {
            this.showToast("No subscribers to copy.", "error");
            return;
          }
          navigator.clipboard
            .writeText(emails.join(", "))
            .then(() =>
              this.showToast(
                "All subscriber emails copied to clipboard!",
                "success",
              ),
            );
        });
      }

      listContainer.addEventListener("click", (e) => {
        const delBtn = e.target.closest(".btn-sub-delete");
        if (delBtn) {
          const email = delBtn.getAttribute("data-email");
          if (confirm(`Remove ${email} from subscribers list?`)) {
            DataStore.deleteSubscriber(email);
            this.showToast(`${email} removed.`, "info");
            this.renderView("admin-dashboard");
          }
        }
      });
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

  cardTemplate(opp) {
    const formattedDeadline =
      opp.deadline === "Rolling" ? "Rolling" : opp.deadline;
    const skillsBadges = opp.skills
      ? opp.skills
          .slice(0, 3)
          .map((s) => `<span class="card-skill-badge">${s}</span>`)
          .join("")
      : "";

    return `
      <article class="opportunity-card animate-fade-in-up">
        <div class="card-image-container">
          <img src="${opp.image}" alt="${opp.company} Cover" loading="lazy">
          <span class="category-badge cat-${opp.category.toLowerCase().replace(/[^a-z0-9]/g, "")}">${opp.category}</span>
          ${opp.remote ? `<span class="remote-badge">${opp.remote}</span>` : ""}
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span class="company-name"><i class="fa-solid fa-building"></i> ${opp.company}</span>
            <span class="location"><i class="fa-solid fa-location-dot"></i> ${opp.location}</span>
          </div>
          <h3 class="card-title">${opp.title}</h3>
          <p class="card-desc">${opp.shortDescription}</p>
          <div class="card-skills-strip">
            ${skillsBadges}
          </div>
        </div>
        <div class="card-footer">
          <span class="deadline-timer"><i class="fa-solid fa-clock-rotate-left"></i> ${formattedDeadline}</span>
          <div class="card-actions">
            <a href="#post/${opp.id}" class="btn btn-secondary btn-sm" aria-label="Details for ${opp.title}">Details</a>
            <a href="${opp.applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" aria-label="Apply for ${opp.title}">Apply <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
          </div>
        </div>
      </article>
    `;
  },

  compactCardTemplate(opp, isActive = false) {
    const activeClass = isActive ? 'active' : '';
    return `
      <div class="compact-opp-card ${activeClass}" data-id="${opp.id}" role="button" tabindex="0">
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
        <a href="${opp.applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-apply-now-split">Apply Now <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
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
      <!-- Split Hero Screen -->
      <section class="home-hero full-bleed">
        <div class="hero-bg-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
        </div>
        <div class="container hero-inner-split">
          <div class="hero-left animate-fade-in">
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

          <div class="hero-right animate-fade-in-up">
            <!-- Glassmorphic Showcase card -->
            <div class="showcase-card">
              <div class="showcase-card-header">
                <div class="company-badge-strip">
                  <span class="showcase-logo"><i class="fa-solid fa-bolt"></i></span>
                  <div>
                    <h4>SpaceX Fellowship</h4>
                    <p>Space Exploration Technologies</p>
                  </div>
                </div>
                <span class="badge-status published">Fully Funded</span>
              </div>
              <div class="showcase-card-body">
                <div class="showcase-meta-row">
                  <span><i class="fa-solid fa-location-dot"></i> Cape Canaveral, FL</span>
                  <span><i class="fa-solid fa-earth-africa"></i> Global Candidates</span>
                </div>
                <p>Curated fellowship program for African aerospace engineers, software developers, and research associates to work on Starlink core modules.</p>
                <div class="showcase-skills-strip">
                  <span class="card-skill-badge">C++</span>
                  <span class="card-skill-badge">Linux Systems</span>
                  <span class="card-skill-badge">Aerospace</span>
                </div>
              </div>
              <div class="showcase-card-footer">
                <span class="showcase-deadline"><i class="fa-solid fa-hourglass-half"></i> Deadline: Sept 30, 2026</span>
                <a href="#opportunities" class="btn btn-outline btn-sm">Preview Board</a>
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
          
          <div class="flex-center mt-4">
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
              <p>Receive rolling grants, developer jobs, and academic scholarships straight to your phone. 5,000+ members already subscribed.</p>
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
      <section class="section">
        <div class="container container-feed">
          <div class="section-title-block">
            <h2>Opportunities Directory</h2>
          </div>

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
          <h1>About Afri Tech Hub</h1>
          <p>A zero-barrier, open-access platform connecting African talent to verified global opportunities.</p>
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
                <p><i class="fa-solid fa-envelope"></i> info@afritechhub.org</p>
                <p><i class="fa-solid fa-phone"></i> +234 915 970 1354</p>
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
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about using Afri Tech Hub.</p>
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
          <h1>Contact Us</h1>
          <p>We respond within 24 hours. Reach out for partnerships, listing submissions, or platform enquiries.</p>
        </div>
      </section>

      <!-- Quick Contact Chips -->
      <section class="contact-chips-section">
        <div class="container">
          <div class="contact-chips-grid">
            <a href="mailto:info@afritechhub.org" class="contact-chip">
              <div class="contact-chip-icon"><i class="fa-solid fa-envelope"></i></div>
              <div class="contact-chip-body">
                <span class="contact-chip-label">Email Us</span>
                <span class="contact-chip-value">info@afritechhub.org</span>
              </div>
            </a>
            <a href="tel:+2349159701354" class="contact-chip">
              <div class="contact-chip-icon phone"><i class="fa-solid fa-phone"></i></div>
              <div class="contact-chip-body">
                <span class="contact-chip-label">Call Us</span>
                <span class="contact-chip-value">+234 915 970 1354</span>
              </div>
            </a>
            <a href="https://chat.whatsapp.com/Bd2MI5seG7y8HoJjbfpQrH" target="_blank" rel="noopener noreferrer" class="contact-chip">
              <div class="contact-chip-icon whatsapp"><i class="fa-brands fa-whatsapp"></i></div>
              <div class="contact-chip-body">
                <span class="contact-chip-label">WhatsApp Community</span>
                <span class="contact-chip-value">Join 5,000+ Members</span>
              </div>
            </a>
            <div class="contact-chip no-link">
              <div class="contact-chip-icon location"><i class="fa-solid fa-location-dot"></i></div>
              <div class="contact-chip-body">
                <span class="contact-chip-label">Our Office</span>
                <span class="contact-chip-value">Victoria Island, Lagos, NG</span>
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
    if (!opp) {
      return `
        <div class="container text-center" style="padding:100px 24px;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 50px; color: var(--color-accent); margin-bottom: 20px;"></i>
          <h2>Opportunity Not Found</h2>
          <p>This posting may have expired, been archived, or deleted by the administrator.</p>
          <a href="#opportunities" class="btn btn-primary" style="margin-top:20px;">Back to Directory</a>
        </div>
      `;
    }

    const requirementsList = opp.requirements
      .map(
        (req) => `<li><i class="fa-regular fa-square-check"></i> ${req}</li>`,
      )
      .join("");
    const benefitsList = opp.benefits
      .map((ben) => `<li><i class="fa-regular fa-star"></i> ${ben}</li>`)
      .join("");
    const skillsBadges = opp.skills
      ? opp.skills.map((s) => `<span class="badge-skill">${s}</span>`).join("")
      : "";

    // Related Listings
    const related = DataStore.getOpportunities()
      .filter(
        (o) =>
          o.category.toLowerCase() === opp.category.toLowerCase() &&
          o.id !== opp.id,
      )
      .slice(0, 3);
    const relatedGrid = related.map((o) => this.cardTemplate(o)).join("");

    return `
      <section class="post-detail-section">
        <div class="container">
          <!-- Back Link -->
          <a href="#opportunities" class="back-link"><i class="fa-solid fa-arrow-left"></i> Back to Listings</a>
          
          <!-- Detail Grid Layout -->
          <div class="post-detail-grid">
            <!-- Left Side Core Content -->
            <div class="post-main-content">
              <div class="post-header-meta">
                <span class="category-badge cat-${opp.category.toLowerCase().replace(/[^a-z0-9]/g, "")}">${opp.category}</span>
                ${opp.remote ? `<span class="badge-status draft">${opp.remote}</span>` : ""}
                ${opp.experienceLevel ? `<span class="badge-status published">${opp.experienceLevel}</span>` : ""}
              </div>
              <h1 class="post-title">${opp.title}</h1>
              
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
                  <div class="strip-icon"><i class="fa-solid fa-calendar"></i></div>
                  <div class="strip-info">
                    <h5>Date Posted</h5>
                    <p>${opp.date}</p>
                  </div>
                </div>
              </div>

              <!-- Banner Cover Image -->
              <div class="post-detail-image-container">
                <img src="${opp.image}" alt="${opp.company} Banner">
              </div>

              <div class="post-body-content">
                <!-- Description -->
                <div class="content-block">
                  <h3>Detailed Description</h3>
                  <p>${opp.description}</p>
                </div>

                <!-- Requirements -->
                <div class="content-block">
                  <h3>Eligibility & Requirements</h3>
                  <ul class="custom-list">
                    ${requirementsList}
                  </ul>
                </div>

                <!-- Benefits -->
                <div class="content-block">
                  <h3>Benefits & Packages</h3>
                  <ul class="custom-list">
                    ${benefitsList}
                  </ul>
                </div>

                <!-- Skills tags -->
                ${
                  skillsBadges
                    ? `
                <div class="content-block">
                  <h3>Key Skills Target</h3>
                  <div class="detail-skills-container">
                    ${skillsBadges}
                  </div>
                </div>
                `
                    : ""
                }
              </div>
            </div>

            <!-- Right Side Sidebar details -->
            <aside class="post-sidebar-sticky">
              <div class="apply-card-box">
                <h3 class="apply-card-title">Listing Summary</h3>
                
                <table class="summary-table">
                  <tr>
                    <td><i class="fa-solid fa-industry"></i> Organization</td>
                    <td>${opp.company}</td>
                  </tr>
                  <tr>
                    <td><i class="fa-solid fa-list"></i> Category</td>
                    <td>${opp.category}</td>
                  </tr>
                  <tr>
                    <td><i class="fa-solid fa-layer-group"></i> Target level</td>
                    <td>${opp.experienceLevel || "Graduate"}</td>
                  </tr>
                  <tr>
                    <td><i class="fa-solid fa-map-location-dot"></i> Workplace</td>
                    <td>${opp.remote || "Onsite"}</td>
                  </tr>
                  <tr>
                    <td><i class="fa-solid fa-earth-africa"></i> Country</td>
                    <td>${opp.country || "Global"}</td>
                  </tr>
                  <tr class="deadline-row">
                    <td><i class="fa-solid fa-calendar-xmark"></i> Deadline</td>
                    <td>${opp.deadline === "Rolling" ? "Rolling" : opp.deadline}</td>
                  </tr>
                </table>

                <a href="${opp.applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-apply-now">Apply on Official Site <i class="fa-solid fa-arrow-up-right-from-square"></i></a>

                <!-- Share widget -->
                <div class="share-strip">
                  <span class="share-label">Share:</span>
                  <div class="share-icons">
                    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(opp.title)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-share" aria-label="Share on Twitter"><i class="fa-brands fa-x-twitter"></i></a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-share" aria-label="Share on LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(opp.title + " " + window.location.href)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-share" aria-label="Share on WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                    <button class="btn btn-outline btn-share" id="share-copy-link" aria-label="Copy Link"><i class="fa-solid fa-copy"></i></button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
          
          <!-- Related Opportunities Section -->
          ${
            relatedGrid
              ? `
          <div class="related-listings-section">
            <h3><i class="fa-solid fa-cubes-stacked"></i> Related Listings</h3>
            <div class="opportunities-grid">
              ${relatedGrid}
            </div>
          </div>
          `
              : ""
          }
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
          <h3 style="margin-bottom:25px; font-size:18px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
            <i class="fa-solid fa-bullhorn" style="color:var(--color-primary); margin-right:8px;"></i>
            ${isEditing ? "Edit Post Details" : "Publish New Opportunity"}
          </h3>

          <form id="admin-opp-form">
            <!-- Row 1: Title & Organization -->
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-title">Opportunity Title *</label>
                <input type="text" id="adm-opp-title" class="admin-form-control" placeholder="e.g. Junior Frontend Developer" required>
              </div>
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-company">Organization / Sponsor Name *</label>
                <input type="text" id="adm-opp-company" class="admin-form-control" placeholder="e.g. Google, Canonical" required>
              </div>
            </div>

            <!-- Row 2: Category & Experience & Workplace -->
            <div class="admin-form-row" style="grid-template-columns: repeat(3, 1fr);">
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-category">Category *</label>
                <select id="adm-opp-category" class="admin-form-control" required>
                  <option value="" disabled selected>Select category</option>
                  ${categoryOptions}
                </select>
              </div>
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-experience">Experience Target *</label>
                <select id="adm-opp-experience" class="admin-form-control" required>
                  <option value="Internship">Internship</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Fellowship">Fellowship</option>
                  <option value="Scholarship">Scholarship</option>
                </select>
              </div>
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-remote">Workplace Model *</label>
                <select id="adm-opp-remote" class="admin-form-control" required>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>
            </div>

            <!-- Row 3: Country & Location & Deadline -->
            <div class="admin-form-row" style="grid-template-columns: repeat(3, 1fr);">
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-country">Country Base *</label>
                <input type="text" id="adm-opp-country" class="admin-form-control" placeholder="e.g. Global, Kenya, Nigeria" required>
              </div>
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-location">Specific Location *</label>
                <input type="text" id="adm-opp-location" class="admin-form-control" placeholder="e.g. Nairobi, Kenya or Remote (Global)" required>
              </div>
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-deadline">Application Deadline *</label>
                <input type="text" id="adm-opp-deadline" class="admin-form-control" placeholder="YYYY-MM-DD or 'Rolling'" required>
              </div>
            </div>

            <!-- Summary -->
            <div class="admin-form-group">
              <label class="form-label" for="adm-opp-short">Short Summary * (Max 150 characters)</label>
              <input type="text" id="adm-opp-short" class="admin-form-control" maxlength="150" placeholder="Brief tagline shown on search grids" required>
            </div>

            <!-- Full Description -->
            <div class="admin-form-group">
              <label class="form-label" for="adm-opp-desc">Full Opportunity details *</label>
              <textarea id="adm-opp-desc" class="admin-form-control" rows="5" placeholder="Elaborated description of the vacancy or grant..." required></textarea>
            </div>

            <!-- Row 4: Requirements & Benefits Textareas -->
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-req">Requirements List * (One item per line)</label>
                <textarea id="adm-opp-req" class="admin-form-control" rows="4" placeholder="Requirement 1&#10;Requirement 2&#10;Requirement 3" required></textarea>
              </div>
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-ben">Benefits List * (One item per line)</label>
                <textarea id="adm-opp-ben" class="admin-form-control" rows="4" placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3" required></textarea>
              </div>
            </div>

            <!-- Required Skills Input tags -->
            <div class="admin-form-group">
              <label class="form-label" for="adm-opp-skills">Required Skills (Type skill and press comma ',' or Enter)</label>
              <input type="text" id="adm-opp-skills" class="admin-form-control" placeholder="React, Git, SQL, Python...">
              <div class="skills-tags-container" id="adm-skills-tags"></div>
            </div>

            <!-- Image File or URL and Apply URL -->
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-url">Official Application link *</label>
                <input type="url" id="adm-opp-url" class="admin-form-control" placeholder="https://company-portal.com/apply" required>
              </div>
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-status">Post Status *</label>
                <select id="adm-opp-status" class="admin-form-control" required>
                  <option value="published">Published (Visible to public)</option>
                  <option value="draft">Draft (Visible only to admin)</option>
                  <option value="archived">Archived (Expired/Closed)</option>
                </select>
              </div>
            </div>

            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-img-file">Upload Image Cover File</label>
                <input type="file" id="adm-opp-img-file" class="admin-form-control" accept="image/*">
              </div>
              <div class="admin-form-group">
                <label class="form-label" for="adm-opp-img-url">Or Image Web URL</label>
                <input type="url" id="adm-opp-url" class="admin-form-control" placeholder="https://images.unsplash.com/... or Base64 code">
              </div>
            </div>

            <div class="admin-form-group" style="display:flex; align-items:center; gap:20px;">
              <div class="image-preview-box" id="adm-img-preview">
                <span>No cover selected</span>
              </div>
              <div>
                <label style="display:inline-flex; align-items:center; gap:8px; cursor:pointer; font-weight:700;">
                  <input type="checkbox" id="adm-opp-featured" style="width:18px; height:18px;"> Set post as Homepage Featured Pick
                </label>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:20px; font-size:15px; font-weight:700;">
              <i class="fa-solid fa-floppy-disk" style="margin-right:8px;"></i> Save Opportunity
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
      const subs = DataStore.getSubscribers();
      return `
        <div class="admin-card-body animate-fade-in-up">
          <div style="display:flex; justify-content:between; align-items:center; gap:20px; margin-bottom:25px; flex-wrap:wrap;">
            <h3 style="font-size:18px;">Newsletter Subscriptions</h3>
            <button class="btn btn-primary btn-sm" id="admin-sub-copy"><i class="fa-solid fa-copy"></i> Copy Email List</button>
          </div>

          <div class="admin-table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Subscriber Email Address</th>
                  <th style="width: 150px; text-align:right;">Actions</th>
                </tr>
              </thead>
              <tbody id="admin-subscribers-list">
                ${
                  subs.length === 0
                    ? '<tr><td colspan="2" class="text-center" style="padding:40px;">No newsletter signups yet.</td></tr>'
                    : subs
                        .map(
                          (email) => `
                    <tr>
                      <td style="font-weight:600; color:var(--text-primary);">${email}</td>
                      <td style="text-align:right;">
                        <button class="btn btn-delete btn-sm btn-sub-delete" data-email="${email}"><i class="fa-solid fa-trash-can"></i> Remove</button>
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

    return "";
  },

  templatePrivacy() {
    return `
      <section class="reading-section">
        <div class="reading-container">
          <h1>Privacy Policy</h1>
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
            
            <h2>4. Cookies & Web Tracking</h2>
            <p>We may use basic cookies or local storage settings (such as saving your preferred Dark Mode toggle) to improve your visual experience. These configurations do not contain personal identifier details and are not uploaded to our servers.</p>
            
            <h2>5. External Application Portals</h2>
            <p>Our service indexes and curates external vacancies, grants, and scholarships. Clicking "Apply" redirects you to the official registration portals of external organizations (e.g. Google, Mastercard Foundation). Afri Tech Hub does not manage these external sites and is not liable for their privacy practices. We recommend reading their respective privacy policies before applying.</p>
            
            <h2>6. Data Security</h2>
            <p>We implement appropriate physical, technical, and administrative security measures to protect your submitted contact form entries and newsletter subscribers database from unauthorized access, alteration, or disclosure.</p>
            
            <h2>7. Opt-Out & Deletion Rights</h2>
            <p>You can opt-out of our newsletter at any time by clicking the "Unsubscribe" link at the bottom of our emails, or by contacting us directly to request that your email address and message entries be deleted from our systems.</p>
            
            <h2>8. Contact Us</h2>
            <p>If you have any questions regarding this Privacy Policy or how we handle your data, please contact us at:</p>
            <p><strong>Email:</strong> info@afritechhub.org<br><strong>Phone:</strong> +234 915 970 1354</p>
          </div>
        </div>
      </section>
    `;
  },

  templateTerms() {
    return `
      <section class="reading-section">
        <div class="reading-container">
          <h1>Terms of Use</h1>
          <div class="reading-meta">Last updated: June 28, 2026</div>
          <div class="reading-content">
            <p>By accessing Afri Tech Hub, you agree to these Terms of Use. Access is provided completely free of charge and "as is".</p>
            <h3>User Constraints</h3>
            <p>You may browse listings and apply. You must not attempt to breach admin security protocols, scrape database arrays maliciously, or submit spam messages through our contact channels.</p>
            <h3>Liability Disclaimer</h3>
            <p>While we curate and verify listings, Afri Tech Hub does not represent official sponsors or employers. We do not guarantee selection, and are not liable for any outcomes arising from external applications.</p>
          </div>
        </div>
      </section>
    `;
  },
};
