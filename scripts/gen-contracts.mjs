// Emits the component contracts to src/docs/generated/contracts.json (plan §5.2).
//
// The primitives stay the authority. This is the compiled view of them: the
// thing a schema can validate, an agent can read instead of design.md, and the
// Claude Design bundle can generate its specs from — so the three cannot
// disagree about a component without CI failing.
//
// Derived fields (variants, tokens, states, responsive, parts, props) come out
// of the source every run. Authored fields (purpose, selection criteria,
// compositions, anti-patterns) come from src/docs/contracts.json, which is
// hand-written and is the only place a human adds to a contract.
//
// Run by docs:gen. CI regenerates and fails on a diff.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"

import { readBlocks } from "./lib/tokens.mjs"
import { parseSections } from "./lib/sections.mjs"
import { buildContracts, OVERLAY_KEYS, ALIAS_FILE } from "./lib/contracts.mjs"
import { freshness, forced } from "./lib/stale.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const read = (p) => readFileSync(resolve(root, p), "utf8")
const uiDir = resolve(root, "src/components/ui")

const OVERLAY = "src/docs/contracts.json"
const OUT = "src/docs/generated/contracts.json"

const inputs = [
  "src/app/globals.css",
  "src/app/sections.tsx",
  "src/docs/curated.ts",
  "src/docs/generated/api.ts",
  OVERLAY,
  "scripts/gen-contracts.mjs",
  "scripts/lib/contracts.mjs",
  "scripts/lib/cva.mjs",
  "scripts/lib/sections.mjs",
  "scripts/lib/tokens.mjs",
  ...readdirSync(uiDir)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => `src/components/ui/${f}`),
]

const stamp = freshness({ name: "contracts", inputs, outputs: [OUT] })
if (stamp.fresh && !forced()) {
  console.log("gen-contracts — up to date — skipped")
  process.exit(0)
}

// --- inputs ------------------------------------------------------------------
const sections = parseSections(read("src/app/sections.tsx"))

// gen-api writes a plain JSON object literal, so slice it out rather than
// importing TypeScript for a file that is generated anyway.
const apiSrc = read("src/docs/generated/api.ts")
const api = JSON.parse(apiSrc.slice(apiSrc.indexOf("{", apiSrc.indexOf("generatedApi")), apiSrc.lastIndexOf("}") + 1))

// curated.ts is hand-written TypeScript. Node strips the types on import, which
// is exact where a regex over `parts: { ... }` would be a guess.
let curated
try {
  ;({ curatedApi: curated } = await import(new URL("../src/docs/curated.ts", import.meta.url).href))
} catch (err) {
  console.error(
    `gen-contracts — could not import src/docs/curated.ts (${err.code ?? err.message}).\n` +
      `  This needs Node with TypeScript type stripping (>= 22.18). CI pins Node 22.`,
  )
  process.exit(1)
}

const overlay = JSON.parse(read(OVERLAY))

// --- validate the overlay ----------------------------------------------------
// It is hand-written, so a typo in an id or a key would otherwise vanish
// silently into a contract that simply lacks the guidance someone wrote.
const sectionIds = new Set(sections.map((s) => s.id))
const problems = []
for (const [id, entry] of Object.entries(overlay)) {
  if (id.startsWith("$")) continue
  if (!sectionIds.has(id)) {
    // Distinguish a typo from the real gap. A primitive with no section still
    // ships — gen-registry reads the whole directory, so it has a registry item
    // and installs fine — but it has no docs page, no catalogue entry, and
    // nothing for a contract's `docs` URL to point at.
    problems.push(
      existsSync(resolve(uiDir, `${ALIAS_FILE[id] ?? id}.tsx`))
        ? `"${id}" has a primitive and a registry item but no section in src/app/sections.tsx, so it has no docs page for a contract to point at. Give it a section, or park the guidance under a $-prefixed key.`
        : `unknown component id "${id}"`,
    )
  } else if (!existsSync(resolve(uiDir, `${ALIAS_FILE[id] ?? id}.tsx`))) {
    problems.push(`"${id}" has no primitive in src/components/ui`)
  }
  for (const k of Object.keys(entry)) {
    if (!OVERLAY_KEYS.includes(k)) problems.push(`"${id}" has unknown key "${k}"`)
  }
}
if (problems.length) {
  console.error(`gen-contracts — ${OVERLAY} is invalid:\n` + problems.map((p) => `    ${p}`).join("\n"))
  process.exit(1)
}

// --- build -------------------------------------------------------------------
const css = read("src/app/globals.css")
const { light, theme } = readBlocks(css)

const contracts = buildContracts({
  sections,
  readPrimitive: (p) => (existsSync(resolve(root, p)) ? read(p) : null),
  api,
  curated,
  overlay,
  tokenNames: [...Object.keys(light), ...Object.keys(theme)],
})

const git = (...a) => {
  try {
    return execFileSync("git", a, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim()
  } catch {
    return null
  }
}

// Identity is the digest of everything that went in — not HEAD. A commit SHA
// would change on every commit and make a committed copy impossible to keep
// parity-clean; tokens.json and the changelog both taught that.
const digest = createHash("sha256")
for (const p of inputs.filter((p) => existsSync(resolve(root, p)))) digest.update(read(p))

const authored = contracts.filter((c) => c.authored)

const doc = {
  $schema: "../../../schemas/contracts.schema.json",
  version: git("describe", "--tags", "--abbrev=0") || "untagged",
  digest: digest.digest("hex").slice(0, 16),
  sources: ["src/components/ui/*.tsx", "src/app/sections.tsx", "src/docs/curated.ts", OVERLAY],
  generator: "scripts/gen-contracts.mjs",
  counts: {
    total: contracts.length,
    authored: authored.length,
    withVariants: contracts.filter((c) => c.variants.length).length,
    withBaseUi: contracts.filter((c) => c.base).length,
    tokenReferences: contracts.reduce((n, c) => n + c.tokens.length, 0),
  },
  contracts: contracts.sort((a, b) => a.id.localeCompare(b.id)),
}

mkdirSync(resolve(root, dirname(OUT)), { recursive: true })
writeFileSync(resolve(root, OUT), JSON.stringify(doc, null, 2) + "\n")

console.log(
  `gen-contracts — ${contracts.length} contracts ` +
    `(${authored.length} authored, ${doc.counts.withVariants} with variants, ` +
    `${doc.counts.tokenReferences} token references) → ${OUT}`,
)

stamp.save()
