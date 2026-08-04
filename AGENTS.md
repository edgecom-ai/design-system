<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Edgecom Design System — contributor guide

This repo is two things at once: a **Next.js 16 docs site** and the **source of truth for the public `edgecom-ai/design-system` shadcn registry**. This file is the house style and workflow guide for anyone (human or AI agent) making changes here. For how the registry is consumed, hosted, and updated in depth, see [REGISTRY.md](REGISTRY.md).

## Getting set up

- **Package manager: pnpm 11.10.0** — pinned via the `packageManager` field; CI installs it through `pnpm/action-setup`. Not npm, not an older pnpm. If pnpm is missing or the wrong version, the pin makes pnpm auto-switch (or run `npm install -g pnpm@11`).
- After cloning: `pnpm install` (`--frozen-lockfile` in CI).
- The browser preview launches the dev server from `.claude/launch.json`; its `runtimeExecutable` must resolve to a real pnpm binary on the current machine.

| Script | Does |
|---|---|
| `pnpm dev` | Docs site at `:3000`. `predev` runs `docs:gen` first. |
| `pnpm build` | Static export to `out/`. `prebuild` runs `docs:gen` **and** `registry:build` first. |
| `pnpm lint` | ESLint (Next core-web-vitals + TypeScript). |
| `pnpm registry:build` | Regenerate registry from source, then `shadcn build`. |
| `pnpm docs:gen` | Regenerate all docs-source / api / routes artifacts. |

You rarely run the generators by hand — `predev`/`prebuild` do it. Run `pnpm registry:build` yourself after changing a component or token so the generated registry reflects it.

## Stack & house style

- **Next.js 16** — breaking changes vs. training data; read `node_modules/next/dist/docs/` before writing Next code (see the block up top).
- **Base UI, not Radix.** The package is **`@base-ui/react`**, imported per subpath (e.g. `@base-ui/react/dialog`, `@base-ui/react/button`). Pass a trigger via the **`render` prop** — there is no `asChild`:
  ```tsx
  // ✅ Base UI
  <DialogTrigger render={<Button>Open</Button>} />
  // ❌ not Radix-style
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  ```
  Base UI exposes orientation as **`data-orientation="horizontal|vertical"`** — style it with the value-matched **`data-[orientation=…]`** variant (and its `group-data-[orientation=…]/name` composed forms), **never** bare `data-horizontal`/`data-vertical` (in Tailwind v4 those silently compile to `[data-horizontal]` presence selectors that never match, so the styles are dead).
- **Tailwind v4 + OKLCH tokens.** There is no `tailwind.config.js`; `src/app/globals.css` is the single source of truth for tokens. **Never hardcode hex** — use a semantic utility (`bg-primary`, `text-muted-foreground`, …). Adding or tuning a color means editing `globals.css`, not the call site.
- **lucide-react is the only icon library.** Don't add other icon packages.

### Authoring a UI primitive (`src/components/ui/*.tsx`)

Match the existing files — canonical examples are [`button.tsx`](src/components/ui/button.tsx), [`alert.tsx`](src/components/ui/alert.tsx), [`badge.tsx`](src/components/ui/badge.tsx):

- **Function declarations, not `forwardRef`.** React 19 passes `ref` as a normal prop; Base UI primitives already accept it.
- **Double quotes, no semicolons.**
- **`cva`** (`class-variance-authority`) for variants; type props as `React.ComponentProps<"div">` (plain elements) or the primitive's own type (e.g. `ButtonPrimitive.Props`, `DialogPrimitive.Popup.Props`) **intersected with** `VariantProps<typeof xVariants>`. Add component-specific props via intersection (e.g. `& { size?: "sm" | "default" }`).
- **`cn()`** from [`@/lib/utils`](src/lib/utils.ts) to compose classes.
- **A `data-slot` on every element** — styling hooks and sibling/child selectors depend on them.
- **Re-export** the wrapped primitives (and any `*Variants`) in a single `export { … }` block at the end of the file; never export the raw primitive.
- For a component that must render as a different tag, use the `useRender` + `mergeProps` polymorphic pattern (see [`badge.tsx`](src/components/ui/badge.tsx)).

### Demos (`src/components/demo/*.tsx`)

- **Named export**, PascalCase ending in `Demo`, matching the filename (e.g. `export function SheetDemo()`).
- `"use client"` **only** when the demo is interactive.
- Use Edgecom domain copy (sites, meters, commodities, kW) — not lorem ipsum.

## Design tokens & accessibility

All tokens live in [`src/app/globals.css`](src/app/globals.css): `@theme inline` maps each Tailwind utility to a CSS var, with light values in `:root` and dark in `.dark`. The live **Foundations → Semantic colors** page is the interactive reference.

Token families:
- **Surfaces:** `background`, `foreground`, `card`, `popover`, `elevated` (+ their `-foreground`).
- **Brand / neutral:** `primary` (+ `-foreground`, `-emphasis`, `-subtle`, `-subtle-foreground`), `secondary`, `muted`, `accent`.
- **Status:** `success`, `warning`, `info`, `destructive` — each with the full set `{ base, -foreground, -emphasis, -subtle, -subtle-foreground }`.
- **Form / outline:** `border`, `input`, `ring`.
- **Charts:** `chart-1..5`, aliasing the `500` step of the commodity ramps `chart-{electricity,water,gas,temperature,emissions}-{100..900}` (mode-independent).
- **Sidebar:** `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-accent`, `sidebar-border`, `sidebar-ring` (+ foregrounds).
- **Type scale:** `text-{caption,body,body-lg,title,heading,display}` (size + line-height + weight + tracking). **Radius scale:** `radius-{sm..4xl}`.

Accessibility bar (mirror the site's **Accessibility** doc):
- **WCAG AA minimum** — 4.5:1 for body text, 3:1 for large text / UI — and **AAA where the palette allows**. Light and dark held to the same bar.
- Use `*-emphasis` when a status color is rendered **as text or a thin icon**; use `*-subtle` (+ `-subtle-foreground`) for tinted surfaces.
- The type scale is in `rem` — don't pin sizes to px.
- Focus rings use the `--ring` token (it's a focus-outline color, not a fill).

## UI guardrails — building with the design system

These apply whenever you build UI with these components (in this repo or a consuming app). The registry install address is configured per app — see [REGISTRY.md](REGISTRY.md); the commands below are generic.

### Import from the registry — don't recreate

- **Use the existing component.** Never hand-write your own version of something the design system already provides (button, dialog, input, table, …). Reuse over recreation.
- **No third-party components or dependencies unless asked or required.** Don't pull in an outside UI-component library or add an npm dependency unless (a) the user explicitly requests it, or (b) it's already required by a registry component (package deps and `registryDependencies` are inferred from imports — see [REGISTRY.md](REGISTRY.md) §3). Reach for the registry primitives and Base UI first.
- **Discover before you build — don't reimplement what exists.** Find the component first:
  - **In this repo:** the source of truth is [`src/components/ui/*`](src/components/ui) — grep there. You author primitives here, so don't `shadcn add`.
  - **Catalog:** browse every component (light / dark, with code) at [edgecom-ai.github.io/design-system](https://edgecom-ai.github.io/design-system/) — useful for agents without a shell (e.g. Claude Design).
  - The installable set is the **64 UI primitives + `theme` + `use-mobile`**; `theme` (OKLCH tokens) rides along on the first `add`. Don't copy/paste or reimplement a primitive.
- **Compose, don't reinvent.** Build higher-level patterns (blocks, page sections) from the installed primitives — blocks are **not** registry items.
- **No suitable component → STOP and ask (mandatory).** Do not silently hand-roll a bespoke component. Prompt the user with three options and proceed only after they choose: (a) adapt the closest existing registry component, (b) request it be added to the design system, or (c) get explicit approval for a documented, clearly-marked local one-off.
- **In this repo** you author primitives rather than install them — the analog rule is: reuse or extend an existing [`src/components/ui/*`](src/components/ui) primitive (or a `shadcn-studio` demo pattern) before adding a new one; don't duplicate.

### Responsiveness & scaling

- **Mobile-first.** Build for small screens first and layer up with Tailwind breakpoints (`sm`/`md`/`lg`/`xl`/`2xl`); no desktop-only layouts.
- **Relative units, not fixed px.** Use the `rem`-based type scale (`text-caption`…`text-display`) and the spacing / `radius-*` scales; don't pin font sizes or container dimensions to px.
- **Fluid layout.** Flex/grid with `min-w-0`, `max-w-*`, and wrapping so content reflows — it must never clip or force horizontal page scroll. Wide content (tables, code) scrolls inside its own `overflow-x-auto` container.
- **Reuse breakpoint logic.** Use the `use-mobile` hook (`useIsMobile`, 768px) for conditional rendering instead of ad-hoc `matchMedia`.
- **Touch targets & media.** Keep adequate hit areas on touch; `max-w-full` on images/media so nothing overflows.

### Dark mode & theming

- **Every color is a semantic token** with both light (`:root`) and dark (`.dark`) values in [`globals.css`](src/app/globals.css) — never hardcode hex or one-off colors; they won't adapt to dark.
- **Right token for the job.** Surfaces (`background`/`card`/`popover`/`elevated`) with their `-foreground` for text; `-emphasis` for a status color rendered as text or a thin icon; `-subtle` (+ `-subtle-foreground`) for tinted surfaces. Don't use a base fill color as a text color.
- **Primary blue is mode-independent.** The brand blue (`--primary` — `bg-primary` fills and buttons) is deliberately the **same value in light and dark**; don't lighten or re-tune it in `.dark` the way most tokens shift. If you need a lighter primary as **text** in dark mode, use `--primary-emphasis`, never a lightened base.
- **Contrast in both themes.** Hold WCAG AA (4.5:1 text, 3:1 large text / UI) and AAA where the palette allows — light and dark alike. Verify new or tuned colors in both (the live **Semantic colors** page has a contrast meter).
- **Overlay surfaces sit *above* cards in dark mode.** `--popover` must be lighter than `--card`, not equal to it — an overlay at the same lightness as the cards behind it reads flat and the dialog edge disappears. Dark values: `--card` 0.205, `--popover` 0.265, `--elevated` 0.29.
- **Modal scrims use the `--scrim` token**, never an inline `oklch(… / 0.4)`. Light `oklch(0.16 0.01 254 / 0.4)`; dark `oklch(0.08 0.008 254 / 0.7)` — dark needs the deeper scrim because the surfaces themselves are close in lightness.
- **`-subtle` status pairs must clear 4.5:1 in dark too.** A `-subtle` surface and its `-subtle-foreground` must clear 4.5:1 in dark as well as light. Where the light pair is `-subtle` + `-emphasis`, dark usually needs its **own explicit `-subtle-foreground`** — the light-mode `-emphasis` value is often too dark against a dark tinted surface. e.g. dark destructive: surface `oklch(0.27 0.072 27)`, text `oklch(0.87 0.11 22)`.
- **Mechanics.** Dark mode is the `.dark` class on the `<html>` root; portaled content (dropdown, popover, tooltip, toast) inherits it — don't build light-only components. Adding or adjusting a color means editing `globals.css` (both `:root` **and** `.dark`), not the call site.
- **Always test both light and dark** before shipping anything visible.

### Interaction patterns & feedback

- **Buttons need real hover (and focus) states.** Use the design-system `button` — its variants ship hover + focus-ring styling for free. If you build any custom clickable control, it must have a visible `hover:` state and a focus ring (`--ring`); never ship a flat, stateless button.
- **Ensure `cursor: pointer` on buttons (Tailwind v4).** Tailwind v4 dropped the default pointer cursor, so buttons look non-clickable. A base-layer rule in [`globals.css`](src/app/globals.css) restores it — keep it. It's **app-level CSS not shipped by the `theme` item** (like the `color-scheme` / `@utility tabular` bits), so every consuming app must add the same rule to its own `globals.css`:
  ```css
  @layer base {
    button:not(:disabled),
    [role="button"]:not(:disabled) { cursor: pointer; }
  }
  ```
- **Pick the right overlay — dialog vs. sheet.** Match the surface to the amount of input:
  - **Short create actions (1–4 fields) → modal `dialog`** — quick, centered, focused.
  - **Longer edit/update actions (many fields) → right-side `sheet`** — room for dense forms without a cramped modal.
  - **Right-sheet width: default to 420px** (`w-[420px]` / `sm:max-w-[420px]`, full-width on mobile). The primitive ships wider (`w-3/4`, `sm:max-w-sm`), so set this explicitly; only go wider when specific content genuinely needs the room.
  - Both are Base UI primitives: trigger via the `render` prop, and portaled content inherits dark mode.
- **Overlays: hidden by default, mounted at the root.** An overlay's hidden state must be the authored default (`display: none` in the style) with the visible state applied on top — never rely on a bound value alone to hide a `position: fixed; inset: 0` element; an unresolved value leaves the modal stuck open over the app. Mount overlays at the app/template root, not inside a screen/tab subtree, so their fixed positioning and visibility never depend on the current view.
- **Always surface validation / error states — never fail silently.** If a required field is empty when the user tries to proceed, show inline error text that names what's missing (e.g. "Site name is required") next to the field — not just a generic toast or a blocked button with no explanation.
  - Wire it through the `field` component's `FieldError` slot and set `aria-invalid` on the input; the `input` / `select` primitives already render the destructive border + ring from `aria-invalid`.
  - Use the destructive token for the message (the `-emphasis` variant when it's text — see *Design tokens & accessibility*), and pair color with text/icon — never color alone.
  - This complements the loading / empty / error-state guardrail (`skeleton` / `spinner` / `empty`).

- **Confirm with a toast — using the semantic variant.** Any interaction that needs feedback fires a `toast` (`sonner`): immediate actions especially (a `switch` / toggle must confirm on/off), and a completed save/submit should `toast.success`. **Match the variant to the outcome** (see [`toast-demo.tsx`](src/components/demo/toast-demo.tsx)) — `toast.success` for confirmation, `toast.warning` for caution or a negative-but-expected outcome (e.g. a declined request), `toast.error` **only** for genuine failures (a sync or save that didn't complete). Never a neutral `toast()` for a success/error result.
- **One toast surface per app.** Two independently mounted toasters both anchored bottom-right overlap and render on top of each other — mount a single `<Toaster>` and route every call through the same helper.
- **A toast always carries a title;** the description row is conditionally rendered and collapses when empty — never an icon-and-dismiss card with no text.
- **Keep a gap between menu items.** An active item and a hovered neighbor must read as two distinct rows, never one merged block — space items (e.g. `gap-1`) in `sidebar`, `dropdown-menu`, `command`, and any similar list so the active highlight and an adjacent hover highlight never touch.

### Component usage conventions

- **Badge variants — pick by meaning; default to `outline`.** The `badge` tone is not decorative.
  - **Neutral labels → `outline`.** Any neutral badge uses `outline`; when unsure which to use, use `outline`.
  - **Key highlight → `default` (primary).** Reserve the primary-colored `default` variant for a single key highlight (e.g. the current season/period) — not routine labels.
  - **Commodities → the commodity variants only.** Use `electricity`, `water`, `gas`, `temperature`, `emissions` strictly to tag that commodity. Electricity-derived metrics (voltage, current, THD, power factor) may use `electricity`.
  - **Info → `info`.** Use `info` for informational tags (and `success`/`warning`/`destructive` for genuine status).
- **Status colors — use strictly by meaning.** `destructive` for errors and destructive actions, `success` for positive confirmation, `warning` for caution, `info` for information — consistently across every surface (badges, alerts, toasts, text, icons). Never an arbitrary red / green / yellow, and never a status color used decoratively; pick the token by meaning and let *Design tokens & accessibility* choose the shade.
- **Active / selected states use the built-in highlight — not brand blue.** An active nav / menu / tab / sidebar item is signalled by the component's own active styling (`isActive` / `data-active` → the neutral `accent` / `sidebar-accent` surface) while its **text and icon stay `foreground`**. Never recolor the active item's text or icon with `primary`/blue or a custom fill — brand blue is reserved for CTAs and a single key highlight (see the badge rule), not routine active states. Compose navigation from the primitive's parts (`sidebar`: `SidebarGroupLabel`, `SidebarMenuButton isActive`, `SidebarMenuSub` for subpages) rather than hand-rolling the highlight or flattening the structure.
- **The active-highlight surface must read as a light-blue tint in both themes — including dark.** The active/hover surface (`accent` / `sidebar-accent`) should be a subtle **light blue**, never a near-neutral dark grey (a common dark-mode drift where the highlight barely lifts off the sidebar). If it looks too dark, the fix is to tune `--accent` / `--sidebar-accent` in `.dark` in [`globals.css`](src/app/globals.css) — the single source for the built-in highlight — **not** a per-component background override.
- **Tables.** Don't add icons to table cells unless explicitly asked — keep cells text-first and scannable. Badges inside cells follow the badge rules above.
- **Table surfaces.** Body rows get a light-blue hover highlight (a subtle `primary` tint). Keep this on the `table` primitive's `TableRow` so every table matches — rely on it rather than restyling per-table.
- **Table edge alignment.** The first and last cell in every row (`th` and `td`) take the container card's horizontal padding (**1.5rem**) on their outer side — not the inner cell padding (**0.75rem**). Column headers, edge-column values, and footer/total rows all sit on the card's content line; never flush to the card border.
- **Horizontally-scrolling tables + row menus.** A table wrapped in `overflow-x-auto` will clip an open row action/context menu (or any popover). While such a menu is open, toggle the wrapper to `overflow: visible` so the menu escapes the table instead of clipping or forcing a scrollbar; restore `overflow-x-auto` on close. **Never** fix this with a `min-height`.
- **Secondary/utility actions use icon buttons.** On table toolbars and page headers, secondary actions (export, upload, download, refresh, filter, print, …) use the design-system `button` as an **icon button** (`size="icon-sm"` / `icon-lg`, usually `variant="outline"` or `ghost`) — not full text buttons. Reserve a labeled button for the page's single primary action. Every icon button needs an `aria-label` and ideally a `tooltip`. (This is toolbar/header chrome — distinct from the no-icons-in-*cells* rule for table content.)
- **Density → reach for hover.** In data-dense **tables, metric tiles, and charts**, keep the primary value visible and move *secondary / detail* information into a `tooltip` (brief) or `hover-card` (richer) — don't cram, shrink text, or clip to fit it all inline.
- **No accent bars — ever.** Never add a colored strip along an edge/border (e.g. `border-l-4 border-l-destructive` on an alert or card) to signal status or draw attention. Use the component's own variant instead — a tinted `-subtle` surface with `-emphasis` text/icon — so status reads consistently and adapts to dark mode.

### Other guardrails

- **Accessibility.** Rely on Base UI primitives for interactive widgets — don't reimplement them (you lose keyboard/ARIA support). Keep a visible focus ring via `--ring` (never `outline: none` with no replacement), label form fields, and give images alt text.
- **Loading / empty / error states.** Use the provided `skeleton`, `spinner`, and `empty` components; don't ship raw loading gaps or unhandled empty/error states.
- **Async / data-fetch failures.** On a failed request or network error, render an explicit error state with a **retry** action (an `empty` state with a retry `button`) — never a blank screen or a spinner that spins forever. For a failed *action* (e.g. a save), surface a `toast` (`sonner`) and keep the user's input intact so they can retry.
- **Use the scales, not magic numbers.** Prefer the spacing, `radius-*`, and type scales over arbitrary px, Tailwind `[...]` arbitrary values, or inline `style`.
- **Adhere to a component's built-in sizing & classes.** Use the sizes and variants a component already exposes (its `cva` variants and `size` props) plus the shared scales — don't invent new sizes or override/replace a component's own Tailwind classes unless the user explicitly asks. Extend through the provided variants, not ad-hoc `className` overrides.
- **Compose, don't fork.** Compose primitives and their `data-slot` hooks; don't copy a primitive to tweak it or reach into its internals fragilely.
- **Motion.** Respect `prefers-reduced-motion`; use the available `motion` / `tw-animate-css` sparingly.

## Adding or changing a component

1. Primitive → `src/components/ui/<name>.tsx` (follow the house style above).
2. Demo → `src/components/demo/<name>-demo.tsx`.
3. Register the section in [`src/app/sections.tsx`](src/app/sections.tsx).
4. Curated API copy → [`src/docs/curated.ts`](src/docs/curated.ts) (shape: `summary` / `parts` / `propDescriptions` / `omitProps`; note this file uses **semicolons + double quotes**).
5. `pnpm registry:build`.

Package deps, cross-component `registryDependencies`, hooks, and the always-on `theme` dependency are all **inferred from imports** — you don't declare them. See [REGISTRY.md](REGISTRY.md) §3 for the full mechanics.

## Generated files — do NOT hand-edit

Edit the **sources**, then run `pnpm registry:build` (or `pnpm docs:gen`). `prebuild`/`predev` regenerate everything automatically.

| Generated (git-tracked) | Produced by | Source |
|---|---|---|
| `registry.json` + `src/**/registry.json` chunks | `registry:gen` | `src/components/ui/*.tsx`, `src/hooks/*`, `globals.css` |
| `public/r/*.json` | `shadcn build` | the registry chunks |
| `src/docs/generated/{api,api-highlight,routes}.ts` | `docs:api` / `docs:routes` | `sections.tsx`, `ui/*`, `docs/api.ts` |
| `public/docs-source/*` (git-**ignored**) | `docs:source` | `components/demo/*`, `components/shadcn-studio/*` |

Note: `src/docs/api.ts` and `src/docs/curated.ts` are **hand-written** sources — distinct from the generated `src/docs/generated/*`.

## shadcn-studio components (`src/components/shadcn-studio/**`)

These are **docs demos, not registry items** — vendor-imported from shadcn-studio, so they use default exports, arrow functions, and a single-quote style that differs from the house style. Leave that style as-is (don't reformat), and **don't `--overwrite`** our custom `src/components/ui` primitives when pulling upstream studio components. They're consumed only by the doc pages.

## Docs-site architecture (static export)

The site is a **static export** (`output: "export"` in [`next.config.ts`](next.config.ts)), built and published on push to `main` (see [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)) and served from GitHub Pages at **[edgecom-ai.github.io/design-system](https://edgecom-ai.github.io/design-system/)** (CI builds with `PAGES_BASE_PATH=/design-system`).

- The chrome (sidebar + header + content) renders **once** from [`src/app/(docs)/layout.tsx`](src/app/(docs)/layout.tsx) — a route-group layout — so the sidebar persists across navigations instead of remounting.
- [`src/app/(docs)/[group]/[slug]/page.tsx`](src/app/(docs)/[group]/[slug]/page.tsx) returns `null` but **must keep `generateStaticParams()`** (from `src/docs/generated/routes.ts`) — static export requires it to prerender one HTML file per section.
- **Don't move `DocsShell` back into the page** (it remounts → the sidebar scroll jumps to top on every click) and **don't drop `generateStaticParams`** (the static build fails).
- `basePath` / `NEXT_PUBLIC_BASE_PATH` (from `PAGES_BASE_PATH`) prefix asset and runtime-fetch URLs for the `/design-system` GitHub Pages path; local `pnpm dev` stays at `/`.

## Verifying changes

There is **no test framework** in this repo. The quality gates are:
- `pnpm lint` (ESLint) and TypeScript **strict** (`npx tsc --noEmit`, or via `pnpm build`).
- For anything visible, use the browser preview and check **both light and dark**.
- A full `pnpm build` also validates the static-export prerender end-to-end.

## Do-nots

- Don't hand-write a component the registry already provides — import it; if none fits, stop and ask.
- Don't pick a colored or commodity badge variant for a neutral label — default to `outline`; commodity variants mean the commodity.
- Don't put icons in table cells unless explicitly asked.
- Don't let edge table cells (first/last `th`/`td`) sit flush to the card border — their outer side aligns to the card's content padding (1.5rem), not the 0.75rem cell padding.
- Don't use full text buttons for secondary table/page actions (export/upload/download/refresh) — use icon buttons (`size="icon-*"`) with an `aria-label`/`tooltip`; keep the labeled button for the primary action.
- Don't fix a row menu/popover clipped by an `overflow-x-auto` table with `min-height` — toggle the wrapper to `overflow: visible` while it's open.
- Don't add accent bars — colored border strips on alerts/cards; use the component's variant (`-subtle` surface + `-emphasis`) instead.
- Don't leave async failures as a blank screen or an endless spinner — show an error state with a retry (or a `toast` for failed actions).
- Don't run an immediate (no-Save) action without a confirming `toast` — e.g. toggles must confirm on/off.
- Don't fire a neutral `toast()` for a success/failure outcome — use the matching semantic variant (`toast.success` / `toast.error` / `toast.warning`).
- Don't mount two toasters or ship a titleless toast — one toast surface per app; every toast has a title.
- Don't make dark `--popover` equal to `--card`, hardcode a modal scrim (`oklch(… / 0.4)`), or hide a `fixed inset-0` overlay with a bound value alone — overlays sit above cards, scrims use `--scrim`, and overlays default to `display: none` mounted at the root.
- Don't let menu/sidebar items sit flush — keep a gap so an active item and a hovered neighbor don't merge.
- Don't recolor active/selected nav items with primary/blue text or icons — use the component's built-in neutral highlight (`isActive` / `data-active`); keep text/icon `foreground`.
- Don't ship a button or interactive control without a visible hover + focus state.
- Don't leave buttons with the Tailwind v4 default (no pointer) — keep the `cursor: pointer` base rule in `globals.css` (and add it in consuming apps).
- Don't cram a long, many-field form into a centered modal — use a right sheet; keep dialogs for short (1–4 field) create actions.
- Don't block a user on validation without inline, specific error text (name the missing field) and `aria-invalid`.
- Don't hardcode colors or ship light-only UI — every color is a light+dark token; test both.
- Don't lighten `--primary` in dark mode — the brand blue is mode-independent; use `-emphasis` for lighter primary *text*.
- Don't pin sizes to px — use the rem type / spacing / radius scales.
- Don't invent new sizes or override a component's built-in Tailwind classes unless explicitly told — use its existing variants / `size` props.
- Don't hardcode hex — use semantic tokens.
- Don't hand-edit generated files (see the table above).
- Don't `--overwrite` custom primitives when pulling shadcn-studio components.
- Don't add icon libraries other than lucide-react.
- Don't add third-party component libraries or dependencies unless explicitly requested or required by a registry component.
- Never print the values in `.env.local`.
- Keep the `nextjs-agent-rules` block at the top of this file intact.
