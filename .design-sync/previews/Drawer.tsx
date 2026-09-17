// Drawer preview — rendered OPEN. Swipe-dismissable panels; swipeDirection
// picks the edge. Bottom (default) with a handle, right-edge, and non-modal.
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

const readings = [
  ["Today so far", "3,412 kWh"],
  ["Peak demand", "612 kW at 13:45"],
  ["Power factor", "0.94"],
  ["Last reading", "2 min ago"],
]

export function BottomWithHandle() {
  return (
    <Drawer open showSwipeHandle>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Meter MTR-2041-0087</DrawerTitle>
          <DrawerDescription>Chiller plant incomer · Northridge Distribution Center</DrawerDescription>
        </DrawerHeader>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 p-4">
          {readings.map(([k, v]) => (
            <div key={k}>
              <dt className="text-caption text-muted-foreground">{k}</dt>
              <dd className="text-body font-medium text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
        <DrawerFooter>
          <Button>Open interval chart</Button>
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export function RightEdge() {
  return (
    <Drawer open swipeDirection="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Tariff: Peak weekday</DrawerTitle>
          <DrawerDescription>Applies 16:00–21:00, Monday to Friday.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-3 p-4 text-body-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Energy rate</span><span className="font-medium">$0.182 / kWh</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Demand charge</span><span className="font-medium">$14.60 / kW</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Sites on tariff</span><span className="font-medium">6</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Next review</span><span className="font-medium">1 Nov</span></div>
        </div>
        <DrawerFooter>
          <Button>Edit schedule</Button>
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export function NonModal() {
  return (
    <Drawer open modal={false} showSwipeHandle>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Live: 4 sites reporting</DrawerTitle>
          <DrawerDescription>Non-modal — the dashboard behind stays interactive.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>Dismiss</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
