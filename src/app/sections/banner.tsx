"use client"

// Content for the "banner" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const BannerDemo = React.lazy(() => import("@/components/demo/banner-demo").then((m) => ({ default: m.BannerDemo })));

const BannerActionDemo = React.lazy(() => import("@/components/demo/banner-action-demo").then((m) => ({ default: m.BannerActionDemo })));

const BannerFloatingDemo = React.lazy(() => import("@/components/demo/banner-floating-demo").then((m) => ({ default: m.BannerFloatingDemo })));

const content = {
  variants: [
      {
        id: "banner-simple",
        name: "Simple centered",
        description: "A centered announcement with an inline link.",
        preview: <BannerDemo />,
        source: dm("banner-demo"),
      },
      {
        id: "banner-action",
        name: "With action",
        description: "A promotional banner with a call-to-action button.",
        preview: <BannerActionDemo />,
        source: dm("banner-action-demo"),
      },
      {
        id: "banner-floating",
        name: "Floating",
        description: "A pill-shaped banner pinned to the bottom of the viewport.",
        preview: <BannerFloatingDemo />,
        source: dm("banner-floating-demo"),
      },
    ],
};

export default content;
