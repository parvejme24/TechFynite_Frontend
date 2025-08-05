import React from "react";

const BlogDetailsSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#1A1D37] rounded-lg">
      {/* Blog image skeleton */}
      <div className="w-full h-[400px] bg-gray-300 dark:bg-gray-700 rounded-lg mb-6 border animate-pulse" />
      <div className="p-5">
        {/* Category skeleton */}
        <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse" />
        {/* Title skeleton */}
        <div className="h-8 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse" />
        {/* Description skeleton */}
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded mb-4 animate-pulse" />
        {/* Content blocks skeleton (2 blocks) */}
        {Array.from({ length: 2 }).map((_, idx) => (
          <div key={idx} className="mb-6">
            <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded mb-2 animate-pulse" />
            <div className="h-40 w-full bg-gray-300 dark:bg-gray-700 rounded-md my-2 animate-pulse" />
          </div>
        ))}
        {/* Comment form skeleton */}
        <div className="mt-8">
          <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse" />
          <div className="h-20 w-full bg-gray-200 dark:bg-gray-600 rounded mb-2 animate-pulse" />
          <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsSkeleton;