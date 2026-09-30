import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"

export function AvatarBasicDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage
          src="https://design.edgecom.ai/demo/avatars/avatar-1.png"
          alt="Jordan Ng"
        />
        <AvatarFallback>JN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>PS</AvatarFallback>
      </Avatar>
    </div>
  )
}

export function AvatarGroupDemo() {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarImage
          src="https://design.edgecom.ai/demo/avatars/avatar-1.png"
          alt="Jordan Ng"
        />
        <AvatarFallback>JN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>PS</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>MR</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  )
}
