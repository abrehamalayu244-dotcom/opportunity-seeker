import { opportunity } from './opportunities.js';

// ---------- DOM refs ----------
const opportunityContainer = document.querySelector('.opportunities');
const categorySelect       = document.querySelector('.category');
const locationSelect       = document.querySelector('.location');
const datePostedSelect     = document.querySelector('.date-posted');
const searchInput          = document.querySelector('.search-input');
const filterBtns           = document.querySelectorAll('.quick-filter');

// ---------- Filter state ----------
const state = {
  category:   'All',
  location:   'All',
  datePosted: 'All',
  search:     ''
};

// ---------- Helpers ----------
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function safe(str) {
  return (str ?? '').toString().trim();
}

// ---------- Render ----------
function displayOpportunities(list) {
  if (!list.length) {
    opportunityContainer.innerHTML =
      "<p class='no-result'>No opportunity found</p>";
    return;
  }

  opportunityContainer.innerHTML = list.map(v => `
    <article class="opportunity-card">
      <div class="card-header">
        <img class="company-logo"
             src="${v.logo || 'https://via.placeholder.com/40'}"
             alt="${v.company}"
             onerror="this.src='https://via.placeholder.com/40'" />
        <span class="company-name">${v.company}</span>
      </div>

      <h3 class="card-title">${v.title}</h3>
      <p class="card-subtitle">${v.organization || v.company}</p>

      <div class="card-meta">
        <p><span class="meta-label">📍 Location:</span> ${v.location}</p>
        <p><span class="meta-label">💼 Mode:</span> ${v.mode || v.location}</p>
        <p><span class="meta-label">⏰ Deadline:</span> ${formatDate(v.deadline)}</p>
      </div>

      <div class="card-footer">
        <div class="tags">
          <span class="tag tag-primary">${v.type}</span>
          ${v.field ? `<span class="tag">${v.field}</span>` : ''}
        </div>
        <a class="view-details" href="${v.url || '#'}">View Details</a>
      </div>
    </article>
  `).join('');
}

// ---------- Date helper ----------
const DATE_LIMITS = {
  'Last 24 hours': 24 * 60 * 60 * 1000,
  'Last 7 days':   7  * 24 * 60 * 60 * 1000,
  'Last 30 days':  30 * 24 * 60 * 60 * 1000
};

function isWithinDateRange(dateStr, range) {
  if (range === 'All') return true;
  const maxAge = DATE_LIMITS[range];
  if (!maxAge) return true;

  const posted = new Date(dateStr);
  if (isNaN(posted)) return false;

  const age = Date.now() - posted.getTime();
  // Negative age (future date) → treat as "very recent"
  return age <= maxAge;
}

// ---------- Master filter ----------
function applyFilters() {
  let result = opportunity;

  if (state.category !== 'All') {
    result = result.filter(v =>
      safe(v.type).toLowerCase() === state.category.toLowerCase()
    );
  }

  if (state.location !== 'All') {
    result = result.filter(v =>
      safe(v.location).toLowerCase() === state.location.toLowerCase() ||
      safe(v.mode).toLowerCase()   === state.location.toLowerCase()
    );
  }

  if (state.datePosted !== 'All') {
    result = result.filter(v =>
      isWithinDateRange(v.datePosted, state.datePosted)
    );
  }

  if (state.search.trim() !== '') {
    const t = state.search.trim().toLowerCase();
    result = result.filter(v =>
      safe(v.company).toLowerCase().includes(t) ||
      safe(v.title).toLowerCase().includes(t)   ||
      safe(v.location).toLowerCase().includes(t)
    );
  }

  displayOpportunities(result);
}

// ---------- Select listeners ----------
categorySelect.addEventListener('change', () => {
  state.category = categorySelect.value;
  applyFilters();
});

locationSelect.addEventListener('change', () => {
  state.location = locationSelect.value;
  applyFilters();
});

datePostedSelect.addEventListener('change', () => {
  state.datePosted = datePostedSelect.value;
  applyFilters();
});

// ---------- Search listener ----------
searchInput.addEventListener('input', () => {
  state.search = searchInput.value;
  applyFilters();
});

// ---------- Quick-filter buttons ----------
// ---------- Quick-filter buttons ----------
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // 1. Toggle the active visual state
    const wasActive = btn.classList.contains('active');
    filterBtns.forEach(b => b.classList.remove('active'));

    // 2. If user clicks the SAME button again → reset everything
    if (wasActive) {
      state.category   = 'All';
      state.location   = 'All';
      state.datePosted = 'All';
      state.search     = '';
      categorySelect.value   = 'All';
      locationSelect.value   = 'All';
      datePostedSelect.value = 'All';
      searchInput.value      = '';
      applyFilters();
      return;
    }

    // 3. Otherwise, add active state
    btn.classList.add('active');

    // 4. ✅ RESET every filter first — this is the fix
    state.category   = 'All';
    state.location   = 'All';
    state.datePosted = 'All';
    state.search     = '';
    categorySelect.value   = 'All';
    locationSelect.value   = 'All';
    datePostedSelect.value = 'All';
    searchInput.value      = '';

    // 5. Now set ONLY the filter this button controls
    const type  = btn.dataset.filter;   // "category" | "location"
    const value = btn.dataset.value;

    if (type === 'category') {
      state.category = value;
      categorySelect.value = value;
    } else if (type === 'location') {
      state.location = value;
      locationSelect.value = value;
    }

    // 6. Apply
    applyFilters();
  });
});
// ---------- Initial render ----------
applyFilters();