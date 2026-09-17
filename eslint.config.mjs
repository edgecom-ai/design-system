import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import { defineConfig, globalIgnores } from "eslint/config";

// Framework-neutral replacement for `eslint-config-next`, which was the last
// thing keeping `next` in the dependency tree after the Vite + TanStack Router
// migration. The rule set it actually contributed here is reproduced from the
// upstream plugins directly: react-hooks (including the compiler rules that
// flag TanStack Table's non-memoizable API), react, jsx-a11y, and
// typescript-eslint. React does not need to be in scope for JSX, hence
// react/react-in-jsx-scope off and the new-JSX-transform settings.
export default defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    // Machine-local build outputs for the Claude Design converter
    // (see .design-sync/README.md). Git-ignored, generated, never hand-edited —
    // linting them buries the src findings under hundreds of generated errors.
    // .design-sync/previews/ is deliberately NOT ignored: those are
    // hand-authored source and should be held to the same bar as src/.
    ".ds-sync/**",
    "ds-bundle/**",
    "dist/**",
    ".design-sync/.cache/**",
    ".design-sync/bundle/**",
  ]),

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx,mts,js,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      // `cmdk-empty` is cmdk's own attribute contract, not a typo.
      "react/no-unknown-property": ["error", { ignore: ["cmdk-empty"] }],
      "react/prop-types": "off",
      // The registry ships into consumer trees that build with noUnusedLocals,
      // so an unused binding is a hard error there (see tsconfig.json). Keep it
      // visible here, but allow the _-prefix escape hatch for deliberate ones.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // jsx-a11y at warn, not error.
  //
  // `eslint-config-next` enabled only a subset of these rules, so the 51
  // findings they report are all pre-existing and none of them were ever
  // surfaced by the old gate — warning on them is strictly more than before.
  // They are real and worth fixing, but accessibility gates are their own
  // planned work (plan §7 Phase 5: axe scans, focused interaction tests), and
  // turning 51 untouched findings in shipped primitives into hard errors would
  // hold every unrelated change hostage. Promote to "error" when Phase 5 lands.
  {
    files: ["**/*.{ts,tsx}"],
    rules: Object.fromEntries(
      Object.keys(jsxA11y.flatConfigs.recommended.rules).map((r) => [r, "warn"]),
    ),
  },

  // Generated and vendored code: the studio demos are upstream files kept
  // diffable, and the generated modules are outputs whose style is not ours.
  {
    files: ["src/docs/generated/**", "src/components/shadcn-studio/**"],
    rules: {
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Build scripts are node ESM, not browser React.
  {
    files: ["scripts/**/*.mjs", "*.config.{ts,mjs}"],
    languageOptions: { globals: globals.node },
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
]);
