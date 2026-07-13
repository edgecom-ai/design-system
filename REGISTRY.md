# Edgecom Component Registry

This repo is both the **design-system docs site** and the **source of truth for the `@edgecom` shadcn registry**. Developers pull Edgecom UI primitives into their own apps with the shadcn CLI:

```bash
npx shadcn@latest add @edgecom/button
```

Every component ships with the Edgecom theme, its npm dependencies, any cross-component dependencies, and any hooks it needs — resolved automatically.

---

## 1. Consuming the registry (app developers)

### One-time setup

Add the `@edgecom` registry to your app's `components.json`:

```jsonc
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@edgecom": {
      "url": "https://registry.edgecom.ai/r/{name}.json",
      "headers": { "Authorization": "Bearer ${EDGECOM_REGISTRY_TOKEN}" }
    }
  }
}
```

Notes:
- `${EDGECOM_REGISTRY_TOKEN}` is read from your environment — the shadcn CLI expands `${...}` in `headers`. Never commit the token.
- If the registry is hosted **without** auth, drop the `headers` block.
- During local development against this repo, point the URL at `http://localhost:3000/r/{name}.json` and run `npm run dev` here.

### Installing components

```bash
npx shadcn@latest add @edgecom/button
npx shadcn@latest add @edgecom/dialog @edgecom/card @edgecom/sidebar
```

What happens on install:
- The component file lands in `@/components/ui/<name>.tsx`.
- **`@edgecom/theme` is pulled automatically** — it writes `@/lib/utils.ts` (the `cn` helper) and injects the Edgecom design tokens (light + dark OKLCH variables) into your `globals.css`.
- **Cross-component deps** resolve automatically (e.g. `dialog` pulls `button`; `sidebar` pulls `input`, `separator`, `sheet`, `skeleton`, `tooltip`, and the `use-mobile` hook).
- **npm deps** (e.g. `@base-ui/react`, `class-variance-authority`, `recharts`) are installed.
- Already-present files are **skipped** (safe to re-run; use `--overwrite` only if you intend to discard local edits).

### Requirements in the consuming app

- **Tailwind v4** with `@import "tailwindcss";` in your CSS entry.
- A `@/*` path alias (`tsconfig.json` / `jsconfig.json`) matching the `aliases` above.
- React 19 / Next 16 (or compatible). Components are Base UI + Tailwind v4.

---

## 2. Hosting the registry (platform/devops)

The build produces **static JSON** in `public/r/`. There is no server-side logic — hosting is "serve these files over HTTPS," optionally behind an auth gate.

### What to serve

- `npm run build` (or `npm run registry:build`) regenerates `public/r/*.json` — one file per item plus `registry.json` (the index).
- Serve them at `https://<host>/r/<name>.json` so that `@edgecom/button` → `https://<host>/r/button.json`.
- Update `homepage` in [`registry.json`](registry.json) to the real host if it changes (cosmetic — resolution uses the `@edgecom` namespace from the consumer's `components.json`, not this URL).

### Deploy options

- **Static host / CDN** (S3+CloudFront, Netlify, Vercel static, GitHub Pages): publish the built `public/r/` directory. Simplest if the registry can be public or gated at the CDN edge.
- **Same Next.js app**: deploy this repo; `public/r/*.json` is served by Next automatically. Gives you a place to add the auth middleware below.

### Private access (auth gate)

The registry is intended to be **private**. The consumer config sends `Authorization: Bearer ${EDGECOM_REGISTRY_TOKEN}`; the host must validate it. Nothing enforces this yet — pick one:

- **Edge/CDN**: require the `Authorization` header (or a signed cookie) on `/r/*` at CloudFront/Cloudflare.
- **Next middleware**: add `middleware.ts` matching `/r/:path*` that returns `401` unless the `Authorization` header equals `Bearer <EDGECOM_REGISTRY_TOKEN>` (token from a server env var). Keep the check constant-time.

> **Status:** auth is **not implemented in this repo** — local serving is open. Standing it up behind the token is the main hosting task.

### Build-on-deploy

`prebuild` is already wired (see below), so any pipeline that runs `npm run build` before publishing gets a fresh registry automatically. Recommended: build on every push to `main` and publish `public/r/`.

---

## 3. Updating the registry (design-system maintainer)

**You never hand-edit `registry.json` or `public/r/`.** They are generated from source. The source of truth is:

| Source | Feeds |
|---|---|
| `src/components/ui/*.tsx` | one `registry:ui` item each (deps, cross-deps, hooks derived from imports) |
| `src/app/globals.css` | the `theme` item's design tokens (`@theme` mappings + `:root` light + `.dark` dark) |
| `src/lib/utils.ts` | shipped by the `theme` item (`cn` helper) |
| `src/hooks/*.ts` | shipped alongside any component that imports them |

### To add / change a component

1. Add or edit the primitive in `src/components/ui/<name>.tsx`. Import other `@/components/ui/*`, `@/hooks/*`, and npm packages as normal — the generator reads these imports.
2. To change **tokens/theme**, edit `src/app/globals.css` (never hardcode hex — use the semantic OKLCH tokens).
3. Regenerate + build:
   ```bash
   npm run registry:build
   ```
4. Commit the regenerated `registry.json` and `public/r/*.json` along with your source change, and push. Deploy picks it up.

That's it — deps, cross-component `registryDependencies`, hooks, and theme coupling are all inferred. **Every component automatically depends on `@edgecom/theme`.**

### npm scripts

| Script | Does |
|---|---|
| `npm run registry:gen` | Regenerate `registry.json` from source (`scripts/gen-registry.mjs`) |
| `npm run registry:build` | `registry:gen` **+** `shadcn build` → writes `public/r/*.json` |
| `npm run build` | Full site build. **`prebuild` runs `docs:gen && registry:build` first**, so a normal build always ships a current registry. |
| `npm run dev` | Docs site locally at `:3000`, serving `public/r/*.json` for local install testing. |

Because `registry:build` is baked into `prebuild`, the registry **cannot silently drift** from source — a build regenerates it every time.

---

## 4. What's in the registry

- **65 items:** 1 `theme` + 64 UI primitives (1:1 with `src/components/ui/*.tsx`).
- **`theme`** (`registry:theme`): design tokens (light + dark) + `cn` (`src/lib/utils.ts`) + `clsx`/`tailwind-merge`. Pulled automatically by every component.
- Item names match the file name: `src/components/ui/dialog.tsx` → `@edgecom/dialog`.

Verified end-to-end with the shadcn CLI against a clean consumer app: a simple component (`dialog` → `theme` + `button`) and the deepest tree (`sidebar` → 6 cross-deps + `use-mobile` hook + `theme`) both install cleanly, dedupe shared files, inject tokens, install npm deps, and type-check (`tsc`) with no unresolved imports.

---

## 5. Known gaps

- **Auth is not implemented** — hosting must add the `Bearer` token gate (§2) for private access.
- **Two app-level CSS bits are not shipped** via theme tokens: the `color-scheme` pinning (native-select dark fix) and the `@utility tabular` helper. Everything token-driven works; ship a small extra CSS file in the `theme` item if these are needed downstream.
- **Per-item `title`/`description`** in `registry.json` are generic ("The Edgecom X component") — cosmetic only.
- Install was CLI-verified on the simplest and most complex components; the generator is uniform across all 64, but not every item was individually install-tested.
