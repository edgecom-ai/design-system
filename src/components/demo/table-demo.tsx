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
  { site: "Toronto Distribution Center", commodity: "Electricity", usage: "1,284 MWh", cost: "$182,940" },
  { site: "Hamilton Manufacturing Plant", commodity: "Gas", usage: "94,500 m³", cost: "$61,220" },
  { site: "Mississauga Cold Storage", commodity: "Electricity", usage: "612 MWh", cost: "$88,010" },
  { site: "Ottawa Head Office", commodity: "Water", usage: "3,410 m³", cost: "$9,740" },
]

export function TableDemo() {
  return (
    <Table>
      <TableCaption>Consumption by site — last billing period.</TableCaption>
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
