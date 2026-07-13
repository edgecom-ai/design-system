"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ComponentPreview, InstallCommand } from "@/components/docs/component-preview";
import { Toc } from "@/components/docs/toc";
import { ApiReference } from "@/components/docs/api-reference";
import { getApi } from "@/docs/api";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";

import {
  sections,
  groupedSections,
  findSection,
  sectionPath,
} from "./sections";

/**
 * The docs chrome (sidebar nav + header + content + ⌘K), driven by the current
 * route (`/{group}/{slug}`). The section content is looked up from the registry;
 * navigation uses real routes, so browser back/forward, refresh, and shareable
 * links all work and there's no content flash on deep links.
 */
export function DocsShell({ group, slug }: { group: string; slug: string }) {
  const router = useRouter();
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [searchOpen, setSearchOpen] = React.useState(false);

  const active = findSection(group, slug) ?? sections[0];
  const api = getApi(active.id, active.description);

  // The shell persists across navigations (it lives in the layout), so the
  // content pane keeps its scroll position between sections. Reset it to the
  // top whenever the active section changes so each page starts at the top —
  // the sidebar's own scroll is deliberately left untouched.
  const contentRef = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [active.id]);

  // Drive the theme from <html> so portaled content (dropdown, popover,
  // tooltip, select, toast) — which renders at document.body, outside this
  // component's subtree — inherits the dark tokens too.
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    return () => root.classList.remove("dark");
  }, [theme]);

  // ⌘K / Ctrl+K opens the search palette.
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <Sidebar collapsible="none" className="h-svh">
        <SidebarHeader className="gap-1">
          <div className="flex items-center px-4 pt-2 pb-1">
            <Logo className="h-6 w-auto" />
          </div>
          <div className="px-4 pb-1 text-xs font-medium text-muted-foreground">
            Design System v1.0
          </div>
        </SidebarHeader>

        <SidebarContent>
          {groupedSections.map(({ group, items }) => (
            <SidebarGroup key={group} className="pr-4 pl-0">
              <SidebarGroupLabel className="px-4">{group}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((s) => (
                    <SidebarMenuItem key={s.id}>
                      <SidebarMenuButton
                        isActive={s.id === active.id}
                        className="rounded-l-none rounded-r-full pr-2 pl-4"
                        render={<Link href={sectionPath(s)} />}
                      >
                        <span>{s.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="min-h-0 overflow-hidden">
        <header className="z-10 flex flex-col gap-2 border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-baseline gap-3">
              <h2 className="shrink-0 text-lg font-semibold tracking-tight">
                {active.label}
              </h2>
              {active.description && (
                <p
                  className="truncate text-sm text-muted-foreground"
                  title={active.description}
                >
                  {active.description}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="gap-2 text-muted-foreground"
              >
                <Search className="size-4" />
                <span className="hidden sm:inline">Search</span>
                <CommandShortcut className="hidden sm:inline">⌘K</CommandShortcut>
              </Button>
              <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
                {(["light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
                      theme === t
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {active.install && !active.variants && !active.toc && (
            <div className="max-w-md">
              <InstallCommand command={active.install} />
            </div>
          )}
        </header>

        <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto bg-background text-foreground">
          {active.variants ? (
            <div className="mx-auto flex w-full max-w-6xl gap-8 p-8">
              <div className="flex min-w-0 flex-1 flex-col gap-10">
                {active.variants.map((v) => (
                  <ComponentPreview
                    key={v.id}
                    id={v.id}
                    name={v.name}
                    description={v.description}
                    preview={v.preview}
                    source={v.source}
                  />
                ))}
                {api && <ApiReference api={api} />}
              </div>
              <aside className="sticky top-24 hidden h-fit w-52 shrink-0 xl:block">
                <Toc
                  items={[
                    ...active.variants.map((v) => ({ id: v.id, name: v.name })),
                    ...(api ? [{ id: "api-reference", name: "API reference" }] : []),
                  ]}
                  install={active.install}
                />
              </aside>
            </div>
          ) : active.toc ? (
            <div className="mx-auto flex w-full max-w-6xl gap-8 p-8">
              <div className="min-w-0 flex-1">{active.node}</div>
              <aside className="sticky top-24 hidden h-fit w-52 shrink-0 xl:block">
                <Toc items={active.toc} install={active.install} />
              </aside>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-6xl p-8">{active.node}</div>
          )}
        </div>
      </SidebarInset>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search components, foundations, blocks…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {groupedSections.map(({ group, items }) => (
            <CommandGroup key={group} heading={group}>
              {items.map((s) => (
                <CommandItem
                  key={s.id}
                  value={`${group} ${s.label}`}
                  onSelect={() => {
                    setSearchOpen(false);
                    router.push(sectionPath(s));
                  }}
                >
                  {s.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </SidebarProvider>
  );
}
