# Edgecom Design System — building with it (consumer guide)

**This file is for building an app _with_ the Edgecom design system.** You're in the right place if you're assembling product UI (dashboards, forms, tables) in a consuming app and installing components from the `edgecom-ai/design-system` registry.

- **Developing the design-system repo itself?** (authoring primitives, tuning tokens, the docs site) → [MAINTAINERS.md](https://github.com/edgecom-ai/design-system/blob/main/MAINTAINERS.md).
- **The design language & usage rules** (colors, type, dark mode, component conventions, accessibility) live in **[design.md](https://design.edgecom.ai/design.md)** — read it and follow it. This file is the *how to implement*; design.md is the *what/why*. Don't restate its rules here — link to it.
- **Registry install mechanics in depth** → [REGISTRY.md](https://github.com/edgecom-ai/design-system/blob/main/REGISTRY.md).

## Install from the registry — don't recreate

- **Use the existing component.** Never hand-write your own version of something the design system already provides (button, dialog, input, table, …). Reuse over recreation.
- **Install address:** the repo *is* the registry — no server, no auth, no registry entry in `components.json`. Add by GitHub address:
  ```bash
  pnpm dlx shadcn@latest add edgecom-ai/design-system/button
  ```
  Pin to a ref with `#ref`; preview before writing with `--dry-run` (see [REGISTRY.md](https://github.com/edgecom-ai/design-system/blob/main/REGISTRY.md)).
- **Prereqs in the consuming app:** a shadcn-initialized project, **Tailwind v4** (`@import "tailwindcss";`), a `@/*` path alias matching your `components.json`, **React 19 / Next 16**, and **Base UI** (`@base-ui/react`).
- **Discover before you build.** Browse every component (light/dark, with code) at **[design.edgecom.ai](https://design.edgecom.ai)** — the catalog is the source of truth for what exists. Don't copy/paste or reimplement a primitive.
- **Compose, don't reinvent.** Build higher-level patterns (blocks, page sections) from the installed primitives — blocks are **not** registry items. Don't copy a primitive to tweak it or reach into its internals; extend through its exposed `cva` variants and `size` props.
- **No third-party components or dependencies unless asked or required.** Don't pull in an outside UI-component library or add an npm dependency unless (a) the user explicitly requests it, or (b) it's already required by a registry component (deps + `registryDependencies` are inferred from imports — see [REGISTRY.md](https://github.com/edgecom-ai/design-system/blob/main/REGISTRY.md) §3). Reach for the registry primitives and Base UI first.
- **No suitable component → STOP and ask (mandatory).** Do not silently hand-roll a bespoke component. Offer three options and proceed only after the user chooses: (a) adapt the closest existing registry component, (b) request it be added to the design system, or (c) get explicit approval for a documented, clearly-marked local one-off.
- **Icons: lucide-react only.** Don't add other icon packages.

## Tokens in a consuming app

- **The `theme` item is copy-on-install.** The first `add` injects the Edgecom light + dark OKLCH tokens (and the `cn` helper) into *your* `globals.css`. This is a **snapshot, not a live link** — if the design system retunes a token later, your app keeps the old value until you re-sync.
- **Re-sync tokens** by re-running the theme install with `--overwrite` (this discards local edits to those files — see [REGISTRY.md](https://github.com/edgecom-ai/design-system/blob/main/REGISTRY.md)). Prefer syncing over hand-editing token values.
- **Add the app-level CSS the `theme` item does _not_ ship.** A few rules are app-level, not part of `theme` — most importantly the Tailwind-v4 pointer-cursor fix. Add this to your `globals.css`:
  ```css
  @layer base {
    button:not(:disabled),
    [role="button"]:not(:disabled) { cursor: pointer; }
  }
  ```
  (Tailwind v4 dropped the default pointer cursor, so buttons look non-clickable without it. `color-scheme` and the `tabular` numeric utility are likewise app-level.)
- **Never hardcode hex or a one-off color** — use the semantic utilities (`bg-primary`, `text-muted-foreground`, …). Adding/tuning a color means editing the tokens in `globals.css`, not the call site. Token semantics + the accessibility bar are in [design.md](https://design.edgecom.ai/design.md).

## Responsiveness & scaling

- **Mobile-first.** Build for small screens first and layer up with Tailwind breakpoints (`sm`/`md`/`lg`/`xl`/`2xl`); no desktop-only layouts.
- **Relative units, not fixed px.** Use the `rem`-based type scale (`text-caption`…`text-display`) and the spacing / `radius-*` scales; don't pin font sizes or container dimensions to px. Reach for the semantic token, never `text-sm`/`text-xs` — the tokens carry their own line-height and weight, so **don't pair them with `leading-*`** or restate a weight they already set. `body-sm` and `body` are the same size on different line boxes: single-line UI text takes `body-sm`, running prose takes `body`, and two slots that swap in one position must take the same token.
- **Fluid layout.** Flex/grid with `min-w-0`, `max-w-*`, and wrapping so content reflows — it must never clip or force horizontal page scroll. Wide content (tables, code) scrolls inside its own `overflow-x-auto` container.
- **Reuse breakpoint logic.** Use the `use-mobile` hook (`useIsMobile`, 768px) for conditional rendering instead of ad-hoc `matchMedia`.
- **Touch targets & media.** Keep adequate hit areas on touch; `max-w-full` on images/media so nothing overflows.

## Dark mode

Dark mode is the `.dark` class on the `<html>` root; **portaled content (dropdown, popover, tooltip, toast) inherits it** — never build light-only components, and test everything in both themes. The token rules (which token when, overlay/scrim/contrast specifics, primary being mode-independent) are in [design.md](https://design.edgecom.ai/design.md) → *Colors / Elevation*. Mechanically: every color you use must be a semantic token so it adapts; if you need a new/tuned color, edit the tokens in `globals.css` (both `:root` **and** `.dark`), not the call site.

## Build correct, accessible UI

The full guardrails — status-color meaning, badges, dialog-vs-sheet, toasts, destructive double-confirm, validation, tables, tooltips, active-state highlighting, loading/empty/error, accessibility — are in **[design.md](https://design.edgecom.ai/design.md)**. Follow them; they are not optional. A few load-bearing ones, so they're not missed:

- **Status/commodity colors strictly by meaning** — never decorative.
- **Keep overlays dismissible** (dialog/sheet close X); gate **destructive actions** behind an `alert-dialog`.
- **A destructive row action is the `ghost-destructive` button variant** — quiet at rest, tinted on hover, correct in both themes. Don't compose one from `ghost` plus destructive utilities.
- **Confirm actions with the matching semantic `toast`** variant; one `<Toaster>` per app; every toast has a title.
- **Surface validation inline** (`FieldError` + `aria-invalid`); handle **loading/empty/error** with `skeleton`/`spinner`/`empty` (+ retry on async failure).
- **Active nav/menu items use the built-in neutral highlight**, not brand blue.
- **Don't restack overlays.** Three layers only: page `0`–`20`, overlay `z-50` (modals *and* anchored surfaces), tooltip `z-60`. Portals mount at the end of `<body>`, so a popover opened from inside a dialog already paints above it — reach for a higher z-index and you'll break something else instead.

## Do-nots (consumer)

- Don't hand-write a component the registry already provides — import it; if none fits, STOP and ask.
- Don't add third-party component libraries or dependencies unless explicitly requested or required by a registry component.
- Don't add icon libraries other than lucide-react.
- Don't copy/paste, fork, or reach into a primitive's internals — compose it and extend via its variants / `size` props.
- Don't hand-edit copied token values — re-sync from the registry (`add --overwrite`).
- Don't hardcode hex or ship light-only UI — every color is a light+dark token; test both.
- Don't skip [design.md](https://design.edgecom.ai/design.md) — the usage guardrails there are required, not advisory.
