"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

const workOrders = [
  { task: "Replace CT on MTR-2207", assignee: "Tomás Reyes", initials: "TR", avatar: 2, due: "Overdue" },
  { task: "Recalibrate chiller flow meter", assignee: "Priya Menon", initials: "PM", avatar: 7, due: "Today" },
  { task: "Confirm demand-response opt-in", assignee: "Nadia Okoro", initials: "NO", avatar: 4, due: "Thu" },
  { task: "Review weekend baseline drift", assignee: "Jonah Ellery", initials: "JE", avatar: 9, due: "Fri" },
]

export function HoverCardTasksDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <Button variant="link" size="sm" className="h-auto p-0">
            4 open work orders
          </Button>
        }
      />
      <HoverCardContent className="w-80">
        <p className="font-medium">Open work orders</p>
        <p className="text-caption text-muted-foreground">Plant 3, Riverside</p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {workOrders.map((order) => (
            <li key={order.task} className="flex items-center gap-2.5">
              <Avatar size="sm">
                <AvatarImage
                  src={`https://design.edgecom.ai/demo/avatars/avatar-${order.avatar}.png`}
                  alt=""
                />
                <AvatarFallback>{order.initials}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate">{order.task}</span>
                <span className="text-caption text-muted-foreground">{order.assignee}</span>
              </div>
              {order.due === "Overdue" ? (
                <Badge variant="warning">Overdue</Badge>
              ) : (
                <span className="text-caption text-muted-foreground">{order.due}</span>
              )}
            </li>
          ))}
        </ul>
      </HoverCardContent>
    </HoverCard>
  )
}
