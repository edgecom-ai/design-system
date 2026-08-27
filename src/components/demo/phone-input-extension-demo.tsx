"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"

export function PhoneInputExtensionDemo() {
  const [phone, setPhone] = React.useState("")
  const [extension, setExtension] = React.useState("")

  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="site-contact">Site contact number</Label>
      <PhoneInput
        id="site-contact"
        placeholder="Enter site contact number"
        value={phone}
        onChange={setPhone}
        extension={extension}
        onExtensionChange={setExtension}
      />
      <p className="text-body text-muted-foreground">
        The extension stays its own value — E.164 has no slot for one, so it
        would be dropped from the number the field emits.
      </p>
    </div>
  )
}
