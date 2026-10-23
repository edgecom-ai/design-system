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

# A field re-tinted to read on the muted page body — surface="page" is the fix.
# bg-outline-surface is the hand-patched form of the same thing. Single-line
# matches only: a multi-line className needs the runtime check below.
grep -rnE '<(Input|InputGroup|Textarea|PhoneInput|SelectTrigger|NativeSelect|ComboboxInput|ComboboxChips|MultiSelect|MultipleSelector|TagsInput|Toggle|ToggleGroup|ToggleGroupItem)\b[^>]*\b(bg-background|bg-card|bg-white|bg-outline-surface)\b' src/ --include='*.tsx'
```

Every field, trigger and toggle renders `data-surface`, so the surface rule is also checkable in the running app. Paste this into the console on each page that has a filter row; it lists the controls painted straight on the `muted` page body (no `card` around them) that are still on `surface="default"`. A ghost toggle is skipped: like a ghost button it has no face to swap.

```js
(() => {
  const probe = document.body.appendChild(Object.assign(document.createElement("div"), { style: "background: var(--muted)" }))
  const muted = getComputedStyle(probe).backgroundColor
  probe.remove()
  const painted = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      const bg = getComputedStyle(p).backgroundColor
      if (bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg
    }
  }
  return [...document.querySelectorAll('[data-surface="default"]')].filter((el) =>
    !el.matches('[data-slot="native-select-wrapper"]') && // its <select> is checked instead
    !el.matches('[data-slot="toggle"]:not([data-variant="outline"]), [data-slot="toggle-group-item"]:not([data-variant="outline"])') && // ghost toggles have no face to swap
    !el.parentElement?.closest('[data-slot="input-group"]') && // the group carries the surface
    !el.closest('[data-slot="card"]') &&
    painted(el) === muted)
})()
```

In the design-system repo itself, `pnpm registry:check` is the deterministic gate and already covers undeclared imports, unversioned deps, missing registry dependencies, type-token overrides, and legacy-token references in shipped primitives.

## Judgement checks

Read [design.md](https://design.edgecom.ai/design.md) and check against it. For what the registry provides and what each component permits, use the published contracts — [contracts/index.json](https://design.edgecom.ai/contracts/index.json) for the list, `https://design.edgecom.ai/contracts/<id>.json` for one component — rather than memory:

- **Reinvention.** Is anything hand-rolled that the registry already provides? The index is the list of what exists. Count it — registry-component imports over all UI-component imports is the reuse measure.
- **Contract violations.** For each registry component in use, check the code against its contract: a variant not in `variants`; a composition in `forbids`; one in `requires` that is missing; a state in `behavior` that the code does not handle; an `a11y.requirements` entry the consumer never supplied; anything listed in `antiPatterns`.
- **Status semantics.** Is every `success`/`warning`/`info`/`destructive` used by meaning, never decoratively? Is `destructive` used for anything other than an error or destructive action? Is a commodity red standing in for an error, or vice versa?
- **Shade by role.** Any base fill colour used as a text colour? Any `-subtle` surface without its `-subtle-foreground`?
- **Dark mode.** Anything light-only. Any `primary` lightened in dark rather than `primary-emphasis` for text. Any `popover` collapsed to `card`'s lightness. Any hardcoded scrim.
- **Active states** recoloured with brand blue instead of the neutral `accent` highlight.
- **Overlays.** A dialog or sheet without its top-right close (X). A destructive action wired straight to its trigger with no `alert-dialog`. A fourth z-index layer, or a z-index on a Popup instead of its Positioner.
- **Tabs variant** left on `default` over a tinted surface or inside an overlay, where the `muted` track has no lightness step left.
- **Field surface.** A field, trigger, outline toggle or toggle group placed straight on the `muted` page body, not inside a `card`, without `data-surface="page"`: it has no face there and dissolves into the grey beside the outline buttons. And any of them given `bg-background`, `bg-card` or `bg-white` to fix that: in dark `background` is darker than `card`, so the control sinks below the cards beside it. The fix for both is `surface="page"`. Inside a card, sheet, dialog or table row the control stays on `default`, so a tinted row still shows through it. A ghost toggle needs nothing on either surface, exactly like a ghost button.
- **States.** Missing loading / empty / error handling; an async failure with no retry; a blocked submit with no inline, specific error text.
- **Charts.** Missing the standard control set (one shared date range, smooth/step toggle, statistical overlays, one export icon-button dropdown). An event-window chart — one event's reading, over a window the event sets — carries only the export menu, with the crossed threshold as its reference line; don't flag the controls it drops, but do flag one given a date range or tied to the page's range. A left- or right-aligned legend. Bars with no gap, pill-shaped or bottom-rounded bars, reference lines in a status or commodity hue.
- **Accessibility.** Contrast under 4.5:1 for body text or 3:1 for large text and UI, in *either* theme. `outline: none` with no replacement focus ring. Unlabelled fields. Status signalled by colour alone.

## Stale tokens

A consuming app's `theme` is a snapshot taken at install, and the install stamps `--edgecom-theme: "<version> <digest>"` into `:root` of the app's `globals.css`. Grep for it and compare with the `version` and `digest` in [tokens.json](https://design.edgecom.ai/tokens.json); a missing stamp means a theme installed before the stamp existed, which is stale by definition. If they differ, the fix is re-running the theme install with `--overwrite`, not hand-editing values — tokens.json lists every token's current light and dark value, so the diff is readable before you overwrite.

## Benchmarking Claude Design output

To measure the design system as a whole rather than one screen's defects, run [benchmarks/alarms-page.md](benchmarks/alarms-page.md): a fixed prompt in a product manager's words, pasted into Claude Design verbatim after each release and scored out of 12. Add a sibling file for another screen only when it exercises components this one does not.

## Reporting

Group findings by severity, name the file and line, and say which rule each one breaks. Distinguish a violation from a judgement call, and don't pad the list — a report where every item is real gets acted on.
