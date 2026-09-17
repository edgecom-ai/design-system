"use client"

// Content for the "statistics" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { StatBlock } from "./shared";

const StatisticsUsagePreview = React.lazy(() => import("@/app/statistics-component-15/page"));

const StatisticsScorePreview = React.lazy(() => import("@/app/statistics-component-14/page"));

const StatisticsHealthPreview = React.lazy(() => import("@/app/statistics-component-22/page"));

const StatisticsLineTrendsPreview = React.lazy(() => import("@/app/statistics-component-21/page"));

const StatisticsRevenueChannelPreview = React.lazy(() => import("@/app/statistics-component-19/page"));

const StatisticsKpiPreview = React.lazy(() => import("@/app/statistics-component-02/page"));

const StatisticsExpenseIncomePreview = React.lazy(() => import("@/app/statistics-component-07/page"));

const StatisticsOverviewPreview = React.lazy(() => import("@/app/statistics-component-09/page"));

const StatisticsActivityPreview = React.lazy(() => import("@/app/statistics-component-10/page"));

const content = {
  node: (
      <div className="flex flex-col gap-12 [&_[class*='py-8']]:!py-0">
        <StatBlock id="stats-usage" label="Usage / allocation meters (component-15)">
          <StatisticsUsagePreview />
        </StatBlock>
        <StatBlock id="stats-kpi" label="KPI tiles with period selector (component-02)">
          <StatisticsKpiPreview />
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
};

export default content;
