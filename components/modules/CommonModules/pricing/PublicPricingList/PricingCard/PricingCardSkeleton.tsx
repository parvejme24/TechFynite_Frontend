import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PricingCardSkeleton() {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm animate-pulse">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="w-full">
            {/* Title skeleton - centered */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4 mx-auto"></div>
            {/* Description skeleton - centered */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="">
          {/* Price skeleton - centered */}
          <div className="flex justify-center items-center gap-2">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>

          {/* Status skeleton - centered */}
          <div className="flex items-center gap-2 justify-center mt-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>

          {/* Features skeleton */}
          <div className="space-y-2 mt-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <ul className="space-y-1">
              {[1, 2, 3, 4].map((index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </li>
              ))}
            </ul>
          </div>

          {/* Buy Now button skeleton */}
          <div className="mt-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 