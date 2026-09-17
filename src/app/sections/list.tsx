"use client"

// Content for the "list" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const ListDemo = React.lazy(() => import("@/components/shadcn-studio/list/list-01"));

const ListNotifications = React.lazy(() => import("@/components/shadcn-studio/list/list-02"));

const ItemsList = React.lazy(() => import("@/components/shadcn-studio/list/list-03"));

const ListUsers = React.lazy(() => import("@/components/shadcn-studio/list/list-06"));

const content = {
  variants: [
      {
        id: "list-styled",
        name: "Styled lists (decimal · disc · none)",
        description: "Ordered, unordered, and unstyled list treatments.",
        preview: <ListDemo />,
        source: ss("list/list-01"),
      },
      {
        id: "list-notifications",
        name: "Notification items with switches",
        description: "Setting rows with an inline switch on each item.",
        preview: <ListNotifications />,
        source: ss("list/list-02"),
      },
      {
        id: "list-key-value",
        name: "Key / value rows with separators",
        description: "Label-and-value pairs divided by separators.",
        preview: <ItemsList />,
        source: ss("list/list-03"),
      },
      {
        id: "list-navigation",
        name: "Navigation item group (links)",
        description: "A grouped set of navigation links.",
        preview: <ListUsers />,
        source: ss("list/list-06"),
      },
    ],
};

export default content;
