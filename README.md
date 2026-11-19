# vIDE Bike Gauge app

The speedometer and fuel-gauge look for [vIDE](https://github.com/DarthTigerson/vIDE)'s usage panel, packaged as a vSuite Store app (category Usage) on vIDE's app API v1 (needs vIDE 0.3.7+). It was the usage panel's built-in Gauges view before moving to the Store. Pick it by right-clicking the usage panel, then View, then Bike Gauge.

Layout:

- `src/renderer/` becomes `renderer.js` (ES module; React comes from `globalThis.__videShared`, never bundled) plus a scoped `style.css`. The app has no `main.js`.
- `BikeGauge.tsx` is the whole look: it receives `{ session, week, now }` from the panel, only draws, and gets pace numbers from `vide.usage.pace(window, now)`.
- `src/vide.d.ts` is a copy of vIDE's app API types.

## Dev loop

```bash
npm install
npm run build        # writes dist/
npm test             # component tests with a mocked `vide.usage.pace`
npx tsc --noEmit     # type check
```

In a dev vIDE run the palette command **Load app from folder…** and pick `dist/`.

## Packaging

```bash
npm run build && npm run package
```

Writes `release/bike-gauge-<version>.zip` (files at the zip root) and prints its sha256 and size.

## Releasing

Push a tag like `v0.1.1`. The Release workflow takes the version from the tag, runs the tests, builds the zip and publishes a GitHub release with it. The vSuite catalog picks it up within the hour (or at once, if the `VSUITE_STORE_TOKEN` secret is set).

## Store page content

- `manifest.json` `description`: the one-line summary on the Store card.
- `store/README.md`: the About text on the Store page.
- `assets/icon.svg`: the app icon.
- Screenshots: `assets/screenshot-*.png`, listed in the manifest `screenshots` field (shown on the Store page). Retake them after a visual change.
