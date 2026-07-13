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

The site is a **static export** (`output: "export"` in [`next.config.ts`](next.config.ts)) deployed to GitHub Pages via [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) on push to `main`.

- The chrome (sidebar + header + content) renders **once** from [`src/app/(docs)/layout.tsx`](src/app/(docs)/layout.tsx) — a route-group layout — so the sidebar persists across navigations instead of remounting.
- [`src/app/(docs)/[group]/[slug]/page.tsx`](src/app/(docs)/[group]/[slug]/page.tsx) returns `null` but **must keep `generateStaticParams()`** (from `src/docs/generated/routes.ts`) — static export requires it to prerender one HTML file per section.
- **Don't move `DocsShell` back into the page** (it remounts → the sidebar scroll jumps to top on every click) and **don't drop `generateStaticParams`** (the static build fails).
- `basePath` / `NEXT_PUBLIC_BASE_PATH` prefix asset and runtime-fetch URLs for the `/design-system` GitHub Pages path; local `pnpm dev` stays at `/`.

## Verifying changes

There is **no test framework** in this repo. The quality gates are:
- `pnpm lint` (ESLint) and TypeScript **strict** (`npx tsc --noEmit`, or via `pnpm build`).
- For anything visible, use the browser preview and check **both light and dark**.
- A full `pnpm build` also validates the static-export prerender end-to-end.

## Do-nots

- Don't hardcode hex — use semantic tokens.
- Don't hand-edit generated files (see the table above).
- Don't `--overwrite` custom primitives when pulling shadcn-studio components.
- Don't add icon libraries other than lucide-react.
- Never print the values in `.env.local`.
- Keep the `nextjs-agent-rules` block at the top of this file intact.
