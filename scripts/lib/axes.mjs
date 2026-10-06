// The one reader of a primitive's variant axes, each attributed to its part.
//
// Two sources, both read from the source text (the same shallow, string-aware
// approach as lib/cva.mjs, for the same reason: the generators run before any
// build step).
//
// 1. Every cva() call in the file, not just the first. item.tsx sizes `Item`
//    with itemVariants and shapes `ItemMedia` with itemMediaVariants; a reader
//    that stopped at the first left `ItemMedia variant="icon"` undocumented.
//    A cva belongs to the part its constant is named for — `selectTriggerVariants`
//    sizes SelectTrigger — and falls back to the root part when no export matches.
//
// 2. A `variant` or `size` prop typed as a closed set of string literals with
//    no cva behind it — Logo's `variant`, StepperIndicator's `variant`,
//    DropdownMenuItem's `variant="destructive"`. Those read as variants to anyone
//    holding the source or its .d.ts, and a contract that left them out made a
//    design that recorded them fail the manifest validator. Other closed props
//    (`side`, `collapsible`, `orientation`) stay props: the design-sync
//    conventions name them as such, and most are Base UI props this source
//    never declares, so reading them here would cover some components and not
//    others.

import { braceBody, extractCva } from "./cva.mjs"

const TYPED_AXES = ["variant", "size"]
const LIT = /(["'])([^"'\n]*)\1/g

/** Body of the paren block that opens at `openIdx`, or null if unbalanced. */
function parenBody(src, openIdx) {
  let depth = 0
  for (let i = openIdx; i < src.length; i++) {
    if (src[i] === "(") depth++
    else if (src[i] === ")") {
      depth--
      if (depth === 0) return src.slice(openIdx + 1, i)
    }
  }
  return null
}

/**
 * The options of a type written as a union of string literals — inline, or a
 * local `type Alias = "a" | "b"` — else null (`number`, `string`, a Base UI type).
 */
function literalUnion(text, src) {
  let t = text.trim().replace(/[;,]$/, "").trim()
  if (/^[A-Z]\w*$/.test(t)) {
    const alias = src.match(new RegExp(String.raw`\btype\s+${t}\s*=\s*([^\n;]+)`))
    if (!alias) return null
    t = alias[1].trim()
  }
  const options = [...t.matchAll(LIT)].map((m) => m[2])
  if (!options.length || t.replace(LIT, "").replace(/[|\s]/g, "") !== "") return null
  return options
}

/** Every `const xVariants = cva(…)` in the file, each read on its own. */
function cvaCalls(src) {
  const starts = [...src.matchAll(/const\s+(\w+)Variants\s*=\s*cva\(/g)]
  if (!starts.length) {
    // An anonymous cva() — read it the old way, attributed to the root part.
    const cva = extractCva(src)
    return cva ? [{ owner: null, ...cva }] : []
  }
  return starts.map((m, i) => {
    const end = i + 1 < starts.length ? starts[i + 1].index : src.length
    return { owner: m[1], ...extractCva(src.slice(m.index, end)) }
  })
}

/** The parameter list of an exported part's declaration, or null. */
function paramsOf(src, part) {
  const m = src.match(new RegExp(String.raw`(?:function\s+${part}\s*|const\s+${part}\s*=\s*)\(`))
  if (!m) return null
  return parenBody(src, m.index + m[0].length - 1)
}

/** `variant`/`size` props a part types as a closed union, with their defaults. */
function typedAxesOf(src, part) {
  const params = paramsOf(src, part)
  if (params == null) return []
  // The type the part is annotated with: inline members, plus the body of any
  // local interface or type alias it names.
  const bodies = [params]
  for (const [, name] of params.matchAll(/\b([A-Z]\w*Props)\b/g)) {
    const decl = src.match(new RegExp(String.raw`\b(?:interface\s+${name}\b[^{]*|type\s+${name}\s*=[^{]*)\{`))
    if (decl) bodies.push(braceBody(src, decl.index + decl[0].length - 1) ?? "")
  }
  const out = []
  for (const name of TYPED_AXES) {
    let options = null
    for (const body of bodies) {
      const typed = body.match(new RegExp(String.raw`(?:^|[\s;{,])${name}\?\s*:\s*([^\n;,}]+)`))
      if (typed && (options = literalUnion(typed[1], src))) break
    }
    if (!options) continue
    const def = params.match(new RegExp(String.raw`\b${name}\s*=\s*(["'])([^"']*)\1`))
    out.push({ part, name, options, default: def ? def[2] : null })
  }
  return out
}

/**
 * Every variant axis a primitive declares, as `{ part, name, options, default }`
 * in source order: the cva axes first, then typed props a cva does not already
 * cover on the same part. `parts` is the export list; `mainPart` the part an
 * unattributable cva belongs to.
 */
export function axesOf(src, parts, mainPart) {
  const axes = []
  const partOf = (owner) => (owner && parts.find((p) => p.toLowerCase() === owner.toLowerCase())) ?? mainPart
  // A cva named for one part may be shared: TableHead and TableCell both type
  // their props as `VariantProps<typeof tableCellVariants>`. Every part whose
  // parameters name the cva owns its axes; the name alone is the fallback.
  const usersOf = (owner) =>
    owner
      ? parts.filter((p) => new RegExp(String.raw`typeof\s+${owner}Variants\b`).test(paramsOf(src, p) ?? ""))
      : []
  for (const cva of cvaCalls(src)) {
    const users = usersOf(cva.owner)
    const owners = users.length ? users : [partOf(cva.owner)]
    for (const [name, entries] of Object.entries(cva.groups ?? {})) {
      const options = Object.keys(entries)
      if (!options.length) continue
      for (const part of owners) axes.push({ part, name, options, default: cva.defaults?.[name] ?? null })
    }
  }
  const seen = new Set(axes.map((a) => `${a.part}.${a.name}`))
  for (const part of parts) {
    for (const axis of typedAxesOf(src, part)) {
      if (!seen.has(`${part}.${axis.name}`)) axes.push(axis)
    }
  }
  return axes
}

/**
 * One entry per axis name, for the contract's flat `variants` list: two parts
 * that each take a `variant` (Item and ItemMedia) share one axis whose options
 * are both parts' options, so any option the component accepts validates. The
 * default is the first part's.
 */
export function mergeAxes(axes) {
  const byName = new Map()
  for (const a of axes) {
    const cur = byName.get(a.name)
    if (!cur) byName.set(a.name, { name: a.name, options: [...a.options], default: a.default })
    else for (const o of a.options) if (!cur.options.includes(o)) cur.options.push(o)
  }
  return [...byName.values()]
}
