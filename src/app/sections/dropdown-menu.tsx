// Content for the "dropdown-menu" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const DropdownMenuDemo = React.lazy(() => import("@/components/shadcn-studio/dropdown-menu/dropdown-menu-01"));

const DropdownMenuItemActionDemo = React.lazy(() => import("@/components/shadcn-studio/dropdown-menu/dropdown-menu-04"));

const DropdownMenuUserMenuDemo = React.lazy(() => import("@/components/shadcn-studio/dropdown-menu/dropdown-menu-07"));

const DropdownMenuUserProfileDemo = React.lazy(() => import("@/components/shadcn-studio/dropdown-menu/dropdown-menu-08"));

const DropdownMenuCheckboxDemo = React.lazy(() => import("@/components/shadcn-studio/dropdown-menu/dropdown-menu-13"));

const content = {
  variants: [
      {
        id: "dropdown-default",
        name: "Default",
        description: "A basic menu of actions with a separator.",
        preview: <DropdownMenuDemo />,
        source: ss("dropdown-menu/dropdown-menu-01"),
      },
      {
        id: "dropdown-item-action",
        name: "Menu item with action",
        description: "Items with keyboard shortcuts and destructive styling.",
        preview: <DropdownMenuItemActionDemo />,
        source: ss("dropdown-menu/dropdown-menu-04"),
      },
      {
        id: "dropdown-checkbox",
        name: "Checkbox items",
        description: "Toggleable menu items that persist their checked state.",
        preview: <DropdownMenuCheckboxDemo />,
        source: ss("dropdown-menu/dropdown-menu-13"),
      },
      {
        id: "dropdown-user-menu",
        name: "User menu",
        description: "An account menu with grouped actions.",
        preview: <DropdownMenuUserMenuDemo />,
        source: ss("dropdown-menu/dropdown-menu-07"),
      },
      {
        id: "dropdown-user-profile",
        name: "User profile",
        description: "An account menu headed by the user's profile details.",
        preview: <DropdownMenuUserProfileDemo />,
        source: ss("dropdown-menu/dropdown-menu-08"),
      },
    ],
};

export default content;
