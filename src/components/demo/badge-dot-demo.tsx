import { Badge } from "@/components/ui/badge"

// Meter connectivity at a glance: a neutral outline badge whose dot carries
// the status and whose word says it, so the state never rests on colour alone.
const states = [
  { label: "Online", dot: "bg-success" },
  { label: "Degraded", dot: "bg-warning" },
  { label: "Offline", dot: "bg-destructive" },
  { label: "Syncing", dot: "bg-info" },
]

export function BadgeDotDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {states.map(({ label, dot }) => (
        <Badge key={label} variant="outline">
          <span className={`size-1.5 shrink-0 rounded-full ${dot}`} aria-hidden />
          {label}
        </Badge>
      ))}
    </div>
  )
}
