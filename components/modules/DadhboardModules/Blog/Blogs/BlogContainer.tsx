"use client";
import React, { useState } from "react";
import BlogList from "./BlogList";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useBlogs, useDeleteBlog } from "@/hooks/useBlogApi";
import { useRouter } from "next/navigation";

const BLOGS_PER_PAGE = 8;

export default function BlogContainer() {
  const { data: blogs = [], isLoading, error } = useBlogs();
  const [page, setPage] = useState(1);
  const { mutate: deleteBlog } = useDeleteBlog();
  const router = useRouter();

  // Pagination logic - only if blogs > BLOGS_PER_PAGE
  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
  const paginatedBlogs =
    blogs.length > BLOGS_PER_PAGE
      ? blogs.slice((page - 1) * BLOGS_PER_PAGE, page * BLOGS_PER_PAGE)
      : blogs;

  const handleEditBlog = (blog: unknown) => {
    router.push(`/dashboard/blogs/edit/${(blog as { id: string }).id}`);
  };

  const handleDeleteBlog = (blog: unknown) => {
    deleteBlog((blog as { id: string }).id);
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blogs</h2>
        <Link href="/dashboard/blogs/create">
          <button className="cursor-pointer bg-[#2B7FFF] hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg shadow">
            Create New Blog
          </button>
        </Link>
      </div>
      <div className="">
        {error ? (
          <div className="text-red-500">{(error as Error).message}</div>
        ) : (
          <>
            <BlogList
              blogs={paginatedBlogs}
              onEdit={handleEditBlog}
              onDelete={handleDeleteBlog}
              loading={isLoading}
            />
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
