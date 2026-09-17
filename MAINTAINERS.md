# Edgecom Design System — maintainer guide

**This file is for people (and agents) developing _this repo_** — authoring primitives, tuning tokens, and running the docs site / registry build. If instead you're **consuming** the design system in another app, read [agents.md](https://design.edgecom.ai/agents.md) (source: [public/agents.md](public/agents.md)). For the **design language, tokens, and usage guardrails**, read [design.md](design.md) (published at [design.edgecom.ai/design.md](https://design.edgecom.ai/design.md)). For how the registry is consumed, hosted, and updated in depth, see [REGISTRY.md](REGISTRY.md).

This repo is two things at once: a **Vite + TanStack Router docs site** and the **source of truth for the public `edgecom-ai/design-system` shadcn registry**.

> When you author or change any UI here (a primitive, a demo, a doc page), you are also *building with the design system* — follow [design.md](design.md) as well as this file.

## How agents load this repo

Instructions are layered so that only the routing layer is always in context and the detail loads when it is relevant. When you add a rule, put it in the layer that matches its trigger:

| Layer | File | Loads |
|---|---|---|
| Routing + invariants | [`AGENTS.md`](AGENTS.md), imported by [`CLAUDE.md`](CLAUDE.md) | Every session. **Keep it under ~60 lines.** Only invariants with no file to trigger them belong here. |
| Path-scoped rules | `.claude/rules/*.md` | On demand, when a file matching the rule's `paths:` frontmatter is read. File-specific conventions go here. |
| Skills | `.claude/skills/*/SKILL.md` | On demand, when invoked or when the model judges them relevant. Multi-step procedures go here. |
| Full references | this file, [design.md](design.md), [REGISTRY.md](REGISTRY.md) | When a routing entry or rule points at them. |

Every rule file **must** carry a `paths:` field — a rule without one loads at launch and costs context in every session. Adding a paragraph to `AGENTS.md` is almost never the right move; adding it to a rule usually is.

The consumer guide is deliberately **not** in this layer. It lives at [`public/agents.md`](public/agents.md), served at [design.edgecom.ai/agents.md](https://design.edgecom.ai/agents.md), so an agent working in this repo reads producer instructions and a consuming app is pointed at a stable URL. It is hand-written, not generated — the only hand-written markdown in `public/`.

## Getting set up

- **Package manager: pnpm 11.10.0** — pinned via the `packageManager` field; CI installs it through `pnpm/action-setup`. Not npm, not an older pnpm. If pnpm is missing or the wrong version, the pin makes pnpm auto-switch (or run `npm install -g pnpm@11`).
- After cloning: `pnpm install` (`--frozen-lockfile` in CI).
- The browser preview launches the dev server from `.claude/launch.json`; its `runtimeExecutable` must resolve to a real pnpm binary on the current machine.

| Script | Does |
|---|---|
| `pnpm dev` | Docs site at `:3000`. `predev` runs `docs:gen` first. |
| `pnpm build` | Static export to `out/`. `prebuild` runs `docs:gen` **and** `registry:build` first. |
| `pnpm lint` | ESLint (Next core-web-vitals + TypeScript). |
| `pnpm typecheck` | TypeScript strict, after materialising the generated changelog. |
| `pnpm verify:docs` | Load a sample of built routes in real Chrome, light + dark, and fail on a blank page, a console error, a failed chunk, or a stuck Suspense fallback. Needs a prior `pnpm build`. |
| `pnpm registry:build` | Regenerate registry from source, `shadcn build`, then `registry:check`. |
| `pnpm registry:check` | Audit built items for imports their manifest doesn't declare, dependencies with no version range, registry dependencies no item provides, type tokens paired with a `leading-*`/weight override, and any reference to a `--chart-legacy-*` token (that palette is for migrating existing plots, never a primitive). |
| `pnpm docs:gen` | Regenerate all docs-source / tokens / api / routes / changelog artifacts. |
| `pnpm check:schemas` | Validate the generated artifacts against `schemas/*.schema.json`. |
| `pnpm design:sync` | Rebuild the Claude Design bundle from tokens, `design.md`, and the primitives. Compiles its own stylesheet from `globals.css`; needs a clean tree, not a prior build. |
| `pnpm docs:changelog` | Regenerate the changelog from git history (part of `docs:gen`). |

You rarely run the generators by hand — `predev`/`prebuild` do it. Run `pnpm registry:build` yourself after changing a component or token so the generated registry reflects it.

## Stack & house style

- **Vite + TanStack Router**, a client-rendered SPA built to static files. The route tree is code-based, in `src/router.tsx`; `pnpm build` runs `vite build` and then `scripts/prerender.mjs`, which writes one HTML shell per route so GitHub Pages — which has no server-side fallback — resolves every URL in `llms.txt`. Nothing the registry ships imports from either; keep it that way.
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

## One parser for the tokens

`globals.css` is the authority, and [`scripts/lib/tokens.mjs`](scripts/lib/tokens.mjs) is the only thing that parses it. Three generators had each grown their own copy of `blockVars` and they had already diverged — only `gen-registry` collapsed values that wrap across lines, which font stacks do. Nothing emitted a parsed font value yet, so the bug was latent; it is now impossible.

`pnpm docs:tokens` compiles that reading into [`src/docs/generated/tokens.json`](src/docs/generated/tokens.json): every token with its family, type, light and dark values, alias target, whether a Tailwind utility can reach it, and whether it is mode-independent. `schemas/tokens.schema.json` validates it in CI, and the schema encodes guardrails rather than just shapes — a `legacy` token with `tailwindUtility: true` fails, because that palette has no `--color-*` mapping by design.

Two things it will reject outright: a token defined in `.dark` but not `:root` (edit both, or confirm the light value inherits), and a token claiming to be mode-dependent while having no dark value.

## Editing tokens (`src/app/globals.css`)

All tokens live in [`src/app/globals.css`](src/app/globals.css): `@theme inline` maps each Tailwind utility to a CSS var, with light values in `:root` and dark in `.dark`. The token families, the WCAG bar, and *which token to reach for* are documented in [design.md](design.md) — this section is the mechanics of changing them here.

- **Adding or adjusting a color means editing `globals.css` (both `:root` **and** `.dark`), not the call site.** `:root` is the complete light token set; `.dark` overrides only the tokens that differ (the rest inherit). If a new token needs a distinct dark value, add it to `.dark` too — don't assume the light value carries.
- Expose a new token to Tailwind by adding its `--color-*: var(--…)` mapping in the `@theme inline` block.
- Some rules in `globals.css` are **app-level CSS the `theme` registry item does _not_ ship** — the `cursor: pointer` base-layer rule, `color-scheme`, and the `@utility tabular` helper. Keep them here; consuming apps must add their own (see [agents.md](https://design.edgecom.ai/agents.md)).
- After any token change, run `pnpm registry:build` so the `theme` item regenerates.
- The live **Foundations → Semantic colors** page is the interactive reference + contrast meter — verify new/tuned colors there in **both** light and dark.

## The Claude Design project

Designers work in **Edgecom Energy Design System V2** (`6a99bc4b-d46f-47de-a63f-81b94b1dd319`), and everything in it except `brand/` is **generated from this repo** by [`scripts/gen-design-sync.mjs`](scripts/gen-design-sync.mjs).

Run `pnpm design:sync` after a component, token, or `design.md` change, then upload the bundle with the `DesignSync` tool. It emits:

| Path | From |
|---|---|
| `_system.json` | git tag + commit + a digest of `globals.css` and `design.md` — this is how a design can name the version it was built against |
| `SKILL.md` | the `edgecom-design` entry point |
| `README.md` | `design.md`, verbatim |
| `foundations/*.html` | `globals.css` |
| `components/*.html` | each primitive's real `cva` base + variant classes |
| `components/*.md` | variants, sizes, defaults, install address |
| `_base.css` | the Edgecom `:root`/`.dark` tokens plus only the utilities the cards use, compiled by `scripts/lib/base-css.mjs` with every Tailwind internal resolved away — Claude Design builds its token manifest from this file, so nothing but Edgecom's tokens may declare a custom property in it |

Cards are static HTML using the components' **actual utility classes**, so a card cannot drift from its primitive: change the `cva`, re-sync, the card changes.

**Sync from a clean tree on `main`, after the change has merged.** `_system.json` stamps `HEAD`, so a bundle built from uncommitted work claims a version whose content it does not match — and the version stamp is the whole reason the file exists. The generator refuses to build on a dirty tree; `DESIGN_SYNC_ALLOW_DIRTY=1` overrides it for a throwaway preview you do not upload.

**The upload plan is scoped to those paths**, so a sync structurally cannot touch `brand/` — hand-authored marketing material that is deliberately not in this public repo. Keep it that way.

The old `Edgecom Energy Design System` project is **legacy**: a Figma reconstruction that teaches hex colours, px type, and no dark mode. Its skill is being renamed `edgecom-design-legacy`. Don't sync to it, and don't point anyone at it.

## Adding or changing a component

1. Primitive → `src/components/ui/<name>.tsx` (follow the house style above).
2. Demo → `src/components/demo/<name>-demo.tsx`.
3. Register the section: **metadata** in [`src/app/sections.tsx`](src/app/sections.tsx), **content** in `src/app/sections/<id>.tsx`. The metadata is eager (the sidebar, the search dialog and every generator read all 70 entries); the content is one lazy chunk per section, so a route only downloads its own. Helpers used by two or more sections live in `src/app/sections/shared.tsx`.
4. Curated API copy → [`src/docs/curated.ts`](src/docs/curated.ts) (shape: `summary` / `parts` / `propDescriptions` / `omitProps`; note this file uses **semicolons + double quotes**).
5. `pnpm registry:build`.

Package deps, cross-component `registryDependencies`, hooks, and the always-on `theme` dependency are all **inferred from imports** — you don't declare them. Each package dep ships with **the version range this repo's `package.json` declares**, so `pnpm add`-ing a package here is what consumers install: bump the dependency and migrate the components that use it in the same change, rather than letting a consumer's `latest` meet a component written against the previous major. See [REGISTRY.md](REGISTRY.md) §3 for the full mechanics.

## Generated files — do NOT hand-edit

Edit the **sources**, then run `pnpm registry:build` (or `pnpm docs:gen`). `prebuild`/`predev` regenerate everything automatically.

| Generated (git-tracked) | Produced by | Source |
|---|---|---|
| `registry.json` + `src/**/registry.json` chunks | `registry:gen` | `src/components/ui/*.tsx`, `src/hooks/*`, `globals.css` |
| `public/r/*.json` | `shadcn build` | the registry chunks |
| `src/docs/generated/{api,api-highlight,routes}.ts` | `docs:api` / `docs:routes` | `sections.tsx`, `ui/*`, `docs/api.ts` |
| `src/docs/generated/tokens.json` | `docs:tokens` | `globals.css`, via `scripts/lib/tokens.mjs` |
| `src/docs/generated/contracts.json` | `docs:contracts` | `ui/*.tsx`, `sections.tsx`, `curated.ts`, `docs/contracts.json`, via `scripts/lib/contracts.mjs` |
| `public/docs-source/*` (git-**ignored**) | `docs:source` | `components/demo/*`, `components/shadcn-studio/*` |
| `src/docs/generated/changelog.ts`, `CHANGELOG.md`, `public/changelog.md` — **git-ignored** | `docs:changelog` | git history + `src/docs/changelog-notes.json` |

Note: `src/docs/api.ts`, `src/docs/curated.ts`, `src/docs/contracts.json`, and `src/docs/changelog-notes.json` are **hand-written** sources — distinct from the generated `src/docs/generated/*`. The name collision is worth watching: `src/docs/contracts.json` is the authored overlay you edit, `src/docs/generated/contracts.json` is the compiled artifact you don't.

## Component contracts

`src/docs/generated/contracts.json` is one contract per registry primitive: what it is for, what it may compose with, which tokens it reaches, which states it implements. It is what an agent reads instead of all of `design.md`, and `pnpm design:sync` publishes its `rules` into each Claude Design spec.

The split matters when you edit one:

- **Derived, every run** — variants, tokens, states, responsive breakpoints, parts, props, the Base UI origin. Read straight from `src/components/ui/*.tsx`, so a contract cannot claim a variant or a state the primitive doesn't implement. Never try to correct these here; fix the primitive.
- **Authored** — purpose, `useWhen`/`dontUseWhen`, `requires`/`forbids`, `rules`, behaviour in the loading/empty/error/destructive paths, accessibility requirements, examples, anti-patterns. These live in `src/docs/contracts.json`, keyed by section id.

`gen-contracts` fails on an unknown key or an id with no section, so a typo can't silently drop the guidance someone wrote. Ten components are authored so far — button, input, select, badge, card, dialog, sheet, table, sidebar, toast; the rest carry the derived half only. Everything written there is published to consumers through the design specs, so each claim has to be true of the primitive or stated in `design.md`.

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
- `CHANGELOG.md`, `public/changelog.md` and `src/docs/generated/changelog.ts` are **git-ignored build outputs**, not committed files. They embed commit SHAs and this repo rebase-merges, so any committed copy starts linking to commits that no longer exist the moment its own PR lands. They are rebuilt by `predev` / `prebuild`, so a local `pnpm dev` or `pnpm build` materialises them; a fresh clone has no changelog until you run one. `design.edgecom.ai/changelog.md` is still served and still linked from `llms.txt` — it is built at deploy time. Edit `changelog-notes.json`, never the markdown.
- **`fetch-depth: 0` in the Pages workflow is now load-bearing.** The generator refuses to truncate on a shallow or non-git tree and falls back to the committed changelog — but nothing is committed any more, so on a shallow checkout it writes an *empty* changelog instead. Keep the full-history fetch.

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

**CI runs on every pull request** ([`ci.yml`](.github/workflows/ci.yml)) — lint, typecheck, build, the registry audit, a generated-files parity check, and the browser gate. Before this, the only workflow ran *after* a change reached `main`, so a broken build or a stale generated file was discovered once it was already published. A green PR now means the same thing as a clean working tree.

There is **no test framework** in this repo. The quality gates are:
- `pnpm lint` (ESLint) and TypeScript **strict** — use **`pnpm typecheck`**, not a bare `npx tsc --noEmit`. `src/docs/generated/changelog.ts` is a git-ignored build output that `changelog.tsx` imports, so a fresh checkout must generate it first; `pnpm typecheck` does that, and `pnpm build` gets it from `prebuild`.
- **`pnpm verify:docs`** — the closest thing to a test suite here. `pnpm build` only proves the export prerenders; the page shells are empty and every section renders client-side, so a build can succeed while the site renders nothing. This loads ten representative routes in system Chrome, in **both themes**, and fails on a blank page, a console error, a failed chunk, or a Suspense fallback that never resolved. Run it after anything that changes how the docs site loads.
- For anything else visible, use the browser preview and check **both light and dark**.
- A full `pnpm build` also validates the static-export prerender end-to-end.

## Do-nots (maintainer)

- Don't hand-edit generated files (see the table above) — edit the source and regenerate.
- Don't commit `CHANGELOG.md` / `public/changelog.md` / `src/docs/generated/changelog.ts` (they are git-ignored outputs), don't hand-edit them, and don't drop `fetch-depth: 0` from the Pages workflow — each one breaks the self-maintaining changelog.
- Don't `--overwrite` our custom `src/components/ui` primitives when pulling shadcn-studio components, and don't reformat vendored studio files.
- Don't add icon libraries other than lucide-react.
- Don't edit a token in only one of `:root` / `.dark` — set both (or confirm the light value is meant to inherit).
- Don't move `DocsShell` into the page or drop `generateStaticParams()` — you break sidebar persistence / the static build.
- Never print the values in `.env.local`.
- Keep the `nextjs-agent-rules` block at the top of this file intact.

---

_Building UI (primitives, demos, doc pages) still follows the full design guardrails in [design.md](design.md) — this file only covers repo mechanics._
