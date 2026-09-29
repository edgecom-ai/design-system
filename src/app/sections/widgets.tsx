// Content for the "widgets" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const WidgetSupportInboxDemo = React.lazy(() => import("@/components/demo/widget-support-inbox-demo").then((m) => ({ default: m.WidgetSupportInboxDemo })));

const WidgetTopProductsDemo = React.lazy(() => import("@/components/demo/widget-top-products-demo").then((m) => ({ default: m.WidgetTopProductsDemo })));

const ProductInsightsCard = React.lazy(() => import("@/components/shadcn-studio/blocks/widget-product-insights"));

const content = {
  variants: [
      {
        id: "widget-activity",
        name: "Activity feed",
        description:
          "A feed with its count, a search field and a priority filter in the header, and entries that carry a priority badge, a meta line and the message — the details behind each entry sit in a hover card. A search with no match offers to clear the filters.",
        preview: <WidgetSupportInboxDemo />,
        source: dm("widget-support-inbox-demo"),
      },
      {
        id: "widget-top-products",
        name: "Top-N table",
        description:
          "The period's top rows with a period select in the card header. Numbers align right on tabular figures, the edge cells sit on the card's content line, and picking a row's name selects it.",
        preview: <WidgetTopProductsDemo />,
        source: dm("widget-top-products-demo"),
      },
      {
        id: "widget-insights",
        name: "Product insights",
        description: "A summary card combining a headline figure, a breakdown and a short list.",
        preview: <ProductInsightsCard className="w-full max-w-md" />,
        source: ss("blocks/widget-product-insights"),
      },
    ],
};

export default content;
