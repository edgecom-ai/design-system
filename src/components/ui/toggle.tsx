import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// `surface` names what the toggle sits on — see `inputVariants`. Only
// `outline` has a resting face to swap: it rests clear like a field, which is
// right inside a card and wrong straight on the shell's `muted` content area,
// so `page` gives it the outline Button's face (`outline-surface`) and hover
// (`outline-hover`). The ghost `default` needs nothing there, exactly as a
// ghost Button needs nothing, so `page` leaves it alone.
const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-body-sm font-medium whitespace-nowrap transition-colors outline-none hover:bg-ghost-hover hover:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[pressed]:bg-accent data-[pressed]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-xs hover:bg-ghost-hover hover:text-foreground",
      },
      size: {
        default: "h-8 min-w-8 px-2",
        sm: "h-7 min-w-7 px-1.5",
        lg: "h-9 min-w-9 px-2.5",
      },
      surface: {
        default: "",
        page: "",
      },
    },
    compoundVariants: [
      {
        variant: "outline",
        surface: "page",
        className: "bg-outline-surface hover:bg-outline-hover",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      surface: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  surface = "default",
  ...props
}: TogglePrimitive.Props<string> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      data-variant={variant}
      data-size={size}
      data-surface={surface}
      className={cn(toggleVariants({ variant, size, surface, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
