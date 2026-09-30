// Content for the "progress" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const ProgressLinearDemo = React.lazy(() => import("@/components/demo/progress-linear-demo").then((m) => ({ default: m.ProgressLinearDemo })));

const ProgressShapeDemo = React.lazy(() => import("@/components/demo/progress-formatted-demo").then((m) => ({ default: m.ProgressFormattedDemo })));

const ProgressChecklistDemo = React.lazy(() => import("@/components/shadcn-studio/progress/progress-14"));

const content = {
  variants: [
      {
        id: "progress-linear",
        name: "Linear",
        description: "A horizontal determinate progress bar.",
        preview: <ProgressLinearDemo />,
        source: dm("progress-linear-demo"),
      },
      {
        id: "progress-shapes",
        name: "Formatted values",
        description: "A label and a value formatted for the measure — a percentage, kilowatts against a contracted maximum, dollars against a budget.",
        preview: (
          <div className="sm:max-w-sm">
            <ProgressShapeDemo />
          </div>
        ),
        source: dm("progress-formatted-demo"),
      },
      {
        id: "progress-checklist",
        name: "Checklist (interactive)",
        description: "Progress that advances as checklist items complete.",
        preview: (
          <div className="sm:max-w-sm">
            <ProgressChecklistDemo />
          </div>
        ),
        source: ss("progress/progress-14"),
      },
    ],
};

export default content;
