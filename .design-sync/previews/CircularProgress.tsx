// CircularProgress preview — radial gauge for a single percentage.
import { CircularProgress } from "@/components/ui/circular-progress"

export { default as DashedTrackGauge } from "@/components/shadcn-studio/progress/progress-23"

export function Sizes() {
  return (
    <div className="flex items-end gap-6">
      <CircularProgress value={64} size={48} strokeWidth={5} progressClassName="text-primary" />
      <CircularProgress value={64} size={72} strokeWidth={7} progressClassName="text-primary" />
      <CircularProgress value={64} size={100} strokeWidth={10} showLabel progressClassName="text-primary" />
    </div>
  )
}

export function WithLabel() {
  return (
    <div className="flex items-center gap-8">
      <CircularProgress
        value={82}
        size={120}
        strokeWidth={10}
        showLabel
        progressClassName="text-primary"
        renderLabel={(v) => (
          <div className="flex flex-col items-center">
            <span className="text-title tabular-nums">{v}%</span>
            <span className="text-caption text-muted-foreground">of peak</span>
          </div>
        )}
      />
      <CircularProgress
        value={23}
        size={120}
        strokeWidth={10}
        showLabel
        progressClassName="text-warning"
        renderLabel={(v) => (
          <div className="flex flex-col items-center">
            <span className="text-title tabular-nums">{v}%</span>
            <span className="text-caption text-muted-foreground">budget</span>
          </div>
        )}
      />
    </div>
  )
}

export function Shapes() {
  return (
    <div className="flex items-center gap-8">
      <CircularProgress value={45} size={96} strokeWidth={12} shape="round" showLabel progressClassName="text-primary" />
      <CircularProgress value={45} size={96} strokeWidth={12} shape="square" showLabel progressClassName="text-primary" />
    </div>
  )
}

export function AnimatedVariant() {
  return (
    <div className="flex items-center gap-8">
      <CircularProgress value={68} size={120} variant="animated" showLabel strokeWidth={10} progressClassName="text-primary" />
      <CircularProgress
        value={91}
        size={120}
        variant="animated"
        showLabel
        strokeWidth={10}
        progressClassName="text-destructive"
      />
    </div>
  )
}
