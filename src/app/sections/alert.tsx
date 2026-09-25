// Content for the "alert" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ss } from "./shared";

const AlertClosableDemo = React.lazy(() => import("@/components/shadcn-studio/alert/alert-03"));

const AlertSoftSuccessDemo = React.lazy(() => import("@/components/shadcn-studio/alert/alert-23"));

const AlertSoftWarningDemo = React.lazy(() => import("@/components/shadcn-studio/alert/alert-24"));

const AlertSoftInfoDemo = React.lazy(() => import("@/components/shadcn-studio/alert/alert-22"));

const AlertSoftDestructiveDemo = React.lazy(() => import("@/components/shadcn-studio/alert/alert-25"));

const AlertFileUploadDemo = React.lazy(() => import("@/components/shadcn-studio/alert/alert-07"));

const AlertWithActionDemo = React.lazy(() => import("@/components/shadcn-studio/alert/alert-13"));

const content = {
  variants: [
      {
        id: "alert-status-variants",
        name: "Status variants",
        description: "Default, success, warning, and destructive tones.",
        preview: (
          <div className="grid w-full max-w-md gap-3">
            <Alert>
              <Info />
              <AlertTitle>Scheduled maintenance</AlertTitle>
              <AlertDescription>Data sync pauses tonight from 1–2 AM ET.</AlertDescription>
            </Alert>
            <Alert variant="success">
              <CheckCircle2 />
              <AlertTitle>Bill reconciled</AlertTitle>
              <AlertDescription>All 42 meters matched the utility statement.</AlertDescription>
            </Alert>
            <Alert variant="warning">
              <AlertTriangle />
              <AlertTitle>Approaching peak</AlertTitle>
              <AlertDescription>Facility is within 5% of its demand threshold.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <XCircle />
              <AlertTitle>Connection lost</AlertTitle>
              <AlertDescription>Meter M-118 stopped reporting 20 minutes ago.</AlertDescription>
            </Alert>
          </div>
        ),
      },
      {
        id: "alert-dismissible",
        name: "Dismissible",
        description: "An alert the user can close.",
        preview: (
          <div className="w-full max-w-md">
            <AlertClosableDemo />
          </div>
        ),
        source: ss("alert/alert-03"),
      },
      {
        id: "alert-with-action",
        name: "With action",
        description: "An alert with an inline action button.",
        preview: (
          <div className="w-full max-w-md">
            <AlertWithActionDemo />
          </div>
        ),
        source: ss("alert/alert-13"),
      },
      {
        id: "alert-file-upload",
        name: "File upload with progress",
        description: "An alert showing upload progress.",
        preview: (
          <div className="w-full max-w-md">
            <AlertFileUploadDemo />
          </div>
        ),
        source: ss("alert/alert-07"),
      },
      {
        id: "alert-soft-success",
        name: "Soft success",
        description: "A low-contrast success alert with a tinted background.",
        preview: (
          <div className="w-full max-w-md">
            <AlertSoftSuccessDemo />
          </div>
        ),
        source: ss("alert/alert-23"),
      },
      {
        id: "alert-soft-warning",
        name: "Soft warning",
        description: "A low-contrast warning alert with a tinted background.",
        preview: (
          <div className="w-full max-w-md">
            <AlertSoftWarningDemo />
          </div>
        ),
        source: ss("alert/alert-24"),
      },
      {
        id: "alert-soft-info",
        name: "Soft info",
        description: "A low-contrast informational alert with a tinted background.",
        preview: (
          <div className="w-full max-w-md">
            <AlertSoftInfoDemo />
          </div>
        ),
        source: ss("alert/alert-22"),
      },
      {
        id: "alert-soft-destructive",
        name: "Soft destructive",
        description: "A low-contrast error alert with a tinted background.",
        preview: (
          <div className="w-full max-w-md">
            <AlertSoftDestructiveDemo />
          </div>
        ),
        source: ss("alert/alert-25"),
      },
    ],
};

export default content;
