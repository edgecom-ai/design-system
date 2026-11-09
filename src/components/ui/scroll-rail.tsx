"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// A horizontal rail of tiles that snaps and pages by whole tiles — a week of
// day tiles, a row of site cards. The rail carries the `scroll-rail` utility
// (the pill scrollbar, `overflow-x: auto`, no edge fade: a rail pages by whole
// tiles, so the tile at its edge is a full one, and a fade would grey it out).
//
// The 2px bleed — `-mx-0.5 -mt-0.5` given back by `p-0.5` — is what keeps each
// tile's ring clear of the scroll box's edge, which would otherwise clip it.
// The 6px foot (`-mb-2 pb-1.5`) is where the bar runs: it hangs into the host
// card's bottom padding so the bar never overlaps the tiles' bottom edge.
function ScrollRail({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="scroll-rail"
      className={cn(
        "scroll-rail -mx-0.5 -mt-0.5 -mb-2 flex list-none snap-x snap-mandatory gap-3 scroll-px-0.5 p-0.5 pb-1.5 motion-safe:scroll-smooth",
        className
      )}
      {...props}
    />
  )
}

// One stop on the rail. It holds a `Card size="sm"` and sets the tile's width;
// the rail snaps to its start edge.
function ScrollRailItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="scroll-rail-item"
      className={cn("shrink-0 snap-start", className)}
      {...props}
    />
  )
}

// Most of a tile counts as on screen: at fractional zoom levels an edge tile
// can sit a sub-pixel short of fully visible, which mustn't raise an arrow.
const EDGE_TILE_VISIBLE_RATIO = 0.95

// Which way the rail still has tiles off screen, read from whether its first
// and last tiles are in view — on a wide enough screen the whole rail is, and
// there is nothing to page to. The paging arrows in the host card's
// `CardAction` show only while this says there is. `itemCount` isn't read; it
// is what re-observes once the tiles land and the edge tiles change.
function useScrollRailEdges(rail: HTMLElement | null, itemCount: number) {
  const [edges, setEdges] = React.useState({ canScrollBack: false, canScrollForward: false })

  React.useEffect(() => {
    const first = rail?.firstElementChild
    const last = rail?.lastElementChild
    if (!rail || !first || !last) return

    const observer = new IntersectionObserver(
      (entries) => {
        setEdges((previous) => {
          const next = { ...previous }
          for (const entry of entries) {
            const hidden = entry.intersectionRatio < EDGE_TILE_VISIBLE_RATIO
            if (entry.target === first) next.canScrollBack = hidden
            if (entry.target === last) next.canScrollForward = hidden
          }
          return next
        })
      },
      { root: rail, threshold: EDGE_TILE_VISIBLE_RATIO }
    )
    observer.observe(first)
    observer.observe(last)
    return () => observer.disconnect()
  }, [rail, itemCount])

  return edges
}

export { ScrollRail, ScrollRailItem, useScrollRailEdges }
