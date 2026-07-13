import { Badge } from "@/components/ui/badge"

export function BadgeVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="success">Online</Badge>
      <Badge variant="warning">Degraded</Badge>
      <Badge variant="info">Syncing</Badge>
    </div>
  )
}
