"use client"

import * as React from "react"
import { DownloadIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Meter = {
  id: string
  site: string
  commodity: "Electricity" | "Water" | "Gas"
  updated: string
}

const meters: Meter[] = [
  { id: "MTR-2207", site: "Plant 3, Riverside", commodity: "Electricity", updated: "10:45" },
  { id: "MTR-1180", site: "Cold Storage Facility", commodity: "Electricity", updated: "10:45" },
  { id: "WTR-0412", site: "Northgate Distribution", commodity: "Water", updated: "10:30" },
  { id: "GAS-0915", site: "Harbour Office", commodity: "Gas", updated: "10:45" },
  { id: "WTR-4410", site: "Eastfield Warehouse", commodity: "Water", updated: "10:15" },
  { id: "MTR-5021", site: "Bayview Bottling", commodity: "Electricity", updated: "10:45" },
]

const commodities = [
  { label: "All commodities", value: "all" },
  { label: "Electricity", value: "Electricity" },
  { label: "Water", value: "Water" },
  { label: "Gas", value: "Gas" },
]

// The first and last cells sit on the card's own content line.
const edge = "first:pl-(--card-spacing) last:pr-(--card-spacing)"

// A list page's filter row sits straight on the shell's `muted` content area,
// above the card that holds the table — so every field and trigger in it takes
// `surface="page"` and shares the outline button's face. The table's own
// controls, inside the card, would take nothing.
export function DataTablePageToolbarDemo() {
  const [query, setQuery] = React.useState("")
  const [commodity, setCommodity] = React.useState("all")

  const needle = query.trim().toLowerCase()
  const rows = meters.filter(
    (m) =>
      (commodity === "all" || m.commodity === commodity) &&
      (!needle || `${m.id} ${m.site}`.toLowerCase().includes(needle))
  )

  function reset() {
    setQuery("")
    setCommodity("all")
  }

  return (
    <TooltipProvider>
      <div className="flex w-full flex-col gap-4 rounded-xl bg-muted p-4">
        <div className="flex flex-wrap items-center gap-2">
          <InputGroup surface="page" className="w-full sm:w-64">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search meters or sites"
              aria-label="Search meters or sites"
            />
          </InputGroup>
          <Select
            items={commodities}
            value={commodity}
            onValueChange={(next) => next && setCommodity(next)}
          >
            <SelectTrigger surface="page" aria-label="Commodity" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {commodities.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Export CSV"
                  className="ml-auto"
                />
              }
            >
              <DownloadIcon />
            </TooltipTrigger>
            <TooltipContent>Export CSV</TooltipContent>
          </Tooltip>
        </div>

        <Card className="gap-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={edge}>Meter</TableHead>
                <TableHead className={edge}>Site</TableHead>
                <TableHead className={edge}>Commodity</TableHead>
                <TableHead className={`${edge} text-right`}>Last reading</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="p-0">
                    <Empty className="rounded-none border-0 md:p-10">
                      <EmptyHeader>
                        <EmptyTitle>No meters match these filters</EmptyTitle>
                        <EmptyDescription>
                          Try another search, or show every commodity.
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button variant="outline" onClick={reset}>
                          Reset filters
                        </Button>
                      </EmptyContent>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className={`${edge} font-medium`}>{m.id}</TableCell>
                    <TableCell className={edge}>{m.site}</TableCell>
                    <TableCell className={edge}>{m.commodity}</TableCell>
                    <TableCell className={`${edge} text-right tabular-nums`}>
                      {m.updated}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </TooltipProvider>
  )
}
