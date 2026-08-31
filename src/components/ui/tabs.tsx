"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  [
    "group/tabs-list relative inline-flex w-fit max-w-full items-center justify-center-safe rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-8 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none",
    // The strip scrolls itself rather than widening the page. `w-fit` alone
    // still resolves to the triggers' min-content width — with `flex-1` on
    // each trigger that is N x the widest label — so `max-w-full` is what
    // actually holds it to the container and hands the excess to the scroll
    // port. Native scrollbars are hidden (a classic 15px bar would eat half
    // of the 32px strip); the faded edge below is the affordance instead.
    "[scrollbar-width:none] group-data-[orientation=horizontal]/tabs:overflow-x-auto group-data-[orientation=vertical]/tabs:overflow-y-auto [&::-webkit-scrollbar]:hidden",
    // Keep whichever tab is scrolled to clear of the fade. Honoured by our own
    // scrolling below and by the browser's focus scrolling during arrow-key
    // navigation.
    "[--tabs-fade:1.5rem] group-data-[orientation=horizontal]/tabs:scroll-px-(--tabs-fade) group-data-[orientation=vertical]/tabs:scroll-py-(--tabs-fade)",
    // TabsList toggles data-fade-start / data-fade-end as it scrolls, so an
    // edge only fades while there is a cut-off tab behind it.
    "group-data-[orientation=horizontal]/tabs:data-fade-start:mask-l-from-[calc(100%-var(--tabs-fade))] group-data-[orientation=horizontal]/tabs:data-fade-end:mask-r-from-[calc(100%-var(--tabs-fade))]",
    "group-data-[orientation=vertical]/tabs:data-fade-start:mask-t-from-[calc(100%-var(--tabs-fade))] group-data-[orientation=vertical]/tabs:data-fade-end:mask-b-from-[calc(100%-var(--tabs-fade))]",
  ],
  {
    variants: {
      variant: {
        default: "bg-muted",
        line:
          "gap-1 bg-transparent group-data-[orientation=horizontal]/tabs:pb-0 group-data-[orientation=vertical]/tabs:pr-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// The list is the scroll port, so everything that has to stay glued to a tab —
// the line variant's bars, TabsIndicator — lives inside it and travels with the
// scroll offset for free. What's left is the part CSS can't do: fading only the
// edges that still hide a tab, and pulling a newly activated tab back into view
// when it was picked off-screen (keyboard arrows, or a controlled value change).
function useTabsListOverflow(list: HTMLDivElement | null) {
  React.useEffect(() => {
    if (!list) {
      return
    }

    const vertical = list.dataset.orientation === "vertical"
    const scrolled = () => (vertical ? list.scrollTop : list.scrollLeft)
    const port = () => (vertical ? list.clientHeight : list.clientWidth)
    const content = () => (vertical ? list.scrollHeight : list.scrollWidth)

    const syncFades = () => {
      // A sub-pixel port/content mismatch is normal at fractional zoom levels;
      // 1px of slack keeps it from fading an edge that has nothing behind it.
      list.toggleAttribute("data-fade-start", scrolled() > 1)
      list.toggleAttribute("data-fade-end", scrolled() < content() - port() - 1)
    }

    const revealActiveTab = (behavior: ScrollBehavior) => {
      const tab = list.querySelector<HTMLElement>(
        "[data-slot=tabs-trigger][data-active]"
      )
      if (!tab) {
        return
      }

      const styles = getComputedStyle(list)
      const pad =
        parseFloat(
          vertical ? styles.scrollPaddingTop : styles.scrollPaddingLeft
        ) || 0
      const start = vertical ? tab.offsetTop : tab.offsetLeft
      const size = vertical ? tab.offsetHeight : tab.offsetWidth

      // Scroll the list itself rather than tab.scrollIntoView(), which would
      // also scroll the page when the strip sits below the fold.
      let next = scrolled()
      if (start - pad < next) {
        next = start - pad
      } else if (start + size + pad > next + port()) {
        next = start + size + pad - port()
      }
      if (next === scrolled()) {
        return
      }
      list.scrollTo({ [vertical ? "top" : "left"]: Math.max(0, next), behavior })
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const observer = new MutationObserver(() => {
      syncFades()
      revealActiveTab(reduceMotion.matches ? "instant" : "smooth")
    })
    const resizeObserver = new ResizeObserver(syncFades)

    syncFades()
    revealActiveTab("instant")
    list.addEventListener("scroll", syncFades, { passive: true })
    observer.observe(list, {
      attributeFilter: ["data-active"],
      attributes: true,
      childList: true,
      subtree: true,
    })
    resizeObserver.observe(list)

    return () => {
      list.removeEventListener("scroll", syncFades)
      observer.disconnect()
      resizeObserver.disconnect()
    }
  }, [list])
}

function TabsList({
  className,
  ref,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  const [list, setList] = React.useState<HTMLDivElement | null>(null)

  useTabsListOverflow(list)

  // State, not a plain ref, so the effect above reruns once the node exists —
  // and useCallback so a re-render doesn't detach and reattach it.
  const setListRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      setList(node)
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref]
  )

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      ref={setListRef}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-body-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        // A line-variant trigger reaches the list's bottom edge so its bar can
        // sit there, which puts an outer halo past the edge the list clips.
        // The same ring drawn inwards stays whole.
        "group-data-[variant=line]/tabs-list:[--tw-ring-inset:inset] group-data-[variant=line]/tabs-list:focus-visible:-outline-offset-1",
        "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
        // The bar sits on the list's own bottom/right edge rather than outside
        // it — the list scrolls its overflow, so anything drawn past that edge
        // is clipped away. The line variant drops the padding on that edge and
        // stretches its trigger to meet it, so the bar stays on the list's edge
        // whatever padding the list is given; the -1px only cancels the
        // trigger's own transparent border.
        // Brand blue, and `primary` is mode-independent — a 2px hairline of it
        // on the dark background is only ~3.9:1, so dark takes the lighter
        // `primary-emphasis` step (the same reason thin brand marks do).
        "after:absolute after:bg-primary after:opacity-0 after:transition-opacity dark:after:bg-primary-emphasis group-data-[variant=line]/tabs-list:h-full group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-1px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-px group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100 group-has-[[data-slot=tabs-indicator]]/tabs-list:after:hidden",
        className
      )}
      {...props}
    />
  )
}

// A single bar that travels to the active tab, as an alternative to the line
// variant's per-trigger cross-fading `after:` bars. Base UI measures the active
// tab and exposes it as --active-tab-{left,top,width,height} on this element,
// so nothing here needs to measure the DOM. Those offsets are content-relative
// (Base UI folds the list's scroll offset back in), and the bar is absolute
// against the list — which is the scroll port — so it tracks the active tab
// while the strip is scrolled. Render it as the last child of TabsList; the
// bars above switch themselves off when it's present.
// Pass renderBeforeHydration to paint it before hydration (injects an inline
// script — leave it off under a strict CSP).
// Same blue as the line variant's bars, incl. the `primary-emphasis` dark step.
function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "pointer-events-none absolute bg-primary transition-[translate,width,height] duration-200 ease-out dark:bg-primary-emphasis",
        "group-data-[orientation=horizontal]/tabs:bottom-0 group-data-[orientation=horizontal]/tabs:left-0 group-data-[orientation=horizontal]/tabs:h-0.5 group-data-[orientation=horizontal]/tabs:w-(--active-tab-width) group-data-[orientation=horizontal]/tabs:translate-x-(--active-tab-left)",
        "group-data-[orientation=vertical]/tabs:top-0 group-data-[orientation=vertical]/tabs:right-0 group-data-[orientation=vertical]/tabs:h-(--active-tab-height) group-data-[orientation=vertical]/tabs:w-0.5 group-data-[orientation=vertical]/tabs:translate-y-(--active-tab-top)",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-body-sm outline-none", className)}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsIndicator,
  TabsContent,
  tabsListVariants,
}
