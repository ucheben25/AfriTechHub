// post.js - Handles loading and editing of opportunity details on post.html

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  if (!postId) {
    console.error('No post ID provided in URL');
    return;
  }

  // Load opportunity data
  const opp = DataStore.getOpportunities(true).find(o => o.id === postId);
  if (!opp) {
    console.error('Opportunity not found for ID:', postId);
    return;
  }

  const main = document.getElementById('post-content');
  if (!main) return;

  // Build editable form
  const form = document.createElement('div');
  form.className = 'post-detail';

  const fields = [
    { label: 'Title', key: 'title', type: 'input' },
    { label: 'Company', key: 'company', type: 'input' },
    { label: 'Location', key: 'location', type: 'input' },
    { label: 'Category', key: 'category', type: 'input' },
    { label: 'Short Description', key: 'shortDescription', type: 'textarea' },
    { label: 'Full Description', key: 'description', type: 'textarea' },
    { label: 'Application Link', key: 'applyUrl', type: 'input' }
  ];

  fields.forEach(f => {
    const wrapper = document.createElement('div');
    wrapper.className = 'post-field';
    const label = document.createElement('label');
    label.textContent = f.label;
    label.htmlFor = `post-${f.key}`;
    let control;
    if (f.type === 'textarea') {
      control = document.createElement('textarea');
    } else {
      control = document.createElement('input');
      control.type = 'text';
    }
    control.id = `post-${f.key}`;
    control.value = opp[f.key] || '';
    // Auto‑save on every change
    control.addEventListener('input', () => {
      opp[f.key] = control.value;
      DataStore.saveOpportunity(opp);
      showToast('Changes saved');
    });
    wrapper.appendChild(label);
    wrapper.appendChild(control);
    form.appendChild(wrapper);
  });

  main.appendChild(form);
});

function showToast(message) {
  const toast = document.getElementById('toast-alert');
  const msg = document.getElementById('toast-message');
  if (!toast || !msg) return;
  msg.textContent = message;
  toast.setAttribute('aria-hidden', 'false');
  toast.classList.add('show');
  setTimeout(() => {
    toast.setAttribute('aria-hidden', 'true');
    toast.classList.remove('show');
  }, 2000);
}
