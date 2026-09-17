"use client"

// Content for the "skeleton" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const SkeletonText = React.lazy(() => import("@/components/shadcn-studio/skeleton/skeleton-02"));

const SkeletonForm = React.lazy(() => import("@/components/shadcn-studio/skeleton/skeleton-04"));

const SkeletonAccordion = React.lazy(() => import("@/components/shadcn-studio/skeleton/skeleton-07"));

const SkeletonTable = React.lazy(() => import("@/components/shadcn-studio/skeleton/skeleton-11"));

const SkeletonWidgetsCards = React.lazy(() => import("@/components/shadcn-studio/skeleton/skeleton-12"));

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
        description: "Stacked lines standing in for a paragraph.",
        preview: <SkeletonText />,
        source: ss("skeleton/skeleton-02"),
      },
      {
        id: "skeleton-form",
        name: "Form",
        description: "Placeholder fields mirroring a form layout.",
        preview: <SkeletonForm />,
        source: ss("skeleton/skeleton-04"),
      },
      {
        id: "skeleton-accordion",
        name: "Accordion",
        description: "Placeholder rows mirroring collapsed accordion items.",
        preview: (
          <div className="w-full max-w-md">
            <SkeletonAccordion />
          </div>
        ),
        source: ss("skeleton/skeleton-07"),
      },
      {
        id: "skeleton-table",
        name: "Table",
        description: "Placeholder rows and columns mirroring a table.",
        preview: <SkeletonTable />,
        source: ss("skeleton/skeleton-11"),
      },
      {
        id: "skeleton-widgets",
        name: "Widget cards",
        description: "Placeholder dashboard widget cards.",
        preview: <SkeletonWidgetsCards />,
        source: ss("skeleton/skeleton-12"),
      },
    ],
};

export default content;
