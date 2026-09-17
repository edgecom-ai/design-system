# `.design-sync/`

Inputs for the Claude Design converter, which renders each primitive into a card
for a Claude Design design-system project. Nothing here affects the docs site or
the shadcn registry — `pnpm build` and `pnpm registry:build` never read it.

| Path | What it is |
|---|---|
| `previews/<Root>.tsx` | Hand-authored preview module per primitive. Each named export is one cell on that component's card. |
| `conventions.md` | Prepended to the generated project README — how to build with this system, for whoever reads it there. |
| `config.json` | Converter configuration. **Not committed:** it names a specific Claude Design project, and this repo is public. |
| `.cache/`, `bundle/` | Generated. Rebuilt by `pnpm design:build`; never hand-edited. |

## Writing a preview

Most previews re-export the docs site's own demos from `@/components/demo/*` or
`@/components/shadcn-studio/**`. Prefer that over writing a new cell: the demo is
already the maintained example, and a preview that drifts from it documents
something the design system does not actually ship.

Write a cell by hand only when no demo fits — when the demo is trigger-driven
and renders closed, depends on a remote image, or illustrates a variant the
docs site has no page for.

Two constraints that are easy to miss:

- **Only utility classes the repo's own source already uses exist in the
  generated stylesheet.** It is compiled by scanning `src/**`, so an arbitrary
  class in a preview silently does nothing. Type-scale utilities carry no size
  suffix — `text-heading`, never `text-heading-md`.
- **Overlay roots must render open**, via `open`, `defaultOpen` or
  `defaultValue`, and their trigger needs room in the configured viewport or
  Base UI flips the popup to the other side and the cell stops illustrating what
  it claims.

Previews are linted and typechecked with the rest of the repo — see
`eslint.config.mjs`, which excludes the generated directories here but
deliberately holds `previews/` to the same bar as `src/`.
