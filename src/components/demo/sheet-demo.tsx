"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Site details</Button>} />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Toronto DC</SheetTitle>
          <SheetDescription>
            Review and update this site&apos;s metering configuration.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="site-name">Site name</Label>
            <Input id="site-name" defaultValue="Toronto DC" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="site-address">Address</Label>
            <Input id="site-address" defaultValue="123 King St W, Toronto, ON" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="site-capacity">Peak capacity (kW)</Label>
            <Input id="site-capacity" type="number" defaultValue="4200" />
          </div>
        </div>

        <SheetFooter>
          <Button>Save changes</Button>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
