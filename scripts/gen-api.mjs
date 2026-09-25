// Extracts the API reference structure for every component whose section id
// matches a src/components/ui/<id>.tsx primitive:
//   - base       the wrapped Base UI primitive (+ docs link), from the import
//   - parts      exported PascalCase component names
//   - props      cva variant groups -> { options, default } as prop rows
// Then Shiki-highlights all code-ish strings (part names, types, defaults) with
// the SAME github dual-theme as the Code tabs, so the API tables match them.
//
// Output:
//   src/docs/generated/api.ts            (structure, keyed by section id)
//   src/docs/generated/api-highlight.ts  ({ rawString: inline shiki html })

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { codeToHtml } from "shiki";
import { readdirSync } from "node:fs";
import { freshness, forced } from "./lib/stale.mjs";
import { parseSections, ALIAS_FILE } from "./lib/sections.mjs";
import { extractCva } from "./lib/cva.mjs";
import { exportedParts } from "./lib/contracts.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const uiDir = resolve(root, "src/components/ui");

// Skip the work when nothing this generator reads has moved (see lib/stale.mjs).
// Every primitive is an input: the props table is derived from their sources.
const stamp = freshness({
  name: "api",
  inputs: [
    "src/app/sections.tsx",
    "src/docs/api.ts",
    "scripts/gen-api.mjs",
    "scripts/lib/sections.mjs",
    "scripts/lib/cva.mjs",
    ...readdirSync(uiDir)
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => `src/components/ui/${f}`),
  ],
  outputs: ["src/docs/generated/api.ts", "src/docs/generated/api-highlight.ts"],
});
if (stamp.fresh && !forced()) {
  console.log("gen-api — up to date — skipped");
  process.exit(0);
}


// @base-ui imports that are utilities, not documentable Base UI components.
const baseDenylist = new Set(["merge-props", "use-render"]);

// --- discover which section ids map to a primitive ------------------------
const sectionsSrc = readFileSync(resolve(root, "src/app/sections.tsx"), "utf8");
// Every section, in any group — extract() returns null where no primitive backs it,
// so a Blocks page that documents one (the application shell) gets its API too.
const componentIds = parseSections(sectionsSrc).map((s) => s.id);

// --- helpers ---------------------------------------------------------------
const titleCase = (slug) =>
  slug.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());

function extract(id) {
  const file = resolve(uiDir, `${ALIAS_FILE[id] ?? id}.tsx`);
  if (!existsSync(file)) return null;
  const src = readFileSync(file, "utf8");

  // base primitive
  const baseSlug = src.match(/@base-ui\/react\/([a-z-]+)/)?.[1];
  const base = baseSlug && !baseDenylist.has(baseSlug)
    ? {
        name: `Base UI ${titleCase(baseSlug)}`,
        url: `https://base-ui.com/react/components/${baseSlug}`,
      }
    : undefined;

  // parts: PascalCase names from the export block(s) — the same reader the
  // contracts use for a primitive with no section, so the two cannot disagree.
  const partList = exportedParts(src);
  const mainPart =
    partList.find((p) => p.toLowerCase() === id.replace(/-/g, "")) ??
    partList[0] ??
    titleCase(id);

  // props: cva variant groups, via the one cva reader (lib/cva.mjs). The
  // local reader this replaced tracked quotes but not comments, so a single
  // apostrophe in a comment inside the variants object — "can't" in button's —
  // swallowed the rest of the block and the component documented no props.
  //
  // The cva belongs to the part its constant is named for — `selectTriggerVariants`
  // sizes SelectTrigger, `alertDialogContentVariants` sizes AlertDialogContent —
  // and only falls back to the root part when the name matches no export.
  const props = [];
  const cva = extractCva(src);
  if (cva) {
    const owner = src.match(/const\s+(\w+)Variants\s*=\s*cva\(/)?.[1];
    const ownerPart = owner && partList.find((p) => p.toLowerCase() === owner.toLowerCase());
    for (const [group, entries] of Object.entries(cva.groups)) {
      const options = Object.keys(entries);
      if (!options.length) continue;
      props.push({
        part: ownerPart ?? mainPart,
        name: group,
        type: options.map((o) => `"${o}"`).join(" | "),
        default: cva.defaults[group] ? `"${cva.defaults[group]}"` : undefined,
      });
    }
  }

  return { base, parts: partList, props };
}

const generated = {};
for (const id of componentIds) {
  const api = extract(id);
  if (api && (api.parts.length || api.props.length)) generated[id] = api;
}

// --- collect every code-ish string to highlight ---------------------------
const strings = new Set();
for (const api of Object.values(generated)) {
  api.parts.forEach((p) => strings.add(p));
  for (const pr of api.props) {
    strings.add(pr.part);
    strings.add(pr.name);
    strings.add(pr.type);
    if (pr.default) strings.add(pr.default);
  }
}
// plus curated api.ts code strings (name/part/type/default)
const apiSrc = readFileSync(resolve(root, "src/docs/api.ts"), "utf8");
for (const m of apiSrc.matchAll(/\b(?:name|part|type|default):\s*(`[^`]*`|"[^"]*")/g))
  strings.add(m[1].slice(1, -1));

const highlight = {};
for (const code of strings) {
  highlight[code] = await codeToHtml(code, {
    lang: "tsx",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
    structure: "inline",
  });
}

// --- write -----------------------------------------------------------------
const outDir = resolve(root, "src/docs/generated");
mkdirSync(outDir, { recursive: true });

writeFileSync(
  resolve(outDir, "api.ts"),
  `// AUTO-GENERATED by scripts/gen-api.mjs — do not edit.
export type GeneratedProp = { part: string; name: string; type: string; default?: string };
export type GeneratedApi = {
  base?: { name: string; url: string };
  parts: string[];
  props: GeneratedProp[];
};
export const generatedApi: Record<string, GeneratedApi> = ${JSON.stringify(
    generated,
    null,
    2
  )};
`
);

writeFileSync(
  resolve(outDir, "api-highlight.ts"),
  `// AUTO-GENERATED by scripts/gen-api.mjs — do not edit.
export const apiHighlight: Record<string, string> = ${JSON.stringify(
    highlight,
    null,
    2
  )};
`
);

console.log(
  `gen-api — ${Object.keys(generated).length} components, ${strings.size} highlighted strings`
);

stamp.save();
