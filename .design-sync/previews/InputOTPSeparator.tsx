// A part: only truthful inside its parent — the six-digit OTP with a group separator.
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"

export function InsideInputOTP() {
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
