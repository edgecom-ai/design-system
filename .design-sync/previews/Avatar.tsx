// Avatar preview — docs demos for the basic and group stories; the size sweep
// and presence badge are composed here.
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
import { CheckIcon } from "lucide-react"

export { AvatarBasicDemo as Basic, AvatarGroupDemo as Group } from "@/components/demo/avatar-demo"

export function Sizes() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>BN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>BN</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>BN</AvatarFallback>
      </Avatar>
    </div>
  )
}

export function WithBadge() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>TO</AvatarFallback>
        <AvatarBadge className="bg-success" />
      </Avatar>
      <Avatar>
        <AvatarFallback>TO</AvatarFallback>
        <AvatarBadge className="bg-success" />
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>TO</AvatarFallback>
        <AvatarBadge>
          <CheckIcon />
        </AvatarBadge>
      </Avatar>
    </div>
  )
}

export function GroupSizes() {
  return (
    <div className="flex flex-col gap-4">
      <AvatarGroup>
        <Avatar size="sm"><AvatarFallback>BN</AvatarFallback></Avatar>
        <Avatar size="sm"><AvatarFallback>TO</AvatarFallback></Avatar>
        <Avatar size="sm"><AvatarFallback>KR</AvatarFallback></Avatar>
        <AvatarGroupCount>+5</AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar size="lg"><AvatarFallback>BN</AvatarFallback></Avatar>
        <Avatar size="lg"><AvatarFallback>TO</AvatarFallback></Avatar>
        <Avatar size="lg"><AvatarFallback>KR</AvatarFallback></Avatar>
        <AvatarGroupCount>+5</AvatarGroupCount>
      </AvatarGroup>
    </div>
  )
}
