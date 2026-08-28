import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const channels = [
  {
    value: "demand",
    label: "Demand",
    reading: "Peak 1,480 kW at 14:45 — 6% above the billing threshold.",
  },
  {
    value: "consumption",
    label: "Consumption",
    reading: "412 MWh month-to-date across 14 meters.",
  },
  {
    value: "power-factor",
    label: "Power factor",
    reading: "Average 0.94, dipping to 0.89 on the main incoming feeder.",
  },
  {
    value: "voltage-thd",
    label: "Voltage THD",
    reading: "2.1% on phase A, within the 5% IEEE 519 limit.",
  },
  {
    value: "current-thd",
    label: "Current THD",
    reading: "7.4% on phase C — the chiller VFD is the likely source.",
  },
  {
    value: "reactive",
    label: "Reactive power",
    reading: "540 kVAR drawn during the afternoon peak window.",
  },
]

export function TabsScrollableDemo() {
  return (
    <Tabs defaultValue="demand" className="w-full max-w-sm gap-4">
      <TabsList variant="line">
        {channels.map((channel) => (
          <TabsTrigger key={channel.value} value={channel.value}>
            {channel.label}
          </TabsTrigger>
        ))}
        <TabsIndicator />
      </TabsList>
      {channels.map((channel) => (
        <TabsContent key={channel.value} value={channel.value}>
          <p className="text-body text-muted-foreground">{channel.reading}</p>
        </TabsContent>
      ))}
    </Tabs>
  )
}
