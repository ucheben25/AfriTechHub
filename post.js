// post.js - Loads opportunity data and renders a static article view on post.html

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  if (!postId) {
    console.error('No post ID provided in URL');
    return;
  }

  // Retrieve the opportunity data
  const opp = DataStore.getOpportunities(true).find(o => o.id === postId);
  if (!opp) {
    console.error('Opportunity not found for ID:', postId);
    return;
  }

  const main = document.getElementById('post-content');
  if (!main) return;

  // Build a read‑only article layout
  const article = document.createElement('article');
  article.className = 'post-detail';

  const title = document.createElement('h1');
  title.textContent = opp.title || '';
  article.appendChild(title);

  if (opp.image) {
    const img = document.createElement('img');
    img.src = opp.image;
    img.alt = opp.title || 'Opportunity image';
    img.className = 'post-image';
    article.appendChild(img);
  }

  const metaList = document.createElement('ul');
  metaList.className = 'post-meta';
  const metaFields = [
    { label: 'Company', value: opp.company },
    { label: 'Location', value: opp.location },
    { label: 'Category', value: opp.category },
    { label: 'Deadline', value: opp.deadline }
  ];
  metaFields.forEach(item => {
    if (item.value) {
      const li = document.createElement('li');
      li.textContent = `${item.label}: ${item.value}`;
      metaList.appendChild(li);
    }
  });
  article.appendChild(metaList);

  const shortDesc = document.createElement('p');
  shortDesc.className = 'post-short';
  shortDesc.textContent = opp.shortDescription || '';
  article.appendChild(shortDesc);

  const desc = document.createElement('div');
  desc.className = 'post-description';
  // Insert raw HTML safely – description may contain line breaks and formatting
  desc.innerHTML = opp.description || '';
  article.appendChild(desc);

  if (opp.applyUrl) {
    const applyLink = document.createElement('a');
    applyLink.href = opp.applyUrl;
    applyLink.target = '_blank';
    applyLink.rel = 'noopener noreferrer';
    applyLink.textContent = 'Apply Now';
    applyLink.className = 'apply-button';
    article.appendChild(applyLink);
  }

  main.appendChild(article);
});
