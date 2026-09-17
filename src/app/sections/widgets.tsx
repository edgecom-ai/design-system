"use client"

// Content for the "widgets" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { Zap, Gauge, DollarSign, Leaf, TrendingUp, Bell } from "lucide-react";
import { StatBlock } from "./shared";

const GeneralFinanceReviewsCard = React.lazy(() => import("@/components/shadcn-studio/blocks/widget-general-finance-reviews"));

const OrdersCard = React.lazy(() => import("@/components/shadcn-studio/blocks/widget-orders"));

const UserOrderCard = React.lazy(() => import("@/components/shadcn-studio/blocks/widget-user-order"));

const CustomerActivityCard = React.lazy(() => import("@/components/shadcn-studio/blocks/widget-component-20/widget-customer-activity"));

const MonthlyCampaignCard = React.lazy(() => import("@/components/shadcn-studio/blocks/widget-monthly-campaign"));

const ProductInsightsCard = React.lazy(() => import("@/components/shadcn-studio/blocks/widget-product-insights"));

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

const content = {
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
};

export default content;
