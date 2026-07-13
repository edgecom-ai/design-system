"use client";

import { useParams } from "next/navigation";

import { DocsShell } from "@/app/docs-shell";

/**
 * The docs chrome lives in this route-group layout, above the dynamic
 * `[group]/[slug]` segments, so it persists across every navigation instead of
 * remounting. App Router keeps shared parent layouts mounted and only remounts
 * the changed leaf segments — a layout defined *at* a dynamic segment would
 * still remount when its params change, which is why this sits at the static
 * `(docs)` segment. Params come from `useParams` (reactive, no remount) since a
 * client layout can't receive the `params` promise as a prop.
 */
export default function DocsLayout() {
  const params = useParams<{ group: string; slug: string }>();
  return <DocsShell group={params.group} slug={params.slug} />;
}
