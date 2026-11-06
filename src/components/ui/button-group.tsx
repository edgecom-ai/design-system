import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

// The join reads the position of the slot, not the control: a Design canvas
// wraps every mounted control in an element of its own, so a `~` or
// `:last-child` written against the control joined nothing there. Each rule
// is written twice — for the control as a direct child, and for the control
// inside a wrapper that is the child — so the group renders the same in both.
// The last slot is the last child that is not Base UI Select's hidden native
// `<select>`, which it renders after the trigger. The classes are spelled out
// in full because Tailwind compiles only the tokens it finds in the source.
const buttonGroupVariants = cva(
  "flex w-fit items-stretch has-[[data-slot=button-group]]:gap-2 [&_[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&_[data-slot=input]]:flex-1 [&_[data-slot=input-group]]:flex-1 [&_[data-slot=button]]:focus-visible:relative [&_[data-slot=select-trigger]]:focus-visible:relative [&_[data-slot=input]]:focus-visible:relative [&_[data-slot=input-group]]:focus-visible:relative [&_[data-slot=button-group-text]]:focus-visible:relative [&_[data-slot=button]]:focus-visible:z-10 [&_[data-slot=select-trigger]]:focus-visible:z-10 [&_[data-slot=input]]:focus-visible:z-10 [&_[data-slot=input-group]]:focus-visible:z-10 [&_[data-slot=button-group-text]]:focus-visible:z-10",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>[data-slot=button]:not(:nth-last-child(1_of_:not([aria-hidden=true])))]:rounded-r-none [&>*:not(:nth-last-child(1_of_:not([aria-hidden=true])))>[data-slot=button]]:rounded-r-none [&>[data-slot=select-trigger]:not(:nth-last-child(1_of_:not([aria-hidden=true])))]:rounded-r-none [&>*:not(:nth-last-child(1_of_:not([aria-hidden=true])))>[data-slot=select-trigger]]:rounded-r-none [&>[data-slot=input]:not(:nth-last-child(1_of_:not([aria-hidden=true])))]:rounded-r-none [&>*:not(:nth-last-child(1_of_:not([aria-hidden=true])))>[data-slot=input]]:rounded-r-none [&>[data-slot=input-group]:not(:nth-last-child(1_of_:not([aria-hidden=true])))]:rounded-r-none [&>*:not(:nth-last-child(1_of_:not([aria-hidden=true])))>[data-slot=input-group]]:rounded-r-none [&>[data-slot=button-group-text]:not(:nth-last-child(1_of_:not([aria-hidden=true])))]:rounded-r-none [&>*:not(:nth-last-child(1_of_:not([aria-hidden=true])))>[data-slot=button-group-text]]:rounded-r-none [&>[data-slot=button]:not(:first-child)]:rounded-l-none [&>*:not(:first-child)>[data-slot=button]]:rounded-l-none [&>[data-slot=select-trigger]:not(:first-child)]:rounded-l-none [&>*:not(:first-child)>[data-slot=select-trigger]]:rounded-l-none [&>[data-slot=input]:not(:first-child)]:rounded-l-none [&>*:not(:first-child)>[data-slot=input]]:rounded-l-none [&>[data-slot=input-group]:not(:first-child)]:rounded-l-none [&>*:not(:first-child)>[data-slot=input-group]]:rounded-l-none [&>[data-slot=button-group-text]:not(:first-child)]:rounded-l-none [&>*:not(:first-child)>[data-slot=button-group-text]]:rounded-l-none [&>[data-slot=button]:not(:first-child)]:border-l-0 [&>*:not(:first-child)>[data-slot=button]]:border-l-0 [&>[data-slot=select-trigger]:not(:first-child)]:border-l-0 [&>*:not(:first-child)>[data-slot=select-trigger]]:border-l-0 [&>[data-slot=input]:not(:first-child)]:border-l-0 [&>*:not(:first-child)>[data-slot=input]]:border-l-0 [&>[data-slot=input-group]:not(:first-child)]:border-l-0 [&>*:not(:first-child)>[data-slot=input-group]]:border-l-0 [&>[data-slot=button-group-text]:not(:first-child)]:border-l-0 [&>*:not(:first-child)>[data-slot=button-group-text]]:border-l-0",
        vertical:
          "flex-col [&>[data-slot=button]:not(:nth-last-child(1_of_:not([aria-hidden=true])))]:rounded-b-none [&>*:not(:nth-last-child(1_of_:not([aria-hidden=true])))>[data-slot=button]]:rounded-b-none [&>[data-slot=select-trigger]:not(:nth-last-child(1_of_:not([aria-hidden=true])))]:rounded-b-none [&>*:not(:nth-last-child(1_of_:not([aria-hidden=true])))>[data-slot=select-trigger]]:rounded-b-none [&>[data-slot=input]:not(:nth-last-child(1_of_:not([aria-hidden=true])))]:rounded-b-none [&>*:not(:nth-last-child(1_of_:not([aria-hidden=true])))>[data-slot=input]]:rounded-b-none [&>[data-slot=input-group]:not(:nth-last-child(1_of_:not([aria-hidden=true])))]:rounded-b-none [&>*:not(:nth-last-child(1_of_:not([aria-hidden=true])))>[data-slot=input-group]]:rounded-b-none [&>[data-slot=button-group-text]:not(:nth-last-child(1_of_:not([aria-hidden=true])))]:rounded-b-none [&>*:not(:nth-last-child(1_of_:not([aria-hidden=true])))>[data-slot=button-group-text]]:rounded-b-none [&>[data-slot=button]:not(:first-child)]:rounded-t-none [&>*:not(:first-child)>[data-slot=button]]:rounded-t-none [&>[data-slot=select-trigger]:not(:first-child)]:rounded-t-none [&>*:not(:first-child)>[data-slot=select-trigger]]:rounded-t-none [&>[data-slot=input]:not(:first-child)]:rounded-t-none [&>*:not(:first-child)>[data-slot=input]]:rounded-t-none [&>[data-slot=input-group]:not(:first-child)]:rounded-t-none [&>*:not(:first-child)>[data-slot=input-group]]:rounded-t-none [&>[data-slot=button-group-text]:not(:first-child)]:rounded-t-none [&>*:not(:first-child)>[data-slot=button-group-text]]:rounded-t-none [&>[data-slot=button]:not(:first-child)]:border-t-0 [&>*:not(:first-child)>[data-slot=button]]:border-t-0 [&>[data-slot=select-trigger]:not(:first-child)]:border-t-0 [&>*:not(:first-child)>[data-slot=select-trigger]]:border-t-0 [&>[data-slot=input]:not(:first-child)]:border-t-0 [&>*:not(:first-child)>[data-slot=input]]:border-t-0 [&>[data-slot=input-group]:not(:first-child)]:border-t-0 [&>*:not(:first-child)>[data-slot=input-group]]:border-t-0 [&>[data-slot=button-group-text]:not(:first-child)]:border-t-0 [&>*:not(:first-child)>[data-slot=button-group-text]]:border-t-0",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex items-center gap-2 rounded-lg border bg-muted px-2.5 text-body-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "button-group-text",
    },
  })
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "relative self-stretch bg-input data-[orientation=horizontal]:mx-px data-[orientation=horizontal]:w-auto data-[orientation=vertical]:my-px data-[orientation=vertical]:h-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
