/**
 * Component API reference.
 *
 * Structure (base primitive, part names, cva variant props) is auto-extracted
 * per component by scripts/gen-api.mjs into ./generated/api.ts. This file adds
 * the hand-curated prose *overlay* — summaries and brief part/prop descriptions
 * — which getApi() merges onto the generated structure (so the parts list and
 * ordering always stay accurate to the source).
 */

import { generatedApi } from "./generated/api";
import { curatedApi } from "./curated";

export type ApiPart = { name: string; description?: string };

export type ApiProp = {
  part: string;
  name: string;
  type: string;
  default?: string;
  description?: string;
};

export type ComponentApi = {
  summary: string;
  base?: { name: string; url: string };
  parts: ApiPart[];
  props?: ApiProp[];
};

/** Props that aren't derivable from a cva config (e.g. positioning props on a
 *  Base UI content part). Fully specified; keyed by section id. */
const extraPropsById: Record<string, ApiProp[]> = {
  empty: [
    { part: "EmptyMedia", name: "variant", type: `"default" | "icon"`, default: `"icon"`, description: "Media style — bare or a rounded muted icon tile." },
  ],
  select: [
    { part: "SelectTrigger", name: "size", type: `"sm" | "default"`, default: `"default"`, description: "Control height — sm (h-7) or default (h-8)." },
    { part: "SelectContent", name: "side", type: `"top" | "bottom" | "left" | "right"`, default: `"bottom"`, description: "Which side of the trigger the popup opens on." },
    { part: "SelectContent", name: "align", type: `"start" | "center" | "end"`, default: `"start"`, description: "Alignment of the popup relative to the trigger." },
    { part: "SelectContent", name: "sideOffset", type: "number", default: "4", description: "Gap in pixels between the trigger and the popup." },
    { part: "SelectContent", name: "alignItemWithTrigger", type: "boolean", default: "false", description: "macOS-style overlay of the selected item onto the trigger. Off, for standard dropdown positioning." },
  ],
};

/** Resolve the full API for a section id, merging generated + curated data.
 *  Returns null when there's nothing to show. */
export function getApi(id: string, fallbackSummary?: string): ComponentApi | null {
  const gen = generatedApi[id];
  const cur = curatedApi[id];
  if (!gen && !cur) return null;

  // Part names come from the generated structure; for curated-only components
  // (no backing primitive file, e.g. a composite section) fall back to the
  // curated part keys.
  const partNames = gen?.parts ?? Object.keys(cur?.parts ?? {});
  const parts: ApiPart[] = partNames.map((name) => ({
    name,
    description: cur?.parts?.[name],
  }));

  const omit = new Set(cur?.omitProps ?? []);
  const props: ApiProp[] = [
    ...(gen?.props ?? [])
      .filter((p) => !omit.has(`${p.part}.${p.name}`))
      .map((p) => ({
        ...p,
        description: cur?.propDescriptions?.[`${p.part}.${p.name}`],
      })),
    ...(extraPropsById[id] ?? []),
  ];

  return {
    summary: cur?.summary ?? fallbackSummary ?? "",
    base: cur?.base ?? gen?.base,
    parts,
    props,
  };
}
