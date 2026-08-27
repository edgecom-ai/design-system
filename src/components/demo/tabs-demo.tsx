import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function TabsDemo() {
  return (
    <Tabs defaultValue="demand" className="w-full max-w-md gap-4">
      <TabsList>
        <TabsTrigger value="demand">Demand</TabsTrigger>
        <TabsTrigger value="consumption">Consumption</TabsTrigger>
        <TabsTrigger value="power-factor">Power factor</TabsTrigger>
      </TabsList>
      <TabsContent value="demand">
        <p className="text-sm text-muted-foreground">
          Peak demand for Etobicoke South reached 1,480 kW at 14:45 — 6% above
          the billing threshold for this period.
        </p>
      </TabsContent>
      <TabsContent value="consumption">
        <p className="text-sm text-muted-foreground">
          412 MWh consumed month-to-date across 14 meters, tracking 3% under the
          same period last year.
        </p>
      </TabsContent>
      <TabsContent value="power-factor">
        <p className="text-sm text-muted-foreground">
          Average power factor 0.94, with two intervals dipping below 0.90 on the
          main incoming feeder.
        </p>
      </TabsContent>
    </Tabs>
  )
}
