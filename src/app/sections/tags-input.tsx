"use client"

// Content for the "tags-input" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const TagsInputDemo = React.lazy(() => import("@/components/shadcn-studio/tags-input/tags-input-01"));

const TagsInputEmailsDemo = React.lazy(() => import("@/components/shadcn-studio/tags-input/tags-input-02"));

const content = {
  variants: [
      {
        id: "tags-input-default",
        name: "Default",
        description:
          "Type and press Enter or comma to add a tag; Backspace removes the last one.",
        preview: <TagsInputDemo />,
        source: ss("tags-input/tags-input-01"),
      },
      {
        id: "tags-input-validated",
        name: "Validation and limit",
        description:
          "Rejects invalid entries, dedupes, caps the count, and splits pasted lists.",
        preview: <TagsInputEmailsDemo />,
        source: ss("tags-input/tags-input-02"),
      },
    ],
};

export default content;
