// Content for the "native-select" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const NativeSelectDemo = React.lazy(() => import("@/components/demo/native-select-demo").then((m) => ({ default: m.NativeSelectDemo })));

const content = {
  variants: [
      {
        id: "native-select-default",
        name: "Sizes and states",
        description: "The platform control, styled to match the design system. Two sizes, option groups, and the same invalid and disabled treatment as the text input.",
        preview: <NativeSelectDemo />,
        source: dm("native-select-demo"),
      },
    ],
};

export default content;
