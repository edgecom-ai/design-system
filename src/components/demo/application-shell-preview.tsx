"use client"

import * as React from "react"
import { Maximize2, Minimize2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ApplicationShellDemo } from "./application-shell-demo"

/**
 * Docs-only wrapper: frames the application shell in a card and adds an
 * expand-to-full-screen control (Escape to exit) in a slim top toolbar so the
 * full layout is easy to inspect inside the cramped preview area. This
 * affordance is demo scaffolding — the shell a consumer copies is
 * `application-shell-demo.tsx`, which fills its container and has no full-screen
 * button. (The control lives in this toolbar rather than overlaying the shell's
 * top-right corner, which is already occupied by the shell's header controls.)
 */
export function ApplicationShellPreview() {
  const [expanded, setExpanded] = React.useState(false)

  React.useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [expanded])

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden border border-border bg-background",
        expanded ? "fixed inset-0 z-50" : "h-[560px] w-full rounded-xl"
      )}
    >
      <div className="flex justify-end border-b border-border bg-muted/30 px-2 py-1.5">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Exit full screen" : "Expand to full screen"}
        >
          {expanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </Button>
      </div>
      <div className="min-h-0 flex-1">
        <ApplicationShellDemo />
      </div>
    </div>
  )
}
