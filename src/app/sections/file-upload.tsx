// Content for the "file-upload" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const FileUploadDropzoneDemo = React.lazy(() => import("@/components/demo/file-upload-dropzone-demo").then((m) => ({ default: m.FileUploadDropzoneDemo })));

const FileUploadImportDialogDemo = React.lazy(() => import("@/components/demo/file-upload-import-dialog-demo").then((m) => ({ default: m.FileUploadImportDialogDemo })));

const FileUploadWizardDemo = React.lazy(() => import("@/components/demo/file-upload-wizard-demo").then((m) => ({ default: m.FileUploadWizardDemo })));

const content = {
  variants: [
      {
        id: "file-upload-dropzone",
        name: "Drop zone",
        description:
          "A dashed target with a Choose file button, a file row once something is picked — removed with a quiet destructive icon button — and the caller's own error underneath. A dropped file is checked against the accepted types, since a drag skips the picker's filter.",
        preview: <FileUploadDropzoneDemo />,
        source: dm("file-upload-dropzone-demo"),
      },
      {
        id: "file-upload-import-dialog",
        name: "Import dialog",
        description:
          "A short action, so a dialog: the drop zone, the template download on the left of the footer, Cancel and Import on the right. Nothing is validated until Import, and a success confirms with a toast.",
        preview: <FileUploadImportDialogDemo />,
        source: dm("file-upload-import-dialog-demo"),
      },
      {
        id: "file-upload-wizard",
        name: "Upload wizard",
        description:
          "File → Mapping → Review on the stepper. Mapping pairs two column selects with a list picker, each with its own inline error; Review lists what will be imported and warns before existing entries are changed. Pick a CSV of your own or use the sample.",
        preview: <FileUploadWizardDemo />,
        source: dm("file-upload-wizard-demo"),
      },
    ],
};

export default content;
