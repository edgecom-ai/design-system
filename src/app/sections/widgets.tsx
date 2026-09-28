// Content for the "widgets" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { StatBlock } from "./shared";

const ProductInsightsCard = React.lazy(() => import("@/components/shadcn-studio/blocks/widget-product-insights"));

const content = {
  node: (
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <StatBlock id="widget-insights" label="Product insights (component-02)">
          <ProductInsightsCard className="w-full" />
        </StatBlock>
      </div>
    ),
};

export default content;
