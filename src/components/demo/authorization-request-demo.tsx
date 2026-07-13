"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  ArrowLeftRightIcon,
  FileTextIcon,
  GaugeIcon,
  UserIcon,
} from "lucide-react"

const utilities = [
  "Toronto Hydro",
  "Alectra Utilities",
  "Hydro One",
  "Hydro Ottawa",
  "ENMAX",
  "EPCOR",
  "BC Hydro",
] as const

const permissions = [
  { icon: UserIcon, label: "See your account name, service address, and meter numbers" },
  { icon: GaugeIcon, label: "Read your interval consumption and demand data" },
  { icon: FileTextIcon, label: "Read your billing history and rate plan" },
]

export function AuthorizationRequestDemo() {
  return (
    <Card className="mx-auto w-full max-w-md [--card-spacing:--spacing(6)]">
      <CardContent className="flex flex-col gap-6">
        {/* Platform ↔ utility handshake */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-muted text-base font-semibold">
            E
          </div>
          <ArrowLeftRightIcon className="size-4 text-muted-foreground" />
          <div className="flex size-12 items-center justify-center rounded-xl bg-foreground text-base font-semibold text-background">
            TH
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold tracking-tight">
            Connect your utility
          </h3>
          <p className="text-sm text-muted-foreground">
            Edgecom Energy is asking to connect to your Toronto Hydro account so
            it can import your energy data.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Edgecom will be able to
          </p>
          <ul className="space-y-3">
            {permissions.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <span className="text-sm">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Utility selector (search + select) */}
        <div className="space-y-2 rounded-lg bg-muted/50 p-4">
          <Label htmlFor="utility">Connecting utility</Label>
          <Combobox items={utilities} defaultValue="Toronto Hydro">
            <ComboboxInput id="utility" placeholder="Search utilities…" />
            <ComboboxContent>
              <ComboboxEmpty>No utilities found.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        <div className="flex flex-col gap-2">
          <Button>Connect Toronto Hydro</Button>
          <Button variant="outline">Cancel</Button>
        </div>

        <Separator />

        <p className="text-sm text-muted-foreground">
          You can revoke this access any time from Settings, then Utility
          connections. Revoking disconnects Toronto Hydro within a minute.
        </p>
      </CardContent>
    </Card>
  )
}
