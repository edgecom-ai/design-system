"use client"

// Content for the "slider" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const SliderWithTicksDemo = React.lazy(() => import("@/components/shadcn-studio/slider/slider-09"));

const SliderMultiThumbDemo = React.lazy(() => import("@/components/shadcn-studio/slider/slider-02"));

const SliderMultiTooltipDemo = React.lazy(() => import("@/components/shadcn-studio/slider/slider-12"));

const SliderBasicDemo = React.lazy(() => import("@/components/demo/slider-basic-demo").then((m) => ({ default: m.SliderBasicDemo })));

const content = {
  variants: [
      {
        id: "slider-default",
        name: "Default",
        description: "A single-value slider with a label.",
        preview: <SliderBasicDemo />,
        source: dm("slider-basic-demo"),
      },
      {
        id: "slider-ticks",
        name: "Performance mode with ticks",
        description: "A stepped slider with tick marks and labels.",
        preview: <SliderWithTicksDemo />,
        source: ss("slider/slider-09"),
      },
      {
        id: "slider-range",
        name: "Range and multi-thumb",
        description: "Multiple thumbs for selecting consumption bands and alert thresholds.",
        preview: <SliderMultiThumbDemo />,
        source: ss("slider/slider-02"),
      },
      {
        id: "slider-tooltip",
        name: "With value tooltips",
        description: "Thumbs surface their current value in a tooltip while dragging.",
        preview: <SliderMultiTooltipDemo />,
        source: ss("slider/slider-12"),
      },
    ],
};

export default content;
