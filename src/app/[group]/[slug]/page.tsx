import { DocsShell } from "@/app/docs-shell";

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
