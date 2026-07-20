"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={() =>
          toast("Report scheduled", {
            description: "Weekly demand report will send Mondays at 8 AM.",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.success("Meter connected", {
            description: "M-204 at Toronto DC is now reporting interval data.",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning("Approaching peak", {
            description: "Calgary Plant is within 5% of its demand threshold.",
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("Sync failed", {
            description: "Meter M-118 did not respond. Retrying…",
          })
        }
      >
        Error
      </Button>
    </div>
  )
}
