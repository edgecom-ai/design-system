"use client"

import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// A subscription's headline facts in one strip, keyed to the workspace picked
// on the left. Every figure stays neutral — even the amount due, which is
// settled elsewhere and so has nothing to act on here.
const workspaces = [
  {
    value: "Juniper Studio",
    plan: "Team",
    period: "Jun 1 – Jun 30",
    seats: "12 of 15",
    due: "$180.00",
    card: "Visa ending 4242",
  },
  {
    value: "Harbor Lane Bakery",
    plan: "Starter",
    period: "Jun 12 – Jul 11",
    seats: "3 of 5",
    due: "$29.00",
    card: "Mastercard ending 4444",
  },
]

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-caption tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="text-body-lg font-medium tabular-nums">{children}</dd>
    </div>
  )
}

export function StatFactStripDemo() {
  const [value, setValue] = React.useState(workspaces[0].value)
  const workspace = workspaces.find((item) => item.value === value) ?? workspaces[0]

  return (
    <Card className="w-full">
      <CardContent className="flex flex-wrap items-start justify-between gap-x-10 gap-y-5">
        <div className="flex flex-col gap-1">
          <span id="workspace-label" className="text-caption tracking-wide text-muted-foreground uppercase">
            Workspace
          </span>
          <Select
            items={workspaces.map((item) => ({ label: item.value, value: item.value }))}
            value={value}
            onValueChange={(next) => next && setValue(next)}
          >
            <SelectTrigger aria-labelledby="workspace-label" className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <span className="flex flex-col">
                    <span>{item.value}</span>
                    <span className="text-caption text-muted-foreground">{item.plan} plan</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <dl className="flex flex-wrap gap-x-10 gap-y-5">
          <Fact label="Plan">{workspace.plan}</Fact>
          <Fact label="Billing period">{workspace.period}</Fact>
          <Fact label="Seats">{workspace.seats}</Fact>
          <Fact label="Amount due">{workspace.due}</Fact>
          <Fact label="Payment method">{workspace.card}</Fact>
        </dl>
      </CardContent>
    </Card>
  )
}
