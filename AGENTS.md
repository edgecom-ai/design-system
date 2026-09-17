# Edgecom Design System — working in this repo

**You are in the producer repository.** This repo is the docs site *and* the source of truth for the public `edgecom-ai/design-system` shadcn registry. Everything below applies to changing *this* repo.

Building an app *with* the design system is a different job with a different guide: **[design.edgecom.ai/agents.md](https://design.edgecom.ai/agents.md)** (source: `public/agents.md`). Don't follow it here, and don't answer consumer questions from this file.

## Read before you write

This file is the routing layer. The detail loads on demand — don't work from memory of it:

| Task | Read first |
|---|---|
| Any UI at all — primitive, demo, doc page | **[design.md](design.md)** — the design language and usage guardrails. Not optional. |
| Repo mechanics — scripts, generators, registry, docs site | **[MAINTAINERS.md](MAINTAINERS.md)** |
| Registry install/hosting mechanics | **[REGISTRY.md](REGISTRY.md)** |
| Anything touching the docs site's routing or build | `src/router.tsx` and `scripts/prerender.mjs` — Vite + TanStack Router, code-based routes, one prerendered HTML shell per route. |

Path-scoped rules in `.claude/rules/` load themselves when you open a matching file (primitives, demos, tokens, generated artifacts, the docs shell). Longer procedures live in `.claude/skills/`.

## Invariants

These hold everywhere and have no file to trigger them:

- **pnpm 11.10.0**, never npm. `pnpm install` after cloning.
- **Never hand-edit a generated file.** Edit the source and regenerate. The generated list is the table in [MAINTAINERS.md](MAINTAINERS.md) → *Generated files*; `public/design.md`, `registry.json`, and `src/docs/generated/*` are all outputs. The changelog artifacts are outputs **and git-ignored** — never commit them.
- **Run `pnpm registry:build`** after changing a component, a hook, or a token, so the generated registry reflects it.
- **Never hardcode a hex, a px type size, or a magic radius.** Every colour, size, and radius is a semantic token. Tokens live in `src/app/globals.css` — edit both `:root` **and** `.dark`.
- **lucide-react is the only icon library.**
- **Base UI (`@base-ui/react`), not Radix.** Pass a trigger with the `render` prop; there is no `asChild`.
- **Conventional-commit subjects** — `type(scope): summary`. The changelog page is generated from them and publishes the summary verbatim, so write it for a docs reader, not for the diff. `!` or a `BREAKING CHANGE:` body line promotes to Breaking; a `Changelog: skip` trailer drops the commit.
- **Never print the values in `.env.local`.**
- **Verify before claiming done:** `pnpm lint` and `pnpm typecheck` (not bare `tsc --noEmit` — `src/docs/generated/changelog.ts` is a git-ignored build output, so a fresh checkout has to generate it first). There is no test framework. For anything visible, check the browser preview in **both light and dark**.

## Scripts

| Script | Does |
|---|---|
| `pnpm dev` | Docs site at `:3000` (`predev` runs `docs:gen`). |
| `pnpm build` | Static export to `out/` (`prebuild` runs `docs:gen` + `registry:build`). |
| `pnpm lint` | ESLint. |
| `pnpm registry:build` | Regenerate the registry, `shadcn build`, then audit it. |
| `pnpm docs:gen` | Regenerate every docs artifact. |

<!-- Maintainer note: keep this file under ~60 lines. It is loaded into every session,
     alongside CLAUDE.md. Anything longer, file-specific, or procedural belongs in
     .claude/rules/ (path-scoped) or .claude/skills/ (on demand) instead. -->
