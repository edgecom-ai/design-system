"use client"

// Content for the "sortable" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const SortableDemo = React.lazy(() => import("@/components/shadcn-studio/sortable/sortable-01"));

const SortableGroupDemo = React.lazy(() => import("@/components/shadcn-studio/sortable/sortable-03"));

const SortableNotificationChannels = React.lazy(() => import("@/components/shadcn-studio/sortable/sortable-04"));

const SortableTaskColumnsDemo = React.lazy(() => import("@/components/shadcn-studio/sortable/sortable-05"));

const content = {
  variants: [
      {
        id: "sortable-handles",
        name: "List with handles",
        description: "A reorderable list dragged by explicit handles.",
        preview: (
          <div className="w-full max-w-md">
            <SortableDemo />
          </div>
        ),
        source: ss("sortable/sortable-01"),
      },
      {
        id: "sortable-groups",
        name: "Nested groups",
        description: "Reorderable items organized into nested groups.",
        preview: <SortableGroupDemo />,
        source: ss("sortable/sortable-03"),
      },
      {
        id: "sortable-notification-priority",
        name: "Notification priority",
        description: "Drag notification channels to set their priority order.",
        preview: <SortableNotificationChannels />,
        source: ss("sortable/sortable-04"),
      },
      {
        id: "sortable-task-columns",
        name: "Task columns (drag between)",
        description: "A kanban board where tasks drag between columns.",
        preview: <SortableTaskColumnsDemo />,
        source: ss("sortable/sortable-05"),
      },
    ],
};

export default content;
