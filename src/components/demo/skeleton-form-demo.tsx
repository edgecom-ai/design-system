import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// An "Edit meter" form while the meter's values load. The labels are known up
// front, so they render; only the values wait, each as a placeholder at its
// control's own 2rem height, so nothing moves when the form fills in.
function FieldPlaceholder({ label, tall = false }: { label: string; tall?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-body-sm font-medium">{label}</span>
      <Skeleton className={tall ? "h-16 w-full" : "h-8 w-full"} />
    </div>
  )
}

export function SkeletonFormDemo() {
  return (
    <Card className="w-full sm:max-w-sm" aria-busy="true">
      <span className="sr-only">Loading the meter</span>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <FieldPlaceholder label="Meter name" />
        <FieldPlaceholder label="Site" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldPlaceholder label="Commodity" />
          <FieldPlaceholder label="Unit" />
        </div>
        <FieldPlaceholder label="Notes" tall />
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Skeleton className="h-8 w-18" />
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  )
}
