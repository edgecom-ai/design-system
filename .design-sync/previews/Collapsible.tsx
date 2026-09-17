// Collapsible preview — rendered EXPANDED with `defaultOpen` so the card shows the
// disclosed content, with a closed twin for contrast.
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDownIcon, ChevronRightIcon, FileIcon, FolderOpenIcon, FolderIcon } from "lucide-react"

const leaves = ["Main incomer", "HVAC panel", "Lighting panel", "Rooftop solar"]

function SiteTree({ open }: { open: boolean }) {
  return (
    <Collapsible defaultOpen={open} className="flex w-full max-w-xs flex-col gap-1.5">
      <CollapsibleTrigger className="flex items-center gap-2 rounded-md p-1 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
        <ChevronRightIcon className="size-4 shrink-0 transition-transform in-data-open:rotate-90" />
        <FolderIcon className="size-4 shrink-0 in-data-open:hidden" />
        <FolderOpenIcon className="size-4 shrink-0 in-data-closed:hidden" />
        <span>Northridge Distribution Center</span>
        <span className="ml-auto text-muted-foreground tabular">{leaves.length} meters</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-1.5">
        {leaves.map((leaf) => (
          <div key={leaf} className="flex items-center gap-2 rounded-md p-1 pl-7">
            <FileIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{leaf}</span>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function OpenTree() {
  return <SiteTree open />
}

export function ClosedTree() {
  return <SiteTree open={false} />
}

export function InCardWithButtonTrigger() {
  return (
    <Card className="w-full max-w-md">
      <Collapsible defaultOpen>
        <div className="flex items-center justify-between gap-3 px-6">
          <CardTitle>How do I set a peak-demand alert?</CardTitle>
          <CardAction>
            <CollapsibleTrigger
              render={
                <Button variant="outline" size="sm">
                  <span className="in-data-open:hidden">Show</span>
                  <span className="in-data-closed:hidden">Hide</span>
                  <ChevronDownIcon className="transition-transform in-data-open:rotate-180" />
                </Button>
              }
            />
          </CardAction>
        </div>
        <CollapsibleContent>
          <CardContent className="flex flex-col gap-2 pt-4 text-sm text-muted-foreground">
            <p>Open a meter under Alarms, set a kW threshold, and choose who is notified when demand exceeds it.</p>
            <p>Thresholds can follow the tariff&apos;s billing-demand window so an alert fires before the charge is set.</p>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
