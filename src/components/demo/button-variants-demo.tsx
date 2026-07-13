import { Button } from "@/components/ui/button"

export function ButtonVariantsDemo() {
  return (
    <div className="flex flex-col gap-4">
      {/* Neutral variants */}
      <div className="flex flex-wrap gap-3">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>

      {/* Solid semantic fills */}
      <div className="flex flex-wrap gap-3">
        <Button variant="destructive">Destructive</Button>
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="info">Info</Button>
      </div>

      {/* Subtle semantic tints */}
      <div className="flex flex-wrap gap-3">
        <Button variant="destructive-subtle">Destructive</Button>
        <Button variant="success-subtle">Success</Button>
        <Button variant="warning-subtle">Warning</Button>
        <Button variant="info-subtle">Info</Button>
      </div>
    </div>
  )
}
