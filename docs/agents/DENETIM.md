# Genel denetim (hata ayıklama + güvenlik + tasarım): ajan özeti

Project: /home/claude/akilcantasi — "Akıl Çantası", an offline disaster app.
- Stack: Vite + Preact + TS web app, wrapped as an Android app with Capacitor 8 (Java plugins in android/app/src/main/java/org/akilcantasi/app), plus a Node "info point" server (server/server.mjs).
- Six tabs: Fener (on-device LLM), Rehber (guides), Harita (offline maps), İletişim (board, SMS, mesh), Kütüphane (ZIM/PDF library), Araçlar (tools, incl. enkaz = rubble beacon, enkaz-arama = rescuer scan, ayarlar = settings).

The app is feature-complete and has been through earlier QA rounds (docs/qa/*.md), so read the report for your scope first. Your job now is a final, meticulous pass over your scope:
1. find bugs (things that don't work, wrong states, crashes, console errors, data loss, race conditions);
2. find security problems;
3. find design/UX problems (layout, spacing, consistency, readability, small screens, Turkish text);
4. FIX them;
5. verify each fix.

## Read first
- CLAUDE.md (binding rules).
- docs/agents/OZELLIK.md (stack, CSS variables, conventions, test tooling).
- docs/agents/QA.md (QA method).
- The docs/qa/<scope>.md files for your area.

## Hard rules
- **Personal info:** CLAUDE.md §1. Never write any real person's name, username, e-mail, phone, address, district, village or coordinates anywhere: code, tests, docs, screenshots data, commit text.
  - Example data is generic: Ayşe, Mehmet, "Örnek Mahallesi", Ankara/Kızılay 39.9208, 32.8541.
  - tests/kisisel-bilgi.test.ts enforces this.
- **Language:** UI text, docs and code comments are in Turkish.
- **Visual identity:** the app's visual direction is "Şafak".
  - Navy base, amber accent (--accent).
  - Red ONLY for SOS / 112 / real danger.
  - The owner wants the app to feel calm and hopeful, not alarming. Don't introduce red elsewhere.
- **File ownership:** edit ONLY files in your scope (listed in your task). Other agents work in parallel in the same tree.
  - A one-line obvious fix outside your scope is OK if you mention it in your report.
  - Otherwise describe the needed change in your report.
  - Never rewrite whole files with scripts. Make careful, minimal edits.
- **Keep it compiling:** keep `npx tsc --noEmit` green at all times. Others share the dev server.
- **Limited machine (2 CPUs):**
  - Run only the vitest files relevant to you (`npx vitest run tests/x.test.ts`).
  - Run the full `npx vitest run` once, at the very end.
  - Don't run real-LLM e2e scripts more than once.
  - Don't start extra builds unless needed.
- **Things not to touch:**
  - No `npm install` (tell me if a dependency is truly needed).
  - No git commands that change state (no commit, checkout, reset, stash).
  - Do not publish anything, push, or call GitHub.
  - Never enter passwords or secrets.
- **No questions:** don't ask questions. Make the most reasonable decision and note it in your report.
- **Preserve features:** don't remove features. Don't change product behaviour that is clearly intentional; if in doubt, keep it and report it.
- **App update rule:** self-update may check and download automatically, but installing must ALWAYS require the user pressing the install button. Never weaken this.

## Browser testing
- Dev server: http://localhost:5199 (shared). If it's down or you need isolation: `npx vite --port 52xx --strictPort --host 127.0.0.1 &`.
- Playwright: require('/opt/npm-tools/node_modules/playwright'), or plain require('playwright'). Copy patterns from existing e2e/*.mjs.
- Mocking:
  - Capacitor plugins can be mocked with page.addInitScript; see e2e/native-infopoint-check.mjs, e2e/enkaz-check.mjs, e2e/sms-kutusu-check.mjs.
  - Mock geolocation and sensors the same way.
- Deep links: `?tab= ?tool= ?comm= ?guide= ?cat=`.
- Check at 360×640, 390×844 and 1280×800.
  - Also emulate Android "large font": html { font-size: 130% }, or a text-size-adjust / zoom approach.
  - Also check safe-area insets: the app uses --sa-top/--sa-bottom etc.; emulate with CSS variables `--safe-area-inset-top: 32px` and similar on :root.
- Screenshot and LOOK at the PNGs with the Read tool.
- Collect console errors.
- Existing e2e scripts for your area must still pass at the end. Extend them, or add e2e/qa-<scope>.mjs, for the bugs you fix.

## Report
Update docs/qa/<scope>.md (Turkish) with a new section "Denetim 2026-11" listing what you checked, what you fixed, and what remains.

Your final message to me must be in English, under 400 words, with:
- **FIXED:** a bullet per fix: file, what was wrong, and how it is verified. Mark severity: [güvenlik-yüksek / güvenlik-orta / hata / tasarım].
- **NOT FIXED / NEEDS OTHER SCOPE:** exact change and file.
- **SUGGESTIONS:** improvement ideas worth doing later, max 6, concrete.
- The test commands you ran and their results.
