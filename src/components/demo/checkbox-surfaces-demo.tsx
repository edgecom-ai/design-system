import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const edge = "first:pl-(--card-spacing) last:pr-(--card-spacing)"

const meters = [
  { id: "MTR-2207", site: "Riverside Plant", selected: true },
  { id: "MTR-1180", site: "Cold Storage Facility", selected: false },
  { id: "MTR-0915", site: "Harbour Office", selected: false },
]

// Unchecked boxes and radios on every surface that used to swallow them: a
// filled table header, a selected row, the muted page body, and an invalid
// row on a destructive tint. Nothing here sets a surface — the face is the
// default.
export function CheckboxSurfacesDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-muted p-4">
      <Card className="gap-0 py-0">
        <Table>
          <TableHeader variant="strong">
            <TableRow>
              <TableHead className={`${edge} w-10`}>
                <Checkbox indeterminate aria-label="Select all meters" />
              </TableHead>
              <TableHead className={edge}>Meter</TableHead>
              <TableHead className={edge}>Site</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meters.map((meter) => (
              <TableRow
                key={meter.id}
                data-state={meter.selected ? "selected" : undefined}
              >
                <TableCell className={edge}>
                  <Checkbox
                    defaultChecked={meter.selected}
                    aria-label={`Select ${meter.id}`}
                  />
                </TableCell>
                <TableCell className={`${edge} font-medium`}>{meter.id}</TableCell>
                <TableCell className={edge}>{meter.site}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Label className="flex items-center gap-2">
          <Checkbox /> Include sub-meters
        </Label>
        <RadioGroup defaultValue="day" aria-label="Interval" className="flex w-auto gap-4">
          <Label className="flex items-center gap-2">
            <RadioGroupItem value="day" /> Day
          </Label>
          <Label className="flex items-center gap-2">
            <RadioGroupItem value="week" /> Week
          </Label>
        </RadioGroup>
      </div>

      <Label className="flex items-center gap-2 rounded-md bg-destructive-subtle px-3 py-2 text-destructive-subtle-foreground">
        <Checkbox aria-invalid />
        Accept the data-sharing terms to continue
      </Label>
    </div>
  )
}
