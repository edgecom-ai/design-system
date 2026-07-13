import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive-emphasis focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        success:
          "bg-success/10 text-success-emphasis focus-visible:ring-success/20 dark:focus-visible:ring-success/40 [a]:hover:bg-success/20",
        warning:
          "bg-warning/10 text-warning-emphasis focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 [a]:hover:bg-warning/20",
        info: "bg-info/10 text-info-emphasis focus-visible:ring-info/20 dark:focus-visible:ring-info/40 [a]:hover:bg-info/20",
        electricity:
          "bg-chart-electricity-500/10 text-chart-electricity-700 focus-visible:ring-chart-electricity-500/20 dark:text-chart-electricity-300 [a]:hover:bg-chart-electricity-500/20",
        water:
          "bg-chart-water-500/10 text-chart-water-700 focus-visible:ring-chart-water-500/20 dark:text-chart-water-300 [a]:hover:bg-chart-water-500/20",
        gas: "bg-chart-gas-500/10 text-chart-gas-700 focus-visible:ring-chart-gas-500/20 dark:text-chart-gas-300 [a]:hover:bg-chart-gas-500/20",
        temperature:
          "bg-chart-temperature-500/10 text-chart-temperature-700 focus-visible:ring-chart-temperature-500/20 dark:text-chart-temperature-300 [a]:hover:bg-chart-temperature-500/20",
        emissions:
          "bg-chart-emissions-500/10 text-chart-emissions-700 focus-visible:ring-chart-emissions-500/20 dark:text-chart-emissions-300 [a]:hover:bg-chart-emissions-500/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary dark:text-primary-emphasis underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
