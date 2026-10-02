import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"

const meters = [
  { meter: "MTR-1042", site: "Distribution Center", reading: "12:45", demand: "1,840 kW" },
  { meter: "MTR-1043", site: "Distribution Center", reading: "12:45", demand: "1,215 kW" },
  { meter: "MTR-2210", site: "Manufacturing Plant", reading: "12:30", demand: "3,460 kW" },
  { meter: "MTR-3307", site: "Cold Storage Facility", reading: "12:45", demand: "920 kW" },
  { meter: "MTR-4100", site: "Head Office", reading: "12:15", demand: "310 kW" },
]

export function TableHeaderMutedDemo() {
  return (
    <Table>
      <TableCaption>Latest interval reading per meter.</TableCaption>
      <TableHeader variant="muted">
        <TableRow>
          <TableHead>Meter</TableHead>
          <TableHead>Site</TableHead>
          <TableHead>Last reading</TableHead>
          <TableHead className="text-right">Demand</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {meters.map((m) => (
          <TableRow key={m.meter}>
            <TableCell className="font-medium">{m.meter}</TableCell>
            <TableCell>{m.site}</TableCell>
            <TableCell className="tabular">{m.reading}</TableCell>
            <TableCell className="text-right tabular">{m.demand}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
