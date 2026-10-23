"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
  spacing?: number
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  size: "default",
  variant: "default",
  surface: "default",
  spacing: 1,
})

// `surface` names what the group sits on — see `toggleVariants`. Which
// element wears it depends on `spacing`: a connected group (`0`) has no frame,
// so its items are the face and take the surface; a spaced group's frame is
// the face, so the frame takes it and the items inside stay `default` — they
// sit on the frame, not on the page.
function ToggleGroup({
  className,
  variant,
  size,
  surface = "default",
  spacing = 1,
  children,
  ...props
}: ToggleGroupPrimitive.Props<string> &
  VariantProps<typeof toggleVariants> & { spacing?: number }) {
  const connected = spacing === 0

  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-surface={surface}
      className={cn(
        "flex w-fit items-center",
        connected
          ? "rounded-lg"
          : "gap-1 rounded-lg border border-input bg-background p-1 shadow-xs",
        !connected && surface === "page" && "bg-outline-surface",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{
          variant,
          size,
          spacing,
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
  const connected = context.spacing === 0

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
        connected &&
          "rounded-none shadow-none first:rounded-l-lg last:rounded-r-lg focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem }
