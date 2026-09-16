---
name: implement-edgecom-design
description: Implement product UI from a Claude Design link using the Edgecom design system — resolving designed elements to registry components, installing them, and reconciling design intent against the design-system contracts. Use when given a Claude Design link, a design spec, or a screenshot to build against, in a consuming app.
---

# Implementing a design with the Edgecom design system

A Claude Design output is an **online link**, not a file on disk. Read it through the Claude Design MCP.

You are reconciling two inputs, and they carry different authority:

- **The design** defines product intent — layout, hierarchy, responsive behaviour, interaction.
- **The design system** defines what is permitted — components, variants, tokens, semantics, accessibility, the implementation API.

This is a dual-input consistency problem. Neither side may be silently approximated.

## Precedence

When the two disagree, resolve in this order:

1. Product requirements — the required user outcome and content.
2. The design — layout, hierarchy, responsive and interaction intent.
3. The design-system contracts — permitted primitives, variants, tokens, semantics, accessibility.
4. Registry source — the implementation API.
5. A deviation is allowed **only** when recorded as an approved exception in the design manifest.

**Never silently approximate either side.** If the design asks for something the design system forbids, identify the conflict, implement the valid design-system version, and report the visual impact.

## Procedure

1. **Read the design** through the Claude Design MCP, along with its manifest.
2. **Check the design-system version** the design was generated against, and report staleness if the consuming app is on an older one. The consumer's `theme` is a copy-on-install snapshot, not a live link — a design generated against current tokens can meet an app holding an older set.
3. **Resolve each designed element to a registry component** before writing any layout. Don't build freeform and retrofit components onto it.
4. **Read the guardrails** — [design.edgecom.ai/design.md](https://design.edgecom.ai/design.md) — and the consumer guide, [design.edgecom.ai/agents.md](https://design.edgecom.ai/agents.md).
5. **Install what's missing** from the registry:
   ```bash
   pnpm dlx shadcn@latest add edgecom-ai/design-system/<name>
   ```
   Preview with `--dry-run`; pin with `#ref`. The first `add` injects the theme.
6. **Implement layout and behaviour** — compose the installed primitives. Never copy a primitive to tweak it, reach into its internals, or hand-roll a parallel version. Extend through its exposed `cva` variants and `size` props.
7. **Cover the states the design implies** — loading, empty, error, success — plus light/dark and mobile/desktop.
8. **Verify:** both themes, both viewport ends, keyboard reachability and focus rings, and every status colour used by meaning.

## When no component fits

**STOP and ask.** Do not hand-roll a bespoke component silently. Offer three options and proceed only after a choice: (a) adapt the closest existing registry component, (b) request it be added to the design system, (c) get explicit approval for a documented, clearly-marked local one-off.

## Not built yet

These are planned and do not exist today — don't invoke them and don't pretend their output:

- `edgecom ds search|inspect|validate-design|audit` structured commands.
- The design handoff manifest (`designSystemVersion`, component instance IDs, approved exceptions) is a Phase 3 deliverable; designs produced before it carry no manifest, so verify version and component identity by reading the design directly.
- Component contracts. Until they exist, `design.md` plus the live docs site are the authority on selection and variants.
