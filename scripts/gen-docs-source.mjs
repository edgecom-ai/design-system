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
import { createHash } from "node:crypto";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { codeToHtml } from "shiki";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src");
const OUT = join(ROOT, "public", "docs-source");
// Content hashes of the inputs that produced the current outputs. Highlighting
// 273 files with Shiki is the slowest step in `docs:gen` (~2.8 s of ~6 s), and
// `predev` runs the whole chain on every `pnpm dev` — so re-highlighting files
// that have not changed is most of the dev-loop latency this buys back.
// Git-ignored with the rest of public/docs-source/.
const MANIFEST = join(OUT, ".hashes.json");

const sha = (text) => createHash("sha256").update(text).digest("hex").slice(0, 16);

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
  // Previous run's input hashes. Any failure to read them (first run, corrupt
  // file, changed shape) just means a full rebuild — never a stale output.
  let previous = {};
  try {
    const raw = JSON.parse(await readFile(MANIFEST, "utf8"));
    if (raw && raw.v === 1 && raw.files) previous = raw.files;
  } catch {
    /* no usable manifest — rebuild everything */
  }

  const current = {};
  let written = 0;
  let reused = 0;

  for (const dir of SCAN_DIRS) {
    const files = await walk(dir);
    for (const file of files) {
      const code = await readFile(file, "utf8");
      const key = relative(SRC, file).split("\\").join("/"); // posix key
      const outFile = join(OUT, `${key}.json`);
      const hash = sha(code);
      current[key] = hash;

      // Unchanged input AND the output still on disk — the output is a pure
      // function of the input, so there is nothing to redo. Both conditions
      // matter: a manifest alone would happily "skip" a file someone deleted.
      if (previous[key] === hash && (await exists(outFile))) {
        reused++;
        continue;
      }

      const html = await codeToHtml(code, {
        lang: "tsx",
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false, // emit CSS variables so the .dark toggle can recolor
      });
      await mkdir(dirname(outFile), { recursive: true });
      await writeFile(outFile, JSON.stringify({ code, html }), "utf8");
      written++;
    }
  }

  // Outputs whose source is gone. Removed by key rather than by wiping OUT, so
  // an incremental run stays incremental — and a deleted demo still stops being
  // served, which a hash check alone would miss.
  let removed = 0;
  for (const key of Object.keys(previous)) {
    if (key in current) continue;
    await rm(join(OUT, `${key}.json`), { force: true });
    removed++;
  }

  await mkdir(OUT, { recursive: true });
  await writeFile(MANIFEST, JSON.stringify({ v: 1, files: current }), "utf8");

  const parts = [`${written} written`, `${reused} unchanged`];
  if (removed) parts.push(`${removed} removed`);
  console.log(`docs:source — ${parts.join(", ")} in public/docs-source/`);
}

async function exists(p) {
  try {
    await readFile(p);
    return true;
  } catch {
    return false;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
