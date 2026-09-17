// PhoneInput preview — country picker + formatted number, optional extension.
import { PhoneInput } from "@/components/ui/phone-input"
import { Label } from "@/components/ui/label"

export { default as WithLabel } from "@/components/shadcn-studio/phone-input/phone-input-02"
export { PhoneInputExtensionDemo as WithExtension } from "@/components/demo/phone-input-extension-demo"

export function FilledValue() {
  return (
    <div className="w-full max-w-sm space-y-1.5">
      <Label htmlFor="pi-filled">On-call engineer</Label>
      <PhoneInput id="pi-filled" defaultCountry="US" value="+14155550142" onChange={() => {}} />
      <p className="text-body-sm text-muted-foreground">Bianca Ngan — Northridge Distribution Center</p>
    </div>
  )
}

export function Sizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <PhoneInput variant="sm" defaultCountry="CA" placeholder="Small" />
      <PhoneInput variant="default" defaultCountry="CA" placeholder="Default" />
      <PhoneInput variant="lg" defaultCountry="CA" placeholder="Large" />
    </div>
  )
}

export function DisabledAndInvalid() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="pi-disabled">Disabled</Label>
        <PhoneInput id="pi-disabled" defaultCountry="US" value="+14155550142" onChange={() => {}} disabled />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="pi-invalid">Invalid</Label>
        <PhoneInput id="pi-invalid" defaultCountry="US" value="+1415555" onChange={() => {}} aria-invalid />
        <p className="text-body-sm text-destructive">Enter a complete number, including area code.</p>
      </div>
    </div>
  )
}
