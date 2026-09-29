"use client"

import * as React from "react"
import { ChevronDownIcon, SearchIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Priority = "urgent" | "high" | "normal" | "low"

// Priority by meaning: urgent is the error tone, high a caution, normal
// information, and low stays neutral.
const priorityBadge = {
  urgent: { label: "Urgent", variant: "destructive" },
  high: { label: "High", variant: "warning" },
  normal: { label: "Normal", variant: "info" },
  low: { label: "Low", variant: "outline" },
} as const

const priorities = [
  { value: "all", label: "All priorities" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "normal", label: "Normal" },
  { value: "low", label: "Low" },
]

const tickets: {
  id: number
  subject: string
  priority: Priority
  reference: string
  at: string
  message: string
  details: { label: string; value: string }[]
}[] = [
  {
    id: 1,
    subject: "Charged twice for one order",
    priority: "urgent",
    reference: "Order #1042",
    at: "Jun 15, 12:05",
    message: "Two identical charges showed up on my card this morning.",
    details: [
      { label: "Customer", value: "Priya N." },
      { label: "Channel", value: "Email" },
      { label: "Assignee", value: "Unassigned" },
    ],
  },
  {
    id: 2,
    subject: "Parcel marked delivered, not received",
    priority: "high",
    reference: "Order #1037",
    at: "Jun 15, 11:40",
    message: "Tracking says it arrived yesterday, but nothing came to the door.",
    details: [
      { label: "Customer", value: "Tom B." },
      { label: "Channel", value: "Chat" },
      { label: "Assignee", value: "Lin Ferreira" },
    ],
  },
  {
    id: 3,
    subject: "Change delivery address",
    priority: "normal",
    reference: "Order #1051",
    at: "Jun 15, 09:12",
    message: "I've moved — can this still go to the new flat?",
    details: [
      { label: "Customer", value: "Ana R." },
      { label: "Channel", value: "Email" },
      { label: "Assignee", value: "Maya Okafor" },
    ],
  },
  {
    id: 4,
    subject: "Discount code not applying",
    priority: "normal",
    reference: "Cart",
    at: "Jun 14, 16:30",
    message: "SUMMER15 says it's invalid at checkout.",
    details: [
      { label: "Customer", value: "Jo K." },
      { label: "Channel", value: "Chat" },
      { label: "Assignee", value: "Unassigned" },
    ],
  },
  {
    id: 5,
    subject: "Gift wrap question",
    priority: "low",
    reference: "Pre-sale",
    at: "Jun 14, 02:10",
    message: "Do you gift-wrap orders that ship abroad?",
    details: [
      { label: "Customer", value: "Sam W." },
      { label: "Channel", value: "Email" },
      { label: "Assignee", value: "Ivo Marsh" },
    ],
  },
  {
    id: 6,
    subject: "Wrong size sent",
    priority: "high",
    reference: "Order #1029",
    at: "Jun 13, 06:45",
    message: "Ordered a medium, a large arrived. Happy to swap.",
    details: [
      { label: "Customer", value: "Lee C." },
      { label: "Channel", value: "Email" },
      { label: "Assignee", value: "Lin Ferreira" },
    ],
  },
]

export function WidgetSupportInboxDemo() {
  const [search, setSearch] = React.useState("")
  const [priority, setPriority] = React.useState("all")

  const query = search.trim().toLowerCase()
  const matching = tickets.filter(
    (ticket) =>
      (priority === "all" || ticket.priority === priority) &&
      (query === "" || `${ticket.subject} ${ticket.message}`.toLowerCase().includes(query))
  )

  return (
    <Card className="h-120 w-full max-w-md gap-0 py-0">
      <CardHeader className="flex flex-col gap-3 border-b py-4">
        <span className="flex w-full items-baseline justify-between gap-3">
          <CardTitle>Support inbox</CardTitle>
          <span className="text-body-sm text-muted-foreground tabular-nums">{matching.length} open</span>
        </span>
        <span className="flex w-full flex-wrap items-center gap-2">
          <InputGroup className="min-w-40 flex-1">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search tickets"
              aria-label="Search tickets"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="icon-xs" aria-label="Clear search" onClick={() => setSearch("")}>
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
          <Select items={priorities} value={priority} onValueChange={(next) => next && setPriority(next)}>
            <SelectTrigger aria-label="Filter by priority" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
      </CardHeader>
      {matching.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-body-sm font-medium">No tickets match</span>
            <span className="text-body text-muted-foreground">Try another search or priority.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("")
              setPriority("all")
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {matching.map((ticket) => {
            const badge = priorityBadge[ticket.priority]
            return (
              <li key={ticket.id} className="flex flex-col gap-1 border-b px-(--card-spacing) py-3.5 last:border-b-0">
                <span className="flex items-start justify-between gap-2">
                  <span className="min-w-0 text-body-sm font-medium text-pretty">{ticket.subject}</span>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </span>
                <span className="flex flex-wrap items-center gap-1.5 text-caption text-muted-foreground">
                  <span>{ticket.reference}</span>
                  <span aria-hidden>·</span>
                  <span className="tabular-nums">{ticket.at}</span>
                </span>
                <span className="text-body text-pretty text-muted-foreground">{ticket.message}</span>
                <HoverCard>
                  <HoverCardTrigger
                    render={<Button variant="ghost" size="sm" className="-ml-2.5 self-start text-muted-foreground" />}
                  >
                    Ticket details
                    <ChevronDownIcon data-icon="inline-end" />
                  </HoverCardTrigger>
                  <HoverCardContent align="start" className="w-64">
                    <dl className="flex flex-col gap-2 text-body-sm">
                      {ticket.details.map((row) => (
                        <div key={row.label} className="flex items-baseline justify-between gap-3">
                          <dt className="text-muted-foreground">{row.label}</dt>
                          <dd className="text-right font-medium">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </HoverCardContent>
                </HoverCard>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
