---
paths:
  - "src/app/globals.css"
---

# Editing tokens

`globals.css` is the single source of truth for tokens — there is no `tailwind.config.js`. `@theme inline` maps each Tailwind utility to a CSS var; `:root` holds the complete light set and `.dark` overrides only what differs.

- **Set both `:root` and `.dark`**, or confirm deliberately that the light value is meant to inherit. A token edited in one block only is a bug.
- **Expose a new token to Tailwind** by adding its `--color-*: var(--…)` mapping in `@theme inline`. Omitting the mapping is how a token is deliberately made unreachable from a class — that is the mechanism guarding `--chart-legacy-*`.
- **Some rules here are app-level CSS the `theme` registry item does _not_ ship**: the `cursor: pointer` base-layer rule, `color-scheme`, and the `@utility tabular` helper. Keep them; consuming apps add their own (see `public/agents.md`).
- **Run `pnpm registry:build`** after any token change so the `theme` item regenerates, and `pnpm docs:gen` so `design.md`'s generated token block follows.
- **Verify on the live Foundations → Semantic colors page**, which has the contrast meter, in **both** light and dark.

Which token means what, and the WCAG bar each has to clear, are in `design.md` → *Colors*. Read it before adding or retuning one.

## Legacy palettes

`--chart-legacy-*` exists only so a product porting plots operators already read by colour can delete its hex literals. Never add a hue or a role to that set, never build a new feature on it, and never give it a `--color-*` mapping. `pnpm registry:check` fails the build if a shipped primitive references one.
