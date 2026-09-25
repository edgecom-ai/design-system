// Regenerates the component catalog inside public/llms.txt from the docs
// sections declared in src/app/sections.tsx, so the discovery index for
// agents (served at https://design.edgecom.ai/llms.txt) never drifts from the
// actual doc pages.
//
// Only the block between the `@@GENERATED:catalog` and `@@GENERATED:catalog-end`
// HTML-comment markers is rewritten — the hand-authored intro, Guides, and
// Notes sections are preserved.
//
// Parsing mirrors gen-routes.mjs: top-level section fields are indented exactly
// four spaces (deeper-indented `toc` ids are ignored). `description` may be
// inline or on the following line(s) as `+`-concatenated strings.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { freshness, forced } from "./lib/stale.mjs";
import { groupSlug } from "./lib/sections.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Skip the work when nothing this generator reads has moved (see lib/stale.mjs).
// `--force` / DOCS_GEN_FORCE=1 rebuilds regardless.
const stamp = freshness({
  name: "llms",
  inputs: ["src/app/sections.tsx", "scripts/gen-llms.mjs", "scripts/lib/sections.mjs"],
  outputs: ["public/llms.txt"],
});
if (stamp.fresh && !forced()) {
  console.log("gen-llms — up to date — skipped");
  process.exit(0);
}

const src = readFileSync(resolve(root, "src/app/sections.tsx"), "utf8");
const llmsPath = resolve(root, "public/llms.txt");

const BASE = "https://design.edgecom.ai";
// Display order of the top-level groups.
const GROUP_ORDER = ["Getting Started", "Foundations", "Components", "Blocks"];

// --- scan sections.tsx ------------------------------------------------------
const lines = src.split("\n");
const start = lines.findIndex((l) => l.includes("const sections: Section[]"));

const sections = [];
let cur = null;
let awaitingDesc = false;
for (const l of lines.slice(start)) {
  const idm = l.match(/^\s{4}id:\s*"([^"]+)"/);
  if (idm) {
    cur = { id: idm[1], label: idm[1], group: null, description: "" };
    sections.push(cur);
    awaitingDesc = false;
    continue;
  }
  if (!cur) continue;

  const lm = l.match(/^\s{4}label:\s*"([^"]+)"/);
  if (lm) {
    cur.label = lm[1];
    continue;
  }
  const gm = l.match(/^\s{4}group:\s*"([^"]+)"/);
  if (gm) {
    cur.group = gm[1];
    continue;
  }
  const dInline = l.match(/^\s{4}description:\s*"((?:[^"\\]|\\.)*)"/);
  if (dInline) {
    cur.description = dInline[1];
    continue;
  }
  if (/^\s{4}description:\s*$/.test(l)) {
    awaitingDesc = true;
    continue;
  }
  if (awaitingDesc) {
    const dm = l.match(/"((?:[^"\\]|\\.)*)"/);
    if (dm) cur.description += dm[1];
    if (!/\+\s*$/.test(l)) awaitingDesc = false; // no trailing "+" → end of concatenated string
    continue;
  }
}

// --- build the catalog ------------------------------------------------------
const known = new Set(GROUP_ORDER);
const groups = [...GROUP_ORDER, ...[...new Set(sections.map((s) => s.group))].filter((g) => g && !known.has(g))];

const out = [];
out.push(
  "<!-- @@GENERATED:catalog — grouped from src/app/sections.tsx by scripts/gen-llms.mjs (run `pnpm docs:gen`); do not hand-edit until the closing marker -->"
);
let count = 0;
for (const group of groups) {
  const items = sections.filter((s) => s.group === group);
  if (!items.length) continue;
  out.push("");
  out.push(`## ${group}`);
  out.push("");
  for (const s of items) {
    const url = `${BASE}/${groupSlug(group)}/${s.id}/`;
    const desc = s.description.trim();
    out.push(`- [${s.label}](${url})${desc ? `: ${desc}` : ""}`);
    count++;
  }
}
out.push("");
out.push("<!-- @@GENERATED:catalog-end -->");
const block = out.join("\n");

// --- inject into public/llms.txt --------------------------------------------
const txt = readFileSync(llmsPath, "utf8");
// The end marker must carry the `<!-- ` prefix so this does not accidentally
// match the `@@GENERATED:catalog-end` that could appear inside the start marker.
const re = /<!-- @@GENERATED:catalog\b[\s\S]*?<!-- @@GENERATED:catalog-end -->/;
if (!re.test(txt)) {
  throw new Error("gen-llms: @@GENERATED:catalog…@@GENERATED:catalog-end markers not found in public/llms.txt");
}
writeFileSync(llmsPath, txt.replace(re, block));
console.log(`gen-llms — ${count} sections across ${groups.filter((g) => sections.some((s) => s.group === g)).length} groups → public/llms.txt`);

stamp.save();
