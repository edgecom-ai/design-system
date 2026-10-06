import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const sites = [
  { site: "Riverside Plant", kwh: [312, 298, 305, 287, 294, 341, 388, 392, 336, 301, 309, 322] },
  { site: "Northgate Distribution", kwh: [184, 176, 181, 169, 172, 203, 231, 236, 198, 177, 182, 190] },
  { site: "Cold Storage Facility", kwh: [226, 221, 230, 238, 251, 284, 312, 318, 279, 243, 229, 224] },
  { site: "Harbour Office", kwh: [48, 45, 44, 39, 36, 41, 47, 49, 40, 38, 44, 50] },
  { site: "Eastfield Warehouse", kwh: [97, 92, 95, 88, 90, 104, 118, 121, 103, 91, 94, 99] },
]

const number = new Intl.NumberFormat("en-US")
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)

// The first and last cells sit on the card's own content line.
const edge = "first:pl-(--card-spacing) last:pr-(--card-spacing)"

export function TablePinnedDemo() {
  return (
    <Card className="w-full gap-0 py-0">
      <CardHeader className="py-(--card-spacing)">
        <CardTitle>Monthly consumption by site</CardTitle>
        <CardDescription>MWh, last twelve months. Scroll sideways — the site and its total stay put.</CardDescription>
      </CardHeader>
      {/* The table sits flush in a card, so the pinned cells paint `card`. */}
      <Table surface="card">
        <TableHeader variant="strong">
          <TableRow>
            <TableHead pinned="left" className={edge}>
              Site
            </TableHead>
            {months.map((month) => (
              <TableHead key={month} className="text-right">
                {month}
              </TableHead>
            ))}
            <TableHead pinned="right" className={`text-right ${edge}`}>
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.map((row) => (
            <TableRow key={row.site}>
              <TableCell pinned="left" className={`font-medium ${edge}`}>
                {row.site}
              </TableCell>
              {row.kwh.map((value, i) => (
                <TableCell key={months[i]} className="text-right tabular-nums">
                  {number.format(value)}
                </TableCell>
              ))}
              <TableCell pinned="right" className={`text-right font-medium tabular-nums ${edge}`}>
                {number.format(sum(row.kwh))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell pinned="left" className={edge}>
              All sites
            </TableCell>
            {months.map((month, i) => (
              <TableCell key={month} className="text-right tabular-nums">
                {number.format(sum(sites.map((row) => row.kwh[i])))}
              </TableCell>
            ))}
            <TableCell pinned="right" className={`text-right tabular-nums ${edge}`}>
              {number.format(sum(sites.flatMap((row) => row.kwh)))}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  )
}
