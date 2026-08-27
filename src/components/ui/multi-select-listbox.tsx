"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

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
 * chip list, so its height never changes. Selection may reach zero; the
 * consumer decides whether that's an error state.
 */
function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  itemNoun = "items",
  showFooterActions = true,
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
  align?: "start" | "end"
  className?: string
} & Omit<
  React.ComponentProps<typeof SelectPrimitive.Trigger>,
  "value" | "onChange" | "className"
>) {
  const total = options.length
  const count = value.length
  const allIds = React.useMemo(() => options.map((o) => o.id), [options])

  const label =
    count === 0
      ? placeholder
      : count === total
        ? `All ${total} ${itemNoun}`
        : `${count} of ${total} ${itemNoun}`

  return (
    <SelectPrimitive.Root
      multiple
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
            <SelectPrimitive.List className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.id}
                  value={opt.id}
                  data-slot="multi-select-item"
                  className="group/ms-item relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-md px-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-selected:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <span className="grid size-4 shrink-0 place-content-center rounded-[4px] border border-input text-primary-foreground group-data-selected/ms-item:border-primary group-data-selected/ms-item:bg-primary">
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
