# Autoresearch: shrink webapp bundle size

## Objective
Minimize the deploy artifact size produced by `npm run build` for the retirement calculator webapp.

## Metrics
- **Primary**: bundle_kb (kb, lower is better) — total size of `dist/` after the build.
- **Secondary**: js_kb, css_kb — size of JS and CSS assets in `dist/`.

## How to Run
`./autoresearch.sh` — outputs `METRIC name=value` lines.

## Files in Scope
- `package.json` — dependencies and build scripts.
- `vite.config.js` — build configuration and plugins.
- `src/**/*.jsx` — React components and routing.
- `src/**/*.css` — styles.
- `src/utils/**/*.js` — calculation helpers.

## Off Limits
- `node_modules/` and lockfiles unless dependency changes are required.
- `dist/` (generated).

## Constraints
- Preserve app behavior and UI functionality.
- Prefer not to add new runtime dependencies unless they reduce bundle size.

## What's Been Tried
- Baseline bundle_kb: 587kb.
- Replaced Recharts with custom SVG line chart and removed recharts dependency/manualChunks; bundle_kb down to 255kb.
