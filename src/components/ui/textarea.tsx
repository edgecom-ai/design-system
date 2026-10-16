import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// `surface` names what the field sits on — see `inputVariants`. `page` gives
// it the outline Button's resting face for the shell's `muted` content area.
const textareaVariants = cva(
  "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-body-lg transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-body-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      surface: {
        default: "",
        page: "bg-outline-surface dark:bg-outline-surface",
      },
    },
    defaultVariants: {
      surface: "default",
    },
  }
)

function Textarea({
  className,
  surface = "default",
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      data-surface={surface}
      className={cn(textareaVariants({ surface }), className)}
      {...props}
    />
  )
}

export { Textarea, textareaVariants }
