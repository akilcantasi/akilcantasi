# Drawing guide for scene agents (kit v2)

Style: "detailed flat illustration", like Kızılay/AFAD brochures. That means:
- proportioned people with faces;
- flat colours plus ONE darker shadow tone;
- a thin dark outline (`K.out`) around every shape;
- a coloured environment.

Everything is drawn with `src/art/kit2.tsx`. Do NOT use the old `kit.tsx`.

Before you start, read `src/art/scenes/_ornek.tsx`: 12 working scenes you can copy. View them at `?art=ornek-`.

## Files you write
- `src/art/scenes/<category>.tsx` exports `SCENES: Record<id, () => JSX.Element>`.
- Scene ids come from `src/art/spec/*.ts`. Read the description, then draw exactly that.
- Registration is automatic (`import.meta.glob` in `registry.ts`).
- A new scene with the same id as a legacy one replaces it.

```tsx
import type { JSX } from 'preact';
import { Scene2, Person, POSE, K, Arrow, rig } from '../kit2';
export const SCENES: Record<string, () => JSX.Element> = {
  'cpr-adult': () => <Scene2 bg="indoor">…</Scene2>,
};
```

## Canvas and backgrounds
- The canvas is `viewBox 0 0 320 240`. +x is right, +y is down. Angles are in degrees: 0 = right, 90 = down, 180 = left, -90 = up.
- `<Scene2 bg=…>` draws the rounded frame and the background. It accepts `gy` (ground line, default `GY = 200`), `wall` (wall colour) and `ground: 'grass'|'dirt'|'snow'|'pavement'`.

| bg | use for |
|---|---|
| `indoor` | wall + wooden floor (floor runs from `gy` down to 240) |
| `outdoor` | sky + hills + grass |
| `night` | night sky + moon |
| `dark` | plain dark card (diagrams, objects only) |
| `closeup` | soft neutral; for hands, faces, objects |
| `floor` | top-down floor (bird's-eye scenes) |

Put feet a little below `gy` (y ≈ 214–230). That gives a sense of depth: people further back stand higher.

## People: `<Person>`
```tsx
<Person x={160} y={222} who="woman" role="helper" pose={POSE.walk} face="calm" />
```
- **Position.** By default `x` is the hip and `y` is the ground: the lowest point of the body sits on `y`. A standing adult at `s=1` is about 162 units tall. You can align other joints instead: `ax`/`ay` take a `Joint` (e.g. `ax:'shoulderF'`, or `ax:'head', ay:'head'` for portraits).
- **Who.** `who`: `man | woman | boy | girl | oldman | oldwoman | baby`.
  - `oldman` comes with glasses and a moustache.
  - `oldwoman` comes with a headscarf and a long skirt.
- **Role** sets the top colour:
  - `helper` (teal) is the person giving help;
  - `victim` (blue) is the injured person or the one being helped;
  - `bystander`, `bystander2`, `bystander3`, `bystander4` (purple, mustard, green, terracotta) are everyone else;
  - `helper2` is an orange vest.
- **Overrides:**
  - `skin` takes 0–3 (light → dark);
  - `hair` takes `short | long | bun | ponytail | bald | scarf | baby | none`, with `hairC: K.hair.black | dark | brown | auburn | blond | grey | white`;
  - you can also set `top`, `sleeve: short|long|none`, `bottom: pants|shorts|skirt|longskirt|onesie`, `bottomC`, `shoes`, `glasses` and `mustache`.
- **Scale and facing.**
  - `s` is the scale. Close-ups use 2–3.
  - `flip` makes the figure face left.
  - `shadow={false}` removes the ground shadow.
- **Expressions.** `face` takes `neutral | calm | worried | pain | closed | speak`. Use `closed` for unconscious or sleeping people.
- **Variety.** Mix skin tones and genders across a category. Turkish context is welcome: headscarf, moustache.

### Pose
`pose` is an object. Start from a preset and override fields: `{...POSE.kneel, armF: {to: [x, y]}}`.
- `view: 'side'` (profile, faces right) or `'front'`.
- `spine` is the hip→neck angle (upright is -90). `chest` bends the upper back (hunch). `head` is the neck→head-top axis.
- `B` and `F` limbs:
  - in side view, `B` = back/far (drawn darker, behind the body) and `F` = front/near;
  - in front view, `B` = screen-left and `F` = screen-right.
- A limb (`armB`, `armF`, `legB`, `legF`) is one of:
  - `[upperAngle, lowerAngle]`: absolute angles, e.g. a hanging arm `[90, 90]`, an arm reaching forward `[0, 0]`;
  - `{to: [x, y]}`: the hand or foot goes to a scene point (IK);
  - `{floor: dx}`: hand or foot on the ground, `dx` in front of the shoulder or hip;
  - `{at: 'chest', d: [dx, dy]}`: to one of the person's own joints. `d` is in the facing-right frame.
  - Add `bend: 1 | -1` to flip the elbow or knee side.
- Hands:
  - `handB`/`handF` take `'mitten' | 'fist' | 'flat' | 'none'`, or `{shape, a, thumb}`;
  - `a` rotates the hand relative to the forearm (CPR: `{shape:'flat', a:-90}`);
  - use `'none'` when you draw a detailed `<Hand>` at the wrist yourself.
- `footB`/`footF` set foot angles. The defaults are right for standing, kneeling and lying.
- `behind: ['armB']` draws that arm behind the torso and head.

### Presets (`POSE.*`, side view facing right unless noted)
- **Standing and moving:**
  - `stand` and `wave` are front view;
  - `standSide`, `walk`, `run`, `carry` (box in front), `bend` (picking something up).
- **Sitting:** `sitChair` (hip ≈ ground − 44·s; put a `<Chair>` under it) and `sitFloor`.
- **Kneeling and low:** `kneel` (upright), `kneelSit` (on heels), `kneelOne`, `crouch`.
- **Drop-cover-hold:** `dropCover`. The near arm covers the neck; give `armB: {to: tableLeg}`.
- **On the floor:**
  - `crawl` (hands and knees);
  - `lieBack` (head on the left, eyes closed);
  - `recovery`: front view, lying on the side, top hand under the cheek, top knee bent forward.

### Joints: `rig(props)`
`rig()` takes the SAME props as `<Person>` and returns scene coordinates. Joints:
- body: `hip`, `neck`, `head`, `chest` (front surface of the chest), `back`, `belly`, `nape`, `mouth`;
- arms: `shoulderB/F`, `elbowB/F`, `wristB/F`, `handB/F`;
- legs: `hipB/F`, `kneeB/F`, `ankleB/F`, `toeB/F`;
- extras: `foreB`/`foreF` (forearm angles), `headA`, `headR`, `top`.

Use these to place things relative to the body:
```tsx
const victim = { x: 146, y: 226, s: 1.15, who: 'man', role: 'victim', pose: POSE.lieBack } as const;
const c = rig(victim).chest;                       // CPR: hands on the centre of the chest
<Person x={c[0]} ax="shoulderF" y={217} s={1.15} flip role="helper"
  pose={{ spine: -58, chest: -56, head: -30, legB: [70, 178], legF: [66, 176],
          armB: { to: c }, armF: { to: c }, handB: { shape: 'flat', a: -95 }, handF: { shape: 'flat', a: -88 } }} />
```

### Layering
- Slots take functions `(rig) => JSX`: `under` (behind everything), `back` (between the far arm and the torso; use it for backpacks), `mid` (in front of torso/head, behind the near arm; use it for held objects or a baby), `over`.
  ```tsx
  <Person … back={(r) => <Backpack x={r.back[0] - 9} y={r.neck[1] + 6} />} />
  ```
- `only={['legB','legF','torso','head','armB']}` draws part of a person. Draw the same props again with `only={['armF']}` to sandwich another object or person between the parts. `ornek-bebek` does this so the arm lies over the baby.
- Use `behind: [...]` inside the pose for an arm that should sit behind the body.

## Close-ups: `<Hand>`
```tsx
<Hand x={…} y={…} a={0} s={1.5} pose="press" side="R" view="back" skin={2} arm={80} sleeve={K.role.helper} />
```
- `x,y` = wrist. `a` = direction (0 = fingers up, 90 = right, 180 = down). At `s=1` the hand is about 66 units from wrist to fingertip.
- `pose`:
  - `open` (spread);
  - `press` (fingers together, pushing with the heel of the hand);
  - `fist`;
  - `pinch` (thumb and index ring);
  - `point`;
  - `hold`, which grips an object. The object goes between the palm and the fingertips as a child:
    ```tsx
    const h = { x: 150, y: 240, a: 8, s: 1.55, pose: 'hold', side: 'R', grip: 38 } as const;
    const g = handPoint(h, 'grip');
    <Hand {...h} arm={40}><Phone x={g[0]} y={g[1]} s={1.55} a={8} text="112" /></Hand>
    ```
- Mirroring:
  - `side` takes `'L' | 'R'`;
  - `view` takes `'back'` (nails visible) or `'palm'`;
  - with `side`/`view` combined, a left-hand palm view mirrors correctly.
- Forearm: `arm` sets the forearm length behind the wrist (use 200+ so it runs off-frame), and `sleeve` adds a cuff.
- `handPoint(props, 'tip' | 'grip' | 'palm' | 'pinch')` returns scene coordinates for attaching objects.
- **Face close-up**: use `<Person … s={2.7} ax="head" ay="head" x={160} y={92} only={['torso','head','armB']}>`, then draw a detailed `<Hand>` whose long forearm comes in from the frame edge. See `ornek-islak-bez`.

## Props
All props share the same outline and shade.

Position conventions:
- **base centre** (`x,y` = bottom middle) unless noted;
- **(L)** = `x` is the left edge and `y` is the floor;
- **(TL)** = `x,y` is the top-left corner;
- **(C)** = `x,y` is the centre.

| Group | Components |
|---|---|
| Rooms | `Table`(L), `Chair`(seat centre), `Door`(L, `open`), `Window`(TL, `view`, `broken`), `Wall`(L, `brick`, `crack`), `Stairs`(L), `Bed`(L) |
| Outdoors | `Tree`(`kind='leaf'\|'pine'`), `Rock`, `Water`(TL; stream, lake, flood), `Tent`, `Car`, `HouseExt`(L), `Building`(L, cross-section), `Sign`(pole base; `icon='people'\|'arrow'`, `text`) |
| Fire and food | `Flame`, `Campfire`, `Stove`, `Pot` (`boil`, sits at `y - 26·s` on a `Stove`), `Smoke`(TL; `kind='layer'` hangs from the ceiling, `'cloud'` floats) |
| Gear | `Phone`(C; `text`, `call`), `Backpack`(top centre), `Bottle`(`fill` 0–1, `a`), `FirstAidKit`, `Bandage`, `Cloth`(C; `wet`), `Blanket`(`x1`,`x2`,`y`; `foil`), `Compass`(C), `MapProp`(TL), `Whistle`(C), `Flashlight`(back end; `beam`), `Radio`, `Cane`(`top`,`bottom`), `Blood`, `Drop` |

For anything else, compose from `OG` (an outlined group of `{d, f}` shapes) plus the path helpers `capsule`, `rrect`, `ell`, `circ`, `smooth`. Use `shade(c)` / `tint(c)` for tones.

## Overlays and colour meaning
| Colour | Meaning | Use |
|---|---|---|
| **Orange `K.action`** | action / what to do | `Arrow`, `Label`, `Waves` |
| **Red `K.danger`** | danger / forbidden | `No` (prohibition ring over the wrong thing), `Bad` (✗ badge) |
| **Green `K.safe`** | correct / safe | `Ok` (✓ badge), green `Sign` |
| **Blue `K.water`** | water | water, drops, breathing waves are fine in blue |

- `Arrow({from, to, bend, w})`: `bend` 0 = straight, ±0.3 = curved.
- `Label({x, y, text})`: a short pill, e.g. "112", "20 dk", "3×".
- `Timer({x, y, text})`: a clock with a label.
- `Waves({x, y, a, n})`: sound, signal or breath.
- `Shake`: earthquake lines.
- `Bubble({x, y, w, h, tail, text})`: speech bubble.

Do not use orange for clothing near an orange arrow. That is why the helper role is teal.

## Composition rules
1. **One idea per scene.** One action, shown at the moment that matters.
2. **The important thing is large and central.** People should fill about 60–80% of the height. Use close-ups (`closeup` bg, `Hand`, `s` 2–3) for hand techniques.
3. **Avoid tiny details.** The scene shows at about 340px wide. Anything under about 8 units disappears. Use at most one `Label`, with ≤ 6 characters where possible.
4. **Show the correct action.**
   - For a "don't", draw the wrong action with `No`/`Bad` over it.
   - Use `Ok` only when the scene contrasts with a wrong one.
5. **Readable silhouettes.**
   - Prefer the side view for actions (CPR, carrying, crawling) and the front view for faces and holding.
   - Keep limbs from hiding the key contact point (hands on the chest, cloth on the wound).
6. **Leave space** around the main subject, and keep important things 12+ units inside the frame (corners are rounded).
7. **Text.** Use only short Turkish words or numbers. No sentences. The app's fonts only.

## Verify (mandatory)
1. Type check: `npx tsc --noEmit 2>&1 | grep -E "kit2|scenes/<file>"` must be empty.
2. Screenshot your scenes: `node e2e/art-gallery.mjs http://localhost:5199/ /tmp/<cat>.png f:<spec-file>` (or use an id prefix instead of `f:<spec-file>`). Open the PNG with Read and LOOK at it critically.
3. Ask of every scene: does a stressed person understand it in 2 seconds? Are hands and feet where the text says? Nothing floating, clipped or tangled?
4. Fix and re-shoot until it does. If the dev server isn't running, start one: `npx vite --port 5205 --strictPort &`.
5. Do not edit `kit2.tsx`. If something is missing, compose it in your scene file from `OG` and the path helpers.
