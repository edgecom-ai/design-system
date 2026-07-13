"use client"

import { useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ChevronDownIcon } from "lucide-react"

const roleItems = [
  { label: "Admin", value: "admin" },
  { label: "Member", value: "member" },
  { label: "Viewer", value: "viewer" },
]

export function UserDetailsDialogDemo() {
  const [datePopoverOpen, setDatePopoverOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Edit user details</Button>} />
      <DialogContent className="flex flex-col gap-0 p-0 max-sm:max-h-[min(650px,80vh)] sm:max-w-145">
        <ScrollArea className="flex max-h-full flex-col overflow-hidden">
          <div className="flex flex-col gap-4 p-6">
            <DialogHeader>
              <DialogTitle className="text-lg leading-7 font-semibold">
                Edit user details
              </DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-6">
              <Avatar className="size-25 shrink-0 rounded-lg after:rounded-lg">
                <AvatarFallback className="rounded-lg bg-muted text-lg font-medium text-muted-foreground">
                  MC
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                <Input
                  type="text"
                  placeholder="Full name"
                  defaultValue="Maya Chen"
                />
                <Input
                  type="text"
                  placeholder="Job title"
                  defaultValue="Energy Analyst"
                />
                <Input
                  type="email"
                  placeholder="user@edgecom.ai"
                  className="sm:col-span-2"
                  defaultValue="maya@edgecom.ai"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="team">Team</Label>
                <Input
                  id="team"
                  type="text"
                  placeholder="e.g. Operations"
                  defaultValue="Operations"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Role</Label>
                <Select items={roleItems} defaultValue="member">
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {roleItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  maxLength={10}
                  placeholder="e.g. 4165551234"
                  defaultValue="4165551234"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="e.g. Toronto"
                  defaultValue="Toronto"
                />
              </div>

              <div className="flex flex-col gap-2 max-sm:col-span-2">
                <Label htmlFor="user-id">User ID</Label>
                <Input
                  id="user-id"
                  type="text"
                  placeholder="e.g. USR-000123"
                  defaultValue="USR-000123"
                />
              </div>

              <div className="flex flex-col gap-2 max-sm:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g. 123 King St W, Toronto, ON"
                  defaultValue="123 King St W, Toronto, ON"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  type="text"
                  placeholder="e.g. America/Toronto"
                  defaultValue="America/Toronto"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="joining-date" className="px-1">
                  Joining date
                </Label>
                <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        id="joining-date"
                        className="w-full justify-between font-normal"
                      />
                    }
                  >
                    {date ? (
                      date.toLocaleDateString()
                    ) : (
                      <span className="text-muted-foreground">
                        Joining date
                      </span>
                    )}
                    <ChevronDownIcon />
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        setDate(date)
                        setDatePopoverOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Separator />

            <div className="flex flex-row justify-between gap-4">
              <DialogClose render={<Button size="lg" variant="outline" />}>
                Cancel
              </DialogClose>
              <Button size="lg">Save details</Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
