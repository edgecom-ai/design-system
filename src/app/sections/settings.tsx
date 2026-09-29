// Content for the "settings" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const SettingsShellDemo = React.lazy(() => import("@/components/demo/settings-shell-demo").then((m) => ({ default: m.SettingsShellDemo })));

const SettingsPreferencesDemo = React.lazy(() => import("@/components/demo/settings-preferences-demo").then((m) => ({ default: m.SettingsPreferencesDemo })));

const content = {
  variants: [
      {
        id: "settings-shell",
        name: "Settings shell",
        description:
          "A two-pane panel: grouped sections on a rail — labelled when wide, icons with tooltips when narrower, a grouped select when there's no room — and the section's title, description and body on the right. The profile form saves through a sticky bar that stays disabled until something changes, and validates only when saved; Projects holds the list card.",
        preview: <SettingsShellDemo />,
        source: dm("settings-shell-demo"),
      },
      {
        id: "settings-preferences",
        name: "Preference cards",
        description:
          "One control per card, one shared width, each applied the moment it changes and confirmed with a toast. A long list — time zones — takes a searchable combobox instead of a select.",
        preview: <SettingsPreferencesDemo />,
        source: dm("settings-preferences-demo"),
      },
    ],
};

export default content;
