"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react"

type MultiSelectOption = {
  id: string
  label: string
  /** Optional trailing meta text (e.g. a reading). */
  meta?: React.ReactNode
  /** Optional trailing color dot (e.g. a series color); any CSS color. */
  swatch?: string
}

/**
 * A trigger + popover listbox for selecting many items from a flat list — a
 * peer of `select`, built on Base UI's multi-select so it inherits listbox
 * roles, keyboard navigation (arrows / Home / End / Space / Enter), and
 * dismiss-with-focus-return. The trigger shows a count summary rather than a
 * chip list, so its height never changes. An optional search box filters the
 * list. Selection may reach zero; the consumer decides whether that's an error.
 */
function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  itemNoun = "items",
  showFooterActions = true,
  showSearch = true,
  align = "end",
  className,
  ...props
}: {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  itemNoun?: string
  showFooterActions?: boolean
  showSearch?: boolean
  align?: "start" | "end"
  className?: string
} & Omit<
  React.ComponentProps<typeof SelectPrimitive.Trigger>,
  "value" | "onChange" | "className"
>) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const total = options.length
  const count = value.length
  const allIds = React.useMemo(() => options.map((o) => o.id), [options])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options
  }, [options, query])

  const label =
    count === 0
      ? placeholder
      : count === total
        ? `All ${total} ${itemNoun}`
        : `${count} of ${total} ${itemNoun}`

  return (
    <SelectPrimitive.Root
      multiple
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        // Clear the search when the popover closes so it reopens fresh.
        if (!next) setQuery("")
      }}
      value={value}
      onValueChange={(next) => onChange((next as string[]) ?? [])}
    >
      <SelectPrimitive.Trigger
        data-slot="multi-select-trigger"
        data-empty={count === 0}
        className={cn(
          "flex h-8 min-w-48 items-center gap-1.5 rounded-md border border-input bg-background pr-2 pl-2.5 text-left text-sm transition-colors outline-none hover:bg-accent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[empty=true]:text-muted-foreground",
          className
        )}
        {...props}
      >
        <span className="flex-1 truncate">{label}</span>
        <ChevronDownIcon className="size-[15px] shrink-0 text-muted-foreground" />
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          side="bottom"
          sideOffset={4}
          align={align}
          className="isolate z-50"
        >
          <SelectPrimitive.Popup
            data-slot="multi-select-content"
            className="flex max-h-72 min-w-[17rem] origin-(--transform-origin) flex-col rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          >
            {showSearch ? (
              <div
                data-slot="multi-select-search"
                className="mb-1 flex h-8 shrink-0 items-center gap-2 rounded-md border border-input bg-background px-2 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
              >
                <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  // Keep the search box's own keystrokes from reaching Base UI
                  // Select's typeahead; leave list-navigation keys to bubble.
                  onKeyDown={(e) => {
                    if (!["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key)) {
                      e.stopPropagation()
                    }
                  }}
                  placeholder={`Search ${itemNoun}`}
                  aria-label={`Search ${itemNoun}`}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            ) : null}

            <SelectPrimitive.List className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
              {filtered.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.id}
                  value={opt.id}
                  data-slot="multi-select-item"
                  className="group/ms-item relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-md px-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[selected]:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <span className="grid size-4 shrink-0 place-content-center rounded-[4px] border border-input text-primary-foreground group-data-[selected]/ms-item:border-primary group-data-[selected]/ms-item:bg-primary">
                    <SelectPrimitive.ItemIndicator>
                      <CheckIcon className="size-3" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText className="flex-1 truncate">
                    {opt.label}
                  </SelectPrimitive.ItemText>
                  {opt.swatch ? (
                    <span
                      aria-hidden
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: opt.swatch }}
                    />
                  ) : null}
                  {opt.meta ? (
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {opt.meta}
                    </span>
                  ) : null}
                </SelectPrimitive.Item>
              ))}
              {filtered.length === 0 ? (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                  No {itemNoun} found.
                </div>
              ) : null}
            </SelectPrimitive.List>

            {showFooterActions ? (
              <div data-slot="multi-select-footer">
                <div className="-mx-1 my-1 h-px bg-border" />
                <div className="flex gap-1 px-0.5 pb-0.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-[1.875rem] flex-1"
                    onClick={() => onChange(allIds)}
                  >
                    Select all
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-[1.875rem] flex-1"
                    onClick={() => onChange([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            ) : null}
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

export { MultiSelect }
export type { MultiSelectOption }
