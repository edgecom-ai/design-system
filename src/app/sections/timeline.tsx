// Content for the "timeline" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const TimelineDemo = React.lazy(() => import("@/components/demo/timeline-demo").then((m) => ({ default: m.TimelineDemo })));

const content = {
  variants: [
      {
        id: "timeline-activity",
        name: "Site activity",
        description: "Completed, in-progress, and pending events with status dots.",
        preview: <TimelineDemo />,
        source: dm("timeline-demo"),
      },
    ],
};

export default content;
