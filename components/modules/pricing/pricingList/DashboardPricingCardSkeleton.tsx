import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";

export default function DashboardPricingCardSkeleton() {
  return (
    <Card className="bg-white dark:bg-[#1A1D37] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* Title Skeleton with staggered animation */}
            <div className="h-6 w-32 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded mb-2 animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
            {/* Description Skeleton with different delay */}
            <div className="h-4 w-48 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer" style={{ animationDelay: '0.2s' }}></div>
          </div>
          {/* Action Buttons Skeleton with hover effect */}
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer group-hover:scale-105 transition-transform duration-200"></div>
            <div className="h-8 w-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer group-hover:scale-105 transition-transform duration-200" style={{ animationDelay: '0.1s' }}></div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Price Section Skeleton with shimmer effect */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
            <div className="h-8 w-16 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer" style={{ animationDelay: '0.3s' }}></div>
            <div className="h-4 w-12 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer" style={{ animationDelay: '0.4s' }}></div>
          </div>

          {/* Status Badges Skeleton with pulse effect */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-16 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-full animate-pulse bg-[length:200%_100%] animate-shimmer group-hover:scale-105 transition-transform duration-200"></div>
            <div className="h-6 w-20 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-full animate-pulse bg-[length:200%_100%] animate-shimmer group-hover:scale-105 transition-transform duration-200" style={{ animationDelay: '0.2s' }}></div>
          </div>

          {/* Features Section Skeleton with staggered animation */}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer" style={{ animationDelay: '0.5s' }}></div>
            <ul className="space-y-1">
              {[1, 2, 3].map((item, index) => (
                <li key={item} className="flex items-center gap-2 group/item">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-full animate-pulse bg-[length:200%_100%] animate-shimmer group-hover/item:scale-125 transition-transform duration-200" style={{ animationDelay: `${0.6 + index * 0.1}s` }}></div>
                  <div className="h-4 w-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer group-hover/item:scale-105 transition-transform duration-200" style={{ animationDelay: `${0.6 + index * 0.1}s` }}></div>
                </li>
              ))}
              <li className="h-4 w-24 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer group-hover:scale-105 transition-transform duration-200" style={{ animationDelay: '0.9s' }}></li>
            </ul>
          </div>

          {/* Created Date Skeleton with final animation */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer group-hover:scale-110 transition-transform duration-200"></div>
            <div className="h-4 w-32 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer group-hover:scale-105 transition-transform duration-200" style={{ animationDelay: '0.1s' }}></div>
          </div>
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </Card>
  );
}