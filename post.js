// post.js - Loads opportunity data and renders a dedicated article view on post.html

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  const main = document.getElementById('post-content');
  if (!main) return;

  if (!postId) {
    main.innerHTML = `
      <section class="section">
        <div class="container text-center" style="padding: 80px 24px;">
          <div class="error-404-box" style="max-width: 540px; margin: 0 auto; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--border-radius-lg); padding: 48px 24px; box-shadow: var(--shadow-md);">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 56px; color: var(--color-accent); margin-bottom: 20px;"></i>
            <h2 style="font-size: 26px; margin-bottom: 12px; color: var(--text-primary);">No Opportunity Specified</h2>
            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">Please select an opportunity from the directory to view its details.</p>
            <a href="index.html#opportunities" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i> Browse Opportunities Directory</a>
          </div>
        </div>
      </section>
    `;
    return;
  }

  // Check for slug redirection (e.g. if an administrator updated the title & slug)
  const redirectSlug = DataStore.getRedirect ? DataStore.getRedirect(postId) : null;
  if (redirectSlug && redirectSlug !== postId) {
    window.location.replace(`post.html?id=${encodeURIComponent(redirectSlug)}`);
    return;
  }

  // Retrieve the opportunity data from DataStore (single source of truth)
  const opp = DataStore.getOpportunities(true).find(o => o.id === postId);

  // If missing or unpublished draft accessed without admin session, show 404 with noindex
  const isAdmin = sessionStorage.getItem("ath_admin_logged_in") === "true";
  const isPublished = opp && (opp.status === 'published' || !opp.status);

  if (!opp || (!isPublished && !isAdmin)) {
    document.title = "Opportunity Not Found | Afri Tech Hub";
    const robotsMeta = document.querySelector('meta[name="robots"]');
    if (robotsMeta) robotsMeta.setAttribute("content", "noindex, nofollow");

    main.innerHTML = `
      <section class="section">
        <div class="container text-center" style="padding: 80px 24px;">
          <div class="error-404-box" style="max-width: 540px; margin: 0 auto; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--border-radius-lg); padding: 48px 24px; box-shadow: var(--shadow-md);">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 56px; color: var(--color-accent); margin-bottom: 20px;"></i>
            <h2 style="font-size: 26px; margin-bottom: 12px; color: var(--text-primary);">Opportunity Not Found</h2>
            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">This posting may have expired, been archived, or removed from the directory.</p>
            <a href="index.html#opportunities" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i> Back to Opportunities Directory</a>
          </div>
        </div>
      </section>
    `;
    return;
  }

  // Synchronize SEO metadata for crawlers and social share previews
  const seo = DataStore.getSEOMetadata(opp);
  if (seo) {
    document.title = seo.title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", seo.description);

    const canonicalLink = document.getElementById("post-canonical") || document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.setAttribute("href", seo.canonical);

    const setMeta = (id, selector, attr, val) => {
      const el = (id ? document.getElementById(id) : null) || document.querySelector(selector);
      if (el) el.setAttribute(attr, val);
    };

    setMeta("post-og-title", 'meta[property="og:title"]', "content", seo.title);
    setMeta("post-og-desc", 'meta[property="og:description"]', "content", seo.description);
    setMeta("post-og-url", 'meta[property="og:url"]', "content", seo.canonical);
    setMeta("post-og-image", 'meta[property="og:image"]', "content", seo.image);

    setMeta("post-twitter-title", 'meta[name="twitter:title"]', "content", seo.title);
    setMeta("post-twitter-desc", 'meta[name="twitter:description"]', "content", seo.description);
    setMeta("post-twitter-image", 'meta[name="twitter:image"]', "content", seo.image);

    // Schema.org JSON-LD Structured Data
    const schemaScript = document.getElementById("post-structured-data");
    if (schemaScript) {
      schemaScript.textContent = JSON.stringify(seo.structuredData, null, 2);
    }
  }

  const catKey = opp.category ? opp.category.toLowerCase() : "jobs";
  const fallbackImage = CATEGORY_IMAGES[catKey] || CATEGORY_IMAGES["jobs"];
  const formattedDeadline = opp.deadline === "Rolling" ? "Rolling" : opp.deadline;

  const requirementsList = (opp.requirements || [])
    .map(req => `<li><i class="fa-solid fa-circle-check req-check"></i> <span>${req}</span></li>`)
    .join('');

  const benefitsList = (opp.benefits || [])
    .map(ben => `<li><i class="fa-solid fa-star ben-star"></i> <span>${ben}</span></li>`)
    .join('');

  const skillsBadges = opp.skills && opp.skills.length
    ? opp.skills.map(s => `<span class="badge-skill">${s}</span>`).join('')
    : '';

  const isUrgent = opp.deadline && opp.deadline.toLowerCase().includes('rolling') === false && !opp.deadline.toLowerCase().includes('open');

  // Related Opportunities using DataStore similarity algorithm
  const relatedList = DataStore.getRelatedOpportunities(opp.id, 3);
  const relatedGrid = relatedList.length
    ? relatedList.map(o => `
        <article class="opportunity-card animate-fade-in-up">
          <div class="card-image-container">
            <a href="post.html?id=${o.id}" aria-label="View details for ${o.title}">
              <img src="${o.image || fallbackImage}" alt="${o.company} Cover" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImage}';">
            </a>
            <span class="category-badge cat-${o.category.toLowerCase().replace(/[^a-z0-9]/g, "")}">${o.category}</span>
            ${o.remote ? `<span class="remote-badge">${o.remote}</span>` : ""}
          </div>
          <div class="card-body">
            <div class="card-meta">
              <span class="company-name"><i class="fa-solid fa-building"></i> ${o.company}</span>
              <span class="location"><i class="fa-solid fa-location-dot"></i> ${o.location}</span>
            </div>
            <h3 class="card-title"><a href="post.html?id=${o.id}">${o.title}</a></h3>
            <p class="card-desc">${o.shortDescription || o.description || ""}</p>
          </div>
          <div class="card-footer">
            <span class="deadline-timer"><i class="fa-solid fa-clock-rotate-left"></i> ${o.deadline}</span>
            <div class="card-actions">
              <a href="post.html?id=${o.id}" class="btn btn-secondary btn-sm">Details</a>
              ${o.applyUrl && o.applyUrl.trim() !== "" ? `<a href="${o.applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Apply <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : `<button class="btn btn-secondary btn-sm" disabled>Closed</button>`}
            </div>
          </div>
        </article>
      `).join('')
    : '';

  const hasApplyUrl = opp.applyUrl && opp.applyUrl.trim() !== "" && opp.applyUrl !== "#";
  const postHeroImage = opp.image || fallbackImage;

  main.innerHTML = `
    <section class="section post-detail-section">
      <div class="container">
        <!-- Breadcrumb Navigation -->
        <div class="post-detail-top-nav">
          <nav class="post-breadcrumb" aria-label="Breadcrumb">
            <a href="index.html#opportunities" class="breadcrumb-back-btn">
              <i class="fa-solid fa-arrow-left"></i> Back to Directory
            </a>
            <span class="breadcrumb-sep"><i class="fa-solid fa-chevron-right"></i></span>
            <a href="index.html#opportunities" class="breadcrumb-link">Opportunities</a>
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
                    <a href="${opp.applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-apply-cta">
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
                <a href="${opp.applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-apply-now">
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

  // Copy link action listener
  const copyBtn = document.getElementById('share-copy-link');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => console.error('Could not copy link'));
    });
  }

  // Image Lightbox Modal logic
  const lightboxModal = document.getElementById('post-image-lightbox');
  const expandTrigger = document.getElementById('hero-img-expand-trigger');
  const mainHeroImg = document.getElementById('hero-main-img');
  const lightboxClose = document.getElementById('lightbox-close-trigger');

  const openLightbox = () => {
    if (lightboxModal) lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (lightboxModal) lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (expandTrigger) expandTrigger.addEventListener('click', openLightbox);
  if (mainHeroImg) mainHeroImg.addEventListener('click', openLightbox);
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
});
