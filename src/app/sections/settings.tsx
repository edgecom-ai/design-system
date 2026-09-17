"use client"

// Content for the "settings" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const SecuritySettings = React.lazy(() => import("@/components/shadcn-studio/blocks/settings-shell/security-settings"));

const AccountSettings = React.lazy(() => import("@/components/shadcn-studio/blocks/settings-shell/account-settings"));

const SettingsContent = React.lazy(() => import("@/components/shadcn-studio/blocks/settings-shell/settings-content"));

const content = {
  variants: [
      {
        id: "settings-security",
        name: "Security preferences",
        description:
          "Two-factor authentication, API key management, and active session tracking under a Security / Preferences / Users tab bar.",
        preview: <SecuritySettings />,
        source: ss("blocks/settings-shell/security-settings"),
      },
      {
        id: "settings-general",
        name: "General settings",
        description:
          "Portal name, timezone, and workspace preferences under a Portal / Preferences / Users tab bar.",
        preview: <AccountSettings />,
        source: ss("blocks/settings-shell/account-settings"),
      },
      {
        id: "settings-shell-combined",
        name: "Settings shell (nav + content)",
        description:
          "The grouped settings sub-nav beside a live content panel — how the pages look assembled into the full shell.",
        preview: <SettingsContent />,
        source: ss("blocks/settings-shell/settings-content"),
      },
    ],
};

export default content;
