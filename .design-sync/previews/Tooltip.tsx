// Tooltip preview — rendered OPEN. Short labels only (no interactive
// content). Side axis swept: top (default), bottom, right.
import { InfoIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function IconButtonTop() {
  return (
    <TooltipProvider>
      <div className="flex h-full items-center justify-center">
        <Tooltip open>
          <TooltipTrigger render={<Button variant="outline" size="icon" />}>
            <RefreshCwIcon />
          </TooltipTrigger>
          <TooltipContent>Refresh interval data</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export function LabelBottom() {
  return (
    <TooltipProvider>
      <div className="flex h-full items-start justify-center pt-8">
        <Tooltip open>
          <TooltipTrigger render={<Button variant="ghost" size="sm" />}>
            <InfoIcon /> Power factor
          </TooltipTrigger>
          <TooltipContent side="bottom">Ratio of real to apparent power · target ≥ 0.95</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export function ValueRight() {
  return (
    <TooltipProvider>
      <div className="flex h-full items-center pl-10">
        <Tooltip open>
          <TooltipTrigger render={<span className="cursor-default text-body-sm underline decoration-dotted underline-offset-3" />}>
            612 kW
          </TooltipTrigger>
          <TooltipContent side="right">Peak at 13:45 · Northridge Distribution Center</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
