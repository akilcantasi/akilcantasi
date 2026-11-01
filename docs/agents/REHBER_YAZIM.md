# Writing guides: the brief for guide-writer agents

Project: /home/claude/akilcantasi ("Akıl Çantası", an offline disaster app in Turkish).

Each guide-writer agent owns one or more category files and edits ONLY:
- src/content/guides/<category>.ts — exports CATEGORY and GUIDES. The guide type is in src/content/types.ts; read it.
- src/art/spec/<category>.ts — exports `SPEC: Record<id, description>` for every NEW illustration id your guides use.
- tests/guides-<category>.test.ts — search tests (see below).

Never edit other files. Other agents work in parallel on other categories.

## Content rules (Turkish)
- Audience: ordinary people under stress, some with low literacy. Write short, plain, imperative sentences, one action per step.
- Steps: 4–10 per guide.
  - The most important action comes first.
  - Use numbers where they help ("20 dakika", "1 litre suya 2 damla").
- `summary`: one sentence saying what to do.
- `dont`: 2–5 common, dangerous mistakes.
- `callEmergency: true` when calling 112 is part of the right response.
- `critical: true` only for immediately life-threatening first aid.
- NO medication doses, NO prescription advice. You may say "doktorun önerdiği ilacı kullanmaya devam edin".
- Turkey-specific facts:
  - 112 is the single emergency number.
  - 114 is UZEM, the poison center.
  - 177 is the forest-fire line; it is now routed to 112 in most provinces, so prefer 112.
  - The official bodies are AFAD, Kızılay, Sağlık Bakanlığı, OGM, MGM, TENMAK, Jandarma (JAK) and UMKE.
- ACCURACY IS THE TOP PRIORITY. For EVERY guide, use WebSearch/WebFetch to check the steps against at least one authoritative current source and to verify any numbers or claims:
  - AFAD, Türk Kızılay or T.C. Sağlık Bakanlığı;
  - for first aid, the ERC/AHA guidelines (latest), IFRC, WHO or CDC;
  - for outdoor topics, national park services or mountain rescue bodies;
  - for nuclear topics, IAEA or TENMAK.

  Where sources disagree, follow the most conservative mainstream guidance. Do not invent statistics.
- `sources`: list the real organizations and documents you used, e.g. "AFAD — Afet Bilinci Eğitimi", "ERC Kılavuzları 2021 — İlk Yardım", "WHO — Household water treatment". Keep each one short.
- `reviewed: false` always, because no human expert has reviewed it yet. Add `checked: { date: '2026-11-01', note: '<1 line: what you verified against>' }`.
- `keywords`: 8–20 everyday ways a stressed person might ask, including colloquial and misspelled forms without Turkish letters. The Fener assistant and the search use them, so they must NOT accidentally match other topics. Avoid generic words like "yardım", "ne yapmalı", "acil" or "su" on their own when they don't specifically identify this guide.
- ids: lowercase, hyphenated, unique across the whole app. Check what exists:
  `grep -rho '"id": "[^"]*"' src/content/guides/ | sort`
- Existing guides in your files: improve them if you find errors (verify!), but keep their ids.
- Keep the file format as is: `export const CATEGORY ... export const GUIDES: Guide[] = [...]`. The JSON-style objects are fine.

## Illustrations (the `art` array)
- `art` has the same length as `steps`. Choose the 3–6 steps that benefit most from a picture; the rest are null. Every guide must have at least 3 illustrated steps.
- Prefer the shared ids in src/art/spec/common.ts (call-112, cpr-adult, recovery-position, …) when they fit exactly.
- Every other id you use must be NEW, prefixed with your category id (e.g. `hayatta-kalma-su-yogusma`), and described in src/art/spec/<category>.ts.
  - Do NOT reuse old unprefixed ids from src/art/spec/legacy.ts. All drawings are being redrawn; define your own prefixed ones.
  - Reuse your own ids across your guides where it is literally the same picture.
- Illustration style is DETAILED FLAT ILLUSTRATION, like Kızılay/AFAD brochures: properly proportioned people (head with simple face, torso, arms, hands), clothes, environment and props, flat colours. Canvas 4:3.
- Write each description so an illustrator can draw it without guessing. In Turkish, 1–3 sentences, cover:
  - viewpoint (yandan / önden / yukarıdan / yakın plan);
  - who is where;
  - what exactly the hands or body are doing;
  - which key objects appear;
  - what to emphasise: an orange arrow for the action, red "yasak" for forbidden, green check for correct;
  - at most a short label such as "20 dk" or "112". No sentences in the picture.
- The picture must show the correct technique precisely (e.g. CPR: straight arms, shoulders over hands, centre of chest).

## Search tests
Create tests/guides-<category>.test.ts with 1–2 realistic Turkish queries per new guide, asserting that `searchGuides(q, 3)[0].guide.id` is that guide. Use this pattern:

```ts
import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';
describe('<category> araması', () => {
  it.each([['ormanda su nasıl bulunur', 'hayatta-kalma-su-bulma']])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
```

Also check that your keywords do not steal OTHER categories' queries: run the whole suite. If an existing test in another file starts failing because of your keywords, fix YOUR keywords. Never edit others' tests.

## Verify before you finish
- `npx tsc --noEmit` must be clean for your files.
- `npx vitest run` must be all green. The general tests check structure: art length = steps length, every art id exists in a spec, every guide is in a category.
- Open a few of your guides in the browser and look at them. A Vite dev server runs at http://localhost:5199. Run `node e2e/shot.mjs "http://localhost:5199/?guide=<id>" /tmp/<id>.png wait:500` and Read the PNG. Old or missing illustrations will look odd or be absent; that is expected for now. Check text, layout and order.
- Final report (under 250 words):
  - guide ids added or changed;
  - for each guide, the source you verified against;
  - anything you were unsure about, for the expert-review list.
