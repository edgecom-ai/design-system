// Item preview — shadcn-studio list demos that use Item, plus the variant/size sweep.
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GaugeIcon, TriangleAlertIcon } from "lucide-react"

export { default as OutlineWithSwitch } from "@/components/shadcn-studio/list/list-02"
export { default as LinkListExtraSmall } from "@/components/shadcn-studio/list/list-06"

const variants = ["default", "outline", "muted"] as const
const sizes = ["default", "sm", "xs"] as const

export function Variants() {
  return (
    <ItemGroup className="w-full max-w-sm">
      {variants.map((v) => (
        <Item key={v} variant={v}>
          <ItemMedia variant="icon">
            <GaugeIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Northridge Distribution Center</ItemTitle>
            <ItemDescription>variant=&quot;{v}&quot; · 1,480 kW peak</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="secondary">Normal</Badge>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}

export function Sizes() {
  return (
    <ItemGroup className="w-full max-w-sm">
      {sizes.map((s) => (
        <Item key={s} variant="outline" size={s}>
          <ItemMedia variant="icon">
            <TriangleAlertIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Demand threshold exceeded</ItemTitle>
            <ItemDescription>size=&quot;{s}&quot; · Harbourview Cold Storage · 14:45</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Acknowledge
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}
