// Compares two folders of route screenshots and reports what changed.
//
// `verify:docs` proves a page renders; it cannot say the page looks right. Two
// card defects — a type scale that printed ` / ` for every size, a radius card
// that rounded three steps of seven — passed every gate and were caught only by
// someone rendering them by hand. This makes that render routine: CI screenshots
// every route in both themes on every run, and on a pull request compares them
// with the last green run on `main`, so a visual change is a diff image in the
// job summary rather than a surprise on the live site.
//
//   node scripts/compare-shots.mjs <baseline-dir> <current-dir> [--out <diff-dir>]
//        [--threshold 0.1] [--max-ratio 0.002] [--summary <file>] [--fail-on-change]
//
// Both folders are what `pnpm verify:docs --shots <dir>` writes: `<theme>/<route>.png`.
// A pair is "changed" when more than `--max-ratio` of its pixels differ at
// pixelmatch's `--threshold` (0–1, YIQ colour distance). A route only in the
// current folder is "new", one only in the baseline is "removed"; neither is a
// change. Sizes may differ — a longer page is padded, and the added area counts.
//
// The exit code is 0 unless `--fail-on-change` is passed: a visual change is
// usually intended, so the report is the product and the reviewer is the gate.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, appendFileSync } from "node:fs"
import { join, relative, dirname } from "node:path"
import pixelmatch from "pixelmatch"
import { PNG } from "pngjs"

const argv = process.argv.slice(2)
const VALUED = new Set(["--out", "--threshold", "--max-ratio", "--summary"])
const positional = []
for (let i = 0; i < argv.length; i++) {
  if (VALUED.has(argv[i])) i++
  else if (!argv[i].startsWith("--")) positional.push(argv[i])
}
function opt(name, fallback) {
  const i = argv.indexOf(name)
  return i === -1 ? fallback : argv[i + 1]
}
const [baselineDir, currentDir] = positional
if (!baselineDir || !currentDir) {
  console.error("usage: node scripts/compare-shots.mjs <baseline-dir> <current-dir> [--out <diff-dir>] [--threshold 0.1] [--max-ratio 0.002] [--summary <file>] [--fail-on-change]")
  process.exit(2)
}
const outDir = opt("--out", null)
const threshold = Number(opt("--threshold", "0.1"))
const maxRatio = Number(opt("--max-ratio", "0.002"))
const summaryFile = opt("--summary", null)
const failOnChange = argv.includes("--fail-on-change")

function pngs(dir) {
  const found = []
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name)
      if (statSync(p).isDirectory()) walk(p)
      else if (name.endsWith(".png")) found.push(relative(dir, p))
    }
  }
  if (existsSync(dir)) walk(dir)
  return new Set(found)
}

// pixelmatch needs equal dimensions; pad the smaller image with transparent
// pixels so a page that grew shows its new rows as a difference.
function pad(png, width, height) {
  if (png.width === width && png.height === height) return png
  const out = new PNG({ width, height })
  PNG.bitblt(png, out, 0, 0, png.width, png.height, 0, 0)
  return out
}

const base = pngs(baselineDir)
const cur = pngs(currentDir)
const rows = []
for (const rel of [...cur].sort()) {
  if (!base.has(rel)) {
    rows.push({ rel, kind: "new" })
    continue
  }
  const a = PNG.sync.read(readFileSync(join(baselineDir, rel)))
  const b = PNG.sync.read(readFileSync(join(currentDir, rel)))
  const width = Math.max(a.width, b.width)
  const height = Math.max(a.height, b.height)
  const pa = pad(a, width, height)
  const pb = pad(b, width, height)
  const diff = new PNG({ width, height })
  const differing = pixelmatch(pa.data, pb.data, diff.data, width, height, { threshold, includeAA: false })
  const ratio = differing / (width * height)
  const sized = a.width !== b.width || a.height !== b.height
  const changed = ratio > maxRatio
  rows.push({ rel, kind: changed ? "changed" : "same", ratio, differing, sized, from: `${a.width}×${a.height}`, to: `${b.width}×${b.height}` })
  if (changed && outDir) {
    const p = join(outDir, rel)
    mkdirSync(dirname(p), { recursive: true })
    writeFileSync(p, PNG.sync.write(diff))
  }
}
for (const rel of [...base].sort()) if (!cur.has(rel)) rows.push({ rel, kind: "removed" })

const changed = rows.filter((r) => r.kind === "changed")
const added = rows.filter((r) => r.kind === "new")
const removed = rows.filter((r) => r.kind === "removed")
const same = rows.filter((r) => r.kind === "same")

const pct = (r) => `${(r.ratio * 100).toFixed(2)}%`
const lines = []
lines.push(`compare-shots — ${same.length} unchanged · ${changed.length} changed · ${added.length} new · ${removed.length} removed (threshold ${threshold}, max ratio ${maxRatio})`)
for (const r of changed) lines.push(`  CHANGED ${r.rel.padEnd(50)} ${pct(r).padStart(7)} of pixels${r.sized ? ` · size ${r.from} → ${r.to}` : ""}`)
for (const r of added) lines.push(`  new     ${r.rel}`)
for (const r of removed) lines.push(`  removed ${r.rel}`)
console.log(lines.join("\n"))
if (changed.length && outDir) console.log(`  diff images in ${outDir}/`)

if (summaryFile) {
  const md = []
  md.push(`### Screenshots vs. the last green \`main\` run`)
  md.push("")
  md.push(`${same.length} unchanged · **${changed.length} changed** · ${added.length} new · ${removed.length} removed`)
  md.push("")
  if (changed.length) {
    md.push("| Route | Theme | Pixels changed | Size |")
    md.push("|---|---|---|---|")
    for (const r of changed) {
      const [theme, ...rest] = r.rel.split("/")
      md.push(`| \`${rest.join("/").replace(/\.png$/, "").replace(/__/g, "/")}\` | ${theme} | ${pct(r)} | ${r.sized ? `${r.from} → ${r.to}` : "same"} |`)
    }
    md.push("")
    md.push(`Diff images are in the \`docs-shot-diffs\` artifact; the screenshots themselves in \`docs-shots\`.`)
  }
  if (added.length) md.push(`\nNew routes: ${added.map((r) => `\`${r.rel}\``).join(", ")}`)
  if (removed.length) md.push(`\nRemoved routes: ${removed.map((r) => `\`${r.rel}\``).join(", ")}`)
  appendFileSync(summaryFile, md.join("\n") + "\n")
}

if (process.env.GITHUB_ACTIONS) for (const r of changed) console.log(`::warning title=Screenshot changed::${r.rel} — ${pct(r)} of pixels differ from the last green main run`)

process.exit(failOnChange && changed.length ? 1 : 0)
