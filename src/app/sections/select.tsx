"use client"

// Content for the "select" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const SelectWithOptionsGroupsDemo = React.lazy(() => import("@/components/shadcn-studio/select/select-22"));

const SelectSitesDemo = React.lazy(() => import("@/components/demo/select-sites-demo").then((m) => ({ default: m.SelectSitesDemo })));

const SelectCommodityDemo = React.lazy(() => import("@/components/demo/select-commodity-demo").then((m) => ({ default: m.SelectCommodityDemo })));

const SelectCommodityPlaceholderDemo = React.lazy(() => import("@/components/demo/select-commodity-placeholder-demo").then((m) => ({ default: m.SelectCommodityPlaceholderDemo })));

const content = {
  variants: [
      {
        id: "select-single",
        name: "Single value",
        description: "A single-value select styled to match the design system.",
        preview: <SelectCommodityDemo />,
        source: dm("select-commodity-demo"),
      },
      {
        id: "select-grouped-sites",
        name: "Grouped sites",
        description: "A styled select with options organized into groups.",
        preview: <SelectSitesDemo />,
        source: dm("select-sites-demo"),
      },
      {
        id: "select-placeholder",
        name: "With placeholder",
        description: "A select showing a placeholder until a value is chosen.",
        preview: <SelectCommodityPlaceholderDemo />,
        source: dm("select-commodity-placeholder-demo"),
      },
      {
        id: "select-option-groups",
        name: "Option groups",
        description: "A custom select with labelled option groups.",
        preview: <SelectWithOptionsGroupsDemo />,
        source: ss("select/select-22"),
      },
    ],
};

export default content;
