// Publishes the design handoff manifest's three faces (plan §5.4):
//
//   public/schemas/design-manifest.schema.json   the shape, at the $id it declares
//   public/design-manifest.example.json          a complete example, stamped with the
//                                                current system identity — copy it
//   public/tools/check-design-manifest.mjs       the dependency-free validator
//
// The example is generated rather than committed as-is because its identity
// fields are the point of the format: it has to name the system that exists
// *now*, and the system's digest changes whenever a token, a primitive, the
// design language or an authored overlay changes. The hand-written source in
// src/docs/design-manifest.example.json carries @@version / @@digest
// placeholders; a literal value there would be stale by the next change.
//
// The design bundle (gen-design-sync) copies the published example into the
// design project as _manifest.example.json, so a design agent has the shape
// beside _system.json without leaving the project.
//
// Run by docs:gen, after gen-contracts. CI regenerates and fails on a diff, and
// `pnpm check:design-manifest` runs the validator over the example.

import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { freshness, forced } from "./lib/stale.mjs"
import { systemIdentity, systemSources, systemVersion } from "./lib/system.mjs"
import { PUBLISHED, schemaUrl } from "./lib/publish.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const read = (p) => readFileSync(resolve(root, p), "utf8")

const SCHEMA = "schemas/design-manifest.schema.json"
const EXAMPLE_SRC = "src/docs/design-manifest.example.json"
const CHECK_SRC = "scripts/check-design-manifest.mjs"
const SCHEMA_OUT = `${PUBLISHED.schemasDir}/design-manifest.schema.json`

const stamp = freshness({
  name: "design-manifest",
  inputs: [SCHEMA, EXAMPLE_SRC, CHECK_SRC, "scripts/gen-design-manifest.mjs", "scripts/lib/publish.mjs", "scripts/lib/system.mjs", ...systemSources()],
  outputs: [SCHEMA_OUT, PUBLISHED.designManifestExample, PUBLISHED.checkDesignManifest],
  extra: systemVersion(),
})
if (stamp.fresh && !forced()) {
  console.log("gen-design-manifest — up to date — skipped")
  process.exit(0)
}

const system = systemIdentity()

// The source must not carry an identity of its own: it would be wrong the
// moment anything changed, and the parity gate would fail on the next build for
// a reason nobody edited.
const src = read(EXAMPLE_SRC)
for (const ph of ["@@version", "@@digest"]) {
  if (!src.includes(`"${ph}"`)) {
    console.error(`gen-design-manifest — ${EXAMPLE_SRC} must use the ${ph} placeholder, not a literal value`)
    process.exit(1)
  }
}
const example = JSON.parse(src.replaceAll("@@version", system.version).replaceAll("@@digest", system.digest))
example.$schema = schemaUrl("design-manifest.schema.json")

mkdirSync(resolve(root, PUBLISHED.schemasDir), { recursive: true })
mkdirSync(resolve(root, PUBLISHED.toolsDir), { recursive: true })
copyFileSync(resolve(root, SCHEMA), resolve(root, SCHEMA_OUT))
writeFileSync(resolve(root, PUBLISHED.designManifestExample), JSON.stringify(example, null, 2) + "\n")
copyFileSync(resolve(root, CHECK_SRC), resolve(root, PUBLISHED.checkDesignManifest))

console.log(
  `gen-design-manifest — schema, example (${example.components.length} instances at ${system.version} / ${system.digest}) ` +
    `and validator → ${PUBLISHED.schemasDir}/, ${PUBLISHED.designManifestExample}, ${PUBLISHED.checkDesignManifest}`,
)

stamp.save()
