import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// The in-card table recipe (design.md → Layout → Tables): the card's content
// drops its horizontal padding, the header is a `strong` band, the edge cells
// sit on the card's content line, numbers are right-aligned tabular figures, a
// date that opens the record is a link button with no box of its own, and a
// footnote marker is a tooltip rather than a column.
const invoices = [
  { rank: 1, date: "Jul 18, 2026", due: "Aug 17", amount: "$11,842", outstanding: "$1,214", note: "Provisional — the total settles once the credit note posts." },
  { rank: 2, date: "Jul 9, 2026", due: "Aug 8", amount: "$11,610", outstanding: "$1,188" },
  { rank: 3, date: "Aug 2, 2026", due: "Sep 1", amount: "$11,455", outstanding: "$1,097", note: "Amount estimated from the purchase order." },
  { rank: 4, date: "Jun 24, 2026", due: "Jul 24", amount: "$11,302", outstanding: "$1,142" },
  { rank: 5, date: "Jul 30, 2026", due: "Aug 29", amount: "$11,260", outstanding: "$1,066" },
]

// The first and last cells sit on the card's own content line.
const edge = "first:pl-(--card-spacing) last:pr-(--card-spacing)"

export function TableInCardDemo() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Largest invoices</CardTitle>
        <CardDescription>Top five invoices this quarter and the balance still open on each.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader variant="strong">
            <TableRow>
              <TableHead className={edge}>Rank</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className={`text-right ${edge}`}>Outstanding</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.rank}>
                <TableCell className={`font-medium tabular-nums ${edge}`}>{invoice.rank}</TableCell>
                <TableCell>
                  <Button variant="link" className="h-auto p-0">
                    {invoice.date}
                  </Button>
                  {invoice.note ? (
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button variant="link" className="ml-0.5 h-auto p-0 align-super text-caption" aria-label="Footnote" />
                        }
                      >
                        *
                      </TooltipTrigger>
                      <TooltipContent>{invoice.note}</TooltipContent>
                    </Tooltip>
                  ) : null}
                </TableCell>
                <TableCell className="tabular-nums">{invoice.due}</TableCell>
                <TableCell className="text-right tabular-nums">{invoice.amount}</TableCell>
                <TableCell className={`text-right tabular-nums ${edge}`}>{invoice.outstanding}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
