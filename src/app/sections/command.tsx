"use client"

// Content for the "command" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const CommandDemo = React.lazy(() => import("@/components/demo/command-demo").then((m) => ({ default: m.CommandDemo })));

const content = {
  variants: [
      {
        id: "command-palette",
        name: "Command menu",
        description: "A filterable list of navigation targets and actions with shortcuts.",
        preview: <CommandDemo />,
        source: dm("command-demo"),
      },
    ],
};

export default content;
