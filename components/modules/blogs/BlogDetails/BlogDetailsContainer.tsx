"use client";
import React from "react";
import Image from "next/image";
import BlogSidebar from "./BlogSidebar/BlogSidebar";
import { useBlog } from "@/hooks/useBlogApi";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
                  blog.content.map((item: any, index: number) => (
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
          <div className="p-4 mt-10">
            <h3 className="text-lg font-bold">Leave a comment</h3>
            <p>
              Your email address will not be published. Required fields are
              marked *
            </p>
            <form className="flex flex-col gap-2 mt-4">
              <Textarea
                placeholder="Write your comment here..."
                className="bg-white border-none h-[100px]"
              />
              <Input placeholder="Full Name" className="bg-white border-none" />
              <Input placeholder="Email" className="bg-white border-none" />
              <Button className="w-[130px] py-5 cursor-pointer bg-blue-900 hover:bg-blue-900/80 text-white">
                Post Comment
              </Button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
}
