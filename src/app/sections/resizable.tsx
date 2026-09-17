"use client"

// Content for the "resizable" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const ResizableDemo = React.lazy(() => import("@/components/demo/resizable-demo").then((m) => ({ default: m.ResizableDemo })));

const ResizableVerticalDemo = React.lazy(() => import("@/components/demo/resizable-vertical-demo").then((m) => ({ default: m.ResizableVerticalDemo })));

const content = {
  variants: [
      {
        id: "resizable-horizontal",
        name: "Horizontal panels",
        description: "A list pane and a detail pane split by a draggable handle.",
        preview: <ResizableDemo />,
        source: dm("resizable-demo"),
      },
      {
        id: "resizable-vertical",
        name: "Vertical panels",
        description: "Stacked panels resized along the vertical axis.",
        preview: <ResizableVerticalDemo />,
        source: dm("resizable-vertical-demo"),
      },
    ],
};

export default content;
