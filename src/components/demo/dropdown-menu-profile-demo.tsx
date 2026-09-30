"use client"

import * as React from "react"
import {
  BellIcon,
  Building2Icon,
  ChevronsUpDownIcon,
  LifeBuoyIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const organizations = [
  { value: "harbourside", label: "Harbourside Foods" },
  { value: "northgate", label: "Northgate Logistics" },
]

export function DropdownMenuProfileDemo() {
  const [organization, setOrganization] = React.useState("harbourside")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="h-auto gap-2 py-1.5 pr-2 pl-1.5">
            <Avatar size="sm">
              <AvatarImage src="https://design.edgecom.ai/demo/avatars/avatar-4.png" alt="" />
              <AvatarFallback>NO</AvatarFallback>
            </Avatar>
            Nadia Okoro
            <ChevronsUpDownIcon className="text-muted-foreground" />
          </Button>
        }
      />
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2 py-1.5">
            <Avatar>
              <AvatarImage src="https://design.edgecom.ai/demo/avatars/avatar-4.png" alt="" />
              <AvatarFallback>NO</AvatarFallback>
            </Avatar>
            <span className="flex flex-col">
              <span className="text-body-sm font-medium text-popover-foreground">Nadia Okoro</span>
              <span>nadia.okoro@harbourside.example</span>
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BellIcon />
            Alarm notifications
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Building2Icon />
              Organization
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={organization} onValueChange={setOrganization}>
                {organizations.map((item) => (
                  <DropdownMenuRadioItem key={item.value} value={item.value}>
                    {item.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LifeBuoyIcon />
          Help and support
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
