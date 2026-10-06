// Content for the "datatable" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const DataTableBasicDemo = React.lazy(() => import("@/components/demo/data-table-sortable-demo").then((m) => ({ default: m.DataTableSortableDemo })));

const DataTableWithExpandableRowsDemo = React.lazy(() => import("@/components/shadcn-studio/data-table/data-table-09"));

const DataTableWithPaginationDemo = React.lazy(() => import("@/components/shadcn-studio/data-table/data-table-11"));

const DataTableWithExportDemo = React.lazy(() => import("@/components/shadcn-studio/data-table/data-table-12"));

const EditableDataTableDemo = React.lazy(() => import("@/components/shadcn-studio/data-table/data-table-13"));

const DataTablePinnedDemo = React.lazy(() => import("@/components/demo/data-table-pinned-demo").then((m) => ({ default: m.DataTablePinnedDemo })));

const DatatableListCardDemo = React.lazy(() => import("@/components/demo/datatable-list-card-demo").then((m) => ({ default: m.DatatableListCardDemo })));

const content = {
  variants: [
      {
        id: "data-table-list-card",
        name: "List card",
        description:
          "A list in a card: a count and the primary action in the card header, a sortable table whose edge cells sit on the card's content line, quiet row actions with tooltips, and a \"Showing 1–5 of 12\" footer with pagination. Create and edit share one dialog; delete goes through an alert dialog.",
        preview: <DatatableListCardDemo />,
        source: dm("datatable-list-card-demo"),
      },
      {
        id: "data-table-default",
        name: "Default (sortable, selectable)",
        description: "A baseline table with sortable columns, row selection and a select-all checkbox.",
        preview: <DataTableBasicDemo />,
        source: dm("data-table-sortable-demo"),
      },
      {
        id: "data-table-pinned",
        name: "Pinned columns",
        description: "TanStack `columnPinning` drives the primitive's `pinned` prop — `column.getIsPinned()` names the side — so the selection box and the meter ID stay at the left edge and the row actions at the right. The primitive measures the pinned cells and stacks them itself; the column model declares no sizes.",
        preview: <DataTablePinnedDemo />,
        source: dm("data-table-pinned-demo"),
      },
      {
        id: "data-table-expandable",
        name: "Expandable rows",
        description: "Rows that expand to reveal nested detail.",
        preview: <DataTableWithExpandableRowsDemo />,
        source: ss("data-table/data-table-09"),
      },
      {
        id: "data-table-pagination",
        name: "Pagination",
        description: "Page through large datasets with page-size controls.",
        preview: <DataTableWithPaginationDemo />,
        source: ss("data-table/data-table-11"),
      },
      {
        id: "data-table-export",
        name: "Export",
        description: "Export the current table view to CSV.",
        preview: <DataTableWithExportDemo />,
        source: ss("data-table/data-table-12"),
      },
      {
        id: "data-table-editable",
        name: "Editable cells",
        description: "Edit values inline directly within table cells.",
        preview: <EditableDataTableDemo />,
        source: ss("data-table/data-table-13"),
      },
    ],
};

export default content;
