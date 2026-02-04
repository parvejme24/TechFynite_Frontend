"use client";
import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import BlogList from "./BlogList";
import { useGetPublishedBlogs } from "@/hooks/useBlogApi";
import { IBlog } from "@/types/blog";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";

export default function BlogContainer() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 8; // Number of blogs per page
  
  // Reset to page 1 when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);
  
  const { data: blogsResponse, isLoading, error } = useGetPublishedBlogs({
    page,
    limit,
    search: searchTerm || undefined,
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
      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-[600px]">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 h-12 w-full rounded-full bg-white dark:bg-[#1A1D37] border-2 border-gray-300 dark:border-gray-600 focus:border-[#0F35A7] dark:focus:border-[#0F59BC] text-gray-900 dark:text-white transition-all duration-200"
          />
        </div>
      </div>

      <BlogList
        blogs={blogs}
        onBlogClick={handleBlogClick}
        loading={isLoading}
      />
      
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrev || isLoading}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1A1D37] text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Previous page"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {(() => {
              const pages: (number | string)[] = [];
              const currentPage = pagination.page;
              const totalPages = pagination.totalPages;
              
              if (totalPages <= 7) {
                // Show all pages if 7 or fewer
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // Always show first page
                pages.push(1);
                
                if (currentPage > 3) {
                  pages.push('...');
                }
                
                // Show pages around current
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);
                
                for (let i = start; i <= end; i++) {
                  pages.push(i);
                }
                
                if (currentPage < totalPages - 2) {
                  pages.push('...');
                }
                
                // Always show last page
                pages.push(totalPages);
              }
              
              return pages.map((pageNum, index) => {
                if (pageNum === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-500 dark:text-gray-400">
                      ...
                    </span>
                  );
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum as number)}
                    disabled={isLoading}
                    className={`px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                      pagination.page === pageNum
                        ? "bg-[#0F35A7] dark:bg-[#0F59BC] text-white border-[#0F35A7] dark:border-[#0F59BC]"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1A1D37] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {pageNum}
                  </button>
                );
              });
            })()}
          </div>
          
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={!pagination.hasNext || isLoading}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1A1D37] text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Next page"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
