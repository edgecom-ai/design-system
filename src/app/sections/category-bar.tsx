// Content for the "category-bar" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const CategoryBarDemo = React.lazy(() => import("@/components/demo/category-bar-demo").then((m) => ({ default: m.CategoryBarDemo })));

const content = {
  variants: [
      {
        id: "category-bar-usage",
        name: "Budget usage",
        description: "Commodity-mix segments with a marker at current budget usage.",
        preview: <CategoryBarDemo />,
        source: dm("category-bar-demo"),
      },
    ],
};

export default content;
