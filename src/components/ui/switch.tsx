import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

type SwitchSize = "default" | "sm"

const switchRootSizes: Record<SwitchSize, string> = {
  default: "h-5 w-9",
  sm: "h-4 w-7",
}

const switchThumbSizes: Record<SwitchSize, string> = {
  default: "size-4 data-[unchecked]:translate-x-0.5 data-[checked]:translate-x-4",
  sm: "size-3 data-[unchecked]:translate-x-0.5 data-[checked]:translate-x-3.5",
}

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & { size?: SwitchSize }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-colors outline-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "data-[unchecked]:bg-input data-[checked]:bg-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        switchRootSizes[size],
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-primary-foreground shadow-sm ring-0 transition-transform",
          switchThumbSizes[size]
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
