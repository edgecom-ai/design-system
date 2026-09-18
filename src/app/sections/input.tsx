"use client"

// Content for the "input" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const InputDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-01"));

const InputLabelDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-02"));

const InputRequiredDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-03"));

const InputDisabledDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-04"));

const InputDefaultValueDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-07"));

const InputStartHelperTextDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-09"));

const InputErrorDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-12"));

const InputStartIconDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-14"));

const InputStartAddOnDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-19"));

const InputEndAddOnDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-20"));

const InputAddOnsDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-21"));

const InputPasswordDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-26"));

const InputFileDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-27"));

const InputClearDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-36"));

const InputSearchLoaderDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-39"));

const InputWithPlusMinusButtonsDemo = React.lazy(() => import("@/components/shadcn-studio/input/input-40"));

const content = {
  variants: [
      { id: "input-default", name: "Default", description: "A bare text field with placeholder text.", preview: <InputDemo />, source: ss("input/input-01") },
      { id: "input-label", name: "With label", description: "An input paired with an associated label.", preview: <InputLabelDemo />, source: ss("input/input-02") },
      { id: "input-required", name: "Required", description: "Marks the field as required for the user.", preview: <InputRequiredDemo />, source: ss("input/input-03") },
      { id: "input-disabled", name: "Disabled", description: "A non-interactive, dimmed field.", preview: <InputDisabledDemo />, source: ss("input/input-04") },
      { id: "input-default-value", name: "Default value", description: "Pre-populated with an initial value.", preview: <InputDefaultValueDemo />, source: ss("input/input-07") },
      { id: "input-helper-text", name: "Helper text", description: "Supporting text below the field for guidance.", preview: <InputStartHelperTextDemo />, source: ss("input/input-09") },
      { id: "input-error", name: "Error state", description: "Invalid styling with an inline error message.", preview: <InputErrorDemo />, source: ss("input/input-12") },
      { id: "input-start-icon", name: "Start icon", description: "A leading icon rendered inside the field.", preview: <InputStartIconDemo />, source: ss("input/input-14") },
      { id: "input-start-addon", name: "Start add-on", description: "A fixed prefix segment joined to the input.", preview: <InputStartAddOnDemo />, source: ss("input/input-19") },
      { id: "input-end-addon", name: "End add-on", description: "A fixed suffix segment joined to the input.", preview: <InputEndAddOnDemo />, source: ss("input/input-20") },
      { id: "input-inline-addons", name: "Inline add-ons", description: "Prefix and suffix add-ons on the same field.", preview: <InputAddOnsDemo />, source: ss("input/input-21") },
      { id: "input-password", name: "Password with toggle", description: "A password field with a show/hide toggle.", preview: <InputPasswordDemo />, source: ss("input/input-26") },
      { id: "input-file", name: "File input", description: "A styled file-selection control.", preview: <InputFileDemo />, source: ss("input/input-27") },
      { id: "input-clearable", name: "Clearable", description: "A clear button appears once text is entered.", preview: <InputClearDemo />, source: ss("input/input-36") },
      { id: "input-search-loader", name: "Search with loader", description: "A search field showing a loading spinner.", preview: <InputSearchLoaderDemo />, source: ss("input/input-39") },
      { id: "input-stepper", name: "Stepper (plus / minus)", description: "A numeric input with increment and decrement buttons.", preview: <InputWithPlusMinusButtonsDemo />, source: ss("input/input-40") },
    ],
};

export default content;
