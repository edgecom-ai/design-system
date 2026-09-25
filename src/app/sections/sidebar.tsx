// Content for the "sidebar" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const SidebarDemo = React.lazy(() => import("@/components/demo/sidebar-demo").then((m) => ({ default: m.SidebarDemo })));

const SidebarSubmenuDemo = React.lazy(() => import("@/components/demo/sidebar-submenu-demo").then((m) => ({ default: m.SidebarSubmenuDemo })));

const content = {
  variants: [
      {
        id: "sidebar-basic",
        name: "Dashboard sidebar",
        description: "Logo header, a grouped navigation menu with an active item, and a settings footer.",
        preview: <SidebarDemo />,
        source: dm("sidebar-demo"),
      },
      {
        id: "sidebar-submenu",
        name: "Collapsible submenu",
        description: "A top-level item expanded into subpages (Energy, Bill, Production).",
        preview: <SidebarSubmenuDemo />,
        source: dm("sidebar-submenu-demo"),
      },
    ],
};

export default content;
