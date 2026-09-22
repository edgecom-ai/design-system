#!/usr/bin/env node
// Validates a design handoff manifest (plan §5.4) — the `<Name>.manifest.json`
// a Claude Design output ships beside `<Name>.dc.html`.
//
// Two layers, both reported:
//
//   1. Shape — the fields, types, patterns and enums of
//      schemas/design-manifest.schema.json, checked by hand here so that this
//      file has no dependencies and can run anywhere Node runs:
//
//        curl -fsSL https://design.edgecom.ai/tools/check-design-manifest.mjs -o check-design-manifest.mjs
//        node check-design-manifest.mjs Settings.manifest.json
//
//      The repo also validates the published example against the real schema
//      with Ajv (scripts/check-schemas.mjs), so the two cannot drift silently.
//
//   2. Meaning — every claim the manifest makes about the design system is
//      checked against the system: the version and digest it was built against
//      are the current ones; every `component` is a published contract; every
//      variant axis and option exists on that contract; every part is one the
//      contract lists; every token is in the token model; every instance an
//      interaction or exception cites exists; and the design covers what an
//      implementation needs — mobile and desktop, light and dark, loading,
//      empty, error and success.
//
// Inside this repository the system is read from src/docs/generated/; anywhere
// else (or with --remote) it is fetched from design.edgecom.ai. Usage:
//
//   node scripts/check-design-manifest.mjs <manifest.json | URL> [--remote] [--strict] [--design <file>]
//       [--index <contracts.json | index.json | URL>] [--tokens <tokens.json | URL>]
//
// Exit 0 when the manifest is valid; 1 on any error. Coverage gaps are
// warnings, and errors under --strict.

import { readFileSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const PUBLIC_BASE = "https://design.edgecom.ai"
const REMOTE = { index: `${PUBLIC_BASE}/contracts/index.json`, tokens: `${PUBLIC_BASE}/tokens.json` }

const KEBAB = /^[a-z0-9][a-z0-9-]*$/
const AXIS = /^[a-z][a-zA-Z0-9-]*$/
const PART = /^[A-Z][A-Za-z0-9]*$/
const DIGEST = /^[0-9a-f]{16}$/
const VERSION = /^(v[0-9]+\.[0-9]+\.[0-9]+|untagged)$/
const COMMIT = /^[0-9a-f]{7,40}$/
const DATE = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
const DATETIME = /^[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}(:[0-9]{2}(\.[0-9]+)?)?(Z|[+-][0-9]{2}:[0-9]{2})?)?$/

const VIEWPORTS = ["mobile", "tablet", "desktop"]
const THEMES = ["light", "dark"]
const STATES = ["default", "loading", "empty", "error", "success", "disabled"]
const REQUIRED_VIEWPORTS = ["mobile", "desktop"]
const REQUIRED_THEMES = ["light", "dark"]
const REQUIRED_STATES = ["loading", "empty", "error", "success"]

const TOP_KEYS = [
  "$schema", "schemaVersion", "design", "title", "designSystemVersion", "designSystemDigest",
  "designSystemCommit", "generatedAt", "screens", "components", "tokens", "viewports", "themes",
  "states", "interactions", "approvedExceptions",
]
const TOP_REQUIRED = ["schemaVersion", "design", "designSystemVersion", "designSystemDigest", "components", "viewports", "themes", "states"]
const SCREEN_KEYS = ["id", "title", "description"]
const INSTANCE_KEYS = ["instanceId", "component", "label", "screen", "variants", "parts", "states", "note"]
const INTERACTION_KEYS = ["instanceId", "event", "result"]
const EXCEPTION_KEYS = ["instanceId", "rule", "reason", "approvedBy", "approvedOn"]

// Steps of the radius and type scales. They are utilities (`rounded-md`,
// `text-body`), not tokens, and the first real manifest listed three of them.
const SCALE_STEP = /^(radius-(sm|md|lg|xl|2xl|3xl|4xl|full)|text-(caption|body-sm|body|body-lg|title|heading|display))$/
// An approval that has not happened. An exception nobody approved is a
// deviation to report, and the first real manifest carried two of them.
const NOT_APPROVED = /^\s*$|pending|tbd|to be|todo|awaiting|none|n\/a|unknown|nobody|\?/i

// --- arguments ----------------------------------------------------------------
const argv = process.argv.slice(2)
const opts = { remote: false, strict: false, index: null, tokens: null, file: null }
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === "--remote") opts.remote = true
  else if (a === "--strict") opts.strict = true
  else if (a === "--design") opts.design = argv[++i]
  else if (a === "--index") opts.index = argv[++i]
  else if (a === "--tokens") opts.tokens = argv[++i]
  else if (a === "--help" || a === "-h") opts.help = true
  else if (a.startsWith("--")) fail(`unknown flag ${a}`)
  else if (opts.file) fail(`one manifest at a time (got ${opts.file} and ${a})`)
  else opts.file = a
}
if (opts.help || !opts.file) {
  console.log(
    "usage: check-design-manifest <manifest.json | URL> [--remote] [--strict] [--index <path|URL>] [--tokens <path|URL>]\n" +
      "  Validates a design handoff manifest against its schema and against the design system it names.\n" +
      "  --remote  read the system from design.edgecom.ai even inside the design-system repo\n" +
      "  --strict  coverage gaps (viewports, themes, states) are errors, not warnings\n" +
      "  --design  the design file to join data-instance against (default: the manifest's `design`, beside it)",
  )
  process.exit(opts.help ? 0 : 2)
}

function fail(msg) {
  console.error(`check-design-manifest — ${msg}`)
  process.exit(2)
}

// --- loading --------------------------------------------------------------------
const isUrl = (s) => /^https?:\/\//.test(s)

async function loadJson(ref, what) {
  try {
    if (isUrl(ref)) {
      const res = await fetch(ref)
      if (!res.ok) fail(`${what}: ${ref} → HTTP ${res.status}`)
      return await res.json()
    }
    return JSON.parse(readFileSync(resolve(process.cwd(), ref), "utf8"))
  } catch (err) {
    if (err?.code === "ENOENT") fail(`${what}: ${ref} does not exist`)
    fail(`${what}: ${ref} is not JSON (${err.message})`)
  }
}

// Inside the repo, the generated documents are the system. Published under
// public/tools/, the relative path resolves to nothing and the system is fetched.
const here = dirname(fileURLToPath(import.meta.url))
const localIndex = resolve(here, "../src/docs/generated/contracts.json")
const localTokens = resolve(here, "../src/docs/generated/tokens.json")
const useLocal = !opts.remote && !opts.index && !opts.tokens && existsSync(localIndex) && existsSync(localTokens)

const indexRef = opts.index ?? (useLocal ? localIndex : REMOTE.index)
const tokensRef = opts.tokens ?? (useLocal ? localTokens : REMOTE.tokens)

const [manifest, indexDoc, tokensDoc] = await Promise.all([
  loadJson(opts.file, "manifest"),
  loadJson(indexRef, "contracts"),
  loadJson(tokensRef, "tokens"),
])

// contracts.json and contracts/index.json describe the same components in two
// shapes; normalise to one.
function readSystem(indexDoc, tokensDoc) {
  const list = indexDoc.components ?? indexDoc.contracts
  if (!Array.isArray(list)) fail(`${indexRef} has neither "components" nor "contracts"`)
  const components = new Map()
  const aliases = new Map()
  const partOwners = new Map()
  for (const c of list) {
    const parts = (c.parts ?? []).map((p) => (typeof p === "string" ? p : p.name))
    components.set(c.id, {
      id: c.id,
      variants: new Map((c.variants ?? []).map((v) => [v.name, v.options ?? []])),
      parts: new Set(parts),
    })
    // Other ids that resolve to this component — the bundle exports
    // ChartContainer and no Chart, so `chart-container` is what a design agent
    // writes for `chart`. Accepted silently; the index says which they are.
    for (const a of c.aliases ?? []) aliases.set(a, c.id)
    for (const part of parts) partOwners.set(part.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), c.id)
  }
  if (!Array.isArray(tokensDoc.tokens)) fail(`${tokensRef} has no "tokens"`)
  return {
    version: indexDoc.version,
    digest: indexDoc.digest,
    tokensDigest: tokensDoc.digest,
    components,
    aliases,
    partOwners,
    tokens: new Set(tokensDoc.tokens.map((t) => t.id)),
  }
}
const system = readSystem(indexDoc, tokensDoc)

// --- report ---------------------------------------------------------------------
const errors = []
const warnings = []
const err = (path, msg) => errors.push(`${path || "/"} ${msg}`)
const warn = (path, msg) => warnings.push(`${path || "/"} ${msg}`)

const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v)
const isStr = (v) => typeof v === "string"

function checkKeys(obj, allowed, path) {
  for (const k of Object.keys(obj)) if (!allowed.includes(k)) err(`${path}/${k}`, `unknown field — allowed: ${allowed.join(", ")}`)
}
function checkString(obj, key, path, { pattern, required = false, hint } = {}) {
  if (!(key in obj)) {
    if (required) err(`${path}/${key}`, "is required")
    return
  }
  const v = obj[key]
  if (!isStr(v) || v.length === 0) return err(`${path}/${key}`, "must be a non-empty string")
  if (pattern && !pattern.test(v)) err(`${path}/${key}`, `"${v}" ${hint ?? `must match ${pattern}`}`)
}
function checkEnumArray(obj, key, path, allowed, { required = false, minItems = 0 } = {}) {
  if (!(key in obj)) {
    if (required) err(`${path}/${key}`, "is required")
    return
  }
  const v = obj[key]
  if (!Array.isArray(v)) return err(`${path}/${key}`, "must be an array")
  if (v.length < minItems) err(`${path}/${key}`, `must have at least ${minItems} item(s)`)
  const seen = new Set()
  v.forEach((x, i) => {
    if (!allowed.includes(x)) err(`${path}/${key}/${i}`, `"${x}" is not one of ${allowed.join(", ")}`)
    if (seen.has(x)) err(`${path}/${key}/${i}`, `"${x}" is listed twice`)
    seen.add(x)
  })
}
function checkPatternArray(obj, key, path, pattern, hint) {
  if (!(key in obj)) return
  const v = obj[key]
  if (!Array.isArray(v)) return err(`${path}/${key}`, "must be an array")
  const seen = new Set()
  v.forEach((x, i) => {
    if (!isStr(x) || !pattern.test(x)) err(`${path}/${key}/${i}`, `"${x}" ${hint}`)
    if (seen.has(x)) err(`${path}/${key}/${i}`, `"${x}" is listed twice`)
    seen.add(x)
  })
}

// --- 1. shape -------------------------------------------------------------------
if (!isObj(manifest)) fail("manifest must be a JSON object")

checkKeys(manifest, TOP_KEYS, "")
for (const k of TOP_REQUIRED) if (!(k in manifest)) err(`/${k}`, "is required")

if ("schemaVersion" in manifest && manifest.schemaVersion !== "1") err("/schemaVersion", `must be "1" (got ${JSON.stringify(manifest.schemaVersion)})`)
checkString(manifest, "$schema", "")
checkString(manifest, "design", "")
checkString(manifest, "title", "")
checkString(manifest, "designSystemVersion", "", { pattern: VERSION, hint: "must be a tag like v1.0.0, or untagged" })
checkString(manifest, "designSystemDigest", "", { pattern: DIGEST, hint: "must be the 16-hex digest from _system.json" })
checkString(manifest, "designSystemCommit", "", { pattern: COMMIT, hint: "must be a git SHA" })
checkString(manifest, "generatedAt", "", { pattern: DATETIME, hint: "must be an ISO 8601 date or date-time" })

const screens = new Set()
if ("screens" in manifest) {
  if (!Array.isArray(manifest.screens)) err("/screens", "must be an array")
  else
    manifest.screens.forEach((s, i) => {
      const p = `/screens/${i}`
      if (!isObj(s)) return err(p, "must be an object")
      checkKeys(s, SCREEN_KEYS, p)
      checkString(s, "id", p, { required: true, pattern: KEBAB, hint: "must be kebab-case" })
      checkString(s, "title", p)
      checkString(s, "description", p)
      if (isStr(s.id)) {
        if (screens.has(s.id)) err(`${p}/id`, `"${s.id}" is declared twice`)
        screens.add(s.id)
      }
    })
}

const instances = new Map() // instanceId → instance
if ("components" in manifest) {
  if (!Array.isArray(manifest.components)) err("/components", "must be an array")
  else
    manifest.components.forEach((c, i) => {
      const p = `/components/${i}`
      if (!isObj(c)) return err(p, "must be an object")
      checkKeys(c, INSTANCE_KEYS, p)
      checkString(c, "instanceId", p, { required: true, pattern: KEBAB, hint: "must be kebab-case" })
      // No pattern here: the meaning pass below reports an unknown id with the
      // registry id it probably meant, which is the more useful single line.
      checkString(c, "component", p, { required: true })
      checkString(c, "label", p)
      checkString(c, "screen", p, { pattern: KEBAB, hint: "must be kebab-case" })
      checkString(c, "note", p)
      if ("variants" in c) {
        if (!isObj(c.variants)) err(`${p}/variants`, 'must be an object keyed by axis: { "variant": "outline", "size": "sm" }')
        else
          for (const [axis, value] of Object.entries(c.variants)) {
            if (!AXIS.test(axis)) err(`${p}/variants/${axis}`, "axis name must be like variant, size, orientation")
            if (!isStr(value) || !value.length) err(`${p}/variants/${axis}`, "option must be a non-empty string")
          }
      }
      checkPatternArray(c, "parts", p, PART, "must be a part name as the contract lists it (DialogFooter)")
      checkEnumArray(c, "states", p, STATES)
      if (isStr(c.instanceId)) {
        if (instances.has(c.instanceId)) err(`${p}/instanceId`, `"${c.instanceId}" is declared twice`)
        instances.set(c.instanceId, c)
      }
    })
}

checkPatternArray(manifest, "tokens", "", KEBAB, "must be a token id as tokens.json lists it (primary, not --primary)")
checkEnumArray(manifest, "viewports", "", VIEWPORTS, { required: true, minItems: 1 })
checkEnumArray(manifest, "themes", "", THEMES, { required: true, minItems: 1 })
checkEnumArray(manifest, "states", "", STATES, { required: true, minItems: 1 })

if ("interactions" in manifest) {
  if (!Array.isArray(manifest.interactions)) err("/interactions", "must be an array")
  else
    manifest.interactions.forEach((x, i) => {
      const p = `/interactions/${i}`
      if (!isObj(x)) return err(p, "must be an object")
      checkKeys(x, INTERACTION_KEYS, p)
      checkString(x, "instanceId", p, { required: true, pattern: KEBAB, hint: "must be kebab-case" })
      checkString(x, "event", p)
      checkString(x, "result", p, { required: true })
    })
}
if ("approvedExceptions" in manifest) {
  if (!Array.isArray(manifest.approvedExceptions)) err("/approvedExceptions", "must be an array")
  else
    manifest.approvedExceptions.forEach((x, i) => {
      const p = `/approvedExceptions/${i}`
      if (!isObj(x)) return err(p, "must be an object")
      checkKeys(x, EXCEPTION_KEYS, p)
      checkString(x, "instanceId", p, { pattern: KEBAB, hint: "must be kebab-case" })
      checkString(x, "rule", p, { required: true })
      checkString(x, "reason", p, { required: true })
      checkString(x, "approvedBy", p, { required: true })
      if (isStr(x.approvedBy) && NOT_APPROVED.test(x.approvedBy))
        err(`${p}/approvedBy`, `"${x.approvedBy}" is not an approval — an exception nobody has approved is a deviation to report; remove it, or name who approved it`)
      checkString(x, "approvedOn", p, { pattern: DATE, hint: "must be YYYY-MM-DD" })
    })
}

// --- 2. meaning -----------------------------------------------------------------
// Identity first: everything else is checked against the *current* system, and
// a stale manifest is the one finding the reader must see before any other.
if (isStr(manifest.designSystemVersion) && isStr(manifest.designSystemDigest)) {
  if (manifest.designSystemDigest !== system.digest || manifest.designSystemVersion !== system.version) {
    err(
      "/designSystemDigest",
      `stale — the design was built against ${manifest.designSystemVersion} / ${manifest.designSystemDigest}, ` +
        `the system is now ${system.version} / ${system.digest}. Re-check the design against the current ` +
        `contracts before implementing it, and re-sync the design project.`,
    )
  }
}

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
const suggest = (id) => {
  const k = kebab(id)
  if (system.components.has(k)) return k
  const lower = id.toLowerCase()
  for (const c of system.components.keys()) if (c.replace(/-/g, "") === lower.replace(/-/g, "")) return c
  return null
}

const resolved = new Set()
for (const [i, c] of (Array.isArray(manifest.components) ? manifest.components : []).entries()) {
  if (!isObj(c) || !isStr(c.component)) continue
  const p = `/components/${i}`
  const contract = system.components.get(c.component) ?? system.components.get(system.aliases.get(c.component))
  if (!contract) {
    const s = suggest(c.component)
    const owner = system.partOwners.get(kebab(c.component))
    err(
      `${p}/component`,
      `unknown component "${c.component}"` +
        (s
          ? ` — did you mean "${s}"?`
          : owner
            ? ` — that is a part of "${owner}"; cite "${owner}" and list the part under "parts"`
            : " — not in contracts/index.json"),
    )
    continue
  }
  resolved.add(contract.id)
  if (isStr(c.screen) && screens.size && !screens.has(c.screen)) err(`${p}/screen`, `"${c.screen}" is not declared in /screens`)
  if (isStr(c.screen) && !screens.size) err(`${p}/screen`, `"${c.screen}" — declare it in /screens first`)
  if (isObj(c.variants)) {
    for (const [axis, value] of Object.entries(c.variants)) {
      if (!contract.variants.has(axis)) {
        const axes = [...contract.variants.keys()]
        err(
          `${p}/variants/${axis}`,
          (axes.length ? `"${c.component}" has no "${axis}" axis — it has ${axes.join(", ")}` : `"${c.component}" has no variant axes; drop "variants"`) +
            ` — a prop is not a variant and is not recorded here`,
        )
      } else if (!contract.variants.get(axis).includes(value)) {
        err(`${p}/variants/${axis}`, `"${value}" is not an option of ${c.component}.${axis} — options: ${contract.variants.get(axis).join(", ")}`)
      }
    }
  }
  if (Array.isArray(c.parts)) {
    for (const [j, part] of c.parts.entries()) {
      if (isStr(part) && !contract.parts.has(part)) err(`${p}/parts/${j}`, `"${part}" is not a part of ${c.component} — parts: ${[...contract.parts].join(", ")}`)
    }
  }
}

for (const [i, t] of (Array.isArray(manifest.tokens) ? manifest.tokens : []).entries()) {
  if (!isStr(t) || system.tokens.has(t)) continue
  const stripped = t.replace(/^--/, "")
  if (SCALE_STEP.test(stripped)) {
    err(`/tokens/${i}`, `"${t}" is a scale step, not a token — the design may use it, but tokens lists tokens.json ids only; drop it`)
    continue
  }
  const hint = system.tokens.has(stripped) ? ` — did you mean "${stripped}"?` : " — not in tokens.json; never invent a token"
  err(`/tokens/${i}`, `unknown token "${t}"${hint}`)
}

const refCheck = (list, key) => {
  for (const [i, x] of (Array.isArray(list) ? list : []).entries()) {
    if (isObj(x) && isStr(x.instanceId) && !instances.has(x.instanceId)) err(`/${key}/${i}/instanceId`, `"${x.instanceId}" is not a declared instance`)
  }
}
refCheck(manifest.interactions, "interactions")
refCheck(manifest.approvedExceptions, "approvedExceptions")

// The join. The manifest and the markup meet on `data-instance`; an instance on
// one side only is either undocumented (markup) or fictional (manifest). The
// first real manifest declared 23 instances and put the attribute on 15. Only
// a local design file can be read; a manifest fetched by URL is not joined.
const designRef = opts.design ?? (!isUrl(opts.file) && isStr(manifest.design) ? resolve(dirname(resolve(process.cwd(), opts.file)), manifest.design) : null)
let joined = null
if (designRef && existsSync(designRef)) {
  const html = readFileSync(designRef, "utf8")
  const inMarkup = new Set()
  for (const re of [/data-instance\s*=\s*["']([^"']+)["']/g, /["']data-instance["']\s*:\s*["']([^"']+)["']/g])
    for (const m of html.matchAll(re)) inMarkup.add(m[1])
  const design = isStr(manifest.design) ? manifest.design : designRef
  for (const [i, c] of (Array.isArray(manifest.components) ? manifest.components : []).entries()) {
    if (isObj(c) && isStr(c.instanceId) && !inMarkup.has(c.instanceId))
      err(`/components/${i}/instanceId`, `no element in ${design} carries data-instance="${c.instanceId}" — put it on the element, including ones the logic creates`)
  }
  for (const id of [...inMarkup].sort()) {
    if (!instances.has(id)) err("/components", `${design} carries data-instance="${id}", which is not a declared instance`)
  }
  joined = inMarkup.size
}
// No design file is not a defect of the manifest — the published example has
// none — so it is noted in the summary rather than warned about.
const joinNote = joined === null ? "; data-instance join not checked (no design file beside the manifest — pass --design <file>)" : `; ${joined} data-instance element(s) join the markup`

// Coverage: what an implementation needs and a happy-path-only design omits.
const coverage = opts.strict ? err : warn
const missing = (have, need) => need.filter((x) => !(Array.isArray(have) && have.includes(x)))
for (const v of missing(manifest.viewports, REQUIRED_VIEWPORTS)) coverage("/viewports", `does not cover "${v}" — both mobile and desktop are required`)
for (const t of missing(manifest.themes, REQUIRED_THEMES)) coverage("/themes", `does not cover "${t}" — every token has both values; check the design in both`)
for (const s of missing(manifest.states, REQUIRED_STATES)) coverage("/states", `does not cover "${s}" — a screen that shows only the happy path is not implementable`)
if (Array.isArray(manifest.components) && manifest.components.length === 0) coverage("/components", "lists no instances — a design with no design-system components is either freeform or undocumented")

// --- output ---------------------------------------------------------------------
const source = useLocal ? "the repo's generated documents" : isUrl(indexRef) ? indexRef : indexRef
console.log(`check-design-manifest — ${opts.file}`)
console.log(`  against ${source} — ${system.version} / ${system.digest}, ${system.components.size} contracts, ${system.tokens.size} tokens`)
for (const e of errors) console.log(`  ✗ ${e}`)
for (const w of warnings) console.log(`  ! ${w}`)
if (!errors.length) {
  const n = Array.isArray(manifest.components) ? manifest.components.length : 0
  console.log(
    `  ✓ ${n} instance(s) resolve to ${resolved.size} contract(s); ` +
      `${Array.isArray(manifest.tokens) ? manifest.tokens.length : 0} token(s) exist; ` +
      `${Array.isArray(manifest.interactions) ? manifest.interactions.length : 0} interaction(s) cite declared instances` +
      joinNote +
      (warnings.length ? ` — ${warnings.length} coverage warning(s)` : ""),
  )
}
process.exit(errors.length ? 1 : 0)
