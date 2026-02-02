"use client";
import React, { useState } from "react";
import BlogCard from "./BlogCard";
import BlogList from "./BlogList";
import { useGetPublishedBlogs } from "@/hooks/useBlogApi";
import { IBlog } from "@/types/blog";

export default function BlogContainer() {
  const [page, setPage] = useState(1);
  const limit = 12; // Number of blogs per page
  
  const { data: blogsResponse, isLoading, error } = useGetPublishedBlogs({
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Extract blogs array from response
  const blogs: IBlog[] = blogsResponse?.data || [];
  const pagination = blogsResponse?.pagination;

  const handleBlogClick = (blog: IBlog) => {
    // Navigation is handled in BlogCard component
  };

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-5 lg:px-0 py-10">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">
            Error Loading Blogs
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">
            {(error as any)?.response?.data?.message || 
             (error as any)?.response?.data?.error || 
             (error as Error).message || 
             'Failed to load blogs. Please try again later.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-5 lg:px-0 py-10">
      <BlogList
        blogs={blogs}
        onBlogClick={handleBlogClick}
        loading={isLoading}
      />
      
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrev || isLoading}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={!pagination.hasNext || isLoading}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
