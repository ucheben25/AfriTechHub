/**
 * scripts/generate-seo.js
 * 
 * Generates:
 * 1. Root sitemap.xml (valid XML, standard sitemaps.org 0.9 schema, strict canonical URLs for https://afritechhub.xyz)
 * 2. Root robots.txt (clean directives, disallowed admin/dashboard, points to sitemap)
 * 3. Static pre-rendered HTML for /opportunities/index.html
 * 4. Static pre-rendered HTML for /opportunities/[slug]/index.html for every published opportunity
 * 5. Static pre-rendered HTML for core pages:
 *    - /about/index.html and /about.html
 *    - /faq/index.html and /faq.html
 *    - /contact/index.html and /contact.html
 *    - /privacy/index.html and /privacy.html
 *    - /terms/index.html and /terms.html
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
const { DataStore, DEFAULT_OPPORTUNITIES, CATEGORY_IMAGES, FAQS } = vm.runInContext(
  dataCode + '\n;({ DataStore, DEFAULT_OPPORTUNITIES, CATEGORY_IMAGES, FAQS });',
  sandbox
);

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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getCommonHeader(activeRoute = '') {
  return `
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
        <a href="/index.html#home" class="nav-link ${activeRoute === 'home' ? 'active' : ''}">Home</a>
        <a href="/opportunities/" class="nav-link ${activeRoute === 'opportunities' ? 'active' : ''}">Opportunities</a>
        <a href="/faq" class="nav-link ${activeRoute === 'faq' ? 'active' : ''}">FAQs</a>
        <a href="/about" class="nav-link ${activeRoute === 'about' ? 'active' : ''}">About</a>
        <a href="/privacy" class="nav-link ${activeRoute === 'privacy' ? 'active' : ''}">Privacy</a>
        <a href="/contact" class="nav-link ${activeRoute === 'contact' ? 'active' : ''}">Contact</a>
      </nav>
    </div>
  </header>`;
}

function getCommonFooter() {
  return `
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
            <li><a href="/about" class="footer-link">About Us</a></li>
            <li><a href="/faq" class="footer-link">FAQs</a></li>
            <li><a href="/privacy" class="footer-link">Privacy Policy</a></li>
            <li><a href="/terms" class="footer-link">Terms of Use</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Afri Tech Hub. All rights reserved.</p>
      </div>
    </div>
  </footer>`;
}

function renderHtmlDocument({ title, description, canonical, schema, activeRoute, bodyContent }) {
  const jsonLd = schema ? JSON.stringify(schema, null, 2) : '';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta name="google-site-verification" content="_a6xSss6GFWbnr2yWSJmnMyTHjP6WxaULpO_BRwNaU8" />

  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4990240821116832"
       crossorigin="anonymous"></script>

  <!-- Canonical URL -->
  <link rel="canonical" href="${canonical}" />

  <!-- Open Graph Metadata -->
  <meta property="og:site_name" content="Afri Tech Hub" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${domain}/img/logo.png" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter / X Card Metadata -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@afritechhub" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${domain}/img/logo.png" />

  ${jsonLd ? `<!-- Schema.org JSON-LD Structured Data -->\n  <script type="application/ld+json">\n${jsonLd}\n  </script>` : ''}

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
  ${getCommonHeader(activeRoute)}
  <main id="main-content" role="main">
    ${bodyContent}
  </main>
  ${getCommonFooter()}
</body>
</html>`;
}

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
  <meta name="google-site-verification" content="_a6xSss6GFWbnr2yWSJmnMyTHjP6WxaULpO_BRwNaU8" />

  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4990240821116832"
       crossorigin="anonymous"></script>

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

  ${getCommonHeader('opportunities')}

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

  ${getCommonFooter()}
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

  return renderHtmlDocument({
    title: 'Opportunities for African Talent | Afri Tech Hub',
    description: 'Browse verified tech jobs, startup grants, graduate fellowships, and academic scholarships tailored for African innovators.',
    canonical: `${domain}/opportunities/`,
    activeRoute: 'opportunities',
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Opportunities for African Talent",
      "url": `${domain}/opportunities/`,
      "description": "Browse verified tech jobs, startup grants, graduate fellowships, and academic scholarships tailored for African innovators."
    },
    bodyContent: `
      <section class="section">
        <div class="container">
          <div class="section-header text-center">
            <h1>Opportunities</h1>
            <p>Explore curated career, academic, and business growth pathways across Africa</p>
          </div>
          <div class="opportunities-grid" style="margin-top: 32px;">
            ${cardsHtml}
          </div>
        </div>
      </section>
    `
  });
}

// 4. Render About Page
function renderStaticAboutPage() {
  return renderHtmlDocument({
    title: 'About Us | Afri Tech Hub',
    description: 'Learn how Afri Tech Hub empowers African innovators, graduates, and entrepreneurs with open-access career resources.',
    canonical: `${domain}/about`,
    activeRoute: 'about',
    schema: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Us | Afri Tech Hub",
      "url": `${domain}/about`,
      "description": "Learn how Afri Tech Hub empowers African innovators, graduates, and entrepreneurs with open-access career resources."
    },
    bodyContent: `
      <section class="page-hero-banner">
        <div class="container">
          <h1>About Afri Tech Hub</h1>
          <p>Building the largest open-access opportunity network for African technologists and innovators.</p>
        </div>
      </section>
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
                <a href="/contact" class="btn btn-outline btn-sm" style="margin-top:12px;">Send a Message</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  });
}

// 5. Render FAQ Page
function renderStaticFAQPage(faqsList) {
  const faqItemsHtml = (faqsList || []).map(faq => `
    <div class="faq-item" style="margin-bottom: 20px; background: var(--bg-card); padding: 20px; border-radius: var(--border-radius); border: 1px solid var(--border-color);">
      <h3 style="font-size: 18px; margin-bottom: 8px; color: var(--text-primary);"><i class="fa-solid fa-circle-question" style="color:var(--color-primary); margin-right:8px;"></i> ${escapeHtml(faq.question)}</h3>
      <p style="color: var(--text-secondary); line-height: 1.6;">${escapeHtml(faq.answer)}</p>
    </div>
  `).join('\n');

  const faqSchemaEntities = (faqsList || []).map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }));

  return renderHtmlDocument({
    title: 'Frequently Asked Questions | Afri Tech Hub',
    description: 'Find answers on opportunity verification, application processes, and joining the Afri Tech Hub WhatsApp community.',
    canonical: `${domain}/faq`,
    activeRoute: 'faq',
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqSchemaEntities
    },
    bodyContent: `
      <section class="page-hero-banner">
        <div class="container">
          <h1>Frequently Asked Questions</h1>
          <p>Common questions about using the platform, submitting opportunities, and our verification process.</p>
        </div>
      </section>
      <section class="section">
        <div class="container container-narrow">
          <div class="faq-list">
            ${faqItemsHtml}
          </div>
        </div>
      </section>
    `
  });
}

// 6. Render Contact Page
function renderStaticContactPage() {
  return renderHtmlDocument({
    title: 'Contact Afri Tech Hub | Support & Inquiries',
    description: 'Get in touch with Afri Tech Hub to share vacancy listings, submit feedback, or partner with us.',
    canonical: `${domain}/contact`,
    activeRoute: 'contact',
    schema: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Afri Tech Hub | Support & Inquiries",
      "url": `${domain}/contact`,
      "description": "Get in touch with Afri Tech Hub to share vacancy listings, submit feedback, or partner with us."
    },
    bodyContent: `
      <section class="page-hero-banner">
        <div class="container">
          <h1>Contact Us</h1>
          <p>Have a question, partnership proposal, or found an issue? We're here to help.</p>
        </div>
      </section>
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
      <section class="section contact-main-section">
        <div class="container">
          <div class="contact-advanced-grid">
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
            <div class="contact-panel-right">
              <div class="contact-form-card">
                <h3>Direct Inquiries</h3>
                <p>For urgent opportunities, partnership proposals, or community partnerships, please contact our team via email at <a href="mailto:hubafritech@gmail.com">hubafritech@gmail.com</a> or message us directly via our verified WhatsApp community.</p>
                <div style="margin-top:24px;">
                  <a href="https://chat.whatsapp.com/Bd2MI5seG7y8HoJjbfpQrH" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-block">
                    <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp Community
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  });
}

// 7. Render Privacy Page
function renderStaticPrivacyPage() {
  return renderHtmlDocument({
    title: 'Privacy Policy | Afri Tech Hub',
    description: 'Our commitment to protecting your privacy and maintaining a transparent, open-access opportunities directory.',
    canonical: `${domain}/privacy`,
    activeRoute: 'privacy',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Privacy Policy | Afri Tech Hub",
      "url": `${domain}/privacy`,
      "description": "Our commitment to protecting your privacy and maintaining a transparent, open-access opportunities directory."
    },
    bodyContent: `
      <section class="page-hero-banner">
        <div class="container">
          <h1>Privacy Policy</h1>
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
              <p>We only receive information that you voluntarily submit to us through direct contact inquiries or newsletter subscriptions.</p>
              <h2>3. How We Use Your Information</h2>
              <p>Your information is used strictly to respond to comments, deliver newsletters, and maintain platform security. We never sell, lease, or distribute your email address to third parties.</p>
              <h2>4. Cookies &amp; First-Party Analytics</h2>
              <p>We do not use invasive third-party tracking cookies or behavioral ad pixels. We operate a lightweight, privacy-focused first-party analytics system to understand opportunity engagement without storing personal identifiers or IP addresses.</p>
              <h2>5. External Application Portals</h2>
              <p>Our service indexes external vacancies, grants, and scholarships. Clicking "Apply" redirects you to official registration portals of third parties. Please review their privacy terms before applying.</p>
              <h2>6. Contact Information</h2>
              <p>For questions about this Privacy Policy, email us at: <strong>hubafritech@gmail.com</strong></p>
            </div>
          </div>
        </div>
      </section>
    `
  });
}

// 8. Render Terms Page
function renderStaticTermsPage() {
  return renderHtmlDocument({
    title: 'Terms of Use | Afri Tech Hub',
    description: 'Terms and conditions governing open-access use of the Afri Tech Hub platform.',
    canonical: `${domain}/terms`,
    activeRoute: 'terms',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Terms of Use | Afri Tech Hub",
      "url": `${domain}/terms`,
      "description": "Terms and conditions governing open-access use of the Afri Tech Hub platform."
    },
    bodyContent: `
      <section class="page-hero-banner">
        <div class="container">
          <h1>Terms of Use</h1>
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
              <p>You may browse listings and apply. You must not attempt to breach security protocols, scrape database arrays maliciously, or submit spam messages through our contact channels.</p>
              <h3>Liability Disclaimer</h3>
              <p>While we curate and verify listings, Afri Tech Hub does not represent official sponsors or employers. We do not guarantee selection, and are not liable for any outcomes arising from external applications.</p>
              <h3>Intellectual Property</h3>
              <p>Logos and trademarks of listing organizations belong to their respective owners and are displayed for identification purposes under fair use.</p>
            </div>
          </div>
        </div>
      </section>
    `
  });
}

// Helper to write both directory index and flat html file for dual server compatibility
function writeStaticPage(routeDir, fileName, content) {
  const dirPath = path.join(ROOT_DIR, routeDir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(dirPath, 'index.html'), content, 'utf8');
  fs.writeFileSync(path.join(ROOT_DIR, fileName), content, 'utf8');
}

// 9. Pre-render opportunities directory index: /opportunities/index.html
const oppsDir = path.join(ROOT_DIR, 'opportunities');
if (!fs.existsSync(oppsDir)) {
  fs.mkdirSync(oppsDir, { recursive: true });
}
const dirHtml = renderStaticDirectoryPage(DEFAULT_OPPORTUNITIES);
fs.writeFileSync(path.join(oppsDir, 'index.html'), dirHtml, 'utf8');
console.log(`[OK] Generated static pre-rendered /opportunities/index.html`);

// 10. Pre-render each published opportunity: /opportunities/[slug]/index.html
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

// 11. Pre-render core static pages
writeStaticPage('about', 'about.html', renderStaticAboutPage());
console.log(`[OK] Generated static pre-rendered /about/index.html & /about.html`);

writeStaticPage('faq', 'faq.html', renderStaticFAQPage(FAQS));
console.log(`[OK] Generated static pre-rendered /faq/index.html & /faq.html`);

writeStaticPage('contact', 'contact.html', renderStaticContactPage());
console.log(`[OK] Generated static pre-rendered /contact/index.html & /contact.html`);

writeStaticPage('privacy', 'privacy.html', renderStaticPrivacyPage());
console.log(`[OK] Generated static pre-rendered /privacy/index.html & /privacy.html`);

writeStaticPage('terms', 'terms.html', renderStaticTermsPage());
console.log(`[OK] Generated static pre-rendered /terms/index.html & /terms.html`);

console.log(`\n=== SEO Generation Completed Successfully (${publishedOpps.length} opportunities + 5 core pages pre-rendered) ===`);
