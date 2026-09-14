import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// The motion lives on a `foreground`-tinted pseudo-element, not on the block's
// own opacity: `muted` is within a hair of its host in both themes, so fading
// it toward the host is invisible, while a foreground tint always moves the
// lightness *away* from the host (darker in light, lighter in dark). The
// pseudo-element inherits the radius so `rounded-full` and friends still work.
const skeletonVariants = cva("relative rounded-md bg-muted", {
  variants: {
    animation: {
      pulse:
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-foreground/12 after:opacity-0 after:animate-skeleton-pulse motion-reduce:after:animate-none",
      shimmer:
        "overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:bg-linear-to-r before:from-transparent before:via-foreground/12 before:to-transparent before:animate-skeleton-shimmer motion-reduce:before:hidden",
      none: "",
    },
  },
  defaultVariants: {
    animation: "pulse",
  },
})

function Skeleton({
  className,
  animation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof skeletonVariants>) {
  return (
    <div
      data-slot="skeleton"
      data-animation={animation ?? "pulse"}
      className={cn(skeletonVariants({ animation }), className)}
      {...props}
    />
  )
}

export { Skeleton, skeletonVariants }
