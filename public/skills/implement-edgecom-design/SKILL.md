---
name: implement-edgecom-design
description: Implement product UI from a Claude Design link using the Edgecom design system — resolving designed elements to registry components through their published contracts, installing them, and reconciling design intent against the design-system contracts. Use when given a Claude Design link, a design spec, or a screenshot to build against, in a consuming app.
---

# Implementing a design with the Edgecom design system

A Claude Design output is an **online link**, not a file on disk. Read it through the Claude Design MCP.

You are reconciling two inputs, and they carry different authority:

- **The design** defines product intent — layout, hierarchy, responsive behaviour, interaction.
- **The design system** defines what is permitted — components, variants, tokens, semantics, accessibility, the implementation API.

This is a dual-input consistency problem. Neither side may be silently approximated.

## Where the design system's data is

Everything an agent needs is served from `design.edgecom.ai`, stamped with the same `version` and `digest`:

| Address | Use it for |
|---|---|
| `https://design.edgecom.ai/contracts/index.json` | Resolving an element: every component's summary, purpose, `useWhen`/`dontUseWhen`, variants with options and defaults, parts, install command, full-contract URL. |
| `https://design.edgecom.ai/contracts/<id>.json` | One component's full contract: tokens reached, states styled, props, `requires`/`forbids`, `behavior`, `a11y`, `antiPatterns`. |
| `https://design.edgecom.ai/tokens.json` | The token model, for a staleness check against the app's installed `theme`. |
| `https://design.edgecom.ai/design-manifest.example.json` | The design handoff manifest, complete and stamped with the current identity — the shape of the `<Name>.manifest.json` you will find beside a design. Schema: `https://design.edgecom.ai/schemas/design-manifest.schema.json`. |
| `https://design.edgecom.ai/tools/check-design-manifest.mjs` | Dependency-free validator for a manifest: `curl -fsSL <address> -o check-design-manifest.mjs && node check-design-manifest.mjs <Name>.manifest.json`. Checks shape, that the version and digest are current, and that every component, variant, part and token exists. |
| `https://design.edgecom.ai/design.md` | The design language and usage guardrails — required reading, not advisory. |
| `https://design.edgecom.ai/agents.md` | The consumer guide: install mechanics, token sync, responsiveness, dark mode, do-nots. |

A contract's derived half — `variants`, `tokens`, `states`, `parts`, `props` — is read from the primitive on every build, so it cannot claim something the component does not implement. Its authored half — `purpose`, `useWhen`, `requires`, `forbids`, `behavior`, `antiPatterns` — is written by a maintainer; `authored: false` means only the derived half exists and `design.md` is the selection guidance.

## Precedence

When the two disagree, resolve in this order:

1. Product requirements — the required user outcome and content.
2. The design — layout, hierarchy, responsive and interaction intent.
3. The design-system contracts — permitted primitives, variants, tokens, semantics, accessibility.
4. Registry source — the implementation API.
5. A deviation is allowed **only** when recorded as an approved exception.

**Never silently approximate either side.** If the design asks for something a contract forbids, identify the conflict, implement the valid design-system version, and report the visual impact.

## Procedure

1. **Read the design's manifest first** — `<Name>.manifest.json` beside `<Name>.dc.html` in the design project, through the Claude Design MCP. It carries `designSystemVersion` and `designSystemDigest`, one entry per designed element with its registry `component`, `variants` and `parts`, the `tokens` the design reaches for, the `viewports`, `themes` and `states` it covers, its `interactions`, and its `approvedExceptions`. **Validate it** with the published validator before anything else — run it over a local copy with the design file beside it, or pass `--design <file>`, so the `data-instance` join is checked too; every finding it prints is something to report or resolve, not to approximate. If the project has no manifest for this design, read `_system.json` for the version pair, resolve every element yourself in step 3, say plainly that the design shipped without a manifest, and write down what you resolved to — that record is the manifest the design should have had.
2. **Check versions.** The manifest's pair (or `_system.json`'s) must equal `contracts/index.json`'s `version` and `digest` — they are one value, the identity of the whole system, stamped into every published file. Report a mismatch before building: the design was drawn against a system that no longer exists as such. Then compare the consuming app's `globals.css` token values with `tokens.json` — the `theme` is a copy-on-install snapshot, not a live link, so a design generated against current tokens can meet an app holding an older set. If stale, re-sync with `pnpm dlx shadcn@latest add edgecom-ai/design-system/theme --overwrite` first.
3. **Resolve each designed element to a registry component** before writing any layout. With a manifest, each instance already names its `component` and `variants`; confirm them against `contracts/index.json` and look up each `instanceId` in the design by its `data-instance` attribute. Without one, match on `summary`, `purpose`, `useWhen` and `dontUseWhen`, and pick the variant from `variants`. A variant not in that list does not exist. Don't build freeform and retrofit components onto it.
4. **Fetch the full contract** of every component you resolved to. `requires` and `forbids` decide the composition; `behavior` decides the loading, empty, error and destructive paths; `a11y.requirements` is what you still have to supply.
5. **Read the guardrails** — [design.md](https://design.edgecom.ai/design.md) — and the consumer guide, [agents.md](https://design.edgecom.ai/agents.md).
6. **Install what's missing** from the registry:
   ```bash
   pnpm dlx shadcn@latest add edgecom-ai/design-system/<name>
   ```
   Preview with `--dry-run`; pin with `#ref`. The first `add` injects the theme. The CLI prints each item's docs page and contract address after installing it.
7. **Implement layout and behaviour** — compose the installed primitives. Never copy a primitive to tweak it, reach into its internals, or hand-roll a parallel version. Extend through its exposed `cva` variants and `size` props.
8. **Cover the states the design implies** — loading, empty, error, success — plus light/dark and mobile/desktop. The manifest's `states`, `themes` and `viewports` say which the design actually drew; the validator warns about any it lacks, and those gaps are yours to fill from the contract's `behavior`, which says what each primitive does in those paths. The manifest's `interactions` are the behaviour to wire; anything in `approvedExceptions` is the only deviation from a contract you may keep.
9. **Verify:** both themes, both viewport ends, keyboard reachability and focus rings, and every status colour used by meaning. Check each contract's `antiPatterns` against what you built.

## When no component fits

**STOP and ask.** Do not hand-roll a bespoke component silently. Offer three options and proceed only after a choice: (a) adapt the closest existing registry component, (b) request it be added to the design system, (c) get explicit approval for a documented, clearly-marked local one-off.

## Not built yet

These are planned and do not exist today — don't invoke them and don't pretend their output:

- `edgecom ds search|inspect|audit` structured commands. Today the equivalent is fetching `contracts/index.json` and the per-component contracts directly. `validate-design` exists as the published validator above.
- Automated stale-*design* detection across a project. Today it is the validator, run per manifest.

Designs produced before the manifest existed carry none — for those, verify the version through the project's `_system.json` and component identity by reading the design directly, and say so.
