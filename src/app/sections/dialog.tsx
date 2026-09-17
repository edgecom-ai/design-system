"use client"

// Content for the "dialog" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const AlertDialogDemo = React.lazy(() => import("@/components/shadcn-studio/dialog/dialog-01"));

const AlertDialogWithIconDemo = React.lazy(() => import("@/components/shadcn-studio/dialog/dialog-02"));

const AlertDialogDestructiveDemo = React.lazy(() => import("@/components/shadcn-studio/dialog/dialog-03"));

const DialogStickyFooterDemo = React.lazy(() => import("@/components/shadcn-studio/dialog/dialog-06"));

const DialogTermsAndConditionDemo = React.lazy(() => import("@/components/shadcn-studio/dialog/dialog-08"));

const DialogOTPVerificationDemo = React.lazy(() => import("@/components/shadcn-studio/dialog/dialog-12"));

const content = {
  variants: [
      {
        id: "alert-dialog",
        name: "Alert dialog",
        description: "A confirmation dialog requiring an explicit choice.",
        preview: <AlertDialogDemo />,
        source: ss("dialog/dialog-01"),
      },
      {
        id: "alert-dialog-with-icon",
        name: "Alert dialog with icon",
        description: "A confirmation dialog with a leading status icon.",
        preview: <AlertDialogWithIconDemo />,
        source: ss("dialog/dialog-02"),
      },
      {
        id: "alert-dialog-destructive",
        name: "Destructive alert dialog",
        description: "A confirmation dialog for irreversible actions.",
        preview: <AlertDialogDestructiveDemo />,
        source: ss("dialog/dialog-03"),
      },
      {
        id: "dialog-sticky-footer",
        name: "Dialog with sticky footer",
        description: "A scrollable dialog whose footer actions stay pinned.",
        preview: <DialogStickyFooterDemo />,
        source: ss("dialog/dialog-06"),
      },
      {
        id: "dialog-terms",
        name: "Terms and conditions",
        description: "A dialog presenting scrollable legal copy to accept.",
        preview: <DialogTermsAndConditionDemo />,
        source: ss("dialog/dialog-08"),
      },
      {
        id: "dialog-otp",
        name: "OTP verification",
        description: "A dialog for entering a one-time verification code.",
        preview: <DialogOTPVerificationDemo />,
        source: ss("dialog/dialog-12"),
      },
    ],
};

export default content;
