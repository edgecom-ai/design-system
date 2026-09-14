import { Skeleton } from "@/components/ui/skeleton"

const animations = [
  { animation: "pulse", label: "Pulse (default)" },
  { animation: "shimmer", label: "Shimmer" },
  { animation: "none", label: "None" },
] as const

export function SkeletonAnimationDemo() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-3">
      {animations.map(({ animation, label }) => (
        <div key={animation} className="flex flex-col gap-3">
          <p className="text-caption text-muted-foreground">{label}</p>
          <div className="flex items-center gap-3">
            <Skeleton animation={animation} className="size-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton animation={animation} className="h-4 w-full" />
              <Skeleton animation={animation} className="h-4 w-2/3" />
            </div>
          </div>
          <Skeleton animation={animation} className="h-24 w-full rounded-xl" />
        </div>
      ))}
    </div>
  )
}
