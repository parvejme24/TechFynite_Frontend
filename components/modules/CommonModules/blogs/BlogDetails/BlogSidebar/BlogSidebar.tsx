"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import BlogSidebarSkeleton from "./BlogSidebarSkeleton";
import { useGetPublishedBlogs } from "@/hooks/useBlogApi";

export default function BlogSidebar() {
  const { data, isLoading, error } = useGetPublishedBlogs({
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const latestBlogs = data?.data || [];

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Latest Blogs</h2>
      {isLoading ? (
        <BlogSidebarSkeleton />
      ) : error ? (
        <div className="text-red-500 dark:text-red-400 text-sm">
          {error instanceof Error ? error.message : "Error loading blogs"}
        </div>
      ) : latestBlogs.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-sm">No blogs found.</div>
      ) : (
        <ul className="space-y-4">
          {latestBlogs.map((blog) => (
            <li key={blog.id} className="flex gap-3 items-center">
              <Link
                href={`/blogs/${blog.id}`}
                className="flex gap-3 items-center w-full hover:opacity-80 transition-opacity cursor-pointer"
              >
                {blog.featuredImageUrl ? (
                  <div className="relative w-16 h-10 flex-shrink-0">
                    <Image
                      src={blog.featuredImageUrl}
                      alt={blog.title}
                      fill
                      sizes="64px"
                      className="rounded object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-10 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm line-clamp-2">
                    {blog.title}
                  </div>
                  {blog.category && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {blog.category.title}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="bg-[#081550] p-10 space-y-3 rounded-lg mt-10">
        <h3 className="text-3xl text-white font-bold mb-4">Check Out Our All Templates</h3>
        <span className="block w-[150px] bg-gradient-to-r from-[#BDD9FE] to-[#8AACDA] rounded-lg p-[2px]">
          <Link
            href={"/template"}
            className="bg-gradient-to-r text-white from-[#0F59BC] to-[#0F35A7] w-[146px] h-full py-2 flex justify-center items-center rounded-lg cursor-pointer"
          >
            Explore Now
          </Link>
        </span>
      </div>
    </div>
  );
}
