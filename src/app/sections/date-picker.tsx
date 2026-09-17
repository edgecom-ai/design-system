"use client"

// Content for the "date-picker" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const DatePickerDemo = React.lazy(() => import("@/components/demo/date-picker-demo").then((m) => ({ default: m.DatePickerDemo })));

const DatePickerRangeDemo = React.lazy(() => import("@/components/shadcn-studio/date-picker/date-picker-02"));

const DatePickerMonthRangeDemo = React.lazy(() => import("@/components/demo/date-picker-month-range-demo").then((m) => ({ default: m.DatePickerMonthRangeDemo })));

const DatePickerCompactDemo = React.lazy(() => import("@/components/demo/date-picker-compact-demo").then((m) => ({ default: m.DatePickerCompactDemo })));

const DatePickerWindowDemo = React.lazy(() => import("@/components/demo/date-picker-window-demo").then((m) => ({ default: m.DatePickerWindowDemo })));

const DatePickerNaturalLanguageDemo = React.lazy(() => import("@/components/shadcn-studio/date-picker/date-picker-05"));

const DatePickerTimeDemo = React.lazy(() => import("@/components/shadcn-studio/date-picker/date-picker-08"));

const DatePickerDateTimeDemo = React.lazy(() => import("@/components/shadcn-studio/date-picker/date-picker-10"));

const DatePickerRangeTimeDemo = React.lazy(() => import("@/components/shadcn-studio/date-picker/date-picker-12"));

const content = {
  variants: [
      {
        id: "date-picker-single",
        name: "Single date",
        description: "A calendar in a popover triggered by an input.",
        preview: <DatePickerDemo />,
        source: dm("date-picker-demo"),
      },
      {
        id: "date-picker-range",
        name: "Date range",
        description: "A date-range calendar in a popover for selecting a start and end date.",
        preview: <DatePickerRangeDemo />,
        source: ss("date-picker/date-picker-02"),
      },
      {
        id: "date-picker-month-range",
        name: "Month range",
        description: "A month-granularity range picker — pick a start and end month across years.",
        preview: <DatePickerMonthRangeDemo />,
        source: dm("date-picker-month-range-demo"),
      },
      {
        id: "date-picker-window",
        name: "Rolling window",
        description: "Pick a start day and select a fixed-length window running forward from it — hovering previews the whole window; `maxDate` disables days whose window would run past it.",
        preview: <DatePickerWindowDemo />,
        source: dm("date-picker-window-demo"),
      },
      {
        id: "date-picker-compact",
        name: "Compact (icon trigger)",
        description: "Any of our pickers with `compact` — an icon-only trigger that opens the same calendar; each keeps its own dropdown logic and UI.",
        preview: <DatePickerCompactDemo />,
        source: dm("date-picker-compact-demo"),
      },
      {
        id: "date-picker-natural-language",
        name: "Natural language",
        description: "A text input that parses phrases like “tomorrow” or “next friday” into a date.",
        preview: <DatePickerNaturalLanguageDemo />,
        source: ss("date-picker/date-picker-05"),
      },
      {
        id: "date-picker-time",
        name: "Time",
        description: "A time input for selecting an hour and minute.",
        preview: <DatePickerTimeDemo />,
        source: ss("date-picker/date-picker-08"),
      },
      {
        id: "date-picker-date-time",
        name: "Date and time",
        description: "A date picker paired with a time input.",
        preview: <DatePickerDateTimeDemo />,
        source: ss("date-picker/date-picker-10"),
      },
      {
        id: "date-picker-range-time",
        name: "Date range and time",
        description: "A date-range picker with start and end time inputs.",
        preview: <DatePickerRangeTimeDemo />,
        source: ss("date-picker/date-picker-12"),
      },
    ],
};

export default content;
