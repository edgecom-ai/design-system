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

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const uiDir = resolve(root, "src/components/ui");

// Sections whose primitive lives under a different filename than the section id.
const aliasFile = { list: "item", toast: "sonner" };
// @base-ui imports that are utilities, not documentable Base UI components.
const baseDenylist = new Set(["merge-props", "use-render"]);

// --- discover which section ids map to a primitive ------------------------
const sectionsSrc = readFileSync(resolve(root, "src/app/sections.tsx"), "utf8");
const lines = sectionsSrc.split("\n");
const startIdx = lines.findIndex((l) => l.includes("const sections: Section[]"));
let cur = null;
const componentIds = [];
for (const l of lines.slice(startIdx)) {
  const idm = l.match(/^\s{4}id:\s*"([^"]+)"/);
  if (idm) {
    cur = { id: idm[1], group: null };
    continue;
  }
  if (cur) {
    const gm = l.match(/^\s{4}group:\s*"([^"]+)"/);
    if (gm && !cur.group) {
      cur.group = gm[1];
      if (cur.group === "Components") componentIds.push(cur.id);
    }
  }
}

// --- helpers ---------------------------------------------------------------
const titleCase = (slug) =>
  slug.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
const pascal = (id) => titleCase(id);

const QUOTES = new Set(['"', "'", "`"]);

/** Return the object-literal text starting at the `{` after `key:`, string-aware. */
function objectAfter(src, key, from = 0) {
  const at = src.indexOf(key, from);
  if (at === -1) return null;
  const open = src.indexOf("{", at);
  if (open === -1) return null;
  let depth = 0;
  let str = null;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (str) {
      if (ch === "\\") i++;
      else if (ch === str) str = null;
      continue;
    }
    if (QUOTES.has(ch)) str = ch;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return { body: src.slice(open + 1, i), end: i };
    }
  }
  return null;
}

/**
 * Top-level keys of an object-literal body. String-aware, and only reads a key
 * when one is expected (start of body / after a depth-0 comma) so `hover:` etc.
 * inside class-string values are never mistaken for keys.
 */
function topLevelKeys(body) {
  const keys = [];
  let depth = 0;
  let str = null;
  let expectKey = true;
  let i = 0;
  while (i < body.length) {
    const ch = body[i];
    if (str) {
      if (ch === "\\") i++;
      else if (ch === str) str = null;
      i++;
      continue;
    }
    // skip comments (so `//` doesn't get mistaken for a value)
    if (ch === "/" && body[i + 1] === "/") {
      const nl = body.indexOf("\n", i);
      i = nl === -1 ? body.length : nl;
      continue;
    }
    if (ch === "/" && body[i + 1] === "*") {
      const close = body.indexOf("*/", i + 2);
      i = close === -1 ? body.length : close + 2;
      continue;
    }
    if (QUOTES.has(ch)) {
      str = ch;
      i++;
      continue;
    }
    if (ch === "{" || ch === "[" || ch === "(") {
      depth++;
      i++;
      continue;
    }
    if (ch === "}" || ch === "]" || ch === ")") {
      depth--;
      i++;
      continue;
    }
    if (depth === 0 && ch === ",") {
      expectKey = true;
      i++;
      continue;
    }
    if (depth === 0 && expectKey) {
      const m = body.slice(i).match(/^\s*(?:"([^"]+)"|'([^']+)'|([A-Za-z0-9_]+))\s*:/);
      if (m) {
        keys.push(m[1] ?? m[2] ?? m[3]);
        expectKey = false;
        i += m[0].length;
        continue;
      }
      if (/\S/.test(ch)) expectKey = false; // value started without a key match
    }
    i++;
  }
  return keys;
}

function extract(id) {
  const file = resolve(uiDir, `${aliasFile[id] ?? id}.tsx`);
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

  // parts: PascalCase names from the export block(s)
  const parts = new Set();
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const raw of m[1].split(",")) {
      const name = raw.replace(/\s+as\s+\w+/, "").trim();
      if (/^[A-Z][A-Za-z0-9]*$/.test(name)) parts.add(name);
    }
  }
  const partList = [...parts];
  const mainPart =
    partList.find((p) => p.toLowerCase() === id.replace(/-/g, "")) ??
    partList[0] ??
    pascal(id);

  // props: cva variant groups
  const props = [];
  const cvaAt = src.indexOf("cva(");
  if (cvaAt !== -1) {
    const variants = objectAfter(src, "variants:", cvaAt);
    const defs = objectAfter(src, "defaultVariants:", cvaAt);
    const defaults = {};
    if (defs) {
      for (const dm of defs.body.matchAll(
        /([A-Za-z0-9_]+)\s*:\s*"([^"]*)"/g
      ))
        defaults[dm[1]] = dm[2];
    }
    if (variants) {
      for (const group of topLevelKeys(variants.body)) {
        const groupObj = objectAfter(variants.body, `${group}:`);
        if (!groupObj) continue;
        const options = topLevelKeys(groupObj.body);
        if (!options.length) continue;
        props.push({
          part: mainPart,
          name: group,
          type: options.map((o) => `"${o}"`).join(" | "),
          default: defaults[group] ? `"${defaults[group]}"` : undefined,
        });
      }
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
