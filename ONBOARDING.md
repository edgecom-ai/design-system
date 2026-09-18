# Onboarding — maintaining the Edgecom design system

You are looking at the producer repository. This document is the path through your first week:
what this repo is, why it is shaped the way it is, and the handful of things that will bite you.

It is deliberately not a reference. [MAINTAINERS.md](MAINTAINERS.md) answers *how do I do X*;
this answers *what is this and why*. Read this once, then work from MAINTAINERS.

## 1. What you have just cloned

One repository with three outputs, only two of which are visible in the file tree:

1. **The documentation site** at [design.edgecom.ai](https://design.edgecom.ai) — a Vite + TanStack
   Router SPA, built to static files and served from GitHub Pages.
2. **The shadcn registry** — the thing consuming apps install from, with
   `pnpm dlx shadcn@latest add edgecom-ai/design-system/<name>`. Every file in
   `src/components/ui/` becomes a registry item by directory scan.
3. **The Claude Design bundle** — cards, specs and rules pushed into a design-system project so
   designers work from the same source the code does. It is generated on demand and uploaded; it
   is not committed.

**This repo is not the consumer guide.** Someone building an app *with* the design system reads
[design.edgecom.ai/agents.md](https://design.edgecom.ai/agents.md) instead. Keeping those two
audiences apart is why the root instruction files are as short as they are — don't answer consumer
questions from the maintainer docs, and don't grow the maintainer docs into a consumer guide.

## 2. Fifteen minutes to running

```bash
pnpm install     # pnpm 11.10.0, pinned. Not npm, not an older pnpm.
pnpm dev         # docs site on :3000
```

`predev` regenerates every documentation artifact before the server starts, so the first run is a
few seconds slower than the rest. If that step fails, read the error before touching anything else
— it usually means a generated file's source moved.

Open a component page, then open `src/components/ui/` beside it. That correspondence — one
primitive file, one page, one registry item — is the repo in miniature.

## 3. The one idea

**One authority per fact, and every other view of that fact is compiled from it.**

Almost every rule in this repo follows from that sentence. Tokens live in exactly one stylesheet;
the token model, the registry theme, the design bundle and the design-language document are all
generated from it. Component structure lives in the primitive; the API tables, the contracts and
the design specs are all read out of it. Nothing is maintained twice, because anything maintained
twice eventually disagrees with itself.

| The authority | What is compiled from it |
|---|---|
| `src/app/globals.css` | `src/docs/generated/tokens.json`, the registry `theme` item, the token block in `design.md`, the design bundle's stylesheet |
| `src/components/ui/*.tsx` | registry items, API reference, component contracts, design-system specs and cards |
| `src/app/sections.tsx` | the sidebar, the search dialog, the route list, the prerendered pages, `llms.txt` |
| `design.md` | the published design language, and the rules inside the design bundle |
| git history | the changelog |

Two consequences worth internalising now:

- **A generated file is never the place to fix something.** Change the authority and regenerate.
  If you hand-edit an output, CI fails on the next parity check — and it would have been overwritten
  anyway.
- **Curated prose is a separate, additive layer.** Where a fact cannot be derived — what a component
  is *for*, when not to use it — it lives in a hand-authored overlay that the generator merges on
  top. `src/docs/curated.ts` and `src/docs/contracts.json` are those overlays. They are inputs, and
  you do edit them.

## 4. Your first change, end to end

Say you are adding a variant to a component.

1. Edit the primitive in `src/components/ui/`. The house style is in
   `.claude/rules/ui-primitives.md`, which loads itself when you open one of those files.
2. If it needs explaining, add prose to `src/docs/curated.ts`, and usage guidance to
   `src/docs/contracts.json`.
3. Add or update a demo in `src/components/demo/`. **Demo copy ships verbatim and this repo is
   public** — proper nouns must be fictional.
4. `pnpm registry:build` — regenerates the registry and audits it.
5. `pnpm dev`, and look at it **in both light and dark**. Not one of them. Both.
6. Run the gates (§6), branch, open a PR.

You never declare dependencies anywhere. Package dependencies, cross-component dependencies and
hooks are all inferred from what the primitive imports. Adding an import is what makes a consumer
install a package, so add one deliberately.

## 5. Six things that will bite you

Every one of these has cost someone a day.

1. **Never commit to `main`.** It deploys the site on push. Branch, PR.
2. **The changelog is generated and *not* committed.** It embeds commit SHAs and this repo
   rebase-merges, so a committed copy would link to commits that no longer exist. Don't `git add`
   it, and don't remove `fetch-depth: 0` from the workflows — the generator needs full history.
3. **`pnpm typecheck`, never a bare `tsc --noEmit`.** The changelog module is a git-ignored build
   output, so a fresh checkout has to generate it before typechecking. The script does that.
4. **A generated artifact is identified by a digest of its inputs, not by `HEAD`.** That is why you
   will not find a commit SHA inside one. If you add a generated file, give it the same treatment,
   and regenerate after your *last* edit to any input — not your last interesting one.
5. **`@theme inline` values are not CSS variables at runtime.** Tailwind inlines them into
   utilities. Anything that has to be *readable* as a token — the type scale, the radius scale —
   must also be declared on `:root` explicitly, or it simply will not exist in the browser.
6. **The docs shell holds its own theme state and ignores `prefers-color-scheme`.** A screenshot
   taken with a dark colour scheme on the browser context will come out light. Click the toggle.

## 6. Verifying before you claim done

There is no test framework here. The gates are the tests:

```bash
pnpm lint
pnpm typecheck
pnpm registry:build     # includes the registry audit
pnpm check:schemas
pnpm build              # also proves the static export and prerender
```

`package.json` is the list of record — run what is in it rather than what is in this paragraph,
because gates get added. CI runs the same set plus a **parity gate**: it regenerates everything and
fails if `git status` is not clean. If that gate fails on your PR, you forgot to regenerate.

For anything visible, look at it in both themes. Headless screenshots through Playwright with
system Chrome are more reliable than browser-extension captures, which go stale on a hidden tab.

The most reliable way to check a commit is a detached worktree:

```bash
git worktree add --detach /tmp/verify HEAD
```

Install there and run the gates. It tests the commit rather than your working directory, and it is
the only local check that reproduces CI's parity gate. **Do not** use `git stash --keep-index` for
this — it corrupts the index, and has produced a commit that could not build while every local
check passed.

## 7. The design-system half

`pnpm design:sync` compiles the bundle designers work from: a skill entry point, the rules from
`design.md`, foundations cards, per-component specs, a curated stylesheet, and a provenance stamp
naming the tag, commit and content digest it was built from. Cards are static HTML using the
components' real utility classes, so a card cannot drift from its primitive.

Three things about it that are not obvious:

- It **refuses to build on a dirty tree**, because the provenance stamp would then name a commit
  whose content the bundle does not match.
- The destination project may already be populated by the official Claude Design converter, in
  which case only part of the bundle should be uploaded. The build writes `_overlay.json` naming
  exactly which paths.
- **Uploading changes nothing on its own.** The platform compiles its card index and token manifest
  during a self-check that runs when someone opens the project with a recompile marker present.
  Upload that marker last, then open the project once.

## 8. Where everything else lives

| You want | Read |
|---|---|
| The design language and usage rules | [design.md](design.md) — required before any UI work |
| Repo mechanics: scripts, generators, registry, docs site | [MAINTAINERS.md](MAINTAINERS.md) |
| How consumers install | [REGISTRY.md](REGISTRY.md) |
| What an agent loads when working here | [AGENTS.md](AGENTS.md) |
| Rules for the file you have open | `.claude/rules/` — they load themselves by path |
| A long procedure done properly | `.claude/skills/` — authoring, implementing, auditing |

Day one: this file, then `design.md`. Everything else on demand — that is what the routing layer is
for, and loading it all up front is the problem it was built to solve.
