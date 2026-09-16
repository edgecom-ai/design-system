---
paths:
  - "src/components/shadcn-studio/**"
---

# Vendored shadcn-studio components

These are **docs demos, not registry items** — vendor-imported from shadcn-studio. They use default exports, arrow functions, and a single-quote style that differs from this repo's house style.

- **Leave the style as-is.** Don't reformat them to match the house style; the diff noise makes the next upstream pull unreadable.
- **Don't `--overwrite`** our custom `src/components/ui` primitives when pulling upstream studio components.
- They are consumed only by the doc pages. Nothing here ships to a consumer.

The house style in `.claude/rules/ui-primitives.md` applies to `src/components/ui/*`, not to this directory.
