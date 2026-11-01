# Final QA: brief for QA agents

Project: /home/claude/akilcantasi — "Akıl Çantası", an offline disaster app. UI in Turkish; 6 tabs: Fener, Rehber, Harita, İletişim, Kütüphane, Araçlar.

All features are built. Your job is to analyse and verify EVERYTHING in your scope like a meticulous QA engineer, using a real browser, and to FIX the bugs you find.

## Rules
- Read docs/agents/OZELLIK.md for the stack, conventions and test tooling.
- The dev server is at http://localhost:5199 (start your own if it's down: `npx vite --port 54xx --strictPort &`).
- Deep links: `?tab= ?guide= ?cat= ?tool= ?comm=`.
- Drive the UI with Playwright scripts. Copy the pattern of existing e2e/*.mjs; require playwright from /opt/npm-tools/node_modules/playwright. Check:
  - every button and every state: empty, loading, error, success;
  - persistence across reloads;
  - console errors;
  - layout at 390×844 and at 360×640 (small phone), plus one desktop width (1280×800);
  - text overflow;
  - touch targets ≥ 44px;
  - Turkish text quality and typos.
- Screenshot and LOOK at the PNGs with the Read tool.
- Fix bugs in the files of your scope with minimal, careful edits. Other QA agents work in parallel on other scopes, so don't touch files outside yours unless it's a one-line obvious fix, and mention it. Never rewrite whole files with scripts. Keep `npx tsc --noEmit` and `npx vitest run` green.
- Write or extend an e2e regression script for your scope as e2e/qa-<scope>.mjs that exits non-zero on failure. It must pass at the end.
- Report to docs/qa/<scope>.md, in Turkish:
  - what you tested (a checklist);
  - bugs found and fixed;
  - remaining issues;
  - your e2e command.

Final message: under 200 words.
