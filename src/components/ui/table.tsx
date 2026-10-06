"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// A pinned cell has to be opaque — otherwise the columns scrolling under it
// show through — so it paints the surface the table sits on, then the row's
// own tint over it. The surface is a variable the host names here; the tint
// (`--table-tint`) is set by the header fill, the row's hover and selected
// states, and the footer, so a pinned cell always matches its neighbours.
const tableContainerVariants = cva(
  "group/table-container relative w-full overflow-x-auto",
  {
    variants: {
      surface: {
        card: "[--table-surface:var(--color-card)]",
        background: "[--table-surface:var(--color-background)]",
        popover: "[--table-surface:var(--color-popover)]",
      },
    },
    defaultVariants: {
      surface: "card",
    },
  }
)

// `data-overflow-left` / `data-overflow-right` say that columns are hidden
// off that edge of the container — a pinned column shows its divider only then.
function trackOverflow(el: HTMLDivElement) {
  const left = Math.abs(el.scrollLeft)
  el.toggleAttribute("data-overflow-left", left > 1)
  el.toggleAttribute(
    "data-overflow-right",
    left + el.clientWidth < el.scrollWidth - 1
  )
}

// Several pinned columns stack: each one sits where the previous ends. The
// widths are measured, not declared — auto table layout sizes a column from
// its content, so a size the column model declares is not where it renders.
function layoutPins(el: HTMLDivElement) {
  for (const row of el.querySelectorAll("tr")) {
    const cells = Array.from(row.children) as HTMLElement[]
    let offset = 0
    for (const cell of cells) {
      if (cell.dataset.pinned !== "left") continue
      cell.style.setProperty("--pin-offset", `${offset}px`)
      offset += cell.getBoundingClientRect().width
    }
    offset = 0
    for (const cell of cells.reverse()) {
      if (cell.dataset.pinned !== "right") continue
      cell.style.setProperty("--pin-offset", `${offset}px`)
      offset += cell.getBoundingClientRect().width
    }
  }
}

function Table({
  className,
  density = "default",
  surface,
  ...props
}: React.ComponentProps<"table"> &
  VariantProps<typeof tableContainerVariants> & {
    density?: "default" | "compact"
  }) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Every render may have changed a column's content, and with it its width,
  // so the pins are laid out again after each one.
  React.useLayoutEffect(() => {
    if (containerRef.current) layoutPins(containerRef.current)
  })

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => trackOverflow(el)
    const onResize = () => {
      layoutPins(el)
      trackOverflow(el)
    }
    onResize()
    el.addEventListener("scroll", onScroll, { passive: true })
    const observer = new ResizeObserver(onResize)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => {
      el.removeEventListener("scroll", onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      data-slot="table-container"
      data-surface={surface ?? "card"}
      className={tableContainerVariants({ surface })}
    >
      <table
        data-slot="table"
        data-density={density}
        className={cn("group/table w-full caption-bottom text-body-sm", className)}
        {...props}
      />
    </div>
  )
}

// A filled header reads as a band above the body. `strong` is the default fill:
// a light, relative band that steps from whatever the table sits on — a `card`,
// a `muted` page, a panel, an overlay. `muted` is an absolute fill for a table
// on `background` only; on a `card` it repeats the page surface. A filled
// header drops the row hover, which would only wash the band out.
const tableHeaderVariants = cva("[&_tr]:border-b", {
  variants: {
    variant: {
      default: "",
      muted:
        "bg-muted [&_tr]:hover:bg-transparent [&_th]:[--table-tint:var(--color-muted)]",
      strong:
        "bg-table-header [&_tr]:hover:bg-transparent [&_th]:[--table-tint:var(--color-table-header)]",
    },
    // A sticky header stays above the rows scrolling under it, so its cells
    // paint the host surface first — the band fills are alpha, and a background
    // on the row group itself does not travel with the sticky position. It sits
    // above the pinned body cells (`z-10`), still inside the Page layer. The
    // bottom rule is drawn on each cell too: in the collapsed border model a
    // row border belongs to the grid and would scroll away.
    sticky: {
      true: "sticky top-0 z-20 [&_tr]:border-b-0 [&_th]:bg-(--table-surface) [&_th]:bg-[image:linear-gradient(var(--table-tint,transparent),var(--table-tint,transparent))] [&_th]:shadow-[inset_0_-1px_0_0_var(--color-border)]",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    sticky: false,
  },
})

function TableHeader({
  className,
  variant = "default",
  sticky = false,
  ...props
}: React.ComponentProps<"thead"> & VariantProps<typeof tableHeaderVariants>) {
  return (
    <thead
      data-slot="table-header"
      data-variant={variant}
      data-sticky={sticky || undefined}
      className={cn(tableHeaderVariants({ variant, sticky }), className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0 [&_td]:[--table-tint:color-mix(in_oklab,var(--color-muted)_50%,transparent)]",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        "hover:[--table-tint:color-mix(in_oklab,var(--color-muted)_50%,transparent)] has-aria-expanded:[--table-tint:color-mix(in_oklab,var(--color-muted)_50%,transparent)] data-[state=selected]:[--table-tint:var(--color-muted)]",
        className
      )}
      {...props}
    />
  )
}

// A pinned cell sticks to the container's edge and paints the host surface
// under the row tint, so it covers the columns scrolling beneath it and still
// reads as part of its row. The tint is an `::after` layer behind the content
// rather than a gradient on the cell: a background-color fades with the same
// `transition-colors` as the row, where a background-image would snap. The
// `::before` is the divider, a hairline drawn only while columns are hidden
// past that edge. Several pinned columns stack by `--pin-offset`, which the
// container measures and sets on each cell.
const tableCellVariants = cva("", {
  variants: {
    pinned: {
      left: "sticky left-(--pin-offset,0px) z-10 bg-(--table-surface) after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:bg-(--table-tint,transparent) after:transition-colors before:pointer-events-none before:absolute before:inset-y-0 before:right-0 before:w-px before:bg-border before:opacity-0 before:transition-opacity group-data-overflow-left/table-container:before:opacity-100",
      right:
        "sticky right-(--pin-offset,0px) z-10 bg-(--table-surface) after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:bg-(--table-tint,transparent) after:transition-colors before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-border before:opacity-0 before:transition-opacity group-data-overflow-right/table-container:before:opacity-100",
    },
  },
})

function TableHead({
  className,
  pinned,
  ...props
}: React.ComponentProps<"th"> & VariantProps<typeof tableCellVariants>) {
  return (
    <th
      data-slot="table-head"
      data-pinned={pinned ?? undefined}
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground group-data-[density=compact]/table:h-8 [&:first-child:has([role=checkbox])]:pr-0",
        tableCellVariants({ pinned }),
        className
      )}
      {...props}
    />
  )
}

function TableCell({
  className,
  pinned,
  ...props
}: React.ComponentProps<"td"> & VariantProps<typeof tableCellVariants>) {
  return (
    <td
      data-slot="table-cell"
      data-pinned={pinned ?? undefined}
      className={cn(
        "p-2 align-middle whitespace-nowrap group-data-[density=compact]/table:py-1 [&:first-child:has([role=checkbox])]:pr-0",
        tableCellVariants({ pinned }),
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-body-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableContainerVariants,
  tableHeaderVariants,
  tableCellVariants,
}
