---
paths:
  - "src/components/demo/**/*.tsx"
---

# Demos

Demos are what the docs site renders and what `/design-sync` will author component previews from — they are the visible surface of the design system, so they have to be exemplary UI, not filler.

- **Named export**, PascalCase ending in `Demo`, matching the filename: `sheet-demo.tsx` → `export function SheetDemo()`.
- **`"use client"` only when the demo is interactive.**
- **Edgecom domain copy** — sites, meters, commodities, kW. Never lorem ipsum.
- **Proper nouns must be fictional.** This is a public repo and demo copy ships verbatim; don't put a real customer, site, or person in a demo.
- Follow `design.md` in full. A demo that violates a guardrail teaches every consumer to violate it.

Register the section in `src/app/sections.tsx` and add curated API copy to `src/docs/curated.ts` when the demo introduces a new component.
