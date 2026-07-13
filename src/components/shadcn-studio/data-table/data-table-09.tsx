'use client'

import { Fragment } from 'react'

import type { ColumnDef } from '@tanstack/react-table'
import { flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react"

type Member = {
  name: string
  role: string
  email: string
  hireDate: string
  dob: string
}

type Team = {
  teamName: string
  department: string
  location: string
  nextMilestone: string
  budget: number
  members: Member[]
}

const data: Team[] = [
  {
    teamName: 'HQ – Bay Street',
    department: 'Electricity',
    location: 'Toronto',
    nextMilestone: 'Launch DR Program',
    budget: 30000,
    members: [
      {
        name: 'Main Building Meter',
        role: 'Primary Feed',
        email: 'MTR-1001@edgecom.ai',
        hireDate: '2020-01-15',
        dob: '480 kW'
      },
      {
        name: 'Chiller Submeter',
        role: 'HVAC Load',
        email: 'MTR-1002@edgecom.ai',
        hireDate: '2021-03-22',
        dob: '180 kW'
      },
      {
        name: 'Lighting Submeter',
        role: 'Lighting Load',
        email: 'MTR-1003@edgecom.ai',
        hireDate: '2022-07-30',
        dob: '95 kW'
      }
    ]
  },
  {
    teamName: 'Toronto Distribution Center',
    department: 'Gas',
    location: 'Mississauga',
    nextMilestone: 'Complete M&V Baseline',
    budget: 50000,
    members: [
      {
        name: 'Boiler Meter',
        role: 'Heating Load',
        email: 'MTR-2001@edgecom.ai',
        hireDate: '2019-05-10',
        dob: '220 GJ'
      },
      {
        name: 'Process Gas Meter',
        role: 'Process Load',
        email: 'MTR-2002@edgecom.ai',
        hireDate: '2020-08-15',
        dob: '140 GJ'
      },
      {
        name: 'Backup Generator',
        role: 'Standby Load',
        email: 'MTR-2003@edgecom.ai',
        hireDate: '2021-01-20',
        dob: '60 GJ'
      }
    ]
  },
  {
    teamName: 'Calgary Plant 2',
    department: 'Water',
    location: 'Calgary',
    nextMilestone: 'Reduce Peak Demand',
    budget: 40000,
    members: [
      {
        name: 'Intake Meter',
        role: 'Supply Line',
        email: 'MTR-3001@edgecom.ai',
        hireDate: '2021-05-12',
        dob: '1,200 m³'
      },
      {
        name: 'Cooling Tower Meter',
        role: 'Cooling Load',
        email: 'MTR-3002@edgecom.ai',
        hireDate: '2020-11-01',
        dob: '640 m³'
      },
      {
        name: 'Wash Bay Submeter',
        role: 'Process Load',
        email: 'MTR-3003@edgecom.ai',
        hireDate: '2021-09-15',
        dob: '210 m³'
      }
    ]
  }
]

const columns: ColumnDef<Team>[] = [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <Button
          {...{
            className: 'size-7 text-muted-foreground',
            onClick: row.getToggleExpandedHandler(),
            'aria-expanded': row.getIsExpanded(),
            'aria-label': row.getIsExpanded()
              ? `Collapse details for ${row.original.teamName}`
              : `Expand details for ${row.original.teamName}`,
            size: 'icon',
            variant: 'ghost'
          }}
        >
          {row.getIsExpanded() ? (
            <ChevronUpIcon className='opacity-60' aria-hidden='true' />
          ) : (
            <ChevronDownIcon className='opacity-60' aria-hidden='true' />
          )}
        </Button>
      ) : undefined
    }
  },
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
    )
  },
  {
    header: 'Site',
    accessorKey: 'teamName',
    cell: ({ row }) => <div>{row.getValue('teamName')}</div>
  },
  {
    header: 'Commodity',
    accessorKey: 'department',
    cell: ({ row }) => row.getValue('department')
  },
  {
    header: 'Location',
    accessorKey: 'location',
    cell: ({ row }) => row.getValue('location')
  },
  {
    header: 'Next Milestone',
    accessorKey: 'nextMilestone',
    cell: ({ row }) => row.getValue('nextMilestone')
  },
  {
    header: () => <div>Annual Cost</div>,
    accessorKey: 'budget',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('budget'))

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)

      return <div>{formatted}</div>
    }
  }
]

const DataTableWithExpandableRowsDemo = () => {
  const table = useReactTable({
    data,
    columns,
    getRowCanExpand: row => Boolean(row.original.members),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel()
  })

  return (
    <div className='w-full'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className='hover:bg-transparent'>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <Fragment key={row.id}>
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        key={cell.id}
                        className='[&:has([aria-expanded])]: [&:has([aria-expanded])]:w-px [&:has([aria-expanded])]:py-0'
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow className='hover:bg-transparent'>
                      <TableCell colSpan={row.getVisibleCells().length} className='p-0'>
                        <Table>
                          <TableHeader className='border-b'>
                            <TableRow className='hover:bg-muted/30!'>
                              <TableHead className='w-23.5'></TableHead>
                              <TableHead>Meter</TableHead>
                              <TableHead>Load Type</TableHead>
                              <TableHead>Meter ID</TableHead>
                              <TableHead>Installed</TableHead>
                              <TableHead>Peak</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {row.original.members.map(member => (
                              <TableRow key={member.email}>
                                <TableCell></TableCell>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.role}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>{member.hireDate}</TableCell>
                                <TableCell>{member.dob}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
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
      <p className='text-muted-foreground mt-4 text-center text-sm'>Data table with expanding sub-rows made</p>
    </div>
  )
}

export default DataTableWithExpandableRowsDemo
