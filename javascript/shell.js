// =========================================================
// shell.js — injects the shared header + sidebar into any page
// Usage: import { mountShell } from './shell.js';
//        mountShell('discover');   // pass active sidebar key
// =========================================================

import { loadProfile } from './storage.js';

// ---------- Sidebar item definitions ----------
const SIDEBAR_ITEMS = [
  { key: 'for-you',      label: 'For You',      href: '#',             icon: starIcon() },
  { key: 'discover',     label: 'Discover',     href: 'index.html',     icon: compassIcon() },
  { key: 'saved',        label: 'Saved',        href: 'pages/saved.html', icon: bookmarkIcon() },
  { key: 'applications', label: 'Applications', href: '#',             icon: fileIcon() },
  { key: 'alerts',       label: 'Alerts',       href: '#',             icon: bellIcon() },
  { key: 'profile',      label: 'Profile',      href: 'pages/profile.html', icon: userIcon() },
  { key: 'settings',     label: 'Settings',     href: '#',             icon: settingsIcon() },
  { key: 'help',         label: 'Help',         href: '#',             icon: helpIcon() }
];

// =========================================================
// MAIN ENTRY
// =========================================================
export function mountShell(activeKey = '') {
  const app = document.querySelector('.app');
  if (!app) {
    console.warn('shell.js: no element with class .app found');
    return;
  }

  // Build header + sidebar
  const header  = buildHeader();
  const sidebar = buildSidebar(activeKey);
  const backdrop = document.createElement('div');
  backdrop.className = 'sidebar-backdrop';

  app.prepend(sidebar);
  app.prepend(header);
  app.append(backdrop);

  // Mobile toggle
  const toggle = header.querySelector('.menu-toggle');
  toggle?.addEventListener('click', () => {
    sidebar.classList.toggle('is-open');
    backdrop.classList.toggle('is-open');
  });

  backdrop.addEventListener('click', () => {
    sidebar.classList.remove('is-open');
    backdrop.classList.remove('is-open');
  });
}

// =========================================================
// HEADER
// =========================================================
function buildHeader() {
  const profile = loadProfile();
  const name = profile?.fullName?.trim() || 'Guest';
  const initials = getInitials(name);

  const header = document.createElement('header');
  header.className = 'app-header';
  header.innerHTML = `
    <button class="menu-toggle" aria-label="Menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>

    <a href="${resolveHref('index.html')}" class="brand">
      <span class="brand-mark">o-s</span>
      <span class="brand-name">Opportunity Seeker</span>
    </a>

    <div class="header-search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input type="text" class="search-input" placeholder="Search opportunities, companies, keywords" />  </div>

    <div class="header-right">
      <button class="header-icon-btn theme-toggle" type="button" aria-label="Toggle light and dark theme" title="Toggle theme">☀</button>
      <button class="header-icon-btn" aria-label="Notifications" type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </button>

      <div class="header-user">
        <div class="header-avatar">${initials}</div>
        <span class="header-username">${escapeHtml(name)}</span>
        <span class="header-caret">▾</span>
      </div>
    </div>
  `;
  return header;
}

// =========================================================
// SIDEBAR
// =========================================================
function buildSidebar(activeKey) {
  const sidebar = document.createElement('aside');
  sidebar.className = 'app-sidebar';

  sidebar.innerHTML = SIDEBAR_ITEMS.map(item => `
    <a class="sidebar-item ${item.key === activeKey ? 'active' : ''}"
       href="${resolveHref(item.href)}">
      ${item.icon}
      <span>${item.label}</span>
    </a>
  `).join('');

  return sidebar;
}

// =========================================================
// HELPERS
// =========================================================
function resolveHref(path) {
  if (path === '#') return '#';
  const inPages = /\/pages\//.test(window.location.pathname);
  if (path === 'index.html') return inPages ? '../index.html' : './index.html';
  return inPages ? path.replace(/^pages\//, '') : path;
}

function getInitials(name) {
  if (!name || name === 'Guest') return 'G';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

// =========================================================
// ICONS (inline SVG strings, Lucide-style)
// =========================================================
function starIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2"/>
  </svg>`;
}
function compassIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>`;
}
function bookmarkIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>`;
}
function fileIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>`;
}
function bellIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>`;
}
function userIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>`;
}
function settingsIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>`;
}
function helpIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>`;
}