---
paths:
  - "src/app/**/*.tsx"
  - "src/app/**/*.ts"
  - "src/router.tsx"
  - "src/main.tsx"
  - "vite.config.ts"
  - "scripts/prerender.mjs"
  - "src/components/docs/**/*.tsx"
---

# The docs site

A **client-rendered SPA built to static files** with Vite + TanStack Router, published on push to `main` and served at the root of **design.edgecom.ai**. Files in `public/` get clean URLs at that root: `public/design.md` → `https://design.edgecom.ai/design.md`.

## Two things that break if you touch them

- **The chrome renders once** from the pathless `docs` layout route in `src/router.tsx`, so the sidebar persists across navigations. **Don't move `DocsShell` down onto the `$group/$slug` route** — it remounts and the sidebar scroll jumps to top on every click. (The layout route deliberately renders no `<Outlet />`: `DocsShell` renders the whole page itself, and the child route exists only to make the URL resolve.)
- **`scripts/prerender.mjs` writes one HTML shell per route**, from `src/docs/generated/routes.ts`. GitHub Pages has no server-side fallback, so a route with no file is a 404 no matter how well the SPA would have handled it. Dropping the prerender step silently breaks every deep link.

## Other invariants

- `import.meta.env.BASE_URL` (from the optional `PAGES_BASE_PATH`, via `base` in `vite.config.ts`) prefixes asset and runtime-fetch URLs when serving under a sub-path. Unset for local `pnpm dev` and for the CI deploy, which both serve from `/`. It always ends in `/`; strip the trailing slash when concatenating a path that starts with one.
- The `design.edgecom.ai` domain is configured in GitHub Pages settings — there is **no `CNAME` file**. A `public/` regeneration must not add or clobber one.
- Every URL listed in `public/llms.txt` must keep resolving to a prerendered HTML file.
- **Links go through `@/components/docs/link`**, not TanStack's `Link` directly. It keeps the `href` prop (so the vendored shadcn-studio demos stay diffable against upstream) and sends `#`/`http(s)`/`mailto:`/`tel:` to a plain anchor instead of the router.

## Sections are split in two

`src/app/sections.tsx` holds **metadata only** and is eager — the sidebar, the ⌘K dialog, and all four generators (`gen-api`, `gen-routes`, `gen-llms`, `gen-design-sync`) read every entry. Those generators parse the file *textually*, matching top-level fields at **exactly four spaces** of indentation, so keep the array formatted the way it is.

Each section's content lives in `src/app/sections/<id>.tsx`, default-exporting `{ node }` or `{ variants }`, and is registered in the `sectionContent` map as a dynamic import. `DocsShell` resolves it with `React.use()` against a module-level promise cache — the cache is load-bearing, since `use()` re-reads the promise every render and a fresh one would suspend forever. Helpers two or more sections share go in `src/app/sections/shared.tsx`.

A section that needs `sections`, `sectionPath` or `findSection` imports them back from `../sections`. That is not a cycle at evaluation time: `sections.tsx` holds only `() => import(...)`, so it finishes evaluating before any content module is fetched.

`hasVariants` is on the metadata, deliberately duplicating a fact the content knows: the header decides where to put the install command before the content chunk has loaded.

## The stack

Nothing the registry ships depends on the docs framework — `src/components/ui/*`, `src/hooks/*`, and `src/lib/*` import nothing from Vite or the router. Keep it that way: the framework belongs to the docs shell only. The route tree is **code-based** (`src/router.tsx`), not file-based, so there is no generated `routeTree.gen.ts` to keep in sync.
