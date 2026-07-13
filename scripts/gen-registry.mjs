// Generates registry.json from the source of truth:
//   - theme item  <- src/app/globals.css (@theme mappings + :root/.dark tokens) + lib/utils
//   - one registry:ui item per src/components/ui/*.tsx, with npm dependencies,
//     cross-component registryDependencies, and any hooks it uses, all derived
//     from the file's imports. Every component depends on @edgecom/theme.
// Then run `npx shadcn build` to emit the served public/r/*.json.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const uiDir = resolve(root, "src/components/ui");

// --- parse globals.css into cssVars -----------------------------------------
const css = readFileSync(resolve(root, "src/app/globals.css"), "utf8");

function blockVars(re) {
  const m = css.match(re);
  if (!m) return {};
  const vars = {};
  for (const d of m[1].matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    vars[d[1]] = d[2].trim();
  }
  return vars;
}

const themeVars = blockVars(/@theme[^{]*\{([\s\S]*?)\n\}/);
const lightVars = blockVars(/^:root\s*\{([\s\S]*?)\n\}/m);
const darkVars = blockVars(/^\.dark\s*\{([\s\S]*?)\n\}/m);

// --- import analysis --------------------------------------------------------
function pkgOf(spec) {
  if (spec.startsWith("@")) {
    const [scope, name] = spec.split("/");
    return `${scope}/${name}`;
  }
  return spec.split("/")[0];
}

function analyze(src) {
  const specs = new Set();
  for (const m of src.matchAll(/from\s*"([^"]+)"/g)) specs.add(m[1]);
  for (const m of src.matchAll(/import\s*"([^"]+)"/g)) specs.add(m[1]);

  const npm = new Set();
  const uiDeps = new Set();
  const hooks = new Set();
  for (const s of specs) {
    if (s.startsWith("@/components/ui/")) {
      uiDeps.add(s.replace("@/components/ui/", "").split("/")[0]);
    } else if (s.startsWith("@/hooks/")) {
      hooks.add(s.replace("@/hooks/", "").split("/")[0]);
    } else if (s.startsWith("@/") || s.startsWith(".") || s.startsWith("/")) {
      // other local (@/lib/utils comes via the theme item)
    } else if (s === "react" || s === "react-dom" || s.startsWith("react/") || s.startsWith("react-dom/")) {
      // provided by the app
    } else {
      npm.add(pkgOf(s));
    }
  }
  return { npm: [...npm].sort(), uiDeps: [...uiDeps].sort(), hooks: [...hooks].sort() };
}

const titleCase = (s) =>
  s.replace(/(^|-)([a-z])/g, (_, sep, c) => (sep ? " " : "") + c.toUpperCase()).trim();

// --- theme item -------------------------------------------------------------
const theme = {
  name: "theme",
  type: "registry:theme",
  title: "Edgecom Theme",
  description:
    "Edgecom Energy design tokens (light + dark), Tailwind theme mappings, and the cn() utility. Installed automatically as a dependency of every @edgecom component.",
  dependencies: ["clsx", "tailwind-merge"],
  files: [{ path: "src/lib/utils.ts", type: "registry:lib" }],
  cssVars: { theme: themeVars, light: lightVars, dark: darkVars },
};

// --- component items --------------------------------------------------------
const items = [theme];

const uiFiles = readdirSync(uiDir)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => f.replace(/\.tsx$/, ""))
  .sort();

for (const name of uiFiles) {
  const src = readFileSync(resolve(uiDir, `${name}.tsx`), "utf8");
  const { npm, uiDeps, hooks } = analyze(src);

  const files = [{ path: `src/components/ui/${name}.tsx`, type: "registry:ui" }];
  for (const h of hooks) files.push({ path: `src/hooks/${h}.ts`, type: "registry:hook" });

  const registryDependencies = [
    "@edgecom/theme",
    ...uiDeps.filter((d) => d !== name).map((d) => `@edgecom/${d}`),
  ];

  items.push({
    name,
    type: "registry:ui",
    title: titleCase(name),
    description: `The Edgecom ${titleCase(name)} component.`,
    ...(npm.length ? { dependencies: npm } : {}),
    registryDependencies,
    files,
  });
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "edgecom",
  homepage: "https://registry.edgecom.ai",
  items,
};

writeFileSync(resolve(root, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(
  `gen-registry — ${items.length} items (1 theme + ${uiFiles.length} components), ` +
    `${Object.keys(lightVars).length} light / ${Object.keys(darkVars).length} dark / ` +
    `${Object.keys(themeVars).length} theme vars`
);
