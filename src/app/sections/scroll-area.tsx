"use client"

// Content for the "scroll-area" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const ScrollAreaDemo = React.lazy(() => import("@/components/demo/scroll-area-demo").then((m) => ({ default: m.ScrollAreaDemo })));

const content = {
  variants: [
      {
        id: "scroll-area-default",
        name: "Vertical scroll",
        description: "A fixed-height list that scrolls within its bounds.",
        preview: <ScrollAreaDemo />,
        source: dm("scroll-area-demo"),
      },
    ],
};

export default content;
