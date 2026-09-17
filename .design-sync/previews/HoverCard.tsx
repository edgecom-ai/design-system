// HoverCard preview — rendered OPEN. Rich previews behind a link; not for
// actions. Two stories: a site summary and a person card.
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

export function SiteSummary() {
  return (
    <div className="flex h-full items-start justify-center pt-8 text-body-sm">
      <p>
        Peak demand came from{" "}
        <HoverCard open>
          <HoverCardTrigger render={<a href="#" className="font-medium underline underline-offset-3" />}>
            Harbor Point Cold Storage
          </HoverCardTrigger>
          <HoverCardContent className="w-72">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">Harbor Point Cold Storage</p>
                <p className="text-caption text-muted-foreground">9 meters · Peak weekday tariff</p>
              </div>
              <Badge variant="destructive">Over limit</Badge>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2">
              <div><dt className="text-caption text-muted-foreground">Today</dt><dd className="font-medium">3,412 kWh</dd></div>
              <div><dt className="text-caption text-muted-foreground">Peak</dt><dd className="font-medium">1,284 kW</dd></div>
              <div><dt className="text-caption text-muted-foreground">PF</dt><dd className="font-medium">0.91</dd></div>
            </dl>
          </HoverCardContent>
        </HoverCard>{" "}
        at 14:32.
      </p>
    </div>
  )
}

export function PersonCard() {
  return (
    <div className="flex h-full items-start justify-center pt-8 text-body-sm">
      <p>
        Assigned to{" "}
        <HoverCard open>
          <HoverCardTrigger render={<a href="#" className="font-medium underline underline-offset-3" />}>
            Bianca Ngan
          </HoverCardTrigger>
          <HoverCardContent side="bottom" align="start">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>BN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Bianca Ngan</p>
                <p className="text-caption text-muted-foreground">Energy manager · Northridge region</p>
              </div>
            </div>
            <p className="mt-3 text-caption text-muted-foreground">On call until Fri 18:00 · 4 open alarms</p>
          </HoverCardContent>
        </HoverCard>
      </p>
    </div>
  )
}
