import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// A meter list while it loads: the column headers are known, so they render,
// and each row is a set of placeholders sized to the value it stands in for —
// the table keeps its layout instead of collapsing. The last reading sits
// right-aligned as the figure will, and the status is a badge-shaped block.
const edge = "first:pl-(--card-spacing) last:pr-(--card-spacing)"

const rows = [
  ["w-28", "w-36", "w-16"],
  ["w-24", "w-28", "w-14"],
  ["w-32", "w-40", "w-16"],
  ["w-20", "w-32", "w-12"],
  ["w-28", "w-24", "w-14"],
]

export function SkeletonTableDemo() {
  return (
    <Card className="w-full gap-0 py-0 sm:max-w-2xl" aria-busy="true">
      <CardHeader className="border-b py-4">
        <CardTitle>Meters</CardTitle>
      </CardHeader>
      <span className="sr-only">Loading meters</span>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={edge}>Meter</TableHead>
            <TableHead className={edge}>Site</TableHead>
            <TableHead className={cn(edge, "text-right")}>Last reading</TableHead>
            <TableHead className={edge}>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([meter, site, reading], i) => (
            <TableRow key={i}>
              <TableCell className={edge}>
                <Skeleton className={cn("h-4", meter)} />
              </TableCell>
              <TableCell className={edge}>
                <Skeleton className={cn("h-4", site)} />
              </TableCell>
              <TableCell className={edge}>
                <Skeleton className={cn("ml-auto h-4", reading)} />
              </TableCell>
              <TableCell className={edge}>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
