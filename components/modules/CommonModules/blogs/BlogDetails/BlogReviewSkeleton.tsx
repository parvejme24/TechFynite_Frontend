import React from "react";

interface BlogReviewSkeletonProps {
  count?: number;
}

const BlogReviewSkeleton: React.FC<BlogReviewSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="bg-white dark:bg-[#1A1D37] rounded-lg p-6 lg:p-8 mt-8">
      {/* Header skeleton */}
      <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-6 animate-pulse" />
      
      {/* Reviews skeleton */}
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="flex items-start gap-3">
            {/* Avatar skeleton */}
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0 animate-pulse" />
            
            {/* Comment Content skeleton */}
            <div className="flex-1 min-w-0">
              {/* Comment Bubble skeleton */}
              <div className="bg-gray-100 dark:bg-[#0B1026] rounded-2xl rounded-tl-sm px-4 py-2 inline-block max-w-full">
                {/* Name and date skeleton */}
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                {/* Comment text skeleton - multiple lines */}
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 w-4/6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
              
              {/* Actions Row skeleton */}
              <div className="flex items-center gap-4 mt-1 ml-1">
                {/* Actions skeleton */}
                <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                {/* Reply button skeleton - beside Hide */}
                <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogReviewSkeleton;
