---
name: audit-edgecom-ui
description: Audit existing UI against the Edgecom design system — finding hardcoded colours, ad-hoc type, hand-rolled duplicates of registry primitives, wrong status semantics, missing states, stale tokens, and accessibility gaps. Use when reviewing a PR, checking a screen for conformance, or measuring registry adoption in a consuming app.
---

# Auditing UI against the design system

Report findings; don't silently rewrite the code unless asked to fix.

## Mechanical checks first

These are grep-able and carry no judgement. Run them before reading anything.

```bash
# Raw colour literals — every colour must be a semantic token
grep -rnE '#[0-9a-fA-F]{3,8}\b|\b(rgb|rgba|hsl|hsla)\(' src/ --include='*.tsx' --include='*.css'

# Ad-hoc type instead of the semantic scale
grep -rnE '\btext-(xs|sm|base|lg|xl|[2-9]xl)\b' src/ --include='*.tsx'

# Type tokens paired with a leading-* or weight override (the token already sets both)
grep -rnE 'text-(caption|body-sm|body|body-lg|title|heading|display)[^"]*\b(leading-|font-(thin|light|normal|medium|semibold|bold))' src/ --include='*.tsx'

# Dead Base UI orientation selectors — these compile to presence selectors that never match
grep -rnE 'data-\[?(horizontal|vertical)\]?:' src/ --include='*.tsx'

# Legacy palette leaking out of migration code
grep -rn 'chart-legacy-' src/ --include='*.tsx'

# Fixed px where the rem scales belong
grep -rnE '\b(w|h|text|p|m|gap)-\[[0-9.]+px\]' src/ --include='*.tsx'
```

In this repo, `pnpm registry:check` is the deterministic gate and already covers undeclared imports, unversioned deps, missing registry dependencies, type-token overrides, and legacy-token references in shipped primitives.

## Judgement checks

Read [design.md](https://design.edgecom.ai/design.md) and check against it:

- **Reinvention.** Is anything hand-rolled that the registry already provides? Count it — registry-component imports over all UI-component imports is the reuse measure.
- **Status semantics.** Is every `success`/`warning`/`info`/`destructive` used by meaning, never decoratively? Is `destructive` used for anything other than an error or destructive action? Is a commodity red standing in for an error, or vice versa?
- **Shade by role.** Any base fill colour used as a text colour? Any `-subtle` surface without its `-subtle-foreground`?
- **Dark mode.** Anything light-only. Any `primary` lightened in dark rather than `primary-emphasis` for text. Any `popover` collapsed to `card`'s lightness. Any hardcoded scrim.
- **Active states** recoloured with brand blue instead of the neutral `accent` highlight.
- **Overlays.** A dialog or sheet without its top-right close (X). A destructive action wired straight to its trigger with no `alert-dialog`. A fourth z-index layer, or a z-index on a Popup instead of its Positioner.
- **Tabs variant** left on `default` over a tinted surface or inside an overlay, where the `muted` track has no lightness step left.
- **States.** Missing loading / empty / error handling; an async failure with no retry; a blocked submit with no inline, specific error text.
- **Charts.** Missing the standard control set (one shared date range, smooth/step toggle, statistical overlays, one export icon-button dropdown). A left- or right-aligned legend. Bars with no gap, pill-shaped or bottom-rounded bars, reference lines in a status or commodity hue.
- **Accessibility.** Contrast under 4.5:1 for body text or 3:1 for large text and UI, in *either* theme. `outline: none` with no replacement focus ring. Unlabelled fields. Status signalled by colour alone.

## Stale tokens

A consuming app's `theme` is a snapshot taken at install. Check whether its `globals.css` token values still match the current design system; if they don't, the fix is re-running the theme install with `--overwrite`, not hand-editing values.

## Reporting

Group findings by severity, name the file and line, and say which rule each one breaks. Distinguish a violation from a judgement call, and don't pad the list — a report where every item is real gets acted on.
