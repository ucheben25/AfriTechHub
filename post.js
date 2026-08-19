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

  // Retrieve the opportunity data from DataStore (single source of truth)
  const opp = DataStore.getOpportunities(true).find(o => o.id === postId);
  if (!opp) {
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

  // Update browser document title
  document.title = `${opp.title} at ${opp.company} | Afri Tech Hub`;

  const catKey = opp.category ? opp.category.toLowerCase() : "jobs";
  const fallbackImage = CATEGORY_IMAGES[catKey] || CATEGORY_IMAGES["jobs"];
  const formattedDeadline = opp.deadline === "Rolling" ? "Rolling" : opp.deadline;

  const requirementsList = (opp.requirements || [])
    .map(req => `<li><i class="fa-regular fa-square-check"></i> ${req}</li>`)
    .join('');

  const benefitsList = (opp.benefits || [])
    .map(ben => `<li><i class="fa-regular fa-star"></i> ${ben}</li>`)
    .join('');

  const skillsBadges = opp.skills && opp.skills.length
    ? opp.skills.map(s => `<span class="badge-skill">${s}</span>`).join('')
    : '';

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

  main.innerHTML = `
    <section class="section post-detail-section">
      <div class="container">
        <!-- Back Link Breadcrumb -->
        <div class="post-detail-top-nav">
          <a href="index.html#opportunities" class="back-link"><i class="fa-solid fa-arrow-left"></i> Back to Directory</a>
        </div>

        <!-- 1. Opportunity Title (Prominently displayed at top) -->
        <div class="post-detail-header">
          <div class="post-header-badges">
            <span class="category-badge cat-${opp.category.toLowerCase().replace(/[^a-z0-9]/g, "")}">${opp.category}</span>
            ${opp.remote ? `<span class="badge-status draft">${opp.remote}</span>` : ""}
            ${opp.experienceLevel ? `<span class="badge-status published">${opp.experienceLevel}</span>` : ""}
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
                <p>${opp.location}</p>
              </div>
            </div>
            <div class="strip-item">
              <div class="strip-icon"><i class="fa-solid fa-calendar-days"></i></div>
              <div class="strip-info">
                <h5>Date Posted</h5>
                <p>${opp.date}</p>
              </div>
            </div>
            <div class="strip-item">
              <div class="strip-icon"><i class="fa-solid fa-clock-rotate-left"></i></div>
              <div class="strip-info">
                <h5>Deadline</h5>
                <p>${formattedDeadline}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Hero Image (Directly below title, responsive, aspect ratio preserved) -->
        <div class="post-detail-hero-image-wrap">
          <img src="${opp.image || fallbackImage}" alt="${opp.title}" class="post-detail-hero-img" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImage}';">
        </div>

        <!-- 3. Opportunity Details -->
        <div class="post-detail-grid">
          <div class="post-main-content">
            <div class="post-body-content">
              <div class="content-block">
                <h3>Opportunity Overview</h3>
                <div class="post-description-text">${opp.description ? opp.description.replace(/\n/g, '<br>') : ''}</div>
              </div>

              ${requirementsList ? `
              <div class="content-block">
                <h3>Eligibility & Requirements</h3>
                <ul class="custom-list">
                  ${requirementsList}
                </ul>
              </div>
              ` : ''}

              ${benefitsList ? `
              <div class="content-block">
                <h3>Benefits & Compensation</h3>
                <ul class="custom-list">
                  ${benefitsList}
                </ul>
              </div>
              ` : ''}

              ${skillsBadges ? `
              <div class="content-block">
                <h3>Target Skills</h3>
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
                  <h4>Ready to Apply?</h4>
                  <p>Apply directly via the provider's official portal. Access is free with zero registration.</p>
                </div>
                <div class="apply-cta-actions">
                  ${hasApplyUrl ? `
                    <a href="${opp.applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-apply-cta">
                      Apply Now <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                  ` : `
                    <button class="btn btn-secondary btn-apply-cta" disabled>
                      <i class="fa-solid fa-circle-xmark"></i> Application URL Unavailable
                    </button>
                  `}
                </div>
              </div>

              <!-- Social Share Bar -->
              <div class="post-share-bar">
                <span class="share-label">Share this opportunity:</span>
                <div class="share-icons">
                  <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(opp.title)}" target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share on X / Twitter"><i class="fa-brands fa-x-twitter"></i></a>
                  <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share on LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                  <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(opp.title + " " + window.location.href)}" target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share on WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                  <button class="share-btn" id="share-copy-link" title="Copy Link"><i class="fa-solid fa-link"></i></button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Summary -->
          <aside class="post-sidebar-sticky">
            <div class="apply-card-box">
              <h4 class="apply-card-title">Listing Summary</h4>
              <table class="summary-table">
                <tr>
                  <td><i class="fa-solid fa-building"></i> Company</td>
                  <td>${opp.company}</td>
                </tr>
                <tr>
                  <td><i class="fa-solid fa-tag"></i> Category</td>
                  <td>${opp.category}</td>
                </tr>
                <tr>
                  <td><i class="fa-solid fa-layer-group"></i> Target Level</td>
                  <td>${opp.experienceLevel || "Graduate"}</td>
                </tr>
                <tr>
                  <td><i class="fa-solid fa-house-laptop"></i> Setting</td>
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
});
