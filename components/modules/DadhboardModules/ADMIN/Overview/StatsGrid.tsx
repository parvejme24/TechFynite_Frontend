import React from "react";
import {
  FiUsers,
  FiFileText,
  FiEye,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

const stats = [
  {
    title: "Active Users",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: FiUsers,
    color: "bg-blue-500",
  },
  {
    title: "Total Downloads",
    value: "456",
    change: "+8%",
    trend: "up",
    icon: FiFileText,
    color: "bg-green-500",
  },
  {
    title: "Total Templates",
    value: "45.6K",
    change: "-3%",
    trend: "down",
    icon: FiEye,
    color: "bg-purple-500",
  },
  {
    title: "Total Earnings",
    value: "45.6K",
    change: "-3%",
    trend: "down",
    icon: FiEye,
    color: "bg-purple-500",
  },
];

const StatsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white dark:bg-[#1A1D37] p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {stat.trend === "up" ? (
              <FiTrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <FiTrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`text-sm font-medium ml-2 ${
                stat.trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {stat.change}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              from last month&apos;s data
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;