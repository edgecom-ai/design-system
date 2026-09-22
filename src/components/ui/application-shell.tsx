"use client"

import * as React from "react"
import {
  Building2,
  ChevronRight,
  ChevronsUpDown,
  Moon,
  Search,
  Sun,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuSubmenu,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

/**
 * The Edgecom portal shell — the one page frame every client-portal screen
 * renders inside: a collapsible icon-rail `sidebar` with the logo, the product
 * navigation and the account menu; a top bar with the rail toggle, search, the
 * building switcher, the app's own actions and the theme toggle; and the
 * scrolling content area. It is composed from the registry's own primitives,
 * so an active item, a menu, a tooltip or a badge inside it is the same one
 * found everywhere else.
 *
 * `ApplicationShell` is the whole frame from data — pass `nav`, `activeItem`,
 * `user`, `buildings` and the page as children. The parts it is built from are
 * exported too, for an app that needs a different header cluster or a second
 * navigation group.
 */

type ApplicationShellNavLeaf = {
  /** Stable id; `activeItem` matches on it. */
  id: string
  label: string
  /** Where the item navigates. Omit it and the item is a button that calls `onNavigate`. */
  href?: string
  /** A lucide icon component. Sub-items carry one too, as the portal's do. */
  icon?: React.ComponentType<{ className?: string }>
}

type ApplicationShellNavItem = ApplicationShellNavLeaf & {
  /** A count or short tag shown at the row's end while the rail is expanded. */
  badge?: React.ReactNode
  /** Sub-pages; the item becomes a collapsible submenu (a hover flyout when the rail is collapsed). */
  items?: ApplicationShellNavLeaf[]
}

type ApplicationShellUser = {
  name: string
  email?: string
  /** Avatar image URL; the initials show when it is missing or fails. */
  avatar?: string
  /** Defaults to the first letters of the first two words of `name`. */
  initials?: string
}

type NavLinkProps = {
  /**
   * Render a navigation item with the app's router — `(item) => <Link to={item.href} />`.
   * Without it, an item with an `href` is a plain anchor and one without is a button.
   */
  renderLink?: (item: ApplicationShellNavLeaf) => React.ReactElement
  /** Called when an item without an `href` (or any item, alongside navigation) is chosen. */
  onNavigate?: (item: ApplicationShellNavLeaf) => void
}

// Wrapped primitives keep their own `data-slot` (they spread props onto the
// element that carries it, so setting one here would replace theirs and break
// every selector that targets it); the shell's parts are addressable through
// `data-part` instead. Plain elements this file owns carry `data-slot`.
const ApplicationShellContext = React.createContext<
  NavLinkProps & { activeItem?: string }
>({})

const isGrouped = (
  nav: ApplicationShellNavItem[] | ApplicationShellNavItem[][]
): nav is ApplicationShellNavItem[][] => Array.isArray(nav[0])

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

function useNavRender(item: ApplicationShellNavLeaf) {
  const { renderLink, onNavigate } = React.useContext(ApplicationShellContext)
  // The element is a render template: useRender merges the menu button's
  // children (icon + label) into it, so it is never rendered empty.
  const render = renderLink
    ? renderLink(item)
    : item.href
      ? // eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label
        <a href={item.href} />
      : undefined
  const onClick = onNavigate ? () => onNavigate(item) : undefined
  return { render, onClick }
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function ApplicationShell({
  nav,
  footerNav,
  activeItem,
  renderLink,
  onNavigate,
  user,
  userMenu,
  buildings,
  building,
  onBuildingChange,
  search = false,
  actions,
  themeToggle = true,
  collapsible = "icon",
  defaultOpen,
  open,
  onOpenChange,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> &
  NavLinkProps & {
    /** Top-level navigation, in order — or several groups, drawn with a separator between them. */
    nav: ApplicationShellNavItem[] | ApplicationShellNavItem[][]
    /** Items docked above the account menu — typically Settings. */
    footerNav?: ApplicationShellNavItem[]
    /** The id of the current item or sub-item. */
    activeItem?: string
    /** The signed-in user; renders the account menu in the sidebar footer. */
    user?: ApplicationShellUser
    /** Items for the account menu — `DropdownMenuItem`s — under the user's name. */
    userMenu?: React.ReactNode
    /** Buildings the user can switch between; renders the switcher in the top bar. */
    buildings?: string[]
    building?: string
    onBuildingChange?: (building: string) => void
    /** Show the global search field in the top bar. */
    search?: boolean | { placeholder?: string; value?: string; onChange?: (value: string) => void }
    /** The app's own top-bar controls — notifications, help — placed before the theme toggle. */
    actions?: React.ReactNode
    /** The light/dark toggle in the top bar. It flips `.dark` on `<html>`. */
    themeToggle?: boolean
    collapsible?: React.ComponentProps<typeof Sidebar>["collapsible"]
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** The page. */
    children?: React.ReactNode
  }) {
  const ctx = React.useMemo(
    () => ({ renderLink, onNavigate, activeItem }),
    [renderLink, onNavigate, activeItem]
  )
  return (
    <ApplicationShellContext.Provider value={ctx}>
      <SidebarProvider
        data-part="application-shell"
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        className={className}
        {...props}
      >
        <ApplicationShellSidebar collapsible={collapsible}>
          {(isGrouped(nav) ? nav : [nav]).map((group, i) => (
            <React.Fragment key={i}>
              {i > 0 ? <SidebarSeparator /> : null}
              <ApplicationShellNav items={group} />
            </React.Fragment>
          ))}
          <ApplicationShellSidebarFooter>
            {footerNav?.length ? <ApplicationShellNav items={footerNav} bare /> : null}
            {user ? <ApplicationShellUserMenu user={user}>{userMenu}</ApplicationShellUserMenu> : null}
          </ApplicationShellSidebarFooter>
        </ApplicationShellSidebar>
        <SidebarInset className="min-w-0 overflow-hidden">
          <ApplicationShellHeader>
            {search ? (
              <ApplicationShellSearch {...(typeof search === "object" ? search : {})} />
            ) : null}
            <ApplicationShellActions>
              {buildings?.length ? (
                <ApplicationShellBuildingSwitcher
                  buildings={buildings}
                  value={building}
                  onValueChange={onBuildingChange}
                />
              ) : null}
              {actions}
              {themeToggle ? <ApplicationShellThemeToggle /> : null}
            </ApplicationShellActions>
          </ApplicationShellHeader>
          <ApplicationShellContent>{children}</ApplicationShellContent>
        </SidebarInset>
      </SidebarProvider>
    </ApplicationShellContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Sidebar column
// ---------------------------------------------------------------------------

/** The rail: logo header, then whatever navigation and footer are passed as children. */
function ApplicationShellSidebar({
  className,
  children,
  collapsible = "icon",
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      data-part="application-shell-sidebar"
      collapsible={collapsible}
      className={className}
      {...props}
    >
      <SidebarHeader>
        <div className="flex h-8 items-center px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Logo className="h-6 w-auto group-data-[collapsible=icon]:hidden" />
          <Logo
            variant="mark"
            className="hidden h-6 w-auto group-data-[collapsible=icon]:inline-flex"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>{children}</SidebarContent>
    </Sidebar>
  )
}

/**
 * One navigation group. Items with `items` render as submenus. `bare` drops
 * the group's own padding — for the footer, whose `SidebarFooter` already pads,
 * so its rows line up with the main navigation on the collapsed rail.
 */
function ApplicationShellNav({
  items,
  bare = false,
  className,
  ...props
}: React.ComponentProps<typeof SidebarGroup> & {
  items: ApplicationShellNavItem[]
  bare?: boolean
}) {
  const menu = (
    <SidebarMenu>
      {items.map((item) =>
        item.items?.length ? (
          <ApplicationShellNavSubmenu key={item.id} item={item} />
        ) : (
          <ApplicationShellNavItem key={item.id} item={item} />
        )
      )}
    </SidebarMenu>
  )
  if (bare) return menu
  return (
    <SidebarGroup data-part="application-shell-nav" className={className} {...props}>
      <SidebarGroupContent>{menu}</SidebarGroupContent>
    </SidebarGroup>
  )
}

function ApplicationShellNavItem({ item }: { item: ApplicationShellNavItem }) {
  const { activeItem } = React.useContext(ApplicationShellContext)
  const { render, onClick } = useNavRender(item)
  const Icon = item.icon
  const isActive = activeItem === item.id
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={item.label}
        render={render}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
      >
        {Icon ? <Icon /> : null}
        <span>{item.label}</span>
      </SidebarMenuButton>
      {item.badge != null ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
    </SidebarMenuItem>
  )
}

function ApplicationShellNavSubmenu({ item }: { item: ApplicationShellNavItem }) {
  const { activeItem } = React.useContext(ApplicationShellContext)
  const { render, onClick } = useNavRender(item)
  const Icon = item.icon
  const childActive = item.items?.some((s) => s.id === activeItem) ?? false
  const isActive = activeItem === item.id || childActive
  const [open, setOpen] = React.useState(isActive)
  return (
    <SidebarMenuItem>
      <SidebarMenuSubmenu
        label={item.label}
        open={open}
        onOpenChange={setOpen}
        nativeButton={!render}
        trigger={
          <SidebarMenuButton
            isActive={isActive}
            render={render}
            onClick={onClick}
            aria-current={activeItem === item.id ? "page" : undefined}
          >
            {Icon ? <Icon /> : null}
            <span>{item.label}</span>
            <ChevronRight
              className={cn("ml-auto transition-transform", open && "rotate-90")}
            />
          </SidebarMenuButton>
        }
      >
        {item.items?.map((sub) => (
          <ApplicationShellNavSubItem key={sub.id} item={sub} />
        ))}
      </SidebarMenuSubmenu>
    </SidebarMenuItem>
  )
}

function ApplicationShellNavSubItem({ item }: { item: ApplicationShellNavLeaf }) {
  const { activeItem } = React.useContext(ApplicationShellContext)
  const { render, onClick } = useNavRender(item)
  const isActive = activeItem === item.id
  const Icon = item.icon
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        isActive={isActive}
        // eslint-disable-next-line jsx-a11y/control-has-associated-label -- render template; the label is the child span
        render={render ?? <button type="button" />}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
      >
        {Icon ? <Icon /> : null}
        <span>{item.label}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

/** The bottom of the rail — footer navigation and the account menu. */
function ApplicationShellSidebarFooter({
  className,
  ...props
}: React.ComponentProps<typeof SidebarFooter>) {
  return (
    <SidebarFooter
      data-part="application-shell-sidebar-footer"
      className={cn("mt-auto", className)}
      {...props}
    />
  )
}

/** The signed-in user, docked bottom-left, opening the account menu. */
function ApplicationShellUserMenu({
  user,
  children,
  align = "start",
}: {
  user: ApplicationShellUser
  /** `DropdownMenuItem`s (and separators) under the user's name. */
  children?: React.ReactNode
  align?: React.ComponentProps<typeof DropdownMenuContent>["align"]
}) {
  const initials = user.initials ?? initialsOf(user.name)
  return (
    // The rule above the block spans the rail's full width — the footer's own
    // padding is undone and re-applied inside.
    <SidebarMenu
      data-part="application-shell-user-menu"
      className="-mx-2 border-t border-sidebar-border px-2 pt-2"
    >
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={user.name}
                aria-label={`Account: ${user.name}`}
                className="group-data-[collapsible=icon]:justify-center"
              >
                <Avatar size="sm">
                  {user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col text-left group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-body-sm font-medium">{user.name}</span>
                  {user.email ? (
                    <span className="truncate text-caption text-sidebar-foreground/70">
                      {user.email}
                    </span>
                  ) : null}
                </div>
                <ChevronsUpDown className="ml-auto size-3.5 shrink-0 text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            }
          />
          {/* Opens upward, as wide as the block it opens from; a compact floor on the collapsed rail. */}
          <DropdownMenuContent
            align={align}
            side="top"
            sideOffset={8}
            className="w-(--anchor-width) min-w-56"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2 font-normal">
                <Avatar size="sm">
                  {user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-body-sm font-medium text-foreground">{user.name}</span>
                  {user.email ? (
                    <span className="truncate text-caption text-muted-foreground">
                      {user.email}
                    </span>
                  ) : null}
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            {children ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>{children}</DropdownMenuGroup>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

// ---------------------------------------------------------------------------
// Main column
// ---------------------------------------------------------------------------

/** The top bar: the rail toggle, then whatever is passed — search, actions. */
function ApplicationShellHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="application-shell-header"
      className={cn(
        "flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4",
        className
      )}
      {...props}
    >
      <SidebarTrigger aria-label="Toggle navigation" />
      {children}
    </header>
  )
}

/** Global search in the top bar. Hidden on phones, where the rail's search takes over. */
function ApplicationShellSearch({
  placeholder = "Search sites, meters…",
  value,
  onChange,
  className,
  ...props
}: Omit<React.ComponentProps<typeof InputGroup>, "onChange"> & {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}) {
  return (
    <InputGroup
      data-part="application-shell-search"
      className={cn("hidden max-w-xs sm:flex", className)}
      {...props}
    >
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label="Search"
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
    </InputGroup>
  )
}

/** The right-hand cluster of the top bar. */
function ApplicationShellActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="application-shell-actions"
      className={cn("ml-auto flex items-center gap-1", className)}
      {...props}
    />
  )
}

/** Switch the building (site) the portal is showing. */
function ApplicationShellBuildingSwitcher({
  buildings,
  value,
  onValueChange,
  label = "Switch building",
}: {
  buildings: string[]
  value?: string
  onValueChange?: (building: string) => void
  label?: string
}) {
  const [internal, setInternal] = React.useState(buildings[0])
  const current = value ?? internal
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-part="application-shell-building-switcher"
        render={
          <Button variant="outline" size="sm" className="max-w-52 gap-2">
            <Building2 className="size-4 shrink-0" />
            <span className="truncate">{current}</span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={current}
          onValueChange={(v) => {
            setInternal(v as string)
            onValueChange?.(v as string)
          }}
        >
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          {buildings.map((b) => (
            <DropdownMenuRadioItem key={b} value={b}>
              {b}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Flips the `.dark` class on `<html>` — the design system's theme switch. */
function ApplicationShellThemeToggle({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children">) {
  const [dark, setDark] = React.useState(false)

  // Mirror the document so the icon stays right when the theme changes elsewhere.
  React.useEffect(() => {
    const root = document.documentElement
    const sync = () => setDark(root.classList.contains("dark"))
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  return (
    <Button
      data-part="application-shell-theme-toggle"
      variant="ghost"
      size="icon-sm"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      onClick={() => document.documentElement.classList.toggle("dark")}
      className={className}
      {...props}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  )
}

/** The scrolling page area beside the rail. */
function ApplicationShellContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="application-shell-content"
      className={cn("min-h-0 flex-1 overflow-y-auto p-4 md:p-6", className)}
      {...props}
    />
  )
}

export {
  ApplicationShell,
  ApplicationShellSidebar,
  ApplicationShellNav,
  ApplicationShellSidebarFooter,
  ApplicationShellUserMenu,
  ApplicationShellHeader,
  ApplicationShellSearch,
  ApplicationShellActions,
  ApplicationShellBuildingSwitcher,
  ApplicationShellThemeToggle,
  ApplicationShellContent,
}
export type { ApplicationShellNavItem, ApplicationShellNavLeaf, ApplicationShellUser }
