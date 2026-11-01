# Independent fact-check: brief for verifier agents

Project: /home/claude/akilcantasi ("Akıl Çantası", an offline disaster app in Turkish). The guides were written by other agents. Your job is to INDEPENDENTLY verify them, as a skeptical expert reviewer would, and fix what is wrong. People may follow these instructions in life-threatening situations.

You get a list of guide ids. Find each one with `grep -rn '"id": "<id>"' src/content/guides/`. The type is in src/content/types.ts.

## For EACH guide
1. Read summary, steps, dont, callEmergency/critical, keywords and sources.
2. Verify every factual claim and instruction with WebSearch/WebFetch against authoritative, current sources. Do not rely on memory. Use:
   - Turkish official bodies: AFAD, Türk Kızılay, T.C. Sağlık Bakanlığı/HSGM, UZEM 114, OGM, MGM, TENMAK, Jandarma, İtfaiye, MEB first-aid material;
   - international: ERC/AHA/ILCOR 2025 guidelines, IFRC/Red Cross, WHO, CDC, NHS, IAEA, Ready.gov/FEMA, NWS, national mountain-rescue bodies.

   Note: afad.gov.tr and kizilay.org.tr often block automated fetching. Use search-result snippets, news quotes of official texts, or other official mirrors.
   Check in particular:
   - numbers: times, distances, ratios, temperatures, compression rates/depths;
   - sequence and priorities;
   - Turkey-specific facts: phone numbers, institution and service names, laws;
   - dangerous omissions: a step that is missing and needed for safety;
   - dangerous inclusions: myths, outdated practice, and medication doses, which are not allowed at all.
3. Check that the wording is plain Turkish, one action per step and imperative, with 4–10 steps.
4. Fix errors directly:
   - Use the Edit tool with small, exact string replacements INSIDE that guide's object only. Other agents edit other guides in the same files at the same time, so NEVER rewrite a whole file and never reformat.
   - Keep `art` the same length as `steps`. If you add a step, insert `null` at the same index in `art`; if you remove a step, remove its art entry.
   - Update `sources` to list what you actually verified against.
   - Set or replace `checked` with: `{ "date": "2026-11-01", "note": "Bağımsız doğrulama: <short list of sources>" }`.
5. Check the pictures:
   - Run `node e2e/guide-shot.mjs http://localhost:5199/ <id> /tmp/dg-<batch>`. It makes one PNG per step card (picture + text).
   - Read EVERY step PNG and check that the picture matches the step text and shows correct technique.
   - Do NOT edit pictures. List problems in your report file (below) with: guide id, step number, art id, what is wrong, and what the picture should show instead.
   - If a picture is actively misleading or dangerous (e.g. wrong hand position for CPR), you may set that art entry to null so it is hidden until redrawn, and say so in your report.
   - If the dev server is down, start your own: `npx vite --port 53xx --strictPort &`.
6. Run `npx vitest run tests/guides.test.ts` after your edits; structure must stay valid. Keep keywords sensible; don't add generic words.

## Report file
Write your findings to docs/dogrulama/<batch>.md, in Turkish. For each guide:
- what you verified and against which sources;
- what you changed (before → after, briefly);
- what remains uncertain or needs a human expert (be specific);
- picture problems (step, art id, issue, desired picture).

Your final message (under 200 words) summarises:
- the number of guides checked;
- the number of changes;
- the most serious errors found;
- pictures flagged for redraw.

## IMPORTANT: web search quota
The shared WebSearch quota is EXHAUSTED for this session. Do not waste calls on WebSearch. Use WebFetch on direct URLs of authoritative pages instead; many official sites work. Starting points (navigate deeper from them):
- RCUK 2025 guidelines: https://www.resus.org.uk/library/2025-resuscitation-guidelines (adult BLS, paediatric BLS, first aid)
- AHA 2025: https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines
- ERC: https://www.erc.edu/ and https://cprguidelines.eu/
- NHS conditions A–Z: https://www.nhs.uk/conditions/ (e.g. https://www.nhs.uk/conditions/first-aid/)
- St John Ambulance: https://www.sja.org.uk/get-advice/first-aid-advice/
- American Red Cross: https://www.redcross.org/take-a-class/resources/learn-first-aid
- CDC: https://www.cdc.gov/ (e.g. /natural-disasters/, /carbon-monoxide/, /radiation-emergencies/)
- Ready.gov: https://www.ready.gov/ (/earthquakes, /floods, /wildfires, /power-outages, /kit, /pets …)
- NWS safety: https://www.weather.gov/safety/
- ShakeOut / ECA: https://www.shakeout.org/dropcoverholdon/ and https://www.earthquakecountry.org/step5/
- IAEA / WHO pages where reachable; NPS: https://www.nps.gov/subjects/hikingclimbing/
- Turkish: https://www.turkiye.gov.tr/ (e-Devlet services) and https://www.mgm.gov.tr/ where reachable; AFAD/Kızılay usually block.
If a claim cannot be checked against any reachable source, do not invent a confirmation. Leave the text unless you are confident it is wrong, and list it under "doğrulanamadı" in your report.
