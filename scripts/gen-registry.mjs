// Generates the shadcn registry as a PUBLIC GitHub registry (see
// https://ui.shadcn.com/docs/registry/github). Consumers install with:
//
//   pnpm dlx shadcn@latest add edgecom-ai/design-system/button
//
// The CLI reads registry.json from the repo root, follows its `include` list to
// each chunk, then fetches the source files a chunk references straight from the
// repo. No hosting/auth — the public repo *is* the registry.
//
// Layout — the root registry.json is tiny and just `include`s one chunk per
// source directory. shadcn requires every included path to be named
// `registry.json`, and a chunk may only ship files inside its own directory
// (no `../`), so each chunk lives right beside the source it distributes:
//   src/lib/registry.json           -> theme: ships src/lib/utils.ts + cssVars
//   src/components/ui/registry.json  -> every component: ships <name>.tsx
//   src/hooks/registry.json          -> hooks: ships <hook>.ts
//
// Source of truth:
//   - theme       <- src/app/globals.css (@theme mappings + :root/.dark tokens) + lib/utils
//   - one item per src/components/ui/*.tsx, with package dependencies, cross-component
//     registryDependencies and hook registryDependencies derived from its imports.
//     Every component depends on the theme. Package dependencies carry the
//     version range this repo builds against, plus any @types companion the
//     package needs (see scripts/lib/deps.mjs).
// Then `pnpm exec shadcn build` flattens the include tree into public/r/*.json.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { specifiersOf, classify } from "./lib/imports.mjs";
import { withVersion, typesFor } from "./lib/deps.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const uiDir = resolve(root, "src/components/ui");
const hooksDir = resolve(root, "src/hooks");
const libDir = resolve(root, "src/lib");

// Public GitHub repo this registry is published from. Cross-item dependencies
// are full GitHub addresses so `shadcn add edgecom-ai/design-system/<name>`
// resolves them with zero consumer configuration.
const GITHUB_REPO = process.env.REGISTRY_GITHUB_REPO || "edgecom-ai/design-system";
const HOMEPAGE = `https://github.com/${GITHUB_REPO}`;
const REGISTRY_SCHEMA = "https://ui.shadcn.com/schema/registry.json";
const ref = (name) => `${GITHUB_REPO}/${name}`;

// --- parse globals.css into cssVars -----------------------------------------
const css = readFileSync(resolve(root, "src/app/globals.css"), "utf8");

function blockVars(re) {
  const m = css.match(re);
  if (!m) return {};
  const vars = {};
  for (const d of m[1].matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    // Values may wrap across lines (e.g. font stacks); ship them on one line.
    vars[d[1]] = d[2].trim().replace(/\s+/g, " ");
  }
  return vars;
}

const themeVars = blockVars(/@theme[^{]*\{([\s\S]*?)\n\}/);
const lightVars = blockVars(/^:root\s*\{([\s\S]*?)\n\}/m);
const darkVars = blockVars(/^\.dark\s*\{([\s\S]*?)\n\}/m);

// --- import analysis --------------------------------------------------------
// The scanner is shared with scripts/check-registry.mjs so the derivation and
// the audit can never disagree about what a file imports (#35).
function analyze(src, source) {
  const pkgs = new Set();
  const uiDeps = new Set();
  const hooks = new Set();
  for (const spec of specifiersOf(src, source)) {
    const { kind, name } = classify(spec);
    if (kind === "ui") uiDeps.add(name);
    else if (kind === "hook") hooks.add(name);
    else if (kind === "pkg") pkgs.add(name);
  }
  return { pkgs: [...pkgs].sort(), uiDeps: [...uiDeps].sort(), hooks: [...hooks].sort() };
}

// A package whose declarations live in a separate @types package needs that
// companion installed too, or a strict consumer can't compile the file we just
// shipped them. The registry has a `devDependencies` field for exactly this.
const typeCompanions = (pkgs) =>
  pkgs
    .map(typesFor)
    .filter(Boolean)
    .sort()
    .map(withVersion);

const titleCase = (s) =>
  s.replace(/(^|-)([a-z])/g, (_, sep, c) => (sep ? " " : "") + c.toUpperCase()).trim();

// A chunk is a standalone mini-registry (name/homepage inherited from root)
// written as `<dir>/registry.json`, declaring every item whose files live in
// that directory. `include` in the root registry.json points at these files.
function writeChunk(dir, items) {
  writeFileSync(
    resolve(dir, "registry.json"),
    JSON.stringify({ $schema: REGISTRY_SCHEMA, items }, null, 2) + "\n"
  );
}

const include = [];

// --- theme chunk (beside src/lib/utils.ts) ----------------------------------
writeChunk(libDir, [
  {
    name: "theme",
    type: "registry:theme",
    title: "Edgecom Theme",
    description:
      "Edgecom Energy design tokens (light + dark), Tailwind theme mappings, and the cn() utility. Installed automatically as a dependency of every Edgecom component.",
    dependencies: ["clsx", "tailwind-merge"].map(withVersion),
    files: [{ path: "utils.ts", type: "registry:lib" }],
    cssVars: { theme: themeVars, light: lightVars, dark: darkVars },
  },
]);
include.push("src/lib/registry.json");

// --- component chunk (beside src/components/ui/*.tsx) -----------------------
const uiFiles = readdirSync(uiDir)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => f.replace(/\.tsx$/, ""))
  .sort();

const usedHooks = new Set();
const componentItems = [];

for (const name of uiFiles) {
  const src = readFileSync(resolve(uiDir, `${name}.tsx`), "utf8");
  const { pkgs, uiDeps, hooks } = analyze(src, `${name}.tsx`);
  hooks.forEach((h) => usedHooks.add(h));

  // Hooks live in another directory, so a component can't ship the hook file in
  // its own chunk — it depends on the hook's registry item instead.
  const registryDependencies = [
    ref("theme"),
    ...uiDeps.filter((d) => d !== name).map(ref),
    ...hooks.map(ref),
  ];

  componentItems.push({
    name,
    type: "registry:ui",
    title: titleCase(name),
    description: `The Edgecom ${titleCase(name)} component.`,
    ...(pkgs.length ? { dependencies: pkgs.map(withVersion) } : {}),
    ...(typeCompanions(pkgs).length
      ? { devDependencies: typeCompanions(pkgs) }
      : {}),
    registryDependencies,
    files: [{ path: `${name}.tsx`, type: "registry:ui" }],
  });
}
writeChunk(uiDir, componentItems);
include.push("src/components/ui/registry.json");

// --- hook chunk (beside src/hooks/*.ts) -------------------------------------
// Hooks get the same import-derived dependencies as components — a hook that
// reaches for a package or a sibling component has to declare it too.
//
// Worked transitively: a hook another hook imports is a registryDependency, and
// a dependency the registry never emits an item for is one `shadcn add` follows
// to nothing. Components seed the list; each hook can add more.
const hookItems = [];
const seenHooks = new Set();
const hookQueue = [...usedHooks].sort();

while (hookQueue.length) {
  const hook = hookQueue.shift();
  if (seenHooks.has(hook)) continue;
  seenHooks.add(hook);

  const src = readFileSync(resolve(hooksDir, `${hook}.ts`), "utf8");
  const { pkgs, uiDeps, hooks } = analyze(src, `${hook}.ts`);
  for (const h of hooks) if (h !== hook && !seenHooks.has(h)) hookQueue.push(h);

  const registryDependencies = [
    ...uiDeps.map(ref),
    ...hooks.filter((h) => h !== hook).map(ref),
  ];
  hookItems.push({
    name: hook,
    type: "registry:hook",
    title: titleCase(hook),
    description: `The Edgecom ${titleCase(hook)} hook.`,
    ...(pkgs.length ? { dependencies: pkgs.map(withVersion) } : {}),
    ...(typeCompanions(pkgs).length
      ? { devDependencies: typeCompanions(pkgs) }
      : {}),
    ...(registryDependencies.length ? { registryDependencies } : {}),
    files: [{ path: `${hook}.ts`, type: "registry:hook" }],
  });
}
hookItems.sort((a, b) => a.name.localeCompare(b.name));
if (hookItems.length) {
  writeChunk(hooksDir, hookItems);
  include.push("src/hooks/registry.json");
}

// --- root registry.json (index only) ----------------------------------------
const registry = {
  $schema: REGISTRY_SCHEMA,
  name: "edgecom",
  homepage: HOMEPAGE,
  include,
};

writeFileSync(resolve(root, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(
  `gen-registry — ${include.length} chunk files · ${1 + uiFiles.length + hookItems.length} items ` +
    `(1 theme + ${uiFiles.length} components + ${hookItems.length} hooks), ` +
    `${Object.keys(lightVars).length} light / ${Object.keys(darkVars).length} dark / ` +
    `${Object.keys(themeVars).length} theme vars`
);
