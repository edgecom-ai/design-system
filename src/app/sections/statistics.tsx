// Content for the "statistics" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const StatMetricTilesDemo = React.lazy(() => import("@/components/demo/stat-metric-tiles-demo").then((m) => ({ default: m.StatMetricTilesDemo })));

const StatTrendCardsDemo = React.lazy(() => import("@/components/demo/stat-trend-cards-demo").then((m) => ({ default: m.StatTrendCardsDemo })));

const StatDayStatusDemo = React.lazy(() => import("@/components/demo/stat-day-status-demo").then((m) => ({ default: m.StatDayStatusDemo })));

const StatPerformanceDemo = React.lazy(() => import("@/components/demo/stat-performance-demo").then((m) => ({ default: m.StatPerformanceDemo })));

const StatForecastStripDemo = React.lazy(() => import("@/components/demo/stat-forecast-strip-demo").then((m) => ({ default: m.StatForecastStripDemo })));

const StatFactStripDemo = React.lazy(() => import("@/components/demo/stat-fact-strip-demo").then((m) => ({ default: m.StatFactStripDemo })));

const StatSummaryListDemo = React.lazy(() => import("@/components/demo/stat-summary-list-demo").then((m) => ({ default: m.StatSummaryListDemo })));

const content = {
  variants: [
      {
        id: "stats-metric-tiles",
        name: "Metric tiles",
        description:
          "One figure per tile: an uppercase label, an icon chip, the value with its unit. Only the figures a reader acts on take a tone — here the headline revenue and on-time delivery.",
        preview: <StatMetricTilesDemo />,
        source: dm("stat-metric-tiles-demo"),
      },
      {
        id: "stats-kpi-trend",
        name: "KPI with trend",
        description:
          "The latest month per channel, a trend badge against the month before and a six-month mini chart with its average dashed. The trend badge stays `info` whichever way it points — a rise or a fall is information, not a verdict.",
        preview: <StatTrendCardsDemo />,
        source: dm("stat-trend-cards-demo"),
      },
      {
        id: "stats-day-status",
        name: "Day status tiles",
        description:
          "Today and tomorrow at a glance: a status badge with its dot, the state, the time that matters and what to do next. Acting on a tile confirms with a toast — success when it's done, warning when it's put off.",
        preview: <StatDayStatusDemo />,
        source: dm("stat-day-status-demo"),
      },
      {
        id: "stats-performance",
        name: "Performance gauge",
        description:
          "Progress toward a goal as a compact ring, with a two-item legend beside it and detail rows underneath.",
        preview: <StatPerformanceDemo />,
        source: dm("stat-performance-demo"),
      },
      {
        id: "stats-forecast-strip",
        name: "Forecast strip",
        description:
          "A rail of day tiles that scrolls inside itself, each with a small chance gauge. A likely-rain day is tinted in the info tone and says so in words as well.",
        preview: <StatForecastStripDemo />,
        source: dm("stat-forecast-strip-demo"),
      },
      {
        id: "stats-fact-strip",
        name: "Fact strip",
        description:
          "A subscription's headline facts in one wrapping row, keyed to the workspace picked on the left. Every figure stays neutral, the amount due included.",
        preview: <StatFactStripDemo />,
        source: dm("stat-fact-strip-demo"),
      },
      {
        id: "stats-summary-list",
        name: "Summary list",
        description:
          "Short label/value lists for a side column, with the figures lined up on the right.",
        preview: <StatSummaryListDemo />,
        source: dm("stat-summary-list-demo"),
      },
    ],
};

export default content;
