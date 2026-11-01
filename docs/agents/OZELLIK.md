# Building features: shared brief for feature agents

Project: /home/claude/akilcantasi — "Akıl Çantası", an offline disaster app. The UI is in Turkish.

## Stack
- Vite 5 + Preact + TypeScript (`npx tsc --noEmit`), tests with vitest (`npx vitest run`).
- Dark theme. Use the CSS variables in src/styles/app.css: --bg, --bg2, --card, --line, --line2, --line3, --text, --text2, --muted, --accent (#f5a524), --danger, --mono. Reuse the existing classes: `.pad`, `.card`, `.btn`, `.btn.primary`, `.input`, `.row`, `.grow`, `.empty`, `.label`, `.link-btn`, `.list-btn`.
- Component CSS goes either in a `<style>{CSS}</style>` string inside your component (see src/tabs/RehberTab.tsx, src/tabs/AraclarTab.tsx) or in your own .css file imported by your component.
- Global state: src/lib/store.ts. Navigation: `go.tab()`, `go.tool(id)`, `go.comm(id)`, `go.guide(id)`, `go.category(id)`. Do not edit store.ts. If you need state, keep it in your own module, using localStorage via try/catch, or OPFS.

## Layout
- Six tabs (src/App.tsx): Fener, Rehber, Harita, İletişim, Kütüphane, Araçlar.
- The Araçlar tab lists tools from src/tools/registry.ts. Each tool is `src/tools/<id>/index.tsx`, which `export default` a component. Placeholder stubs already exist; you replace the stubs you own.

## Deep links for testing
`?tab=<id>`, `?tool=<id>`, `?comm=<id>`, `?guide=<id>`, `?cat=<id>`, e.g. http://localhost:5199/?tool=pusula

## Hard rules
- Edit ONLY the files listed as yours in your task. Many agents work in parallel in the same tree. If you truly need a change in a file you don't own, describe the exact change in your final report instead of making it.
- Everything must work fully OFFLINE at runtime: no CDN, no external fetches except the documented optional online catalog. Bundle npm dependencies; npm install works (registry.npmjs.org is reachable). Run `npm install <pkg>` only if you really need a library, and say so in the report. package.json is shared; npm handles concurrent edits poorly, so do it early and once.
- Keep the app compiling at all times. Other agents use the same dev server, so a syntax error in your file breaks everyone's preview. Save working states and run `npx tsc --noEmit` often. Errors in files you don't own are not yours to fix.
- Your tests go in your own file, `tests/<your-feature>.test.ts`. Pure logic (parsers, calculations, protocol) must be unit-tested.
- UI quality:
  - touch targets ≥ 44px;
  - readable at 390px wide;
  - Turkish text with correct characters;
  - `aria-label`s on icon buttons;
  - `data-testid` on every interactive element and on key outputs, so a later QA pass can drive it;
  - empty, loading and error states handled;
  - no blocking `alert()` / `confirm()` dialogs (they break automated browser testing; use inline confirm UI).
- Facts shown to users (numbers, phrases, frequencies, recipes) must be verified with WebSearch against authoritative sources. Put a short source note in the UI or a code comment.

## Verify in a browser, debug and iterate
A Vite dev server runs at http://localhost:5199. If it's down, start your own on another port: `npx vite --port 52xx --strictPort &`.

- Screenshot: `node e2e/shot.mjs "<url>" /tmp/x.png [testid ...|wait:ms|type:testid=text]`, then Read the PNG and look at it.
- For multi-step flows, write a Playwright script in e2e/<feature>-check.mjs. Copy the pattern from e2e/native-infopoint-check.mjs: require playwright from /opt/npm-tools/node_modules/playwright, assert, collect console errors.
- You can mock browser APIs with page.addInitScript: deviceorientation, geolocation, Battery, Capacitor plugins.
- Fix every console error you cause.

## Final report (under 300 words)
- what you built;
- files touched;
- how you verified it (scripts, screenshots);
- known limitations;
- anything that needs a change in a file you don't own.
