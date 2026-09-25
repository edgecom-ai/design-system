// Content for the "alert-dialog" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const AlertDialogDemo = React.lazy(() => import("@/components/demo/alert-dialog-demo").then((m) => ({ default: m.AlertDialogDemo })));

const AlertDialogTypeToConfirmDemo = React.lazy(() => import("@/components/demo/alert-dialog-type-to-confirm-demo").then((m) => ({ default: m.AlertDialogTypeToConfirmDemo })));

const AlertDialogBasicDemo = React.lazy(() => import("@/components/shadcn-studio/dialog/dialog-01"));

const AlertDialogWithIconDemo = React.lazy(() => import("@/components/shadcn-studio/dialog/dialog-02"));

const AlertDialogDestructiveDemo = React.lazy(() => import("@/components/shadcn-studio/dialog/dialog-03"));

const content = {
  variants: [
      {
        id: "alert-dialog-confirm",
        name: "Destructive confirmation",
        description: "The gate every destructive action passes through — it names what is affected and that it can't be undone.",
        preview: <AlertDialogDemo />,
        source: dm("alert-dialog-demo"),
      },
      {
        id: "alert-dialog-type-to-confirm",
        name: "Type to confirm",
        description: "The stronger barrier for a high-impact action: the confirm stays disabled until the resource is named exactly.",
        preview: <AlertDialogTypeToConfirmDemo />,
        source: dm("alert-dialog-type-to-confirm-demo"),
      },
      {
        id: "alert-dialog-basic",
        name: "Basic",
        description: "A confirmation dialog requiring an explicit choice.",
        preview: <AlertDialogBasicDemo />,
        source: ss("dialog/dialog-01"),
      },
      {
        id: "alert-dialog-with-icon",
        name: "With icon",
        description: "A confirmation dialog with a leading status icon.",
        preview: <AlertDialogWithIconDemo />,
        source: ss("dialog/dialog-02"),
      },
      {
        id: "alert-dialog-destructive",
        name: "Destructive action",
        description: "A confirmation dialog for irreversible actions.",
        preview: <AlertDialogDestructiveDemo />,
        source: ss("dialog/dialog-03"),
      },
    ],
};

export default content;
