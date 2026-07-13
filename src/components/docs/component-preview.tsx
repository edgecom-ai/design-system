"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { CheckIcon, CopyIcon } from "lucide-react"

type DemoSource = { code: string; html: string }

// Module-level cache so re-opening a Code tab (or revisiting a section) is instant.
const sourceCache = new Map<string, DemoSource>()

function CopyButton({
  text,
  className,
  label = "Copy",
}: {
  text: string
  className?: string
  label?: string
}) {
  const { copied, copy } = useCopyToClipboard()
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      className={cn("size-7 text-muted-foreground hover:text-foreground", className)}
      onClick={() => copy(text)}
    >
      {copied ? (
        <CheckIcon className="size-3.5 stroke-success" />
      ) : (
        <CopyIcon className="size-3.5" />
      )}
    </Button>
  )
}

/** Copyable `pnpm dlx shadcn@latest add <command>` bar. */
/** Public GitHub registry address (see https://ui.shadcn.com/docs/registry/github). */
export const REGISTRY = "edgecom-ai/design-system"

/**
 * Build a `shadcn add` command for the public GitHub registry from a docs
 * install spec. Specs reference items as `@edgecom/<name>` (optionally several,
 * space-separated); each is rewritten to `<owner>/<repo>/<name>` so it installs
 * with zero consumer configuration.
 */
export function installCommand(spec: string) {
  return `pnpm dlx shadcn@latest add ${spec.replace(/@edgecom\//g, `${REGISTRY}/`)}`
}

export function InstallCommand({ command }: { command: string }) {
  const full = installCommand(command)
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/50 py-1.5 pr-1.5 pl-3">
      <code className="truncate font-mono text-xs text-foreground">{full}</code>
      <CopyButton text={full} label="Copy install command" />
    </div>
  )
}

function CodePanel({ source }: { source: string }) {
  // Read the cache during render so a cached source shows instantly with no
  // effect-driven setState (and no loading flash when switching variants).
  const cached = sourceCache.get(source) ?? null
  const [fetched, setFetched] = useState<DemoSource | null>(null)
  const [error, setError] = useState(false)
  const data = cached ?? fetched

  useEffect(() => {
    if (sourceCache.has(source)) return
    let active = true
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/docs-source/${source}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<DemoSource>
      })
      .then((json) => {
        sourceCache.set(source, json)
        if (active) setFetched(json)
      })
      .catch(() => active && setError(true))
    return () => {
      active = false
    }
  }, [source])

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
        Could not load source for <code className="font-mono">{source}</code>.
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
        Loading source…
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      <CopyButton
        text={data.code}
        label="Copy code"
        className="absolute top-2 right-4 z-10 bg-background/70 text-primary backdrop-blur hover:text-primary/80 dark:text-primary-emphasis dark:hover:text-primary-emphasis/80"
      />
      <div
        className="max-h-[32rem] overflow-auto text-xs [&_pre]:m-0 [&_pre]:bg-transparent! [&_pre]:p-4 [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    </div>
  )
}

export type ComponentPreviewProps = {
  id: string
  name: string
  description?: string
  preview: React.ReactNode
  /** Source key into /docs-source/<source>.json. Omit for inline previews with no backing file. */
  source?: string
  install?: string
}

function PreviewArea({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-24 flex-wrap items-center gap-3 rounded-lg border border-border bg-background p-6">
      {children}
    </div>
  )
}

export function ComponentPreview({
  id,
  name,
  description,
  preview,
  source,
  install,
}: ComponentPreviewProps) {
  const [tab, setTab] = useState("preview")
  const [codeOpened, setCodeOpened] = useState(false)

  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          {name}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      {install && <InstallCommand command={install} />}

      {source ? (
        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value as string)
            if (value === "code") setCodeOpened(true)
          }}
          className="gap-3"
        >
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <PreviewArea>{preview}</PreviewArea>
          </TabsContent>
          <TabsContent value="code">
            {codeOpened && <CodePanel source={source} />}
          </TabsContent>
        </Tabs>
      ) : (
        <PreviewArea>{preview}</PreviewArea>
      )}
    </section>
  )
}
