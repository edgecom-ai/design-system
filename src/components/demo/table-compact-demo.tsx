import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"

const rows = [
  { site: "Distribution Center", commodity: "Electricity", usage: "1,284 MWh", cost: "$182,940" },
  { site: "Manufacturing Plant", commodity: "Gas", usage: "94,500 m³", cost: "$61,220" },
  { site: "Cold Storage Facility", commodity: "Electricity", usage: "612 MWh", cost: "$88,010" },
  { site: "Head Office", commodity: "Water", usage: "3,410 m³", cost: "$9,740" },
  { site: "Logistics Hub", commodity: "Electricity", usage: "744 MWh", cost: "$102,530" },
  { site: "Assembly Plant", commodity: "Gas", usage: "51,200 m³", cost: "$33,180" },
]

export function TableCompactDemo() {
  return (
    <Table density="compact">
      <TableCaption>Consumption by site — compact density for dense datasets.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Site</TableHead>
          <TableHead>Commodity</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead className="text-right">Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.site}>
            <TableCell className="font-medium">{r.site}</TableCell>
            <TableCell>{r.commodity}</TableCell>
            <TableCell>{r.usage}</TableCell>
            <TableCell className="text-right tabular">{r.cost}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
