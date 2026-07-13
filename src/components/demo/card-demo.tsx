import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function CardDemo() {
  return (
    <Card className="sm:max-w-sm">
      <CardHeader>
        <CardTitle>Peak demand alert</CardTitle>
        <CardDescription>Facility exceeded its target this hour.</CardDescription>
        <CardAction>
          <Button size="icon-sm" variant="ghost" aria-label="Dismiss">
            <Trash2 />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Current load is 1.24 MW against a 1.10 MW threshold. Review the load profile to avoid
        demand charges.
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">View profile</Button>
        <Button size="sm" variant="outline">
          Snooze
        </Button>
      </CardFooter>
    </Card>
  )
}
