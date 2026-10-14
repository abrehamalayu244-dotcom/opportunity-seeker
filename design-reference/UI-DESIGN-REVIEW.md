# UI reference review — Opportunity Seeker

## Decision
The supplied screens are a strong direction for the V1 explorer: a dark interface, restrained blue accent, persistent navigation, opportunity cards, filters, saved items, and a dedicated detail view are consistent with the project roadmap. Keep these patterns as the visual target and refine them as functional features are completed.

## Good to retain
- Dark-first visual language with a clear blue primary action.
- Sidebar navigation and a global opportunity search.
- Card-based discovery with category, location, and deadline metadata.
- Separate details page with eligibility/requirements and a visible save action.
- Responsive adaptation for narrower screens.

## Changes needed for V1 scope
- The designs show personalized recommendations and match percentages. Those belong to a later matching milestone; do not show fabricated match scores in V1.
- Use honest sample-data labels until opportunity data and application links are verified from official sources.
- Keep profile setup optional for V1; profile-based matching is not required to complete the explorer.
- Only show controls that work. Saved opportunities, details, search, sorting, filters, and theme should be functional; unbuilt Alerts, Applications, and Settings should be marked as planned or hidden in a later cleanup.
- Add visible empty states, keyboard focus states, and clear mobile navigation.

## Current baseline status
The current code now includes a functional discovery baseline, saved opportunities using LocalStorage, a detail view, sorting, theme persistence, and responsive styles. The profile form is retained from the existing work. The opportunity data is illustrative only and should be replaced by verified data in the later data-platform version.
