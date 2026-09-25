// Content for the "navigation-menu" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const NavigationMenuDemo = React.lazy(() => import("@/components/shadcn-studio/navigation-menu/navigation-menu-01"));

const NavigationMenuFeatureDemo = React.lazy(() => import("@/components/shadcn-studio/navigation-menu/navigation-menu-03"));

const NavigationMenuExploreDemo = React.lazy(() => import("@/components/shadcn-studio/navigation-menu/navigation-menu-04"));

const NavigationMenuDesignDemo = React.lazy(() => import("@/components/shadcn-studio/navigation-menu/navigation-menu-05"));

const content = {
  variants: [
      {
        id: "navigation-menu-default",
        name: "Default",
        description:
          "A single-column dropdown with titles and supporting descriptions.",
        preview: <NavigationMenuDemo />,
        source: ss("navigation-menu/navigation-menu-01"),
      },
      {
        id: "navigation-menu-features",
        name: "With icons and badges",
        description:
          "Links enriched with icons and status badges for extra context.",
        preview: <NavigationMenuFeatureDemo />,
        source: ss("navigation-menu/navigation-menu-03"),
      },
      {
        id: "navigation-menu-sections",
        name: "Grouped sections",
        description:
          "Items organized into logical sections with icons and descriptions.",
        preview: <NavigationMenuExploreDemo />,
        source: ss("navigation-menu/navigation-menu-04"),
      },
      {
        id: "navigation-menu-cta",
        name: "With call to action",
        description:
          "A tool list paired with a dedicated call-to-action area.",
        preview: <NavigationMenuDesignDemo />,
        source: ss("navigation-menu/navigation-menu-05"),
      },
    ],
};

export default content;
