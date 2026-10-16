// Plans the publish of the built design-system artifact (`pnpm design:artifact`)
// to its Design System artifact on claude.ai. Claude Code does the publishing —
// only its Artifact tool can write an artifact — and this script decides what
// it sends, so the calls are the same every time:
//
//   node scripts/plan-design-publish.mjs --live <dir>   an existing system; <dir>
//        holds what was read back from it: project/design-system.json (its live
//        index) and, for a system migrated from standalone Claude Design,
//        project/migration-map.json (every path the migration carried)
//   node scripts/plan-design-publish.mjs --new          a system just created
//        from the Design System type, with no files yet
//
// Writes .design-sync/artifact/publish-plan.json:
//   { index, calls: [{ files: { "project/<path>": "project/<path>" | { from, contentType } | null } }] }
// Each call is one Artifact publish with `root: ".design-sync/artifact"` and
// that `files` map (null removes the path); `index` goes as `file_path` on the
// LAST call, never earlier — the type's rule, so a half-finished publish never
// names files that are not there yet.
//
// The index is merged, not replaced: every key the live index has stays unless
// this build owns it (title, namespace, libraries, docs, lastChange). A
// migrated system's `editing` and `source` are dropped — they hold the page
// read-only and offer "Finish the migration", which this publish is.
// Deletes are the live paths this build no longer writes, except the asset
// store's files under project/assets/ (uploads and the migration's own notes),
// which are not ours to remove.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const out = resolve(root, ".design-sync/artifact")
const project = join(out, "project")
const PER_CALL = 255

const args = process.argv.slice(2)
const fresh = args.includes("--new")
const liveDir = args.includes("--live") ? resolve(args[args.indexOf("--live") + 1] ?? "") : null
if (fresh === Boolean(liveDir)) {
  console.error("plan-design-publish: pass exactly one of --new or --live <dir>")
  process.exit(1)
}
if (!existsSync(join(out, "index-fields.json"))) {
  console.error("plan-design-publish: no build — run `pnpm design:artifact` first")
  process.exit(1)
}

const walk = (dir) =>
  readdirSync(dir).flatMap((e) => {
    const p = join(dir, e)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
const built = walk(project).map((p) => `project/${relative(project, p)}`).filter((p) => p !== "project/design-system.json")

const ours = JSON.parse(readFileSync(join(out, "index-fields.json"), "utf8"))
let index
let live = []
if (fresh) {
  index = { ...ours, createdOnFiles: { v: 1, at: new Date().toISOString() }, sections: {}, groups: [], assetGroups: {}, blobs: {}, docs: { sections: [] } }
} else {
  const liveIndex = join(liveDir, "project/design-system.json")
  if (!existsSync(liveIndex)) {
    console.error(`plan-design-publish: ${relative(root, liveIndex)} missing — read the live index back first`)
    process.exit(1)
  }
  const current = JSON.parse(readFileSync(liveIndex, "utf8"))
  if (!current.createdOnFiles && !current.convertedFrom) {
    console.error("plan-design-publish: the live index has no createdOnFiles or convertedFrom marker — not a system's index; stopping")
    process.exit(1)
  }
  index = { ...current, ...ours }
  delete index.editing
  delete index.source
  const map = join(liveDir, "project/migration-map.json")
  if (existsSync(map)) {
    const m = JSON.parse(readFileSync(map, "utf8"))
    live = [...(m.files ?? []), ...(m.written ?? [])].map((f) => (typeof f === "string" ? f : f.path)).filter(Boolean)
    live.push("project/migration-map.json")
  }
}

const keep = new Set([...built, "project/design-system.json"])
const deletes = [...new Set(live)].filter((p) => p.startsWith("project/") && !keep.has(p) && !p.startsWith("project/assets/")).sort()
// `docs` is the page's; only a section that this publish removes leaves it.
if (index.docs?.sections) index.docs.sections = index.docs.sections.filter((s) => !deletes.includes(s))

// The Artifact tool serves a file by its extension and refuses one it does not
// know; types are documentation here, so they go as plain text.
const source = (p) => (p.endsWith(".d.ts") ? { from: p, contentType: "text/plain" } : p)
// Deletes before writes: a migrated system already sits over the type's
// 1,008-file cap, and writing first would push it further over mid-publish.
const entries = [...deletes.map((p) => [p, null]), ...built.map((p) => [p, source(p)])]
const calls = []
for (let i = 0; i < entries.length; i += PER_CALL) calls.push({ files: Object.fromEntries(entries.slice(i, i + PER_CALL)) })
// The index rides the last call as its file_path, so that call holds one path fewer.
if (Object.keys(calls.at(-1).files).length === PER_CALL) calls.push({ files: {} })

writeFileSync(join(project, "design-system.json"), `${JSON.stringify(index, null, 2)}\n`)
writeFileSync(join(out, "publish-plan.json"), `${JSON.stringify({ index: "project/design-system.json", calls }, null, 2)}\n`)
console.log(
  `plan-design-publish — ${built.length} writes, ${deletes.length} deletes in ${calls.length} call(s), index last → ${relative(root, join(out, "publish-plan.json"))}`,
)
