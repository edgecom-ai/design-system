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

// Section ids whose primitive lives under a different filename.
export const ALIAS_FILE = { list: "item", toast: "sonner" }

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

/**
 * One contract per section in the Components group that has a primitive file.
 *
 * `sources` supplies the already-parsed inputs so this stays a pure function —
 * the generator does the reading, this does the merging, and a test can call it
 * with fixtures.
 */
export function buildContracts({ sections, readPrimitive, api, curated, overlay, tokenNames }) {
  const known = new Set(tokenNames)
  const contracts = []

  for (const s of sections) {
    if (s.group !== "Components") continue
    const file = `src/components/ui/${ALIAS_FILE[s.id] ?? s.id}.tsx`
    const src = readPrimitive(file)
    if (src == null) continue

    const cva = extractCva(src)
    const derived = deriveFromSource(src, known)
    const a = api[s.id] ?? {}
    const c = curated[s.id] ?? {}
    const o = { ...EMPTY_OVERLAY, ...(overlay[s.id] ?? {}) }

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

    contracts.push({
      id: s.id,
      label: s.label,
      registryItem: `edgecom-ai/design-system/${s.id}`,
      install: `pnpm dlx shadcn@latest add edgecom-ai/design-system/${s.id}`,
      docs: `https://design.edgecom.ai/components/${s.id}/`,
      source: file,
      summary: c.summary ?? s.description ?? null,
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
      authored: Boolean(overlay[s.id]?.purpose),
    })
  }

  return contracts
}
