// Content for the "calendar" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const CalendarRangeCalendarMultiMonthDemo = React.lazy(() => import("@/components/shadcn-studio/calendar/calendar-04"));

const CalendarEventListDemo = React.lazy(() => import("@/components/shadcn-studio/calendar/calendar-11"));

const CalendarWithRangePresetsDemo = React.lazy(() => import("@/components/shadcn-studio/calendar/calendar-23"));

const CalendarAppointmentBookingDemo = React.lazy(() => import("@/components/shadcn-studio/calendar/calendar-24"));

const CalendarPricingDemo = React.lazy(() => import("@/components/shadcn-studio/calendar/calendar-25"));

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
        description: "A range calendar with quick presets like Today, Last 7 days, and Year to date.",
        preview: (
          <div className="w-fit max-w-full">
            <CalendarWithRangePresetsDemo />
          </div>
        ),
        source: ss("calendar/calendar-23"),
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
        name: "Pricing",
        description: "A date-range calendar for a pricing period.",
        preview: <CalendarPricingDemo />,
        source: ss("calendar/calendar-25"),
      },
    ],
};

export default content;
