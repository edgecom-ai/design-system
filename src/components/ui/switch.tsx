import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// `size` is a variant axis (it used to be a plain prop), so a design can cite
// `size: "sm"` and the contract lists it.
const switchVariants = cva(
  "peer inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[unchecked]:bg-input data-[checked]:bg-primary disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-5 w-9",
        sm: "h-4 w-7",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const switchThumbSizes = {
  default: "size-4 data-[unchecked]:translate-x-0.5 data-[checked]:translate-x-4",
  sm: "size-3 data-[unchecked]:translate-x-0.5 data-[checked]:translate-x-3.5",
} as const

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & VariantProps<typeof switchVariants>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(switchVariants({ size }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-primary-foreground shadow-sm ring-0 transition-transform",
          switchThumbSizes[size ?? "default"]
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch, switchVariants }
