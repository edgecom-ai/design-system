// MotionTabs preview — motion-tabs.tsx is aliased in the bundle (Tabs → MotionTabs …),
// so import the Motion-prefixed names from the package rather than the ui path,
// which would resolve to the Base UI Tabs of the same name.
import {
  MotionTabs,
  MotionTabsContent,
  MotionTabsList,
  MotionTabsTrigger,
  TabsContents,
} from "edgecom-design-system"

const tabs = [
  {
    name: "Overview",
    value: "overview",
    content: (
      <>
        Your <span className="text-foreground font-semibold">site summary</span> across all commodities —
        consumption, cost and emissions trends at a glance.
      </>
    ),
  },
  {
    name: "Electricity",
    value: "electricity",
    content: (
      <>
        Track <span className="text-foreground font-semibold">electricity</span> consumption, peak demand and power
        factor down to the interval level for each meter.
      </>
    ),
  },
  {
    name: "Water",
    value: "water",
    content: (
      <>
        Monitor <span className="text-foreground font-semibold">water</span> usage in m³, spot anomalies and compare
        against your baseline period.
      </>
    ),
  },
]

function Story({ defaultValue }: { defaultValue: string }) {
  return (
    <div className="w-full max-w-md">
      <MotionTabs defaultValue={defaultValue} className="gap-4">
        <MotionTabsList>
          {tabs.map((tab) => (
            <MotionTabsTrigger key={tab.value} value={tab.value}>
              {tab.name}
            </MotionTabsTrigger>
          ))}
        </MotionTabsList>
        <TabsContents className="bg-background mx-1 -mt-2 mb-1 h-full rounded-sm">
          {tabs.map((tab) => (
            <MotionTabsContent key={tab.value} value={tab.value}>
              <p className="text-muted-foreground text-sm">{tab.content}</p>
            </MotionTabsContent>
          ))}
        </TabsContents>
      </MotionTabs>
    </div>
  )
}

export function Default() {
  return <Story defaultValue="overview" />
}

export function SecondTabActive() {
  return <Story defaultValue="electricity" />
}
