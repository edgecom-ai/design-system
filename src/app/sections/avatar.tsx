// Content for the "avatar" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const AvatarBasicDemo = React.lazy(() => import("@/components/demo/avatar-demo").then((m) => ({ default: m.AvatarBasicDemo })));

const AvatarGroupDemo = React.lazy(() => import("@/components/demo/avatar-demo").then((m) => ({ default: m.AvatarGroupDemo })));

const content = {
  variants: [
      {
        id: "avatar-default",
        name: "Image and fallback",
        description: "A photo with an initials fallback, beside a fallback-only avatar.",
        preview: <AvatarBasicDemo />,
        source: dm("avatar-demo"),
      },
      {
        id: "avatar-group",
        name: "Group with overflow",
        description: "Overlapping avatars with a trailing overflow count.",
        preview: <AvatarGroupDemo />,
        source: dm("avatar-demo"),
      },
    ],
};

export default content;
