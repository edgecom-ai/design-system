// Derives the changelog from git history so it maintains itself: every commit
// that lands on main becomes a changelog entry, grouped into releases, without
// anyone hand-editing a list.
//
// Sources (in precedence order):
//   1. git log — conventional-commit subjects (`type(scope): summary`) plus the
//      files each commit touched, which resolve to the registry items affected.
//   2. `Changelog:` commit trailers — `Changelog: skip` drops a commit, any
//      other value replaces its headline. Git-native curation, at commit time.
//   3. src/docs/changelog-notes.json — hand-written, retroactive overrides
//      (hide/rewrite a commit, title/summarise a release) for history that is
//      already written.
//
// Outputs:
//   src/docs/generated/changelog.ts — data for the docs page
//   CHANGELOG.md                    — repo-root changelog
//   public/changelog.md             — served at design.edgecom.ai/changelog.md
//
// Releases are cut at git tags when they exist (each `tag: v*` ref starts a
// release, commits after the newest tag are "Unreleased"); until the repo is
// tagged, commits group by date instead, so the page is useful from day one.
//
// The generator is defensive about shallow clones: `git log` in a depth-1 CI
// checkout would report a single commit, so a shallow (or non-git) tree keeps
// the committed artifacts instead of truncating them. CI must check out with
// `fetch-depth: 0` for the changelog to pick up new commits.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = resolve(root, "src/docs/generated/changelog.ts");
const notesFile = resolve(root, "src/docs/changelog-notes.json");
const mdFile = resolve(root, "CHANGELOG.md");
const publicMdFile = resolve(root, "public/changelog.md");

const REPO_URL = "https://github.com/edgecom-ai/design-system";
const MAX_COMMITS = 500;

const git = (...args) => {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
};

// --- bail out rather than truncate on a shallow / non-git tree ---------------
const inRepo = git("rev-parse", "--is-inside-work-tree") === "true";
const shallow = git("rev-parse", "--is-shallow-repository") === "true";
if (!inRepo || shallow) {
  const why = !inRepo ? "not a git repository" : "shallow clone";
  if (existsSync(outFile)) {
    console.log(`gen-changelog — skipped (${why}); keeping the committed changelog`);
    process.exit(0);
  }
  console.warn(`gen-changelog — ${why} and no committed changelog; writing an empty one`);
}

// --- hand-written overrides -------------------------------------------------
const notes = existsSync(notesFile) ? JSON.parse(readFileSync(notesFile, "utf8")) : {};
const hide = new Set(notes.hide ?? []);
const rewrite = notes.rewrite ?? {};
const releaseNotes = notes.releases ?? {};

// --- conventional-commit type -> changelog group ----------------------------
// Order here is the order the groups render in.
const GROUPS = [
  { id: "breaking", label: "Breaking" },
  { id: "added", label: "Added" },
  { id: "fixed", label: "Fixed" },
  { id: "changed", label: "Changed" },
  { id: "performance", label: "Performance" },
  { id: "docs", label: "Documentation" },
  { id: "internal", label: "Internal" },
];
const TYPE_GROUP = {
  feat: "added",
  fix: "fixed",
  perf: "performance",
  refactor: "changed",
  revert: "changed",
  style: "changed",
  docs: "docs",
  build: "internal",
  chore: "internal",
  ci: "internal",
  test: "internal",
};

// --- registry items a commit touched ---------------------------------------
const itemForPath = (p) => {
  const ui = p.match(/^src\/components\/ui\/([\w-]+)\.tsx$/);
  if (ui) return ui[1];
  const hook = p.match(/^src\/hooks\/([\w-]+)\.tsx?$/);
  if (hook) return hook[1];
  if (p === "src/app/globals.css") return "theme";
  return null;
};

// --- read the log -----------------------------------------------------------
// One record per commit, fields separated by \x1f; the file list follows the
// last separator. --no-merges keeps merge commits (which have no file list of
// their own) out of the way.
const RS = "\x1e";
const FS = "\x1f";
const raw =
  git(
    "log",
    "--no-merges",
    `--max-count=${MAX_COMMITS}`,
    "--date=short",
    "--name-only",
    `--pretty=format:${RS}%H${FS}%h${FS}%ad${FS}%D${FS}%s${FS}%b${FS}`
  ) ?? "";

const commits = [];
/** sha -> the release tag pointing at it, when the repo is tagged. */
const tagAt = new Map();
for (const chunk of raw.split(RS)) {
  if (!chunk.trim()) continue;
  const [sha, short, date, refs, subject, body = "", files = ""] = chunk.split(FS);

  const conventional = subject.match(/^(\w+)(?:\(([^)]*)\))?(!)?:\s*(.+)$/);
  const type = conventional ? conventional[1].toLowerCase() : null;
  const scopes = conventional?.[2] ? conventional[2].split(",").map((s) => s.trim()).filter(Boolean) : [];
  let summary = conventional ? conventional[4] : subject;

  // `Changelog:` trailer — skip the commit, or replace its headline.
  const trailer = body.match(/^Changelog:\s*(.+)$/im)?.[1]?.trim();
  const override = rewrite[short] ?? rewrite[sha] ?? (trailer && trailer !== "skip" ? trailer : null);
  const skipped =
    trailer === "skip" || hide.has(short) || hide.has(sha) || (type === "chore" && /^release\b/i.test(summary));
  if (skipped) continue;

  if (override) summary = override;
  summary = summary.charAt(0).toUpperCase() + summary.slice(1);

  const breaking = Boolean(conventional?.[3]) || /^BREAKING[ -]CHANGE:/m.test(body);
  const items = [
    ...new Set(
      files
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean)
        .map(itemForPath)
        .filter(Boolean)
    ),
  ].sort();

  const tag = refs.match(/tag:\s*([^\s,)]+)/)?.[1] ?? null;
  if (tag) tagAt.set(short, tag);
  commits.push({
    sha: short,
    date,
    type: type ?? "other",
    group: breaking ? "breaking" : (TYPE_GROUP[type] ?? "changed"),
    scopes,
    summary,
    items,
    breaking,
  });
}

// --- cut releases -----------------------------------------------------------
// Newest-first: a tagged commit is the *last* commit of that release, so the
// commits seen before it belong to the previous (or unreleased) one.
const tagged = tagAt.size > 0;
const releases = [];
let current = null;

const monthDay = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

const startRelease = (version, date) => {
  // Untagged groups key off their date; in a tagged repo the leading untagged
  // group is "Unreleased".
  const unreleased = tagged && !version;
  const key = version ?? (unreleased ? "unreleased" : date);
  const note = releaseNotes[key] ?? {};
  current = {
    id: `release-${key.replace(/[^\w.-]+/g, "-")}`,
    version,
    date,
    title: note.title ?? version ?? (unreleased ? "Unreleased" : monthDay(date)),
    summary: note.summary ?? null,
    entries: [],
  };
  releases.push(current);
  return current;
};

// A tag marks the release point: the tagged commit is the newest commit of its
// release, and every older untagged commit belongs to it until the next tag.
for (const c of commits) {
  if (tagged) {
    const tag = tagAt.get(c.sha);
    if (tag) startRelease(tag, c.date);
    else if (!current) startRelease(null, c.date);
  } else if (!current || current.date !== c.date) {
    startRelease(null, c.date);
  }
  current.entries.push(c);
}
// Each release is dated by its newest commit (the tagged one, when tagged).
for (const r of releases) r.date = r.entries[0]?.date ?? r.date;

// --- write the docs data ----------------------------------------------------
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(
  outFile,
  `// AUTO-GENERATED by scripts/gen-changelog.mjs — do not edit.
// Source: git history + src/docs/changelog-notes.json. Run \`pnpm docs:changelog\`.

/** A changelog group id — the render order is the order of \`changelogGroups\`. */
export type ChangelogGroup = ${GROUPS.map((g) => `"${g.id}"`).join(" | ")};

export type ChangelogEntry = {
  /** Abbreviated commit sha. */
  sha: string;
  /** ISO date (YYYY-MM-DD) the commit landed. */
  date: string;
  /** Conventional-commit type, or "other" for an unparsed subject. */
  type: string;
  group: ChangelogGroup;
  /** Conventional-commit scopes, e.g. \`fix(sheet,sidebar)\` -> ["sheet","sidebar"]. */
  scopes: string[];
  summary: string;
  /** Registry items the commit touched (ui primitives, hooks, "theme"). */
  items: string[];
  breaking: boolean;
};

export type ChangelogRelease = {
  /** Anchor id for the docs page. */
  id: string;
  /** Git tag, when the repo is tagged; null for date-cut or unreleased groups. */
  version: string | null;
  date: string;
  title: string;
  summary: string | null;
  entries: ChangelogEntry[];
};

export const changelogGroups: { id: ChangelogGroup; label: string }[] = ${JSON.stringify(GROUPS, null, 2)};

export const commitUrl = (sha: string) => \`${REPO_URL}/commit/\${sha}\`;

export const changelog: ChangelogRelease[] = ${JSON.stringify(
releases, null, 2)};
`
);

// --- write the markdown mirrors --------------------------------------------
const groupLabel = Object.fromEntries(GROUPS.map((g) => [g.id, g.label]));
const md = [
  "# Changelog",
  "",
  "<!-- AUTO-GENERATED by scripts/gen-changelog.mjs — do not edit. -->",
  "",
  "Every change to the Edgecom design system, derived from git history. Also published at",
  "[design.edgecom.ai/changelog](https://design.edgecom.ai/getting-started/changelog).",
  "",
];
for (const r of releases) {
  md.push(`## ${r.title}${r.version ? ` — ${r.date}` : ""}`, "");
  if (r.summary) md.push(r.summary, "");
  for (const g of GROUPS) {
    const entries = r.entries.filter((e) => e.group === g.id);
    if (!entries.length) continue;
    md.push(`### ${groupLabel[g.id]}`, "");
    for (const e of entries) {
      const scope = e.scopes.length ? `**${e.scopes.join(", ")}:** ` : "";
      md.push(`- ${scope}${e.summary} ([\`${e.sha}\`](${REPO_URL}/commit/${e.sha}))`);
    }
    md.push("");
  }
}
writeFileSync(mdFile, md.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n");
copyFileSync(mdFile, publicMdFile);

console.log(
  `gen-changelog — ${commits.length} commits in ${releases.length} ${tagged ? "tagged releases" : "dated groups"}`
);
