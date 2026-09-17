"use client"

// Content for the "breadcrumb" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const BreadcrumbWithDropdownDemo = React.lazy(() => import("@/components/shadcn-studio/breadcrumb/breadcrumb-06"));

const content = {
  variants: [
      {
        id: "breadcrumb-dropdown",
        name: "With dropdown",
        description: "A breadcrumb that collapses middle levels into a menu.",
        preview: <BreadcrumbWithDropdownDemo />,
        source: ss("breadcrumb/breadcrumb-06"),
      },
    ],
};

export default content;
