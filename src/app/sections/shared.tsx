// Declarations used by more than one section. Split out of sections.tsx by
// scratchpad/split-sections.mjs; see .claude/rules/docs-site.md.

import * as React from "react"

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em] font-medium">
      {children}
    </code>
  );
}

export function Snippet({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-xs leading-relaxed">
      <code className="font-mono text-foreground">{children}</code>
    </pre>
  );
}

export function StatBlock({
  id,
  label,
  children,
}: {
  id?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="flex scroll-mt-24 flex-col gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

export const ss = (p: string) => `components/shadcn-studio/${p}.tsx`;

export const dm = (p: string) => `components/demo/${p}.tsx`;
