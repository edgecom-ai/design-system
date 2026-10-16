import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// `size` is a variant axis, not a prop, so a design can cite it and a toolbar
// can hold this field level with a `SelectTrigger size="sm"` and a
// `Button size="sm"` — the three share `default` (2rem) and `sm` (1.75rem).
//
// `surface` names what the field sits on. `default` rests transparent, which
// is right inside a card, sheet, dialog or table row. `page` is for a field
// placed straight on the shell's `muted` content area, where a transparent
// field has no face: it takes the outline Button's resting surface, so a
// filter row reads as one surface. It overrides both the light and the `dark:`
// resting class, so `--outline-surface` decides the face in both themes. No
// hover — a text field has none, and neither does this.
const inputVariants = cva(
  "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-body-lg transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-body-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-body-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        default: "h-8 py-1",
        sm: "h-7 rounded-[min(var(--radius-md),10px)] py-0.5",
      },
      surface: {
        default: "",
        page: "bg-outline-surface dark:bg-outline-surface",
      },
    },
    defaultVariants: {
      size: "default",
      surface: "default",
    },
  }
)

function Input({
  className,
  type,
  size = "default",
  surface = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-size={size}
      data-surface={surface}
      className={cn(inputVariants({ size, surface }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }
