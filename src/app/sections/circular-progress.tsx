"use client"

// Content for the "circular-progress" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const CircularProgressDemo = React.lazy(() => import("@/components/shadcn-studio/progress/progress-23"));

const content = {
  variants: [
      {
        id: "circular-progress-default",
        name: "Ring with value",
        description: "A determinate ring for a single figure that has a ceiling — a meter's share of its site total, a job's completion.",
        preview: <CircularProgressDemo />,
        source: ss("progress/progress-23"),
      },
    ],
};

export default content;
