# Scene-drawing tasks: rules for every drawing agent

Project: /home/claude/akilcantasi. FIRST read docs/agents/CIZIM.md (the kit v2 drawing guide) in full. Then study src/art/kit2.tsx and the sample scenes in src/art/scenes/_ornek.tsx; they are the quality bar.

Your task gives you a list of illustration ids and ONE output file, src/art/scenes/<name>.tsx. Write only that file. Never edit kit2.tsx or other agents' scene files. If you need a helper (a special prop or a reusable pose), define it inside your own file.

## What each id must show
Read its description in the spec file named in your task (src/art/spec/<file>.ts). The description is the requirement. Also read the guide step that uses the id, to understand the context:
`grep -rn "'<id>'\|\"<id>\"" src/content/guides/`

## Output format
```tsx
import type { ArtFn } from '../registry';
// … imports from '../kit2'
export const SCENES: Record<string, ArtFn> = {
  '<id>': () => (<Scene2 bg="...">…</Scene2>),
  …
};
```
Cover every id in your list, with the exact id strings.

## Quality bar
These pictures teach life-saving actions to stressed people on a phone screen about 340px wide.
- One clear idea per scene. Make the key action big and centred. Use close-ups for hand techniques.
- Technique must be anatomically and procedurally correct, exactly as the description and guide say. If the description is ambiguous, follow mainstream first-aid or AFAD practice.
- Use colour meaning consistently:
  - orange arrow: the action;
  - red prohibition / X: wrong or forbidden;
  - green check: correct;
  - blue: water / cold.
- No sentences in pictures; at most a short label like "112" or "20 dk".
- People must look natural. No broken limbs from wrong IK, no floating hands, no clipped heads. Keep a consistent scale.

## Verify visually, iterate, and do not skip this
- Dev server: http://localhost:5199. If it's down: `npx vite --port 52xx --strictPort &`.
- Gallery of your ids: `node e2e/art-gallery.mjs http://localhost:5199/ /tmp/<name>.png "ids:<id1>,<id2>,..."`. Do batches of ~8–12 ids per screenshot so they're large enough to judge. Then Read the PNG and critically check every scene against its description. Fix and re-shoot until each one is clearly right.
- Also look at 2–3 of your scenes in context, in a guide that uses them: `node e2e/shot.mjs "http://localhost:5199/?guide=<guide-id>" /tmp/g.png wait:600`.
- Type check: `npx tsc --noEmit 2>&1 | grep "scenes/<name>"` must be empty.

## Final report (under 150 words)
- ids done (count);
- any scene you are unsure about;
- the path of the final screenshots.
