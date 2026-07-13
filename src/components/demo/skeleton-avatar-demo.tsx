import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonAvatarDemo() {
  return (
    <div className="flex items-center gap-4 sm:max-w-sm">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}
