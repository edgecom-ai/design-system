'use client'

import { useState } from 'react'

import type {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  VisibilityState,
  CellContext
} from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Extend TanStack Table's meta interface
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: string | number) => void
  }
}

// Sample data
const initialData: Person[] = [
  {
    id: '1',
    firstName: 'HQ – Bay Street',
    lastName: 'MTR-1001',
    email: 'priya.sharma@edgecom.ai',
    status: 'active',
    progress: 75
  },
  {
    id: '2',
    firstName: 'Warehouse B',
    lastName: 'MTR-2004',
    email: 'marcus.lee@edgecom.ai',
    status: 'inactive',
    progress: 45
  },
  {
    id: '3',
    firstName: 'Toronto Distribution Center',
    lastName: 'MTR-2001',
    email: 'rose.chan@edgecom.ai',
    status: 'active',
    progress: 90
  },
  {
    id: '4',
    firstName: 'Calgary Plant 2',
    lastName: 'MTR-3001',
    email: 'silas.reed@edgecom.ai',
    status: 'pending',
    progress: 60
  },
  {
    id: '5',
    firstName: 'Chiller Plant',
    lastName: 'MTR-4002',
    email: 'ben.tan@edgecom.ai',
    status: 'active',
    progress: 80
  }
]

export type Person = {
  id: string
  firstName: string
  lastName: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  progress: number
}

// Editable cell component for text inputs
const EditableTextCell = ({ getValue, row: { index }, column: { id }, table }: CellContext<Person, unknown>) => {
  const initialValue = getValue() as string
  const [value, setValue] = useState(initialValue)
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue)

  // Re-sync local edit state when the underlying data changes (e.g. reset) —
  // done during render rather than in an effect to avoid cascading renders.
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue)
    setValue(initialValue)
  }

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value)
  }

  return (
    <Input
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
      className='focus-visible:ring-ring h-8 w-full bg-transparent px-2 focus-visible:ring-1 dark:bg-transparent'
      aria-label='editable-text-input'
    />
  )
}

const statusItems = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' }
]

// Editable cell component for select inputs
const EditableSelectCell = ({ getValue, row: { index }, column: { id }, table }: CellContext<Person, unknown>) => {
  const initialValue = getValue() as string

  const handleValueChange = (newValue: string | null) => {
    if (newValue) {
      table.options.meta?.updateData(index, id, newValue)
    }
  }

  return (
    <Select items={statusItems} value={initialValue} onValueChange={handleValueChange}>
      <SelectTrigger
        className='focus:ring-ring h-8 w-full bg-transparent px-2 focus:ring-1 dark:bg-transparent'
        aria-label={`select-status-${id}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className='p-1'>
        {statusItems.map(item => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Editable cell component for progress (0-100%)
const EditableProgressCell = ({ getValue, row: { index }, column: { id }, table }: CellContext<Person, unknown>) => {
  const initialValue = getValue() as number
  const [value, setValue] = useState(initialValue.toString())
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue)

  // Re-sync local edit state when the underlying data changes (e.g. reset) —
  // done during render rather than in an effect to avoid cascading renders.
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue)
    setValue(initialValue.toString())
  }

  const onBlur = () => {
    const numValue = parseFloat(value)
    const clampedValue = Math.max(0, Math.min(100, isNaN(numValue) ? initialValue : numValue))

    table.options.meta?.updateData(index, id, clampedValue)
  }

  return (
    <div className='flex items-center space-x-2'>
      <Input
        type='number'
        min='0'
        max='100'
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
        className='focus-visible:ring-ring h-8 w-20 bg-transparent px-2 focus-visible:ring-1 dark:bg-transparent'
        aria-label='editable-progress-input'
      />
      <span className='text-muted-foreground text-sm'>%</span>
    </div>
  )
}

// Column definitions with editable cells
export const columns: ColumnDef<Person>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'firstName',
    header: 'Site',
    cell: EditableTextCell
  },
  {
    accessorKey: 'lastName',
    header: 'Meter ID',
    cell: EditableTextCell
  },
  {
    accessorKey: 'email',
    header: 'Energy Manager',
    cell: EditableTextCell
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: EditableSelectCell
  },
  {
    accessorKey: 'progress',
    header: 'M&V Progress',
    cell: EditableProgressCell
  }
]

const EditableDataTableDemo = () => {
  const [data, setData] = useState(() => [...initialData])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const refreshData = () => setData(() => [...initialData])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value
              }
            }

            return row
          })
        )
      }
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  return (
    <div className='w-full space-y-4'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between gap-2 text-sm max-md:flex-col'>
        <span className='text-muted-foreground'>{table.getRowModel().rows.length} rows total</span>
        <Button variant='outline' size='sm' onClick={refreshData}>
          Refresh Data
        </Button>
      </div>

      <p className='text-muted-foreground mt-4 text-center text-sm'>
        Editable data table - Click on cells to edit values
      </p>
    </div>
  )
}

export default EditableDataTableDemo
