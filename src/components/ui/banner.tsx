import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const bannerVariants = cva("w-full", {
  variants: {
    variant: {
      default: "bg-muted text-foreground",
      primary: "bg-primary text-primary-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Banner({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof bannerVariants>) {
  return (
    <div
      data-slot="banner"
      data-variant={variant ?? "default"}
      className={cn(bannerVariants({ variant }), className)}
      {...props}
    />
  )
}

function BannerContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
      <div
        data-slot="banner-content"
        className={cn(
          "flex items-center justify-between gap-x-6 p-4",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Banner, BannerContent }
