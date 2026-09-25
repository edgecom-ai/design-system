// Content for the "page-header" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const PageHeaderDemo = React.lazy(() => import("@/components/shadcn-studio/blocks/page-header/page-header-demo"));

const PageHeaderTabsDemo = React.lazy(() => import("@/components/shadcn-studio/blocks/page-header/page-header-tabs"));

const PageHeaderToolbarDemo = React.lazy(() => import("@/components/shadcn-studio/blocks/page-header/page-header-toolbar"));

const content = {
  variants: [
      {
        id: "page-header-default",
        name: "Breadcrumb + title",
        description:
          "The baseline every page should have: an ancestor breadcrumb above the H1. Any crumb can carry a dropdown (here 'Downtown Plant') for switching between sibling pages.",
        preview: <PageHeaderDemo />,
        source: ss("blocks/page-header/page-header-demo"),
      },
      {
        id: "page-header-tabs",
        name: "Breadcrumb + title + tabs",
        description:
          "Adds a tab row beneath the title for switching between views of the same resource.",
        preview: <PageHeaderTabsDemo />,
        source: ss("blocks/page-header/page-header-tabs"),
      },
      {
        id: "page-header-toolbar",
        name: "Breadcrumb + title + tabs + toolbar",
        description:
          "The full pattern: also a right-aligned toolbar with an 'updated' meta, a date-range picker, export, and a primary action.",
        preview: <PageHeaderToolbarDemo />,
        source: ss("blocks/page-header/page-header-toolbar"),
      },
    ],
};

export default content;
