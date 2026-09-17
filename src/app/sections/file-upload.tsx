"use client"

// Content for the "file-upload" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"

const FileUploadDemo = React.lazy(() => import("@/components/shadcn-studio/blocks/file-upload-02/file-upload-02"));

const content = {
  node: (
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">
          Drag &amp; drop with progress, validation &amp; previews
        </span>
        <div className="flex justify-center">
          <FileUploadDemo />
        </div>
      </div>
    ),
};

export default content;
