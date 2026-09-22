// Assembles one component contract per registry primitive (plan §5.2).
//
// A contract is the structured answer to "may I use this component here, and
// what am I allowed to do with it" — the thing an agent reads instead of
// 7,000 words of prose. Nothing here is a new authority. It merges what the
// repo already knows:
//
//   src/app/sections.tsx          label, group, one-line blurb   (lib/sections)
//   src/components/ui/<id>.tsx    cva variants + every class the primitive uses
//   src/docs/generated/api.ts     Base UI origin, parts, cva props (gen-api)
//   src/docs/curated.ts           hand-written summary and part prose
//   src/app/globals.css           the token names a class may legitimately reach
//   src/docs/contracts.json       the authored overlay — purpose, selection
//                                 criteria, compositions, anti-patterns
//
// The split is deliberate: everything derivable is derived, so it cannot drift
// from the primitive, and the overlay holds only what no source encodes. A
// component with no overlay entry still gets a contract — a smaller, honest one.

import { familyOf } from "./tokens.mjs"
import { extractCva } from "./cva.mjs"
import { ALIAS_FILE, primitiveFileOf, sectionPath } from "./sections.mjs"

export { ALIAS_FILE }

// Utility prefixes that can carry a token name. `bg-primary` reaches --primary;
// `text-sm` reaches --text-sm. Both shapes are tried, full name first.
const TOKEN_PREFIXES = [
  "bg", "text", "border", "ring", "fill", "stroke", "outline", "from", "via", "to",
  "decoration", "placeholder", "caret", "accent", "divide", "shadow", "font",
  "tracking", "leading", "animate",
]

const BREAKPOINTS = /^@?(max-)?(sm|md|lg|xl|2xl)$/

// Modifiers that describe a state the component can be in, as opposed to a
// theme (`dark`), a viewport (`md`), or a structural selector (`[&>svg]`).
const STATE_MODIFIER =
  /^(group-|peer-)?(hover|focus|focus-visible|focus-within|active|disabled|checked|indeterminate|required|invalid|valid|read-only|placeholder-shown|open|closed|selected|expanded|empty|first|last|only|odd|even|target|visited|in-range|out-of-range|autofill|user-valid|user-invalid)$/

/**
 * Scan the source once, returning the string literals and the source with its
 * comments removed.
 *
 * Comments have to go before the literals are read: these primitives carry long
 * explanatory comments that quote class names in backticks (`dark:bg-*`,
 * `hover:bg-*`), and a plain string-literal regex reads those as template
 * literals. Button picked up `sm` and `lg` as breakpoints that way — from prose
 * about tailwind-merge, not from any class it renders.
 */
export function scanSource(src) {
  const fragments = []
  let code = ""
  let i = 0
  const push = (body) => {
    for (const piece of body.split(/\s+/)) if (piece) fragments.push(piece)
  }
  while (i < src.length) {
    const ch = src[i]
    if (ch === "/" && src[i + 1] === "/") {
      const nl = src.indexOf("\n", i)
      i = nl === -1 ? src.length : nl
      continue
    }
    if (ch === "/" && src[i + 1] === "*") {
      const close = src.indexOf("*/", i + 2)
      i = close === -1 ? src.length : close + 2
      continue
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch
      let body = ""
      let j = i + 1
      for (; j < src.length; j++) {
        if (src[j] === "\\") {
          body += src[j + 1] ?? ""
          j++
          continue
        }
        if (src[j] === quote) break
        // A ${...} interpolation is code, not class text: end the run here.
        if (quote === "`" && src[j] === "$" && src[j + 1] === "{") {
          push(body)
          body = ""
          let depth = 1
          j += 2
          while (j < src.length && depth > 0) {
            if (src[j] === "{") depth++
            else if (src[j] === "}") depth--
            j++
          }
          j--
          continue
        }
        body += src[j]
      }
      push(body)
      code += `${quote}${body}${quote}`
      i = j + 1
      continue
    }
    code += ch
    i++
  }
  return { fragments, code }
}

/** Every whitespace-separated string-literal fragment, comments excluded. */
export function stringFragments(src) {
  return scanSource(src).fragments
}

/**
 * Split a utility into its modifiers and the utility itself, respecting the
 * brackets in `data-[state=open]:` and `[&>svg]:` so a `:` inside one never
 * splits the class.
 */
export function splitModifiers(cls) {
  const parts = []
  let depth = 0
  let cur = ""
  for (const ch of cls) {
    if (ch === "[") depth++
    else if (ch === "]") depth--
    if (ch === ":" && depth === 0) {
      parts.push(cur)
      cur = ""
      continue
    }
    cur += ch
  }
  parts.push(cur)
  return { modifiers: parts.slice(0, -1), utility: parts[parts.length - 1] }
}

/** The token id a utility reaches, or null. `known` maps token name -> true. */
export function tokenOf(utility, known) {
  let u = utility.replace(/^!/, "").replace(/^-/, "")
  u = u.replace(/\/[\d.]+$/, "") // opacity suffix
  if (u.includes("[")) return null // arbitrary value — reaches no token by name
  if (u === "rounded") return known.has("radius") ? "radius" : null
  if (u.startsWith("rounded-")) {
    const r = `radius-${u.slice("rounded-".length)}`
    return known.has(r) ? r : null
  }
  if (known.has(u)) return u
  for (const p of TOKEN_PREFIXES) {
    if (!u.startsWith(`${p}-`)) continue
    const rest = u.slice(p.length + 1)
    if (known.has(rest)) return rest
  }
  return null
}

/**
 * The derived half of a contract, read straight out of the primitive's source.
 * Class strings are read from the whole file, not only from `cva()`: most
 * primitives here (input, card, dialog, table) have no cva at all, and their
 * tokens and states live in plain className strings.
 */
export function deriveFromSource(src, known) {
  const { fragments, code } = scanSource(src)
  const tokens = new Set()
  const states = new Set()
  const responsive = new Set()

  for (const frag of fragments) {
    const { modifiers, utility } = splitModifiers(frag)
    const t = tokenOf(utility, known)
    if (t) tokens.add(t)
    for (const mod of modifiers) {
      if (mod === "dark") continue
      if (BREAKPOINTS.test(mod)) {
        responsive.add(mod)
        continue
      }
      if (STATE_MODIFIER.test(mod)) states.add(mod)
      else if (/^(group-|peer-)?(data|aria)-/.test(mod)) states.add(mod)
    }
  }

  // Accessibility affordances the primitive already carries. Mechanical, so it
  // records what is there rather than what someone hoped was there.
  const a11y = new Set()
  for (const m of code.matchAll(/\brole=["{]"?([a-z]+)/g)) a11y.add(`role=${m[1]}`)
  for (const m of code.matchAll(/\b(aria-[a-z]+)=/g)) a11y.add(m[1])
  if (/\bsr-only\b/.test(code)) a11y.add("sr-only")
  if (/\btabIndex\b/.test(code)) a11y.add("tabIndex")

  return {
    tokens: [...tokens].sort(),
    states: [...states].sort(),
    responsive: [...responsive].sort(),
    a11yAttributes: [...a11y].sort(),
  }
}

/** cva variant groups as an ordered, contract-shaped list. */
export function variantsOf(cva) {
  if (!cva) return []
  return Object.entries(cva.groups)
    .map(([name, entries]) => ({
      name,
      options: Object.keys(entries),
      default: cva.defaults[name] ?? null,
    }))
    .filter((v) => v.options.length)
}

const EMPTY_OVERLAY = {
  purpose: null,
  useWhen: [],
  dontUseWhen: [],
  requires: [],
  forbids: [],
  rules: [],
  behavior: {},
  a11yRequirements: [],
  examples: [],
  antiPatterns: [],
  status: "stable",
  replaces: null,
  deprecated: null,
}

export const OVERLAY_KEYS = Object.keys(EMPTY_OVERLAY)

/** PascalCase names in the source's `export { … }` blocks — the component's parts. */
export function exportedParts(src) {
  const parts = new Set()
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const raw of m[1].split(",")) {
      const name = raw.replace(/\s+as\s+\w+/, "").trim()
      if (/^[A-Z][A-Za-z0-9]*$/.test(name)) parts.add(name)
    }
  }
  return [...parts]
}

/**
 * Primitives that ship but have no section of their own.
 *
 * gen-registry scans the directory, so every file in src/components/ui installs
 * and the design bundle carries every one of them — the first real design
 * manifest cited `toggle-group` and `chart` and the validator called both
 * unknown, because contracts were built from the docs sections alone. A
 * section's primitive (or its ALIAS_FILE target) is covered by that section's
 * contract; everything else here gets a derived contract with no docs page.
 */
export function undocumentedPrimitives(sections, primitiveIds) {
  // Any group counts: a Blocks page that documents a primitive is its page.
  const covered = new Set()
  for (const s of sections) {
    covered.add(s.id)
    covered.add(ALIAS_FILE[s.id] ?? s.id)
  }
  return primitiveIds.filter((id) => !covered.has(id)).sort()
}

const sentenceCase = (id) => id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ")
const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()

/**
 * One contract per section, in any group, that has a primitive file,
 * plus one per primitive no section covers (`undocumentedPrimitives`), so that
 * everything a design can cite resolves.
 *
 * `sources` supplies the already-parsed inputs so this stays a pure function —
 * the generator does the reading, this does the merging, and a test can call it
 * with fixtures. `primitives` is the list of ids in src/components/ui.
 */
export function buildContracts({ sections, readPrimitive, api, curated, overlay, tokenNames, primitives = [] }) {
  const known = new Set(tokenNames)
  const contracts = []

  // A primitive may take its axes from a sibling's cva — toggle-group types its
  // props as `VariantProps<typeof toggleVariants>` and imports that from
  // toggle.tsx, so its own source declares no cva. Follow the import when the
  // source says the borrowed variants are its props, else `size="sm"` on a
  // ToggleGroup validates as a prop that does not exist.
  const borrowedCva = (src) => {
    const m = src.match(/import\s*\{[^}]*\b(\w+Variants)\b[^}]*\}\s*from\s*"@\/components\/ui\/([a-z0-9-]+)"/)
    if (!m || !new RegExp(`VariantProps<typeof ${m[1]}>`).test(src)) return null
    const sibling = readPrimitive(`src/components/ui/${m[2]}.tsx`)
    return sibling ? extractCva(sibling) : null
  }

  const assemble = ({ id, label, docs, file, src, a, c, o }) => {
    const cva = extractCva(src) ?? borrowedCva(src)
    const derived = deriveFromSource(src, known)
    const parts = (a.parts ?? []).map((name) => ({
      name,
      description: c.parts?.[name] ?? null,
    }))
    const props = (a.props ?? []).map((p) => ({
      part: p.part,
      name: p.name,
      type: p.type,
      default: p.default ?? null,
      description: c.propDescriptions?.[`${p.part}.${p.name}`] ?? null,
    }))
    // Ids a design agent will plausibly write for this component and that
    // resolve to it: the primitive's file name where it differs from the id
    // (`sonner` → toast, `item` → list), and the kebab-case of the first
    // exported part when no part is named for the component (`chart-container`
    // → chart — the bundle exports ChartContainer and no Chart). The validator
    // accepts these silently; the canonical id stays the one to cite.
    const fileId = file.replace(/^.*\//, "").replace(/\.tsx$/, "")
    const rootPart = parts.find((p) => p.name.toLowerCase() === id.replace(/-/g, ""))
    const aliases = [...new Set([
      fileId !== id ? fileId : null,
      !rootPart && parts[0] ? kebab(parts[0].name) : null,
    ].filter(Boolean))]
    return {
      id,
      label,
      aliases,
      registryItem: `edgecom-ai/design-system/${id}`,
      install: `pnpm dlx shadcn@latest add edgecom-ai/design-system/${id}`,
      docs,
      source: file,
      summary: c.summary ?? null,
      purpose: o.purpose,
      useWhen: o.useWhen,
      dontUseWhen: o.dontUseWhen,
      base: a.base ?? null,
      parts,
      props,
      variants: variantsOf(cva),
      states: derived.states,
      responsive: derived.responsive,
      tokens: derived.tokens.map((id) => ({ id, family: familyOf(id) })),
      requires: o.requires,
      forbids: o.forbids,
      rules: o.rules,
      behavior: o.behavior,
      a11y: { attributes: derived.a11yAttributes, requirements: o.a11yRequirements },
      examples: o.examples,
      antiPatterns: o.antiPatterns,
      status: o.status,
      replaces: o.replaces,
      deprecated: o.deprecated,
      authored: Boolean(o.purpose),
    }
  }

  // Every section that documents a primitive, whatever group its page sits in:
  // the application shell is a Blocks page and is still that primitive's docs.
  for (const s of sections) {
    const file = primitiveFileOf(s)
    const src = readPrimitive(file)
    if (src == null) continue
    const c = curated[s.id] ?? {}
    contracts.push(
      assemble({
        id: s.id,
        label: s.label,
        docs: `https://design.edgecom.ai${sectionPath(s)}/`,
        file,
        src,
        a: api[s.id] ?? {},
        c: { ...c, summary: c.summary ?? s.description ?? null },
        o: { ...EMPTY_OVERLAY, ...(overlay[s.id] ?? {}) },
      }),
    )
  }

  // No section means no page, no api.ts entry and no overlay: the parts come
  // straight from the export block, the summary from curated.ts if anyone wrote
  // one, and `docs` is null — honestly, so a reader knows there is nothing to
  // follow. The contract still names the parts, variants and tokens, which is
  // what an implementing agent resolving a manifest needs.
  for (const id of undocumentedPrimitives(sections, primitives)) {
    const file = `src/components/ui/${id}.tsx`
    const src = readPrimitive(file)
    if (src == null) continue
    contracts.push(
      assemble({
        id,
        label: sentenceCase(id),
        docs: null,
        file,
        src,
        a: { parts: exportedParts(src) },
        c: curated[id] ?? {},
        o: EMPTY_OVERLAY,
      }),
    )
  }

  // An alias must not shadow a real id or another contract's alias — motion-tabs
  // exports `Tabs` first, and `tabs` is a component of its own.
  const ids = new Set(contracts.map((c) => c.id))
  const taken = new Set()
  for (const c of contracts) {
    c.aliases = c.aliases.filter((a) => {
      if (ids.has(a) || taken.has(a)) return false
      taken.add(a)
      return true
    })
  }

  return contracts
}
