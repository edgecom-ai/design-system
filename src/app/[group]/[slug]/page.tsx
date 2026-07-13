import { DocsShell } from "@/app/docs-shell";
import { staticParams } from "@/docs/generated/routes";

/**
 * Enumerate every /{group}/{slug} pair so the static export pre-renders one
 * HTML file per docs section (required by `output: "export"` for dynamic routes).
 * The list is generated (scripts/gen-routes.mjs) because sections.tsx is a
 * "use client" module and can't be read from this server component.
 */
export function generateStaticParams() {
  return staticParams;
}

/**
 * Docs route: /{group}/{slug} — e.g. /components/slider, /blocks/form.
 * Server component so the correct section is chosen from the URL on first
 * paint (no flash); DocsShell (client) renders the interactive chrome.
 */
export default async function DocsRoutePage({
  params,
}: {
  params: Promise<{ group: string; slug: string }>;
}) {
  const { group, slug } = await params;
  return <DocsShell group={group} slug={slug} />;
}
