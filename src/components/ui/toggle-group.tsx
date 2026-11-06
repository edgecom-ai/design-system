"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

// `layout` is the group's shape. `connected` joins the items into one strip
// with no frame — the interval or preset switcher of a chart header and a
// toolbar, the same height as the controls beside it. `spaced` sets the items
// a gap apart inside a padded, bordered frame — a formatting toolbar of ghost
// icon toggles, where the frame is what groups them. It is a string axis so a
// design can cite it and a canvas can pass it as an attribute; the numeric
// `spacing` prop stays as an alias (`0` is connected, anything else spaced).
//
// The default follows `variant`: an outline group is connected, since outline
// items carry their own borders and a frame around them doubles up; a ghost
// group is spaced, since the frame is the only edge its items have.
//
// A connected group owns its corners and its outer border: it clips the items
// to its own radius and, for outline items, draws the frame they share. The
// items owe nothing to sibling position — a Design canvas wraps every mounted
// item in an element of its own, so `first:`/`last:` rules there made every
// item a fully rounded, fully bordered pill.
const toggleGroupVariants = cva("flex w-fit items-center rounded-lg", {
  variants: {
    layout: {
      connected: "overflow-hidden",
      spaced: "gap-1 border border-input bg-background p-1",
    },
    variant: {
      default: "",
      outline: "",
    },
  },
  compoundVariants: [
    {
      layout: "connected",
      variant: "outline",
      className: "border border-input",
    },
  ],
  // `layout` has no fixed default: it follows `variant` (below).
  defaultVariants: {
    variant: "default",
  },
})

type ToggleGroupLayout = NonNullable<VariantProps<typeof toggleGroupVariants>["layout"]>

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
  layout: ToggleGroupLayout
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  size: "default",
  variant: "default",
  surface: "default",
  layout: "spaced",
})

// `surface` names what the group sits on — see `toggleVariants`. Which
// element wears it depends on `layout`: a connected group has no frame, so its
// items are the face and take the surface; a spaced group's frame is the face,
// so the frame takes it and the items inside stay `default` — they sit on the
// frame, not on the page.
function ToggleGroup({
  className,
  variant,
  size,
  surface = "default",
  layout,
  spacing,
  children,
  ...props
}: ToggleGroupPrimitive.Props<string> &
  VariantProps<typeof toggleVariants> &
  VariantProps<typeof toggleGroupVariants> & {
    /** Alias of `layout`: `0` is `connected`, any other value `spaced`. */
    spacing?: number
  }) {
  const resolvedLayout: ToggleGroupLayout =
    layout ??
    (spacing !== undefined
      ? spacing === 0
        ? "connected"
        : "spaced"
      : variant === "outline"
        ? "connected"
        : "spaced")
  const connected = resolvedLayout === "connected"

  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-surface={surface}
      data-layout={resolvedLayout}
      className={cn(
        toggleGroupVariants({ layout: resolvedLayout, variant: variant ?? "default" }),
        !connected && surface === "page" && "bg-outline-surface",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{
          variant,
          size,
          layout: resolvedLayout,
          surface: connected ? surface : "default",
        }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  surface,
  ...props
}: TogglePrimitive.Props<string> & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)
  const resolvedVariant = context.variant ?? variant
  const resolvedSize = context.size ?? size
  const resolvedSurface = context.surface ?? surface ?? "default"
  const connected = context.layout === "connected"

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      data-surface={resolvedSurface}
      className={cn(
        toggleVariants({
          variant: resolvedVariant,
          size: resolvedSize,
          surface: resolvedSurface,
        }),
        // Inside the group's clip: no corners of its own, an inset focus ring,
        // and for an outline item only its left border, pulled a pixel under
        // the item before it — so it is the divider between two items and
        // disappears under the group's frame on the first.
        connected &&
          "rounded-none focus-visible:ring-2 focus-visible:ring-inset data-[variant=outline]:-ml-px data-[variant=outline]:border-y-0 data-[variant=outline]:border-r-0",
        className
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants }
