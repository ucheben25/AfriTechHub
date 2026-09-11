/**
 * scripts/generate-seo.js
 * 
 * Generates:
 * 1. Root sitemap.xml (valid XML, standard sitemaps.org 0.9 schema, strict canonical URLs for https://afritechhub.xyz)
 * 2. Root robots.txt (clean directives, disallowed admin/dashboard, points to sitemap)
 * 3. Static pre-rendered HTML for /opportunities/index.html
 * 4. Static pre-rendered HTML for /opportunities/[slug]/index.html for every published opportunity
 * 
 * Ensures Googlebot, Bingbot, and social media scrapers get 100% crawlable, complete HTML with metadata, Open Graph, and JSON-LD even if JavaScript is disabled.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');

// Load DataStore from data.js
const dataCode = fs.readFileSync(path.join(ROOT_DIR, 'data.js'), 'utf8');
const sandbox = {
  localStorage: {
    getItem: () => null,
    setItem: () => null
  },
  console: console
};
vm.createContext(sandbox);
const { DataStore, DEFAULT_OPPORTUNITIES, CATEGORY_IMAGES } = vm.runInContext(dataCode + '\n;({ DataStore, DEFAULT_OPPORTUNITIES, CATEGORY_IMAGES });', sandbox);

console.log('--- Generating SEO Assets for Afri Tech Hub ---');

// 1. Generate sitemap.xml
const sitemapXml = DataStore.generateSitemapXml();
const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
console.log(`[OK] Generated root sitemap.xml (${sitemapXml.split('<url>').length - 1} indexed URLs)`);

// 2. Generate robots.txt
const domain = DataStore.SITE_CONFIG.domain || 'https://afritechhub.xyz';
const robotsTxt = `# robots.txt for Afri Tech Hub
User-agent: *
Allow: /
Allow: /opportunities/
Allow: /about
Allow: /faq
Allow: /contact
Allow: /privacy
Allow: /terms

# Disallow administrative control panels and internal authentication endpoints
Disallow: /admin
Disallow: /dashboard
Disallow: /#admin-login
Disallow: /#admin-dashboard

# Dynamic XML Sitemap location
Sitemap: ${domain}/sitemap.xml
`;
const robotsPath = path.join(ROOT_DIR, 'robots.txt');
fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
console.log(`[OK] Generated root robots.txt`);

// 3. Helper to build pre-rendered opportunity HTML
function renderStaticOpportunityPage(opp) {
  const seo = DataStore.getSEOMetadata(opp);
  const catKey = opp.category ? opp.category.toLowerCase() : 'jobs';
  const fallbackImg = CATEGORY_IMAGES[catKey] || CATEGORY_IMAGES['jobs'];
  const heroImage = opp.image || fallbackImg;
  const canonicalUrl = seo.canonical;
  const jsonLd = JSON.stringify(seo.structuredData, null, 2);

  const requirementsList = (opp.requirements || [])
    .map(req => `<li><i class="fa-solid fa-circle-check req-check"></i> <span>${escapeHtml(req)}</span></li>`)
    .join('\n');

  const benefitsList = (opp.benefits || [])
    .map(ben => `<li><i class="fa-solid fa-star ben-star"></i> <span>${escapeHtml(ben)}</span></li>`)
    .join('\n');

  const skillsBadges = (opp.skills || [])
    .map(s => `<span class="badge-skill">${escapeHtml(s)}</span>`)
    .join(' ');

  const hasApplyUrl = opp.applyUrl && opp.applyUrl.trim() !== '' && opp.applyUrl !== '#';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(seo.title)}</title>
  <meta name="description" content="${escapeHtml(seo.description)}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

  <!-- Canonical URL -->
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph Metadata -->
  <meta property="og:site_name" content="Afri Tech Hub" />
  <meta property="og:title" content="${escapeHtml(seo.title)}" />
  <meta property="og:description" content="${escapeHtml(seo.description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${seo.image}" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter / X Card Metadata -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@afritechhub" />
  <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
  <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
  <meta name="twitter:image" content="${seo.image}" />

  <!-- Schema.org JSON-LD Structured Data -->
  <script type="application/ld+json">
${jsonLd}
  </script>

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/img/logo.png" />

  <!-- FontAwesome -->
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />

  <!-- Stylesheet -->
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <a href="#post-content" class="skip-link">Skip to content</a>

  <header class="site-header" role="banner">
    <div class="container header-main">
      <a href="/index.html#home" class="brand" id="nav-brand">
        <img src="/img/logo.png" alt="Afri Tech Hub Logo" class="brand-logo-img" loading="lazy" width="36" height="36" />
        <div class="brand-text-container">
          <span class="brand-name">Afri Tech Hub</span>
          <span class="brand-tagline">Empowering African Innovators</span>
        </div>
      </a>
      <nav class="nav-menu" role="navigation" aria-label="Main Navigation">
        <a href="/index.html#home" class="nav-link">Home</a>
        <a href="/opportunities/" class="nav-link active" aria-current="page">Opportunities</a>
        <a href="/index.html#faq" class="nav-link">FAQs</a>
        <a href="/index.html#about" class="nav-link">About</a>
        <a href="/index.html#contact" class="nav-link">Contact</a>
      </nav>
    </div>
  </header>

  <main id="post-content" role="main" tabindex="-1">
    <section class="section post-detail-section">
      <div class="container">
        <!-- Breadcrumb Navigation -->
        <div class="post-detail-top-nav">
          <nav class="post-breadcrumb" aria-label="Breadcrumb">
            <a href="/opportunities/" class="breadcrumb-back-btn">
              <i class="fa-solid fa-arrow-left"></i> Back to Directory
            </a>
            <span class="breadcrumb-sep"><i class="fa-solid fa-chevron-right"></i></span>
            <a href="/opportunities/" class="breadcrumb-link">Opportunities</a>
            <span class="breadcrumb-sep"><i class="fa-solid fa-chevron-right"></i></span>
            <span class="breadcrumb-current cat-${opp.category.toLowerCase().replace(/[^a-z0-9]/g, '')}">${escapeHtml(opp.category)}</span>
          </nav>
        </div>

        <!-- 1. Post Header & Title -->
        <div class="post-detail-header">
          <div class="post-header-badges">
            <span class="category-badge cat-${opp.category.toLowerCase().replace(/[^a-z0-9]/g, '')}">${escapeHtml(opp.category)}</span>
            ${opp.remote ? `<span class="badge-status draft"><i class="fa-solid fa-laptop-code"></i> ${escapeHtml(opp.remote)}</span>` : ''}
            ${opp.experienceLevel ? `<span class="badge-status published"><i class="fa-solid fa-user-graduate"></i> ${escapeHtml(opp.experienceLevel)}</span>` : ''}
          </div>
          <h1 class="post-main-title">${escapeHtml(opp.title)}</h1>
          <div class="post-meta-row">
            <span class="post-meta-item"><i class="fa-solid fa-building"></i> <strong>${escapeHtml(opp.company)}</strong></span>
            <span class="post-meta-sep">•</span>
            <span class="post-meta-item"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(opp.location)}</span>
            <span class="post-meta-sep">•</span>
            <span class="post-meta-item"><i class="fa-solid fa-calendar-plus"></i> Posted ${escapeHtml(opp.date)}</span>
            <span class="post-meta-sep">•</span>
            <span class="post-meta-item deadline-urgent"><i class="fa-solid fa-hourglass-half"></i> Deadline: <strong>${escapeHtml(opp.deadline)}</strong></span>
          </div>
        </div>

        <!-- 2. Landscape Post Image (Strict 16:9 Aspect Ratio, Responsive, Object-fit Cover) -->
        <div class="post-detail-hero-image-wrap" id="hero-image-container">
          <img 
            src="${heroImage}" 
            alt="${escapeHtml(opp.title)}" 
            class="post-detail-hero-img" 
            loading="eager" 
          />
          <div class="hero-image-badge-pill">
            <i class="fa-solid fa-shield-halved"></i> Official Opportunity
          </div>
        </div>

        <!-- 3. Key Details Bar -->
        <div class="post-key-details-bar">
          <div class="key-detail-cell">
            <span class="key-detail-label">Application Deadline</span>
            <span class="key-detail-val" style="color:var(--color-primary);"><i class="fa-solid fa-clock"></i> ${escapeHtml(opp.deadline)}</span>
          </div>
          <div class="key-detail-cell">
            <span class="key-detail-label">Location / Mode</span>
            <span class="key-detail-val"><i class="fa-solid fa-globe"></i> ${escapeHtml(opp.location)}</span>
          </div>
          <div class="key-detail-cell">
            <span class="key-detail-label">Category</span>
            <span class="key-detail-val"><i class="fa-solid fa-tag"></i> ${escapeHtml(opp.category)}</span>
          </div>
          <div class="key-detail-cell">
            <span class="key-detail-label">Provider / Organization</span>
            <span class="key-detail-val"><i class="fa-solid fa-landmark"></i> ${escapeHtml(opp.company)}</span>
          </div>
        </div>

        <!-- 4. Main Two-Column Layout -->
        <div class="post-detail-layout">
          <article class="post-main-content">
            <div class="post-content-card">
              <h2 class="post-section-heading"><i class="fa-solid fa-circle-info"></i> Opportunity Overview</h2>
              <div class="post-prose-body">
                <p>${escapeHtml(opp.description || opp.shortDescription || '')}</p>
              </div>

              ${requirementsList ? `
                <h2 class="post-section-heading" style="margin-top:36px;"><i class="fa-solid fa-list-check"></i> Eligibility &amp; Requirements</h2>
                <ul class="post-checklist">
                  ${requirementsList}
                </ul>
              ` : ''}

              ${benefitsList ? `
                <h2 class="post-section-heading" style="margin-top:36px;"><i class="fa-solid fa-gift"></i> Program Benefits &amp; Coverage</h2>
                <ul class="post-checklist benefits-list">
                  ${benefitsList}
                </ul>
              ` : ''}

              ${skillsBadges ? `
                <h2 class="post-section-heading" style="margin-top:36px;"><i class="fa-solid fa-code"></i> Relevant Fields &amp; Competencies</h2>
                <div class="post-skills-wrap">
                  ${skillsBadges}
                </div>
              ` : ''}
            </div>
          </article>

          <!-- Sidebar Sticky Card -->
          <aside class="post-sidebar">
            <div class="post-apply-box-sidebar">
              <h3>Apply for this Opportunity</h3>
              <p class="apply-box-subtitle">Verified listing on Afri Tech Hub. Applications are processed on the official portal.</p>
              
              <div class="apply-deadline-countdown">
                <span class="countdown-label"><i class="fa-solid fa-calendar-check"></i> Application Deadline:</span>
                <span class="countdown-value">${escapeHtml(opp.deadline)}</span>
              </div>

              <div class="apply-cta-group">
                ${hasApplyUrl ? `
                  <a href="${opp.applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block btn-apply-hero">
                    Apply on Official Portal <i class="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                ` : `
                  <button class="btn btn-secondary btn-block" disabled>Application Closed</button>
                `}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="brand footer-brand">
            <img src="/img/logo.png" alt="Afri Tech Hub Logo" class="brand-logo-img" loading="lazy" width="30" height="30" />
            <div class="brand-text-container">
              <span class="brand-name">Afri Tech Hub</span>
              <span class="brand-tagline">Empowering African Innovators</span>
            </div>
          </div>
          <p class="footer-desc">Empowering African innovators, graduates, and entrepreneurs by providing direct, open access to verified career, academic, and financial opportunities.</p>
        </div>
        <div class="footer-col">
          <h3 class="footer-heading">Platform</h3>
          <ul class="footer-links">
            <li><a href="/index.html#home" class="footer-link">Home</a></li>
            <li><a href="/opportunities/" class="footer-link">Opportunities</a></li>
            <li><a href="/index.html#about" class="footer-link">About Us</a></li>
            <li><a href="/index.html#faq" class="footer-link">FAQs</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Afri Tech Hub. All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

function renderStaticDirectoryPage(opps) {
  const published = opps.filter(o => o.status === 'published' || !o.status);
  const cardsHtml = published.map(opp => {
    const catKey = opp.category ? opp.category.toLowerCase() : 'jobs';
    const fallbackImg = CATEGORY_IMAGES[catKey] || CATEGORY_IMAGES['jobs'];
    const heroImage = opp.image || fallbackImg;
    const hasApplyUrl = opp.applyUrl && opp.applyUrl.trim() !== '' && opp.applyUrl !== '#';

    return `
      <article class="opportunity-card animate-fade-in-up">
        <div class="card-image-container">
          <a href="/opportunities/${opp.id}" aria-label="View details for ${escapeHtml(opp.title)}">
            <img src="${heroImage}" alt="${escapeHtml(opp.company)} Cover" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImg}';">
          </a>
          <span class="category-badge cat-${opp.category.toLowerCase().replace(/[^a-z0-9]/g, '')}">${escapeHtml(opp.category)}</span>
          ${opp.remote ? `<span class="remote-badge">${escapeHtml(opp.remote)}</span>` : ''}
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span class="company-name"><i class="fa-solid fa-building"></i> ${escapeHtml(opp.company)}</span>
            <span class="location"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(opp.location)}</span>
          </div>
          <h3 class="card-title"><a href="/opportunities/${opp.id}">${escapeHtml(opp.title)}</a></h3>
          <p class="card-desc">${escapeHtml(opp.shortDescription || opp.description || '')}</p>
        </div>
        <div class="card-footer">
          <span class="deadline-timer"><i class="fa-solid fa-clock-rotate-left"></i> ${escapeHtml(opp.deadline)}</span>
          <div class="card-actions">
            <a href="/opportunities/${opp.id}" class="btn btn-secondary btn-sm">Details</a>
            ${hasApplyUrl ? `<a href="${opp.applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Apply <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : `<button class="btn btn-secondary btn-sm" disabled>Closed</button>`}
          </div>
        </div>
      </article>
    `;
  }).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Opportunities for African Talent | Afri Tech Hub</title>
  <meta name="description" content="Browse verified tech jobs, startup grants, graduate fellowships, and academic scholarships tailored for African innovators." />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <link rel="canonical" href="https://afritechhub.xyz/opportunities/" />
  <meta property="og:title" content="Opportunities for African Talent | Afri Tech Hub" />
  <meta property="og:description" content="Browse verified tech jobs, startup grants, graduate fellowships, and academic scholarships tailored for African innovators." />
  <meta property="og:url" content="https://afritechhub.xyz/opportunities/" />
  <meta property="og:image" content="https://afritechhub.xyz/img/logo.png" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</head>
<body>
  <header class="site-header">
    <div class="container header-main">
      <a href="/index.html#home" class="brand">
        <img src="/img/logo.png" alt="Afri Tech Hub Logo" class="brand-logo-img" width="36" height="36" />
        <div class="brand-text-container">
          <span class="brand-name">Afri Tech Hub</span>
          <span class="brand-tagline">Empowering African Innovators</span>
        </div>
      </a>
      <nav class="nav-menu">
        <a href="/index.html#home" class="nav-link">Home</a>
        <a href="/opportunities/" class="nav-link active" aria-current="page">Opportunities</a>
        <a href="/index.html#faq" class="nav-link">FAQs</a>
        <a href="/index.html#about" class="nav-link">About</a>
        <a href="/index.html#contact" class="nav-link">Contact</a>
      </nav>
    </div>
  </header>

  <main class="section">
    <div class="container">
      <div class="section-header text-center">
        <h1>Opportunities</h1>
        <p>Explore curated career, academic, and business growth pathways across Africa</p>
      </div>

      <div class="opportunities-grid" style="margin-top: 32px;">
        ${cardsHtml}
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2026 Afri Tech Hub. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 4. Pre-render opportunities directory index: /opportunities/index.html
const oppsDir = path.join(ROOT_DIR, 'opportunities');
if (!fs.existsSync(oppsDir)) {
  fs.mkdirSync(oppsDir, { recursive: true });
}
const dirHtml = renderStaticDirectoryPage(DEFAULT_OPPORTUNITIES);
fs.writeFileSync(path.join(oppsDir, 'index.html'), dirHtml, 'utf8');
console.log(`[OK] Generated static pre-rendered /opportunities/index.html`);

// 5. Pre-render each published opportunity: /opportunities/[slug]/index.html
const publishedOpps = DEFAULT_OPPORTUNITIES.filter(o => o.status === 'published' || !o.status);
publishedOpps.forEach(opp => {
  const postDir = path.join(oppsDir, opp.id);
  if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
  }
  const postHtml = renderStaticOpportunityPage(opp);
  fs.writeFileSync(path.join(postDir, 'index.html'), postHtml, 'utf8');
  console.log(`[OK] Pre-rendered static page: /opportunities/${opp.id}/index.html`);
});

console.log(`\n=== SEO Generation Completed Successfully (${publishedOpps.length} opportunities pre-rendered) ===`);
