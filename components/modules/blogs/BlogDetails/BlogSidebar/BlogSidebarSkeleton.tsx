import React from "react";

const BlogSidebarSkeleton: React.FC = () => {
  return (
    <div>
      {/* Heading skeleton */}
      <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
      {/* Blog items skeleton (4 items) */}
      <ul className="space-y-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <li key={idx} className="flex gap-3 items-center">
            <div className="rounded object-cover w-16 h-10 bg-gray-300 dark:bg-gray-700 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogSidebarSkeleton;