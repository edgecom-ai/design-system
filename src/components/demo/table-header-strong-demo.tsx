import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"

const peaks = [
  { site: "Distribution Center", peak: "2,140 kW", at: "Oct 2, 14:30", change: "+4.2%" },
  { site: "Manufacturing Plant", peak: "3,880 kW", at: "Oct 1, 10:15", change: "−1.8%" },
  { site: "Cold Storage Facility", peak: "1,060 kW", at: "Oct 3, 16:45", change: "+0.6%" },
  { site: "Logistics Hub", peak: "910 kW", at: "Oct 2, 09:00", change: "−3.1%" },
]

export function TableHeaderStrongDemo() {
  return (
    // On a `muted` surface a `muted` header would vanish; `strong` steps from it.
    <div className="w-full rounded-xl bg-muted p-4">
      <Table>
        <TableCaption>Monthly demand peak per site.</TableCaption>
        <TableHeader variant="strong">
          <TableRow>
            <TableHead>Site</TableHead>
            <TableHead>Peak</TableHead>
            <TableHead>Reached</TableHead>
            <TableHead className="text-right">vs. last month</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {peaks.map((p) => (
            <TableRow key={p.site}>
              <TableCell className="font-medium">{p.site}</TableCell>
              <TableCell className="tabular">{p.peak}</TableCell>
              <TableCell className="tabular">{p.at}</TableCell>
              <TableCell className="text-right tabular">{p.change}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
