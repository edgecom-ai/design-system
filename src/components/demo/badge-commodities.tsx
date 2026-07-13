import { Badge } from "@/components/ui/badge"

export function BadgeCommoditiesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="electricity">Electricity</Badge>
      <Badge variant="water">Water</Badge>
      <Badge variant="gas">Gas</Badge>
      <Badge variant="temperature">Temperature</Badge>
      <Badge variant="emissions">Emissions</Badge>
    </div>
  )
}
