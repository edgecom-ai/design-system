"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnPinningState,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { EllipsisIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  feeder: string
  peak: number
  consumption: number
  powerFactor: number
  voltage: number
  updated: string
}

const meters: Meter[] = [
  { id: "MTR-2207", site: "Riverside Plant", feeder: "Main incomer A", peak: 412, consumption: 6840, powerFactor: 0.94, voltage: 416, updated: "10:45" },
  { id: "MTR-1180", site: "Cold Storage Facility", feeder: "Compressor hall", peak: 268, consumption: 5120, powerFactor: 0.88, voltage: 409, updated: "10:45" },
  { id: "MTR-3302", site: "Northgate Distribution", feeder: "Dock chargers", peak: 355, consumption: 4960, powerFactor: 0.97, voltage: 414, updated: "10:30" },
  { id: "MTR-0915", site: "Harbour Office", feeder: "Lighting and HVAC", peak: 96, consumption: 1210, powerFactor: 0.91, voltage: 411, updated: "10:45" },
  { id: "MTR-4410", site: "Eastfield Warehouse", feeder: "Conveyor line 2", peak: 141, consumption: 2380, powerFactor: 0.86, voltage: 407, updated: "10:15" },
  { id: "MTR-5021", site: "Bayview Bottling", feeder: "Filling line", peak: 184, consumption: 3020, powerFactor: 0.93, voltage: 413, updated: "10:45" },
]

const number = new Intl.NumberFormat("en-US")

// The first and last cells sit on the card's own content line.
const edge = "first:pl-(--card-spacing) last:pr-(--card-spacing)"

const numeric = new Set(["peak", "consumption", "powerFactor", "voltage"])

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
  },
  {
    accessorKey: "id",
    header: "Meter",
    cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
  },
  { accessorKey: "site", header: "Site" },
  { accessorKey: "feeder", header: "Feeder" },
  { accessorKey: "peak", header: "Peak today (kW)", cell: ({ row }) => number.format(row.original.peak) },
  { accessorKey: "consumption", header: "Energy today (kWh)", cell: ({ row }) => number.format(row.original.consumption) },
  { accessorKey: "powerFactor", header: "Power factor", cell: ({ row }) => row.original.powerFactor.toFixed(2) },
  { accessorKey: "voltage", header: "Voltage (V)", cell: ({ row }) => number.format(row.original.voltage) },
  { accessorKey: "updated", header: "Last reading" },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${row.original.id}`}>
              <EllipsisIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View readings</DropdownMenuItem>
          <DropdownMenuItem>Edit meter</DropdownMenuItem>
          <DropdownMenuItem>Download CSV</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function DataTablePinnedDemo() {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  // TanStack's column model owns which columns are pinned; the primitive owns
  // how they stack, measuring each pinned cell so the next sits where it ends.
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
    left: ["select", "id"],
    right: ["actions"],
  })

  const table = useReactTable({
    data: meters,
    columns,
    getRowId: (row) => row.id,
    state: { rowSelection, columnPinning },
    onRowSelectionChange: setRowSelection,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
  })

  const selected = table.getSelectedRowModel().rows.length

  return (
    <div className="flex w-full flex-col gap-2">
      <Card className="gap-0 py-0">
        <Table surface="card">
          <TableHeader variant="strong">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    pinned={header.column.getIsPinned() || undefined}
                    className={cn(edge, numeric.has(header.column.id) && "text-right")}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    pinned={cell.column.getIsPinned() || undefined}
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
        {selected ? `${selected} of ${meters.length} meters selected` : `${meters.length} meters · meter and actions stay in view`}
      </p>
    </div>
  )
}
