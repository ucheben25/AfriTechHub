/**
 * analytics.js - First-Party Analytics Tracker for Afri Tech Hub
 * 
 * Lightweight, privacy-respecting first-party analytics system:
 * - Zero third-party tracker dependencies
 * - Anonymous session (sessionStorage) & visitor (localStorage) tokens
 * - No PII or raw IP addresses stored
 * - Asynchronous, non-blocking execution with complete fault tolerance
 * - Viewport intersection observation for opportunity card impressions
 * - Debounced interaction tracking (views, clicks, apply actions)
 */

(function () {
  'use strict';

  const ATHAnalytics = {
    sessionId: null,
    visitorId: null,
    country: 'Unknown',
    countryCode: 'XX',
    deviceType: 'Desktop',
    initialized: false,
    _lastPageTracked: null,
    _lastPageTrackTime: 0,
    _observedImpressions: new Set(),
    _lastApplyClickTime: 0,
    _intersectionObserver: null,

    /**
     * Generate anonymous pseudo-random identifier
     */
    generateId(prefix) {
      const ts = Date.now().toString(36);
      const rand = Math.random().toString(36).substring(2, 10);
      return `${prefix}_${ts}_${rand}`;
    },

    /**
     * Detect device type based on userAgent & window dimensions
     */
    detectDevice() {
      try {
        const ua = navigator.userAgent || '';
        const width = window.innerWidth || document.documentElement.clientWidth || 1024;

        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua) || (width >= 768 && width <= 1024)) {
          return 'Tablet';
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua) || width < 768) {
          return 'Mobile';
        }
        return 'Desktop';
      } catch (e) {
        return 'Desktop';
      }
    },

    /**
     * Clean and normalize referrer string (strips query parameters, keeps hostname or 'Direct')
     */
    getSanitizedReferrer() {
      try {
        if (!document.referrer) return 'Direct';
        const url = new URL(document.referrer);
        if (url.origin === window.location.origin) return 'Internal Navigation';
        return url.hostname || 'Direct';
      } catch (e) {
        return 'Direct';
      }
    },

    /**
     * Non-blocking asynchronous country lookup with fallback and session cache
     */
    initCountryDetection() {
      try {
        // Check session cache first to prevent repeated network queries
        const cached = sessionStorage.getItem('ath_analytics_geo');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.country) {
            this.country = parsed.country;
            this.countryCode = parsed.countryCode || 'XX';
            return;
          }
        }

        // Fetch asynchronously with timeout so it never stalls page execution
        if (typeof fetch === 'function') {
          const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
          const timeoutId = controller ? setTimeout(() => controller.abort(), 2500) : null;

          fetch('https://ipapi.co/json/', {
            signal: controller ? controller.signal : undefined
          })
            .then((res) => {
              if (timeoutId) clearTimeout(timeoutId);
              if (!res.ok) throw new Error('Geo HTTP error ' + res.status);
              return res.json();
            })
            .then((data) => {
              if (data && data.country_name) {
                this.country = data.country_name;
                this.countryCode = data.country_code || 'XX';
                try {
                  sessionStorage.setItem('ath_analytics_geo', JSON.stringify({
                    country: this.country,
                    countryCode: this.countryCode
                  }));
                } catch (err) {
                  // Ignore storage write issues
                }
              }
            })
            .catch(() => {
              // Silently fallback to Unknown
              if (timeoutId) clearTimeout(timeoutId);
            });
        }
      } catch (err) {
        // Fail quietly
      }
    },

    /**
     * Initialize the tracker
     */
    init() {
      if (this.initialized) return;

      try {
        // 1. Session ID (session-scoped)
        let sId = sessionStorage.getItem('ath_session_id');
        if (!sId) {
          sId = this.generateId('sess');
          try { sessionStorage.setItem('ath_session_id', sId); } catch (e) {}
        }
        this.sessionId = sId;

        // 2. Visitor ID (persistent across sessions)
        let vId = localStorage.getItem('ath_visitor_id');
        if (!vId) {
          vId = this.generateId('vis');
          try { localStorage.setItem('ath_visitor_id', vId); } catch (e) {}
        }
        this.visitorId = vId;

        // 3. Device detection
        this.deviceType = this.detectDevice();

        // 4. Country detection (asynchronous, non-blocking)
        this.initCountryDetection();

        // 5. Intersection Observer for Opportunity Card impressions
        this.initIntersectionObserver();

        // 6. Global event delegation for clicks
        this.bindClickTracking();

        this.initialized = true;
      } catch (e) {
        console.warn('ATH Analytics initialization deferred:', e);
      }
    },

    /**
     * Primary event recording method
     */
    track(eventType, payload = {}) {
      try {
        if (!this.initialized) this.init();

        const oppId = payload.opportunityId || null;
        let oppTitle = payload.opportunityTitle || null;

        // Look up title from DataStore if oppId is provided but title is missing
        if (oppId && !oppTitle && window.DataStore && typeof window.DataStore.getOpportunities === 'function') {
          const found = window.DataStore.getOpportunities(true).find((o) => o.id === oppId);
          if (found) oppTitle = found.title;
        }

        const event = {
          id: this.generateId('evt'),
          event_type: eventType,
          opportunity_id: oppId,
          opportunity_title: oppTitle,
          page_path: payload.pagePath || window.location.hash || '#home',
          session_id: this.sessionId || 'sess_unknown',
          visitor_id: this.visitorId || 'vis_unknown',
          country: this.country || 'Unknown',
          country_code: this.countryCode || 'XX',
          referrer: this.getSanitizedReferrer(),
          device_type: this.deviceType || 'Desktop',
          created_at: new Date().toISOString()
        };

        // Deliver event to DataStore backend
        if (window.DataStore && typeof window.DataStore.addAnalyticsEvent === 'function') {
          window.DataStore.addAnalyticsEvent(event);
        }
      } catch (err) {
        // Analytics failure must NEVER break website operation
        console.warn('ATH Analytics tracking notice:', err);
      }
    },

    /**
     * Track page view with path deduplication
     */
    trackPageView(pagePath) {
      const now = Date.now();
      const cleanPath = pagePath || window.location.hash || '#home';

      // Avoid double-firing identical route within 1 second
      if (this._lastPageTracked === cleanPath && (now - this._lastPageTrackTime) < 1000) {
        return;
      }

      this._lastPageTracked = cleanPath;
      this._lastPageTrackTime = now;

      this.track('page_view', { pagePath: cleanPath });
    },

    /**
     * Track opportunity impression (card entering user viewport)
     * Deduplicates per session so scrolling back and forth doesn't spam counts
     */
    trackOpportunityImpression(oppId, oppTitle) {
      if (!oppId) return;
      if (this._observedImpressions.has(oppId)) return;

      this._observedImpressions.add(oppId);
      this.track('opportunity_impression', {
        opportunityId: oppId,
        opportunityTitle: oppTitle
      });
    },

    /**
     * Track opportunity card click
     */
    trackOpportunityClick(oppId, oppTitle) {
      if (!oppId) return;
      this.track('opportunity_click', {
        opportunityId: oppId,
        opportunityTitle: oppTitle
      });
    },

    /**
     * Track opportunity view (full post detail page viewed)
     */
    trackOpportunityView(oppId, oppTitle) {
      if (!oppId) return;
      this.track('opportunity_view', {
        opportunityId: oppId,
        opportunityTitle: oppTitle,
        pagePath: `#opportunities/${encodeURIComponent(oppId)}`
      });
    },

    /**
     * Track apply button click with 600ms debounce
     */
    trackApplyClick(oppId, oppTitle) {
      const now = Date.now();
      if (now - this._lastApplyClickTime < 600) return;
      this._lastApplyClickTime = now;

      this.track('apply_click', {
        opportunityId: oppId,
        opportunityTitle: oppTitle
      });
    },

    /**
     * Set up IntersectionObserver for opportunity cards
     */
    initIntersectionObserver() {
      if (typeof IntersectionObserver === 'undefined') return;

      try {
        if (this._intersectionObserver) {
          this._intersectionObserver.disconnect();
        }

        this._intersectionObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const target = entry.target;
                const oppId = target.getAttribute('data-opp-id') || target.getAttribute('data-id');
                const oppTitle = target.getAttribute('data-opp-title');

                if (oppId) {
                  this.trackOpportunityImpression(oppId, oppTitle);
                  // Unobserve once recorded for this card
                  this._intersectionObserver.unobserve(target);
                }
              }
            });
          },
          {
            root: null,
            rootMargin: '0px',
            threshold: 0.25 // Trigger when 25% of card is in view
          }
        );
      } catch (e) {
        console.warn('IntersectionObserver unavailable:', e);
      }
    },

    /**
     * Observe all opportunity cards currently in the DOM
     */
    observeCardImpressions(container) {
      if (!this._intersectionObserver) this.initIntersectionObserver();
      if (!this._intersectionObserver) return;

      try {
        const root = container || document;
        const cards = root.querySelectorAll('[data-opp-id], .opportunity-card, .compact-opp-card');
        cards.forEach((card) => {
          const oppId = card.getAttribute('data-opp-id') || card.getAttribute('data-id');
          if (oppId && !this._observedImpressions.has(oppId)) {
            this._intersectionObserver.observe(card);
          }
        });
      } catch (e) {
        // Fail quietly
      }
    },

    /**
     * Global click delegation for clicks on opportunity items and apply buttons
     */
    bindClickTracking() {
      document.addEventListener('click', (e) => {
        try {
          // 1. Check for Apply button clicks
          const applyBtn = e.target.closest('[data-analytics="apply-click"], .btn-apply-cta, .btn-apply-now, .btn-apply-now-split');
          if (applyBtn) {
            const oppId = applyBtn.getAttribute('data-opp-id') || (window.App && window.App.state && window.App.state.currentPostId);
            if (oppId) {
              this.trackApplyClick(oppId);
              return;
            }
          }

          // 2. Check for Opportunity Card link clicks
          const oppLink = e.target.closest('[data-analytics="opportunity-click"], .opportunity-card a, .compact-opp-card');
          if (oppLink) {
            // Find parent card with opp-id
            const card = oppLink.closest('[data-opp-id], .opportunity-card, .compact-opp-card');
            const oppId = oppLink.getAttribute('data-opp-id') || (card && (card.getAttribute('data-opp-id') || card.getAttribute('data-id')));
            if (oppId) {
              this.trackOpportunityClick(oppId);
            }
          }
        } catch (err) {
          // Ignore
        }
      }, { passive: true });
    }
  };

  // Expose globally
  window.ATHAnalytics = ATHAnalytics;
  window.Analytics = ATHAnalytics;

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ATHAnalytics.init());
  } else {
    ATHAnalytics.init();
  }
})();
