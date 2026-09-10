import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const SERIES = ["Demand", "Consumption", "Power factor"]

function Strip({ variant }: { variant?: "default" | "adaptive" | "line" }) {
  return (
    <Tabs defaultValue={SERIES[0]}>
      <TabsList variant={variant}>
        {SERIES.map((series) => (
          <TabsTrigger key={series} value={series}>
            {series}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

// The same strip three ways on a muted panel — the surface the default
// variant's absolute `muted` track has no step left against.
export function TabsSurfacesDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 rounded-xl bg-muted p-4">
      <div className="flex flex-col gap-2">
        <p className="text-caption text-muted-foreground">
          default — the track matches the panel it sits on
        </p>
        <Strip />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-caption text-muted-foreground">
          adaptive — a relative track, so it keeps its step
        </p>
        <Strip variant="adaptive" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-caption text-muted-foreground">
          line — needs no step at all
        </p>
        <Strip variant="line" />
      </div>
    </div>
  )
}
