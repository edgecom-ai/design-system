"use client"

// Content for the "spinner" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const SpinnerDemo = React.lazy(() => import("@/components/demo/spinner-demo").then((m) => ({ default: m.SpinnerDemo })));

const content = {
  variants: [
      {
        id: "spinner-sizes",
        name: "Sizes and inline usage",
        description: "Spinner sizes and inline-with-text placement.",
        preview: <SpinnerDemo />,
        source: dm("spinner-demo"),
      },
    ],
};

export default content;
