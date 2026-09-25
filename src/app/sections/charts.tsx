// Content for the "charts" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const ChartLegacyPaletteDemo = React.lazy(() => import("@/components/demo/chart-legacy-palette-demo").then((m) => ({ default: m.ChartLegacyPaletteDemo })));

const ChartRampDemo = React.lazy(() => import("@/components/demo/chart-ramp-demo").then((m) => ({ default: m.ChartRampDemo })));

const content = {
  variants: [
      {
        id: "chart-ramp",
        name: "Categorical & tint ramps",
        description:
          "One hue per commodity for categorical series, plus 100–900 tint ramps for sequential shading.",
        preview: <ChartRampDemo />,
        source: dm("chart-ramp-demo"),
      },
      {
        id: "chart-legacy-palette",
        name: "Legacy line palette — migration only",
        description:
          "The plot-line hues operators already read existing plots by, kept only so a product porting those plots can delete its literals. Twelve hues named by colour and tuned to 3:1 on card in both themes, with the peak-rank aliases and peak-window bands. Never for a new feature: new charts take the commodity ramp above.",
        preview: <ChartLegacyPaletteDemo />,
        source: dm("chart-legacy-palette-demo"),
      },
    ],
};

export default content;
