"use client"

// Content for the "card" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const CardDemo = React.lazy(() => import("@/components/demo/card-demo").then((m) => ({ default: m.CardDemo })));

const CardBottomImageDemo = React.lazy(() => import("@/components/shadcn-studio/card/card-04"));

const CardTopImageDemo = React.lazy(() => import("@/components/shadcn-studio/card/card-05"));

const CardHorizontalDemo = React.lazy(() => import("@/components/shadcn-studio/card/card-06"));

const CardWithTabsDemo = React.lazy(() => import("@/components/shadcn-studio/card/card-10"));

const content = {
  variants: [
      {
        id: "card-default",
        name: "Header, content, and footer actions",
        description: "A complete card with title, body, and footer buttons.",
        preview: <CardDemo />,
        source: dm("card-demo"),
      },
      {
        id: "card-bottom-image",
        name: "Bottom image",
        description: "A site card with a banner image below the header.",
        preview: <CardBottomImageDemo />,
        source: ss("card/card-04"),
      },
      {
        id: "card-top-image",
        name: "Top image with actions",
        description: "A report card led by a banner image, with footer actions.",
        preview: <CardTopImageDemo />,
        source: ss("card/card-05"),
      },
      {
        id: "card-horizontal",
        name: "Horizontal",
        description: "A side-by-side layout pairing an image with content and a call to action.",
        preview: <CardHorizontalDemo />,
        source: ss("card/card-06"),
      },
      {
        id: "card-tabs",
        name: "With tabs",
        description: "A card whose content is organized into inline tabs.",
        preview: <CardWithTabsDemo />,
        source: ss("card/card-10"),
      },
    ],
};

export default content;
