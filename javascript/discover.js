import { opportunity } from './opportunities.js';
import { getSavedOpportunityIds, toggleSavedOpportunity, getTheme, setTheme } from './storage.js';

const $ = (selector, root = document) => root.querySelector(selector);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const formatDate = value => { if (!value) return 'Not provided'; const date = new Date(`${value}T00:00:00`); return Number.isNaN(date.getTime()) ? escapeHtml(value) : date.toLocaleDateString(undefined, {year:'numeric',month:'short',day:'numeric'}); };
const container = $('.opportunities');
if (container) {
  const category = $('.category'), location = $('.location'), posted = $('.date-posted'), search = $('.discovery-search') || $('.search-input'), sort = $('.sort-by'), searchClear = $('.discovery-search-clear');
  const savedOnly = document.body.dataset.page === 'saved' || new URLSearchParams(window.location.search).get('view') === 'saved';
  if (savedOnly) { const head = $('.page-head h1'); if (head) head.textContent = 'Saved Opportunities'; const sub = $('.page-head p'); if (sub) sub.textContent = 'Your saved list stays on this browser.'; }
  const state = { category:'All', location:'All', datePosted:'All', search:'', sort:'deadline-soon' };
  function render(list) {
    const count = $('.results-count'); if (count) count.textContent = `${list.length} ${list.length === 1 ? 'opportunity' : 'opportunities'}`;
    if (!list.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">⌕</div><h2>${savedOnly ? 'No saved opportunities yet' : 'No opportunities found'}</h2><p>${savedOnly ? 'Browse opportunities and select Save to build your shortlist.' : 'Try a different search or clear one of your filters.'}</p>${savedOnly ? '<a class="view-details" href="../index.html">Explore opportunities</a>' : '<button class="clear-filters" type="button">Clear filters</button>'}</div>`;
      $('.clear-filters')?.addEventListener('click', clearFilters); return;
    }
    container.innerHTML = list.map(item => {
      const saved = getSavedOpportunityIds().includes(Number(item.id));
      const logo = /^https:\/\//i.test(item.logo || '') ? item.logo : '';
      return `<article class="opportunity-card">
        <div class="card-header">${logo ? `<img class="company-logo" src="${escapeHtml(logo)}" alt="" loading="lazy" onerror="this.hidden=true">` : `<div class="company-logo logo-fallback">${escapeHtml((item.company || '?').slice(0,1))}</div>`}<span class="company-name">${escapeHtml(item.company)}</span><button class="save-button ${saved?'is-saved':''}" data-save="${Number(item.id)}" aria-pressed="${saved}" aria-label="${saved?'Remove saved opportunity':'Save opportunity'}">${saved?'♥':'♡'}</button></div>
        <h3 class="card-title">${escapeHtml(item.title)}</h3><p class="card-subtitle">${escapeHtml(item.organization || item.company)}</p>
        <div class="card-meta"><p><span class="meta-label">📍 Location:</span> ${escapeHtml(item.location || 'Not provided')}</p><p><span class="meta-label">💼 Mode:</span> ${escapeHtml(item.mode || 'Not provided')}</p><p><span class="meta-label">⏰ Deadline:</span> ${formatDate(item.deadline)}</p></div>
        <div class="card-footer"><div class="tags"><span class="tag tag-primary">${escapeHtml(item.type)}</span>${item.field ? `<span class="tag">${escapeHtml(item.field)}</span>` : ''}</div><a class="view-details" href="pages/details.html?id=${encodeURIComponent(item.id)}">View Details</a></div>
      </article>`;
    }).join('');
    container.querySelectorAll('[data-save]').forEach(button => button.addEventListener('click', () => { toggleSavedOpportunity(button.dataset.save); refresh(); }));
  }
  function clearFilters() { state.category='All'; state.location='All'; state.datePosted='All'; state.search=''; state.sort='deadline-soon'; if(category) category.value='All'; if(location) location.value='All'; if(posted) posted.value='All'; if(search) search.value=''; if(searchClear) searchClear.hidden=true; if(sort) sort.value='deadline-soon'; document.querySelectorAll('.quick-filter').forEach(btn=>btn.classList.remove('active')); refresh(); }
  function refresh() {
    let list = [...opportunity];
    if (savedOnly) { const ids = getSavedOpportunityIds(); list = list.filter(item => ids.includes(Number(item.id))); }
    if (state.category !== 'All') list = list.filter(item => item.type?.toLowerCase() === state.category.toLowerCase());
    if (state.location !== 'All') list = list.filter(item => `${item.location} ${item.mode}`.toLowerCase().includes(state.location.toLowerCase()));
    if (state.datePosted !== 'All') { const ranges = {'Last 24 hours':1,'Last 7 days':7,'Last 30 days':30}; const days = ranges[state.datePosted]; list = list.filter(item => { const date = new Date(`${item.datePosted}T00:00:00`); return !Number.isNaN(date.getTime()) && (Date.now()-date.getTime()) >= -86400000 && (Date.now()-date.getTime()) <= days*86400000; }); }
    if (state.search.trim()) { const term = state.search.trim().toLowerCase(); list = list.filter(item => [item.company,item.title,item.organization,item.location,item.mode,item.type,item.field,item.salary,item.description].filter(Boolean).join(' ').toLowerCase().includes(term)); }
    if (state.sort === 'deadline-soon') list.sort((a,b) => (a.deadline||'9999').localeCompare(b.deadline||'9999'));
    else if (state.sort === 'deadline-late') list.sort((a,b) => (b.deadline||'').localeCompare(a.deadline||''));
    else if (state.sort === 'newest') list.sort((a,b) => (b.datePosted||'').localeCompare(a.datePosted||''));
    else if (state.sort === 'oldest') list.sort((a,b) => (a.datePosted||'').localeCompare(b.datePosted||''));
    render(list);
  }
  category?.addEventListener('change', () => { state.category=category.value; refresh(); });
  location?.addEventListener('change', () => { state.location=location.value; refresh(); });
  posted?.addEventListener('change', () => { state.datePosted=posted.value; refresh(); });
  search?.addEventListener('input', () => { state.search=search.value; if (searchClear) searchClear.hidden = !state.search; refresh(); });
  searchClear?.addEventListener('click', () => { state.search=''; if (search) search.value=''; searchClear.hidden=true; search?.focus(); refresh(); });
  sort?.addEventListener('change', () => { state.sort=sort.value; refresh(); });
  document.querySelectorAll('.quick-filter').forEach(button => button.addEventListener('click', () => {
    const active = button.classList.contains('active'); document.querySelectorAll('.quick-filter').forEach(btn=>btn.classList.remove('active'));
    if (active) { clearFilters(); return; }
    button.classList.add('active'); state.category='All'; state.location='All'; state.datePosted='All'; state.search=''; if(search) search.value='';
    if (button.dataset.filter === 'category') { state.category=button.dataset.value; if(category) category.value=state.category; }
    else if (button.dataset.filter === 'location') { state.location=button.dataset.value; if(location) location.value=state.location; }
    else { state.search=button.dataset.value || ''; if(search) search.value=state.search; if(searchClear) searchClear.hidden=!state.search; }
    refresh();
  }));
  const themeButton = $('.theme-toggle');
  const applyTheme = theme => { document.documentElement.dataset.theme=theme; if(themeButton) themeButton.textContent=theme==='dark'?'☀':'☾'; };
  applyTheme(getTheme());
  themeButton?.addEventListener('click', () => { const next=getTheme()==='dark'?'light':'dark'; setTheme(next); applyTheme(next); });
  refresh();
}
