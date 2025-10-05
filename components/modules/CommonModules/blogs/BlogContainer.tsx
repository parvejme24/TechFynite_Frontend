"use client";
import React, { useEffect, useState } from "react";
import BlogList from "./BlogList";
import type { BlogCardProps } from "./BlogCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const BLOGS_PER_PAGE = 8;

export default function BlogContainer() {
  const [blogs, setBlogs] = useState<BlogCardProps['blog'][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Mock implementation - no API calls
    setLoading(false);
    setBlogs([]); // Empty array for now
  }, []);

  // Pagination logic - only if blogs > BLOGS_PER_PAGE
  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
  const paginatedBlogs: BlogCardProps['blog'][] = blogs.length > BLOGS_PER_PAGE 
    ? blogs.slice((page - 1) * BLOGS_PER_PAGE, page * BLOGS_PER_PAGE)
    : blogs;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0 py-14">
             <div className="">
         {error ? (
           <div className="text-red-500">{error}</div>
         ) : (
           <>
             <BlogList blogs={paginatedBlogs} loading={loading} />
            {/* Show pagination only if total blogs > BLOGS_PER_PAGE */}
            {blogs.length > BLOGS_PER_PAGE && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  className="cursor-pointer p-2 rounded-full border border-gray-300 dark:border-blue-800 bg-white dark:bg-blue-800 text-gray-700 dark:text-white disabled:opacity-50 flex items-center justify-center"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <FiChevronLeft size={20} />
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    className={`px-3 py-1 rounded-full border cursor-pointer transition-colors duration-150 ${
                      page === idx + 1
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white dark:bg-blue-900 text-gray-700 dark:text-white border-gray-300 dark:border-blue-800"
                    }`}
                    onClick={() => setPage(idx + 1)}
                    aria-label={`Go to page ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  className="cursor-pointer p-2 rounded-full border border-gray-300 dark:border-blue-800 bg-white dark:bg-blue-800 text-gray-700 dark:text-white disabled:opacity-50 flex items-center justify-center"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
