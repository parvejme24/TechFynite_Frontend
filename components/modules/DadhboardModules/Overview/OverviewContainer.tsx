"use client";

import React from "react";
import StatsGrid from "./StatsGrid";
import RevenueChart from "./RevenueChart";
import TrafficChart from "./TrafficChart";
import RecentActivity from "./RecentActivity";
import TopSellingTemplates from "./TopSellingTemplates";

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <StatsGrid />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <TrafficChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <TopSellingTemplates />
      </div>
    </div>
  );
}
