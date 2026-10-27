// Builds the design-system bundle a Claude design canvas loads: ONE classic
// script that assigns `window.EdgecomDS`, built from the package entry
// `dist/index.js` (`pnpm design:entry`).
//
// React is not bundled. A canvas supplies its own — React 18.3.1 today — and
// a second copy could not share the page's, so `react`, `react-dom` and their
// subpaths resolve to `window.React` / `window.ReactDOM` at run time.
//
// The React 18 adapter. Our primitives are React 19 code: plain function
// components that take `ref` as an ordinary prop, no `forwardRef`. React 18
// strips `ref` from a function component's props, so every ref Base UI hands
// a composed part — `render={<Button />}` on a trigger, the positioner's
// anchor — is dropped, and every popover, menu, tooltip and select renders
// unpositioned at (0, 0) with opacity 0. Measured 2026-10-09: 77 authored
// previews, no errors on either React, five visibly wrong under 18. On a
// React older than 19, an element that gives a ref to a plain function
// component is created against a cached `forwardRef` wrapper that passes the
// ref back in as a prop — what React 19 does natively. On 19 the shim passes
// through untouched, so the registry source stays React 19 code.
//
// The `class` merge. A canvas's runtime hands an x-import's `class` attribute
// to the component as a literal `class` prop, which the component spreads onto
// its DOM node beside its own `className` — and the attribute set last wins,
// so `class="w-full"` on a Card strips its border, surface and padding. Host
// elements created by the bundle fold `class` into `className`.

import { build } from "esbuild"

const REACT = `var R = window.React
if (!R) throw new Error("EdgecomDS: load React before the design-system bundle")
var LEGACY = !(parseInt(R.version, 10) >= 19)
var adapted = new WeakMap()
function plain(t) { return typeof t === "function" && !(t.prototype && t.prototype.isReactComponent) }
function adapt(t) {
  var a = adapted.get(t)
  if (!a) {
    a = R.forwardRef(function (p, ref) { return t(ref == null ? p : Object.assign({}, p, { ref: ref })) })
    a.displayName = t.displayName || t.name
    adapted.set(t, a)
  }
  return a
}
function createElement(t, p) {
  var args = Array.prototype.slice.call(arguments)
  if (LEGACY && p && p.ref != null && plain(t)) args[0] = adapt(t)
  // A canvas passes an x-import's \`class\` attribute through as a literal
  // \`class\` prop; spread onto the DOM node it would replace the component's
  // own className. Merge the two instead.
  if (typeof t === "string" && p && p["class"] != null) {
    var q = Object.assign({}, p)
    q.className = q.className ? q.className + " " + q["class"] : q["class"]
    delete q["class"]
    args[1] = q
  }
  return R.createElement.apply(R, args)
}
function cloneElement(el, p) {
  if (LEGACY && p && p.ref != null && el && plain(el.type)) {
    var config = Object.assign({}, el.props, p)
    if (el.key != null && !("key" in p)) config.key = el.key
    return R.createElement.apply(R, [adapt(el.type), config].concat(Array.prototype.slice.call(arguments, 2)))
  }
  return R.cloneElement.apply(R, arguments)
}
// Automatic-runtime jsx/jsxs over createElement. The key is the third argument,
// never a prop; jsxs marks a static children array, which is spread into
// createElement so React does not warn about keys on it.
function np(p, k) { var o = {}; for (var x in p) if (x !== "children") o[x] = p[x]; if (k !== void 0) o.key = k; return o }
function jsx(t, p, k) { var c = p && p.children; return c === void 0 ? createElement(t, np(p, k)) : createElement(t, np(p, k), c) }
function jsxs(t, p, k) { return createElement.apply(null, [t, np(p, k)].concat(p.children)) }
module.exports = Object.assign({}, R, {
  createElement: createElement, cloneElement: cloneElement,
  jsx: jsx, jsxs: jsxs, jsxDEV: function (t, p, k, s) { return (s ? jsxs : jsx)(t, p, k) },
})`

// React 18.3 and 19 resource hints; some libraries call them at mount.
const REACT_DOM = `var D = window.ReactDOM, n = function () {}
module.exports = Object.assign({ preload: n, preinit: n, preconnect: n, prefetchDNS: n, preloadModule: n, preinitModule: n }, D)`

// react-is has to agree with the page's React on element symbols: react-is@19
// looks for "react.transitional.element", React 18 creates "react.element".
const REACT_IS = `var R = window.React
var FWD = Symbol.for("react.forward_ref"), MEMO = Symbol.for("react.memo"), PORTAL = Symbol.for("react.portal"), LAZY = Symbol.for("react.lazy")
function tt(o) { return o != null && typeof o === "object" ? (R.isValidElement(o) ? (o.type && o.type.$$typeof) || o.type : o.$$typeof) : undefined }
exports.typeOf = tt
exports.isElement = function (o) { return R.isValidElement(o) }
exports.isValidElementType = function (t) { return typeof t === "string" || typeof t === "function" || t === R.Fragment || t === R.Suspense || t === R.StrictMode || t === R.Profiler || (t != null && typeof t === "object" && t.$$typeof != null) }
exports.isFragment = function (o) { return R.isValidElement(o) && o.type === R.Fragment }
exports.isSuspense = function (o) { return R.isValidElement(o) && o.type === R.Suspense }
exports.isPortal = function (o) { return o != null && o.$$typeof === PORTAL }
exports.isForwardRef = function (o) { return tt(o) === FWD }
exports.isMemo = function (o) { return tt(o) === MEMO }
exports.isLazy = function (o) { return tt(o) === LAZY }
exports.isContextProvider = exports.isContextConsumer = exports.isProfiler = exports.isStrictMode = function () { return false }
exports.ForwardRef = FWD; exports.Memo = MEMO; exports.Portal = PORTAL; exports.Lazy = LAZY
exports.Fragment = R.Fragment; exports.Suspense = R.Suspense; exports.StrictMode = R.StrictMode; exports.Profiler = R.Profiler`

const SHIMS = {
  react: REACT,
  "react-dom": REACT_DOM,
  "react-is": REACT_IS,
  // A bundled scheduler would be a second instance beside the page's React.
  scheduler: `throw new Error("EdgecomDS: the bundle imports 'scheduler' directly, so react-dom leaked into it")`,
}

const pageGlobals = {
  name: "page-react",
  setup(b) {
    b.onResolve({ filter: /^react(\/(jsx-(dev-)?runtime|compiler-runtime))?$/ }, () => ({ path: "react", namespace: "page" }))
    b.onResolve({ filter: /^react-dom(\/client)?$/ }, () => ({ path: "react-dom", namespace: "page" }))
    b.onResolve({ filter: /^react-is$/ }, () => ({ path: "react-is", namespace: "page" }))
    b.onResolve({ filter: /^scheduler(\/|$)/ }, () => ({ path: "scheduler", namespace: "page" }))
    b.onLoad({ filter: /.*/, namespace: "page" }, (a) => ({ contents: SHIMS[a.path], loader: "js" }))
  },
}

const common = (root, plugins) => ({
  absWorkingDir: root,
  bundle: true,
  write: false,
  platform: "browser",
  target: "es2020",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  loader: { ".css": "empty" },
  plugins,
  logLevel: "silent",
})

/**
 * Bundles `entry` into one classic script assigning `window.<namespace>`.
 * Returns the code without a header, and the entry's export names.
 */
export async function buildDesignBundle({ entry, namespace, root }) {
  const base = { ...common(root, [pageGlobals]), entryPoints: [entry] }
  const iife = await build({ ...base, format: "iife", globalName: namespace, minify: true, legalComments: "none" })
  // The entry's export names, read from an ESM build of the same graph.
  const esm = await build({ ...base, format: "esm", metafile: true })
  const exports = Object.values(esm.metafile.outputs).flatMap((o) => o.exports ?? [])
  const code = `${iife.outputFiles[0].text.trimEnd()}\nwindow.${namespace}=${namespace};\n`
  return { code, exports }
}

/**
 * Bundles one preview module into a classic script assigning
 * `window.__dsPreview`. Its primitives come from the shipped bundle, never a
 * second source copy: a duplicate breaks React context identity (a part
 * outside its root's provider) and recharts' size context. `fromBundle` maps a
 * primitive file stem to its exports on the global — `{ Tabs: "MotionTabs" }`
 * for `motion-tabs`, whose names the barrel renames.
 */
export async function buildPreview({ entry, namespace, root, fromBundle }) {
  const toGlobal = {
    name: "bundle-global",
    setup(b) {
      b.onResolve({ filter: /^@\/components\/ui\/[\w-]+$|^edgecom-design-system$/ }, (a) => ({
        path: a.path === "edgecom-design-system" ? "*" : a.path.split("/").pop(),
        namespace: "bundle",
      }))
      b.onLoad({ filter: /.*/, namespace: "bundle" }, (a) => {
        const renamed = Object.entries(fromBundle[a.path] ?? {})
        const contents = renamed.length
          ? `var G = window.${namespace}\nmodule.exports = Object.assign({}, G, { ${renamed.map(([k, v]) => `${JSON.stringify(k)}: G[${JSON.stringify(v)}]`).join(", ")} })`
          : `module.exports = window.${namespace}`
        return { contents, loader: "js" }
      })
    },
  }
  const out = await build({
    ...common(root, [pageGlobals, toGlobal]),
    entryPoints: [entry],
    format: "iife",
    globalName: "__dsPreview",
    minify: true,
    legalComments: "none",
  })
  return out.outputFiles[0].text.trimEnd()
}
