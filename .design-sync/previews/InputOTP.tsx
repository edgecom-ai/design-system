// InputOTP preview — one-time-code entry. Rendered with a value so the slots
// show filled digits, plus the separated, disabled and invalid shapes.
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"

export { default as FourDigit } from "@/components/shadcn-studio/input-otp/input-otp-01"

export function SixDigitWithSeparator() {
  return (
    <div className="space-y-3">
      <Label htmlFor="otp-six">Enter the code we texted you</Label>
      <InputOTP id="otp-six" maxLength={6} value="4821">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-body-sm text-muted-foreground">Sent to the number ending in 0417.</p>
    </div>
  )
}

export function Disabled() {
  return (
    <div className="space-y-3">
      <Label htmlFor="otp-disabled">Verification code</Label>
      <InputOTP id="otp-disabled" maxLength={6} value="731" disabled>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}

export function Invalid() {
  return (
    <div className="space-y-3">
      <Label htmlFor="otp-invalid">Verification code</Label>
      <InputOTP id="otp-invalid" maxLength={6} value="990012">
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTPSlot key={i} index={i} aria-invalid />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <p className="text-body-sm text-destructive">That code has expired. Request a new one.</p>
    </div>
  )
}
