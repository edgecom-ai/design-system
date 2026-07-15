/**
 * Hand-curated prose overlay for the API reference, keyed by section id.
 * Descriptions were written from the actual primitive source. Merged onto the
 * auto-extracted structure by getApi() in ./api.ts.
 *
 *   summary           one-line component summary
 *   parts             partName -> one-line description
 *   propDescriptions  "Part.prop" -> one-line description (for cva variant props)
 *   omitProps         "Part.prop" keys to drop from the generated props (e.g. a
 *                     cva variant the extractor misattributed to the wrong part)
 */

export type CuratedApi = {
  summary?: string;
  base?: { name: string; url: string };
  parts?: Record<string, string>;
  propDescriptions?: Record<string, string>;
  omitProps?: string[];
};

export const curatedApi: Record<string, CuratedApi> = {
  accordion: {
    summary:
      "A collapsible disclosure list; each AccordionItem pairs an AccordionTrigger with an AccordionContent panel.",
    parts: {
      Accordion: "Root vertical container wrapping all accordion items.",
      AccordionItem: "Single expandable section with a bottom-border divider.",
      AccordionTrigger: "Header button that toggles its panel; shows a chevron.",
      AccordionContent: "Animated collapsible panel holding the item's content.",
    },
  },
  alert: {
    summary:
      "A callout box laying out an optional icon, AlertTitle, AlertDescription, and a top-right AlertAction.",
    parts: {
      Alert: "Root callout container with role=alert and variant styling.",
      AlertTitle: "Bold single-line heading text for the alert.",
      AlertDescription: "Secondary descriptive body text below the title.",
      AlertAction: "Top-right slot for a dismiss or action button.",
    },
    propDescriptions: {
      "Alert.variant": "Tone: default, destructive, success, warning, or info.",
    },
  },
  badge: {
    summary:
      "A compact pill label (renders a span by default) for statuses, counts, and tags.",
    parts: {
      Badge: "Compact rounded pill for status, counts, or labels.",
    },
    propDescriptions: {
      "Badge.variant": "Color/style: default, semantic, per-commodity, outline, ghost, link.",
    },
  },
  banner: {
    summary:
      "A full-width page-level strip; BannerContent centers and lays out the contents.",
    parts: {
      Banner: "Full-width strip container with default or primary background.",
      BannerContent: "Centered max-width row spacing content with justify-between.",
    },
    propDescriptions: {
      "Banner.variant": "Background: default (muted) or primary.",
    },
  },
  breadcrumb: {
    summary:
      "A navigation trail: a Breadcrumb nav wrapping a BreadcrumbList of items, links, the current page, and separators.",
    parts: {
      Breadcrumb: "Root nav landmark labelled 'breadcrumb'.",
      BreadcrumbList: "Ordered flex list holding the breadcrumb items.",
      BreadcrumbItem: "List item wrapping one crumb's content.",
      BreadcrumbLink: "Interactive link crumb (renders an anchor by default).",
      BreadcrumbPage: "Current-page crumb — non-interactive, with aria-current.",
      BreadcrumbSeparator: "Presentational divider; default chevron-right icon.",
      BreadcrumbEllipsis: "Collapsed-crumbs indicator showing a horizontal-dots icon.",
    },
  },
  button: {
    summary:
      "A clickable button with class-variance-authority variants and sizes, including icon-only sizes.",
    parts: {
      Button: "Clickable button with a configurable visual variant and size.",
    },
    propDescriptions: {
      "Button.variant": "Style: neutral, semantic solid/subtle, or link.",
      "Button.size": "Dimensions: default, xs, sm, lg, and icon variants.",
    },
  },
  "button-group": {
    summary:
      "A container that visually joins adjacent buttons, with optional separators and text segments.",
    parts: {
      ButtonGroup: "Container merging child buttons' borders and radii.",
      ButtonGroupSeparator: "Divider line between grouped buttons.",
      ButtonGroupText: "Non-interactive labelled segment styled like a muted button.",
    },
    propDescriptions: {
      "ButtonGroup.orientation": "Layout direction: horizontal or vertical.",
    },
  },
  calendar: {
    summary:
      "A styled react-day-picker month grid with a custom day-button renderer.",
    parts: {
      Calendar: "Styled DayPicker root rendering the month grid, nav, and dropdowns.",
      CalendarDayButton: "Ghost button for one day cell, with selection/range styling.",
    },
  },
  card: {
    summary:
      "A styled container with composable header, content, and footer sections (all div-based).",
    parts: {
      Card: "Root container with ring, rounded corners, and consistent spacing.",
      CardHeader: "Grid header area for title, description, and optional action.",
      CardFooter: "Bottom bar with a top border and muted background.",
      CardTitle: "Heading-font title text for the card.",
      CardAction: "Slot positioned top-right of the header for actions.",
      CardDescription: "Muted secondary text below the title.",
      CardContent: "Padded region for the card's main body.",
    },
  },
  checkbox: {
    summary: "A checkbox styled as a small box with a check-icon indicator.",
    parts: {
      Checkbox: "Checkbox root with a check-icon indicator when selected.",
    },
  },
  collapsible: {
    summary:
      "An open/closed disclosure: a Trigger toggles a Content panel.",
    parts: {
      Collapsible: "Root managing the open/closed state.",
      CollapsibleTrigger: "Button that toggles the collapsible open and closed.",
      CollapsibleContent: "Panel holding the revealed content.",
    },
  },
  combobox: {
    summary:
      "A searchable, optionally multi-select picker: an input group plus a portalled popup list, with optional selected-value chips.",
    parts: {
      Combobox: "Root managing the value, query, and filtering.",
      ComboboxInput: "The combobox input, with optional trigger and clear buttons.",
      ComboboxContent: "Portalled, positioned popup panel for the listbox.",
      ComboboxList: "Scrollable list container holding the items.",
      ComboboxItem: "A selectable option; shows a check when selected.",
      ComboboxGroup: "Wraps related items. Required around a ComboboxLabel.",
      ComboboxLabel: "Muted heading for a group of items.",
      ComboboxCollection: "Helper that maps data to combobox items.",
      ComboboxEmpty: "Message shown when no items match the query.",
      ComboboxSeparator: "Thin divider between sections.",
      ComboboxChips: "Bordered container laying out selected-value chips + input.",
      ComboboxChip: "A single selected-value chip with an optional remove button.",
      ComboboxChipsInput: "Bare inline input used inside the chips container.",
      ComboboxTrigger: "Button that toggles the popup; appends a chevron.",
      ComboboxValue: "Displays the current selected value.",
    },
  },
  "context-menu": {
    summary:
      "A right-click menu: a Trigger region opens a portalled popup of items, checkboxes, radios, labels, and nested submenus.",
    parts: {
      ContextMenu: "Root managing the menu's open state.",
      ContextMenuTrigger: "The region that opens the menu on right-click.",
      ContextMenuContent: "Portalled, positioned popup container for items.",
      ContextMenuItem: "A clickable menu row (supports inset and destructive).",
      ContextMenuCheckboxItem: "A menu item with a check indicator for a boolean.",
      ContextMenuRadioItem: "A menu item with a dot indicator; use inside a RadioGroup.",
      ContextMenuLabel: "Muted, non-interactive heading. Must be inside a Group.",
      ContextMenuSeparator: "Thin divider between menu sections.",
      ContextMenuShortcut: "Right-aligned muted text showing a keyboard shortcut.",
      ContextMenuGroup: "Wraps related items. Required around a Label.",
      ContextMenuPortal: "Portal that renders the menu content.",
      ContextMenuSub: "Root for a nested submenu.",
      ContextMenuSubContent: "Portalled popup for a submenu.",
      ContextMenuSubTrigger: "A menu item that opens a submenu; shows a chevron.",
      ContextMenuRadioGroup: "Coordinates selection among radio items.",
    },
  },
  "date-picker": {
    summary:
      "A single-date control pairing a popover-triggering button with a Calendar.",
    parts: {
      DatePicker: "Button + popover Calendar for selecting a single date.",
    },
  },
  dialog: {
    summary:
      "A modal dialog: a Trigger opens a portalled overlay + centered Content, with styled header/footer, title, description, and close.",
    parts: {
      Dialog: "Root managing the dialog's open state.",
      DialogTrigger: "Element that opens the dialog on click.",
      DialogPortal: "Renders the dialog outside the DOM tree.",
      DialogOverlay: "Fixed dimmed backdrop behind the dialog.",
      DialogContent: "Portalled, centered popup with an optional close button.",
      DialogHeader: "Styled div stacking the title and description.",
      DialogFooter: "Styled footer row for actions.",
      DialogTitle: "Styled heading text for the dialog.",
      DialogDescription: "Muted supporting text under the title.",
      DialogClose: "Button that closes the dialog.",
    },
  },
  drawer: {
    summary:
      "A swipeable panel that slides in from an edge: a Trigger opens a portalled overlay + Content, with header/footer, title, and description.",
    parts: {
      Drawer: "Root setting modality, snap points, and swipe direction.",
      DrawerTrigger: "Element that opens the drawer on click.",
      DrawerPortal: "Renders the drawer outside the DOM tree.",
      DrawerOverlay: "Swipe-aware dimmed backdrop behind the drawer.",
      DrawerContent: "Portalled panel that slides in from an edge.",
      DrawerSwipeHandle: "Aria-hidden grip for dragging the drawer.",
      DrawerHeader: "Styled div stacking the title and description.",
      DrawerFooter: "Styled footer pinned to the bottom.",
      DrawerTitle: "Styled heading text for the drawer.",
      DrawerDescription: "Muted supporting text under the title.",
      DrawerClose: "Button that closes the drawer.",
    },
  },
  "dropdown-menu": {
    summary:
      "A menu opened from a button: a portalled popup of groups, labels, items, checkbox/radio items, separators, shortcuts, and submenus.",
    parts: {
      DropdownMenu: "Root managing the menu's open state.",
      DropdownMenuTrigger: "Button that opens the menu.",
      DropdownMenuPortal: "Renders the menu outside the DOM tree.",
      DropdownMenuContent: "Portalled, positioned popup container for items.",
      DropdownMenuGroup: "Wraps related items. Required around a Label.",
      DropdownMenuLabel: "Muted heading for a group. Must be inside a Group.",
      DropdownMenuItem: "A selectable menu row.",
      DropdownMenuCheckboxItem: "A menu item with a check indicator.",
      DropdownMenuRadioGroup: "Coordinates selection among radio items.",
      DropdownMenuRadioItem: "A radio menu row with a check indicator.",
      DropdownMenuSeparator: "Thin divider between menu sections.",
      DropdownMenuShortcut: "Right-aligned text showing a keyboard shortcut.",
      DropdownMenuSub: "Root for a nested submenu.",
      DropdownMenuSubTrigger: "A menu item that opens a submenu; shows a chevron.",
      DropdownMenuSubContent: "Portalled popup for a submenu.",
    },
  },
  empty: {
    summary:
      "An empty-state placeholder: a dashed-border container with a header (media, title, description) and a content area for actions.",
    parts: {
      Empty: "Centered dashed-border container for the empty state.",
      EmptyHeader: "Centered column grouping media, title, and description.",
      EmptyMedia: "Icon or media holder with a variant style.",
      EmptyTitle: "The empty-state heading text.",
      EmptyDescription: "Muted paragraph describing the empty state.",
      EmptyContent: "Column area for actions or supplementary content.",
    },
    // The cva variant lives on EmptyMedia, not Empty — the extractor attributes
    // it to the primary part, so drop that and re-add it correctly (see api.ts).
    omitProps: ["Empty.variant"],
  },
  input: {
    summary: "A single-line text field with focus, disabled, and invalid states.",
    parts: {
      Input: "Styled text input element.",
    },
  },
  "navigation-menu": {
    summary:
      "A horizontal nav bar: a List of items whose Triggers open Content panels, with an indicator arrow and a portalled viewport.",
    parts: {
      NavigationMenu: "Root wrapper that also mounts the positioner.",
      NavigationMenuList: "Horizontal row of menu items.",
      NavigationMenuItem: "One menu entry container.",
      NavigationMenuTrigger: "Toggles a content panel; shows a rotating chevron.",
      NavigationMenuContent: "Panel shown for an open item.",
      NavigationMenuLink: "A styled navigable link row.",
      NavigationMenuIndicator: "Animated arrow marking the active trigger.",
      NavigationMenuPositioner: "Portalled positioner holding the popup and viewport.",
    },
  },
  popover: {
    summary:
      "A floating panel anchored to a trigger: PopoverContent can hold a header (title + description) and a close button.",
    parts: {
      Popover: "Root managing the popover's open state.",
      PopoverTrigger: "Element that toggles the popover on click.",
      PopoverContent: "Portalled, positioned popup panel.",
      PopoverHeader: "Div stacking the title and description.",
      PopoverTitle: "Accessible heading for the popover.",
      PopoverDescription: "Muted supporting text.",
      PopoverClose: "Button that closes the popover.",
    },
  },
  progress: {
    summary:
      "A progress bar: the root auto-renders a Track containing an Indicator, with optional Label and Value.",
    parts: {
      Progress: "Root holding the value; auto-renders the track and indicator.",
      ProgressTrack: "The rounded bar background containing the indicator.",
      ProgressIndicator: "The filled bar, sized to the current value.",
      ProgressLabel: "Text label naming the progress bar.",
      ProgressValue: "Right-aligned text showing the formatted value.",
    },
  },
  "radio-group": {
    summary:
      "A set of mutually-exclusive options: a RadioGroup coordinates its RadioGroupItems.",
    parts: {
      RadioGroup: "Root coordinating selection across its items.",
      RadioGroupItem: "A single circular radio with a checked-dot indicator.",
    },
  },
  resizable: {
    summary:
      "Draggable split layouts: a PanelGroup arranges Panels separated by Handles.",
    parts: {
      ResizablePanelGroup: "Container arranging panels horizontally or vertically.",
      ResizablePanel: "An individual resizable region within the group.",
      ResizableHandle: "Draggable divider between panels; optional grip icon.",
    },
  },
  skeleton: {
    summary: "A pulsing muted placeholder block for loading states.",
    parts: {
      Skeleton: "Pulsing muted placeholder for loading states.",
    },
  },
  slider: {
    summary:
      "A track-and-thumb control for a value or range; renders one thumb per value.",
    parts: {
      Slider: "All-in-one slider: track, filled range, and thumbs from value/defaultValue.",
    },
  },
  sortable: {
    summary:
      "Drag-and-drop reordering: Sortable provides context, SortableItem wraps each entry, and SortableOverlay renders the dragged preview.",
    parts: {
      Sortable: "Root managing drag context, sensors, and reordering.",
      SortableItem: "A draggable list entry, keyed by its value.",
      SortableItemHandle: "A grip element that binds the drag listeners.",
      SortableOverlay: "Portalled floating preview of the dragged item.",
    },
  },
  spinner: {
    summary: "A spinning loading indicator with role=status.",
    parts: {
      Spinner: "Animated spinning loader icon with an accessible label.",
    },
  },
  stepper: {
    summary:
      "A multi-step progress flow: a nav of items (trigger, indicator, separator, title, description) with switchable content panels.",
    parts: {
      Stepper: "Root holding the steps, orientation, and navigation state.",
      StepperNav: "Flex nav laying out the stepper items.",
      StepperItem: "Wraps one step, deriving its active/completed state.",
      StepperTrigger: "Clickable tab that navigates to its step.",
      StepperIndicator: "Circular badge showing the step number, icon, or state.",
      StepperSeparator: "Connector line between steps; fills when completed.",
      StepperTitle: "Heading label for a step.",
      StepperDescription: "Muted secondary text for a step.",
      StepperPanel: "Container region for the active step's content.",
      StepperContent: "Content shown only when its value is the current step.",
    },
  },
  switch: {
    summary: "An on/off toggle with a sliding thumb.",
    parts: {
      Switch: "Toggleable on/off switch; supports default and sm sizes.",
    },
  },
  tabs: {
    summary:
      "A tabbed interface: a List of Triggers reveals matching Content panels.",
    parts: {
      Tabs: "Root managing the orientation and active tab value.",
      TabsList: "Container arranging the tab triggers.",
      TabsTrigger: "Clickable tab that activates its panel.",
      TabsContent: "Panel content shown for the active tab.",
    },
    propDescriptions: {
      "Tabs.variant": "TabsList style: filled (default) or underlined (line).",
    },
  },
  "tags-input": {
    summary:
      "A field for entering and removing multiple tag chips, with paste-splitting and validation.",
    parts: {
      TagsInput: "Multi-tag input with removable chips, delimiters, and validation.",
    },
  },
  toggle: {
    summary: "A two-state button that holds a pressed/on state.",
    parts: {
      Toggle: "Pressable button toggling a pressed/on state.",
    },
    propDescriptions: {
      "Toggle.variant": "Style: default (transparent) or outline (bordered).",
      "Toggle.size": "Size: default, sm, or lg.",
    },
  },
  tooltip: {
    summary:
      "A hover hint: a Provider shares timing, a Trigger reveals a portalled Content on hover/focus.",
    parts: {
      Tooltip: "Root managing a single tooltip's open state.",
      TooltipTrigger: "Element that shows the tooltip on hover or focus.",
      TooltipContent: "Portalled, positioned popup with an arrow.",
      TooltipProvider: "Shares the hover delay across tooltips (defaults to 200ms).",
    },
  },
  list: {
    summary:
      "Structured rows built from the Item primitive — media, content (title + description), and trailing actions, grouped by ItemGroup.",
    parts: {
      Item: "A single row laying out media, content, and actions.",
      ItemGroup: "Wraps a set of items as one list.",
      ItemMedia: "Leading icon, avatar, or image slot.",
      ItemContent: "Main column holding the title and description.",
      ItemTitle: "The row's primary line.",
      ItemDescription: "Muted secondary line under the title.",
      ItemActions: "Trailing slot for buttons or a menu.",
      ItemHeader: "Optional header row above the content.",
      ItemFooter: "Optional footer row below the content.",
      ItemSeparator: "A divider between rows.",
    },
    propDescriptions: {
      "Item.variant": "Row surface style.",
      "Item.size": "Row density (padding).",
    },
  },
  toast: {
    summary:
      "App-wide notifications: mount one Toaster near the app root, then call the imperative toast() function to show messages.",
    base: { name: "Sonner", url: "https://sonner.emilkowal.ski" },
    parts: {
      Toaster: "The notifier region — mount once; renders queued toasts.",
    },
  },
  "label-textarea": {
    summary:
      "A labelled multi-line text field — associate a Label with a Textarea via htmlFor / id.",
    parts: {
      Label: "Accessible caption; link to a field with htmlFor.",
      Textarea: "Multi-line text input with focus and invalid states.",
    },
  },
  avatar: {
    summary:
      "A user or contact image with a text fallback. Compose Avatar with AvatarImage + AvatarFallback; stack them in an AvatarGroup with an overflow count.",
    parts: {
      Avatar: "Rounded image container; accepts a size prop (default/sm/lg).",
      AvatarImage: "The photo; covers the avatar once it loads.",
      AvatarFallback: "Shown when no image loads — usually initials.",
      AvatarGroup: "Overlaps child avatars with ring separators.",
      AvatarGroupCount: "Trailing chip showing an overflow count (e.g. +3).",
      AvatarBadge: "A small status dot pinned to the avatar corner.",
    },
  },
  field: {
    summary:
      "Form-field scaffolding: a Field wraps a control with a label, description, and error; group fields with FieldGroup or a FieldSet.",
    parts: {
      Field: "One field row; orientation sets vertical (default) or horizontal.",
      FieldLabel: "The field's label (wraps the Label primitive).",
      FieldContent: "Column holding a control plus its title/description.",
      FieldTitle: "A bold inline title for a field.",
      FieldDescription: "Muted helper text for a field.",
      FieldError: "Error message; pass children or an errors array.",
      FieldGroup: "Stacks multiple fields with consistent spacing.",
      FieldSet: "A fieldset grouping related fields.",
      FieldLegend: "The fieldset's heading (legend or label variant).",
      FieldSeparator: "A divider between fields, with optional centered text.",
    },
  },
  "input-group": {
    summary:
      "An input with attached add-ons. Wrap an InputGroupInput (or Textarea) with InputGroupAddon slots holding icons, text, or buttons.",
    parts: {
      InputGroup: "Bordered container that visually merges the control and add-ons.",
      InputGroupInput: "The text input control inside the group.",
      InputGroupTextarea: "A multi-line control variant inside the group.",
      InputGroupAddon: "An add-on slot; align sets inline/block start or end.",
      InputGroupText: "Muted text inside an add-on (e.g. a unit like kWh).",
      InputGroupButton: "A compact button inside an add-on.",
    },
  },
  "scroll-area": {
    summary:
      "A scrollable region with a custom overlay scrollbar. Set orientation to vertical, horizontal, or both.",
    parts: {
      ScrollArea: "Root + viewport; auto-renders scrollbars per orientation.",
      ScrollBar: "The draggable scrollbar track and thumb.",
    },
  },
  separator: {
    summary:
      "A thin divider line. Set orientation to horizontal (default) or vertical.",
    parts: {
      Separator: "Border-colored divider; orientation sets horizontal or vertical.",
    },
  },
  sheet: {
    summary:
      "A dialog panel that slides in from an edge. A Trigger opens a portalled Content with header/footer, title, description, and close.",
    parts: {
      Sheet: "Root managing the sheet's open state.",
      SheetTrigger: "Opens the sheet; pass a Button via the render prop.",
      SheetContent: "The sliding panel; takes a side prop (default right).",
      SheetHeader: "Top section for the title and description.",
      SheetFooter: "Bottom section for action buttons.",
      SheetTitle: "Accessible heading for the panel.",
      SheetDescription: "Muted supporting text under the title.",
      SheetClose: "Closes the sheet; wrap a Button via the render prop.",
    },
  },
  select: {
    summary:
      "Choose one value from a list. A Root holds the value and wraps a Trigger plus a portalled, positioned Content of Items.",
    parts: {
      Select: "Root. Owns the value state and wraps the trigger and content.",
      SelectTrigger: "The button that opens the listbox and shows the current value.",
      SelectValue: "Renders the selected item's label, or the placeholder when empty.",
      SelectContent: "The popup listbox — portalled, positioned below the trigger.",
      SelectGroup: "Wraps related items. Required around a SelectLabel.",
      SelectLabel: "A non-interactive heading for a group. Must be inside SelectGroup.",
      SelectItem: "A selectable option; shows a check when selected.",
      SelectSeparator: "A thin divider between groups or items.",
      SelectScrollUpButton: "Scroll-up affordance shown when the list overflows.",
      SelectScrollDownButton: "Scroll-down affordance shown when the list overflows.",
    },
  },
  "category-bar": {
    summary:
      "A single horizontal bar split into proportional colored segments, with an optional marker and numeric labels.",
    propDescriptions: {
      "CategoryBar.values": "Segment magnitudes; each width is its share of their sum.",
      "CategoryBar.colors": "Tailwind background classes, one per segment (use semantic tokens).",
      "CategoryBar.marker": "Optional pointer at a value, with an optional tooltip.",
      "CategoryBar.showLabels": "Show the numeric scale above the bar.",
    },
  },
  command: {
    summary:
      "A searchable command palette; type to filter grouped, keyboard-navigable items. Wrap in CommandDialog for a ⌘K overlay.",
    parts: {
      Command: "Root container owning the filter state and keyboard navigation.",
      CommandDialog: "Dialog wrapper that renders the menu as a ⌘K overlay.",
      CommandInput: "Search field that filters the list as you type.",
      CommandList: "Scrollable results region.",
      CommandEmpty: "Fallback shown when nothing matches.",
      CommandGroup: "A labelled group of related items (via heading).",
      CommandItem: "A selectable action or navigation target.",
      CommandSeparator: "A divider between groups.",
      CommandShortcut: "Right-aligned keyboard-shortcut hint on an item.",
    },
  },
  pagination: {
    summary:
      "Page navigation for long lists and tables — previous/next controls, numbered links, and an ellipsis.",
    parts: {
      Pagination: "Root nav landmark labelled for assistive tech.",
      PaginationContent: "The row that lays out the page items.",
      PaginationItem: "A single slot wrapping a link or control.",
      PaginationLink: "A page-number link; mark the current page with isActive.",
      PaginationPrevious: "Link to the previous page.",
      PaginationNext: "Link to the next page.",
      PaginationEllipsis: "Indicates skipped page ranges.",
    },
    propDescriptions: {
      "PaginationLink.isActive": "Marks the current page (aria-current + active styling).",
    },
  },
  sidebar: {
    summary:
      "A composable application sidebar. SidebarProvider supplies collapse state; Sidebar holds a header, a scrollable body of grouped menus, and a footer, alongside a SidebarInset for the main area.",
    parts: {
      SidebarProvider: "Context provider owning open/collapsed state; wrap the whole layout.",
      Sidebar: "The sidebar container; collapsible offcanvas, icon, or none.",
      SidebarHeader: "Top region, typically the logo or workspace switcher.",
      SidebarContent: "Scrollable body holding the navigation groups.",
      SidebarGroup: "A titled section of menu items.",
      SidebarGroupLabel: "Heading for a group.",
      SidebarMenu: "The list of menu items within a group.",
      SidebarMenuItem: "A single menu row.",
      SidebarMenuButton: "The interactive nav button; set isActive for the current page.",
      SidebarFooter: "Bottom region, e.g. settings or the account menu.",
      SidebarInset: "The main content area beside the sidebar.",
      SidebarTrigger: "Button that toggles the sidebar open/collapsed.",
    },
  },
  table: {
    summary:
      "A styled HTML table wrapped for horizontal overflow — header, body, optional footer, rows, cells, and a caption.",
    parts: {
      Table: "Root table, wrapped in an overflow-x container.",
      TableHeader: "The thead grouping header rows.",
      TableBody: "The tbody grouping data rows.",
      TableFooter: "Optional tfoot for totals or summaries.",
      TableRow: "A single row with hover and selected states.",
      TableHead: "A header cell (th).",
      TableCell: "A data cell (td).",
      TableCaption: "A caption describing the table.",
    },
  },
  timeline: {
    summary:
      "A vertical sequence of events. Each TimelineItem pairs a status TimelineDot with a TimelineHeading and TimelineContent, connected by a TimelineLine.",
    parts: {
      Timeline: "Root list; positions dots left, right, or center.",
      TimelineItem: "One event row; status tints the text done or default.",
      TimelineDot: "The status marker: default, current, done, error, or custom.",
      TimelineLine: "The connector drawn between consecutive dots.",
      TimelineHeading: "The event title.",
      TimelineContent: "The event body / description.",
      TimelineTag: "An optional side label aligned to the dot.",
    },
  },
};
