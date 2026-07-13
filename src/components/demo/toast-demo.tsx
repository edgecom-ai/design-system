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
          toast.error("Sync failed", {
            description: "Meter M-118 did not respond. Retrying…",
          })
        }
      >
        Show error toast
      </Button>
    </div>
  )
}
