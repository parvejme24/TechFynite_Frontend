import React from "react";

const TemplateDetailsSkeleton: React.FC = () => {
  return (
    <div>
      <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            {/* Category skeleton */}
            <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse" />
            {/* Meta info skeleton */}
            <div className="flex items-center justify-between mb-2">
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
            </div>
            {/* Title skeleton */}
            <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse" />
            {/* Description skeleton */}
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded mb-4 animate-pulse" />
            {/* Buttons skeleton */}
            <div className="space-y-2">
              <div className="h-[45px] w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="w-full grid grid-cols-2 gap-2">
                <div className="h-[45px] bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                <div className="h-[45px] bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div>
            {/* Image skeleton */}
            <div className="w-full h-80 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            {/* Description section skeleton */}
            <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse" />
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
            </div>
            {/* What's Included section skeleton */}
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse" />
            <div className="space-y-2 mb-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-4 w-2/3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              ))}
            </div>
          </div>

          <div>
            {/* Key Features section skeleton */}
            <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailsSkeleton;