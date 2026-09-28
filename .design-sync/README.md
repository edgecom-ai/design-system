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
| `bundle/_overlay.json` | Generated. Which bundle paths to upload into a project this converter has already populated, and which are for a standalone project only. See MAINTAINERS.md → *Two shapes of destination*. |
| `bundle/_manifest.example.json` | Generated. The design handoff manifest a design ships beside itself, copied from the published example so it names the same version and digest as `_system.json`. Part of the overlay. |
| `bundle/_ds_needs_recompile` | Generated. Upload it **last**. The platform only recompiles its card index and token manifest when someone opens the project with this marker present; without it an upload changes nothing a designer can see. |

## Writing a preview

Most previews re-export the docs site's own demos from `@/components/demo/*` or
`@/components/shadcn-studio/**`. Prefer that over writing a new cell: the demo is
already the maintained example, and a preview that drifts from it documents
something the design system does not actually ship.

Write a cell by hand only when no demo fits — when the demo is trigger-driven
and renders closed, depends on a remote image, or illustrates a variant the
docs site has no page for.

Two constraints that are easy to miss:

- **The generated stylesheet holds only the classes the repo writes.** It is
  compiled by scanning `src/**`, these previews and `conventions.md`, so a class
  used in a preview is compiled with it — and a class that leaves the last file
  using it disappears from every design built with the system. A class named in
  `conventions.md` is guaranteed to exist, because the header is scanned too.
  Type-scale utilities carry no size suffix — `text-heading`, never
  `text-heading-md`.
- **Overlay roots must render open**, via `open`, `defaultOpen` or
  `defaultValue`, and their trigger needs room in the configured viewport or
  Base UI flips the popup to the other side and the cell stops illustrating what
  it claims.

Previews are linted and typechecked with the rest of the repo — see
`eslint.config.mjs`, which excludes the generated directories here but
deliberately holds `previews/` to the same bar as `src/`.
