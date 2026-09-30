import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// The same interval control at each size, so the steps compare directly. Pick
// the size that matches the rest of the toolbar it sits in.
const sizes = ["sm", "default", "lg"] as const

export function ToggleGroupSizesDemo() {
  return (
    <div className="grid grid-cols-[auto_auto] items-center gap-x-4 gap-y-3">
      {sizes.map((size) => (
        <div key={size} className="contents">
          <span className="text-caption text-muted-foreground">{size}</span>
          <ToggleGroup variant="outline" size={size} spacing={0} defaultValue={["hourly"]} aria-label={`Interval, ${size}`}>
            <ToggleGroupItem value="15min">15 min</ToggleGroupItem>
            <ToggleGroupItem value="hourly">Hourly</ToggleGroupItem>
            <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
          </ToggleGroup>
        </div>
      ))}
    </div>
  )
}
