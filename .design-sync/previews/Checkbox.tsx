// Checkbox preview — the single boolean control. Docs demos cover the basic,
// described, grouped, card and indeterminate-tree stories; a composed cell
// sweeps the static states side by side.
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export { default as Basic } from "@/components/shadcn-studio/checkbox/checkbox-01"
export { default as WithDescription } from "@/components/shadcn-studio/checkbox/checkbox-07"
export { default as HorizontalGroup } from "@/components/shadcn-studio/checkbox/checkbox-08"
export { default as CardOption } from "@/components/shadcn-studio/checkbox/checkbox-13"
export { default as IndeterminateTree } from "@/components/shadcn-studio/checkbox/checkbox-15"

export function States() {
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-unchecked" />
        <Label htmlFor="cb-unchecked">Unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-checked" defaultChecked />
        <Label htmlFor="cb-checked">Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-indeterminate" indeterminate />
        <Label htmlFor="cb-indeterminate">Indeterminate</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-disabled" disabled />
        <Label htmlFor="cb-disabled">Disabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-disabled-checked" disabled defaultChecked />
        <Label htmlFor="cb-disabled-checked">Disabled, checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-invalid" aria-invalid />
        <Label htmlFor="cb-invalid" className="text-destructive">
          Invalid — you must accept the tariff terms
        </Label>
      </div>
    </div>
  )
}
