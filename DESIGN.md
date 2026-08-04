# Design

## Theme

**Drenched deep-forest night.** The surface is saturated brand color, not a neutral hosting brand accents. Reference point: a topographic map read by headlamp at a forest campsite — not a luxury lodge brochure, not an airy booking marketplace.

Scene sentence: a traveller on a phone at 11pm in bed, three tabs open, deciding whether Spiti in September is real. The screen is the brightest thing in the room. Dark is the honest answer.

Photography glows out of the dark surface; the deep ground is what makes the imagery the brightest thing on the page.

## Color

Strategy: **Drenched.** Deep forest carries 70%+ of the surface. Amber is an instrument accent (brass, headlamp) held under 5% — never gilding, never a luxury signal.

All values OKLCH.

| Token | Value | Role |
|---|---|---|
| `--bg` | `oklch(0.16 0.022 158)` | Body ground |
| `--bg-deep` | `oklch(0.12 0.018 158)` | Footer, wells, deepest layer |
| `--surface` | `oklch(0.215 0.026 158)` | Raised panels, cards |
| `--surface-2` | `oklch(0.265 0.028 158)` | Hover state, inputs |
| `--border` | `oklch(0.31 0.022 158)` | Hairlines |
| `--border-lit` | `oklch(0.44 0.035 155)` | Hover / focus edges |
| `--ink` | `oklch(0.97 0.008 150)` | Primary text |
| `--ink-2` | `oklch(0.87 0.012 150)` | Secondary text |
| `--ink-muted` | `oklch(0.75 0.016 150)` | Tertiary, metadata (8:1 on `--bg`) |
| `--canopy` | `oklch(0.76 0.155 148)` | Living green: interactive, glow, focus |
| `--canopy-deep` | `oklch(0.50 0.105 152)` | Pressed / dim states |
| `--amber` | `oklch(0.80 0.13 72)` | Instrument accent, ratings, highlights |

Neutrals are tinted toward the brand's own hue (chroma 0.018–0.03 at hue 158), never toward generic warmth.

**Contrast floors:** body ≥4.5:1, large text ≥3:1, placeholders ≥4.5:1. `--ink-muted` is the floor for any running text; anything lighter is decorative only.

## Typography

Two families on a genuine contrast axis — idiosyncratic display against neutral workhorse. Not two grotesques of the same temperament.

- **Display — Bricolage Grotesque** (600/700/800). Irregular, slightly rough, mixed-width. Carries personality without costume.
- **Body — Archivo** (400/500/600). Flat, industrial, signage lineage. Excellent at small sizes on dark.

Rules:
- Display letter-spacing floor **-0.03em**. Never tighter.
- Hero display: `clamp(2.75rem, 6vw, 5.25rem)` — ceiling stays well under 6rem.
- Modular scale ≥1.25 between steps.
- Light-on-dark gets **+0.06 line-height** over the light-mode equivalent.
- `text-wrap: balance` on h1–h3, `pretty` on prose. Body measure capped at 68ch.

## Layout

- Radii: cards **12–14px**, inputs 10px, hero/large containers 16px, pills fully round. Nothing above 16px on a card.
- Fluid section rhythm via `clamp()`. Spacing deliberately varied — generous between movements, tight within groups.
- `repeat(auto-fit, minmax(280px, 1fr))` for breakpoint-free card grids.
- Section headings do **not** carry uppercase tracked eyebrows. Hierarchy comes from scale, weight and spacing.

### Z-index scale

| Layer | Value |
|---|---|
| `--z-base` | 0 |
| `--z-raised` | 10 |
| `--z-dropdown` | 100 |
| `--z-sticky` | 200 |
| `--z-backdrop` | 300 |
| `--z-modal` | 400 |
| `--z-toast` | 500 |
| `--z-tooltip` | 600 |

No arbitrary values.

## Motion

Easing: `--ease-out-quart` `cubic-bezier(0.165, 0.84, 0.44, 1)` and `--ease-out-expo` `cubic-bezier(0.16, 1, 0.3, 1)`. No bounce, no elastic.

Durations: 180ms micro, 320ms component, 600–900ms scene.

**Signature interactive layers:**

1. **Aurora field** — a fixed, cursor-reactive light field: canopy-green and amber radial glows that lerp toward the pointer via rAF, with slow autonomous drift when idle. Pure CSS custom props; composited, never layout-animating.
2. **Contour field** — drifting topographic SVG linework at low opacity. The brand's cartographic signature.
3. **Spotlight hover** — cards carry a pointer-tracked radial highlight plus a lit border edge, image scale and content lift.

Reveals enhance an already-visible default: content is never gated behind a transition that may not fire.

**Reduced motion:** every effect above degrades to a static or crossfaded state under `prefers-reduced-motion: reduce`. Cursor-reactive layers are decorative only — no information lives in them, since touch and keyboard users never trigger them.

## Bans (project-specific)

- No uppercase tracked eyebrow above section headings.
- No card radius above 16px.
- No `border: 1px` paired with a wide soft drop shadow on the same element.
- No gradient text, no side-stripe borders, no decorative glassmorphism.
- Amber never reads as gold-luxury; it is instrument brass.
