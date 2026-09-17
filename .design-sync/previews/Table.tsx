// Table preview — the docs site's own Table demos plus a footer/selection story.
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export { TableDemo as Default } from "@/components/demo/table-demo"
export { TableCompactDemo as Compact } from "@/components/demo/table-compact-demo"

const meters = [
  { meter: "MTR-4410-0021", site: "Northridge Distribution Center", peak: "1,480 kW", status: "Alarm", selected: true },
  { meter: "MTR-4410-0034", site: "Harbourview Cold Storage", peak: "612 kW", status: "Normal" },
  { meter: "MTR-4410-0087", site: "Pinecrest Assembly Plant", peak: "944 kW", status: "Normal" },
  { meter: "MTR-4410-0102", site: "Westgate Logistics Hub", peak: "0 kW", status: "Offline" },
]

export function WithFooterAndSelectedRow() {
  return (
    <Table>
      <TableCaption>Peak demand by meter — current billing period.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Meter</TableHead>
          <TableHead>Site</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Peak</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {meters.map((m) => (
          <TableRow key={m.meter} data-state={m.selected ? "selected" : undefined}>
            <TableCell className="font-medium tabular">{m.meter}</TableCell>
            <TableCell>{m.site}</TableCell>
            <TableCell>
              <Badge variant={m.status === "Alarm" ? "destructive" : m.status === "Offline" ? "outline" : "secondary"}>
                {m.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right tabular">{m.peak}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Portfolio total</TableCell>
          <TableCell className="text-right tabular">3,036 kW</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
