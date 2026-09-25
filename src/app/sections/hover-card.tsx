// Content for the "hover-card" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const HoverCardDemo = React.lazy(() => import("@/components/demo/hover-card-demo").then((m) => ({ default: m.HoverCardDemo })));

const HoverCardReferenceDemo = React.lazy(() => import("@/components/demo/hover-card-reference-demo").then((m) => ({ default: m.HoverCardReferenceDemo })));

const HoverCardStatsDemo = React.lazy(() => import("@/components/shadcn-studio/tooltip/tooltip-12"));

const HoverCardProjectDemo = React.lazy(() => import("@/components/shadcn-studio/tooltip/tooltip-13"));

const HoverCardTasksDemo = React.lazy(() => import("@/components/shadcn-studio/tooltip/tooltip-15"));

const content = {
  variants: [
      {
        id: "hover-card-table",
        name: "In a dense table",
        description: "The row keeps the primary value; the breakdown that would need three more columns moves into the card.",
        preview: <HoverCardDemo />,
        source: dm("hover-card-demo"),
      },
      {
        id: "hover-card-reference",
        name: "On a reference",
        description: "An identifier in running text previews what it points at, without sending anyone to another page.",
        preview: <HoverCardReferenceDemo />,
        source: dm("hover-card-reference-demo"),
      },
      {
        id: "hover-card-stats",
        name: "Stats",
        description: "A rich hover card surfacing key metrics at a glance.",
        preview: <HoverCardStatsDemo />,
        source: ss("tooltip/tooltip-12"),
      },
      {
        id: "hover-card-project",
        name: "Project",
        description: "Preview project details without leaving the page.",
        preview: <HoverCardProjectDemo />,
        source: ss("tooltip/tooltip-13"),
      },
      {
        id: "hover-card-tasks",
        name: "Tasks",
        description: "Show a summary task list on hover.",
        preview: <HoverCardTasksDemo />,
        source: ss("tooltip/tooltip-15"),
      },
    ],
};

export default content;
