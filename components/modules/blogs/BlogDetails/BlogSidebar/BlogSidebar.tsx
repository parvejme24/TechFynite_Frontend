import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useBlogs } from "@/hooks/useBlogApi";

export default function BlogSidebar() {
  const { data: blogs = [], isLoading, error } = useBlogs();
  // Sort by createdAt descending and take the last 5
  const latestBlogs = [...blogs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Latest Blogs</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{(error as Error).message}</div>
      ) : latestBlogs.length === 0 ? (
        <div>No blogs found.</div>
      ) : (
        <ul className="space-y-4">
          {latestBlogs.map((blog) => (
            <li key={blog.id} className="flex gap-3 items-center">
              <Link href={`/dashboard/blogs/${blog.id}`} className="flex gap-3 items-center w-full">
                {blog.imageUrl && (
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    width={60}
                    height={40}
                    className="rounded object-cover w-16 h-10"
                  />
                )}
                <div>
                  <div className="font-medium text-sm line-clamp-2">{blog.title}</div>
                  {blog.category && (
                    <div className="text-xs text-gray-500">{blog.category.title}</div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
