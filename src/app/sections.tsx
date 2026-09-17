"use client"

import * as React from "react"
import { changelog } from "@/docs/generated/changelog";

/** Content for one section: the JSX and/or variant list. Lazily imported. */
export type SectionContent = {
  node?: React.ReactNode;
  variants?: Variant[];
};

/**
 * One dynamic import per section, keyed by id. The metadata below is eager —
 * the sidebar, the search dialog and every generator need all 70 entries — but
 * a section's content is fetched only when that route is viewed. Vite turns
 * each entry into its own chunk.
 */
export const sectionContent: Record<string, () => Promise<{ default: SectionContent }>> = {
  "introduction": () => import("./sections/introduction"),
  "installation": () => import("./sections/installation"),
  "accessibility": () => import("./sections/accessibility"),
  "changelog": () => import("./sections/changelog"),
  "colors": () => import("./sections/colors"),
  "charts": () => import("./sections/charts"),
  "typography": () => import("./sections/typography"),
  "logo": () => import("./sections/logo"),
  "icons": () => import("./sections/icons"),
  "button": () => import("./sections/button"),
  "input": () => import("./sections/input"),
  "list": () => import("./sections/list"),
  "card": () => import("./sections/card"),
  "badge": () => import("./sections/badge"),
  "alert": () => import("./sections/alert"),
  "dialog": () => import("./sections/dialog"),
  "alert-dialog": () => import("./sections/alert-dialog"),
  "dropdown-menu": () => import("./sections/dropdown-menu"),
  "context-menu": () => import("./sections/context-menu"),
  "navigation-menu": () => import("./sections/navigation-menu"),
  "resizable": () => import("./sections/resizable"),
  "empty": () => import("./sections/empty"),
  "drawer": () => import("./sections/drawer"),
  "breadcrumb": () => import("./sections/breadcrumb"),
  "label-textarea": () => import("./sections/label-textarea"),
  "spinner": () => import("./sections/spinner"),
  "skeleton": () => import("./sections/skeleton"),
  "switch": () => import("./sections/switch"),
  "toggle": () => import("./sections/toggle"),
  "slider": () => import("./sections/slider"),
  "sortable": () => import("./sections/sortable"),
  "stepper": () => import("./sections/stepper"),
  "progress": () => import("./sections/progress"),
  "avatar": () => import("./sections/avatar"),
  "field": () => import("./sections/field"),
  "input-group": () => import("./sections/input-group"),
  "scroll-area": () => import("./sections/scroll-area"),
  "separator": () => import("./sections/separator"),
  "sheet": () => import("./sections/sheet"),
  "select": () => import("./sections/select"),
  "banner": () => import("./sections/banner"),
  "accordion": () => import("./sections/accordion"),
  "collapsible": () => import("./sections/collapsible"),
  "calendar": () => import("./sections/calendar"),
  "date-picker": () => import("./sections/date-picker"),
  "category-bar": () => import("./sections/category-bar"),
  "command": () => import("./sections/command"),
  "pagination": () => import("./sections/pagination"),
  "sidebar": () => import("./sections/sidebar"),
  "table": () => import("./sections/table"),
  "timeline": () => import("./sections/timeline"),
  "checkbox": () => import("./sections/checkbox"),
  "combobox": () => import("./sections/combobox"),
  "tags-input": () => import("./sections/tags-input"),
  "button-group": () => import("./sections/button-group"),
  "tabs": () => import("./sections/tabs"),
  "popover": () => import("./sections/popover"),
  "radio-group": () => import("./sections/radio-group"),
  "tooltip": () => import("./sections/tooltip"),
  "hover-card": () => import("./sections/hover-card"),
  "toast": () => import("./sections/toast"),
  "authorization": () => import("./sections/authorization"),
  "detail-dialog": () => import("./sections/detail-dialog"),
  "chart-blocks": () => import("./sections/chart-blocks"),
  "datatable": () => import("./sections/datatable"),
  "form": () => import("./sections/form"),
  "page-header": () => import("./sections/page-header"),
  "file-upload": () => import("./sections/file-upload"),
  "statistics": () => import("./sections/statistics"),
  "widgets": () => import("./sections/widgets"),
  "application-shell": () => import("./sections/application-shell"),
  "settings": () => import("./sections/settings"),
};

export type Variant = {
  /** anchor slug, unique within the section, e.g. "with-icon" */
  id: string;
  name: string;
  description?: string;
  preview: React.ReactNode;
  /** Source key into /docs-source/<source>.json (path relative to src/). Omit for inline previews with no backing file. */
  source?: string;
  /** Per-variant install override; falls back to the section's `install`. */
  install?: string;
};

export type Section = {
  id: string;
  label: string;
  group: string;
  /** One-line summary shown under the page title. */
  description?: string;
  /** shadcn registry item name(s) to `pnpm dlx shadcn@latest add` for this section. */
  install?: string;
  /**
   * Whether this section's content is a variant grid. The variants themselves
   * live in the lazily-imported content module; the header needs to know they
   * exist before that module loads, to decide where the install command goes.
   */
  hasVariants?: boolean;
  /** Manual "On this page" anchors for node sections (variant sections derive their own). */
  toc?: { id: string; name: string }[];
};

export const sections: Section[] = [
  {
    id: "introduction",
    label: "Introduction",
    group: "Getting Started",
    description:
      "A design system for building cohesive, data-dense, energy applications",
  },
  {
    id: "installation",
    label: "Installation",
    group: "Getting Started",
    description:
      "Everything you need to install the Edgecom design system and start building with it.",
  },
  {
    id: "accessibility",
    label: "Accessibility",
    group: "Getting Started",
    description:
      "Contrast, scalable type, and balancing accessibility with visual design.",
    toc: [
      { id: "a11y-color", name: "Color & contrast" },
      { id: "a11y-balance", name: "Balancing visual design & accessibility" },
      { id: "a11y-type", name: "Scalable, legible type" },
    ],
  },
  {
    id: "changelog",
    label: "Changelog",
    group: "Getting Started",
    description:
      "Every release of the design system, generated from the commit history.",
    toc: changelog.slice(0, 12).map((r) => ({ id: r.id, name: r.title })),
  },
  {
    id: "colors",
    label: "Semantic colors",
    group: "Foundations",
    description:
      "Semantic color tokens that adapt automatically between light and dark themes.",
    install: "@edgecom/theme",
    toc: [
      { id: "colors-usage", name: "Reach for a token by meaning" },
      { id: "colors-status", name: "Status colors carry meaning" },
      { id: "colors-solid", name: "Solid fills" },
      { id: "colors-subtle", name: "Status & brand surfaces" },
      { id: "colors-emphasis", name: "Emphasis colors as text" },
      { id: "colors-chart-lines", name: "Legacy line palette on card" },
      { id: "colors-elevation", name: "Elevation surfaces" },
    ],
  },
  {
    id: "charts",
    label: "Chart ramp",
    group: "Foundations",
    description:
      "Categorical hues and sequential tint ramps for charting each commodity, plus the legacy line palette kept for migrating existing plots.",
    install: "@edgecom/theme",
    hasVariants: true,
  },
  {
    id: "typography",
    label: "Typography",
    group: "Foundations",
    description:
      "The type scale, tabular figures, and heading styles used across the platform.",
    install: "@edgecom/theme",
    toc: [
      { id: "typo-scale", name: "Semantic scale" },
      { id: "typo-tabular", name: "Tabular figures" },
      { id: "typo-headings", name: "Headings" },
      { id: "typo-prose", name: "Prose" },
      { id: "typo-text", name: "Text styles" },
      { id: "typo-examples", name: "Examples" },
    ],
  },
  {
    id: "logo",
    label: "Logo",
    group: "Foundations",
    description:
      "The Edgecom wordmark and glyph, with clear-space and color guidance.",
    install: "@edgecom/logo",
    toc: [
      { id: "logo-combination", name: "Combination lockup" },
      { id: "logo-mark", name: "Mark only" },
      { id: "logo-dark", name: "On dark surface" },
    ],
  },
  {
    id: "icons",
    label: "Icons",
    group: "Foundations",
    description: "Lucide icons — sizing conventions and usage.",
    toc: [
      { id: "icons-sizes", name: "Sizes" },
      { id: "icons-usage", name: "Usage" },
      { id: "icons-install", name: "Installation" },
    ],
  },
  {
    id: "button",
    label: "Button",
    group: "Components",
    description:
      "Trigger actions with a range of variants, sizes, and icon layouts.",
    install: "@edgecom/button",
    hasVariants: true,
  },
  {
    id: "input",
    label: "Input",
    group: "Components",
    description:
      "Single-line text fields with labels, icons, add-ons, and validation states.",
    install: "@edgecom/input",
    hasVariants: true,
  },
  {
    id: "list",
    label: "List",
    group: "Components",
    description: "Structured lists for content, settings, and navigation.",
    install: "@edgecom/list",
    hasVariants: true,
  },
  {
    id: "card",
    label: "Card",
    group: "Components",
    description:
      "A flexible container with header, content, and footer regions.",
    install: "@edgecom/card",
    hasVariants: true,
  },
  {
    id: "badge",
    label: "Badge & status tags",
    group: "Components",
    description:
      "Compact labels for statuses, counts, and commodity tags.",
    install: "@edgecom/badge",
    hasVariants: true,
  },
  {
    id: "alert",
    label: "Alert",
    group: "Components",
    description:
      "Inline messages that communicate status, warnings, and errors.",
    install: "@edgecom/alert",
    hasVariants: true,
  },
  {
    id: "dialog",
    label: "Dialog",
    group: "Components",
    description:
      "Modal dialogs for confirmations, forms, and focused tasks.",
    install: "@edgecom/dialog",
    hasVariants: true,
  },
  {
    id: "alert-dialog",
    label: "Alert dialog",
    group: "Components",
    description:
      "The confirmation every destructive action passes through — the one overlay without a close.",
    install: "@edgecom/alert-dialog",
    hasVariants: true,
  },
  {
    id: "dropdown-menu",
    label: "Dropdown menu",
    group: "Components",
    description:
      "Menus of actions and options triggered from a button.",
    install: "@edgecom/dropdown-menu",
    hasVariants: true,
  },
  {
    id: "context-menu",
    label: "Context menu",
    group: "Components",
    description:
      "A menu of actions revealed by right-clicking (or long-pressing) a target region.",
    install: "@edgecom/context-menu",
    hasVariants: true,
  },
  {
    id: "navigation-menu",
    label: "Navigation menu",
    group: "Components",
    description:
      "Horizontal top-level navigation with dropdown panels for links, features, and calls to action.",
    install: "@edgecom/navigation-menu",
    hasVariants: true,
  },
  {
    id: "resizable",
    label: "Resizable",
    group: "Components",
    description:
      "Draggable panel groups for building split views and master–detail layouts.",
    install: "@edgecom/resizable",
    hasVariants: true,
  },
  {
    id: "empty",
    label: "Empty state",
    group: "Components",
    description:
      "A composable zero-state layout for empty lists, no-results searches, and first-run screens.",
    install: "@edgecom/empty",
    hasVariants: true,
  },
  {
    id: "drawer",
    label: "Drawer",
    group: "Components",
    description: "Panels that slide in from any edge of the screen.",
    install: "@edgecom/drawer",
    hasVariants: true,
  },
  {
    id: "breadcrumb",
    label: "Breadcrumb",
    group: "Components",
    description: "Shows the user's location within a nested hierarchy.",
    install: "@edgecom/breadcrumb",
    hasVariants: true,
  },
  {
    id: "label-textarea",
    label: "Label & textarea",
    group: "Components",
    description: "Multi-line text input paired with accessible labels.",
    install: "@edgecom/label @edgecom/textarea",
    hasVariants: true,
  },
  {
    id: "spinner",
    label: "Spinner",
    group: "Components",
    description: "Indeterminate loading indicators for in-progress work.",
    install: "@edgecom/spinner",
    hasVariants: true,
  },
  {
    id: "skeleton",
    label: "Skeleton",
    group: "Components",
    description: "Placeholder shapes that stand in for content while it loads.",
    install: "@edgecom/skeleton",
    hasVariants: true,
  },
  {
    id: "switch",
    label: "Switch",
    group: "Components",
    description: "Toggle a single setting on or off.",
    install: "@edgecom/switch",
    hasVariants: true,
  },
  {
    id: "toggle",
    label: "Toggle",
    group: "Components",
    description: "Buttons that hold a pressed state, individually or as a group.",
    install: "@edgecom/toggle @edgecom/toggle-group",
    hasVariants: true,
  },
  {
    id: "slider",
    label: "Slider",
    group: "Components",
    description: "Select a numeric value or range by dragging along a track.",
    install: "@edgecom/slider",
    hasVariants: true,
  },
  {
    id: "sortable",
    label: "Sortable",
    group: "Components",
    description: "Drag-and-drop lists and boards for reordering items.",
    install: "@edgecom/sortable",
    hasVariants: true,
  },
  {
    id: "stepper",
    label: "Stepper",
    group: "Components",
    description: "Guide users through a sequence of steps in a process.",
    install: "@edgecom/stepper",
    hasVariants: true,
  },
  {
    id: "progress",
    label: "Progress",
    group: "Components",
    description: "Communicate the completion of a task or a determinate value.",
    install: "@edgecom/progress",
    hasVariants: true,
  },
  {
    id: "avatar",
    label: "Avatar",
    group: "Components",
    description: "A user or contact image with a text fallback and grouping.",
    install: "@edgecom/avatar",
    hasVariants: true,
  },
  {
    id: "field",
    label: "Field",
    group: "Components",
    description: "Label, description, and error scaffolding for form controls.",
    install: "@edgecom/field",
    hasVariants: true,
  },
  {
    id: "input-group",
    label: "Input group",
    group: "Components",
    description: "Attach icons, text, or buttons to an input.",
    install: "@edgecom/input-group",
    hasVariants: true,
  },
  {
    id: "scroll-area",
    label: "Scroll area",
    group: "Components",
    description: "A scrollable region with a styled scrollbar.",
    install: "@edgecom/scroll-area",
    hasVariants: true,
  },
  {
    id: "separator",
    label: "Separator",
    group: "Components",
    description: "A thin divider for separating content, horizontally or vertically.",
    install: "@edgecom/separator",
    hasVariants: true,
  },
  {
    id: "sheet",
    label: "Sheet",
    group: "Components",
    description: "A dialog panel that slides in from an edge of the screen.",
    install: "@edgecom/sheet",
    hasVariants: true,
  },
  {
    id: "select",
    label: "Select",
    group: "Components",
    description: "Choose one or more options from a dropdown list.",
    install: "@edgecom/select",
    hasVariants: true,
  },
  {
    id: "banner",
    label: "Banner",
    group: "Components",
    description: "A full-width announcement bar for promotions, events, and product news.",
    install: "@edgecom/banner",
    hasVariants: true,
  },
  {
    id: "accordion",
    label: "Accordion",
    group: "Components",
    description: "Collapsible sections that expand to reveal their content.",
    install: "@edgecom/accordion",
    hasVariants: true,
  },
  {
    id: "collapsible",
    label: "Collapsible",
    group: "Components",
    description: "A single region that toggles between shown and hidden.",
    install: "@edgecom/collapsible",
    hasVariants: true,
  },
  {
    id: "calendar",
    label: "Calendar",
    group: "Components",
    description: "Date selection for scheduling, pricing, and pickers.",
    install: "@edgecom/calendar",
    hasVariants: true,
  },
  {
    id: "date-picker",
    label: "Date picker",
    group: "Components",
    description: "A calendar in a popover, triggered by an input, for selecting a single date or a range.",
    install: "@edgecom/date-picker",
    hasVariants: true,
  },
  {
    id: "category-bar",
    label: "Category bar",
    group: "Components",
    description: "A segmented proportion bar with an optional marker.",
    install: "@edgecom/category-bar",
    hasVariants: true,
  },
  {
    id: "command",
    label: "Command",
    group: "Components",
    description: "A searchable command palette for fast navigation and actions.",
    install: "@edgecom/command",
    hasVariants: true,
  },
  {
    id: "pagination",
    label: "Pagination",
    group: "Components",
    description: "Page navigation controls for long lists and tables.",
    install: "@edgecom/pagination",
    hasVariants: true,
  },
  {
    id: "sidebar",
    label: "Sidebar",
    group: "Components",
    description: "A composable application sidebar with header, grouped menu, and footer.",
    install: "@edgecom/sidebar",
    hasVariants: true,
  },
  {
    id: "table",
    label: "Table",
    group: "Components",
    description: "A styled HTML table for tabular data.",
    install: "@edgecom/table",
    hasVariants: true,
  },
  {
    id: "timeline",
    label: "Timeline",
    group: "Components",
    description: "A vertical sequence of events with status dots and connectors.",
    install: "@edgecom/timeline",
    hasVariants: true,
  },
  {
    id: "checkbox",
    label: "Checkbox",
    group: "Components",
    description: "Select one or many options, with grouped and indeterminate states.",
    install: "@edgecom/checkbox",
    hasVariants: true,
  },
  {
    id: "combobox",
    label: "Combobox",
    group: "Components",
    description: "A searchable select for choosing from long option lists.",
    install: "@edgecom/combobox",
    hasVariants: true,
  },
  {
    id: "tags-input",
    label: "Tags",
    group: "Components",
    description:
      "A free-text field that turns typed values into removable tags — no option list required.",
    install: "@edgecom/tags-input",
    hasVariants: true,
  },
  {
    id: "button-group",
    label: "Button group",
    group: "Components",
    description: "Related buttons joined into a single control.",
    install: "@edgecom/button-group",
    hasVariants: true,
  },
  {
    id: "tabs",
    label: "Tabs",
    group: "Components",
    description: "Switch between related views within the same context.",
    install: "@edgecom/tabs",
    hasVariants: true,
  },
  {
    id: "popover",
    label: "Popover",
    group: "Components",
    description: "Floating panels anchored to a trigger for forms and details.",
    install: "@edgecom/popover",
    hasVariants: true,
  },
  {
    id: "radio-group",
    label: "Radio group",
    group: "Components",
    description: "Choose exactly one option from a set.",
    install: "@edgecom/radio-group",
    hasVariants: true,
  },
  {
    id: "tooltip",
    label: "Tooltip",
    group: "Components",
    description: "Short contextual hints shown on hover or focus.",
    install: "@edgecom/tooltip",
    hasVariants: true,
  },
  {
    id: "hover-card",
    label: "Hover card",
    group: "Components",
    description:
      "Richer detail on hover, for dense UI where the primary value has to stay visible.",
    install: "@edgecom/hover-card",
    hasVariants: true,
  },
  {
    id: "toast",
    label: "Toast",
    group: "Components",
    description: "Brief, dismissible notifications for feedback and events.",
    install: "@edgecom/toast",
    hasVariants: true,
  },
  {
    id: "authorization",
    label: "Authorization",
    group: "Blocks",
    description: "A connection-progress screen for OAuth-style utility linking flows.",
    install: "@edgecom/authorization",
    hasVariants: true,
  },
  {
    id: "detail-dialog",
    label: "Detail dialog",
    group: "Blocks",
    description: "Composed, opinionated dialogs that assemble many primitives into a full editing screen.",
    install: "@edgecom/detail-dialog",
    hasVariants: true,
  },
  {
    id: "chart-blocks",
    label: "Charts",
    group: "Blocks",
    description: "Prebuilt chart blocks themed with the commodity color ramps.",
    install: "@edgecom/charts",
    toc: [
      { id: "chart-consumption", name: "Consumption metrics" },
      { id: "chart-spend", name: "Energy spend" },
      { id: "chart-demand-response", name: "Demand response" },
    ],
  },
  {
    id: "datatable",
    label: "Data table",
    group: "Blocks",
    description: "Full-featured tables with sorting, filtering, pagination, and selection.",
    install: "@edgecom/data-table",
    hasVariants: true,
  },
  {
    id: "form",
    label: "Form",
    group: "Blocks",
    description: "Composed form layouts, from single-step to multi-step wizards.",
    install: "@edgecom/form",
    hasVariants: true,
  },
  {
    id: "page-header",
    label: "Page header",
    group: "Blocks",
    description:
      "A breadcrumb above the H1, plus optional tab and toolbar rows. Any crumb — including the current page — can open a dropdown to pivot between peers.",
    install: "@edgecom/page-header",
    hasVariants: true,
  },
  {
    id: "file-upload",
    label: "File upload",
    group: "Blocks",
    description: "Drag-and-drop and browse controls for uploading files.",
    install: "@edgecom/file-upload",
    toc: [],
  },
  {
    id: "statistics",
    label: "Statistic Cards",
    group: "Blocks",
    description: "Metric tiles and KPI blocks for dashboards.",
    install:
      "@ss-blocks/statistics-component-15 @ss-blocks/statistics-component-02 @ss-blocks/statistics-component-14 @ss-blocks/statistics-component-22 @ss-blocks/statistics-component-21 @ss-blocks/statistics-component-19 @ss-blocks/statistics-component-07 @ss-blocks/statistics-component-09 @ss-blocks/statistics-component-10",
    toc: [
      { id: "stats-usage", name: "Usage / allocation meters" },
      { id: "stats-kpi", name: "KPI tiles with period" },
      { id: "stats-score", name: "Score gauge" },
      { id: "stats-health", name: "Service-health meters" },
      { id: "stats-line-trend", name: "Line-trend KPIs" },
      { id: "stats-channel", name: "Channel distribution" },
      { id: "stats-overview", name: "Overview grid" },
      { id: "stats-activity", name: "Activity / traffic" },
      { id: "stats-expense-income", name: "Expense / income" },
    ],
  },
  {
    id: "widgets",
    label: "Widgets",
    group: "Blocks",
    description: "Composed dashboard widgets combining stats, charts, and lists.",
    install:
      "@ss-blocks/widget-component-07 @ss-blocks/widget-component-17 @ss-blocks/widget-component-15 @ss-blocks/widget-component-20 @ss-blocks/widget-component-09 @ss-blocks/widget-component-02",
    toc: [
      { id: "widget-finance", name: "Finance review summary" },
      { id: "widget-orders", name: "Timeline orders" },
      { id: "widget-user-order", name: "User order summary" },
      { id: "widget-activity", name: "Customer activity" },
      { id: "widget-campaign", name: "Monthly campaign state" },
      { id: "widget-insights", name: "Product insights" },
    ],
  },
  {
    id: "application-shell",
    label: "Application shell",
    group: "Blocks",
    description: "The full page frame — sidebar, top bar, and content layout.",
    install: "@edgecom/sidebar",
    hasVariants: true,
  },
  {
    id: "settings",
    label: "Settings",
    group: "Blocks",
    description:
      "Account settings pages plus the settings shell that frames them with a grouped sub-nav.",
    install: "@edgecom/settings-shell",
    hasVariants: true,
  },
];

export const groupOrder = ["Getting Started", "Foundations", "Components", "Blocks"];

// Sections grouped and ordered for the sidebar / command palette. Components
// are alphabetized within their group; every other group keeps source order.
export const groupedSections = groupOrder.map((group) => ({
  group,
  items: sections
    .filter((s) => s.group === group)
    .sort((a, b) =>
      group === "Components" || group === "Blocks"
        ? a.label.localeCompare(b.label)
        : 0
    ),
}));

/** URL-safe slug for a group name, e.g. "Getting Started" -> "getting-started". */
export const groupSlug = (group: string) =>
  group.toLowerCase().replace(/\s+/g, "-");

/** Clean route path for a section, e.g. "/components/slider". */
export const sectionPath = (s: Section) => `/${groupSlug(s.group)}/${s.id}`;

/** Resolve a section from its route params. */
export function findSection(group: string, slug: string) {
  return sections.find((s) => groupSlug(s.group) === group && s.id === slug);
}

/** Landing route: the first section (Getting Started → Introduction). */
export const firstSectionPath = sectionPath(sections[0]);
