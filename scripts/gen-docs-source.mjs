// Generates per-demo source snapshots under public/docs-source/ so the docs site
// can show the exact usage-example source (raw + Shiki-highlighted dual-theme HTML)
// next to each live preview. Run via `pnpm run docs:source`.
//
// The page is a client component and cannot read the filesystem at runtime. We emit
// ONE static JSON per demo file (served from /docs-source/<path>.json) rather than a
// single bundled module, so the ComponentPreview can fetch a variant's source lazily
// when its Code tab is opened — keeping the client JS bundle lean.
//
// The JSON path mirrors the `source` key on each Variant in src/app/page.tsx, e.g.
// source "components/shadcn-studio/dialog/dialog-02.tsx"
//   -> /docs-source/components/shadcn-studio/dialog/dialog-02.tsx.json

import { readFile, readdir, writeFile, mkdir, rm } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { codeToHtml } from "shiki";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src");
const OUT = join(ROOT, "public", "docs-source");

// Directories whose .tsx files back a documented variant.
const SCAN_DIRS = [
  join(SRC, "components", "shadcn-studio"),
  join(SRC, "components", "demo"),
];

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return []; // dir may not exist
  }
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.isFile() && full.endsWith(".tsx")) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  let count = 0;

  for (const dir of SCAN_DIRS) {
    const files = await walk(dir);
    for (const file of files) {
      const code = await readFile(file, "utf8");
      const key = relative(SRC, file).split("\\").join("/"); // posix key
      const html = await codeToHtml(code, {
        lang: "tsx",
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false, // emit CSS variables so the .dark toggle can recolor
      });
      const outFile = join(OUT, `${key}.json`);
      await mkdir(dirname(outFile), { recursive: true });
      await writeFile(outFile, JSON.stringify({ code, html }), "utf8");
      count++;
    }
  }

  console.log(`docs:source — wrote ${count} demo sources to public/docs-source/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
