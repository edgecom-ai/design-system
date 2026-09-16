@AGENTS.md

## Claude Code specifics

- **Skills** carry the long procedures — invoke rather than improvise: `/design-edgecom-ui` (author or change a primitive, demo, or token), `/implement-edgecom-design` (build product UI from a Claude Design link), `/audit-edgecom-ui` (check existing UI against the design system).
- **Path-scoped rules** in `.claude/rules/` load on their own when you read a matching file. If you are about to edit `src/components/ui/*`, `src/components/demo/*`, or `src/app/globals.css` without having seen its rule, read the file first so the rule loads.
- **Never commit to `main`.** `main` deploys `design.edgecom.ai`. Branch, then open a PR.
- The browser preview launches the dev server from `.claude/launch.json`; its `runtimeExecutable` must resolve to a real pnpm binary on this machine.
