"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  changelog,
  changelogGroups,
  commitUrl,
  type ChangelogEntry,
} from "@/docs/generated/changelog"

/** How many affected items to show before collapsing the rest into a count. */
const MAX_ITEMS = 6

function ItemChips({
  items,
  itemHref,
}: {
  items: string[]
  itemHref?: (item: string) => string | undefined
}) {
  const shown = items.slice(0, MAX_ITEMS)
  const rest = items.length - shown.length
  return (
    <>
      {shown.map((item) => {
        const href = itemHref?.(item)
        return href ? (
          <Badge key={item} variant="outline" render={<Link href={href} />}>
            {item}
          </Badge>
        ) : (
          <Badge key={item} variant="outline">
            {item}
          </Badge>
        )
      })}
      {rest > 0 && (
        <span className="text-caption text-muted-foreground">
          +{rest} more
        </span>
      )}
    </>
  )
}

function Entry({
  entry,
  itemHref,
}: {
  entry: ChangelogEntry
  itemHref?: (item: string) => string | undefined
}) {
  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {entry.breaking && <Badge variant="destructive">Breaking</Badge>}
        <p className="text-body text-foreground">{entry.summary}</p>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <ItemChips items={entry.items} itemHref={itemHref} />
        {entry.items.length > 0 && (
          <span aria-hidden className="text-caption text-muted-foreground">
            ·
          </span>
        )}
        <a
          className="font-mono text-caption text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          href={commitUrl(entry.sha)}
          target="_blank"
          rel="noreferrer"
        >
          {entry.sha}
        </a>
      </div>
    </li>
  )
}

/**
 * The Changelog page — every release derived from git history by
 * scripts/gen-changelog.mjs. `itemHref` resolves a touched registry item to its
 * doc page; it is injected (rather than imported from sections.tsx) so this
 * module stays out of the sections import cycle.
 */
export function Changelog({
  itemHref,
}: {
  itemHref?: (item: string) => string | undefined
}) {
  if (changelog.length === 0) {
    return (
      <p className="text-body text-muted-foreground">
        No changes recorded yet.
      </p>
    )
  }

  return (
    <div className="flex max-w-3xl flex-col gap-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-heading">Changelog</h1>
        <p className="text-body text-muted-foreground">
          Every change to the design system — new components, token tuning, and
          fixes — grouped by release. The list is generated from the commits on{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-caption text-foreground">
            main
          </code>{" "}
          on every build, so it never drifts from what the registry actually
          ships. Each entry links to its commit and to the doc page of every
          item it touched. The same list is published as{" "}
          <a
            className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
            href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/changelog.md`}
            target="_blank"
            rel="noreferrer"
          >
            changelog.md
          </a>{" "}
          for agents.
        </p>
      </div>

      {changelog.map((release) => (
        <section
          key={release.id}
          id={release.id}
          className="flex scroll-mt-24 flex-col gap-5"
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-2">
            <h2 className="text-title">{release.title}</h2>
            {release.version && (
              <span className="text-caption text-muted-foreground">
                {release.date}
              </span>
            )}
            <span className="text-caption text-muted-foreground">
              {release.entries.length}{" "}
              {release.entries.length === 1 ? "change" : "changes"}
            </span>
          </div>

          {release.summary && (
            <p className="text-body text-muted-foreground">{release.summary}</p>
          )}

          {changelogGroups.map((group) => {
            const entries = release.entries.filter((e) => e.group === group.id)
            if (entries.length === 0) return null
            return (
              <div key={group.id} className="flex flex-col gap-3">
                <h3
                  className={cn(
                    "text-caption tracking-wide uppercase",
                    group.id === "breaking"
                      ? "text-destructive-emphasis"
                      : "text-muted-foreground"
                  )}
                >
                  {group.label}
                </h3>
                <ul className="flex flex-col gap-4 border-l border-border pl-4">
                  {entries.map((entry) => (
                    <Entry
                      key={entry.sha}
                      entry={entry}
                      itemHref={itemHref}
                    />
                  ))}
                </ul>
              </div>
            )
          })}
        </section>
      ))}
    </div>
  )
}
