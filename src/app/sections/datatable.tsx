// Content for the "datatable" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const DataTableAdvancedDemo = React.lazy(() => import("@/components/demo/datatable-demo").then((m) => ({ default: m.DataTableAdvancedDemo })));

const DataTableBasicDemo = React.lazy(() => import("@/components/shadcn-studio/data-table/data-table-01"));

const DataTableWithExpandableRowsDemo = React.lazy(() => import("@/components/shadcn-studio/data-table/data-table-09"));

const DataTableWithPaginationDemo = React.lazy(() => import("@/components/shadcn-studio/data-table/data-table-11"));

const DataTableWithExportDemo = React.lazy(() => import("@/components/shadcn-studio/data-table/data-table-12"));

const EditableDataTableDemo = React.lazy(() => import("@/components/shadcn-studio/data-table/data-table-13"));

const content = {
  variants: [
      {
        id: "data-table-advanced",
        name: "Advanced (filters · columns · pagination)",
        description: "A complete table with filtering, column toggles, and paging.",
        preview: <DataTableAdvancedDemo />,
        source: dm("datatable-demo"),
      },
      {
        id: "data-table-default",
        name: "Default (sortable, selectable)",
        description: "A baseline table with sortable columns and row selection.",
        preview: <DataTableBasicDemo />,
        source: ss("data-table/data-table-01"),
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
