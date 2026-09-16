---
paths:
  - "src/components/ui/**/*.tsx"
  - "src/hooks/**/*.{ts,tsx}"
---

# Authoring a registry primitive

These files ship to consumers through the registry. Canonical examples: `src/components/ui/button.tsx`, `alert.tsx`, `badge.tsx` — match them.

- **Function declarations, not `forwardRef`.** React 19 passes `ref` as a normal prop, and Base UI primitives already accept it.
- **Double quotes, no semicolons.** This is load-bearing beyond style: `shadcn add` rewrites `@/components/ui/*` specifiers to the consumer's alias, and single-quoted specifiers have been reported to rewrite wrong. Registry-shipped sources keep double-quoted specifiers even where a neighbouring vendored file is single-quoted.
- **`cva`** for variants. Type props as `React.ComponentProps<"div">` for plain elements, or the primitive's own type (`ButtonPrimitive.Props`, `DialogPrimitive.Popup.Props`), **intersected with** `VariantProps<typeof xVariants>`. Add component-specific props by intersection.
- **`cn()`** from `@/lib/utils` composes classes.
- **A `data-slot` on every element.** Styling hooks and sibling/child selectors depend on them.
- **Re-export** the wrapped primitives and any `*Variants` in one `export { … }` block at the end. Never export the raw primitive.
- **Polymorphism** uses the `useRender` + `mergeProps` pattern — see `badge.tsx`.

## Base UI, not Radix

The package is `@base-ui/react`, imported per subpath (`@base-ui/react/dialog`). Triggers take the **`render` prop**; there is no `asChild`:

```tsx
<DialogTrigger render={<Button>Open</Button>} />   // ✅
<DialogTrigger asChild><Button>Open</Button></DialogTrigger>  // ❌ Radix-style
```

Orientation is exposed as `data-orientation="horizontal|vertical"` — style it with the value-matched `data-[orientation=…]` variant (and its `group-data-[orientation=…]/name` forms). **Never** bare `data-horizontal`/`data-vertical`: in Tailwind v4 those compile to presence selectors that never match, so the styles are silently dead.

## After you change one

Run `pnpm registry:build`. Package deps, cross-component `registryDependencies`, hooks, and the always-on `theme` dependency are **inferred from imports** — you never declare them. Each package dep ships with the range this repo's `package.json` declares, so `pnpm add`-ing a package here is what consumers install: bump the dep and migrate the components using it in the same change.

The design guardrails in `design.md` apply to this file too — read it before authoring UI.
