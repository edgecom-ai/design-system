# Edgecom Component Registry

This repo is both the **design-system docs site** and the **source of truth for the Edgecom shadcn registry**. It is a [public GitHub registry](https://ui.shadcn.com/docs/registry/github): the repository itself is the registry — there is no server, no hosting, and no auth. Developers pull Edgecom UI primitives into their own apps with the shadcn CLI:

```bash
pnpm dlx shadcn@latest add edgecom-ai/design-system/button
```

Every component ships with the Edgecom theme, its package dependencies, any cross-component dependencies, and any hooks it needs — resolved automatically.

---

## 1. Consuming the registry (app developers)

### No setup

Nothing to configure — **no `components.json` registry entry and no token.** The public repo *is* the registry. Reference any item by its GitHub address:

```
edgecom-ai/design-system/<name>
```

Your app still needs a shadcn-initialized project (run `pnpm dlx shadcn@latest init` once) so the CLI knows your aliases and CSS entry.

### Installing components

```bash
pnpm dlx shadcn@latest add edgecom-ai/design-system/button
pnpm dlx shadcn@latest add edgecom-ai/design-system/dialog edgecom-ai/design-system/card edgecom-ai/design-system/sidebar
```

Pin to a branch, tag, or commit with `#ref`:

```bash
pnpm dlx shadcn@latest add edgecom-ai/design-system/button#v1.0.0
```

Preview or list before installing:

```bash
pnpm dlx shadcn@latest list edgecom-ai/design-system
pnpm dlx shadcn@latest view edgecom-ai/design-system/sidebar
pnpm dlx shadcn@latest add edgecom-ai/design-system/sidebar --dry-run
```

What happens on install:
- The component file lands in `@/components/ui/<name>.tsx`.
- **The `theme` item is pulled automatically** — it writes `@/lib/utils.ts` (the `cn` helper) and injects the Edgecom design tokens (light + dark OKLCH variables) into your `globals.css`.
- **Cross-component deps** resolve automatically (e.g. `dialog` pulls `button`; `sidebar` pulls `input`, `separator`, `sheet`, `skeleton`, `tooltip`, and the `use-mobile` hook).
- **Package deps** (e.g. `@base-ui/react`, `class-variance-authority`, `recharts`) are installed.
- Already-present files are **skipped** (safe to re-run; use `--overwrite` only if you intend to discard local edits).

### Requirements in the consuming app

- **Tailwind v4** with `@import "tailwindcss";` in your CSS entry.
- A `@/*` path alias (`tsconfig.json` / `jsconfig.json`) matching your `components.json` aliases.
- React 19 / Next 16 (or compatible). Components are Base UI + Tailwind v4.

---

## 2. Publishing the registry (platform/devops)

There is nothing to deploy. To publish:

1. Keep the repository **public** on github.com.
2. Keep `registry.json` **at the repo root** and valid (regenerated from source — see §3).
3. Ensure the files each item references actually exist in the repo.

That's it — the shadcn CLI reads `registry.json` from the repo root, follows its `include` list to each chunk, then fetches the source files a chunk references directly over `raw.githubusercontent.com`.

Validate before pushing:

```bash
pnpm dlx shadcn@latest registry validate edgecom-ai/design-system
```

> The static JSON in `public/r/` (produced by `shadcn build`) is **optional** — a flattened, one-file-per-item mirror you can host on a CDN if you ever want a non-GitHub distribution. Public GitHub installs do not use it; they read the source chunks.

---

## 3. Updating the registry (design-system maintainer)

**You never hand-edit `registry.json`, the per-directory `registry.json` chunks, or `public/r/`.** They are generated from source. The source of truth is:

| Source | Feeds |
|---|---|
| `src/components/ui/*.tsx` | one `registry:ui` item each (deps, cross-deps, hooks derived from imports) |
| `src/app/globals.css` | the `theme` item's design tokens (`@theme` mappings + `:root` light + `.dark` dark) |
| `src/lib/utils.ts` | shipped by the `theme` item (`cn` helper) |
| `src/hooks/*.ts` | any hook a component imports becomes its own item, depended on by that component |

### Source layout — chunks live beside their sources

The root `registry.json` is a tiny index that just `include`s one **chunk** per source directory. shadcn requires every included path to be named `registry.json`, and a chunk may only ship files inside its own directory (no `../`), so each chunk sits right next to the code it distributes:

```
registry.json                       # index: include: [ …the three below… ]
src/lib/registry.json               # theme  -> ships utils.ts + design tokens
src/components/ui/registry.json     # every component -> ships <name>.tsx
src/hooks/registry.json             # hooks  -> ships <hook>.ts
```

Cross-item references (`registryDependencies`) use **full GitHub addresses** (`edgecom-ai/design-system/<name>`) so a bare `pnpm dlx shadcn add edgecom-ai/design-system/button` resolves the whole tree with zero consumer config. (Bare names like `button` would resolve to shadcn's built-ins, and `@namespace` refs would need consumer setup — neither works for a public GitHub install.)

### To add / change a component

1. Add or edit the primitive in `src/components/ui/<name>.tsx`. Import other `@/components/ui/*`, `@/hooks/*`, and packages as normal — the generator reads these imports.
2. To change **tokens/theme**, edit `src/app/globals.css` (never hardcode hex — use the semantic OKLCH tokens).
3. Regenerate + build:
   ```bash
   pnpm run registry:build
   ```
4. Commit the regenerated `registry.json` + the `src/**/registry.json` chunks + `public/r/*.json` along with your source change, and push. A push to the default branch is the release.

Deps, cross-component `registryDependencies`, hooks, and theme coupling are all inferred. **Every component automatically depends on the `theme` item.**

### pnpm scripts

| Script | Does |
|---|---|
| `pnpm run registry:gen` | Regenerate the root `registry.json` + the `src/**/registry.json` chunks from source (`scripts/gen-registry.mjs`) |
| `pnpm run registry:build` | `registry:gen` **+** `shadcn build` → also writes the optional flattened `public/r/*.json` |
| `pnpm run build` | Full site build. **`prebuild` runs `docs:gen && registry:build` first**, so a normal build always ships a current registry. |
| `pnpm run dev` | Docs site locally at `:3000`. |

To publish under a different repo, set `REGISTRY_GITHUB_REPO=owner/repo` before `registry:gen` (it defaults to `edgecom-ai/design-system`).

Because `registry:build` is baked into `prebuild`, the registry **cannot silently drift** from source — a build regenerates it every time.

---

## 4. What's in the registry

- **66 items:** 1 `theme` + 64 UI primitives (1:1 with `src/components/ui/*.tsx`) + 1 hook (`use-mobile`, depended on by `sidebar`).
- **`theme`** (`registry:theme`): design tokens (light + dark) + `cn` (`src/lib/utils.ts`) + `clsx`/`tailwind-merge`. Pulled automatically by every component.
- Item names match the file name: `src/components/ui/dialog.tsx` → `edgecom-ai/design-system/dialog`.

---

## 5. Notes

- **Two app-level CSS bits are not shipped** via theme tokens: the `color-scheme` pinning (native-select dark fix) and the `@utility tabular` helper. Everything token-driven works; ship a small extra CSS file in the `theme` item if these are needed downstream.
- **Per-item `title`/`description`** in the chunks are generic ("The Edgecom X component") — cosmetic only.
- `registry:build` was validated end-to-end with `shadcn build`: the `include` tree resolves, every item's colocated source file is found and embedded, and `registryDependencies` carry full GitHub addresses. Install against a clean consumer app should be spot-checked after the first public push (e.g. `sidebar`, which exercises 6 cross-deps + the `use-mobile` hook + `theme`).
