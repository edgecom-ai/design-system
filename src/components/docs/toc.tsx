"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { CheckIcon, CopyIcon, LinkIcon } from "lucide-react"

export type TocItem = { id: string; name: string }

/** "Install primitive" button that copies the shadcn command and reveals it on hover. */
function InstallPrimitive({ command }: { command: string }) {
  const full = `npx shadcn@latest add ${command}`
  const { copied, copy } = useCopyToClipboard()
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <Button
            type="button"
            variant="default"
            size="sm"
            className="w-full justify-between gap-2"
            onClick={() => copy(full)}
          >
            <span>Install primitive</span>
            {copied ? (
              <CheckIcon className="size-3.5" />
            ) : (
              <CopyIcon className="size-3.5" />
            )}
          </Button>
        }
      />
      <HoverCardContent side="bottom" align="start" className="w-auto max-w-xs">
        <code className="font-mono text-xs break-all text-foreground">{full}</code>
      </HoverCardContent>
    </HoverCard>
  )
}

/**
 * Right-hand docs column: a copyable "Install primitive" button plus an
 * "On this page" list of the active component's variants, with scroll-spy.
 * Renders for a single variant too; hidden below xl via the parent layout.
 */
/** Copies the current page URL (its ?c=<section> deep link) to the clipboard. */
function ShareLink() {
  const { copied, copy } = useCopyToClipboard()
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="w-full justify-between gap-2"
      onClick={() => copy(window.location.href)}
    >
      <span>{copied ? "Link copied" : "Share page"}</span>
      {copied ? (
        <CheckIcon className="size-3.5" />
      ) : (
        <LinkIcon className="size-3.5" />
      )}
    </Button>
  )
}

export function Toc({ items, install }: { items: TocItem[]; install?: string }) {
  const firstId = items[0]?.id ?? null
  const [activeId, setActiveId] = useState<string | null>(firstId)
  // Reset the highlight when the section (its first variant) changes, without a
  // setState-in-effect: adjust state during render per the React guidance.
  const [seenFirstId, setSeenFirstId] = useState<string | null>(firstId)
  if (seenFirstId !== firstId) {
    setSeenFirstId(firstId)
    setActiveId(firstId)
  }

  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      // Offset the top for the sticky header; bias so the item near the top wins.
      { root: null, rootMargin: "-96px 0px -65% 0px", threshold: 0 }
    )

    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items])

  if (!install && items.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      {install && <InstallPrimitive command={install} />}
      <ShareLink />
      {items.length > 0 && (
        <nav aria-label="On this page" className="flex flex-col gap-2 text-sm">
          <span className="text-xs font-medium text-muted-foreground">
            On this page
          </span>
          <ul className="flex flex-col gap-1 border-l border-border">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    const el = document.getElementById(item.id)
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" })
                      setActiveId(item.id)
                    }
                  }}
                  className={cn(
                    "-ml-px block border-l border-transparent py-0.5 pl-3 text-xs transition-colors hover:text-foreground",
                    item.id === activeId
                      ? "border-primary font-medium text-primary dark:border-primary-emphasis dark:text-primary-emphasis"
                      : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
