---
paths:
  - "src/components/shadcn-studio/**"
---

# Vendored shadcn-studio components

These are **docs demos, not registry items** — vendor-imported from shadcn-studio. They use default exports, arrow functions, and a single-quote style that differs from this repo's house style.

- **Leave the style as-is.** Don't reformat them to match the house style; the diff noise makes the next upstream pull unreadable.
- **Don't `--overwrite`** our custom `src/components/ui` primitives when pulling upstream studio components.
- They are consumed only by the doc pages. Nothing here ships to a consumer.
- **Keep `LICENSE` with the files.** It carries shadcn/studio's notice, which every copy has to include.
- **Images are ours.** Point avatars and pictures at `https://design.edgecom.ai/demo/…` (the files live in `public/demo/`, and an absolute URL still resolves in a design canvas or an artifact preview). Never hotlink another site's assets.

The house style in `.claude/rules/ui-primitives.md` applies to `src/components/ui/*`, not to this directory.
