# Opportunity Seeker — V1 working baseline

**Discover opportunities. Understand your options. Move forward.**

Opportunity Seeker is being developed in deliberate versions: first a useful browser-only opportunity explorer, then personal tracking, verified external data, a full-stack platform, transparent matching, and finally AI assistance. This repository is intentionally scoped to **V1 — Opportunity Explorer**; it is not yet an AI agent or a production-ready multi-user service.

## What is working in this baseline

- Opportunity cards and keyword search
- Category, work-mode/location, and posted-date filters
- Sorting by deadline or posting date
- Opportunity details page with requirements, eligibility, deadline, and source fields
- Save/remove opportunities with browser `localStorage` persistence
- Saved opportunities page
- Light/dark theme preference saved locally
- Responsive card and detail layouts
- Profile form and local profile storage from the current project
- Explicit demo-data warning for sample listings; no claim that these are verified live opportunities

## Run locally

The app uses JavaScript ES modules. Run it through a local development server rather than opening `index.html` directly as a `file://` URL.

### Option A — VS Code Live Server
1. Extract the project folder.
2. Open `Opportunity-Seeker` in VS Code.
3. Install/enable the **Live Server** extension if needed.
4. Right-click `index.html` and choose **Open with Live Server**.

### Option B — Python
From the `Opportunity-Seeker` directory, run:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Current architecture

```text
index.html                 Discovery page
pages/details.html         Opportunity details
pages/saved.html           Saved opportunities
pages/profile.html         Profile form (existing work)
javascript/opportunities.js Sample opportunity data
javascript/discover.js     Search, filters, sorting, cards, theme
javascript/details.js      Detail view and save action
javascript/storage.js      Safe localStorage helpers
javascript/shell.js        Shared header/sidebar
styles/                    Existing styles + V1 fixes
```

## Important limitations

- Opportunity listings are sample/demo content. Some organization names and dates were used to populate the prototype; verify all facts from official sources before making decisions. The current records do not have official application URLs.
- Data is stored only in the current browser. It does not sync across devices or users.
- There is no backend, database, account authentication, external data ingestion, AI, notification service, or organization portal yet.
- Sidebar destinations marked as unavailable are visual roadmap placeholders and are not implemented features.
- The theme is a local UI preference, not a system-wide setting.

## Roadmap alignment

- **V1 — Opportunity Explorer (now):** finish and test browsing, search, filtering, sorting, details, saving, theme, and responsive behavior.
- **V2 — Personal Opportunity Manager:** application statuses, notes, dashboard, and deadline tracking.
- **V3 — Real Opportunity Data:** trusted sources, attribution, freshness, error states, duplicate handling, and normalization.
- **V4 onward:** React + Node/Express + PostgreSQL, accounts, transparent matching, AI assistance, agent workflows, public beta, and production hardening.

Do not add AI or a backend prematurely. Complete and understand each milestone, test it, and commit it to version control before moving forward.
