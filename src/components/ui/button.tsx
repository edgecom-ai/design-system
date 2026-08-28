import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-body-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-outline-surface hover:bg-outline-hover hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        // Quiet variants. Their surfaces are single unmodified `bg-*`/`hover:bg-*`
        // classes reading theme-aware tokens, so a consumer re-tinting one wins
        // in both themes: a `dark:`-modified class shares no modifier set with
        // their override, so tailwind-merge kept both and the `dark:` one won in
        // dark on source order — silently, and in one theme only. Source order
        // is also why the resting surface can't stay `dark:bg-*` while the hover
        // is a plain `hover:bg-*`: they weigh the same, the `dark:` one is
        // emitted later, and the control would stop reacting to hover in dark.
        ghost:
          "hover:bg-ghost-hover hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        // The quiet destructive: invisible until hovered, red throughout. For
        // row actions (a trash icon button in a table row), where a solid
        // `destructive` fill or a resting `destructive-subtle` tint would paint
        // every row red. The hover label is -subtle-foreground, not -emphasis:
        // the two match in light, and dark parts them for contrast against the
        // dark tint.
        "ghost-destructive":
          "text-destructive-emphasis hover:bg-destructive-subtle hover:text-destructive-subtle-foreground aria-expanded:bg-destructive-subtle aria-expanded:text-destructive-subtle-foreground focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        // Solid semantic fills — filled background + contrasting label.
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        success:
          "bg-success text-success-foreground hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40",
        warning:
          "bg-warning text-warning-foreground hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",
        info: "bg-info text-info-foreground hover:bg-info/90 focus-visible:ring-info/20 dark:focus-visible:ring-info/40",
        // Subtle semantic tints — soft tinted background + colored label.
        "destructive-subtle":
          "bg-destructive-subtle text-destructive-subtle-foreground hover:bg-[color-mix(in_oklch,var(--destructive-subtle),var(--destructive)_12%)] focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        "success-subtle":
          "bg-success-subtle text-success-subtle-foreground hover:bg-[color-mix(in_oklch,var(--success-subtle),var(--success)_12%)] focus-visible:ring-success/20 dark:focus-visible:ring-success/40",
        "warning-subtle":
          "bg-warning-subtle text-warning-subtle-foreground hover:bg-[color-mix(in_oklch,var(--warning-subtle),var(--warning)_12%)] focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",
        "info-subtle":
          "bg-info-subtle text-info-subtle-foreground hover:bg-[color-mix(in_oklch,var(--info-subtle),var(--info)_12%)] focus-visible:ring-info/20 dark:focus-visible:ring-info/40",
        link: "text-primary dark:text-primary-emphasis underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-caption in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
