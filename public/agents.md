# Edgecom Design System — building with it (consumer guide)

**This file is for building an app _with_ the Edgecom design system.** You're in the right place if you're assembling product UI (dashboards, forms, tables) in a consuming app and installing components from the `edgecom-ai/design-system` registry.

Published at **[design.edgecom.ai/agents.md](https://design.edgecom.ai/agents.md)** — that URL is the stable address to point an agent at. It is a document *about* consuming the registry; it is **not** the instruction file for working inside this repo (that's the root `AGENTS.md`).

- **Developing the design-system repo itself?** (authoring primitives, tuning tokens, the docs site) → [MAINTAINERS.md](https://github.com/edgecom-ai/design-system/blob/main/MAINTAINERS.md).
- **The design language & usage rules** (colors, type, dark mode, component conventions, accessibility) live in **[design.md](https://design.edgecom.ai/design.md)** — read it and follow it. This file is the *how to implement*; design.md is the *what/why*. Don't restate its rules here — link to it.
- **Registry install mechanics in depth** → [REGISTRY.md](https://github.com/edgecom-ai/design-system/blob/main/REGISTRY.md).
- **Machine-readable data** — the component contracts, the token model and the Claude Code skills are served beside this file; the addresses are in [Implementing from a design](#implementing-from-a-design) below. Fetch a contract rather than infer one from the catalogue.

## Install from the registry — don't recreate

- **Use the existing component.** Never hand-write your own version of something the design system already provides (button, dialog, input, table, …). Reuse over recreation.
- **Install address:** the repo *is* the registry — no server, no auth, no registry entry in `components.json`. Add by GitHub address:
  ```bash
  pnpm dlx shadcn@latest add edgecom-ai/design-system/button
  ```
  Pin to a ref with `#ref`; preview before writing with `--dry-run` (see [REGISTRY.md](https://github.com/edgecom-ai/design-system/blob/main/REGISTRY.md)).
- **Prereqs in the consuming app:** a shadcn-initialized project, **Tailwind v4** (`@import "tailwindcss";`), a `@/*` path alias matching your `components.json`, **React 19**, and **Base UI** (`@base-ui/react`). No particular framework: the primitives import nothing framework-specific.
- **Discover before you build.** Browse every component (light/dark, with code) at **[design.edgecom.ai](https://design.edgecom.ai)** — the catalog is the source of truth for what exists. Don't copy/paste or reimplement a primitive.
- **Compose, don't reinvent.** Build higher-level patterns (blocks, page sections) from the installed primitives — blocks are **not** registry items, with one exception: the portal page frame ships as `application-shell`, and every portal screen renders inside it. Don't copy a primitive to tweak it or reach into its internals; extend through its exposed `cva` variants and `size` props.
- **No third-party components or dependencies unless asked or required.** Don't pull in an outside UI-component library or add an npm dependency unless (a) the user explicitly requests it, or (b) it's already required by a registry component (deps + `registryDependencies` are inferred from imports — see [REGISTRY.md](https://github.com/edgecom-ai/design-system/blob/main/REGISTRY.md) §3). Reach for the registry primitives and Base UI first.
- **No suitable component → STOP and ask (mandatory).** Do not silently hand-roll a bespoke component. Offer three options and proceed only after the user chooses: (a) adapt the closest existing registry component, (b) request it be added to the design system, or (c) get explicit approval for a documented, clearly-marked local one-off.
- **Icons: lucide-react only.** Don't add other icon packages.

## Implementing from a design

A design arrives as a Claude Design link read through its MCP, or as a spec or a screenshot. The design carries product intent — layout, hierarchy, responsive and interaction behaviour. The design system carries what is permitted — components, variants, tokens, semantics, accessibility. You are reconciling the two, and neither side may be silently approximated.

- **Resolve every designed element to a registry component before writing any layout.** Fetch `contracts/index.json`, match each element by a component's `summary`, `purpose`, `useWhen` and `dontUseWhen`, and pick its variant from `variants`. Those option lists are read from the primitive on every build, so a variant that is not in them does not exist — don't invent one, and don't build freeform and retrofit components onto it.
- **Read the full contract of each component you are about to use** — `contracts/<id>.json`. `requires` and `forbids` are the compositions the primitive expects and rejects; `behavior` is what it does in the loading, empty, error and destructive paths; `a11y.requirements` is what you still have to supply; `antiPatterns` are the mistakes already seen in real designs and PRs.
- **Read the design's manifest first.** A design produced against this system ships `<Name>.manifest.json` beside `<Name>.dc.html`: the system version and digest it was built against, one entry per designed element naming its registry `component`, `variants` and `parts`, the tokens it reaches, the viewports, themes and states it covers, its interactions, and any approved exceptions. Validate it before building — `node check-design-manifest.mjs <Name>.manifest.json`, from the address below — and resolve each `component` to its contract. A design with no manifest is one you have to read element by element; say so, and record what you resolved.
- **Check the version before you build.** Every file below carries `version` and `digest`, and they are one value: the identity of the whole system. A Claude Design project generated from this system carries the same pair in its `_system.json`, and every design's manifest copies it. If the design's pair and the current one differ, say so before building. If your app's installed `theme` predates `tokens.json`, re-sync it first (see *Tokens in a consuming app*).
- **Precedence when the two disagree:** product requirements → the design's layout and interaction intent → the contracts → the registry source. A deviation from a contract is allowed only as a recorded, approved exception. Otherwise implement the valid design-system version and report the visual impact — never approximate silently.
- **Install the skills** to have the full procedure load on its own in Claude Code:
  ```bash
  mkdir -p .claude/skills/implement-edgecom-design .claude/skills/audit-edgecom-ui
  curl -fsSL https://design.edgecom.ai/skills/implement-edgecom-design/SKILL.md -o .claude/skills/implement-edgecom-design/SKILL.md
  curl -fsSL https://design.edgecom.ai/skills/audit-edgecom-ui/SKILL.md -o .claude/skills/audit-edgecom-ui/SKILL.md
  ```

<!-- @@GENERATED:contracts — from src/docs/generated/contracts.json by scripts/gen-agents-md.mjs (run `pnpm docs:gen`); do not hand-edit until the closing marker -->

Contracts at **v3.0.0**, digest `2f1b57dd5e4c54fd` — 65 components, 13 with authored selection criteria. The version and digest are stamped into every file below; a design or an app built against a different digest is working from a different system.

| Address | What it is |
|---|---|
| [contracts/index.json](https://design.edgecom.ai/contracts/index.json) | **Start here to resolve an element.** Every component: id, one-line summary, purpose, when to use it and when not, its variants with their options and defaults, its parts, the install command, and the address of its full contract. |
| [contracts/`<id>`.json](https://design.edgecom.ai/contracts/button.json) | One component's full contract — the tokens it reaches, the states it styles, its props, required and forbidden compositions, behaviour in the loading/empty/error/destructive paths, accessibility requirements, anti-patterns. Fetch this for each component you are about to use. |
| [contracts.json](https://design.edgecom.ai/contracts.json) | Every contract in one document, for an audit or a bulk check. |
| [tokens.json](https://design.edgecom.ai/tokens.json) | The token model — every semantic token with its family, light and dark values, aliases, and whether Tailwind can reach it. Compare your installed `theme` against it to detect staleness. |
| [design-manifest.example.json](https://design.edgecom.ai/design-manifest.example.json) | The design handoff manifest — the `<Name>.manifest.json` a Claude Design output ships beside `<Name>.dc.html`, naming the system version and digest it was built against and the registry component, variants and parts behind every element. This is a complete example stamped with the current identity; the schema is [design-manifest.schema.json](https://design.edgecom.ai/schemas/design-manifest.schema.json). |
| [tools/check-design-manifest.mjs](https://design.edgecom.ai/tools/check-design-manifest.mjs) | Dependency-free validator for a manifest: `node check-design-manifest.mjs <Name>.manifest.json` checks its shape, that its version and digest are current, and that every component, variant, part and token it names exists. |
| [schemas/](https://design.edgecom.ai/schemas/contracts.schema.json) | The JSON Schemas the files above validate against. |
| [skills/implement-edgecom-design/SKILL.md](https://design.edgecom.ai/skills/implement-edgecom-design/SKILL.md) | Claude Code skill. Implement product UI from a Claude Design link using the Edgecom design system — resolving designed elements to registry components through their published contracts, installing them, and reconciling design intent against the design-system contracts. Use when given a Claude Design link, a design spec, or a screenshot to build against, in a consuming app. |
| [skills/audit-edgecom-ui/SKILL.md](https://design.edgecom.ai/skills/audit-edgecom-ui/SKILL.md) | Claude Code skill. Audit existing UI against the Edgecom design system — finding hardcoded colours, ad-hoc type, hand-rolled duplicates of registry primitives, wrong status semantics, missing states, stale tokens, and accessibility gaps. Use when reviewing a PR, checking a screen for conformance, or measuring registry adoption in a consuming app. |

**Authored contracts** — purpose, selection criteria, compositions and anti-patterns written by a maintainer: [`alert-dialog`](https://design.edgecom.ai/contracts/alert-dialog.json), [`application-shell`](https://design.edgecom.ai/contracts/application-shell.json), [`badge`](https://design.edgecom.ai/contracts/badge.json), [`button`](https://design.edgecom.ai/contracts/button.json), [`card`](https://design.edgecom.ai/contracts/card.json), [`dialog`](https://design.edgecom.ai/contracts/dialog.json), [`hover-card`](https://design.edgecom.ai/contracts/hover-card.json), [`input`](https://design.edgecom.ai/contracts/input.json), [`select`](https://design.edgecom.ai/contracts/select.json), [`sheet`](https://design.edgecom.ai/contracts/sheet.json), [`sidebar`](https://design.edgecom.ai/contracts/sidebar.json), [`table`](https://design.edgecom.ai/contracts/table.json), [`toast`](https://design.edgecom.ai/contracts/toast.json).

**Derived-only contracts** — the primitive's own variants, tokens, states, parts and props, with no authored guidance yet: [`accordion`](https://design.edgecom.ai/contracts/accordion.json), [`alert`](https://design.edgecom.ai/contracts/alert.json), [`avatar`](https://design.edgecom.ai/contracts/avatar.json), [`banner`](https://design.edgecom.ai/contracts/banner.json), [`breadcrumb`](https://design.edgecom.ai/contracts/breadcrumb.json), [`button-group`](https://design.edgecom.ai/contracts/button-group.json), [`calendar`](https://design.edgecom.ai/contracts/calendar.json), [`category-bar`](https://design.edgecom.ai/contracts/category-bar.json), [`chart`](https://design.edgecom.ai/contracts/chart.json), [`checkbox`](https://design.edgecom.ai/contracts/checkbox.json), [`circular-progress`](https://design.edgecom.ai/contracts/circular-progress.json), [`collapsible`](https://design.edgecom.ai/contracts/collapsible.json), [`combobox`](https://design.edgecom.ai/contracts/combobox.json), [`command`](https://design.edgecom.ai/contracts/command.json), [`context-menu`](https://design.edgecom.ai/contracts/context-menu.json), [`date-picker`](https://design.edgecom.ai/contracts/date-picker.json), [`drawer`](https://design.edgecom.ai/contracts/drawer.json), [`dropdown-menu`](https://design.edgecom.ai/contracts/dropdown-menu.json), [`empty`](https://design.edgecom.ai/contracts/empty.json), [`field`](https://design.edgecom.ai/contracts/field.json), [`input-group`](https://design.edgecom.ai/contracts/input-group.json), [`input-otp`](https://design.edgecom.ai/contracts/input-otp.json), [`label`](https://design.edgecom.ai/contracts/label.json), [`list`](https://design.edgecom.ai/contracts/list.json), [`logo`](https://design.edgecom.ai/contracts/logo.json), [`motion-highlight`](https://design.edgecom.ai/contracts/motion-highlight.json), [`motion-tabs`](https://design.edgecom.ai/contracts/motion-tabs.json), [`multi-select`](https://design.edgecom.ai/contracts/multi-select.json), [`native-select`](https://design.edgecom.ai/contracts/native-select.json), [`navigation-menu`](https://design.edgecom.ai/contracts/navigation-menu.json), [`pagination`](https://design.edgecom.ai/contracts/pagination.json), [`phone-input`](https://design.edgecom.ai/contracts/phone-input.json), [`popover`](https://design.edgecom.ai/contracts/popover.json), [`progress`](https://design.edgecom.ai/contracts/progress.json), [`radio-group`](https://design.edgecom.ai/contracts/radio-group.json), [`resizable`](https://design.edgecom.ai/contracts/resizable.json), [`scroll-area`](https://design.edgecom.ai/contracts/scroll-area.json), [`separator`](https://design.edgecom.ai/contracts/separator.json), [`skeleton`](https://design.edgecom.ai/contracts/skeleton.json), [`slider`](https://design.edgecom.ai/contracts/slider.json), [`sortable`](https://design.edgecom.ai/contracts/sortable.json), [`spinner`](https://design.edgecom.ai/contracts/spinner.json), [`stepper`](https://design.edgecom.ai/contracts/stepper.json), [`switch`](https://design.edgecom.ai/contracts/switch.json), [`tabs`](https://design.edgecom.ai/contracts/tabs.json), [`tags-input`](https://design.edgecom.ai/contracts/tags-input.json), [`tanstack-form`](https://design.edgecom.ai/contracts/tanstack-form.json), [`textarea`](https://design.edgecom.ai/contracts/textarea.json), [`timeline`](https://design.edgecom.ai/contracts/timeline.json), [`toggle`](https://design.edgecom.ai/contracts/toggle.json), [`toggle-group`](https://design.edgecom.ai/contracts/toggle-group.json), [`tooltip`](https://design.edgecom.ai/contracts/tooltip.json). For these, [design.md](https://design.edgecom.ai/design.md) is the selection guidance.

<!-- @@GENERATED:contracts-end -->

## Tokens in a consuming app

- **The `theme` item is copy-on-install.** The first `add` injects the Edgecom light + dark OKLCH tokens (and the `cn` helper) into *your* `globals.css`. This is a **snapshot, not a live link** — if the design system retunes a token later, your app keeps the old value until you re-sync.
- **Re-sync tokens** by re-running the theme install with `--overwrite` (this discards local edits to those files — see [REGISTRY.md](https://github.com/edgecom-ai/design-system/blob/main/REGISTRY.md)). Prefer syncing over hand-editing token values. To tell whether you are stale, read the stamp the install wrote into your `globals.css` — `--edgecom-theme: "<version> <digest>"` in `:root` — and compare it with the `version` and `digest` in [tokens.json](https://design.edgecom.ai/tokens.json). Different means re-sync; tokens.json also carries every token's current light and dark value, so you can see what moved.
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
- **`--chart-legacy-*` is migration-only.** Those tokens exist so a product porting plots operators already read by colour can drop its literals; they have no Tailwind utility and no place in a new feature. New charts use the commodity ramp (`chart-*`, `chart-misc`, `chart-1..5`).
- **Keep overlays dismissible** (dialog/sheet close X); gate **destructive actions** behind an `alert-dialog`.
- **A destructive row action is the `ghost-destructive` button variant** — quiet at rest, tinted on hover, correct in both themes. Don't compose one from `ghost` plus destructive utilities.
- **Confirm actions with the matching semantic `toast`** variant; one `<Toaster>` per app; every toast has a title.
- **Surface validation inline** (`FieldError` + `aria-invalid`); handle **loading/empty/error** with `skeleton`/`spinner`/`empty` (+ retry on async failure).
- **Active nav/menu items use the built-in neutral highlight**, not brand blue.
- **Don't restack overlays.** Three layers only: page `0`–`20`, overlay `z-50` (modals *and* anchored surfaces), tooltip `z-60`. Portals mount at the end of `<body>`, so a popover opened from inside a dialog already paints above it — reach for a higher z-index and you'll break something else instead.

## Do-nots (consumer)

- Don't hand-write a component the registry already provides — import it; if none fits, STOP and ask.
- Don't resolve a designed element by eye, or pick a variant from memory — the contract is one fetch away and its variant list is the truth.
- Don't add third-party component libraries or dependencies unless explicitly requested or required by a registry component.
- Don't add icon libraries other than lucide-react.
- Don't copy/paste, fork, or reach into a primitive's internals — compose it and extend via its variants / `size` props.
- Don't hand-edit copied token values — re-sync from the registry (`add --overwrite`).
- Don't hardcode hex or ship light-only UI — every color is a light+dark token; test both.
- Don't skip [design.md](https://design.edgecom.ai/design.md) — the usage guardrails there are required, not advisory.
