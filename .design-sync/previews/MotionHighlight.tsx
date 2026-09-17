// MotionHighlight preview — a shared highlight that follows the active item.
// The card shows the highlight resting on a default value; hover is skipped.
// Each MotionHighlightItem takes exactly ONE plain DOM child element: it clones
// it and merges `relative z-[1]` into its className so the text sits above the
// highlight (a component child swallows that class).
// transition duration 0 so the capture never lands mid-fade.
import { MotionHighlight, MotionHighlightItem } from "@/components/ui/motion-highlight"

const sites = [
  { id: "northridge", name: "Northridge Distribution Center", kw: "1,240 kW" },
  { id: "eastfield", name: "Eastfield Cold Storage", kw: "860 kW" },
  { id: "harbor", name: "Harbor Point Offices", kw: "310 kW" },
  { id: "willow", name: "Willow Creek Plant", kw: "95 kW" },
]

function siteRow(s: { name: string; kw: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-3 py-2">
      <span className="text-body-sm font-medium">{s.name}</span>
      <span className="text-body-sm tabular-nums text-muted-foreground">{s.kw}</span>
    </div>
  )
}

export function ChildrenMode() {
  return (
    <div className="w-full max-w-sm">
      <MotionHighlight defaultValue="eastfield" className="rounded-md" transition={{ duration: 0 }}>
        {sites.map((s) => (
          <MotionHighlightItem key={s.id} value={s.id}>
            {siteRow(s)}
          </MotionHighlightItem>
        ))}
      </MotionHighlight>
    </div>
  )
}

const periods = ["Today", "7 days", "30 days", "Billing period"]

export function ParentModeSegmented() {
  return (
    <MotionHighlight
      mode="parent"
      defaultValue="7 days"
      containerClassName="inline-flex rounded-lg bg-muted p-1"
      className="rounded-md bg-background shadow-sm"
      transition={{ duration: 0 }}
    >
      {periods.map((p) => (
        <MotionHighlightItem key={p} value={p}>
          <button type="button" className="px-3 py-1.5 text-body-sm font-medium">
            {p}
          </button>
        </MotionHighlightItem>
      ))}
    </MotionHighlight>
  )
}

export function CustomActiveClass() {
  return (
    <div className="w-full max-w-sm">
      <MotionHighlight defaultValue="harbor" className="rounded-md bg-primary/10 ring-1 ring-primary/30" transition={{ duration: 0 }}>
        {sites.map((s) => (
          <MotionHighlightItem key={s.id} value={s.id}>
            {siteRow(s)}
          </MotionHighlightItem>
        ))}
      </MotionHighlight>
    </div>
  )
}
