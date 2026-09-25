// Content for the "context-menu" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const ContextMenuDemo = React.lazy(() => import("@/components/demo/context-menu-demo").then((m) => ({ default: m.ContextMenuDemo })));

const ContextMenuBasicDemo = React.lazy(() => import("@/components/shadcn-studio/context-menu/context-menu-01"));

const ContextMenuSubmenuDemo = React.lazy(() => import("@/components/shadcn-studio/context-menu/context-menu-02"));

const content = {
  variants: [
      {
        id: "context-menu-default",
        name: "Default",
        description:
          "Actions, a submenu, a checkbox toggle, a radio group, and a destructive item.",
        preview: <ContextMenuDemo />,
        source: dm("context-menu-demo"),
      },
      {
        id: "context-menu-basic",
        name: "Basic options",
        description: "A minimal menu of grouped actions.",
        preview: <ContextMenuBasicDemo />,
        source: ss("context-menu/context-menu-01"),
      },
      {
        id: "context-menu-submenu",
        name: "With submenu",
        description: "A menu that nests further actions in a submenu.",
        preview: <ContextMenuSubmenuDemo />,
        source: ss("context-menu/context-menu-02"),
      },
    ],
};

export default content;
