import { ScrollArea } from "@/components/ui/scroll-area"

const meters = [
  { name: "Main Incomer", kwh: "12,840" },
  { name: "HVAC Panel", kwh: "6,204" },
  { name: "Lighting Panel", kwh: "3,118" },
  { name: "Chiller Plant", kwh: "9,472" },
  { name: "Rooftop Solar", kwh: "-2,410" },
  { name: "EV Chargers", kwh: "1,905" },
  { name: "Compressor Line", kwh: "7,336" },
  { name: "Process Load A", kwh: "8,051" },
  { name: "Process Load B", kwh: "5,628" },
  { name: "Boiler Gas Meter", kwh: "4,417" },
  { name: "Water Intake", kwh: "982" },
  { name: "Cooling Tower", kwh: "3,540" },
  { name: "Backup Generator", kwh: "0" },
  { name: "Server Room", kwh: "6,915" },
  { name: "Air Handler", kwh: "2,733" },
  { name: "Refrigeration", kwh: "10,204" },
  { name: "Tenant Submeter A", kwh: "1,470" },
  { name: "Tenant Submeter B", kwh: "1,338" },
]

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-56 w-64 rounded-lg border border-border">
      <div className="p-3">
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
          Toronto DC — meters
        </p>
        <ul className="flex flex-col gap-0.5 text-sm">
          {meters.map((m) => (
            <li
              key={m.name}
              className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent"
            >
              <span>{m.name}</span>
              <span className="tabular-nums text-muted-foreground">{m.kwh} kWh</span>
            </li>
          ))}
        </ul>
      </div>
    </ScrollArea>
  )
}
