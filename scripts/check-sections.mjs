// Every primitive a docs page demonstrates must be installable from that page.
//
// A section's `install` field is the command a reader copies. The demos on the
// page are the code they copy next.
//
// Composition is fine and expected: a dialog demo uses a button, and the Button
// page offers `@edgecom/button`, so the reader can always find it. What breaks
// is a demo reaching for a primitive that **no page offers at all** — then there
// is no page to find, no install address anywhere in the docs, and the copied
// code does not compile. The primitive is real and ships; it is simply invisible.
//
// That is not hypothetical. The Dialog page offered `@edgecom/dialog` alone for
// three demos built on `alert-dialog`, and the Input page demonstrates
// `input-otp` and `phone-input` while no page in the site offers either.
//
// So the rule is: every primitive a page demonstrates must be installable from
// somewhere in the docs. Fix a failure by naming it in this page's install, or
// by giving it a page of its own.

import { readFileSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { parseSections } from "./lib/sections.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const read = (p) => readFileSync(resolve(root, p), "utf8")
const exists = (p) => existsSync(resolve(root, p))

// Section ids whose primitive file is named differently.
const ALIAS = { list: "item", toast: "sonner" }

// Primitives a page may use without offering: they are not separately
// installable pieces of UI, they are what another registry item is built from.
// Keep this list short and justified — it is an exemption from the rule above,
// not a place to park an inconvenience.
const INFRASTRUCTURE = new Set([
  // The animation engine `motion-tabs` is built on. It has no standalone use
  // and renders nothing by itself.
  "motion-highlight",
])

const sectionsSrc = read("src/app/sections.tsx")
const sections = parseSections(sectionsSrc)

/** The `install` string for a section id, read from the metadata array. */
function installOf(id) {
  const m = sectionsSrc.match(new RegExp(`id: "${id}"[\\s\\S]{0,500}?install: "([^"]*)"`))
  return m ? m[1] : null
}

/** Every `@/components/ui/<name>` a file imports. */
function uiImports(path) {
  if (!exists(path)) return []
  return [...read(path).matchAll(/@\/components\/ui\/([a-z0-9-]+)/g)].map((m) => m[1])
}

/** Every demo module a content module pulls in. */
function demoImports(path) {
  if (!exists(path)) return []
  return [...read(path).matchAll(/@\/components\/(demo|shadcn-studio)\/([A-Za-z0-9/-]+)/g)].map(
    (m) => `src/components/${m[1]}/${m[2]}.tsx`,
  )
}

// Everything any page offers. A primitive in here is discoverable: a reader who
// meets it in a demo can find the page that installs it.
const offeredAnywhere = new Set()
for (const section of sections) {
  const install = installOf(section.id)
  if (!install) continue
  for (const m of install.matchAll(/@edgecom\/([a-z0-9-]+)/g)) offeredAnywhere.add(m[1])
}

const problems = []
let checked = 0

for (const section of sections) {
  const module = `src/app/sections/${section.id}.tsx`
  if (!exists(module)) continue
  const install = installOf(section.id)
  if (install === null) continue // a section with nothing to install is fine
  checked++

  const reached = new Set(uiImports(module))
  for (const demo of demoImports(module)) uiImports(demo).forEach((u) => reached.add(u))

  // The section's own primitive is implied by the install command it carries,
  // whatever that command happens to name.
  reached.delete(ALIAS[section.id] ?? section.id)

  const missing = [...reached]
    .filter((u) => !INFRASTRUCTURE.has(u))
    .filter((u) => !offeredAnywhere.has(u))
    .sort()

  if (missing.length) {
    problems.push(
      `  ${section.id}\n` +
        `      offers:  ${install}\n` +
        `      demonstrates, but no page in the site installs: ${missing.map((u) => `@edgecom/${u}`).join(" ")}`,
    )
  }
}

if (problems.length) {
  console.error(
    `check-sections — ${problems.length} page(s) demonstrate a primitive no page installs.\n` +
      `A reader copying one of these demos gets code that will not compile, and has\n` +
      `nowhere in the docs to discover the missing piece.\n` +
      `Add it to the section's \`install\`, or give the primitive a page of its own.\n\n` +
      problems.join("\n\n"),
  )
  process.exit(1)
}

console.log(
  `check-sections — ${checked} pages: every primitive demonstrated is installable from somewhere in the docs`,
)
