// Dialog preview — rendered OPEN so the card shows the dialog itself, not a
// trigger button. Short create/confirm flows; longer forms go to a Sheet.
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function CreateShortForm() {
  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a meter</DialogTitle>
          <DialogDescription>It appears on the site dashboard as soon as its first interval arrives.</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="dlg-serial">Serial number</FieldLabel>
            <Input id="dlg-serial" placeholder="MTR-0000-0000" />
          </Field>
          <Field>
            <FieldLabel htmlFor="dlg-label">Label</FieldLabel>
            <Input id="dlg-label" defaultValue="Chiller plant — incomer" />
            <FieldDescription>Shown in tables and alarms instead of the serial.</FieldDescription>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button>Add meter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
