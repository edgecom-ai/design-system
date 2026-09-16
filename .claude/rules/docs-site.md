---
paths:
  - "src/app/**/*.tsx"
  - "src/app/**/*.ts"
  - "next.config.ts"
  - "src/components/docs/**/*.tsx"
---

# The docs site

A **static export** (`output: "export"`), built and published on push to `main` and served at the root of **design.edgecom.ai**. Files in `public/` get clean URLs at that root: `public/design.md` → `https://design.edgecom.ai/design.md`.

## Two things that break if you touch them

- **The chrome renders once** from `src/app/(docs)/layout.tsx`, a route-group layout, so the sidebar persists across navigations. **Don't move `DocsShell` back into the page** — it remounts and the sidebar scroll jumps to top on every click.
- **`src/app/(docs)/[group]/[slug]/page.tsx` returns `null` but must keep `generateStaticParams()`** (from `src/docs/generated/routes.ts`). Static export needs it to prerender one HTML file per section. Dropping it fails the build.

## Other invariants

- `basePath` / `NEXT_PUBLIC_BASE_PATH` (from the optional `PAGES_BASE_PATH`) prefix asset and runtime-fetch URLs when serving under a sub-path. Unset for local `pnpm dev` and for the CI deploy, which both serve from `/`.
- The `design.edgecom.ai` domain is configured in GitHub Pages settings — there is **no `CNAME` file**. A `public/` regeneration must not add or clobber one.
- Every URL listed in `public/llms.txt` must keep resolving to a prerendered HTML file. GitHub Pages has no server-side fallback.

## Next.js

This is **Next.js 16**, with breaking changes vs. your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next code, and heed deprecation notices. Nothing the registry ships depends on Next — `src/components/ui/*`, `src/hooks/*`, and `src/lib/*` import nothing from it. Keep it that way: Next belongs to the docs shell only.
