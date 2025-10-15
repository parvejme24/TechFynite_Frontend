import React from "react";
import {
  FiUsers,
  FiFileText,
  FiEye,
} from "react-icons/fi";

const recentActivity = [
  {
    id: 1,
    title: "New user registered",
    time: "2 hours ago",
    icon: FiUsers,
  },
  {
    id: 2,
    title: "New template added",
    time: "4 hours ago",
    icon: FiFileText,
  },
  {
    id: 3,
    title: "Website traffic increased",
    time: "6 hours ago",
    icon: FiEye,
  },
];

const RecentActivity: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#1A1D37] rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h2>
      <div className="space-y-4">
        {recentActivity.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800 last:border-0"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <activity.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              View details
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;