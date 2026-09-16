---
name: design-edgecom-ui
description: Author or change something in the Edgecom design system itself — a registry primitive, a demo, a doc section, or a token. Use when working inside the design-system repo on src/components/ui, src/components/demo, src/hooks, or src/app/globals.css. Covers the full add/change procedure, the regeneration steps, and the verification gates.
---

# Changing the design system

You are in the producer repo. Whatever you add here ships to every consuming app through the registry, so the bar is the published bar.

## Before you start

1. **Read [design.md](../../../design.md)** — the design language and guardrails. Required for any UI.
2. **Check it doesn't already exist.** `ls src/components/ui/` and browse the docs site. Reuse over reinvention is the first principle; a parallel version of an existing primitive is the most expensive mistake available here.
3. If you are changing an existing primitive, check what depends on it: `grep -rl "components/ui/<name>" src/`.

## Adding or changing a component

1. **Primitive** → `src/components/ui/<name>.tsx`. House style is in `.claude/rules/ui-primitives.md` (it loads when you open the file): function declarations not `forwardRef`, double quotes and no semicolons, `cva` + `VariantProps`, `cn()`, a `data-slot` on every element, one `export { … }` block at the end, Base UI `render` prop not `asChild`.
2. **Demo** → `src/components/demo/<name>-demo.tsx`. Named export, PascalCase ending in `Demo`, matching the filename. `"use client"` only if interactive. Edgecom domain copy with fictional proper nouns — this repo is public and demo copy ships verbatim.
3. **Register the section** in `src/app/sections.tsx`.
4. **Curated API copy** → `src/docs/curated.ts` (`summary` / `parts` / `propDescriptions` / `omitProps`). Note this file uses semicolons + double quotes, unlike the primitives.
5. **`pnpm registry:build`.**

You never declare dependencies. Package deps, cross-component `registryDependencies`, hooks, and the always-on `theme` dependency are all inferred from imports. Each package dep ships with the range this repo's `package.json` declares — so adding a package here is what consumers install.

## Changing a token

Tokens live only in `src/app/globals.css`. Edit **both** `:root` and `.dark`, add the `--color-*: var(--…)` mapping in `@theme inline` to expose a new one to Tailwind, then `pnpm registry:build` so the `theme` item regenerates. Verify on the live Foundations → Semantic colors page, which has the contrast meter, in both themes. Details in `.claude/rules/tokens.md`.

## Verify before you claim done

There is no test framework. The gates are:

```bash
pnpm lint
npx tsc --noEmit
pnpm registry:build      # includes registry:check
```

`registry:check` audits built items for imports the manifest doesn't declare, deps with no version range, registry dependencies no item provides, type tokens paired with a `leading-*`/weight override, and any reference to a `--chart-legacy-*` token.

For anything visible, run the docs site and look at it in **both light and dark**. Headless screenshots via Playwright + system Chrome are more reliable here than extension captures, which go stale on hidden tabs.

A full `pnpm build` also validates the static-export prerender end to end.

## Committing

Conventional-commit subject — `type(scope): summary`. The changelog page is generated from it and publishes the summary verbatim, so write it for a reader of the docs site. Affected registry items are inferred from the files you touched. Branch and open a PR; never commit to `main`, which deploys design.edgecom.ai.
