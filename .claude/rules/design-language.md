---
paths:
  - "src/components/**/*.tsx"
  - "src/app/**/*.tsx"
  - "src/app/globals.css"
---

# You are building Edgecom UI — read design.md

**[design.md](../../design.md) is the design language and the usage guardrails, and it is required, not advisory.** Read it before you generate or change UI. It is the "what/why" behind everything in this repo; this rule only front-loads the guardrails that get violated most, so that missing them is harder.

Authoring a primitive, a demo, or a doc page all count as *building with the design system*.

## The rules broken most often

- **Semantic tokens, never raw values.** No hex, no magic px, no one-off colour. Every colour, size, and radius is a named token with a light **and** dark value. Test both themes.
- **Colour means something.** `success` / `warning` / `info` / `destructive` and the commodity hues are picked by *meaning*, never by how they look. `destructive` is the only red that means error — never a chart series. A commodity red (`chart-gas`, `chart-emissions`) never signals an error.
- **Shade by role:** `base` fill with its `-foreground` on top; `-emphasis` for status/brand rendered as text or a thin icon on a neutral surface; `-subtle` + `-subtle-foreground` for tinted surfaces. **Never a base fill colour as a text colour.**
- **The semantic type scale only** — `text-caption`…`text-display`, never ad-hoc `text-xs`/`text-2xl`. The tokens carry their own line-height and weight, so **don't pair them with `leading-*`** or restate a weight. `body-sm` is single-line UI text; `body` is running prose; two slots that swap in one position take the same token.
- **`primary` is mode-independent.** Don't lighten the brand blue in dark — use `primary-emphasis` for lighter primary *text*.
- **Active nav/menu/tab items use the built-in neutral highlight** (`accent` / `sidebar-accent`), with text and icon staying `foreground`. Not brand blue. The one exception is a `tabs` `line` underline bar.
- **Three z-index layers only:** page `0`–`20`, overlay `z-50` (modals *and* every anchored surface), tooltip `z-60`. Put the z-index on the **Positioner**, not the Popup — a Popup computes `position: static`, so a z-index there is inert.
- **No accent bars.** Never a coloured strip along an edge to signal status; use the component's `-subtle`/`-emphasis` variant.
- **Keep overlays dismissible** — a top-right close (X) on every dialog and sheet. Only `alert-dialog` omits it.
- **Gate destructive actions** behind an `alert-dialog`, and use the `ghost-destructive` button variant for a quiet destructive row action. Don't hand-compose one from `ghost` plus destructive utilities — `ghost` re-asserts `hover:text-foreground`, so the label goes neutral exactly when the tint turns red.
- **Never fail silently.** Inline, specific validation errors via `FieldError` + `aria-invalid`; `skeleton`/`spinner`/`empty` for loading, empty, and error; a retry action on async failure.
- **Confirm with the matching semantic `toast`** variant, one `<Toaster>` per app, every toast titled.
- **Visible hover + focus state and `cursor: pointer`** on every clickable control.

## Where to look it up

| Question | Section of design.md |
|---|---|
| Which token, which shade, dark-mode deltas | *Colors* |
| Type scale | *Typography* |
| Tables, density, responsive | *Layout* |
| Surface stacking, scrims, z-index | *Elevation* |
| Badge, dialog-vs-sheet, tabs variant, select, tooltips | *Components* |
| Chart controls, legend, bar sizing, chart colour | *Charts & graphs* |
| Contrast bar, focus, labelling | *Accessibility* |

Anything not covered above: read the document. Don't guess from this summary.
