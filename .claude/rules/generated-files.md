---
paths:
  - "registry.json"
  - "src/**/registry.json"
  - "public/r/**/*.json"
  - "src/docs/generated/**/*.ts"
  - "src/docs/generated/**/*.json"
  - "src/docs/contracts.json"
  - "CHANGELOG.md"
  - "public/changelog.md"
  - "public/design.md"
  - "public/llms.txt"
  - "public/agents.md"
  - "public/contracts.json"
  - "public/contracts/**/*.json"
  - "public/tokens.json"
  - "public/schemas/**/*.json"
  - "public/skills/**/*.md"
  - "design.md"
---

# You are probably looking at a generated file

Edit the **source** and regenerate. `prebuild`/`predev` regenerate everything automatically; run the generator by hand when you need the artifact updated mid-change.

| Generated | Produced by | Real source |
|---|---|---|
| `registry.json`, `src/**/registry.json` | `pnpm registry:gen` | `src/components/ui/*.tsx`, `src/hooks/*`, `globals.css` |
| `public/r/*.json` | `shadcn build` | the registry chunks |
| `src/docs/generated/{api,api-highlight,routes}.ts` | `pnpm docs:api` / `docs:routes` | `sections.tsx`, `ui/*`, `src/docs/api.ts` |
| `src/docs/generated/tokens.json` | `pnpm docs:tokens` | `src/app/globals.css` |
| `src/docs/generated/contracts.json` | `pnpm docs:contracts` | `ui/*.tsx`, `sections.tsx`, `curated.ts`, `src/docs/contracts.json` |
| `public/contracts.json`, `public/contracts/*.json`, `public/schemas/contracts.schema.json` | `pnpm docs:contracts` | the contracts above, published for consuming agents |
| `public/tokens.json`, `public/schemas/tokens.schema.json` | `pnpm docs:tokens` | `tokens.json` above, published |
| `public/skills/*/SKILL.md` | `pnpm docs:agents` | `.claude/skills/<name>/SKILL.md` — edit the skill, not the mirror |
| `CHANGELOG.md`, `public/changelog.md`, `src/docs/generated/changelog.ts` — **git-ignored** | `pnpm docs:changelog` | git history + `src/docs/changelog-notes.json` |
| `public/design.md` | `pnpm docs:design-md` | `design.md` (mirrored verbatim) |

Hand-written sources that look generated but are not: `src/docs/api.ts`, `src/docs/curated.ts`, `src/docs/changelog-notes.json`, and **`src/docs/contracts.json`**.

That last one is a name collision worth slowing down for. `src/docs/contracts.json` is the authored overlay — purpose, selection criteria, compositions, anti-patterns — and it is the file you edit. `src/docs/generated/contracts.json` is the compiled artifact, and half of each contract there (variants, tokens, states, parts, props) is read out of the primitive on every run: correcting one of those fields by hand changes nothing, because the next `docs:gen` reads the primitive again. Fix the primitive instead.

## Three partial files

- **`design.md`** is *mostly hand-authored*. Only the block between `# @@GENERATED:tokens` and `# @@GENERATED:end` is rewritten from `globals.css`. Edit the body freely; never edit inside those markers.
- **`public/llms.txt`** is the same shape: the intro, Guides, and Notes sections are hand-authored; only the block between the `@@GENERATED:catalog` markers is rewritten from `sections.tsx`.
- **`public/agents.md`** likewise: hand-authored except the block between the `@@GENERATED:contracts` markers, which `pnpm docs:agents` rewrites from `contracts.json` — the published addresses, version, digest, and which contracts are authored. The addresses themselves come from `scripts/lib/publish.mjs`; change them there, not in prose.

## The changelog maintains itself — and is not committed

It is derived from git, so it cannot drift from what the registry ships. Its three artifacts are **git-ignored build outputs** — they embed commit SHAs and this repo rebase-merges, so a committed copy would link to commits that no longer exist. Never `git add` them. Don't hand-edit the markdown — curate through a `Changelog:` commit trailer at commit time, or `src/docs/changelog-notes.json` retroactively by sha. Don't drop `fetch-depth: 0` from the Pages workflow; a shallow checkout would truncate it.
