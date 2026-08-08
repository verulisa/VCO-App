# Backlog

## Custom logo + numbered map (paused 2026-08-08)

We built a copyright-safe replacement for the festival's own logo and map
(custom emblem, AI-illustrated map art, a 35-entry numbered "Map key" with
hand-drawn amenity pictograms) because of concern about using the festival's
own copyrighted artwork without permission.

Decision: pause that approach. The organisers are being asked directly
whether it's fine to use their real logo and map. Until/unless they say no,
the app uses the real assets again everywhere.

- Real assets restored: `public/brand/logo.jpg`, `public/map/festival-map.jpg`.
- Custom assets kept for reference: `backlog/custom-logo.jpg`,
  `backlog/custom-map-numbered.jpg`.
- Full custom implementation (numbered markers, gate dots, "Map key"
  section, hand-drawn pictogram icon set) is preserved in git history —
  see commit `41f4910` ("Expand map key to number every zone/facility from
  the real festival map") and the commits before it. The source files
  (`src/data/mapAreas.js`, `src/components/AmenityIcons.jsx`) are still in
  the tree, just unused by `MapPage.jsx` for now.
- If the organisers say no: re-wire `MapPage.jsx` to import from
  `mapAreas.js`/`AmenityIcons.jsx` again (see commit `41f4910` for the
  exact JSX) and swap the two asset files back from `backlog/`.
- If they say yes (or don't mind): this file and the two backlog assets
  can be deleted.

Also pending: a round of bug fixes from Karl's testing (backup-restore
crash screen, buttons/pages needing a double tap) — write-up incoming.
