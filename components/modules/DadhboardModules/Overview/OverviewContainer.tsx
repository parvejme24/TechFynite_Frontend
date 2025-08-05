"use client";

import React from "react";
import StatsGrid from "./StatsGrid";
import RevenueChart from "./RevenueChart";
import TrafficChart from "./TrafficChart";
import RecentActivity from "./RecentActivity";
import UpcomingEvents from "./UpcomingEvents";

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Overview
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Get a quick overview of your website&apos;s performance
        </p>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <TrafficChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <UpcomingEvents />
      </div>
    </div>
  );
}
