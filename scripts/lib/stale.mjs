// Shared freshness check for the docs generators.
//
// `predev` runs the whole `docs:gen` chain on every `pnpm dev`, and most of it
// is recomputing artifacts from sources that have not moved. This lets each
// generator ask "did anything I depend on change?" and exit early if not.
//
// The stamp hashes BOTH the inputs and the outputs:
//
//   - inputs, so a source edit regenerates;
//   - outputs, so a hand-edited generated file regenerates too. Without that,
//     someone could edit an output, the stamp would still match its inputs, and
//     the hand-edit would survive — exactly the failure the "never hand-edit a
//     generated file" rule and the CI drift check exist to catch.
//
// A missing, unreadable, or malformed stamp always means "regenerate". This is
// a cache, never a source of truth: deleting .cache/docs-gen/ must only ever
// cost time. CI checks out fresh, so it always does the full work.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const cacheDir = join(root, ".cache", "docs-gen");

/** sha256 of a list of files, absent files included as a distinct marker. */
function digest(paths, extra = "") {
  const h = createHash("sha256");
  h.update(extra);
  for (const p of [...paths].sort()) {
    h.update(p);
    try {
      h.update(readFileSync(resolve(root, p)));
    } catch {
      h.update("\0missing");
    }
  }
  return h.digest("hex");
}

/**
 * @param {object} o
 * @param {string}   o.name     stamp file name, e.g. "tokens"
 * @param {string[]} o.inputs   repo-relative source paths
 * @param {string[]} o.outputs  repo-relative generated paths
 * @param {string}  [o.extra]   anything else the output depends on (a git SHA,
 *                              a script version) that is not a file
 * @returns {{ fresh: boolean, save: () => void }}
 */
export function freshness({ name, inputs, outputs, extra = "" }) {
  const stampPath = join(cacheDir, `${name}.json`);
  const key = { in: digest(inputs, extra), out: digest(outputs) };

  let fresh = false;
  try {
    const prev = JSON.parse(readFileSync(stampPath, "utf8"));
    fresh = prev.v === 1 && prev.in === key.in && prev.out === key.out;
  } catch {
    /* no usable stamp — regenerate */
  }

  return {
    fresh,
    // Called after writing the outputs, so the stamp records what was produced.
    save() {
      mkdirSync(cacheDir, { recursive: true });
      writeFileSync(
        stampPath,
        JSON.stringify({ v: 1, in: key.in, out: digest(outputs) }),
      );
    },
  };
}

/** True when `--force` is on the command line, or DOCS_GEN_FORCE is set. */
export const forced = () =>
  process.argv.includes("--force") || !!process.env.DOCS_GEN_FORCE;
