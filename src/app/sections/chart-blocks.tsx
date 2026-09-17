"use client"

// Content for the "chart-blocks" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"

const EnergyConsumptionMetrics = React.lazy(() => import("@/components/shadcn-studio/blocks/chart-saas-revenue-metrics"));

const EnergySpendCard = React.lazy(() => import("@/components/shadcn-studio/blocks/chart-budget-spend-analytics"));

const DemandResponsePerformance = React.lazy(() => import("@/components/shadcn-studio/blocks/chart-revenue-performance"));

const content = {
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
};

export default content;
