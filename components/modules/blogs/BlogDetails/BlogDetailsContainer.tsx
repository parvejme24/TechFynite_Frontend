"use client";
import React from "react";
import Image from "next/image";
import BlogSidebar from "./BlogSidebar/BlogSidebar";
import { useBlog } from "@/hooks/useBlogApi";
import BlogReviewForm from "./BlogReviewForm/BlogReviewForm";

export default function BlogDetailsContainer({ id }: { id: string }) {
  const { data: blog, isLoading, error } = useBlog(id);

  if (isLoading)
    return (
      <div className="container mx-auto max-w-7xl px-4 lg:px-0">Loading...</div>
    );
  if (error)
    return <div className="text-red-500">{(error as Error).message}</div>;
  if (!blog) return <div>No blog found.</div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-14 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Blog Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1A1D37] rounded-lg">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              width={800}
              height={400}
              className="w-full h-[400px] object-cover rounded-lg mb-6 border"
            />
            <div className="p-5">
              <div>
                <h4 className="font-bold text-lg">{blog.category?.title}</h4>
                <h2 className="text-2xl">{blog.title}</h2>
                <p className="mt-2">{blog.description}</p>
              </div>

              {/* blog content */}
              <div>
                {blog.content && Array.isArray(blog.content) ? (
                  blog.content.map((item: unknown, index: number) => (
                    <div key={index}>{item}</div>
                  ))
                ) : (
                  <p>{blog.description}</p>
                )}
              </div>

              {/* blog comments */}
              <div></div>
            </div>
          </div>

          {/* comment form */}
          <BlogReviewForm />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
}
