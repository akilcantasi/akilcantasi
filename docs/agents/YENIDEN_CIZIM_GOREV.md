# Redraw task: rules for redraw agents

Project: /home/claude/akilcantasi. Independent fact-checkers found illustrations that are wrong, misleading or that contradict their (sometimes corrected) step text. The full list is in docs/dogrulama/YENIDEN_CIZIM.md, grouped by scene file, with the problem and the required picture. The spec descriptions in src/art/spec/*.ts have been updated to state exactly what each picture must show.

1. Read docs/agents/CIZIM.md (kit v2 guide) and docs/agents/CIZIM_GOREV.md (quality bar and verification). Study src/art/kit2.tsx.
2. You own ONLY the scene files named in your task. In them, redraw every id listed for those files in YENIDEN_CIZIM.md. Rewrite each scene so it matches its UPDATED spec description AND the current step text of every guide that uses it. Find the guides with `grep -rn '"<id>"' src/content/guides/`.
3. If YENIDEN_CIZIM.md lists a NEW id (no drawing yet) whose spec lives in a category belonging to your files, draw it in your file too.
4. High-priority items are technique errors: CPR arm and shoulder position, hand placement, recovery position, nosebleed pinch, etc. They must be anatomically and procedurally correct; compare against the guide text.
5. Verify visually as CIZIM_GOREV.md says:
   - gallery shots of your ids: `node e2e/art-gallery.mjs http://localhost:5199/ /tmp/x.png "ids:a,b,c"`;
   - each guide in context: `node e2e/guide-shot.mjs http://localhost:5199/ <guide-id> /tmp/gs-<you>`, which gives one image per step card;
   - Read every image and compare it to the step text;
   - iterate until correct.
6. `npx tsc --noEmit 2>&1 | grep "scenes/<your files>"` must be empty.

Final report (under 150 words): ids redrawn, anything still not right.
