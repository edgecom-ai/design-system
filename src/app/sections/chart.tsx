// Content for the "chart" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const ChartHeaderDemo = React.lazy(() => import("@/components/demo/chart-header-demo").then((m) => ({ default: m.ChartHeaderDemo })));

const content = {
  variants: [
      {
        id: "chart-canonical-header",
        name: "The chart header",
        description:
          "Every chart card is laid out the same way. `CardHeader` carries the title and its last-updated line; `CardAction` carries, in order, the primary action, the two-state overlay `Toggle`, the connected range presets with the compact range calendar, and the export menu — every control at `size=\"default\"`. In `CardContent`, the axis caption reads above the plot as `text-caption`, the time-zone line under it, the legend is centred, and the threshold strip closes the card. `ChartContainer` applies the chart theme — `chart-grid`, `chart-axis-label`, `chart-reference` — so a Recharts plot here and a plot drawn by another library read the same tokens.",
        preview: <ChartHeaderDemo />,
        source: dm("chart-header-demo"),
      },
    ],
};

export default content;
