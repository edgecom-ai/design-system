// Content for the "radial-gauge" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const RadialGaugeDemo = React.lazy(() => import("@/components/demo/radial-gauge-demo").then((m) => ({ default: m.RadialGaugeDemo })));

const content = {
  variants: [
      {
        id: "radial-gauge-sizes",
        name: "Card and tile",
        description:
          "One figure against its ceiling: an arc on a 100-unit ring with a 10-unit stroke and a 15% track, both in `currentColor`. `card` is the gauge as a card's own content, with the figure and a caption in the centre; `tile` is the glanceable one in a list or a metric tile. The tone is the element's text colour — a status `-emphasis` token only when the figure is judged against a target, with a badge that says the same in words — and nothing for a neutral reading.",
        preview: <RadialGaugeDemo />,
        source: dm("radial-gauge-demo"),
      },
    ],
};

export default content;
