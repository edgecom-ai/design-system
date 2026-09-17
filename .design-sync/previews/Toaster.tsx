// Toaster preview — the root is the mounted <Toaster />; toasts are fired
// from a useEffect so the card shows them. Type axis: default, success,
// warning, error (rich colours mapped to the DS status tokens).
import * as React from "react"
import { toast } from "edgecom-design-system"

import { Toaster } from "@/components/ui/sonner"

export function StatusToasts() {
  React.useEffect(() => {
    toast("Report scheduled", {
      description: "Weekly demand report sends Mondays at 08:00.",
      action: { label: "Undo", onClick: () => {} },
      duration: Infinity,
    })
    toast.success("Meter connected", {
      description: "MTR-2041-0087 at Northridge Distribution Center is reporting interval data.",
      duration: Infinity,
    })
    toast.warning("Approaching peak", {
      description: "Harbor Point Cold Storage is within 5% of its demand threshold.",
      duration: Infinity,
    })
    toast.error("Sync failed", {
      description: "Meter MTR-1180-0022 did not respond. Retrying…",
      duration: Infinity,
    })
  }, [])
  return <Toaster expand position="top-right" />
}

export function TopCenterStacked() {
  React.useEffect(() => {
    toast.success("Tariff saved", {
      description: "Peak weekday rate applies from 1 Nov.",
      duration: Infinity,
    })
    toast("Exporting 14 meters", {
      description: "CSV will download when ready.",
      duration: Infinity,
    })
  }, [])
  return <Toaster position="top-center" />
}
