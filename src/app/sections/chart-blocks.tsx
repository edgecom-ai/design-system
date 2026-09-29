// Content for the "chart-blocks" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const ChartLiveDemandDemo = React.lazy(() => import("@/components/demo/chart-live-demand-demo").then((m) => ({ default: m.ChartLiveDemandDemo })));

const ChartDailyConsumptionDemo = React.lazy(() => import("@/components/demo/chart-daily-consumption-demo").then((m) => ({ default: m.ChartDailyConsumptionDemo })));

const ChartCostBreakdownDemo = React.lazy(() => import("@/components/demo/chart-cost-breakdown-demo").then((m) => ({ default: m.ChartCostBreakdownDemo })));

const ChartHourlyHeatmapDemo = React.lazy(() => import("@/components/demo/chart-hourly-heatmap-demo").then((m) => ({ default: m.ChartHourlyHeatmapDemo })));

const ChartTopContributorsDemo = React.lazy(() => import("@/components/demo/chart-top-contributors-demo").then((m) => ({ default: m.ChartTopContributorsDemo })));

const ChartEventWindowDemo = React.lazy(() => import("@/components/demo/chart-event-window-demo").then((m) => ({ default: m.ChartEventWindowDemo })));

const ChartGaugeDemo = React.lazy(() => import("@/components/demo/chart-gauge-demo").then((m) => ({ default: m.ChartGaugeDemo })));

const content = {
  variants: [
      {
        id: "chart-power-demand",
        name: "Multi-series line",
        description:
          "The full header: a multi-select for the devices plotted (each with its swatch and latest reading), range presets with a compact range calendar, statistical overlays, smooth/step, and export. Overlay values read in the centered legend. Clearing every device shows an empty state, not a blank plot.",
        preview: <ChartLiveDemandDemo />,
        source: dm("chart-live-demand-demo"),
      },
      {
        id: "chart-daily-consumption",
        name: "Bar with trend",
        description:
          "One bar per day in the metric's commodity colour, with period average, min/max and a trend line as overlays. Bars size to the density — a week is capped wide, and three months buckets by week instead of shrinking into slivers. No smooth/step toggle: that belongs to line and area charts.",
        preview: <ChartDailyConsumptionDemo />,
        source: dm("chart-daily-consumption-demo"),
      },
      {
        id: "chart-bill-breakdown",
        name: "Stacked bars",
        description:
          "Monthly charges stacked by line item, rounded only on the topmost segment. Monthly data takes the month-range picker behind the same presets. Switching to consumption swaps the stack for a single electricity series.",
        preview: <ChartCostBreakdownDemo />,
        source: dm("chart-cost-breakdown-demo"),
      },
      {
        id: "chart-hourly-heatmap",
        name: "Heat map",
        description:
          "Day × hour intensity on one commodity's sequential ramp, with a centered scale legend and each cell's reading in a tooltip. Dark mode runs the ramp the other way, so low readings sink into the card and the peak stays brightest. The grid scrolls inside its own container on a narrow screen.",
        preview: <ChartHourlyHeatmapDemo />,
        source: dm("chart-hourly-heatmap-demo"),
      },
      {
        id: "chart-top-contributors",
        name: "Ranked sparklines",
        description:
          "Devices ranked by their share of the latest month, each with a glanceable six-month sparkline. The list scrolls in place instead of stretching the card, and shares the metric selector every chart uses.",
        preview: <ChartTopContributorsDemo />,
        source: dm("chart-top-contributors-demo"),
      },
      {
        id: "chart-event-window",
        name: "Event window",
        description:
          "The reading around one alarm: the event sets the window, so the header carries only the export menu. Its one reference line is the threshold the alarm crossed — dashed and neutral, never red — and the active period is a neutral band.",
        preview: <ChartEventWindowDemo />,
        source: dm("chart-event-window-demo"),
      },
      {
        id: "chart-gauge",
        name: "Gauge",
        description:
          "A single figure against its ceiling. The ring takes a status tone only because the figure is judged against a target, and a badge says the same in words, so colour never carries it alone.",
        preview: <ChartGaugeDemo />,
        source: dm("chart-gauge-demo"),
      },
    ],
};

export default content;
