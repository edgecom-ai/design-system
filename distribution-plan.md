# Edgecom Design System — Distribution & "single rules from design → implementation" plan

**Purpose:** make every stage of building UI — from *design* (Claude Design / Figma-type tools) to *implementation* (Claude Code) to *consuming apps* (portal, admin) — follow the **same** design-system rules, sourced from one place: the `edgecom-ai/design-system` repo.

This is a proposal for review, not a finished decision. Open questions are listed at the end.

> **Status update (implemented):** the rules have been split **by audience** into four files, sharper than the layer-based split this doc originally proposed:
> - **[design.md](design.md)** — design language, tokens, accessibility, and usage guardrails (the "what/why"). Published at `design.edgecom.ai/design.md`.
> - **[AGENTS.md](AGENTS.md)** — consumer guide: building an app with the registry (the "how to implement"); references design.md + REGISTRY.md.
> - **[MAINTAINERS.md](MAINTAINERS.md)** — developing this repo (Next.js, authoring primitives, tokens, docs site). `CLAUDE.md` now imports `@MAINTAINERS.md` + `@design.md`.
> - **[llms.txt](public/llms.txt)** — the discovery index; explains and links each guide + the doc-site catalog. Published at `design.edgecom.ai/llms.txt`.
>
> These four are **hand-authored** for now. The remaining follow-up is to **generate them from source** (§5) — `gen-design-md.mjs` from `globals.css`, `gen-llms.mjs` from `sections.tsx` — so they can't drift. The sections below are retained as the rationale and the generation roadmap.

---

## 1. The problem we're solving

We're seeing **drift**: designs and generated code diverge from the design system. Concrete examples we hit recently:

- Claude Design produced a sidebar with a **brand-blue active item** (ours is a neutral highlight) and **no group labels / no collapsible submenu**.
- Overlays reading **flat in dark mode** (popover was the same lightness as cards).
- A consuming app's tokens looking **darker than the docs site** (stale copy of the theme).

Root causes:

1. **Rules only live in prose** (`AGENTS.md`) — an agent has to *read and obey* them; the design phase (Claude Design) doesn't auto-read them at all.
2. **Distribution is manual / snapshot-based** — the shadcn registry *copies* tokens into a consumer at install time; if we retune a token later, the consumer is stuck on the old value until someone re-syncs.
3. **No artifact for the design phase** — nothing tells a design tool our tokens + "do/don't" rules.

## 2. Guiding principle: put each rule at the most reliable layer

The biggest lesson from recent work: **prose rules are the weakest layer.** Almost every drift we fixed was solved by pushing the rule *down* into a token or a component default, not by writing a paragraph.

Reliability, most → least enforceable:

1. **Component / token defaults** — the right thing is automatic (`showCloseButton=true`, `isActive` → accent surface, `--scrim` token, `Table density` prop). Can't be skipped.
2. **CI / lint** — the wrong thing fails the build. Binding.
3. **Loaded rules (`AGENTS.md`)** — in the agent's context, *if* it reads and obeys.
4. **On-demand reference (`llms.txt` / docs)** — *if* the agent fetches it.
5. **Design-phase prompt (`design.md`)** — softest; must be re-fed each session.

**Encode what you can as defaults/tokens/lint; document the rest.** This plan is about the "document + distribute" layers (3–5), which we're currently missing pieces of.

## 3. The three artifacts (this is the core of the plan)

We publish **three** derived artifacts, each aimed at one stage. They are complementary, not substitutes.

_As implemented, the split is **by audience** into four files (the layer framing below is the original proposal — kept for rationale):_

| Artifact | Audience | What it contains | Where it lives |
|---|---|---|---|
| **`design.md`** | Design tools + anyone building UI | design language, tokens, accessibility, usage guardrails (Do's & Don'ts) | repo + **public URL:** `design.edgecom.ai/design.md` |
| **`AGENTS.md`** | Consumers (Claude Code in an app) | install from registry, compose, token sync; links to design.md | repo root (portable, single file) |
| **`MAINTAINERS.md`** | Repo developers | Next.js, authoring primitives, tokens, docs site, registry build | repo root; imported by `CLAUDE.md` |
| **`llms.txt`** | Browsing / scanning agents | index: explains + links each guide, plus the doc-site catalog | **public URL:** `design.edgecom.ai/llms.txt` |

> Key mental model: `design.md` = *"our visual language & usage rules"*. `AGENTS.md` = *"how to build an app with it"*. `MAINTAINERS.md` = *"how to develop the design system itself"*. `llms.txt` = *"the index — go read the right doc"*.

## 4. Background: the `design.md` standard (and how Ant Design uses it)

We're adopting the **`design.md`** format from **google-labs-code/design.md** (currently **alpha** — expect breaking changes):

- **Two layers:** YAML front-matter (machine-readable tokens: `colors`, `typography`, `rounded`, `spacing`, `components` with `{token.ref}` pointers) + a Markdown body in a **fixed section order**: Overview → Colors → Typography → Layout → Elevation → Shapes → Components → **Do's and Don'ts**.
- **Tooling:** `@google/design.md` CLI — `lint` (11 rules incl. contrast + broken refs), `diff`, `export` (→ Tailwind config / W3C DTCG), `spec`.
- It describes the **visual design language** — *not* component implementations or coding rules. That's exactly why it's the **design-phase** artifact and complements (doesn't replace) `AGENTS.md`.

**Ant Design's implementation** (the pattern we're copying): one consolidated file at `https://ant.design/design.md`, plus a CLI (`antd design.md`) for tools that can't read URLs. Their recommended workflow: *"Read `https://ant.design/design.md` and generate UI following Ant Design's visual language."* It includes an explicit "patterns to avoid" section aimed at AI design tools.

Our equivalent will be: **"Read `design.edgecom.ai/design.md` and follow Edgecom's visual language."** This directly targets the Claude Design drift.

## 5. Design principle for all three: generate from source, never hand-maintain

The repo already generates its registry and docs from source (`scripts/gen-*.mjs`, chained by `pnpm docs:gen` / `prebuild`). All three artifacts follow the same rule so they **can't drift**:

- **`design.md`** ← generated from the OKLCH tokens in `src/app/globals.css`.
- **`llms.txt`** ← generated from the component list in `src/app/sections.tsx`.
- **`AGENTS.md`** ← generated by concatenating modular source files (see Phase 3).

The docs site is a **static export served at the domain root** (`design.edgecom.ai`, no base path), so anything in `public/` gets a clean public URL automatically.

## 6. The plan (phased)

### Phase 1 — `llms.txt` (public reference index)   *[quick win, low risk]*

- Add `scripts/gen-llms.mjs`: read `sections.tsx` → write `public/llms.txt`.
- Standard `llms.txt` shape: H1 title, a one-line summary blockquote, then sections (Getting Started / Foundations / Components / Blocks), each a bulleted list of components linking to `https://design.edgecom.ai/components/<slug>/`.
- Optional `public/llms-full.txt` with inlined content (the per-demo source we already generate in `public/docs-source/`).
- Wire into `docs:gen`. Serve at `design.edgecom.ai/llms.txt`.

### Phase 2 — `design.md` (public design-phase spec)   *[high leverage for design drift]*

- Add `scripts/gen-design-md.mjs`: read the token blocks from `globals.css` → emit a spec-conformant `public/design.md`:
  - **Front-matter:** `colors`, `typography`, `rounded`, `spacing`, and `components` archetypes (button, badge, card, sidebar item, etc.) using `{token.ref}` pointers.
  - **Body:** the canonical sections, with a **Do's and Don'ts** distilled from our guardrails — e.g. *active state = neutral highlight (never brand-blue text); no accent bars; status colors strictly by meaning; overlays sit above cards in dark mode; dialogs keep their close X*.
- Validate in CI: `npx @google/design.md@<pinned> lint public/design.md`.
- Serve at `design.edgecom.ai/design.md`. Provide the one-liner for Claude Design sessions.
- ⚠️ Spec is **alpha** — pin the CLI version and watch for breaking changes.

### Phase 3 — split `AGENTS.md` into modular sources   *[refactor; settle decision #2 first]*

- Author under `docs/agents/*.md`, e.g.:
  - `00-setup.md` (setup, scripts, verifying)
  - `10-house-style.md` (stack, authoring primitives, demos)
  - `20-tokens-a11y.md` (design tokens & accessibility)
  - `30-ui-guardrails.md` (the big "UI guardrails" umbrella)
  - `40-architecture.md` (generated files, adding a component, docs-site, → REGISTRY.md)
  - `90-do-nots.md`
- Add `scripts/gen-agents.mjs`: concatenate them (**the `nextjs-agent-rules` marker block first**) → the single root **`AGENTS.md`**.
- **Critical:** the *shipped* `AGENTS.md` stays **one self-contained, portable file**. Authoring is modular; the output isn't.
  - *Why not just `@import` the split files from `CLAUDE.md`?* `@import` is **Claude-Code-only**. Cursor/Copilot/etc. read `AGENTS.md` **literally** — with `@import` they'd see include directives as plain text and **miss the rules**. `AGENTS.md` being a single portable file is the entire reason it exists as the cross-tool standard. Generating one file preserves that.
- `CLAUDE.md` stays `@AGENTS.md`.

### (Future, not in this plan but the natural next step) — enforcement

The reliability principle (§2) says the durable fix is **CI/lint**, not docs. A future phase: a shared ESLint/CI config (published like a registry item) encoding the *checkable* rules (no hardcoded hex, no `bg-black/*` scrims, no brand-blue active states, no `showCloseButton={false}`, icon buttons for secondary actions, …), run in every repo's CI. Plus a PR-review agent tuned to the guardrails. This is what makes the rules *binding* rather than advisory. Flagged here so it's on the roadmap.

## 7. Open decisions (need dev input)

1. **Split granularity** — 6 topic files (above) or finer (one file per guardrail group)?
2. **`AGENTS.md` output** — generated single file (recommended, portable) vs. `CLAUDE.md` `@import`ing the parts (Claude-Code-only, simpler, not portable)?
3. **`llms-full.txt`** — ship the full-content variant too, or just the index?
4. **`design.md` scope** — auto-generate purely from tokens, or hand-curate the component archetypes + Do/Don't for a richer file (more maintenance)?
5. **`design.md` alpha risk** — adopt now and track breaking changes, or wait for the format to reach beta?
6. **Consumer propagation** (separate but related) — how do the portal/admin repos get `AGENTS.md` + the theme *updates* automatically (version bump + update-PR bot), rather than a one-time manual copy? This is the fix for the "stale token snapshot" problem.

## 8. Recommended sequencing

1. **Phase 1 (`llms.txt`)** and **Phase 2 (`design.md`)** first — both are *new generated public files*, no restructuring, and they close the two biggest gaps (design-phase guidance + on-demand catalog).
2. **Phase 3 (split `AGENTS.md`)** after decision #2 is settled — it's a refactor with the portability nuance.
3. **Enforcement (future)** — the highest-durability layer; scope it once the artifacts exist.

## Appendix — current state (facts to build on)

- **Repo** = single source of truth: components in `src/components/ui/*`, tokens in `src/app/globals.css` (OKLCH, light + dark), rules in `AGENTS.md` (~250 lines / 30KB today), reference in `REGISTRY.md`.
- **Generation pipeline** already exists: `scripts/gen-registry.mjs`, `gen-docs-source.mjs`, `gen-api.mjs`, `gen-routes.mjs`, chained by `pnpm docs:gen`; `prebuild` runs `docs:gen` + `registry:build`. New generators slot into this.
- **`CLAUDE.md`** is just `@AGENTS.md` (Claude Code loads the rules via that import).
- **Docs site** = static export (`output: "export"`) served at **`design.edgecom.ai` root** (no base path) → `public/*` files get clean public URLs.
- **Package manager:** pnpm.
