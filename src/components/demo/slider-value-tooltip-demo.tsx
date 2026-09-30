"use client"

import * as React from "react"

import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// Each thumb shows its value in a tooltip while the slider is in use —
// hovered, dragged or focused from the keyboard. The tooltip hangs from an
// anchor at the thumb's centre: Base UI centres a thumb on its value, so a
// `left` percentage is exact at every width, with no pixel offsets. The label
// row stands far enough above the track that an open tooltip never covers it.
function ValueSlider({
  label,
  min,
  max,
  step,
  defaultValue,
  format,
}: {
  label: string
  min: number
  max: number
  step: number
  defaultValue: number[]
  format: (value: number) => string
}) {
  const id = React.useId()
  const [value, setValue] = React.useState(defaultValue)
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [dragging, setDragging] = React.useState(false)

  React.useEffect(() => {
    if (!dragging) return
    const stop = () => setDragging(false)
    window.addEventListener("pointerup", stop)
    return () => window.removeEventListener("pointerup", stop)
  }, [dragging])

  const open = hovered || focused || dragging
  const percent = (v: number) => ((v - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-baseline justify-between gap-2">
        <span id={id} className="text-body-sm font-medium">
          {label}
        </span>
        <span className="text-body-sm text-muted-foreground tabular-nums">
          {value.map(format).join(" – ")}
        </span>
      </div>
      <div
        className="relative"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onPointerDown={() => setDragging(true)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {value.map((v, i) => (
          <Tooltip key={i} open={open}>
            <TooltipTrigger
              render={
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 size-0"
                  style={{ left: `${percent(v)}%` }}
                />
              }
            />
            <TooltipContent sideOffset={8}>{format(v)}</TooltipContent>
          </Tooltip>
        ))}
        <Slider
          aria-labelledby={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onValueChange={(next) => setValue(Array.isArray(next) ? [...next] : [next])}
        />
      </div>
    </div>
  )
}

const kilowatts = (v: number) => `${v.toLocaleString("en-US")} kW`
const percent = (v: number) => `${v}%`

export function SliderValueTooltipDemo() {
  return (
    <div className="flex w-full flex-col gap-8 sm:max-w-sm">
      <ValueSlider
        label="Demand alert band"
        min={0}
        max={2000}
        step={50}
        defaultValue={[600, 1400]}
        format={kilowatts}
      />
      <ValueSlider
        label="Battery reserve"
        min={10}
        max={90}
        step={5}
        defaultValue={[30]}
        format={percent}
      />
    </div>
  )
}
