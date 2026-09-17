"use client"

// Content for the "detail-dialog" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { Button } from "@/components/ui/button";
import { dm, ss } from "./shared";

const UserDetailsDialogDemo = React.lazy(() => import("@/components/demo/user-details-dialog-demo").then((m) => ({ default: m.UserDetailsDialogDemo })));

const CreateAlarmDialogDemo = React.lazy(() => import("@/components/demo/create-alarm-dialog-demo").then((m) => ({ default: m.CreateAlarmDialogDemo })));

const SearchDialog = React.lazy(() => import("@/components/shadcn-studio/blocks/dialog-search"));

const VerifyDialog = React.lazy(() => import("@/components/shadcn-studio/blocks/dashboard-dialog-09/dialog-verify"));

const FileUploadDialog = React.lazy(() => import("@/components/shadcn-studio/blocks/dashboard-dialog-11/dialog-file-upload"));

const UpdateProductDialog = React.lazy(() => import("@/components/shadcn-studio/blocks/dashboard-dialog-12/dialog-update-product"));

const AddAddressDialog = React.lazy(() => import("@/components/shadcn-studio/blocks/dashboard-dialog-14/dialog-add-address"));

const InitializePipelineDialog = React.lazy(() => import("@/components/shadcn-studio/blocks/dashboard-dialog-25/dialog-pipeline-configuration"));

const ShareCollaborateDialog = React.lazy(() => import("@/components/shadcn-studio/blocks/dashboard-dialog-26/dialog-share-collaborate"));

const content = {
  variants: [
      {
        id: "detail-dialog-create-alarm",
        name: "Create alarm",
        description: "A grouped, multi-section form dialog for defining a threshold alarm on a sensor, with a live rule summary.",
        preview: <CreateAlarmDialogDemo />,
        source: dm("create-alarm-dialog-demo"),
      },
      {
        id: "detail-dialog-user",
        name: "Edit user details",
        description: "A scrollable record editor combining avatar, inputs, select, calendar, and popover.",
        preview: <UserDetailsDialogDemo />,
        source: dm("user-details-dialog-demo"),
      },
      {
        id: "detail-dialog-search",
        name: "Search",
        description: "A command-palette search across sites, meters, DR events, and reports.",
        preview: (
          <SearchDialog
            trigger={<Button variant="outline">Search Edgecom</Button>}
          />
        ),
        source: ss("blocks/dialog-search"),
      },
      {
        id: "detail-dialog-verify",
        name: "Verify identity",
        description: "A two-factor verification flow for authorizing a Demand Response action.",
        preview: (
          <VerifyDialog
            trigger={<Button variant="outline">Verify identity</Button>}
          />
        ),
        source: ss("blocks/dashboard-dialog-09/dialog-verify"),
      },
      {
        id: "detail-dialog-import",
        name: "Import data",
        description: "A drag-and-drop uploader for importing meter data into dataTrack™.",
        preview: (
          <FileUploadDialog
            trigger={<Button variant="outline">Import energy data</Button>}
          />
        ),
        source: ss("blocks/dashboard-dialog-11/dialog-file-upload"),
      },
      {
        id: "detail-dialog-edit-asset",
        name: "Edit asset",
        description: "A full form dialog for editing a NeuraCharge™ station's configuration.",
        preview: (
          <UpdateProductDialog
            trigger={<Button variant="outline">Edit NeuraCharge™ station</Button>}
          />
        ),
        source: ss("blocks/dashboard-dialog-12/dialog-update-product"),
      },
      {
        id: "detail-dialog-add-site",
        name: "Add site",
        description: "A form dialog for registering a new site, with type, market, and toggles.",
        preview: (
          <AddAddressDialog
            trigger={<Button variant="outline">Add site</Button>}
          />
        ),
        source: ss("blocks/dashboard-dialog-14/dialog-add-address"),
      },
      {
        id: "detail-dialog-wizard",
        name: "Multi-step wizard",
        description: "A four-step wizard for enrolling sites in a Demand Response program.",
        preview: (
          <InitializePipelineDialog
            trigger={<Button variant="outline">Configure Demand Response</Button>}
          />
        ),
        source: ss("blocks/dashboard-dialog-25/dialog-pipeline-configuration"),
      },
      {
        id: "detail-dialog-share",
        name: "Share & collaborate",
        description: "A share dialog with a copyable link, permissions, and a comment toggle.",
        preview: (
          <ShareCollaborateDialog
            trigger={<Button variant="outline">Share report</Button>}
          />
        ),
        source: ss("blocks/dashboard-dialog-26/dialog-share-collaborate"),
      },
    ],
};

export default content;
