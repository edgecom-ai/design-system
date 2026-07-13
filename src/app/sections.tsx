"use client"

import * as React from "react"
import Link from "next/link"
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Zap,
  Gauge,
  DollarSign,
  Leaf,
  TrendingUp,
  Bell,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ComponentPreview, InstallCommand } from "@/components/docs/component-preview";
import { Toc } from "@/components/docs/toc";
import { SeparatorDemo } from "@/components/demo/separator-demo";
import { ApplicationShellDemo } from "@/components/demo/application-shell-demo";
import { AvatarBasicDemo, AvatarGroupDemo } from "@/components/demo/avatar-demo";
import { ScrollAreaDemo } from "@/components/demo/scroll-area-demo";
import { SheetDemo } from "@/components/demo/sheet-demo";
import { FieldDemo } from "@/components/demo/field-demo";
import { InputGroupDemo } from "@/components/demo/input-group-demo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputDemo from "@/components/shadcn-studio/input/input-01";
import InputLabelDemo from "@/components/shadcn-studio/input/input-02";
import InputRequiredDemo from "@/components/shadcn-studio/input/input-03";
import InputDisabledDemo from "@/components/shadcn-studio/input/input-04";
import InputDefaultValueDemo from "@/components/shadcn-studio/input/input-07";
import InputStartHelperTextDemo from "@/components/shadcn-studio/input/input-09";
import InputErrorDemo from "@/components/shadcn-studio/input/input-12";
import InputStartIconDemo from "@/components/shadcn-studio/input/input-14";
import InputStartAddOnDemo from "@/components/shadcn-studio/input/input-19";
import InputEndAddOnDemo from "@/components/shadcn-studio/input/input-20";
import InputAddOnsDemo from "@/components/shadcn-studio/input/input-21";
import InputPasswordDemo from "@/components/shadcn-studio/input/input-26";
import InputFileDemo from "@/components/shadcn-studio/input/input-27";
import InputClearDemo from "@/components/shadcn-studio/input/input-36";
import InputSearchLoaderDemo from "@/components/shadcn-studio/input/input-39";
import InputWithPlusMinusButtonsDemo from "@/components/shadcn-studio/input/input-40";
import InputOTPNumberDemo from "@/components/shadcn-studio/input-otp/input-otp-01";
import PhoneInputWithLabel from "@/components/shadcn-studio/phone-input/phone-input-02";
import ListDemo from "@/components/shadcn-studio/list/list-01";
import ListNotifications from "@/components/shadcn-studio/list/list-02";
import ItemsList from "@/components/shadcn-studio/list/list-03";
import ListUsers from "@/components/shadcn-studio/list/list-06";
import PopoverAboutDemo from "@/components/shadcn-studio/popover/popover-05";
import PopoverDeleteFileDemo from "@/components/shadcn-studio/popover/popover-07";
import PopoverFeedbackDemo from "@/components/shadcn-studio/popover/popover-08";
import PopoverFilterDemo from "@/components/shadcn-studio/popover/popover-09";
import PopoverSearchDemo from "@/components/shadcn-studio/popover/popover-10";
import PopoverNotificationsDemo from "@/components/shadcn-studio/popover/popover-11";
import RadioGroupDemo from "@/components/shadcn-studio/radio-group/radio-group-01";
import RadioGroupHorizontalDemo from "@/components/shadcn-studio/radio-group/radio-group-02";
import RadioGroupCardRadioDemo from "@/components/shadcn-studio/radio-group/radio-group-11";
import RadioGroupCardVerticalRadioDemo from "@/components/shadcn-studio/radio-group/radio-group-13";
import NativeSelectDemo from "@/components/shadcn-studio/select/select-01";
import NativeSelectPlaceholderDemo from "@/components/shadcn-studio/select/select-02";
import NativeSelectRequiredDemo from "@/components/shadcn-studio/select/select-06";
import SelectWithOptionsGroupsDemo from "@/components/shadcn-studio/select/select-22";
import MultipleSelectWithPlaceholderDemo from "@/components/shadcn-studio/select/select-33";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
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
import SkeletonText from "@/components/shadcn-studio/skeleton/skeleton-02";
import SkeletonForm from "@/components/shadcn-studio/skeleton/skeleton-04";
import SkeletonAccordion from "@/components/shadcn-studio/skeleton/skeleton-07";
import SkeletonTable from "@/components/shadcn-studio/skeleton/skeleton-11";
import SkeletonWidgetsCards from "@/components/shadcn-studio/skeleton/skeleton-12";
import SwitchCardDemo from "@/components/shadcn-studio/switch/switch-16";
import SwitchListGroupDemo from "@/components/shadcn-studio/switch/switch-18";
import TextareaInvalidDemo from "@/components/shadcn-studio/textarea/textarea-05";
import TextareaRequiredDemo from "@/components/shadcn-studio/textarea/textarea-07";
import TextareaWithButtonDemo from "@/components/shadcn-studio/textarea/textarea-16";
import ToggleFilledIcon from "@/components/shadcn-studio/toggle/toggle-05";
import ToggleIconPattern from "@/components/shadcn-studio/toggle/toggle-07";
import ToggleGroupSizes from "@/components/shadcn-studio/toggle-group/toggle-group-03";
import ToggleGroupLayout from "@/components/shadcn-studio/toggle-group/toggle-group-08";
import ToggleGroupTooltip from "@/components/shadcn-studio/toggle-group/toggle-group-09";
import TooltipErrorDemo from "@/components/shadcn-studio/tooltip/tooltip-04";
import TooltipContentDemo from "@/components/shadcn-studio/tooltip/tooltip-07";
import TooltipBadgeDemo from "@/components/shadcn-studio/tooltip/tooltip-10";
import HoverCardStatsDemo from "@/components/shadcn-studio/tooltip/tooltip-12";
import HoverCardProjectDemo from "@/components/shadcn-studio/tooltip/tooltip-13";
import HoverCardTasksDemo from "@/components/shadcn-studio/tooltip/tooltip-15";
import SliderWithTicksDemo from "@/components/shadcn-studio/slider/slider-09";
import SliderMultiThumbDemo from "@/components/shadcn-studio/slider/slider-02";
import SliderMultiTooltipDemo from "@/components/shadcn-studio/slider/slider-12";
import SortableDemo from "@/components/shadcn-studio/sortable/sortable-01";
import SortableGroupDemo from "@/components/shadcn-studio/sortable/sortable-03";
import SortableNotificationChannels from "@/components/shadcn-studio/sortable/sortable-04";
import SortableTaskColumnsDemo from "@/components/shadcn-studio/sortable/sortable-05";
import StepperInlineDescriptionDemo from "@/components/shadcn-studio/stepper/stepper-05";
import StepperHorizontalSubmitDemo from "@/components/shadcn-studio/stepper/stepper-08";
import StepperVerticalDemo from "@/components/shadcn-studio/stepper/stepper-09";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ToastDemo } from "@/components/demo/toast-demo";
import { BadgeVariantsDemo } from "@/components/demo/badge-variants";
import { BadgeCommoditiesDemo } from "@/components/demo/badge-commodities";
import { CardDemo } from "@/components/demo/card-demo";
import CardBottomImageDemo from "@/components/shadcn-studio/card/card-04";
import CardTopImageDemo from "@/components/shadcn-studio/card/card-05";
import CardHorizontalDemo from "@/components/shadcn-studio/card/card-06";
import CardWithTabsDemo from "@/components/shadcn-studio/card/card-10";
import CollapsibleTreeDemo from "@/components/shadcn-studio/collapsible/collapsible-02";
import CollapsibleCardDemo from "@/components/shadcn-studio/collapsible/collapsible-07";
import { SpinnerDemo } from "@/components/demo/spinner-demo";
import { SkeletonAvatarDemo } from "@/components/demo/skeleton-avatar-demo";
import { SwitchBasicDemo } from "@/components/demo/switch-basic-demo";
import { ToggleFormattingDemo } from "@/components/demo/toggle-formatting-demo";
import { SliderBasicDemo } from "@/components/demo/slider-basic-demo";
import { ProgressLinearDemo } from "@/components/demo/progress-linear-demo";
import { SelectSitesDemo } from "@/components/demo/select-sites-demo";
import { TextareaNoteDemo } from "@/components/demo/textarea-note-demo";
import { DatePickerDemo } from "@/components/demo/date-picker-demo";
import DatePickerRangeDemo from "@/components/shadcn-studio/date-picker/date-picker-02";
import DatePickerNaturalLanguageDemo from "@/components/shadcn-studio/date-picker/date-picker-05";
import DatePickerTimeDemo from "@/components/shadcn-studio/date-picker/date-picker-08";
import DatePickerDateTimeDemo from "@/components/shadcn-studio/date-picker/date-picker-10";
import DatePickerRangeTimeDemo from "@/components/shadcn-studio/date-picker/date-picker-12";
import { BannerDemo } from "@/components/demo/banner-demo";
import { BannerActionDemo } from "@/components/demo/banner-action-demo";
import { BannerFloatingDemo } from "@/components/demo/banner-floating-demo";
import { AuthorizationDemo } from "@/components/demo/authorization-demo";
import { AuthorizationRequestDemo } from "@/components/demo/authorization-request-demo";
import { UserDetailsDialogDemo } from "@/components/demo/user-details-dialog-demo";
import { CreateAlarmDialogDemo } from "@/components/demo/create-alarm-dialog-demo";
import SearchDialog from "@/components/shadcn-studio/blocks/dialog-search";
import VerifyDialog from "@/components/shadcn-studio/blocks/dashboard-dialog-09/dialog-verify";
import FileUploadDialog from "@/components/shadcn-studio/blocks/dashboard-dialog-11/dialog-file-upload";
import UpdateProductDialog from "@/components/shadcn-studio/blocks/dashboard-dialog-12/dialog-update-product";
import AddAddressDialog from "@/components/shadcn-studio/blocks/dashboard-dialog-14/dialog-add-address";
import InitializePipelineDialog from "@/components/shadcn-studio/blocks/dashboard-dialog-25/dialog-pipeline-configuration";
import ShareCollaborateDialog from "@/components/shadcn-studio/blocks/dashboard-dialog-26/dialog-share-collaborate";
import { ButtonVariantsDemo } from "@/components/demo/button-variants-demo";
import { ButtonSizesDemo } from "@/components/demo/button-sizes-demo";
import { ButtonIconsDemo } from "@/components/demo/button-icons-demo";
import { ButtonIconButtonsDemo } from "@/components/demo/button-icon-buttons-demo";
import { ButtonLoadingDemo } from "@/components/demo/button-loading-demo";
import { ChartRampDemo } from "@/components/demo/chart-ramp-demo";
import { ContextMenuDemo } from "@/components/demo/context-menu-demo";
import ContextMenuBasicDemo from "@/components/shadcn-studio/context-menu/context-menu-01";
import ContextMenuSubmenuDemo from "@/components/shadcn-studio/context-menu/context-menu-02";
import NavigationMenuDemo from "@/components/shadcn-studio/navigation-menu/navigation-menu-01";
import NavigationMenuFeatureDemo from "@/components/shadcn-studio/navigation-menu/navigation-menu-03";
import NavigationMenuExploreDemo from "@/components/shadcn-studio/navigation-menu/navigation-menu-04";
import NavigationMenuDesignDemo from "@/components/shadcn-studio/navigation-menu/navigation-menu-05";
import { ResizableDemo } from "@/components/demo/resizable-demo";
import { ResizableVerticalDemo } from "@/components/demo/resizable-vertical-demo";
import { EmptyDemo } from "@/components/demo/empty-demo";
import { EmptySearchDemo } from "@/components/demo/empty-search-demo";
import { EmptyTableDemo } from "@/components/demo/empty-table-demo";
import BadgeClosableDemo from "@/components/shadcn-studio/badge/badge-12";
import BadgeInProgressDemo from "@/components/shadcn-studio/badge/badge-16";
import BadgeBlockedDemo from "@/components/shadcn-studio/badge/badge-17";
import BadgeCompletedDemo from "@/components/shadcn-studio/badge/badge-18";
import BadgeDotDemo from "@/components/shadcn-studio/badge/badge-05";
import ButtonGhostDemo from "@/components/shadcn-studio/button/button-16";
import ButtonPromiseDemo from "@/components/shadcn-studio/button/button-26";
import ButtonCopyStateDemo from "@/components/shadcn-studio/button/button-28";
import EnergyConsumptionMetrics from "@/components/shadcn-studio/blocks/chart-saas-revenue-metrics";
import EnergySpendCard from "@/components/shadcn-studio/blocks/chart-budget-spend-analytics";
import DemandResponsePerformance from "@/components/shadcn-studio/blocks/chart-revenue-performance";
import FormLayoutPersonalInfo from "@/components/shadcn-studio/blocks/form-layout-01/form-layout-01";
import FormValidatedTanstack from "@/components/shadcn-studio/blocks/form-validated/form-validated";
import FormLayoutOnboardingWizard from "@/components/shadcn-studio/blocks/form-layout-09/form-layout-09";
import PageHeaderDemo from "@/components/shadcn-studio/blocks/page-header/page-header-demo";
import PageHeaderTabsDemo from "@/components/shadcn-studio/blocks/page-header/page-header-tabs";
import PageHeaderToolbarDemo from "@/components/shadcn-studio/blocks/page-header/page-header-toolbar";
import SecuritySettings from "@/components/shadcn-studio/blocks/settings-shell/security-settings";
import AccountSettings from "@/components/shadcn-studio/blocks/settings-shell/account-settings";
import SettingsContent from "@/components/shadcn-studio/blocks/settings-shell/settings-content";
import FileUploadDemo from "@/components/shadcn-studio/blocks/file-upload-02/file-upload-02";
import GeneralFinanceReviewsCard from "@/components/shadcn-studio/blocks/widget-general-finance-reviews";
import OrdersCard from "@/components/shadcn-studio/blocks/widget-orders";
import UserOrderCard from "@/components/shadcn-studio/blocks/widget-user-order";
import CustomerActivityCard from "@/components/shadcn-studio/blocks/widget-component-20/widget-customer-activity";
import MonthlyCampaignCard from "@/components/shadcn-studio/blocks/widget-monthly-campaign";
import ProductInsightsCard from "@/components/shadcn-studio/blocks/widget-product-insights";
import StatisticsFinancePreview from "@/app/statistics-component-13/page";
import StatisticsScorePreview from "@/app/statistics-component-14/page";
import StatisticsHealthPreview from "@/app/statistics-component-22/page";
import StatisticsLineTrendsPreview from "@/app/statistics-component-21/page";
import StatisticsRevenueChannelPreview from "@/app/statistics-component-19/page";
import StatisticsWithStatusPreview from "@/app/statistics-component-12/page";
import StatisticsExpenseIncomePreview from "@/app/statistics-component-07/page";
import StatisticsOverviewPreview from "@/app/statistics-component-09/page";
import StatisticsActivityPreview from "@/app/statistics-component-10/page";
import BreadcrumbWithDropdownDemo from "@/components/shadcn-studio/breadcrumb/breadcrumb-06";
import { DataTableAdvancedDemo } from "@/components/demo/datatable-demo";
import AlertClosableDemo from "@/components/shadcn-studio/alert/alert-03";
import AlertSoftSuccessDemo from "@/components/shadcn-studio/alert/alert-23";
import AlertSoftWarningDemo from "@/components/shadcn-studio/alert/alert-24";
import AlertSoftInfoDemo from "@/components/shadcn-studio/alert/alert-22";
import AlertSoftDestructiveDemo from "@/components/shadcn-studio/alert/alert-25";
import AlertFileUploadDemo from "@/components/shadcn-studio/alert/alert-07";
import AlertWithActionDemo from "@/components/shadcn-studio/alert/alert-13";
import CircularProgressDemo from "@/components/shadcn-studio/progress/progress-23";
import ProgressShapeDemo from "@/components/shadcn-studio/progress/progress-04";
import ProgressChecklistDemo from "@/components/shadcn-studio/progress/progress-14";
import DrawerWithSides from "@/components/shadcn-studio/drawer/drawer-04";
import AnimatedUnderlineTabsDemo from "@/components/shadcn-studio/tabs/tabs-29";
import AnimatedTabsDemo from "@/components/shadcn-studio/tabs/tabs-27";
import AccordionDemo from "@/components/shadcn-studio/accordion/accordion-01";
import AccordionOutlineDemo from "@/components/shadcn-studio/accordion/accordion-09";
import AccordionMultilevelIconDemo from "@/components/shadcn-studio/accordion/accordion-16";
import ButtonGroupGhostDemo from "@/components/shadcn-studio/button-group/button-group-12";
import ButtonGroupDropdownDemo from "@/components/shadcn-studio/button-group/button-group-11";
import CalendarRangeCalendarMultiMonthDemo from "@/components/shadcn-studio/calendar/calendar-04";
import CalendarEventListDemo from "@/components/shadcn-studio/calendar/calendar-11";
import CalendarWithRangePresetsDemo from "@/components/shadcn-studio/calendar/calendar-23";
import CalendarAppointmentBookingDemo from "@/components/shadcn-studio/calendar/calendar-24";
import CalendarPricingDemo from "@/components/shadcn-studio/calendar/calendar-25";
import CheckboxDemo from "@/components/shadcn-studio/checkbox/checkbox-01";
import CheckboxDescriptionDemo from "@/components/shadcn-studio/checkbox/checkbox-07";
import CheckboxHorizontalGroupDemo from "@/components/shadcn-studio/checkbox/checkbox-08";
import CheckboxCardDemo from "@/components/shadcn-studio/checkbox/checkbox-13";
import CheckboxTreeDemo from "@/components/shadcn-studio/checkbox/checkbox-15";
import ComboboxDemo from "@/components/shadcn-studio/combobox/combobox-01";
import TagsInputDemo from "@/components/shadcn-studio/tags-input/tags-input-01";
import TagsInputEmailsDemo from "@/components/shadcn-studio/tags-input/tags-input-02";
import ComboboxOptionGroupDemo from "@/components/shadcn-studio/combobox/combobox-02";
import ComboboxWithSearchAndButtonDemo from "@/components/shadcn-studio/combobox/combobox-06";
import ComboboxMultipleExpandableDemo from "@/components/shadcn-studio/combobox/combobox-11";
import DataTableBasicDemo from "@/components/shadcn-studio/data-table/data-table-01";
import DataTableWithExpandableRowsDemo from "@/components/shadcn-studio/data-table/data-table-09";
import DataTableWithPaginationDemo from "@/components/shadcn-studio/data-table/data-table-11";
import DataTableWithExportDemo from "@/components/shadcn-studio/data-table/data-table-12";
import EditableDataTableDemo from "@/components/shadcn-studio/data-table/data-table-13";
import AlertDialogDemo from "@/components/shadcn-studio/dialog/dialog-01";
import AlertDialogWithIconDemo from "@/components/shadcn-studio/dialog/dialog-02";
import AlertDialogDestructiveDemo from "@/components/shadcn-studio/dialog/dialog-03";
import DialogStickyFooterDemo from "@/components/shadcn-studio/dialog/dialog-06";
import DialogTermsAndConditionDemo from "@/components/shadcn-studio/dialog/dialog-08";
import DialogOTPVerificationDemo from "@/components/shadcn-studio/dialog/dialog-12";
import DropdownMenuDemo from "@/components/shadcn-studio/dropdown-menu/dropdown-menu-01";
import DropdownMenuItemActionDemo from "@/components/shadcn-studio/dropdown-menu/dropdown-menu-04";
import DropdownMenuUserMenuDemo from "@/components/shadcn-studio/dropdown-menu/dropdown-menu-07";
import DropdownMenuUserProfileDemo from "@/components/shadcn-studio/dropdown-menu/dropdown-menu-08";
import DropdownMenuCheckboxDemo from "@/components/shadcn-studio/dropdown-menu/dropdown-menu-13";

// Solid fills. `bg`/`fg` are CSS color expressions the WCAG meter resolves at
// runtime (label = foreground text sitting on the fill).
const swatches: { name: string; className: string; fgClass: string; bg: string; fg: string }[] = [
  { name: "primary", className: "bg-primary", fgClass: "text-primary-foreground", bg: "var(--primary)", fg: "var(--primary-foreground)" },
  { name: "accent", className: "bg-accent", fgClass: "text-accent-foreground", bg: "var(--accent)", fg: "var(--accent-foreground)" },
  { name: "secondary", className: "bg-secondary", fgClass: "text-secondary-foreground", bg: "var(--secondary)", fg: "var(--secondary-foreground)" },
  { name: "muted", className: "bg-muted", fgClass: "text-muted-foreground", bg: "var(--muted)", fg: "var(--muted-foreground)" },
  { name: "destructive", className: "bg-destructive", fgClass: "text-white", bg: "var(--destructive)", fg: "white" },
  { name: "success", className: "bg-success", fgClass: "text-success-foreground", bg: "var(--success)", fg: "var(--success-foreground)" },
  { name: "warning", className: "bg-warning", fgClass: "text-warning-foreground", bg: "var(--warning)", fg: "var(--warning-foreground)" },
  { name: "info", className: "bg-info", fgClass: "text-info-foreground", bg: "var(--info)", fg: "var(--info-foreground)" },
  { name: "card", className: "bg-card border border-border", fgClass: "text-card-foreground", bg: "var(--card)", fg: "var(--card-foreground)" },
];

// Tinted "subtle" surfaces — banner / pill background + its -foreground text.
const subtleSurfaces = [
  { name: "primary", box: "bg-primary-subtle text-primary-subtle-foreground", bg: "var(--primary-subtle)", fg: "var(--primary-subtle-foreground)" },
  { name: "success", box: "bg-success-subtle text-success-subtle-foreground", bg: "var(--success-subtle)", fg: "var(--success-subtle-foreground)" },
  { name: "warning", box: "bg-warning-subtle text-warning-subtle-foreground", bg: "var(--warning-subtle)", fg: "var(--warning-subtle-foreground)" },
  { name: "info", box: "bg-info-subtle text-info-subtle-foreground", bg: "var(--info-subtle)", fg: "var(--info-subtle-foreground)" },
  { name: "destructive", box: "bg-destructive-subtle text-destructive-subtle-foreground", bg: "var(--destructive-subtle)", fg: "var(--destructive-subtle-foreground)" },
];

// Emphasis colors used as text on the page background.
const emphasisText = [
  { name: "primary", fg: "var(--primary)" },
  { name: "success-emphasis", fg: "var(--success-emphasis)" },
  { name: "warning-emphasis", fg: "var(--warning-emphasis)" },
  { name: "info-emphasis", fg: "var(--info-emphasis)" },
  { name: "destructive-emphasis", fg: "var(--destructive-emphasis)" },
];

// Elevation stack (recessed → raised).
const surfaces = [
  { name: "muted", cls: "bg-muted" },
  { name: "background", cls: "bg-background" },
  { name: "card", cls: "bg-card" },
  { name: "elevated", cls: "bg-elevated" },
];

const widgetFinanceStats = [
  { className: "bg-primary", label: "Savings", value: "$8,042", change: 16, changeType: "decrease" as const },
  { className: "bg-primary/20", label: "Peaks", value: "42", change: 6, changeType: "increase" as const },
  { className: "bg-primary/10", label: "Sites", value: "1,200", change: 21, changeType: "increase" as const },
];

const widgetCampaignData = [
  { icon: <Zap />, title: "Sites monitored", value: "1,284", percentage: "2.4%" },
  { icon: <Gauge />, title: "Peaks avoided", value: "312", percentage: "5.1%" },
  { icon: <DollarSign />, title: "GA savings", value: "$71K", percentage: "8.7%" },
  { icon: <TrendingUp />, title: "Load shaved", value: "48 MW", percentage: "3.3%" },
  { icon: <Leaf />, title: "CO₂ avoided", value: "129 t", percentage: "4.2%" },
  { icon: <Bell />, title: "Alerts sent", value: "94", percentage: "1.1%" },
];

function ClosableBadgeDemo() {
  const [key, setKey] = React.useState(0);
  return (
    <div className="flex items-center gap-2">
      <BadgeClosableDemo key={key} />
      <Button size="sm" variant="ghost" onClick={() => setKey((k) => k + 1)}>
        Reset
      </Button>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em] font-medium">
      {children}
    </code>
  );
}

function Snippet({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-xs leading-relaxed">
      <code className="font-mono text-foreground">{children}</code>
    </pre>
  );
}

// --- Live WCAG contrast meter -------------------------------------------
// Resolves a CSS color expression (incl. var() chains + oklch) to sRGB by
// painting it to a 1px canvas and reading the pixel — then computes the WCAG
// contrast ratio. Recomputes when the <html> `dark` class toggles.
function resolveRgb(expr: string): [number, number, number] | null {
  const probe = document.createElement("div");
  probe.style.color = expr;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  if (!resolved) return null;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.fillStyle = "#ffffff";
  ctx.fillStyle = resolved; // canvas resolves oklch()/rgb() to sRGB bytes
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

function relLuminance([r, g, b]: [number, number, number]): number {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function useContrast(fg: string, bg: string): number | null {
  const [ratio, setRatio] = React.useState<number | null>(null);
  React.useEffect(() => {
    const compute = () => {
      const a = resolveRgb(fg);
      const b = resolveRgb(bg);
      if (!a || !b) return setRatio(null);
      const l1 = relLuminance(a);
      const l2 = relLuminance(b);
      setRatio((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
    };
    compute();
    const obs = new MutationObserver(compute);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, [fg, bg]);
  return ratio;
}

function ContrastBadge({
  fg,
  bg,
  large = false,
  className,
}: {
  fg: string;
  bg: string;
  large?: boolean;
  className?: string;
}) {
  const ratio = useContrast(fg, bg);
  if (ratio == null) return null;
  const aa = large ? 3 : 4.5;
  const aaa = large ? 4.5 : 7;
  const [label, tone] =
    ratio >= aaa
      ? ["AAA", "bg-success-subtle text-success-subtle-foreground"]
      : ratio >= aa
        ? ["AA", "bg-success-subtle text-success-subtle-foreground"]
        : ratio >= 3
          ? ["AA Large", "bg-warning-subtle text-warning-subtle-foreground"]
          : ["Fail", "bg-destructive-subtle text-destructive-subtle-foreground"];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular",
        tone,
        className
      )}
    >
      {ratio.toFixed(2)}:1 · {label}
    </span>
  );
}

/** Description list of type samples, one per row, divided by separators. */
function TypeList({
  items,
  align = "baseline",
}: {
  items: { sample: React.ReactNode; note: string }[];
  align?: "baseline" | "center";
}) {
  return (
    <dl className="flex flex-col rounded-lg border border-border px-4">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Separator />}
          <div
            className={cn(
              "flex justify-between gap-6 py-3",
              align === "center" ? "items-center" : "items-baseline"
            )}
          >
            <dt className="min-w-0">{item.sample}</dt>
            <dd className="shrink-0 text-caption text-muted-foreground">
              {item.note}
            </dd>
          </div>
        </React.Fragment>
      ))}
    </dl>
  );
}

/**
 * Wraps a single element from an "in context" example so hovering it reveals
 * the semantic typography token(s) it's built from (e.g. `text-heading`).
 * The child is rendered as the tooltip trigger via Base UI's `render` prop, so
 * no extra wrapper element is introduced into the layout.
 */
function TokenHint({
  token,
  children,
}: {
  token: string;
  children: React.ReactElement;
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side="top">
        <code className="font-mono">{token}</code>
      </TooltipContent>
    </Tooltip>
  );
}

function ColorsPage() {
  return (
    <div className="flex flex-col gap-10">
      <p className="max-w-2xl text-sm text-muted-foreground">
        Live WCAG 2.1 contrast, measured from rendered pixels in the current theme —
        toggle{" "}
        <span className="font-medium text-foreground">light / dark</span> above to
        recompute. Targets:{" "}
        <span className="font-medium text-foreground">AA ≥ 4.5:1</span> for text,{" "}
        <span className="font-medium text-foreground">3:1</span> for large text / UI.
      </p>

      <section id="colors-solid" className="flex scroll-mt-24 flex-col gap-3">
        <h3 className="text-title">Solid fills</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {swatches.map((s) => (
            <div
              key={s.name}
              className={cn(
                s.className,
                s.fgClass,
                "flex h-24 flex-col justify-between rounded-lg p-3"
              )}
            >
              <span className="text-xs font-medium">{s.name}</span>
              <ContrastBadge fg={s.fg} bg={s.bg} />
            </div>
          ))}
        </div>
        <p className="text-caption text-muted-foreground">
          Score = label (foreground) legibility on the fill.
        </p>
      </section>

      <section id="colors-subtle" className="flex scroll-mt-24 flex-col gap-3">
        <h3 className="text-title">Status &amp; brand surfaces — subtle</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {subtleSurfaces.map((s) => (
            <div
              key={s.name}
              className={cn(
                s.box,
                "flex h-24 flex-col justify-between rounded-lg border border-border/40 p-3"
              )}
            >
              <span className="text-xs font-medium">{s.name}-subtle</span>
              <ContrastBadge fg={s.fg} bg={s.bg} />
            </div>
          ))}
        </div>
        <p className="text-caption text-muted-foreground">
          Tinted banner / pill background with its <code>-subtle-foreground</code> text.
        </p>
      </section>

      <section id="colors-emphasis" className="flex scroll-mt-24 flex-col gap-3">
        <h3 className="text-title">Emphasis colors as text</h3>
        <div className="flex flex-col gap-2">
          {emphasisText.map((e) => (
            <div key={e.name} className="flex items-center gap-3">
              <span
                className="w-72 text-body font-semibold"
                style={{ color: e.fg }}
              >
                Peak demand shaved 12% — {e.name}
              </span>
              <ContrastBadge fg={e.fg} bg="var(--background)" />
            </div>
          ))}
        </div>
        <p className="text-caption text-muted-foreground">
          On the page background. Use these (not the base fill color) whenever a status
          color is rendered as text or a thin icon.
        </p>
      </section>

      <section id="colors-elevation" className="flex scroll-mt-24 flex-col gap-3">
        <h3 className="text-title">Elevation surfaces</h3>
        <div className="flex flex-wrap gap-3">
          {surfaces.map((s) => (
            <div
              key={s.name}
              className={cn(
                s.cls,
                "flex h-20 w-40 items-end rounded-lg border border-border p-3 text-xs font-medium"
              )}
            >
              {s.name}
            </div>
          ))}
        </div>
        <p className="text-caption text-muted-foreground">
          Recessed (muted) → page → card → elevated (raised menus / popovers).
        </p>
      </section>
    </div>
  );
}

function StatBlock({
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

function StepHeading({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {n}
      </span>
      {children}
    </h2>
  );
}

function GetStartedDoc() {
  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Installation</h1>
        <p className="leading-7 text-muted-foreground">
          The Edgecom Design System is a public shadcn registry, distributed straight from{" "}
          <a className="font-medium text-primary dark:text-primary-emphasis underline underline-offset-4" href="https://ui.shadcn.com/docs/registry/github" target="_blank" rel="noreferrer">GitHub</a>.
          It ships our design tokens and <a className="font-medium text-primary dark:text-primary-emphasis underline underline-offset-4" href="https://base-ui.com" target="_blank" rel="noreferrer">Base UI</a> components —
          pull them into your app with the shadcn CLI, no copy-paste and no hardcoded hex.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <StepHeading n={1}>Prerequisites</StepHeading>
        <p className="text-sm text-muted-foreground">
          Your app needs a shadcn-initialized project on{" "}
          <a className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis" href="https://tailwindcss.com" target="_blank" rel="noreferrer">Tailwind&nbsp;v4</a>. If
          you haven&rsquo;t already, run <Code>pnpm dlx shadcn@latest init</Code> — it creates{" "}
          <Code>components.json</Code>, adds <Code>@import &quot;tailwindcss&quot;;</Code> to your CSS,
          and sets up the <Code>@/*</Code> path alias our components import through.
        </p>
        <ul className="ml-4 flex list-disc flex-col gap-1 text-sm text-muted-foreground marker:text-muted-foreground/60">
          <li>Tailwind v4 with <Code>@import &quot;tailwindcss&quot;;</Code> in your CSS entry</li>
          <li>A <Code>@/*</Code> path alias (matching <Code>components.json</Code> aliases)</li>
          <li>React&nbsp;19 / Next&nbsp;16 (or compatible) and the <Code>lucide-react</Code> icon set</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <StepHeading n={2}>Install straight from GitHub</StepHeading>
        <p className="text-sm text-muted-foreground">
          There&rsquo;s nothing to configure — no <Code>components.json</Code> entry and no token.
          The public repo <em>is</em> the registry: reference any item by its GitHub address,{" "}
          <Code>edgecom-ai/design-system/&lt;name&gt;</Code>, and the CLI fetches it plus everything
          it depends on. Pin to a branch, tag, or commit by appending <Code>#ref</Code>.
        </p>
        <Snippet>{`# address format — no config, no auth
edgecom-ai/design-system/<name>

# pin to a tag, branch, or commit
edgecom-ai/design-system/button#v1.0.0`}</Snippet>
      </section>

      <section className="flex flex-col gap-3">
        <StepHeading n={3}>Add components</StepHeading>
        <p className="text-sm text-muted-foreground">
          Add whatever you need — the theme comes with it. Every component depends on{" "}
          <Code>theme</Code>, so the first install automatically writes the OKLCH tokens
          into your <Code>globals.css</Code> and drops <Code>cn</Code> into <Code>lib/utils.ts</Code>.
          Cross-component dependencies, hooks, and package deps all resolve on their own — adding{" "}
          <Code>sidebar</Code>, for example, pulls its sub-components and the{" "}
          <Code>use-mobile</Code> hook too.
        </p>
        <Snippet>{`# theme + tokens ride along on the first component you add
pnpm dlx shadcn@latest add edgecom-ai/design-system/button edgecom-ai/design-system/card

# want just the tokens (no component)? add the theme on its own
pnpm dlx shadcn@latest add edgecom-ai/design-system/theme`}</Snippet>
        <p className="text-sm text-muted-foreground">
          Re-running is safe: files already present are skipped, so shared pieces like the theme and{" "}
          <Code>button</Code> are never duplicated. Pass <Code>--overwrite</Code> only when you mean
          to discard local edits.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <StepHeading n={4}>Build with semantic tokens — never hardcode</StepHeading>
        <p className="text-sm text-muted-foreground">
          Every color is a token that tracks light/dark automatically. Use the utility, not the hex.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg border border-success/40 bg-success/5 p-4">
            <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-success">
              <CheckCircle2 className="size-3.5" /> Do
            </span>
            <Code>{`<Button className="bg-primary text-primary-foreground" />`}</Code>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
            <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-destructive">
              <XCircle className="size-3.5" /> Don&rsquo;t
            </span>
            <Code>{`<button className="bg-[#0966C0] text-white" />`}</Code>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Token families:{" "}
          <Code>primary</Code> <Code>accent</Code> <Code>secondary</Code> <Code>muted</Code>{" "}
          <Code>success</Code> <Code>warning</Code> <Code>info</Code> <Code>destructive</Code>{" "}
          <Code>border</Code> <Code>ring</Code> <Code>chart-1…5</Code> — each with a matching{" "}
          <Code>-foreground</Code>. See <span className="font-medium text-foreground">Foundations → Semantic colors</span>.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <StepHeading n={5}>Compose with Base UI, not Radix</StepHeading>
        <p className="text-sm text-muted-foreground">
          Our primitives are built on Base UI. Pass a trigger via the <Code>render</Code> prop —
          there is no <Code>asChild</Code>.
        </p>
        <Snippet>{`// ✅ Base UI — pass the trigger element via \`render\`
<DialogTrigger render={<Button>Open</Button>} />

// ❌ not Radix-style asChild
<DialogTrigger asChild><Button>Open</Button></DialogTrigger>`}</Snippet>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">What&rsquo;s inside</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium">Foundations</p>
            <p className="mt-1 text-xs text-muted-foreground">Colors, chart ramp, typography</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium">Components</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Buttons, inputs, tables, overlays &amp; more
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium">Blocks</p>
            <p className="mt-1 text-xs text-muted-foreground">Charts &amp; data tables</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Browse the groups in the sidebar to preview every item in light and dark.
        </p>
      </section>
    </div>
  );
}

function AccessibilityDoc() {
  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Accessibility</h1>
        <p className="leading-7 text-muted-foreground">
          Accessibility is the practice of building interfaces that everyone can perceive,
          operate, and understand — regardless of vision, motor, or cognitive ability, input
          device, or environment. We treat it as a baseline rather than a feature for a subset of
          users, because designing with accessibility in mind produces a product that is clearer
          for <em>everyone</em>. The high-contrast color, legible type, and predictable focus
          states that a screen-reader or keyboard user relies on are the same qualities that help
          an operator reading a dashboard on a glare-washed phone outside a substation, or anyone
          scanning quickly at the end of a long shift. Accessible design is simply better design,
          and the entire user base benefits from it.
        </p>
      </div>

      <section id="a11y-color" className="flex scroll-mt-24 flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Color &amp; contrast</h2>
        <p className="leading-7 text-muted-foreground">
          Every semantic color pair is tuned against the{" "}
          <a
            className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
            href="https://www.w3.org/WAI/WCAG21/quickref/"
            target="_blank"
            rel="noreferrer"
          >
            WCAG&nbsp;2.1
          </a>{" "}
          contrast guidelines. The goal is <strong>AA at a minimum</strong> (4.5:1 for body text,
          3:1 for large text and UI boundaries) and <strong>AAA wherever the palette allows</strong>{" "}
          (7:1). In practice the surfaces you read most clear AAA comfortably — body, card, and
          popover text land near 19:1 in light mode and 18:1 in dark, while secondary, accent, and
          muted helper text stay at or above AA in both themes. For contrast-sensitive cases such
          as text links or labels on tinted fills, dedicated <Code>*-emphasis</Code> token variants
          (for example <Code>primary-emphasis</Code>) push separation further. Light and dark are
          held to the same bar.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Body / background", ratio: "≈19:1 · AAA", cls: "border border-border bg-background text-foreground" },
            { label: "Muted surface", ratio: "helper text ≥4.5:1 · AA", cls: "border border-border bg-muted text-muted-foreground" },
            { label: "Primary", ratio: "≈5.5:1 · AA", cls: "bg-primary text-primary-foreground" },
            { label: "Success", ratio: "≈4.7:1 · AA", cls: "bg-success text-success-foreground" },
            { label: "Warning", ratio: "≈7.7:1 · AAA", cls: "bg-warning text-warning-foreground" },
            { label: "Info", ratio: "≈4.6:1 · AA", cls: "bg-info text-info-foreground" },
          ].map((s) => (
            <div key={s.label} className={cn("flex flex-col justify-between gap-4 rounded-lg p-4", s.cls)}>
              <p className="text-sm font-medium">{s.label}</p>
              <p className="text-xs opacity-80">{s.ratio}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="a11y-balance" className="flex scroll-mt-24 flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Balancing visual design &amp; accessibility
        </h2>
        <p className="leading-7 text-muted-foreground">
          Accessibility and visual polish are treated as one problem, not competing ones. Rather
          than flattening the palette to force contrast, the system keeps the Edgecom blue and its
          semantic hues and pairs each with a foreground chosen to clear the threshold. Tuned{" "}
          <Code>*-emphasis</Code> and <Code>*-subtle</Code> variants give designers room to hit
          contrast targets — a darker text tone here, a lighter tint there — without abandoning the
          brand. The result is an interface that still looks like Edgecom and reads cleanly for
          everyone.
        </p>
      </section>

      <section id="a11y-type" className="flex scroll-mt-24 flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Scalable, legible type</h2>
        <p className="leading-7 text-muted-foreground">
          The type scale is defined in relative units. Every size — from captions to display
          headings — is expressed in <Code>rem</Code> and inherits from the browser&rsquo;s root
          font size; nothing in the scale is pinned to a fixed pixel value. When a reader raises
          their default font size or zooms the page, the whole interface scales with them instead
          of clipping or overflowing. Sizes are paired with comfortable line heights, and a single
          sans-serif family (Inter) is used throughout for consistent, legible rendering across
          platforms. See <span className="font-medium text-foreground">Typography</span> for the
          full scale.
        </p>
      </section>
    </div>
  );
}

function IntroductionDoc() {
  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Introduction</h1>
        <p className="leading-7 text-muted-foreground">
          This is <strong className="text-foreground">Edgecom Energy&rsquo;s design system</strong>{" "}
          for our software products — the shared foundation of design tokens, components, and
          patterns behind dataTrack™, pTrack®, and the tools around them. Its purpose is a
          cohesive, consistent experience across every Edgecom application, so that a chart, a
          table, or a control looks and behaves the same way no matter which product a user is in.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Built for industrial energy applications
        </h2>
        <p className="leading-7 text-muted-foreground">
          Energy monitoring is a data-dense domain: interval meter reads, demand curves, cost and
          emissions breakdowns, power-quality traces, and alarms — often spanning many sites and
          thousands of channels at once. The system is built for that scale. Its data tables, chart
          ramp, and semantic colors are tuned to keep large volumes of data and heavy visualization
          legible and calm rather than noisy, and to stay consistent whether you are looking at a
          single submeter or an entire portfolio.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Based on shadcn</h2>
        <p className="leading-7 text-muted-foreground">
          It is built on{" "}
          <a
            className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noreferrer"
          >
            shadcn
          </a>{" "}
          and distributed as a public registry from{" "}
          <a className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis" href="https://ui.shadcn.com/docs/registry/github" target="_blank" rel="noreferrer">GitHub</a>:
          you install real, owned components straight into your app with the shadcn CLI instead of
          copying markup or taking on a black-box dependency. Under the hood the primitives are composed with{" "}
          <a
            className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
            href="https://base-ui.com"
            target="_blank"
            rel="noreferrer"
          >
            Base UI
          </a>
          . Head to{" "}
          <Link
            className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
            href="/getting-started/installation"
          >
            Installation
          </Link>{" "}
          to install it and start building.
        </p>
      </section>
    </div>
  );
}

export type Variant = {
  /** anchor slug, unique within the section, e.g. "with-icon" */
  id: string;
  name: string;
  description?: string;
  preview: React.ReactNode;
  /** Source key into /docs-source/<source>.json (path relative to src/). Omit for inline previews with no backing file. */
  source?: string;
  /** Per-variant install override; falls back to the section's `install`. */
  install?: string;
};

export type Section = {
  id: string;
  label: string;
  group: string;
  /** One-line summary shown under the page title. */
  description?: string;
  /** shadcn registry item name(s) to `pnpm dlx shadcn@latest add` for this section. */
  install?: string;
  /** Structured variant previews (preferred). */
  variants?: Variant[];
  /** Legacy escape hatch for prose/foundation sections. */
  node?: React.ReactNode;
  /** Manual "On this page" anchors for node sections (variant sections derive their own). */
  toc?: { id: string; name: string }[];
};

/** Source-key helper for shadcn-studio demo files. */
const ss = (p: string) => `components/shadcn-studio/${p}.tsx`;
/** Source-key helper for demo/ files. */
const dm = (p: string) => `components/demo/${p}.tsx`;

export const sections: Section[] = [
  {
    id: "introduction",
    label: "Introduction",
    group: "Getting Started",
    description:
      "A design system for building cohesive, data-dense, energy applications",
    node: <IntroductionDoc />,
  },
  {
    id: "installation",
    label: "Installation",
    group: "Getting Started",
    description:
      "Everything you need to install the Edgecom design system and start building with it.",
    node: <GetStartedDoc />,
  },
  {
    id: "accessibility",
    label: "Accessibility",
    group: "Getting Started",
    description:
      "Contrast, scalable type, and balancing accessibility with visual design.",
    node: <AccessibilityDoc />,
    toc: [
      { id: "a11y-color", name: "Color & contrast" },
      { id: "a11y-balance", name: "Balancing visual design & accessibility" },
      { id: "a11y-type", name: "Scalable, legible type" },
    ],
  },
  {
    id: "colors",
    label: "Semantic colors",
    group: "Foundations",
    description:
      "Semantic color tokens that adapt automatically between light and dark themes.",
    install: "@edgecom/theme",
    toc: [
      { id: "colors-solid", name: "Solid fills" },
      { id: "colors-subtle", name: "Status & brand surfaces" },
      { id: "colors-emphasis", name: "Emphasis colors as text" },
      { id: "colors-elevation", name: "Elevation surfaces" },
    ],
    node: <ColorsPage />,
  },
  {
    id: "charts",
    label: "Chart ramp",
    group: "Foundations",
    description:
      "Categorical hues and sequential tint ramps for charting each commodity.",
    install: "@edgecom/theme",
    variants: [
      {
        id: "chart-ramp",
        name: "Categorical & tint ramps",
        description:
          "One hue per commodity for categorical series, plus 100–900 tint ramps for sequential shading.",
        preview: <ChartRampDemo />,
        source: dm("chart-ramp-demo"),
      },
    ],
  },
  {
    id: "typography",
    label: "Typography",
    group: "Foundations",
    description:
      "The type scale, tabular figures, and heading styles used across the platform.",
    install: "@edgecom/theme",
    toc: [
      { id: "typo-scale", name: "Semantic scale" },
      { id: "typo-tabular", name: "Tabular figures" },
      { id: "typo-headings", name: "Headings" },
      { id: "typo-prose", name: "Prose" },
      { id: "typo-text", name: "Text styles" },
      { id: "typo-examples", name: "Examples" },
    ],
    node: (
      <div className="flex max-w-2xl flex-col gap-8">
        <p className="text-sm text-muted-foreground">
          Typeface <span className="font-medium text-foreground">Inter</span> —
          used across every weight and role in the system.
        </p>

        <div id="typo-scale" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Semantic scale — size · line-height · weight baked into one token
          </span>
          <TypeList
            items={[
              { sample: <span className="text-display">Energy that adds up</span>, note: "text-display · 36 / 40 · 700" },
              { sample: <span className="text-heading">Energy that adds up</span>, note: "text-heading · 24 / 30 · 600" },
              { sample: <span className="text-title">Energy that adds up</span>, note: "text-title · 18 / 24 · 600" },
              { sample: <span className="text-body-lg">Energy that adds up</span>, note: "text-body-lg · 16 / 24" },
              { sample: <span className="text-body">Energy that adds up</span>, note: "text-body · 14 / 22" },
              { sample: <span className="text-caption">Energy that adds up</span>, note: "text-caption · 12 / 16 · 500" },
            ]}
          />
        </div>

        <div id="typo-tabular" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Tabular figures — <code className="font-mono">tabular</code> utility aligns
            numeric columns (meter readouts, KPIs)
          </span>
          <div className="grid max-w-md grid-cols-2 gap-x-8 rounded-lg border border-border p-4">
            <div className="flex flex-col gap-1">
              <span className="text-caption text-muted-foreground">default</span>
              {["1,284.05", "942.10", "37,001.98"].map((n) => (
                <span key={n} className="text-body">{n} kWh</span>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-caption text-muted-foreground">.tabular</span>
              {["1,284.05", "942.10", "37,001.98"].map((n) => (
                <span key={n} className="text-body tabular">{n} kWh</span>
              ))}
            </div>
          </div>
        </div>

        <div id="typo-headings" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">Headings</span>
          <TypeList
            items={[
              { sample: <h1 className="text-4xl font-extrabold tracking-tight">Energy that adds up</h1>, note: "h1 · text-4xl font-extrabold" },
              { sample: <h2 className="text-3xl font-semibold tracking-tight">Peak demand at a glance</h2>, note: "h2 · text-3xl font-semibold" },
              { sample: <h3 className="text-2xl font-semibold tracking-tight">Site overview</h3>, note: "h3 · text-2xl font-semibold" },
              { sample: <h4 className="text-xl font-semibold tracking-tight">Meter details</h4>, note: "h4 · text-xl font-semibold" },
            ]}
          />
        </div>

        <div id="typo-prose" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">Prose</span>
          <TypeList
            items={[
              { sample: <p className="text-xl text-muted-foreground">Track consumption, cost, and emissions across every facility.</p>, note: "lead · text-xl" },
              { sample: <p className="leading-7">A demand charge is based on the highest 15-minute average load recorded during the billing period. Shaving that peak by even a few percent can meaningfully lower the bill.</p>, note: "p · leading-7" },
              { sample: <blockquote className="border-l-2 border-border pl-6 italic">&ldquo;You can&rsquo;t manage what you don&rsquo;t measure.&rdquo;</blockquote>, note: "blockquote" },
            ]}
          />
        </div>

        <div id="typo-text" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">Text styles</span>
          <TypeList
            items={[
              { sample: <p className="text-lg font-semibold">1.24 MW current load</p>, note: "large · text-lg font-semibold" },
              { sample: <p className="text-sm font-medium leading-none">Updated 2 minutes ago</p>, note: "small · text-sm font-medium" },
              { sample: <p className="text-sm text-muted-foreground">Averaged over 15-minute intervals.</p>, note: "muted · text-sm" },
              {
                sample: (
                  <p className="leading-7">
                    Set the threshold with{" "}
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      --demand-threshold
                    </code>
                    .
                  </p>
                ),
                note: "inline code",
              },
            ]}
          />
        </div>

        <div id="typo-examples" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Examples — styles composed into real UI (hover any line for its token)
          </span>
          <TooltipProvider>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2 rounded-lg border border-border p-6">
                <TokenHint token="text-caption text-muted-foreground">
                  <span className="w-fit text-caption text-muted-foreground">
                    Site report · July 2026
                  </span>
                </TokenHint>
                <TokenHint token="text-heading">
                  <h3 className="w-fit text-heading">Peak demand at a glance</h3>
                </TokenHint>
                <TokenHint token="text-body-lg text-muted-foreground">
                  <p className="text-body-lg text-muted-foreground">
                    Track consumption, cost, and emissions across every facility in
                    one view.
                  </p>
                </TokenHint>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border border-border p-6">
                <TokenHint token="text-caption text-muted-foreground">
                  <span className="w-fit text-caption text-muted-foreground">
                    Current load
                  </span>
                </TokenHint>
                <TokenHint token="text-display tabular">
                  <span className="w-fit text-display tabular">1.24 MW</span>
                </TokenHint>
                <TokenHint token="text-caption font-medium text-success-emphasis">
                  <span className="w-fit text-caption font-medium text-success-emphasis">
                    ↓ 12% vs. last peak
                  </span>
                </TokenHint>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border border-border p-6 sm:col-span-2">
                <TokenHint token="text-title">
                  <h4 className="w-fit text-title">Understanding demand charges</h4>
                </TokenHint>
                <TokenHint token="text-body leading-7">
                  <p className="text-body leading-7">
                    A demand charge is based on the highest 15-minute average load
                    recorded during the billing period. Shaving that peak by even a
                    few percent can meaningfully lower the bill.
                  </p>
                </TokenHint>
                <TokenHint token="text-caption text-muted-foreground">
                  <span className="w-fit text-caption text-muted-foreground">
                    Updated 2 minutes ago
                  </span>
                </TokenHint>
              </div>
            </div>
          </TooltipProvider>
        </div>
      </div>
    ),
  },
  {
    id: "logo",
    label: "Logo",
    group: "Foundations",
    description:
      "The Edgecom wordmark and glyph, with clear-space and color guidance.",
    install: "@edgecom/logo",
    toc: [
      { id: "logo-combination", name: "Combination lockup" },
      { id: "logo-mark", name: "Mark only" },
      { id: "logo-dark", name: "On dark surface" },
    ],
    node: (
      <div className="flex max-w-3xl flex-col gap-8">
        <p className="text-sm text-muted-foreground">
          The Edgecom brand mark. The colored (gradient) artwork is the default;
          it swaps to the flat-white version automatically in dark mode. Size it
          with <code className="font-mono">className</code> (e.g.{" "}
          <code className="font-mono">h-8 w-auto</code>) — never re-color or
          rebuild it by hand.
        </p>

        <div id="logo-combination" className="flex scroll-mt-24 flex-col gap-2">
          <span className="text-xs text-muted-foreground">
            Combination lockup · <code className="font-mono">variant=&quot;combination&quot;</code> (default)
          </span>
          <div className="flex flex-wrap items-center gap-8 rounded-lg border border-border p-8">
            <Logo className="h-10" />
            <Logo className="h-6" />
          </div>
        </div>

        <div id="logo-mark" className="flex scroll-mt-24 flex-col gap-2">
          <span className="text-xs text-muted-foreground">
            Mark only · <code className="font-mono">variant=&quot;mark&quot;</code>
          </span>
          <div className="flex flex-wrap items-center gap-8 rounded-lg border border-border p-8">
            <Logo variant="mark" className="h-14" />
            <Logo variant="mark" className="h-9" />
            <Logo variant="mark" className="h-6" />
          </div>
        </div>

        <div id="logo-dark" className="flex scroll-mt-24 flex-col gap-2">
          <span className="text-xs text-muted-foreground">
            On a dark surface (white variant) — always rendered here for reference
          </span>
          <div className="dark flex flex-wrap items-center gap-8 rounded-lg border border-border bg-background p-8">
            <Logo className="h-10" />
            <Logo variant="mark" className="h-14" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "icons",
    label: "Icons",
    group: "Foundations",
    description: "Lucide icons — sizing conventions and usage.",
    toc: [
      { id: "icons-sizes", name: "Sizes" },
      { id: "icons-usage", name: "Usage" },
      { id: "icons-install", name: "Installation" },
    ],
    node: (
      <div className="flex max-w-2xl flex-col gap-8">
        <p className="text-sm leading-6 text-muted-foreground">
          We use{" "}
          <a
            className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
            href="https://lucide.dev/icons/"
            target="_blank"
            rel="noreferrer"
          >
            Lucide
          </a>{" "}
          — an open-source set of 1,600+ icons drawn on a consistent 24×24 grid with a uniform
          stroke, so glyphs stay balanced at any size. Each icon is a React component; size it with a
          Tailwind <Code>size-*</Code> utility and it inherits the current text color via{" "}
          <Code>currentColor</Code>, so a semantic text token colors the icon too.
        </p>

        <div id="icons-sizes" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Sizes — Tailwind <Code>size-*</Code> utilities (rem-based, so they scale with the root
            font size)
          </span>
          <div className="flex flex-wrap items-end gap-8 rounded-lg border border-border p-6">
            {[
              { cls: "size-3", px: "12px", use: "dense / inline" },
              { cls: "size-3.5", px: "14px", use: "small buttons" },
              { cls: "size-4", px: "16px", use: "default" },
              { cls: "size-5", px: "20px", use: "large buttons" },
              { cls: "size-6", px: "24px", use: "feature / empty state" },
            ].map((s) => (
              <div key={s.cls} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-6 items-center">
                  <Gauge className={cn(s.cls, "text-foreground")} />
                </div>
                <span className="text-caption font-medium text-foreground">{s.cls}</span>
                <span className="text-caption text-muted-foreground">
                  {s.px} · {s.use}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            <Code>size-4</Code> (16px) is the default — it&rsquo;s what buttons, menu items, and
            inputs apply automatically.
          </p>
        </div>

        <div id="icons-usage" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">Usage</span>
          <Snippet>{`import { Gauge, Zap } from "lucide-react"

// Size with a Tailwind size-* utility; color follows the text token.
<Gauge className="size-4 text-muted-foreground" />
<Zap className="size-5 text-warning" />`}</Snippet>
        </div>

        <div id="icons-install" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">Installation</span>
          <p className="text-sm leading-6 text-muted-foreground">
            <Code>lucide-react</Code> is a runtime dependency, not part of the CSS theme. You
            don&rsquo;t add it by hand — the shadcn CLI installs it automatically whenever you add an
            Edgecom component that uses an icon (<Code>components.json</Code> sets{" "}
            <Code>iconLibrary: &quot;lucide&quot;</Code>). To use icons on their own, add it directly:
          </p>
          <Snippet>{`pnpm add lucide-react`}</Snippet>
        </div>
      </div>
    ),
  },
  {
    id: "button",
    label: "Button",
    group: "Components",
    description:
      "Trigger actions with a range of variants, sizes, and icon layouts.",
    install: "@edgecom/button",
    variants: [
      {
        id: "button-variants",
        name: "Variants",
        description: "The full set of visual styles: neutral variants, then each semantic in a solid fill and a subtle tint.",
        preview: <ButtonVariantsDemo />,
        source: dm("button-variants-demo"),
      },
      {
        id: "button-sizes",
        name: "Sizes",
        description: "Small, default, and large heights, plus the disabled state.",
        preview: <ButtonSizesDemo />,
        source: dm("button-sizes-demo"),
      },
      {
        id: "button-with-icons",
        name: "With icons",
        description: "Leading or trailing icons paired with a text label.",
        preview: <ButtonIconsDemo />,
        source: dm("button-icons-demo"),
      },
      {
        id: "button-icon-only",
        name: "Icon buttons",
        description: "Square icon-only buttons across sizes, with accessible labels.",
        preview: <ButtonIconButtonsDemo />,
        source: dm("button-icon-buttons-demo"),
      },
      {
        id: "button-loading",
        name: "Loading",
        description: "A spinner and disabled state while an action is in flight.",
        preview: <ButtonLoadingDemo />,
        source: dm("button-loading-demo"),
      },
      {
        id: "button-ghost-animated",
        name: "Ghost with animated icon",
        description: "A subtle ghost button whose icon animates on hover.",
        preview: <ButtonGhostDemo />,
        source: ss("button/button-16"),
      },
      {
        id: "button-promise",
        name: "Async / promise state",
        description: "Tracks a promise through loading, success, and error states.",
        preview: <ButtonPromiseDemo />,
        source: ss("button/button-26"),
      },
      {
        id: "button-copy",
        name: "Copy to clipboard",
        description: "Copies text and swaps to a checkmark to confirm.",
        preview: <ButtonCopyStateDemo />,
        source: ss("button/button-28"),
      },
    ],
  },
  {
    id: "input",
    label: "Input",
    group: "Components",
    description:
      "Single-line text fields with labels, icons, add-ons, and validation states.",
    install: "@edgecom/input",
    variants: [
      { id: "input-default", name: "Default", description: "A bare text field with placeholder text.", preview: <InputDemo />, source: ss("input/input-01") },
      { id: "input-label", name: "With label", description: "An input paired with an associated label.", preview: <InputLabelDemo />, source: ss("input/input-02") },
      { id: "input-required", name: "Required", description: "Marks the field as required for the user.", preview: <InputRequiredDemo />, source: ss("input/input-03") },
      { id: "input-disabled", name: "Disabled", description: "A non-interactive, dimmed field.", preview: <InputDisabledDemo />, source: ss("input/input-04") },
      { id: "input-default-value", name: "Default value", description: "Pre-populated with an initial value.", preview: <InputDefaultValueDemo />, source: ss("input/input-07") },
      { id: "input-helper-text", name: "Helper text", description: "Supporting text below the field for guidance.", preview: <InputStartHelperTextDemo />, source: ss("input/input-09") },
      { id: "input-error", name: "Error state", description: "Invalid styling with an inline error message.", preview: <InputErrorDemo />, source: ss("input/input-12") },
      { id: "input-start-icon", name: "Start icon", description: "A leading icon rendered inside the field.", preview: <InputStartIconDemo />, source: ss("input/input-14") },
      { id: "input-start-addon", name: "Start add-on", description: "A fixed prefix segment joined to the input.", preview: <InputStartAddOnDemo />, source: ss("input/input-19") },
      { id: "input-end-addon", name: "End add-on", description: "A fixed suffix segment joined to the input.", preview: <InputEndAddOnDemo />, source: ss("input/input-20") },
      { id: "input-inline-addons", name: "Inline add-ons", description: "Prefix and suffix add-ons on the same field.", preview: <InputAddOnsDemo />, source: ss("input/input-21") },
      { id: "input-password", name: "Password with toggle", description: "A password field with a show/hide toggle.", preview: <InputPasswordDemo />, source: ss("input/input-26") },
      { id: "input-file", name: "File input", description: "A styled file-selection control.", preview: <InputFileDemo />, source: ss("input/input-27") },
      { id: "input-clearable", name: "Clearable", description: "A clear button appears once text is entered.", preview: <InputClearDemo />, source: ss("input/input-36") },
      { id: "input-search-loader", name: "Search with loader", description: "A search field showing a loading spinner.", preview: <InputSearchLoaderDemo />, source: ss("input/input-39") },
      { id: "input-stepper", name: "Stepper (plus / minus)", description: "A numeric input with increment and decrement buttons.", preview: <InputWithPlusMinusButtonsDemo />, source: ss("input/input-40") },
      { id: "input-otp", name: "OTP", description: "A segmented one-time-passcode entry field.", preview: <InputOTPNumberDemo />, source: ss("input-otp/input-otp-01") },
      { id: "input-phone", name: "Phone number", description: "A phone field with a country-code selector.", preview: <PhoneInputWithLabel />, source: ss("phone-input/phone-input-02") },
    ],
  },
  {
    id: "list",
    label: "List",
    group: "Components",
    description: "Structured lists for content, settings, and navigation.",
    install: "@edgecom/list",
    variants: [
      {
        id: "list-styled",
        name: "Styled lists (decimal · disc · none)",
        description: "Ordered, unordered, and unstyled list treatments.",
        preview: <ListDemo />,
        source: ss("list/list-01"),
      },
      {
        id: "list-notifications",
        name: "Notification items with switches",
        description: "Setting rows with an inline switch on each item.",
        preview: <ListNotifications />,
        source: ss("list/list-02"),
      },
      {
        id: "list-key-value",
        name: "Key / value rows with separators",
        description: "Label-and-value pairs divided by separators.",
        preview: <ItemsList />,
        source: ss("list/list-03"),
      },
      {
        id: "list-navigation",
        name: "Navigation item group (links)",
        description: "A grouped set of navigation links.",
        preview: <ListUsers />,
        source: ss("list/list-06"),
      },
    ],
  },
  {
    id: "card",
    label: "Card",
    group: "Components",
    description:
      "A flexible container with header, content, and footer regions.",
    install: "@edgecom/card",
    variants: [
      {
        id: "card-default",
        name: "Header, content, and footer actions",
        description: "A complete card with title, body, and footer buttons.",
        preview: <CardDemo />,
        source: dm("card-demo"),
      },
      {
        id: "card-bottom-image",
        name: "Bottom image",
        description: "A site card with a banner image below the header.",
        preview: <CardBottomImageDemo />,
        source: ss("card/card-04"),
      },
      {
        id: "card-top-image",
        name: "Top image with actions",
        description: "A report card led by a banner image, with footer actions.",
        preview: <CardTopImageDemo />,
        source: ss("card/card-05"),
      },
      {
        id: "card-horizontal",
        name: "Horizontal",
        description: "A side-by-side layout pairing an image with content and a call to action.",
        preview: <CardHorizontalDemo />,
        source: ss("card/card-06"),
      },
      {
        id: "card-tabs",
        name: "With tabs",
        description: "A card whose content is organized into inline tabs.",
        preview: <CardWithTabsDemo />,
        source: ss("card/card-10"),
      },
    ],
  },
  {
    id: "badge",
    label: "Badge & status tags",
    group: "Components",
    description:
      "Compact labels for statuses, counts, and commodity tags.",
    install: "@edgecom/badge",
    variants: [
      {
        id: "badge-variants",
        name: "Variants",
        description: "Semantic tones for state and severity.",
        preview: <BadgeVariantsDemo />,
        source: dm("badge-variants"),
      },
      {
        id: "badge-commodities",
        name: "Commodities",
        description: "Per-commodity color coding used across dashboards.",
        preview: <BadgeCommoditiesDemo />,
        source: dm("badge-commodities"),
      },
      {
        id: "badge-dot",
        name: "Dot badge",
        description: "Minimal badge with a leading status dot.",
        preview: <BadgeDotDemo />,
        source: ss("badge/badge-05"),
      },
      {
        id: "badge-in-progress",
        name: "Status tag — in progress",
        description: "A tag indicating work that is underway.",
        preview: <BadgeInProgressDemo />,
        source: ss("badge/badge-16"),
      },
      {
        id: "badge-blocked",
        name: "Status tag — blocked",
        description: "A tag flagging an item that is blocked.",
        preview: <BadgeBlockedDemo />,
        source: ss("badge/badge-17"),
      },
      {
        id: "badge-completed",
        name: "Status tag — completed",
        description: "A tag confirming finished work.",
        preview: <BadgeCompletedDemo />,
        source: ss("badge/badge-18"),
      },
      {
        id: "badge-dismissible",
        name: "Dismissible",
        description: "A badge with a close button to remove it.",
        preview: <ClosableBadgeDemo />,
        source: ss("badge/badge-12"),
      },
    ],
  },
  {
    id: "alert",
    label: "Alert",
    group: "Components",
    description:
      "Inline messages that communicate status, warnings, and errors.",
    install: "@edgecom/alert",
    variants: [
      {
        id: "alert-status-variants",
        name: "Status variants",
        description: "Default, success, warning, and destructive tones.",
        preview: (
          <div className="grid w-full max-w-md gap-3">
            <Alert>
              <Info />
              <AlertTitle>Scheduled maintenance</AlertTitle>
              <AlertDescription>Data sync pauses tonight from 1–2 AM ET.</AlertDescription>
            </Alert>
            <Alert variant="success">
              <CheckCircle2 />
              <AlertTitle>Bill reconciled</AlertTitle>
              <AlertDescription>All 42 meters matched the utility statement.</AlertDescription>
            </Alert>
            <Alert variant="warning">
              <AlertTriangle />
              <AlertTitle>Approaching peak</AlertTitle>
              <AlertDescription>Facility is within 5% of its demand threshold.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <XCircle />
              <AlertTitle>Connection lost</AlertTitle>
              <AlertDescription>Meter M-118 stopped reporting 20 minutes ago.</AlertDescription>
            </Alert>
          </div>
        ),
      },
      {
        id: "alert-dismissible",
        name: "Dismissible",
        description: "An alert the user can close.",
        preview: (
          <div className="w-full max-w-md">
            <AlertClosableDemo />
          </div>
        ),
        source: ss("alert/alert-03"),
      },
      {
        id: "alert-with-action",
        name: "With action",
        description: "An alert with an inline action button.",
        preview: (
          <div className="w-full max-w-md">
            <AlertWithActionDemo />
          </div>
        ),
        source: ss("alert/alert-13"),
      },
      {
        id: "alert-file-upload",
        name: "File upload with progress",
        description: "An alert showing upload progress.",
        preview: (
          <div className="w-full max-w-md">
            <AlertFileUploadDemo />
          </div>
        ),
        source: ss("alert/alert-07"),
      },
      {
        id: "alert-soft-success",
        name: "Soft success",
        description: "A low-contrast success alert with a tinted background.",
        preview: (
          <div className="w-full max-w-md">
            <AlertSoftSuccessDemo />
          </div>
        ),
        source: ss("alert/alert-23"),
      },
      {
        id: "alert-soft-warning",
        name: "Soft warning",
        description: "A low-contrast warning alert with a tinted background.",
        preview: (
          <div className="w-full max-w-md">
            <AlertSoftWarningDemo />
          </div>
        ),
        source: ss("alert/alert-24"),
      },
      {
        id: "alert-soft-info",
        name: "Soft info",
        description: "A low-contrast informational alert with a tinted background.",
        preview: (
          <div className="w-full max-w-md">
            <AlertSoftInfoDemo />
          </div>
        ),
        source: ss("alert/alert-22"),
      },
      {
        id: "alert-soft-destructive",
        name: "Soft destructive",
        description: "A low-contrast error alert with a tinted background.",
        preview: (
          <div className="w-full max-w-md">
            <AlertSoftDestructiveDemo />
          </div>
        ),
        source: ss("alert/alert-25"),
      },
    ],
  },
  {
    id: "dialog",
    label: "Dialog",
    group: "Components",
    description:
      "Modal dialogs for confirmations, forms, and focused tasks.",
    install: "@edgecom/dialog",
    variants: [
      {
        id: "alert-dialog",
        name: "Alert dialog",
        description: "A confirmation dialog requiring an explicit choice.",
        preview: <AlertDialogDemo />,
        source: ss("dialog/dialog-01"),
      },
      {
        id: "alert-dialog-with-icon",
        name: "Alert dialog with icon",
        description: "A confirmation dialog with a leading status icon.",
        preview: <AlertDialogWithIconDemo />,
        source: ss("dialog/dialog-02"),
      },
      {
        id: "alert-dialog-destructive",
        name: "Destructive alert dialog",
        description: "A confirmation dialog for irreversible actions.",
        preview: <AlertDialogDestructiveDemo />,
        source: ss("dialog/dialog-03"),
      },
      {
        id: "dialog-sticky-footer",
        name: "Dialog with sticky footer",
        description: "A scrollable dialog whose footer actions stay pinned.",
        preview: <DialogStickyFooterDemo />,
        source: ss("dialog/dialog-06"),
      },
      {
        id: "dialog-terms",
        name: "Terms and conditions",
        description: "A dialog presenting scrollable legal copy to accept.",
        preview: <DialogTermsAndConditionDemo />,
        source: ss("dialog/dialog-08"),
      },
      {
        id: "dialog-otp",
        name: "OTP verification",
        description: "A dialog for entering a one-time verification code.",
        preview: <DialogOTPVerificationDemo />,
        source: ss("dialog/dialog-12"),
      },
    ],
  },
  {
    id: "dropdown-menu",
    label: "Dropdown menu",
    group: "Components",
    description:
      "Menus of actions and options triggered from a button.",
    install: "@edgecom/dropdown-menu",
    variants: [
      {
        id: "dropdown-default",
        name: "Default",
        description: "A basic menu of actions with a separator.",
        preview: <DropdownMenuDemo />,
        source: ss("dropdown-menu/dropdown-menu-01"),
      },
      {
        id: "dropdown-item-action",
        name: "Menu item with action",
        description: "Items with keyboard shortcuts and destructive styling.",
        preview: <DropdownMenuItemActionDemo />,
        source: ss("dropdown-menu/dropdown-menu-04"),
      },
      {
        id: "dropdown-checkbox",
        name: "Checkbox items",
        description: "Toggleable menu items that persist their checked state.",
        preview: <DropdownMenuCheckboxDemo />,
        source: ss("dropdown-menu/dropdown-menu-13"),
      },
      {
        id: "dropdown-user-menu",
        name: "User menu",
        description: "An account menu with grouped actions.",
        preview: <DropdownMenuUserMenuDemo />,
        source: ss("dropdown-menu/dropdown-menu-07"),
      },
      {
        id: "dropdown-user-profile",
        name: "User profile",
        description: "An account menu headed by the user's profile details.",
        preview: <DropdownMenuUserProfileDemo />,
        source: ss("dropdown-menu/dropdown-menu-08"),
      },
    ],
  },
  {
    id: "context-menu",
    label: "Context menu",
    group: "Components",
    description:
      "A menu of actions revealed by right-clicking (or long-pressing) a target region.",
    install: "@edgecom/context-menu",
    variants: [
      {
        id: "context-menu-default",
        name: "Default",
        description:
          "Actions, a submenu, a checkbox toggle, a radio group, and a destructive item.",
        preview: <ContextMenuDemo />,
        source: dm("context-menu-demo"),
      },
      {
        id: "context-menu-basic",
        name: "Basic options",
        description: "A minimal menu of grouped actions.",
        preview: <ContextMenuBasicDemo />,
        source: ss("context-menu/context-menu-01"),
      },
      {
        id: "context-menu-submenu",
        name: "With submenu",
        description: "A menu that nests further actions in a submenu.",
        preview: <ContextMenuSubmenuDemo />,
        source: ss("context-menu/context-menu-02"),
      },
    ],
  },
  {
    id: "navigation-menu",
    label: "Navigation menu",
    group: "Components",
    description:
      "Horizontal top-level navigation with dropdown panels for links, features, and calls to action.",
    install: "@edgecom/navigation-menu",
    variants: [
      {
        id: "navigation-menu-default",
        name: "Default",
        description:
          "A single-column dropdown with titles and supporting descriptions.",
        preview: <NavigationMenuDemo />,
        source: ss("navigation-menu/navigation-menu-01"),
      },
      {
        id: "navigation-menu-features",
        name: "With icons and badges",
        description:
          "Links enriched with icons and status badges for extra context.",
        preview: <NavigationMenuFeatureDemo />,
        source: ss("navigation-menu/navigation-menu-03"),
      },
      {
        id: "navigation-menu-sections",
        name: "Grouped sections",
        description:
          "Items organized into logical sections with icons and descriptions.",
        preview: <NavigationMenuExploreDemo />,
        source: ss("navigation-menu/navigation-menu-04"),
      },
      {
        id: "navigation-menu-cta",
        name: "With call to action",
        description:
          "A tool list paired with a dedicated call-to-action area.",
        preview: <NavigationMenuDesignDemo />,
        source: ss("navigation-menu/navigation-menu-05"),
      },
    ],
  },
  {
    id: "resizable",
    label: "Resizable",
    group: "Components",
    description:
      "Draggable panel groups for building split views and master–detail layouts.",
    install: "@edgecom/resizable",
    variants: [
      {
        id: "resizable-horizontal",
        name: "Horizontal panels",
        description: "A list pane and a detail pane split by a draggable handle.",
        preview: <ResizableDemo />,
        source: dm("resizable-demo"),
      },
      {
        id: "resizable-vertical",
        name: "Vertical panels",
        description: "Stacked panels resized along the vertical axis.",
        preview: <ResizableVerticalDemo />,
        source: dm("resizable-vertical-demo"),
      },
    ],
  },
  {
    id: "empty",
    label: "Empty state",
    group: "Components",
    description:
      "A composable zero-state layout for empty lists, no-results searches, and first-run screens.",
    install: "@edgecom/empty",
    variants: [
      {
        id: "empty-default",
        name: "With action",
        description: "Icon, title, description, and a primary call to action.",
        preview: <EmptyDemo />,
        source: dm("empty-demo"),
      },
      {
        id: "empty-search",
        name: "No search results",
        description: "The zero-results state for a filtered or searched list.",
        preview: <EmptySearchDemo />,
        source: dm("empty-search-demo"),
      },
      {
        id: "empty-in-table",
        name: "In a data table",
        description:
          "Composed inside a table frame as its zero-state — the recommended pattern for data components.",
        preview: <EmptyTableDemo />,
        source: dm("empty-table-demo"),
      },
    ],
  },
  {
    id: "drawer",
    label: "Drawer",
    group: "Components",
    description: "Panels that slide in from any edge of the screen.",
    install: "@edgecom/drawer",
    variants: [
      {
        id: "drawer-sides",
        name: "Swipe direction (top · right · bottom · left)",
        description: "A drawer that can open from any of the four edges.",
        preview: <DrawerWithSides />,
        source: ss("drawer/drawer-04"),
      },
    ],
  },
  {
    id: "breadcrumb",
    label: "Breadcrumb",
    group: "Components",
    description: "Shows the user's location within a nested hierarchy.",
    install: "@edgecom/breadcrumb",
    variants: [
      {
        id: "breadcrumb-dropdown",
        name: "With dropdown",
        description: "A breadcrumb that collapses middle levels into a menu.",
        preview: <BreadcrumbWithDropdownDemo />,
        source: ss("breadcrumb/breadcrumb-06"),
      },
    ],
  },
  {
    id: "label-textarea",
    label: "Label & textarea",
    group: "Components",
    description: "Multi-line text input paired with accessible labels.",
    install: "@edgecom/label @edgecom/textarea",
    variants: [
      {
        id: "textarea-note",
        name: "Label + textarea",
        description: "A labelled multi-line text area.",
        preview: <TextareaNoteDemo />,
        source: dm("textarea-note-demo"),
      },
      {
        id: "textarea-required",
        name: "Required",
        description: "A text area marked as required.",
        preview: <TextareaRequiredDemo />,
        source: ss("textarea/textarea-07"),
      },
      {
        id: "textarea-invalid",
        name: "Invalid",
        description: "A text area in an error state with a message.",
        preview: <TextareaInvalidDemo />,
        source: ss("textarea/textarea-05"),
      },
      {
        id: "textarea-with-button",
        name: "With button",
        description: "A text area with an inline submit button.",
        preview: <TextareaWithButtonDemo />,
        source: ss("textarea/textarea-16"),
      },
    ],
  },
  {
    id: "spinner",
    label: "Spinner",
    group: "Components",
    description: "Indeterminate loading indicators for in-progress work.",
    install: "@edgecom/spinner",
    variants: [
      {
        id: "spinner-sizes",
        name: "Sizes and inline usage",
        description: "Spinner sizes and inline-with-text placement.",
        preview: <SpinnerDemo />,
        source: dm("spinner-demo"),
      },
    ],
  },
  {
    id: "skeleton",
    label: "Skeleton",
    group: "Components",
    description: "Placeholder shapes that stand in for content while it loads.",
    install: "@edgecom/skeleton",
    variants: [
      {
        id: "skeleton-avatar",
        name: "Avatar with lines",
        description: "A circular avatar placeholder beside text lines.",
        preview: <SkeletonAvatarDemo />,
        source: dm("skeleton-avatar-demo"),
      },
      {
        id: "skeleton-text",
        name: "Text blocks",
        description: "Stacked lines standing in for a paragraph.",
        preview: <SkeletonText />,
        source: ss("skeleton/skeleton-02"),
      },
      {
        id: "skeleton-form",
        name: "Form",
        description: "Placeholder fields mirroring a form layout.",
        preview: <SkeletonForm />,
        source: ss("skeleton/skeleton-04"),
      },
      {
        id: "skeleton-accordion",
        name: "Accordion",
        description: "Placeholder rows mirroring collapsed accordion items.",
        preview: (
          <div className="w-full max-w-md">
            <SkeletonAccordion />
          </div>
        ),
        source: ss("skeleton/skeleton-07"),
      },
      {
        id: "skeleton-table",
        name: "Table",
        description: "Placeholder rows and columns mirroring a table.",
        preview: <SkeletonTable />,
        source: ss("skeleton/skeleton-11"),
      },
      {
        id: "skeleton-widgets",
        name: "Widget cards",
        description: "Placeholder dashboard widget cards.",
        preview: <SkeletonWidgetsCards />,
        source: ss("skeleton/skeleton-12"),
      },
    ],
  },
  {
    id: "switch",
    label: "Switch",
    group: "Components",
    description: "Toggle a single setting on or off.",
    install: "@edgecom/switch",
    variants: [
      {
        id: "switch-basic",
        name: "Labels and disabled",
        description: "Switches with labels, including a disabled example.",
        preview: <SwitchBasicDemo />,
        source: dm("switch-basic-demo"),
      },
      {
        id: "switch-card",
        name: "Card",
        description: "A switch presented inside a selectable card.",
        preview: <SwitchCardDemo />,
        source: ss("switch/switch-16"),
      },
      {
        id: "switch-list-group",
        name: "List group",
        description: "A grouped list of settings, each with a switch.",
        preview: <SwitchListGroupDemo />,
        source: ss("switch/switch-18"),
      },
    ],
  },
  {
    id: "toggle",
    label: "Toggle",
    group: "Components",
    description: "Buttons that hold a pressed state, individually or as a group.",
    install: "@edgecom/toggle @edgecom/toggle-group",
    variants: [
      {
        id: "toggle-formatting",
        name: "Formatting toolbar",
        description: "Text-formatting toggles for bold, italic, and alignment.",
        preview: <ToggleFormattingDemo />,
        source: dm("toggle-formatting-demo"),
      },
      {
        id: "toggle-filled-icon",
        name: "Filled icon",
        description: "An icon toggle that fills when pressed.",
        preview: <ToggleFilledIcon />,
        source: ss("toggle/toggle-05"),
      },
      {
        id: "toggle-icon-pattern",
        name: "Icon pattern",
        description: "A recommended icon-plus-label toggle pattern.",
        preview: <ToggleIconPattern />,
        source: ss("toggle/toggle-07"),
      },
      {
        id: "toggle-group-sizes",
        name: "Group sizes",
        description: "A toggle group shown across the size scale.",
        preview: <ToggleGroupSizes />,
        source: ss("toggle-group/toggle-group-03"),
      },
      {
        id: "toggle-group-layout",
        name: "Group layout",
        description: "Horizontal and vertical toggle group arrangements.",
        preview: <ToggleGroupLayout />,
        source: ss("toggle-group/toggle-group-08"),
      },
      {
        id: "toggle-group-tooltip",
        name: "Group with tooltips",
        description: "A toggle group where each option has a tooltip.",
        preview: (
          <TooltipProvider>
            <ToggleGroupTooltip />
          </TooltipProvider>
        ),
        source: ss("toggle-group/toggle-group-09"),
      },
    ],
  },
  {
    id: "slider",
    label: "Slider",
    group: "Components",
    description: "Select a numeric value or range by dragging along a track.",
    install: "@edgecom/slider",
    variants: [
      {
        id: "slider-default",
        name: "Default",
        description: "A single-value slider with a label.",
        preview: <SliderBasicDemo />,
        source: dm("slider-basic-demo"),
      },
      {
        id: "slider-ticks",
        name: "Performance mode with ticks",
        description: "A stepped slider with tick marks and labels.",
        preview: <SliderWithTicksDemo />,
        source: ss("slider/slider-09"),
      },
      {
        id: "slider-range",
        name: "Range and multi-thumb",
        description: "Multiple thumbs for selecting consumption bands and alert thresholds.",
        preview: <SliderMultiThumbDemo />,
        source: ss("slider/slider-02"),
      },
      {
        id: "slider-tooltip",
        name: "With value tooltips",
        description: "Thumbs surface their current value in a tooltip while dragging.",
        preview: <SliderMultiTooltipDemo />,
        source: ss("slider/slider-12"),
      },
    ],
  },
  {
    id: "sortable",
    label: "Sortable",
    group: "Components",
    description: "Drag-and-drop lists and boards for reordering items.",
    install: "@edgecom/sortable",
    variants: [
      {
        id: "sortable-handles",
        name: "List with handles",
        description: "A reorderable list dragged by explicit handles.",
        preview: (
          <div className="w-full max-w-md">
            <SortableDemo />
          </div>
        ),
        source: ss("sortable/sortable-01"),
      },
      {
        id: "sortable-groups",
        name: "Nested groups",
        description: "Reorderable items organized into nested groups.",
        preview: <SortableGroupDemo />,
        source: ss("sortable/sortable-03"),
      },
      {
        id: "sortable-notification-priority",
        name: "Notification priority",
        description: "Drag notification channels to set their priority order.",
        preview: <SortableNotificationChannels />,
        source: ss("sortable/sortable-04"),
      },
      {
        id: "sortable-task-columns",
        name: "Task columns (drag between)",
        description: "A kanban board where tasks drag between columns.",
        preview: <SortableTaskColumnsDemo />,
        source: ss("sortable/sortable-05"),
      },
    ],
  },
  {
    id: "stepper",
    label: "Stepper",
    group: "Components",
    description: "Guide users through a sequence of steps in a process.",
    install: "@edgecom/stepper",
    variants: [
      {
        id: "stepper-inline-descriptions",
        name: "Inline descriptions (responsive)",
        description: "A stepper with per-step descriptions that adapt to width.",
        preview: <StepperInlineDescriptionDemo />,
        source: ss("stepper/stepper-05"),
      },
      {
        id: "stepper-horizontal-submit",
        name: "Horizontal with panel + submit",
        description: "A horizontal stepper with content panels and a submit step.",
        preview: <StepperHorizontalSubmitDemo />,
        source: ss("stepper/stepper-08"),
      },
      {
        id: "stepper-vertical",
        name: "Vertical with panel",
        description: "A vertical stepper with content beneath each step.",
        preview: <StepperVerticalDemo />,
        source: ss("stepper/stepper-09"),
      },
    ],
  },
  {
    id: "progress",
    label: "Progress",
    group: "Components",
    description: "Communicate the completion of a task or a determinate value.",
    install: "@edgecom/progress",
    variants: [
      {
        id: "progress-linear",
        name: "Linear",
        description: "A horizontal determinate progress bar.",
        preview: <ProgressLinearDemo />,
        source: dm("progress-linear-demo"),
      },
      {
        id: "progress-shapes",
        name: "Shapes",
        description: "Progress rendered in alternative bar shapes.",
        preview: (
          <div className="sm:max-w-sm">
            <ProgressShapeDemo />
          </div>
        ),
        source: ss("progress/progress-04"),
      },
      {
        id: "progress-checklist",
        name: "Checklist (interactive)",
        description: "Progress that advances as checklist items complete.",
        preview: (
          <div className="sm:max-w-sm">
            <ProgressChecklistDemo />
          </div>
        ),
        source: ss("progress/progress-14"),
      },
      {
        id: "progress-circular",
        name: "Circular (interactive)",
        description: "A circular progress ring with adjustable value.",
        preview: <CircularProgressDemo />,
        source: ss("progress/progress-23"),
      },
    ],
  },
  {
    id: "avatar",
    label: "Avatar",
    group: "Components",
    description: "A user or contact image with a text fallback and grouping.",
    install: "@edgecom/avatar",
    variants: [
      {
        id: "avatar-default",
        name: "Image and fallback",
        description: "A photo with an initials fallback, beside a fallback-only avatar.",
        preview: <AvatarBasicDemo />,
        source: dm("avatar-demo"),
      },
      {
        id: "avatar-group",
        name: "Group with overflow",
        description: "Overlapping avatars with a trailing overflow count.",
        preview: <AvatarGroupDemo />,
        source: dm("avatar-demo"),
      },
    ],
  },
  {
    id: "field",
    label: "Field",
    group: "Components",
    description: "Label, description, and error scaffolding for form controls.",
    install: "@edgecom/field",
    variants: [
      {
        id: "field-default",
        name: "Labelled fields",
        description: "Fields with labels, helper text, and an error state.",
        preview: <FieldDemo />,
        source: dm("field-demo"),
      },
    ],
  },
  {
    id: "input-group",
    label: "Input group",
    group: "Components",
    description: "Attach icons, text, or buttons to an input.",
    install: "@edgecom/input-group",
    variants: [
      {
        id: "input-group-default",
        name: "Add-ons",
        description: "A leading icon, a trailing unit, and a trailing action button.",
        preview: <InputGroupDemo />,
        source: dm("input-group-demo"),
      },
    ],
  },
  {
    id: "scroll-area",
    label: "Scroll area",
    group: "Components",
    description: "A scrollable region with a styled scrollbar.",
    install: "@edgecom/scroll-area",
    variants: [
      {
        id: "scroll-area-default",
        name: "Vertical scroll",
        description: "A fixed-height list that scrolls within its bounds.",
        preview: <ScrollAreaDemo />,
        source: dm("scroll-area-demo"),
      },
    ],
  },
  {
    id: "separator",
    label: "Separator",
    group: "Components",
    description: "A thin divider for separating content, horizontally or vertically.",
    install: "@edgecom/separator",
    variants: [
      {
        id: "separator-default",
        name: "Default",
        description: "A horizontal rule between blocks, plus vertical rules in a row.",
        preview: <SeparatorDemo />,
        source: dm("separator-demo"),
      },
    ],
  },
  {
    id: "sheet",
    label: "Sheet",
    group: "Components",
    description: "A dialog panel that slides in from an edge of the screen.",
    install: "@edgecom/sheet",
    variants: [
      {
        id: "sheet-default",
        name: "Side panel",
        description: "A right-side sheet with a header, form fields, and footer actions.",
        preview: <SheetDemo />,
        source: dm("sheet-demo"),
      },
    ],
  },
  {
    id: "select",
    label: "Select",
    group: "Components",
    description: "Choose one or more options from a dropdown list.",
    install: "@edgecom/select",
    variants: [
      {
        id: "select-grouped-sites",
        name: "Grouped sites",
        description: "A styled select with options organized into groups.",
        preview: <SelectSitesDemo />,
        source: dm("select-sites-demo"),
      },
      {
        id: "select-native",
        name: "Native select",
        description: "The browser's native select element, styled to match.",
        preview: <NativeSelectDemo />,
        source: ss("select/select-01"),
      },
      {
        id: "select-native-placeholder",
        name: "Native with placeholder",
        description: "A native select with a non-selectable placeholder.",
        preview: <NativeSelectPlaceholderDemo />,
        source: ss("select/select-02"),
      },
      {
        id: "select-native-required",
        name: "Native required",
        description: "A native select marked as required.",
        preview: <NativeSelectRequiredDemo />,
        source: ss("select/select-06"),
      },
      {
        id: "select-option-groups",
        name: "Option groups",
        description: "A custom select with labelled option groups.",
        preview: <SelectWithOptionsGroupsDemo />,
        source: ss("select/select-22"),
      },
      {
        id: "select-multiple",
        name: "Multiple with placeholder",
        description: "A multi-select that accepts several values at once.",
        preview: <MultipleSelectWithPlaceholderDemo />,
        source: ss("select/select-33"),
      },
    ],
  },
  {
    id: "banner",
    label: "Banner",
    group: "Components",
    description: "A full-width announcement bar for promotions, events, and product news.",
    install: "@edgecom/banner",
    variants: [
      {
        id: "banner-simple",
        name: "Simple centered",
        description: "A centered announcement with an inline link.",
        preview: <BannerDemo />,
        source: dm("banner-demo"),
      },
      {
        id: "banner-action",
        name: "With action",
        description: "A promotional banner with a call-to-action button.",
        preview: <BannerActionDemo />,
        source: dm("banner-action-demo"),
      },
      {
        id: "banner-floating",
        name: "Floating",
        description: "A pill-shaped banner pinned to the bottom of the viewport.",
        preview: <BannerFloatingDemo />,
        source: dm("banner-floating-demo"),
      },
    ],
  },
  {
    id: "accordion",
    label: "Accordion",
    group: "Components",
    description: "Collapsible sections that expand to reveal their content.",
    install: "@edgecom/accordion",
    variants: [
      {
        id: "accordion-default",
        name: "Default",
        description: "Single-open collapsible panels.",
        preview: (
          <div className="w-full max-w-md">
            <AccordionDemo />
          </div>
        ),
        source: ss("accordion/accordion-01"),
      },
      {
        id: "accordion-outline",
        name: "Outline",
        description: "Separated panels, each in its own bordered card.",
        preview: (
          <div className="w-full max-w-md">
            <AccordionOutlineDemo />
          </div>
        ),
        source: ss("accordion/accordion-09"),
      },
      {
        id: "accordion-multilevel",
        name: "Multi-level",
        description: "Category panels that expand to reveal nested, individually collapsible FAQ items.",
        preview: (
          <div className="w-full max-w-md">
            <AccordionMultilevelIconDemo />
          </div>
        ),
        source: ss("accordion/accordion-16"),
      },
    ],
  },
  {
    id: "collapsible",
    label: "Collapsible",
    group: "Components",
    description: "A single region that toggles between shown and hidden.",
    install: "@edgecom/collapsible",
    variants: [
      {
        id: "collapsible-tree",
        name: "Site & meter tree",
        description: "Nested collapsible rows for browsing a site, building, and meter hierarchy.",
        preview: <CollapsibleTreeDemo />,
        source: ss("collapsible/collapsible-02"),
      },
      {
        id: "collapsible-card",
        name: "Card with expandable answer",
        description: "A card whose body expands to reveal a longer answer and image.",
        preview: (
          <div className="w-full max-w-md">
            <CollapsibleCardDemo />
          </div>
        ),
        source: ss("collapsible/collapsible-07"),
      },
    ],
  },
  {
    id: "calendar",
    label: "Calendar",
    group: "Components",
    description: "Date selection for scheduling, pricing, and pickers.",
    install: "@edgecom/calendar",
    variants: [
      {
        id: "calendar-multi-month",
        name: "Multi-month range",
        description: "A two-month range calendar for selecting a start and end date.",
        preview: (
          <div className="w-fit max-w-full">
            <CalendarRangeCalendarMultiMonthDemo />
          </div>
        ),
        source: ss("calendar/calendar-04"),
      },
      {
        id: "calendar-presets",
        name: "Range with presets",
        description: "A range calendar with quick presets like Today, Last 7 days, and Year to date.",
        preview: (
          <div className="w-fit max-w-full">
            <CalendarWithRangePresetsDemo />
          </div>
        ),
        source: ss("calendar/calendar-23"),
      },
      {
        id: "calendar-event-list",
        name: "Event list",
        description: "A calendar with the selected day's events listed beneath it.",
        preview: (
          <div className="w-fit max-w-full">
            <CalendarEventListDemo />
          </div>
        ),
        source: ss("calendar/calendar-11"),
      },
      {
        id: "calendar-appointment",
        name: "Appointment booking",
        description: "A calendar paired with selectable time slots.",
        preview: (
          <div className="w-fit max-w-full">
            <CalendarAppointmentBookingDemo />
          </div>
        ),
        source: ss("calendar/calendar-24"),
      },
      {
        id: "calendar-pricing",
        name: "Pricing",
        description: "A date-range calendar for a pricing period.",
        preview: <CalendarPricingDemo />,
        source: ss("calendar/calendar-25"),
      },
    ],
  },
  {
    id: "date-picker",
    label: "Date picker",
    group: "Components",
    description: "A calendar in a popover, triggered by an input, for selecting a single date or a range.",
    install: "@edgecom/date-picker",
    variants: [
      {
        id: "date-picker-single",
        name: "Single date",
        description: "A calendar in a popover triggered by an input.",
        preview: <DatePickerDemo />,
        source: dm("date-picker-demo"),
      },
      {
        id: "date-picker-range",
        name: "Date range",
        description: "A date-range calendar in a popover for selecting a start and end date.",
        preview: <DatePickerRangeDemo />,
        source: ss("date-picker/date-picker-02"),
      },
      {
        id: "date-picker-natural-language",
        name: "Natural language",
        description: "A text input that parses phrases like “tomorrow” or “next friday” into a date.",
        preview: <DatePickerNaturalLanguageDemo />,
        source: ss("date-picker/date-picker-05"),
      },
      {
        id: "date-picker-time",
        name: "Time",
        description: "A time input for selecting an hour and minute.",
        preview: <DatePickerTimeDemo />,
        source: ss("date-picker/date-picker-08"),
      },
      {
        id: "date-picker-date-time",
        name: "Date and time",
        description: "A date picker paired with a time input.",
        preview: <DatePickerDateTimeDemo />,
        source: ss("date-picker/date-picker-10"),
      },
      {
        id: "date-picker-range-time",
        name: "Date range and time",
        description: "A date-range picker with start and end time inputs.",
        preview: <DatePickerRangeTimeDemo />,
        source: ss("date-picker/date-picker-12"),
      },
    ],
  },
  {
    id: "checkbox",
    label: "Checkbox",
    group: "Components",
    description: "Select one or many options, with grouped and indeterminate states.",
    install: "@edgecom/checkbox",
    variants: [
      {
        id: "checkbox-default",
        name: "Default",
        description: "A single checkbox with a label.",
        preview: <CheckboxDemo />,
        source: ss("checkbox/checkbox-01"),
      },
      {
        id: "checkbox-description",
        name: "With description",
        description: "A checkbox with supporting helper text.",
        preview: <CheckboxDescriptionDemo />,
        source: ss("checkbox/checkbox-07"),
      },
      {
        id: "checkbox-horizontal-group",
        name: "Horizontal group",
        description: "A row of related checkboxes.",
        preview: <CheckboxHorizontalGroupDemo />,
        source: ss("checkbox/checkbox-08"),
      },
      {
        id: "checkbox-cards",
        name: "Cards",
        description: "Selectable cards backed by checkboxes.",
        preview: (
          <div className="w-full max-w-md">
            <CheckboxCardDemo />
          </div>
        ),
        source: ss("checkbox/checkbox-13"),
      },
      {
        id: "checkbox-tree",
        name: "Tree (indeterminate)",
        description: "A nested checkbox tree with an indeterminate parent state.",
        preview: <CheckboxTreeDemo />,
        source: ss("checkbox/checkbox-15"),
      },
    ],
  },
  {
    id: "combobox",
    label: "Combobox",
    group: "Components",
    description: "A searchable select for choosing from long option lists.",
    install: "@edgecom/combobox",
    variants: [
      {
        id: "combobox-default",
        name: "Default",
        description: "A searchable single-select combobox.",
        preview: (
          <div className="w-full max-w-xs">
            <ComboboxDemo />
          </div>
        ),
        source: ss("combobox/combobox-01"),
      },
      {
        id: "combobox-option-groups",
        name: "Option groups",
        description: "A combobox whose results are split into groups.",
        preview: <ComboboxOptionGroupDemo />,
        source: ss("combobox/combobox-02"),
      },
      {
        id: "combobox-search-add",
        name: "Search with add button",
        description: "A combobox that lets users create a new option.",
        preview: <ComboboxWithSearchAndButtonDemo />,
        source: ss("combobox/combobox-06"),
      },
      {
        id: "combobox-multiple",
        name: "Multiple (expandable chips)",
        description: "A multi-select combobox showing selections as chips.",
        preview: <ComboboxMultipleExpandableDemo />,
        source: ss("combobox/combobox-11"),
      },
    ],
  },
  {
    id: "tags-input",
    label: "Tags",
    group: "Components",
    description:
      "A free-text field that turns typed values into removable tags — no option list required.",
    install: "@edgecom/tags-input",
    variants: [
      {
        id: "tags-input-default",
        name: "Default",
        description:
          "Type and press Enter or comma to add a tag; Backspace removes the last one.",
        preview: <TagsInputDemo />,
        source: ss("tags-input/tags-input-01"),
      },
      {
        id: "tags-input-validated",
        name: "Validation and limit",
        description:
          "Rejects invalid entries, dedupes, caps the count, and splits pasted lists.",
        preview: <TagsInputEmailsDemo />,
        source: ss("tags-input/tags-input-02"),
      },
    ],
  },
  {
    id: "button-group",
    label: "Button group",
    group: "Components",
    description: "Related buttons joined into a single control.",
    install: "@edgecom/button-group",
    variants: [
      {
        id: "button-group-ghost",
        name: "Ghost",
        description: "Joined ghost buttons forming a segmented control.",
        preview: <ButtonGroupGhostDemo />,
        source: ss("button-group/button-group-12"),
      },
      {
        id: "button-group-split-dropdown",
        name: "Split dropdown",
        description: "A primary action joined to a dropdown of alternatives.",
        preview: <ButtonGroupDropdownDemo />,
        source: ss("button-group/button-group-11"),
      },
    ],
  },
  {
    id: "tabs",
    label: "Tabs",
    group: "Components",
    description: "Switch between related views within the same context.",
    install: "@edgecom/tabs",
    variants: [
      {
        id: "tabs-default",
        name: "Default",
        description: "Standard tabs with an animated active indicator.",
        preview: <AnimatedTabsDemo />,
        source: ss("tabs/tabs-27"),
      },
      {
        id: "tabs-animated-underline",
        name: "Animated underline",
        description: "Tabs with a sliding underline that follows the active tab.",
        preview: <AnimatedUnderlineTabsDemo />,
        source: ss("tabs/tabs-29"),
      },
    ],
  },
  {
    id: "popover",
    label: "Popover",
    group: "Components",
    description: "Floating panels anchored to a trigger for forms and details.",
    install: "@edgecom/popover",
    variants: [
      {
        id: "popover-form",
        name: "With form field",
        description: "A popover containing a labelled input to edit a value.",
        preview: (
          <Popover>
            <PopoverTrigger render={<Button variant="outline">Demand threshold</Button>} />
            <PopoverContent className="w-72">
              <PopoverTitle>Demand threshold</PopoverTitle>
              <PopoverDescription>
                Alerts fire when 15-minute load exceeds this value.
              </PopoverDescription>
              <div className="mt-3 grid gap-2">
                <Label htmlFor="threshold">Threshold (kW)</Label>
                <Input id="threshold" defaultValue="1100" />
              </div>
            </PopoverContent>
          </Popover>
        ),
      },
      {
        id: "popover-about",
        name: "About card",
        description: "A popover surfacing summary details about an item.",
        preview: <PopoverAboutDemo />,
        source: ss("popover/popover-05"),
      },
      {
        id: "popover-delete-file",
        name: "Delete confirmation",
        description: "A popover confirming a destructive delete action.",
        preview: <PopoverDeleteFileDemo />,
        source: ss("popover/popover-07"),
      },
      {
        id: "popover-feedback",
        name: "Feedback",
        description: "A popover with a quick feedback form.",
        preview: <PopoverFeedbackDemo />,
        source: ss("popover/popover-08"),
      },
      {
        id: "popover-filter",
        name: "Filter",
        description: "A popover housing filter controls for a list or table.",
        preview: <PopoverFilterDemo />,
        source: ss("popover/popover-09"),
      },
      {
        id: "popover-search",
        name: "Search",
        description: "A popover with a search field and results.",
        preview: <PopoverSearchDemo />,
        source: ss("popover/popover-10"),
      },
      {
        id: "popover-notifications",
        name: "Notifications",
        description: "A popover listing recent notifications.",
        preview: <PopoverNotificationsDemo />,
        source: ss("popover/popover-11"),
      },
    ],
  },
  {
    id: "radio-group",
    label: "Radio group",
    group: "Components",
    description: "Choose exactly one option from a set.",
    install: "@edgecom/radio-group",
    variants: [
      {
        id: "radio-group-default",
        name: "Default (vertical)",
        description: "A vertical stack of radio options.",
        preview: <RadioGroupDemo />,
        source: ss("radio-group/radio-group-01"),
      },
      {
        id: "radio-group-horizontal",
        name: "Horizontal",
        description: "Radio options laid out in a row.",
        preview: <RadioGroupHorizontalDemo />,
        source: ss("radio-group/radio-group-02"),
      },
      {
        id: "radio-group-cards",
        name: "Cards",
        description: "Radio options rendered as selectable cards.",
        preview: <RadioGroupCardRadioDemo />,
        source: ss("radio-group/radio-group-11"),
      },
      {
        id: "radio-group-cards-vertical",
        name: "Cards (vertical, with icons)",
        description: "Stacked card options each led by an icon.",
        preview: <RadioGroupCardVerticalRadioDemo />,
        source: ss("radio-group/radio-group-13"),
      },
    ],
  },
  {
    id: "tooltip",
    label: "Tooltip",
    group: "Components",
    description: "Contextual hints and rich previews shown on hover.",
    install: "@edgecom/tooltip @edgecom/hover-card",
    variants: [
      {
        id: "tooltip-default",
        name: "Default",
        description: "A short hint revealed on hover or focus.",
        preview: (
          <TooltipProvider>
            <div className="flex flex-wrap items-center gap-3">
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
                <TooltipContent>Sends a test alert to your inbox.</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button size="icon" variant="ghost" aria-label="Info">
                      <Info />
                    </Button>
                  }
                />
                <TooltipContent>Load is averaged over 15 minutes.</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        ),
      },
      {
        id: "tooltip-badge",
        name: "On a badge",
        description: "Attach a tooltip to a badge to explain its status.",
        preview: (
          <TooltipProvider>
            <TooltipBadgeDemo />
          </TooltipProvider>
        ),
        source: ss("tooltip/tooltip-10"),
      },
      {
        id: "tooltip-content",
        name: "Rich content",
        description: "Tooltips with headings and multiple lines of detail.",
        preview: (
          <TooltipProvider>
            <TooltipContentDemo />
          </TooltipProvider>
        ),
        source: ss("tooltip/tooltip-07"),
      },
      {
        id: "tooltip-error",
        name: "Error state",
        description: "A destructive-styled tooltip for warnings and errors.",
        preview: (
          <TooltipProvider>
            <TooltipErrorDemo />
          </TooltipProvider>
        ),
        source: ss("tooltip/tooltip-04"),
      },
      {
        id: "hover-card-stats",
        name: "Hover card — stats",
        description: "A rich hover card surfacing key metrics at a glance.",
        preview: <HoverCardStatsDemo />,
        source: ss("tooltip/tooltip-12"),
      },
      {
        id: "hover-card-project",
        name: "Hover card — project",
        description: "Preview project details without leaving the page.",
        preview: <HoverCardProjectDemo />,
        source: ss("tooltip/tooltip-13"),
      },
      {
        id: "hover-card-tasks",
        name: "Hover card — tasks",
        description: "Show a summary task list on hover.",
        preview: <HoverCardTasksDemo />,
        source: ss("tooltip/tooltip-15"),
      },
    ],
  },
  {
    id: "toast",
    label: "Toast",
    group: "Components",
    description: "Brief, dismissible notifications for feedback and events.",
    install: "@edgecom/toast",
    variants: [
      {
        id: "toast-triggers",
        name: "Toast triggers",
        description: "Buttons that fire success, error, and info toasts.",
        preview: <ToastDemo />,
        source: dm("toast-demo"),
      },
    ],
  },
  {
    id: "authorization",
    label: "Authorization",
    group: "Blocks",
    description: "A connection-progress screen for OAuth-style utility linking flows.",
    install: "@edgecom/authorization",
    variants: [
      {
        id: "authorization-connecting",
        name: "Connecting",
        description: "A card that tracks each step of a utility connection while it runs.",
        preview: <AuthorizationDemo />,
        source: dm("authorization-demo"),
      },
      {
        id: "authorization-request",
        name: "Access request",
        description: "An OAuth-style consent card with a searchable utility selector.",
        preview: <AuthorizationRequestDemo />,
        source: dm("authorization-request-demo"),
      },
    ],
  },
  {
    id: "detail-dialog",
    label: "Detail dialog",
    group: "Blocks",
    description: "Composed, opinionated dialogs that assemble many primitives into a full editing screen.",
    install: "@edgecom/detail-dialog",
    variants: [
      {
        id: "detail-dialog-create-alarm",
        name: "Create alarm",
        description: "A grouped, multi-section form dialog for defining a threshold alarm on a sensor, with a live rule summary.",
        preview: <CreateAlarmDialogDemo />,
        source: dm("create-alarm-dialog-demo"),
      },
      {
        id: "detail-dialog-user",
        name: "Edit user details",
        description: "A scrollable record editor combining avatar, inputs, select, calendar, and popover.",
        preview: <UserDetailsDialogDemo />,
        source: dm("user-details-dialog-demo"),
      },
      {
        id: "detail-dialog-search",
        name: "Search",
        description: "A command-palette search across sites, meters, DR events, and reports.",
        preview: (
          <SearchDialog
            trigger={<Button variant="outline">Search Edgecom</Button>}
          />
        ),
        source: ss("blocks/dialog-search"),
      },
      {
        id: "detail-dialog-verify",
        name: "Verify identity",
        description: "A two-factor verification flow for authorizing a Demand Response action.",
        preview: (
          <VerifyDialog
            trigger={<Button variant="outline">Verify identity</Button>}
          />
        ),
        source: ss("blocks/dashboard-dialog-09/dialog-verify"),
      },
      {
        id: "detail-dialog-import",
        name: "Import data",
        description: "A drag-and-drop uploader for importing meter data into dataTrack™.",
        preview: (
          <FileUploadDialog
            trigger={<Button variant="outline">Import energy data</Button>}
          />
        ),
        source: ss("blocks/dashboard-dialog-11/dialog-file-upload"),
      },
      {
        id: "detail-dialog-edit-asset",
        name: "Edit asset",
        description: "A full form dialog for editing a NeuraCharge™ station's configuration.",
        preview: (
          <UpdateProductDialog
            trigger={<Button variant="outline">Edit NeuraCharge™ station</Button>}
          />
        ),
        source: ss("blocks/dashboard-dialog-12/dialog-update-product"),
      },
      {
        id: "detail-dialog-add-site",
        name: "Add site",
        description: "A form dialog for registering a new site, with type, market, and toggles.",
        preview: (
          <AddAddressDialog
            trigger={<Button variant="outline">Add site</Button>}
          />
        ),
        source: ss("blocks/dashboard-dialog-14/dialog-add-address"),
      },
      {
        id: "detail-dialog-wizard",
        name: "Multi-step wizard",
        description: "A four-step wizard for enrolling sites in a Demand Response program.",
        preview: (
          <InitializePipelineDialog
            trigger={<Button variant="outline">Configure Demand Response</Button>}
          />
        ),
        source: ss("blocks/dashboard-dialog-25/dialog-pipeline-configuration"),
      },
      {
        id: "detail-dialog-share",
        name: "Share & collaborate",
        description: "A share dialog with a copyable link, permissions, and a comment toggle.",
        preview: (
          <ShareCollaborateDialog
            trigger={<Button variant="outline">Share report</Button>}
          />
        ),
        source: ss("blocks/dashboard-dialog-26/dialog-share-collaborate"),
      },
    ],
  },
  {
    id: "chart-blocks",
    label: "Charts",
    group: "Blocks",
    description: "Prebuilt chart blocks themed with the commodity color ramps.",
    install: "@edgecom/charts",
    toc: [
      { id: "chart-consumption", name: "Consumption metrics" },
      { id: "chart-spend", name: "Energy spend" },
      { id: "chart-demand-response", name: "Demand response" },
    ],
    node: (
      <div className="flex flex-col gap-8">
        <div id="chart-consumption" className="scroll-mt-24">
          <EnergyConsumptionMetrics className="w-full" />
        </div>
        <div id="chart-spend" className="scroll-mt-24">
          <EnergySpendCard className="w-full" />
        </div>
        <div id="chart-demand-response" className="scroll-mt-24">
          <DemandResponsePerformance className="w-full" />
        </div>
      </div>
    ),
  },
  {
    id: "datatable",
    label: "Data table",
    group: "Blocks",
    description: "Full-featured tables with sorting, filtering, pagination, and selection.",
    install: "@edgecom/data-table",
    variants: [
      {
        id: "data-table-advanced",
        name: "Advanced (filters · columns · pagination)",
        description: "A complete table with filtering, column toggles, and paging.",
        preview: <DataTableAdvancedDemo />,
        source: dm("datatable-demo"),
      },
      {
        id: "data-table-default",
        name: "Default (sortable, selectable)",
        description: "A baseline table with sortable columns and row selection.",
        preview: <DataTableBasicDemo />,
        source: ss("data-table/data-table-01"),
      },
      {
        id: "data-table-expandable",
        name: "Expandable rows",
        description: "Rows that expand to reveal nested detail.",
        preview: <DataTableWithExpandableRowsDemo />,
        source: ss("data-table/data-table-09"),
      },
      {
        id: "data-table-pagination",
        name: "Pagination",
        description: "Page through large datasets with page-size controls.",
        preview: <DataTableWithPaginationDemo />,
        source: ss("data-table/data-table-11"),
      },
      {
        id: "data-table-export",
        name: "Export",
        description: "Export the current table view to CSV.",
        preview: <DataTableWithExportDemo />,
        source: ss("data-table/data-table-12"),
      },
      {
        id: "data-table-editable",
        name: "Editable cells",
        description: "Edit values inline directly within table cells.",
        preview: <EditableDataTableDemo />,
        source: ss("data-table/data-table-13"),
      },
    ],
  },
  {
    id: "form",
    label: "Form",
    group: "Blocks",
    description: "Composed form layouts, from single-step to multi-step wizards.",
    install: "@edgecom/form",
    variants: [
      {
        id: "form-validated",
        name: "Validated form (TanStack Form)",
        description:
          "State, validation, and submission owned by TanStack Form; a zod schema drives inline errors through the Field primitives.",
        preview: <FormValidatedTanstack />,
        source: ss("blocks/form-validated/form-validated"),
      },
      {
        id: "form-personal-info",
        name: "Personal information (single step)",
        description: "A single-step form for capturing basic profile details.",
        preview: <FormLayoutPersonalInfo />,
        source: ss("blocks/form-layout-01/form-layout-01"),
      },
      {
        id: "form-onboarding-wizard",
        name: "Onboarding wizard (multi-step)",
        description: "A guided multi-step flow for onboarding new users.",
        preview: <FormLayoutOnboardingWizard />,
        source: ss("blocks/form-layout-09/form-layout-09"),
      },
    ],
  },
  {
    id: "page-header",
    label: "Page header",
    group: "Blocks",
    description:
      "A breadcrumb above the H1, plus optional tab and toolbar rows. Any crumb — including the current page — can open a dropdown to pivot between peers.",
    install: "@edgecom/page-header",
    variants: [
      {
        id: "page-header-default",
        name: "Breadcrumb + title",
        description:
          "The baseline every page should have: an ancestor breadcrumb above the H1. Any crumb can carry a dropdown (here 'Downtown Plant') for switching between sibling pages.",
        preview: <PageHeaderDemo />,
        source: ss("blocks/page-header/page-header-demo"),
      },
      {
        id: "page-header-tabs",
        name: "Breadcrumb + title + tabs",
        description:
          "Adds a tab row beneath the title for switching between views of the same resource.",
        preview: <PageHeaderTabsDemo />,
        source: ss("blocks/page-header/page-header-tabs"),
      },
      {
        id: "page-header-toolbar",
        name: "Breadcrumb + title + tabs + toolbar",
        description:
          "The full pattern: also a right-aligned toolbar with an 'updated' meta, a date-range picker, export, and a primary action.",
        preview: <PageHeaderToolbarDemo />,
        source: ss("blocks/page-header/page-header-toolbar"),
      },
    ],
  },
  {
    id: "file-upload",
    label: "File upload",
    group: "Blocks",
    description: "Drag-and-drop and browse controls for uploading files.",
    install: "@edgecom/file-upload",
    toc: [], // single demo — right rail shows the install command only
    node: (
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">
          Drag &amp; drop with progress, validation &amp; previews
        </span>
        <div className="flex justify-center">
          <FileUploadDemo />
        </div>
      </div>
    ),
  },
  {
    id: "statistics",
    label: "Statistic Cards",
    group: "Blocks",
    description: "Metric tiles and KPI blocks for dashboards.",
    install:
      "@ss-blocks/statistics-component-13 @ss-blocks/statistics-component-14 @ss-blocks/statistics-component-22 @ss-blocks/statistics-component-21 @ss-blocks/statistics-component-19 @ss-blocks/statistics-component-12 @ss-blocks/statistics-component-07 @ss-blocks/statistics-component-09 @ss-blocks/statistics-component-10",
    toc: [
      { id: "stats-finance", name: "Finance / goal-status" },
      { id: "stats-status", name: "Status-tagged KPIs" },
      { id: "stats-score", name: "Score gauge" },
      { id: "stats-health", name: "Service-health meters" },
      { id: "stats-line-trend", name: "Line-trend KPIs" },
      { id: "stats-channel", name: "Channel distribution" },
      { id: "stats-overview", name: "Overview grid" },
      { id: "stats-activity", name: "Activity / traffic" },
      { id: "stats-expense-income", name: "Expense / income" },
    ],
    // Each preview ships a generous py-8/16/24 wrapper for standalone routes;
    // neutralize it here so the docs stack tightly. Status colors were
    // remapped to semantic tokens (success/warning/destructive/info).
    node: (
      <div className="flex flex-col gap-12 [&_[class*='py-8']]:!py-0">
        <StatBlock id="stats-finance" label="Finance / goal-status cards (component-13)">
          <StatisticsFinancePreview />
        </StatBlock>
        <StatBlock id="stats-status" label="Status-tagged KPIs (component-12)">
          <StatisticsWithStatusPreview />
        </StatBlock>
        <StatBlock id="stats-score" label="Score gauge (component-14)">
          <StatisticsScorePreview />
        </StatBlock>
        <StatBlock id="stats-health" label="Service-health meters (component-22)">
          <StatisticsHealthPreview />
        </StatBlock>
        <StatBlock id="stats-line-trend" label="Line-trend KPI cards (component-21)">
          <StatisticsLineTrendsPreview />
        </StatBlock>
        <StatBlock id="stats-channel" label="Channel distribution (component-19)">
          <StatisticsRevenueChannelPreview />
        </StatBlock>
        <StatBlock id="stats-overview" label="Overview grid (component-09)">
          <StatisticsOverviewPreview />
        </StatBlock>
        <StatBlock id="stats-activity" label="Activity / traffic cards (component-10)">
          <StatisticsActivityPreview />
        </StatBlock>
        <StatBlock id="stats-expense-income" label="Expense / income area cards (component-07)">
          <StatisticsExpenseIncomePreview />
        </StatBlock>
      </div>
    ),
  },
  {
    id: "widgets",
    label: "Widgets",
    group: "Blocks",
    description: "Composed dashboard widgets combining stats, charts, and lists.",
    install:
      "@ss-blocks/widget-component-07 @ss-blocks/widget-component-17 @ss-blocks/widget-component-15 @ss-blocks/widget-component-20 @ss-blocks/widget-component-09 @ss-blocks/widget-component-02",
    toc: [
      { id: "widget-finance", name: "Finance review summary" },
      { id: "widget-orders", name: "Timeline orders" },
      { id: "widget-user-order", name: "User order summary" },
      { id: "widget-activity", name: "Customer activity" },
      { id: "widget-campaign", name: "Monthly campaign state" },
      { id: "widget-insights", name: "Product insights" },
    ],
    node: (
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <StatBlock id="widget-finance" label="Finance review summary (component-07)">
          <GeneralFinanceReviewsCard
            title="Energy savings review"
            amount="$50,232"
            period="Last 6 months"
            progressLabel="Current activity"
            progressValue={25}
            stats={widgetFinanceStats}
            className="w-full"
          />
        </StatBlock>
        <StatBlock id="widget-orders" label="Timeline orders (component-17)">
          <OrdersCard className="w-full" />
        </StatBlock>
        <StatBlock id="widget-user-order" label="User order summary (component-15)">
          <UserOrderCard className="w-full" />
        </StatBlock>
        <StatBlock id="widget-activity" label="Customer activity (component-20)">
          <CustomerActivityCard
            title="Active facilities"
            activeCustomers={856}
            churnedCustomers={144}
            progressValue={86}
            className="w-full"
          />
        </StatBlock>
        <StatBlock id="widget-campaign" label="Monthly campaign state (component-09)">
          <MonthlyCampaignCard
            title="Program performance"
            subTitle="7.58k demand-response events"
            campaignData={widgetCampaignData}
            className="w-full"
          />
        </StatBlock>
        <StatBlock id="widget-insights" label="Product insights (component-02)">
          <ProductInsightsCard className="w-full" />
        </StatBlock>
      </div>
    ),
  },
  {
    id: "application-shell",
    label: "Application shell",
    group: "Blocks",
    description: "The full page frame — sidebar, top bar, and content layout.",
    install: "@edgecom/sidebar",
    variants: [
      {
        id: "application-shell-dashboard",
        name: "Dashboard shell",
        description:
          "Sidebar navigation, a top bar with search and account menus, and a scrollable content area — composed from registry primitives.",
        preview: <ApplicationShellDemo />,
        source: dm("application-shell-demo"),
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    group: "Blocks",
    description:
      "Account settings pages plus the settings shell that frames them with a grouped sub-nav.",
    install: "@edgecom/settings-shell",
    variants: [
      {
        id: "settings-security",
        name: "Security preferences",
        description:
          "Two-factor authentication, API key management, and active session tracking under a Security / Preferences / Users tab bar.",
        preview: <SecuritySettings />,
        source: ss("blocks/settings-shell/security-settings"),
      },
      {
        id: "settings-general",
        name: "General settings",
        description:
          "Portal name, timezone, and workspace preferences under a Portal / Preferences / Users tab bar.",
        preview: <AccountSettings />,
        source: ss("blocks/settings-shell/account-settings"),
      },
      {
        id: "settings-shell-combined",
        name: "Settings shell (nav + content)",
        description:
          "The grouped settings sub-nav beside a live content panel — how the pages look assembled into the full shell.",
        preview: <SettingsContent />,
        source: ss("blocks/settings-shell/settings-content"),
      },
    ],
  },
];

export const groupOrder = ["Getting Started", "Foundations", "Components", "Blocks"];

// Sections grouped and ordered for the sidebar / command palette. Components
// are alphabetized within their group; every other group keeps source order.
export const groupedSections = groupOrder.map((group) => ({
  group,
  items: sections
    .filter((s) => s.group === group)
    .sort((a, b) =>
      group === "Components" || group === "Blocks"
        ? a.label.localeCompare(b.label)
        : 0
    ),
}));

/** URL-safe slug for a group name, e.g. "Getting Started" -> "getting-started". */
export const groupSlug = (group: string) =>
  group.toLowerCase().replace(/\s+/g, "-");

/** Clean route path for a section, e.g. "/components/slider". */
export const sectionPath = (s: Section) => `/${groupSlug(s.group)}/${s.id}`;

/** Resolve a section from its route params. */
export function findSection(group: string, slug: string) {
  return sections.find((s) => groupSlug(s.group) === group && s.id === slug);
}

/** Landing route: the first section (Getting Started → Introduction). */
export const firstSectionPath = sectionPath(sections[0]);
