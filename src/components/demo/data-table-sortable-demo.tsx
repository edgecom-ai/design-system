"use client"

import * as React from "react"
import {
  type Column,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Meter = {
  id: string
  site: string
  peak: number
  consumption: number
  updated: string
}

const meters: Meter[] = [
  { id: "MTR-2207", site: "Plant 3, Riverside", peak: 412, consumption: 6840, updated: "10:45" },
  { id: "MTR-1180", site: "Cold Storage Facility", peak: 268, consumption: 5120, updated: "10:45" },
  { id: "MTR-3302", site: "Northgate Distribution", peak: 355, consumption: 4960, updated: "10:30" },
  { id: "MTR-0915", site: "Harbour Office", peak: 96, consumption: 1210, updated: "10:45" },
  { id: "MTR-4410", site: "Eastfield Warehouse", peak: 141, consumption: 2380, updated: "10:15" },
  { id: "MTR-5021", site: "Bayview Bottling", peak: 184, consumption: 3020, updated: "10:45" },
]

const number = new Intl.NumberFormat("en-US")

// The first and last cells sit on the card's own content line.
const edge = "first:pl-(--card-spacing) last:pr-(--card-spacing)"

// Numeric columns align right, so their sort control reads from the right too.
const numeric = new Set(["peak", "consumption"])

function SortButton({ column, label }: { column: Column<Meter>; label: string }) {
  const sorted = column.getIsSorted()
  const Icon = sorted === "asc" ? ChevronUpIcon : sorted === "desc" ? ChevronDownIcon : ChevronsUpDownIcon
  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1 rounded-sm px-1 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
        numeric.has(column.id) ? "-mr-1 flex-row-reverse" : "-ml-1"
      )}
    >
      {label}
      <Icon className="size-3.5 text-muted-foreground" aria-hidden />
    </button>
  )
}

const columns: ColumnDef<Meter>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
        aria-label="Select all meters"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
        aria-label={`Select ${row.original.id}`}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <SortButton column={column} label="Meter" />,
    cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
  },
  {
    accessorKey: "site",
    header: ({ column }) => <SortButton column={column} label="Site" />,
  },
  {
    accessorKey: "peak",
    header: ({ column }) => <SortButton column={column} label="Peak today (kW)" />,
    cell: ({ row }) => number.format(row.original.peak),
  },
  {
    accessorKey: "consumption",
    header: ({ column }) => <SortButton column={column} label="Energy today (kWh)" />,
    cell: ({ row }) => number.format(row.original.consumption),
  },
  {
    accessorKey: "updated",
    header: "Last reading",
    enableSorting: false,
  },
]

const ariaSort = { asc: "ascending", desc: "descending" } as const

export function DataTableSortableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "peak", desc: true }])
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const table = useReactTable({
    data: meters,
    columns,
    getRowId: (row) => row.id,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const selected = table.getSelectedRowModel().rows.length

  return (
    <div className="flex w-full flex-col gap-2">
      <Card className="gap-0 py-0">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => {
                  const sorted = header.column.getIsSorted()
                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={sorted ? ariaSort[sorted] : undefined}
                      className={cn(edge, numeric.has(header.column.id) && "text-right")}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(edge, numeric.has(cell.column.id) && "text-right tabular-nums")}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <p className="text-caption text-muted-foreground tabular-nums" aria-live="polite">
        {selected ? `${selected} of ${meters.length} meters selected` : `${meters.length} meters · sorted by ${sortLabel(sorting)}`}
      </p>
    </div>
  )
}

function sortLabel(sorting: SortingState) {
  const current = sorting[0]
  if (!current) return "meter list order"
  const names: Record<string, string> = { id: "meter", site: "site", peak: "peak demand", consumption: "energy today" }
  const order = numeric.has(current.id)
    ? current.desc ? "highest first" : "lowest first"
    : current.desc ? "Z to A" : "A to Z"
  return `${names[current.id]}, ${order}`
}
