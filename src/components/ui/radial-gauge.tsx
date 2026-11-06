import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// The portal's radial gauge: one figure against its ceiling, drawn as an arc
// on a 100-unit viewBox with a 10-unit stroke, so the ring scales with the
// element and the stroke stays a tenth of it at every size. The track is the
// same colour at 15%, so the ring reads as one hue, and both take
// `currentColor`: the tone is the element's text colour — `text-success-emphasis`
// for a figure that met its target, `text-warning-emphasis` for one short of it,
// nothing for a neutral reading — so it follows the theme and the status
// semantics, and a badge beside it says the same thing in words.
const RADIUS = 45
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// `card` is the gauge as a card's own content; `tile` the glanceable one in a
// metric tile or a table row, with the figure alone in the centre.
const radialGaugeVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center",
  {
    variants: {
      size: {
        card: "size-44",
        tile: "size-16",
      },
    },
    defaultVariants: {
      size: "card",
    },
  }
)

// The figure's type step per size — a lookup, not a second cva, so the
// contract reads one `size` axis.
const VALUE_TYPE = {
  card: "text-display",
  tile: "text-body-sm font-medium",
} as const

function RadialGauge({
  className,
  size,
  value,
  label,
  children,
  "aria-label": ariaLabel,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof radialGaugeVariants> & {
    /** The figure, 0–100. */
    value: number
    /** A caption under the figure — "of target", "received". Shown at `card` size. */
    label?: React.ReactNode
    /** Replaces the centre entirely. */
    children?: React.ReactNode
  }) {
  const percent = Math.min(Math.max(value, 0), 100)
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE

  return (
    <div
      data-slot="radial-gauge"
      data-size={size ?? "card"}
      role="img"
      aria-label={ariaLabel ?? `${Math.round(percent)}%`}
      className={cn(radialGaugeVariants({ size }), className)}
      {...props}
    >
      <svg
        data-slot="radial-gauge-ring"
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="size-full -rotate-90"
      >
        <circle
          data-slot="radial-gauge-track"
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="opacity-15"
        />
        <circle
          data-slot="radial-gauge-value"
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div
        data-slot="radial-gauge-label"
        className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center"
      >
        {children ?? (
          <>
            <span className={cn("text-foreground tabular-nums", VALUE_TYPE[size ?? "card"])}>
              {Math.round(percent)}%
            </span>
            {label != null && size !== "tile" ? (
              <span className="text-caption text-muted-foreground">{label}</span>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

export { RadialGauge, radialGaugeVariants }
