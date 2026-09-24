// Runtime verification of the built docs site.
//
// There is no test framework here, and `pnpm build` only proves the export
// prerenders — the page shells are empty and every section renders client-side,
// so a build can succeed while the site renders nothing. This loads a sample of
// routes in real Chrome and checks what a build and a typecheck cannot:
//
//   - the page actually renders content (the shell alone is ~0 chars)
//   - no console error and no page error
//   - no failed request other than Next's own aborted route prefetches
//   - the Suspense fallback resolved rather than sticking
//
// Both themes, because a light-only regression is invisible otherwise.
//
//   pnpm verify:docs              # builds nothing; expects out/ to exist
//   pnpm verify:docs --all        # every route, not the sample
//   pnpm verify:docs --shots shots  # also screenshot each route: shots/<theme>/<route>.png
//   node scripts/verify-docs.mjs --base http://localhost:3000   # against dev
//
// The docs shell keeps its own theme state and ignores prefers-color-scheme, so
// the dark pass clicks the shell's own toggle and then checks `<html>` carries
// `.dark` — a dark pass that never went dark used to count as a pass.
//
// `--shots` writes a full-page screenshot per route and theme, animations off,
// motion reduced. CI keeps them as an artifact and, on a pull request, compares
// them with the last green run on main (scripts/compare-shots.mjs), so a visual
// change is a diff image in the job summary rather than a surprise on the site.
//
// Prefers system Chrome (channel: "chrome") so it needs no `playwright install`,
// and falls back to Playwright's bundled chromium where there is none (CI).

import { createServer } from "node:http"
import { readFile, readdir, stat, mkdir } from "node:fs/promises"
import { readFileSync as readFileSyncSync } from "node:fs"
import { resolve, dirname, extname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const outDir = resolve(root, "out")

const argv = process.argv.slice(2)
const baseArg = argv.includes("--base") ? argv[argv.indexOf("--base") + 1] : null
const shotsDir = argv.includes("--shots") ? resolve(argv[argv.indexOf("--shots") + 1]) : null

// Routes chosen to cover each group and the shapes that differ: a prose page, a
// foundations page, variant pages, and a block.
const SAMPLE = [
  "/getting-started/introduction/",
  "/foundations/colors/",
  "/foundations/typography/",
  "/components/button/",
  "/components/table/",
  "/components/dialog/",
  "/components/select/",
  "/components/tabs/",
  "/components/skeleton/",
  "/blocks/chart-blocks/",
]

// `--all` checks every generated route instead of the sample. The sample is the
// CI default because it is ~8x faster and catches shape regressions; use --all
// after anything that touches section content wholesale, where a single section
// can break on its own without the sample ever loading it.
function allRoutes() {
  const ts = readFileSyncSync(resolve(root, "src/docs/generated/routes.ts"), "utf8")
  const m = /=\s*\[/.exec(ts)
  const json = ts.slice(m.index + m[0].indexOf("["), ts.lastIndexOf("]") + 1)
  return JSON.parse(json).map((r) => `/${r.group}/${r.slug}/`)
}

const ROUTES = argv.includes("--all") ? allRoutes() : SAMPLE

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain", ".md": "text/markdown",
}

async function serveOut() {
  try {
    await stat(outDir)
  } catch {
    console.error("verify-docs — out/ not found. Run `pnpm build` first.")
    process.exit(1)
  }

  // Index out/ once, then serve strictly from that map. The request path is only
  // ever a *key lookup*, never part of a filesystem path, so a traversal has
  // nothing to traverse — the class is gone rather than guarded against.
  const files = new Map()
  async function index(dir, prefix) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name)
      const url = `${prefix}/${entry.name}`
      if (entry.isDirectory()) await index(abs, url)
      else files.set(url, abs)
    }
  }
  await index(outDir, "")

  const server = createServer(async (req, res) => {
    let p
    try {
      p = decodeURIComponent(req.url.split("?")[0])
    } catch {
      return void res.writeHead(400).end("bad request")
    }
    if (p.endsWith("/")) p += "index.html"
    const file = files.get(p)
    if (!file) return void res.writeHead(404).end("not found")
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" })
    res.end(await readFile(file))
  })
  await new Promise((r) => server.listen(0, r))
  return { server, base: `http://localhost:${server.address().port}`, count: files.size }
}

async function run(browser, base, dark) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: dark ? "dark" : "light",
    reducedMotion: "reduce",
  })
  const theme = dark ? "dark" : "light"
  if (shotsDir) await mkdir(join(shotsDir, theme), { recursive: true })
  const rows = []
  for (const route of ROUTES) {
    const page = await ctx.newPage()
    const errors = []
    const failed = []
    page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)))
    page.on("pageerror", (e) => errors.push("pageerror: " + String(e).slice(0, 200)))
    page.on("requestfailed", (r) => {
      // Next cancels in-flight route prefetches when a page unloads; those are
      // document requests to route URLs and are expected. A failed *chunk* is not.
      if (r.url().includes("/_next/static/")) failed.push(r.url().split("/").pop())
    })

    let status = "ok"
    try {
      const resp = await page.goto(base + route, { waitUntil: "networkidle", timeout: 45000 })
      if (!resp || !resp.ok()) status = `HTTP ${resp ? resp.status() : "?"}`
    } catch (e) {
      status = "nav failed: " + String(e.message).slice(0, 60)
    }

    // The shell's theme is its own state: click its toggle, then check <html>.
    let themed = !dark
    if (dark && status === "ok") {
      try {
        await page.getByRole("button", { name: /^dark$/i }).first().click({ timeout: 5000 })
        await page.waitForFunction(() => document.documentElement.classList.contains("dark"), null, { timeout: 5000 })
        themed = true
      } catch {
        themed = false
      }
    }
    if (!dark && status === "ok") themed = !(await page.evaluate(() => document.documentElement.classList.contains("dark")).catch(() => false))

    const chars = await page.evaluate(() => document.body.innerText.trim().length).catch(() => 0)
    const slots = await page.locator("[data-slot]").count().catch(() => 0)
    // A stuck Suspense fallback shows skeletons and almost no text.
    const stuck = chars < 300 && (await page.locator('[data-slot="skeleton"]').count().catch(() => 0)) > 0

    const ok = status === "ok" && !errors.length && !failed.length && chars >= 300 && slots > 0 && !stuck && themed
    if (shotsDir && status === "ok") {
      // The shell is `h-svh overflow-hidden` with its own scrolling content
      // pane, so `fullPage` sees one viewport. Grow the viewport to the pane's
      // scroll height (capped) and the whole page is on one screen.
      const tall = await page
        .evaluate(() =>
          Math.max(
            0,
            ...[...document.querySelectorAll("*")]
              .filter((el) => /auto|scroll/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight)
              .map((el) => el.scrollHeight + (window.innerHeight - el.clientHeight)),
          ),
        )
        .catch(() => 0)
      if (tall > 900) await page.setViewportSize({ width: 1440, height: Math.min(Math.ceil(tall), 12000) }).catch(() => {})
      // One file per route and theme, the route's slashes doubled-underscored so
      // the folder is flat and diffable: components__button.png.
      const file = join(shotsDir, theme, `${route.replace(/^\/|\/$/g, "").replace(/\//g, "__") || "index"}.png`)
      await page.screenshot({ path: file, fullPage: true, animations: "disabled", caret: "hide" }).catch((e) => errors.push("screenshot: " + String(e.message).slice(0, 120)))
    }
    rows.push({ route, ok, status, chars, slots, stuck, themed, errors, failed })
    await page.close()
  }
  await ctx.close()
  return rows
}

const { server, base } = baseArg ? { server: null, base: baseArg } : await serveOut()
const { chromium } = await import("playwright")
// Prefer the installed Chrome so a contributor needs no `playwright install`.
// CI has no system Chrome, so fall back to Playwright's own chromium there.
let browser
try {
  browser = await chromium.launch({ channel: "chrome", headless: true })
} catch {
  console.log("  (no system Chrome — falling back to bundled chromium)")
  browser = await chromium.launch({ headless: true })
}

let failures = 0
for (const dark of [false, true]) {
  const rows = await run(browser, base, dark)
  console.log(`\n=== ${dark ? "DARK" : "LIGHT"} ===`)
  for (const r of rows) {
    if (!r.ok) failures++
    console.log(
      `  ${r.ok ? "ok  " : "FAIL"} ${r.route.padEnd(34)} ${String(r.chars).padStart(6)} chars  ${String(r.slots).padStart(4)} slots` +
        (r.status !== "ok" ? `  ${r.status}` : "") +
        (r.stuck ? "  SUSPENSE STUCK" : "") +
        (r.themed ? "" : "  THEME NOT APPLIED"),
    )
    for (const e of r.errors.slice(0, 3)) console.log(`        console: ${e}`)
    for (const f of r.failed.slice(0, 3)) console.log(`        failed chunk: ${f}`)
  }
}

await browser.close()
server?.close()

const total = ROUTES.length * 2
console.log(`\n  ${total - failures}/${total} passed${shotsDir ? ` · screenshots in ${shotsDir}` : ""}`)
process.exit(failures ? 1 : 0)
