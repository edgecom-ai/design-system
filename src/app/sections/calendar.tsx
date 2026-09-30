// Content for the "calendar" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const CalendarRangeCalendarMultiMonthDemo = React.lazy(() => import("@/components/shadcn-studio/calendar/calendar-04"));

const CalendarEventListDemo = React.lazy(() => import("@/components/shadcn-studio/calendar/calendar-11"));

const CalendarBillingPresetsDemo = React.lazy(() => import("@/components/demo/calendar-billing-presets-demo").then((m) => ({ default: m.CalendarBillingPresetsDemo })));

const CalendarAppointmentBookingDemo = React.lazy(() => import("@/components/shadcn-studio/calendar/calendar-24"));

const CalendarDailyCostDemo = React.lazy(() => import("@/components/demo/calendar-daily-cost-demo").then((m) => ({ default: m.CalendarDailyCostDemo })));

const content = {
  variants: [
      {
        id: "calendar-multi-month",
        name: "Multi-month range",
        description: "A two-month range calendar for selecting a start and end date.",
        preview: (
          <div className="w-fit max-w-full">
            <CalendarRangeCalendarMultiMonthDemo />
          </div>
        ),
        source: ss("calendar/calendar-04"),
      },
      {
        id: "calendar-presets",
        name: "Range with presets",
        description: "A range calendar beside reporting presets — this billing period, last 30 days, year to date — with the selected span in the header.",
        preview: (
          <div className="w-fit max-w-full">
            <CalendarBillingPresetsDemo />
          </div>
        ),
        source: dm("calendar-billing-presets-demo"),
      },
      {
        id: "calendar-event-list",
        name: "Event list",
        description: "A calendar with the selected day's events listed beneath it.",
        preview: (
          <div className="w-fit max-w-full">
            <CalendarEventListDemo />
          </div>
        ),
        source: ss("calendar/calendar-11"),
      },
      {
        id: "calendar-appointment",
        name: "Appointment booking",
        description: "A calendar paired with selectable time slots.",
        preview: (
          <div className="w-fit max-w-full">
            <CalendarAppointmentBookingDemo />
          </div>
        ),
        source: ss("calendar/calendar-24"),
      },
      {
        id: "calendar-pricing",
        name: "Daily cost",
        description: "Each day carries its energy cost under the date, from a custom day button; days without a reading yet are disabled.",
        preview: <CalendarDailyCostDemo />,
        source: dm("calendar-daily-cost-demo"),
      },
    ],
};

export default content;
