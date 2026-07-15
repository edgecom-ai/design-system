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
- **Discover first, then install.** Check what exists (`shadcn list` / `shadcn view` against the registry) — the installable set is the **64 UI primitives + `theme` + `use-mobile`** — then `shadcn add` it. Don't copy/paste or reimplement a primitive. The `theme` (OKLCH tokens) rides along on the first install.
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
- **Contrast in both themes.** Hold WCAG AA (4.5:1 text, 3:1 large text / UI) and AAA where the palette allows — light and dark alike. Verify new or tuned colors in both (the live **Semantic colors** page has a contrast meter).
- **Mechanics.** Dark mode is the `.dark` class on the `<html>` root; portaled content (dropdown, popover, tooltip, toast) inherits it — don't build light-only components. Adding or adjusting a color means editing `globals.css` (both `:root` **and** `.dark`), not the call site.
- **Always test both light and dark** before shipping anything visible.

### Interaction patterns & feedback

- **Buttons need real hover (and focus) states.** Use the design-system `button` — its variants ship hover + focus-ring styling for free. If you build any custom clickable control, it must have a visible `hover:` state and a focus ring (`--ring`); never ship a flat, stateless button.
- **Pick the right overlay — dialog vs. sheet.** Match the surface to the amount of input:
  - **Short create actions (1–4 fields) → modal `dialog`** — quick, centered, focused.
  - **Longer edit/update actions (many fields) → right-side `sheet`** — room for dense forms without a cramped modal.
  - Both are Base UI primitives: trigger via the `render` prop, and portaled content inherits dark mode.
- **Always surface validation / error states — never fail silently.** If a required field is empty when the user tries to proceed, show inline error text that names what's missing (e.g. "Site name is required") next to the field — not just a generic toast or a blocked button with no explanation.
  - Wire it through the `field` component's `FieldError` slot and set `aria-invalid` on the input; the `input` / `select` primitives already render the destructive border + ring from `aria-invalid`.
  - Use the destructive token for the message (the `-emphasis` variant when it's text — see *Design tokens & accessibility*), and pair color with text/icon — never color alone.
  - This complements the loading / empty / error-state guardrail (`skeleton` / `spinner` / `empty`).

### Other guardrails

- **Accessibility.** Rely on Base UI primitives for interactive widgets — don't reimplement them (you lose keyboard/ARIA support). Keep a visible focus ring via `--ring` (never `outline: none` with no replacement), label form fields, and give images alt text.
- **Loading / empty / error states.** Use the provided `skeleton`, `spinner`, and `empty` components; don't ship raw loading gaps or unhandled empty/error states.
- **Use the scales, not magic numbers.** Prefer the spacing, `radius-*`, and type scales over arbitrary px, Tailwind `[...]` arbitrary values, or inline `style`.
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

The site is a **static export** (`output: "export"` in [`next.config.ts`](next.config.ts)), built and published on push to `main` (see [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)) and served at its custom domain **[design.edgecom.ai](https://design.edgecom.ai)** (root path).

- The chrome (sidebar + header + content) renders **once** from [`src/app/(docs)/layout.tsx`](src/app/(docs)/layout.tsx) — a route-group layout — so the sidebar persists across navigations instead of remounting.
- [`src/app/(docs)/[group]/[slug]/page.tsx`](src/app/(docs)/[group]/[slug]/page.tsx) returns `null` but **must keep `generateStaticParams()`** (from `src/docs/generated/routes.ts`) — static export requires it to prerender one HTML file per section.
- **Don't move `DocsShell` back into the page** (it remounts → the sidebar scroll jumps to top on every click) and **don't drop `generateStaticParams`** (the static build fails).
- `basePath` / `NEXT_PUBLIC_BASE_PATH` (from `PAGES_BASE_PATH`) prefix asset and runtime-fetch URLs when the site is served under a sub-path (e.g. the legacy `…github.io/design-system` path); the production domain and local `pnpm dev` both serve at `/`.

## Verifying changes

There is **no test framework** in this repo. The quality gates are:
- `pnpm lint` (ESLint) and TypeScript **strict** (`npx tsc --noEmit`, or via `pnpm build`).
- For anything visible, use the browser preview and check **both light and dark**.
- A full `pnpm build` also validates the static-export prerender end-to-end.

## Do-nots

- Don't hand-write a component the registry already provides — import it; if none fits, stop and ask.
- Don't ship a button or interactive control without a visible hover + focus state.
- Don't cram a long, many-field form into a centered modal — use a right sheet; keep dialogs for short (1–4 field) create actions.
- Don't block a user on validation without inline, specific error text (name the missing field) and `aria-invalid`.
- Don't hardcode colors or ship light-only UI — every color is a light+dark token; test both.
- Don't pin sizes to px — use the rem type / spacing / radius scales.
- Don't hardcode hex — use semantic tokens.
- Don't hand-edit generated files (see the table above).
- Don't `--overwrite` custom primitives when pulling shadcn-studio components.
- Don't add icon libraries other than lucide-react.
- Never print the values in `.env.local`.
- Keep the `nextjs-agent-rules` block at the top of this file intact.
