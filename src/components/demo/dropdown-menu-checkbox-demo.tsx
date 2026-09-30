"use client"

import * as React from "react"
import { Columns3Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// The site column names the row, so it stays on; the rest are the reader's choice.
const columns = [
  { id: "site", label: "Site", locked: true },
  { id: "meter", label: "Meter ID" },
  { id: "commodity", label: "Commodity" },
  { id: "reading", label: "Last reading" },
  { id: "peak", label: "Peak demand (kW)" },
  { id: "cost", label: "Cost to date" },
]

const defaults = ["site", "meter", "reading", "peak"]

export function DropdownMenuCheckboxDemo() {
  const [visible, setVisible] = React.useState<string[]>(defaults)

  function toggle(id: string, checked: boolean) {
    setVisible((current) => (checked ? [...current, id] : current.filter((item) => item !== id)))
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm">
              <Columns3Icon />
              Columns
            </Button>
          }
        />
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Show in the meter table</DropdownMenuLabel>
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={visible.includes(column.id)}
                disabled={column.locked}
                onCheckedChange={(checked) => toggle(column.id, checked)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setVisible(defaults)}>Reset to default</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-caption text-muted-foreground tabular-nums">
        {visible.length} of {columns.length} columns shown
      </p>
    </div>
  )
}
