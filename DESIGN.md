# Design System: Sogni di Carta

## 1. Overview & Creative North Star: "The Digital Curator"

This design system is built to evoke the tactile, sensory experience of high-end stationery. Our North Star, **The Digital Curator**, rejects the cold efficiency of standard SaaS interfaces in favor of an editorial, "slow-design" philosophy.

To achieve a "Dreamy & Elegant" aesthetic, we move away from rigid grids. We embrace **intentional asymmetry**, where elements breathe with generous white space and overlap like hand-placed vellum on a desk. The experience should feel like flipping through a bespoke wedding album or a personal dream journal—premium, quiet, and deeply intentional.

## 2. Colors & Surface Philosophy

The palette is a sophisticated dialogue between warm creams (`surface`), dusty botanicals (`secondary`), and soft earths (`primary`).

### The "No-Line" Rule

**Borders are strictly prohibited for sectioning.** We do not use 1px solid lines to separate content. Boundaries are defined exclusively through:

* **Tonal Shifts:** Moving from `surface` to `surface-container-low`.
* **Negative Space:** Using large, purposeful gaps to imply containment.

### Surface Hierarchy & Nesting

Treat the UI as a physical stack of fine paper.

* **The Foundation:** Use `surface` (#faf9f6) for the primary canvas.
* **The Inset:** Use `surface-container-low` for secondary content areas to create a "pressed" look.
* **The Floating Layer:** Use `surface-container-lowest` (#ffffff) for high-priority cards, giving them a soft, natural lift.

### The "Glass & Gradient" Rule

To capture the "Dreamy" quality, use **Glassmorphism** for navigation bars and floating modals. Apply a `surface` color at 70% opacity with a `24px` backdrop blur.

* **Signature Textures:** For Hero sections or primary CTAs, use a subtle radial gradient: `primary_container` (#eec7be) fading into `surface` (#faf9f6). This prevents the UI from feeling "flat" and adds a luminous, backlit quality.

## 3. Typography: Editorial Sophistication

We pair the timeless authority of a serif with the modern clarity of a geometric sans-serif.

* **Display & Headlines (Noto Serif):** These are our "hero" moments. Use `display-lg` for emotive statements. Always use `on-surface` or `primary` colors. These should feel like headers in a high-end fashion magazine.
* **Body & Labels (Plus Jakarta Sans):** Chosen for its clean, open counters. `body-lg` is your workhorse for storytelling.
* **Hierarchy Note:** To maintain the "High-End" feel, increase letter spacing (tracking) on `label-md` and `label-sm` by 0.05rem and set them in all-caps for a subtle "archival" stamp effect.

## 4. Elevation & Depth: Tonal Layering

We do not use elevation to denote "z-index" in the traditional sense; we use it to denote **tactility**.

* **The Layering Principle:** Instead of shadows, stack `surface-container-high` on `surface-container-low`. The 2% shift in value creates a sophisticated, "quiet" depth.
* **Ambient Shadows:** Where a shadow is functionally required (e.g., a floating checkout drawer), use a "Whisper Shadow":
  * `box-shadow: 0 12px 40px -10px rgba(117, 88, 80, 0.08);` (Note the use of the `primary` color as the shadow base rather than black).
* **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline-variant` at 20% opacity. It should be felt, not seen.
* **Organic Shapes:** Apply `xl` (1.5rem) or `full` roundedness to primary containers. Avoid sharp 90-degree angles to maintain the "dreamy" softness.

## 5. Components

### Buttons

* **Primary:** Uses `primary` (#755850) with `on-primary` (#ffffff) text. Shape: `full` (pill). No hard shadows; use a subtle `primary_container` glow on hover.
* **Secondary:** A "Glass" button. `surface_container_lowest` at 50% opacity with a `sm` (0.25rem) ghost border.

### Cards & Lists

* **Cards:** Never use a divider line. Separate the "Header" and "Body" of a card using a background shift from `surface_container_highest` to `surface_container_lowest`.
* **Lists:** Forbid the use of `horizontal-rule` elements. Use a `16px` vertical margin between items to allow the eye to navigate through white space.

### Input Fields

* **Styling:** Use the "Pressed" look. Background should be `surface-container-low` with a `none` border. On focus, transition to `surface_container_lowest` with a subtle `primary` ghost border.
* **Delicate Line Art Icons:** All icons must use a `1px` stroke weight. Icons should never be filled; they should remain airy and ethereal.

### Specialty Component: The "Vellum Modal"

A full-screen overlay using `surface` at 85% opacity with a heavy backdrop blur. This keeps the user's previous context visible but softened, mimicking a sheet of tracing paper over a document.

## 6. Do’s and Don'ts

### Do

* **Do** use asymmetrical layouts (e.g., a large image on the left, a small text block floating off-center on the right).
* **Do** use "Sage" (`secondary`) and "Blush" (`primary_container`) as functional background anchors to distinguish between "Dreaming" (Events) and "Doing" (Shopping).
* **Do** prioritize `notoSerif` for any text meant to be read with emotion.

### Don’t

* **Don’t** use pure black (#000000). Use `on-surface` (#1a1c1a) for high contrast.
* **Don’t** use standard Material Design "Drop Shadows." They are too heavy and break the "Dreamy" illusion.
* **Don’t** crowd the interface. If a screen feels "busy," remove a component rather than shrinking it. In high-end design, space is luxury.
* **Don't** use 100% opaque borders. They act as "cages" for content; we want our content to feel like it's floating.
