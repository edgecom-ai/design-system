// ResizablePanelGroup preview — the docs site's demos plus a three-panel, handle-less strip.
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export { ResizableDemo as Horizontal } from "@/components/demo/resizable-demo"
export { ResizableVerticalDemo as Vertical } from "@/components/demo/resizable-vertical-demo"

const panels = [
  { label: "Demand", value: "1,480 kW" },
  { label: "Consumption", value: "412 MWh" },
  { label: "Power factor", value: "0.94" },
]

export function ThreePanelsPlainHandles() {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-36 w-full max-w-md rounded-lg border border-border"
    >
      {panels.map((p, i) => (
        <>
          {i > 0 && <ResizableHandle key={`h-${p.label}`} />}
          <ResizablePanel key={p.label} defaultSize={String(Math.round(100 / panels.length))}>
            <div className="flex h-full flex-col gap-1 p-4">
              <span className="text-caption text-muted-foreground">{p.label}</span>
              <span className="text-2xl font-semibold tabular">{p.value}</span>
            </div>
          </ResizablePanel>
        </>
      ))}
    </ResizablePanelGroup>
  )
}
