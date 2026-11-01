# Guide visual QA (every guide, every step)

Project: /home/claude/akilcantasi. You review a batch of guides (ids in your task) as they appear in the app.

For EACH guide id:
1. Run `node e2e/guide-shot.mjs http://localhost:5199/ <id> /tmp/qa-<batch>`. It writes the header image, one image per step card (picture + text), and the "Yapmayın" list.
2. Read EVERY image. Check:
   - the picture matches ITS OWN step text: right action, right technique, no contradiction. Watch out: some steps were inserted or removed during fact-checking, so pictures may now be shifted by one step;
   - text: correct Turkish, no typos, plain and imperative, no foreign emergency numbers (only 112, 114, 177, 183, 185, 186, 187 and 153 are acceptable where relevant);
   - layout: nothing clipped or overflowing; the 112 band is shown when relevant;
   - the guide makes sense as a whole: logical order, nothing contradicts another step.
3. Fixes you MAY make, in src/content/guides/*.ts, with small Edit-tool replacements only inside that guide's object (other agents edit other guides in the same files):
   - re-align the `art` array if pictures are shifted (it must stay the same length as `steps`);
   - set an art entry to null if its picture is wrong for that step and no correct existing picture fits;
   - fix typos and obviously wrong wording. Do NOT change medical or safety content; list such concerns instead.
4. Do not edit pictures. List picture defects in your report.

Then run `npx vitest run tests/guides.test.ts`; it must pass.

Report: docs/qa/rehber-<batch>.md, in Turkish, with:
- one line per guide: OK, or the problems found and fixed;
- a list of pictures needing a redraw (art id, guide, step, problem).

Final message under 150 words.
