import * as React from "react";
import { Link } from "@/components/docs/link";
import { useRouter } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  sectionContent,
  type Section,
  type SectionContent,
} from "./sections";
import type { ComponentApi } from "@/docs/api";

/**
 * The docs chrome (sidebar nav + header + content + ⌘K), driven by the current
 * route (`/{group}/{slug}`). The section content is looked up from the registry;
 * navigation uses real routes, so browser back/forward, refresh, and shareable
 * links all work and there's no content flash on deep links.
 */
/** Shown while a section's lazily-imported demos are fetched. */
function SectionFallback() {
  return (
    <div className="mx-auto w-full max-w-6xl p-8">
      <div className="flex flex-col gap-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * One cached promise per section. `use()` re-reads the promise on every render,
 * so handing it a fresh one each time would suspend forever — the cache is what
 * makes the module load exactly once and the result stick.
 */
const contentPromises = new Map<string, Promise<{ default: SectionContent }>>();

function loadContent(id: string) {
  let p = contentPromises.get(id);
  if (!p) {
    const load = sectionContent[id];
    if (!load) throw new Error(`no content module registered for section "${id}"`);
    p = load();
    contentPromises.set(id, p);
  }
  return p;
}

/**
 * The section body. Split out of `DocsShell` so it can suspend on its own:
 * the shell, sidebar and header stay painted while a section's chunk arrives.
 */
function SectionBody({
  section,
  api,
}: {
  section: Section;
  api: ComponentApi | null;
}) {
  const content = React.use(loadContent(section.id)).default;

  if (content.variants) {
    return (
      <div className="mx-auto flex w-full max-w-6xl gap-8 p-8">
        <div className="flex min-w-0 flex-1 flex-col gap-10">
          {content.variants.map((v) => (
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
              ...content.variants.map((v) => ({ id: v.id, name: v.name })),
              ...(api ? [{ id: "api-reference", name: "API reference" }] : []),
            ]}
            install={section.install}
          />
        </aside>
      </div>
    );
  }

  if (section.toc) {
    return (
      <div className="mx-auto flex w-full max-w-6xl gap-8 p-8">
        <div className="min-w-0 flex-1">{content.node}</div>
        <aside className="sticky top-24 hidden h-fit w-52 shrink-0 xl:block">
          <Toc items={section.toc} install={section.install} />
        </aside>
      </div>
    );
  }

  return <div className="mx-auto w-full max-w-6xl p-8">{content.node}</div>;
}

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
          {active.install && !active.hasVariants && !active.toc && (
            <div className="max-w-md">
              <InstallCommand command={active.install} />
            </div>
          )}
        </header>

        <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto bg-background text-foreground">
          {/* Section content is lazily imported (see sections.tsx), so every demo
              chunk loads on demand rather than shipping with the shell. Keyed on
              the section id so switching sections shows the fallback rather than
              holding the previous section's content while the next one loads. */}
          <React.Suspense key={active.id} fallback={<SectionFallback />}>
            <SectionBody section={active} api={api} />
          </React.Suspense>
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
                    router.navigate({ to: sectionPath(s) as never });
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
