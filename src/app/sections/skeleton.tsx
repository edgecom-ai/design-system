// Content for the "skeleton" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const SkeletonText = React.lazy(() => import("@/components/demo/skeleton-text-demo").then((m) => ({ default: m.SkeletonTextDemo })));

const SkeletonForm = React.lazy(() => import("@/components/demo/skeleton-form-demo").then((m) => ({ default: m.SkeletonFormDemo })));

const SkeletonAccordion = React.lazy(() => import("@/components/demo/skeleton-accordion-demo").then((m) => ({ default: m.SkeletonAccordionDemo })));

const SkeletonTable = React.lazy(() => import("@/components/demo/skeleton-table-demo").then((m) => ({ default: m.SkeletonTableDemo })));

const SkeletonWidgetsCards = React.lazy(() => import("@/components/demo/skeleton-stat-tiles-demo").then((m) => ({ default: m.SkeletonStatTilesDemo })));

const SkeletonAvatarDemo = React.lazy(() => import("@/components/demo/skeleton-avatar-demo").then((m) => ({ default: m.SkeletonAvatarDemo })));

const SkeletonAnimationDemo = React.lazy(() => import("@/components/demo/skeleton-animation-demo").then((m) => ({ default: m.SkeletonAnimationDemo })));

const content = {
  variants: [
      {
        id: "skeleton-avatar",
        name: "Avatar with lines",
        description: "A circular avatar placeholder beside text lines.",
        preview: <SkeletonAvatarDemo />,
        source: dm("skeleton-avatar-demo"),
      },
      {
        id: "skeleton-animation",
        name: "Animation",
        description:
          "The default pulse beside the shimmer variant and a static block. Pick one per screen so every placeholder on it moves the same way.",
        preview: <SkeletonAnimationDemo />,
        source: dm("skeleton-animation-demo"),
      },
      {
        id: "skeleton-text",
        name: "Text blocks",
        description: "A report summary while it loads: a title, a meta line, and two paragraphs whose last lines run short.",
        preview: <SkeletonText />,
        source: dm("skeleton-text-demo"),
      },
      {
        id: "skeleton-form",
        name: "Form",
        description: "An edit form while its values load: the labels render, and each control is a placeholder at its own height.",
        preview: <SkeletonForm />,
        source: dm("skeleton-form-demo"),
      },
      {
        id: "skeleton-accordion",
        name: "Accordion",
        description: "Grouped rows drawn as placeholders, the first group's body open — no controls until the data arrives.",
        preview: (
          <div className="w-full max-w-md">
            <SkeletonAccordion />
          </div>
        ),
        source: dm("skeleton-accordion-demo"),
      },
      {
        id: "skeleton-table",
        name: "Table",
        description: "Placeholder rows under the real column headers, so the table keeps its layout while it loads.",
        preview: <SkeletonTable />,
        source: dm("skeleton-table-demo"),
      },
      {
        id: "skeleton-widgets",
        name: "Widget cards",
        description: "Dashboard tiles with their labels in place and placeholders for the figures.",
        preview: <SkeletonWidgetsCards />,
        source: dm("skeleton-stat-tiles-demo"),
      },
    ],
};

export default content;
