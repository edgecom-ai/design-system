<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Edgecom Design System — maintainer guide

**This file is for people (and agents) developing _this repo_** — authoring primitives, tuning tokens, and running the docs site / registry build. If instead you're **consuming** the design system in another app, read [AGENTS.md](AGENTS.md). For the **design language, tokens, and usage guardrails**, read [design.md](design.md) (published at [design.edgecom.ai/design.md](https://design.edgecom.ai/design.md)). For how the registry is consumed, hosted, and updated in depth, see [REGISTRY.md](REGISTRY.md).

This repo is two things at once: a **Next.js 16 docs site** and the **source of truth for the public `edgecom-ai/design-system` shadcn registry**.

> When you author or change any UI here (a primitive, a demo, a doc page), you are also *building with the design system* — follow [design.md](design.md) as well as this file.

## Getting set up

- **Package manager: pnpm 11.10.0** — pinned via the `packageManager` field; CI installs it through `pnpm/action-setup`. Not npm, not an older pnpm. If pnpm is missing or the wrong version, the pin makes pnpm auto-switch (or run `npm install -g pnpm@11`).
- After cloning: `pnpm install` (`--frozen-lockfile` in CI).
- The browser preview launches the dev server from `.claude/launch.json`; its `runtimeExecutable` must resolve to a real pnpm binary on the current machine.

| Script | Does |
|---|---|
| `pnpm dev` | Docs site at `:3000`. `predev` runs `docs:gen` first. |
| `pnpm build` | Static export to `out/`. `prebuild` runs `docs:gen` **and** `registry:build` first. |
| `pnpm lint` | ESLint (Next core-web-vitals + TypeScript). |
| `pnpm registry:build` | Regenerate registry from source, `shadcn build`, then `registry:check`. |
| `pnpm registry:check` | Audit built items for imports their manifest doesn't declare, and for registry dependencies no item provides. |
| `pnpm docs:gen` | Regenerate all docs-source / api / routes / changelog artifacts. |
| `pnpm docs:changelog` | Regenerate the changelog from git history (part of `docs:gen`). |

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
- **Tailwind v4 + OKLCH tokens.** There is no `tailwind.config.js`; `src/app/globals.css` is the single source of truth for tokens. **Never hardcode hex** — use a semantic utility (`bg-primary`, `text-muted-foreground`, …). Adding or tuning a color means editing `globals.css`, not the call site (see *Editing tokens* below). Token semantics and the accessibility bar live in [design.md](design.md).
- **lucide-react is the only icon library.** Don't add other icon packages.

### Authoring a UI primitive (`src/components/ui/*.tsx`)

Match the existing files — canonical examples are [`button.tsx`](src/components/ui/button.tsx), [`alert.tsx`](src/components/ui/alert.tsx), [`badge.tsx`](src/components/ui/badge.tsx):

- **Function declarations, not `forwardRef`.** React 19 passes `ref` as a normal prop; Base UI primitives already accept it.
- **Double quotes, no semicolons.** This matters beyond style for the **import specifiers**: `shadcn add` rewrites `@/components/ui/*` to the consumer's alias, and single-quoted specifiers have been reported to rewrite wrong (a path that resolves to nothing). Registry-shipped sources — `src/components/ui/*`, `src/hooks/*` — keep double-quoted specifiers even where a vendored file is otherwise single-quoted.
- **`cva`** (`class-variance-authority`) for variants; type props as `React.ComponentProps<"div">` (plain elements) or the primitive's own type (e.g. `ButtonPrimitive.Props`, `DialogPrimitive.Popup.Props`) **intersected with** `VariantProps<typeof xVariants>`. Add component-specific props via intersection (e.g. `& { size?: "sm" | "default" }`).
- **`cn()`** from [`@/lib/utils`](src/lib/utils.ts) to compose classes.
- **A `data-slot` on every element** — styling hooks and sibling/child selectors depend on them.
- **Re-export** the wrapped primitives (and any `*Variants`) in a single `export { … }` block at the end of the file; never export the raw primitive.
- For a component that must render as a different tag, use the `useRender` + `mergeProps` polymorphic pattern (see [`badge.tsx`](src/components/ui/badge.tsx)).

### Demos (`src/components/demo/*.tsx`)

- **Named export**, PascalCase ending in `Demo`, matching the filename (e.g. `export function SheetDemo()`).
- `"use client"` **only** when the demo is interactive.
- Use Edgecom domain copy (sites, meters, commodities, kW) — not lorem ipsum.

## Editing tokens (`src/app/globals.css`)

All tokens live in [`src/app/globals.css`](src/app/globals.css): `@theme inline` maps each Tailwind utility to a CSS var, with light values in `:root` and dark in `.dark`. The token families, the WCAG bar, and *which token to reach for* are documented in [design.md](design.md) — this section is the mechanics of changing them here.

- **Adding or adjusting a color means editing `globals.css` (both `:root` **and** `.dark`), not the call site.** `:root` is the complete light token set; `.dark` overrides only the tokens that differ (the rest inherit). If a new token needs a distinct dark value, add it to `.dark` too — don't assume the light value carries.
- Expose a new token to Tailwind by adding its `--color-*: var(--…)` mapping in the `@theme inline` block.
- Some rules in `globals.css` are **app-level CSS the `theme` registry item does _not_ ship** — the `cursor: pointer` base-layer rule, `color-scheme`, and the `@utility tabular` helper. Keep them here; consuming apps must add their own (see [AGENTS.md](AGENTS.md)).
- After any token change, run `pnpm registry:build` so the `theme` item regenerates.
- The live **Foundations → Semantic colors** page is the interactive reference + contrast meter — verify new/tuned colors there in **both** light and dark.

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
| `src/docs/generated/changelog.ts`, `CHANGELOG.md`, `public/changelog.md` | `docs:changelog` | git history + `src/docs/changelog-notes.json` |

Note: `src/docs/api.ts`, `src/docs/curated.ts`, and `src/docs/changelog-notes.json` are **hand-written** sources — distinct from the generated `src/docs/generated/*`.

## The changelog maintains itself

The **Getting Started → Changelog** page is derived from git, not hand-written, so it can't drift from what the registry ships. [`scripts/gen-changelog.mjs`](scripts/gen-changelog.mjs) runs inside `docs:gen` — every `pnpm dev` and every CI deploy rewrites it from the commits on `main`.

What that asks of you when you commit:

- **Write a conventional-commit subject** — `type(scope): summary`. The `type` picks the group the entry lands in (`feat` → Added, `fix` → Fixed, `perf` → Performance, `refactor`/`revert`/`style` → Changed, `docs` → Documentation, `build`/`chore`/`ci`/`test` → Internal; anything unparsed falls into Changed). A `!` before the colon, or a `BREAKING CHANGE:` body line, promotes it to **Breaking**.
- **Write the summary for a reader of the docs site**, not for the diff — it is published verbatim.
- The **affected registry items are inferred from the files you touched** (`src/components/ui/*.tsx`, `src/hooks/*`, and `globals.css` → `theme`), so they're right without you listing them.

Two curation escape hatches:

- A **`Changelog:` commit trailer** — `Changelog: skip` drops the commit from the page; any other value replaces its headline. Use it at commit time.
- [`src/docs/changelog-notes.json`](src/docs/changelog-notes.json) — retroactive `hide` / `rewrite` by sha, plus a `title` and `summary` per release. Use it for history that is already written; a release `summary` is the one place to say *why* a batch of commits matters.

Releases are cut at **git tags** (`git tag v1.2.0` — the tagged commit is the newest of its release, commits after the newest tag show as **Unreleased**). Until the repo is tagged, entries group **by date** instead, so the page works from day one.

Two things to keep intact:

- The Pages workflow checks out with **`fetch-depth: 0`**. A shallow checkout sees one commit; the generator detects that (and a non-git tree) and keeps the committed changelog rather than truncating it, but the deploy would then go stale.
- `CHANGELOG.md` and `public/changelog.md` are **generated mirrors** — served at [design.edgecom.ai/changelog.md](https://design.edgecom.ai/changelog.md) and linked from `llms.txt` so consuming agents can diff against what they remember. Edit `changelog-notes.json`, never the markdown.

## shadcn-studio components (`src/components/shadcn-studio/**`)

These are **docs demos, not registry items** — vendor-imported from shadcn-studio, so they use default exports, arrow functions, and a single-quote style that differs from the house style. Leave that style as-is (don't reformat), and **don't `--overwrite`** our custom `src/components/ui` primitives when pulling upstream studio components. They're consumed only by the doc pages.

## Docs-site architecture (static export)

The site is a **static export** (`output: "export"` in [`next.config.ts`](next.config.ts)), built and published on push to `main` (see [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)) and served at the **root of the custom domain [design.edgecom.ai](https://design.edgecom.ai)** (no base path in the CI deploy). Files placed in `public/` get clean URLs at that root — e.g. `public/design.md` → `https://design.edgecom.ai/design.md`, `public/llms.txt` → `https://design.edgecom.ai/llms.txt`.

- The chrome (sidebar + header + content) renders **once** from [`src/app/(docs)/layout.tsx`](src/app/(docs)/layout.tsx) — a route-group layout — so the sidebar persists across navigations instead of remounting.
- [`src/app/(docs)/[group]/[slug]/page.tsx`](src/app/(docs)/[group]/[slug]/page.tsx) returns `null` but **must keep `generateStaticParams()`** (from `src/docs/generated/routes.ts`) — static export requires it to prerender one HTML file per section.
- **Don't move `DocsShell` back into the page** (it remounts → the sidebar scroll jumps to top on every click) and **don't drop `generateStaticParams`** (the static build fails).
- `basePath` / `NEXT_PUBLIC_BASE_PATH` (from the optional `PAGES_BASE_PATH`) prefix asset and runtime-fetch URLs when serving under a sub-path; it's unset for local `pnpm dev` and the CI deploy, which both serve from `/`.
- The `design.edgecom.ai` domain is configured in GitHub Pages settings — there is **no `CNAME` file** in the repo. A `public/` regeneration must not add or clobber one.

## Verifying changes

There is **no test framework** in this repo. The quality gates are:
- `pnpm lint` (ESLint) and TypeScript **strict** (`npx tsc --noEmit`, or via `pnpm build`).
- For anything visible, use the browser preview and check **both light and dark**.
- A full `pnpm build` also validates the static-export prerender end-to-end.

## Do-nots (maintainer)

- Don't hand-edit generated files (see the table above) — edit the source and regenerate.
- Don't hand-edit `CHANGELOG.md` / `public/changelog.md`, and don't drop `fetch-depth: 0` from the Pages workflow — both break the self-maintaining changelog.
- Don't `--overwrite` our custom `src/components/ui` primitives when pulling shadcn-studio components, and don't reformat vendored studio files.
- Don't add icon libraries other than lucide-react.
- Don't edit a token in only one of `:root` / `.dark` — set both (or confirm the light value is meant to inherit).
- Don't move `DocsShell` into the page or drop `generateStaticParams()` — you break sidebar persistence / the static build.
- Never print the values in `.env.local`.
- Keep the `nextjs-agent-rules` block at the top of this file intact.

---

_Building UI (primitives, demos, doc pages) still follows the full design guardrails in [design.md](design.md) — this file only covers repo mechanics._
