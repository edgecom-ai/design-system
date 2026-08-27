---
name: Edgecom Design System
description: >-
  The visual language and usage rules for Edgecom Energy's product UI — an
  energy management & monitoring platform (dataTrack™, pTrack®, NeuraCharge™).
  Read this before generating or designing any Edgecom UI, then follow it.
version: 1.0
# @@GENERATED:tokens — colors/typography/rounded are generated from src/app/globals.css by scripts/gen-design-md.mjs (run `pnpm docs:gen`); do not hand-edit until the closing marker. Light (canonical) OKLCH values; dark deltas are in the body.
colors:
  background: oklch(1 0 0)
  foreground: oklch(0.16 0.01 254)
  card: oklch(1 0 0)
  card-foreground: oklch(0.16 0.01 254)
  popover: oklch(1 0 0)
  popover-foreground: oklch(0.16 0.01 254)
  elevated: oklch(0.985 0.002 254)
  elevated-foreground: oklch(0.16 0.01 254)
  scrim: oklch(0.16 0.01 254 / 0.4)
  # Brand blue — deliberately identical in light and dark
  primary: oklch(0.514 0.161 254.3)
  primary-foreground: oklch(0.985 0 0)
  primary-emphasis: oklch(0.5 0.161 254.3)
  primary-subtle: oklch(0.965 0.025 254)
  secondary: oklch(0.967 0.003 254)
  secondary-foreground: oklch(0.21 0.01 254)
  muted: oklch(0.968 0.004 254)
  muted-foreground: oklch(0.55 0.02 254)
  accent: oklch(0.965 0.012 254)
  accent-foreground: oklch(0.35 0.03 254)
  # Status — each also has -foreground / -subtle-foreground (see body)
  success: oklch(0.536 0.1 176.6)
  success-emphasis: oklch(0.5 0.12 177.8)
  success-subtle: oklch(0.965 0.032 177.8)
  warning: oklch(0.802 0.171 73.3)
  warning-emphasis: oklch(0.52 0.12 70)
  warning-subtle: oklch(0.965 0.05 85)
  info: oklch(0.53 0.13 220)
  info-emphasis: oklch(0.5 0.13 220)
  info-subtle: oklch(0.965 0.032 220)
  destructive: oklch(0.577 0.245 27.325)
  destructive-emphasis: oklch(0.505 0.2 27)
  destructive-subtle: oklch(0.965 0.028 27)
  border: oklch(0.922 0.005 254)
  input: oklch(0.922 0.005 254)
  ring: oklch(0.514 0.161 254.3)
  # Commodity categorical ramp (chart series) — mode-independent
  chart-electricity: oklch(0.75 0.15 75)
  chart-water: oklch(0.514 0.161 254.3)
  chart-gas: oklch(0.62 0.2 25)
  chart-temperature: oklch(0.68 0.12 178)
  chart-emissions: oklch(0.55 0.18 300)
typography:
  font-family: SF Pro / system-ui sans (var --font-sans)
  caption: { size: 0.75rem, line-height: 1rem, weight: 500 }
  body: { size: 0.875rem, line-height: 1.375rem, weight: 400 }
  body-lg: { size: 1rem, line-height: 1.5rem, weight: 400 }
  title: { size: 1.125rem, line-height: 1.5rem, weight: 600 }
  heading: { size: 1.5rem, line-height: 1.875rem, weight: 600, tracking: -0.01em }
  display: { size: 2.25rem, line-height: 2.5rem, weight: 700, tracking: -0.02em }
rounded:
  base: 0.625rem   # --radius
  sm: 0.375rem   # base * 0.6
  md: 0.5rem   # base * 0.8
  lg: 0.625rem   # base
  xl: 0.875rem   # base * 1.4
  2xl: 1.125rem   # base * 1.8
  3xl: 1.375rem   # base * 2.2
  4xl: 1.625rem   # base * 2.6
# @@GENERATED:end
spacing:
  scale: Tailwind default (0.25rem step) — use the scale, never arbitrary px
components:
  button:
    background: "{colors.primary}"
    foreground: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    notes: Ships hover + focus-ring states. Must show cursor:pointer.
  badge:
    default-variant: outline
    rounded: "{rounded.sm}"
    notes: Tone is semantic, not decorative — see Components → Badge.
  card:
    background: "{colors.card}"
    foreground: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    padding: 1.5rem
  dialog:
    background: "{colors.popover}"
    scrim: "{colors.scrim}"
    notes: Short (1–4 field) create actions. Always dismissible (close X).
  sheet:
    width: 420px
    notes: Longer / many-field edit actions. Always dismissible (close X).
  input:
    border: "{colors.input}"
    ring: "{colors.ring}"
    invalid: destructive border + ring from aria-invalid
  active-highlight:
    surface: "{colors.accent}"
    foreground: "{colors.foreground}"
    notes: Neutral light-blue tint — never brand blue for routine active states.
---

# Edgecom Design System — Design Language & Usage

> **How to use this file:** read it before generating or designing Edgecom UI, then follow it. It defines the visual language (colors, type, spacing, elevation, shape) and the **usage rules** for building correct, accessible, on-brand screens. It is tool-agnostic — for design tools (Claude Design, Figma) and as the shared "what/why" behind the code guardrails.
>
> **Related docs:** [AGENTS.md](https://github.com/edgecom-ai/design-system/blob/main/AGENTS.md) — implementing with the component registry in a consuming app. [REGISTRY.md](https://github.com/edgecom-ai/design-system/blob/main/REGISTRY.md) — install mechanics. [MAINTAINERS.md](https://github.com/edgecom-ai/design-system/blob/main/MAINTAINERS.md) — developing the design-system repo itself. Live reference: [design.edgecom.ai](https://design.edgecom.ai).

## Overview

Edgecom Energy is an energy management & monitoring platform (products: **dataTrack™**, **pTrack®**, **NeuraCharge™**). The UI is data-dense — dashboards, tables, charts, metric tiles — so the system optimizes for **legibility, scannability, and consistent status semantics** across light and dark.

Core principles:

- **Semantic tokens, never raw values.** Every color, size, and radius is a named token with light + dark values. Never hardcode a hex or a magic px. This is what makes the whole system adapt to dark mode and stay consistent.
- **Status means something.** Color is not decorative — `success`/`warning`/`info`/`destructive` and the commodity hues each carry meaning. Use them strictly by meaning.
- **Reuse over reinvention.** Compose the existing components; don't hand-roll parallel versions. (Implementation: see [AGENTS.md](https://github.com/edgecom-ai/design-system/blob/main/AGENTS.md).)
- **Accessible by default.** WCAG AA minimum, AAA where the palette allows — in both themes.

## Colors

Colors are semantic tokens. Reach for the token by **role**, not by how it looks.

### Token families

- **Surfaces:** `background`, `card`, `popover`, `elevated` (each with a `-foreground` for text on it). Stacking order (lightness) matters in dark mode — see *Elevation*.
- **Brand / neutral:** `primary` (+ `-foreground`, `-emphasis`, `-subtle`, `-subtle-foreground`), `secondary`, `muted`, `accent`.
- **Status:** `success`, `warning`, `info`, `destructive` — each with the full set `{ base, -foreground, -emphasis, -subtle, -subtle-foreground }`.
- **Form / outline:** `border`, `input`, `ring`.
- **Charts / commodities:** `chart-1..5` alias the `500` step of the commodity ramps `chart-{electricity,water,gas,temperature,emissions}-{100..900}` (mode-independent — one hue per commodity).
- **Sidebar:** `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-accent`, `sidebar-border`, `sidebar-ring` (+ foregrounds).

### Which shade to use

- **`base` fill** with its **`-foreground`** for text/icons *on* that fill (e.g. a filled button, a solid status chip).
- **`-emphasis`** when a status/brand color is rendered **as text or a thin icon** on a neutral surface — it's tuned for contrast.
- **`-subtle`** (+ **`-subtle-foreground`**) for **tinted surfaces** — banners, selected rows, pills. Never use a `base` fill color directly as a text color.

### Status colors — strictly by meaning

`destructive` = errors & destructive actions · `success` = positive confirmation · `warning` = caution / negative-but-expected · `info` = information. Apply consistently across every surface (badges, alerts, toasts, text, icons). Never an arbitrary red/green/yellow, and never a status color used decoratively.

### Commodities

`electricity`, `water`, `gas`, `temperature`, `emissions` tag *that commodity* only. Electricity-derived metrics (voltage, current, THD, power factor) may use `electricity`.

### Brand blue is mode-independent

The brand blue (`primary`, used for `bg-primary` fills and buttons) is deliberately the **same value in light and dark** — don't lighten or re-tune it in dark the way most tokens shift. If you need a lighter primary as **text** in dark mode, use `primary-emphasis`, never a lightened base.

### Dark mode (the deltas)

Dark is the `.dark` class on the root; portaled content (dropdowns, popovers, tooltips, toasts) inherits it — never build light-only components. Light is the complete palette; dark overrides a subset. Key differences to respect:

- **Surfaces invert and stack:** `background` `oklch(0.16 …)`, `card` `0.205`, `popover` `0.265`, `elevated` `0.29`. Overlays must sit **above** cards (see *Elevation*).
- **Scrim deepens:** light `oklch(0.16 0.01 254 / 0.4)` → dark `oklch(0.08 0.008 254 / 0.7)`.
- **`primary` unchanged**; `primary-emphasis` lightens to `oklch(0.72 0.14 254)` for text-on-dark.
- **The active/hover highlight (`accent` / `sidebar-accent`) must stay a subtle light-blue tint** in dark, not a near-neutral grey — if it looks flat, tune `--accent` in `.dark`, not per-component.
- **`-subtle` status pairs must clear 4.5:1 in dark too.** A `-subtle` surface + its `-subtle-foreground` must clear 4.5:1 in dark as well as light; dark often needs its own explicit `-subtle-foreground` (the light `-emphasis` is usually too dark on a dark tint). e.g. dark destructive: surface `oklch(0.27 0.072 27)`, text `oklch(0.87 0.11 22)`.

**Always verify new or tuned colors in both themes** (the live *Semantic colors* page has a contrast meter).

## Typography

Use the **semantic type scale** — one token sets size + line-height + weight + tracking. Don't reach for ad-hoc `text-xs`/`text-2xl` or pin sizes to px.

| Token | Size | Use |
|---|---|---|
| `caption` | 0.75rem | Labels, meta, table captions |
| `body` | 0.875rem | Default body / table cells |
| `body-lg` | 1rem | Emphasized body, lead-in |
| `title` | 1.125rem | Card / section titles |
| `heading` | 1.5rem | Page headings |
| `display` | 2.25rem | Hero / display numerals |

The scale is in `rem` — it respects user font settings. Font family is SF Pro / system sans via `--font-sans`.

## Layout

- **Mobile-first.** Design for small screens first, layer up with breakpoints (`sm`/`md`/`lg`/`xl`/`2xl`). No desktop-only layouts.
- **Relative units.** Use the `rem` type scale and the spacing / radius scales — never fixed px for type or container dimensions.
- **Fluid, reflowing.** Content must never clip or force horizontal page scroll. Wide content (tables, code) scrolls inside its own `overflow-x-auto` container.
- **Density → hover.** In data-dense tables, metric tiles, and charts, keep the **primary value visible** and move secondary/detail info into a `tooltip` (brief) or `hover-card` (richer). Don't cram, shrink, or clip.
- **Tables:**
  - Text-first cells — no icons in cells unless explicitly asked.
  - The first/last cell in a row (`th`/`td`) aligns to the **card's content padding (1.5rem)** on its outer edge, not the 0.75rem cell padding — headers, edge values, and totals sit on the card's content line, never flush to the border.
  - Body rows get a subtle light-blue (`primary` tint) hover highlight — rely on the primitive's built-in one so every table matches.

## Elevation

Surfaces stack by lightness, and the stack must stay legible in **dark mode**, where surfaces are close in value:

- `background` < `card` < `popover` < `elevated` (raised menus / hover panels).
- **Overlays sit _above_ cards.** `popover` must be lighter than `card` in dark — an overlay at the same lightness as the cards behind it reads flat and the dialog edge disappears. (Dark: `card` 0.205, `popover` 0.265, `elevated` 0.29.)
- **Modal scrims use the `scrim` token**, never an inline `oklch(… / 0.4)`. Dark needs the deeper scrim because surfaces are close in lightness.
- **No accent bars.** Never add a colored strip along an edge/border (e.g. `border-l-4 border-l-destructive`) to signal status — use the component's own variant (a `-subtle` surface with `-emphasis` text/icon) so status reads consistently and adapts to dark.

### Stacking order (z-index)

Portalled surfaces mount at the end of `<body>`, so **within a layer the most recently opened surface paints on top** — a `popover` or `combobox` opened from inside a `dialog` is a later sibling and wins without needing a higher z-index. Only three layers exist; don't invent a fourth:

| Layer | `z` | Surfaces |
|---|---|---|
| Page | `0`–`20` | Sticky headers, action bars, table chrome |
| Overlay | `z-50` | `dialog`, `alert-dialog`, `sheet`, `drawer` (scrim + popup), and every anchored surface: `popover`, `select`, `dropdown-menu`, `combobox`, `context-menu`, `hover-card`, `navigation-menu` |
| Tooltip | `z-60` | `tooltip` only — transient, never interactive, must never be occluded by the overlay it annotates |

**Put the z-index on the element that establishes the stacking context.** A Base UI `Positioner` is `position: absolute` with a `transform`; the `Popup` inside it computes `position: static`, so a z-index on the popup is inert and the surface paints at `auto` — losing to any positioned page content. Every portalled component sets `isolate z-*` on its **Positioner**.

## Shapes

Radius scale, all derived from `--radius` (0.625rem): `sm` (0.6×), `md` (0.8×), `lg` (1×), `xl` (1.4×), `2xl` (1.8×), `3xl` (2.2×), `4xl` (2.6×). Use the scale — don't invent radii. Cards use `xl`; buttons/inputs `md`; pills/badges `sm`.

## Components (usage conventions)

### Badge — pick by meaning; default to `outline`

- **Neutral labels → `outline`.** When unsure, use `outline`.
- **Key highlight → `default` (primary).** Reserve the primary-colored `default` for a *single* key highlight (e.g. the current period) — not routine labels.
- **Commodities → the commodity variants only** (`electricity`/`water`/`gas`/`temperature`/`emissions`).
- **Info → `info`** (and `success`/`warning`/`destructive` for genuine status).

### Buttons & interaction

- **Real hover + focus states, always.** The `button` ships them; any custom clickable control must have a visible `hover:` state and a focus ring (`ring`). Never a flat, stateless button. Buttons must show `cursor: pointer`.
- **Secondary/utility actions use icon buttons.** On table toolbars and page headers, secondary actions (export, upload, download, refresh, filter, print, …) are **icon buttons** (`size="icon-sm"`/`icon-lg`, usually `outline`/`ghost`) with an `aria-label` + ideally a `tooltip` — not full text buttons. Reserve a labeled button for the single primary action. (This is chrome — distinct from the no-icons-in-cells rule.)

### Overlays — dialog vs. sheet

- **Short create actions (1–4 fields) → modal `dialog`** — quick, centered, focused.
- **Longer edit/update actions (many fields) → right-side `sheet`** — default width **420px**, full-width on mobile; go wider only when content genuinely needs it.
- **Dialogs & sheets keep their close (X)** — a modal must always be dismissible. The **only** exception is the `alert-dialog`, which omits the X so a destructive/confirmation flow forces an explicit choice.
- Overlays are **hidden by default** and **mounted at the app/template root**, so their visibility never depends on the current view.

### Feedback — toasts

- **Confirm with a toast, matching the semantic variant.** Any interaction needing feedback fires a `toast`; immediate actions especially (a `switch`/toggle must confirm on/off), and a completed save/submit should `toast.success`. **Match variant to outcome:** `toast.success` = confirmation, `toast.warning` = caution / negative-but-expected (e.g. a declined request), `toast.error` = genuine failure only. Never a neutral `toast()` for a success/error result.
- **One toast surface per app** (a single `<Toaster>`), and **every toast carries a title** (the description row collapses when empty).

### Destructive actions — double confirmation

Any destructive/irreversible action (delete, remove, disconnect, reset, purge) passes through an explicit confirmation before it runs — an `alert-dialog` with a `destructive`-variant confirm button and copy that names what's affected and that it can't be undone. Never wire a destructive action straight to its trigger. For high-impact/bulk actions add a stronger barrier (type-to-confirm the resource name). Surface the outcome with a `toast`.

### Validation & states — never fail silently

- **Inline, specific errors.** If a required field is empty, show inline error text that names what's missing ("Site name is required") next to the field — not just a generic toast or a silently-blocked button. Wire it through the `field` component's `FieldError` slot + `aria-invalid` on the input (the `input`/`select` primitives render the destructive border + ring from `aria-invalid`). Use the destructive token (`-emphasis` for text) and pair color with text/icon — never color alone.
- **Loading / empty / error.** Use the provided `skeleton`, `spinner`, and `empty` components — never raw loading gaps or unhandled empty/error states.
- **Async failures.** On a failed request, render an explicit error state with a **retry** action (an `empty` state + retry `button`) — never a blank screen or an endless spinner. For a failed *action* (e.g. a save), surface a `toast` and keep the user's input intact.

### Navigation & menus

- **Active/selected states use the built-in neutral highlight — not brand blue.** An active nav/menu/tab/sidebar item is signalled by the component's own active styling (`isActive`/`data-active` → the neutral `accent`/`sidebar-accent` surface) while its **text and icon stay `foreground`**. Brand blue is reserved for CTAs and a single key highlight, not routine active states. Compose navigation from the primitive's parts (e.g. `SidebarGroupLabel`, `SidebarMenuButton isActive`, `SidebarMenuSub`) — don't hand-roll the highlight.
- **Keep a gap between menu items** (e.g. `gap-1`) in `sidebar`, `dropdown-menu`, `command`, and similar lists so an active item and a hovered neighbor never merge into one block.

### Tooltips

A `tooltip` shrink-wraps its content — don't add a `max-w` or fixed width that forces wrapping. Widen only to keep a **row of data** on one line (via `whitespace-nowrap` on the rows), not a hardcoded width.

## Accessibility

- **WCAG AA minimum** — 4.5:1 for body text, 3:1 for large text / UI — and **AAA where the palette allows**. Light and dark held to the same bar.
- **Use real interactive primitives** (Base UI) — don't reimplement widgets and lose keyboard/ARIA support.
- **Visible focus ring** via the `ring` token — never `outline: none` with no replacement.
- **Label form fields; alt text on images.** Pair color with text/icon for status — never color alone.
- Respect `prefers-reduced-motion`; use motion sparingly.

## Do's and Don'ts

**Do**
- Use semantic tokens for every color; test in light **and** dark.
- Pick status/commodity colors strictly by meaning.
- Default badges to `outline`; reserve primary `default` for one key highlight.
- Use the rem type, spacing, and radius scales.
- Keep overlays dismissible (close X) except the `alert-dialog`.
- Confirm actions with the matching semantic `toast` variant; always give a toast a title.
- Gate destructive actions behind an `alert-dialog` (type-to-confirm for high-impact).
- Show inline, specific validation errors with `aria-invalid`.
- Move secondary/detail info into tooltips/hover-cards in dense UI.
- Use icon buttons for secondary table/page actions.

**Don't**
- Don't hardcode hex or ship light-only UI — every color is a light+dark token.
- Don't lighten `primary` in dark mode — the brand blue is mode-independent; use `-emphasis` for lighter primary *text*.
- Don't use a base fill color as a text color — use `-emphasis` for text, `-subtle`(+`-subtle-foreground`) for tinted surfaces.
- Don't recolor active/selected nav items with primary/blue text or icons — use the built-in neutral highlight; keep text/icon `foreground`.
- Don't make dark `popover` equal to `card`, and don't hardcode a modal scrim — overlays sit above cards; scrims use the `scrim` token.
- Don't add accent bars (colored border strips) to signal status — use the component's `-subtle`/`-emphasis` variant.
- Don't put icons in table cells unless asked; don't let edge cells sit flush to the card border (align to 1.5rem).
- Don't give tooltips a `max-w`/fixed width that wraps the text.
- Don't fix a row menu clipped by an `overflow-x-auto` table with `min-height` — toggle the wrapper to `overflow: visible` while open.
- Don't fire a neutral `toast()` for a success/failure; don't mount two toasters or ship a titleless toast.
- Don't wire a destructive action straight to its trigger.
- Don't block a user on validation without inline, specific error text.
- Don't leave async failures as a blank screen or endless spinner — show an error + retry.
- Don't pin sizes to px; don't invent new sizes or override a component's built-in classes — use its variants / `size` props.
- Don't ship a button or clickable control without a visible hover + focus state (and `cursor: pointer`).
- Don't cram a long, many-field form into a centered modal — use a right `sheet`.
