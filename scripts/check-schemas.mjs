// Validates every generated artifact that has a schema.
//
// The Phase 2 exit criterion is that design docs, agent data, and registry
// metadata cannot disagree about a token or a component without CI failing.
// The parity check already proves the artifacts match their sources; this
// proves they match their declared shape.

import { readFileSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import Ajv from "ajv/dist/2020.js"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const read = (p) => JSON.parse(readFileSync(resolve(root, p), "utf8"))

// The served copies are checked against the served schemas: parity already
// proves each mirror matches its generator, and this proves the pair an agent
// fetches from design.edgecom.ai validates on its own.
const PAIRS = [
  ["schemas/tokens.schema.json", "src/docs/generated/tokens.json"],
  ["schemas/contracts.schema.json", "src/docs/generated/contracts.json"],
  ["public/schemas/tokens.schema.json", "public/tokens.json"],
  ["public/schemas/contracts.schema.json", "public/contracts.json"],
  // The design manifest has no repo-side instance — designs live in Claude
  // Design projects — so the published example stands in. It is generated with
  // the current identity, and `pnpm check:design-manifest` runs the
  // dependency-free validator over the same file; this proves the real schema
  // and that validator agree on what a manifest is.
  ["schemas/design-manifest.schema.json", "public/design-manifest.example.json"],
  ["public/schemas/design-manifest.schema.json", "public/design-manifest.example.json"],
]

let failed = 0

for (const [schemaPath, dataPath] of PAIRS) {
  if (!existsSync(resolve(root, dataPath))) {
    console.error(`check-schemas — missing ${dataPath}. Run \`pnpm docs:gen\`.`)
    failed++
    continue
  }
  // A fresh instance per pair: the served schema is a copy of the repo schema
  // and carries the same `$id`, which one Ajv instance refuses to register twice.
  const ajv = new Ajv({ allErrors: true, strict: false })
  const validate = ajv.compile(read(schemaPath))
  const data = read(dataPath)
  if (validate(data)) {
    const n = (Array.isArray(data.contracts) && data.contracts.length) || (Array.isArray(data.components) && data.components.length) || (Array.isArray(data.tokens) && data.tokens.length) || "?"
    console.log(`check-schemas — ${dataPath} valid against ${schemaPath} (${n} entries)`)
  } else {
    failed++
    console.error(`check-schemas — ${dataPath} FAILED ${schemaPath}:`)
    for (const e of validate.errors.slice(0, 20)) {
      console.error(`    ${e.instancePath || "/"} ${e.message}${e.params ? " " + JSON.stringify(e.params) : ""}`)
    }
  }
}

process.exit(failed ? 1 : 0)
