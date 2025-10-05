"use client";
import React from "react";
import Image from "next/image";
import BlogSidebar from "./BlogSidebar/BlogSidebar";
import BlogReviewForm from "./BlogReviewForm/BlogReviewForm";
import BlogSidebarSkeleton from "./BlogSidebar/BlogSidebarSkeleton";
import BlogDetailsSkeleton from "./BlogDetailsSkeleton";

type BlogJson = {
  id: number | string;
  title: string;
  category?: string;
  image?: string;
  description?: string[] | string;
  content?: {
    title?: string;
    image?: string;
    subTitle?: string;
    description?: string[];
  };
  comments?: Array<{ id: number | string; name: string; comment: string; date?: string }>;
};

export default function BlogDetailsContainer({ id }: { id: string }) {
  const [blog, setBlog] = React.useState<BlogJson | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetch("/blogs.json")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const all = (await res.json()) as BlogJson[];
        if (!active) return;
        const found = (all || []).find((b) => String(b.id) === String(id)) || null;
        setBlog(found);
        setIsLoading(false);
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError((e as Error).message);
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (isLoading)
    return (
      <div className="container mx-auto max-w-7xl px-4 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Blog Content Skeleton */}
          <div className="lg:col-span-2">
            <BlogDetailsSkeleton />
          </div>
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <BlogSidebarSkeleton />
          </div>
        </div>
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;
  if (!blog) return <div>No blog found.</div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-14 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Blog Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1A1D37] rounded-lg">
            {blog.image && (
              <Image
                src={blog.image}
                alt={blog.title}
                width={800}
                height={400}
                className="w-full h-[400px] object-cover rounded-lg mb-6 border"
              />
            )}
            <div className="p-5">
              <div>
                {blog.category && <h4 className="font-bold text-lg">{blog.category}</h4>}
                <h2 className="text-2xl">{blog.title}</h2>
                {Array.isArray(blog.description) ? (
                  <div className="mt-2 space-y-3">
                    {blog.description.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2">{blog.description}</p>
                )}
              </div>

              {/* blog content */}
              <div>
                {blog.content ? (
                  <div className="mt-6">
                    {blog.content.title && (
                      <h4 className="font-bold text-xl mb-2">{blog.content.title}</h4>
                    )}
                    {blog.content.subTitle && (
                      <h5 className="font-semibold mb-2">{blog.content.subTitle}</h5>
                    )}
                    {blog.content.image && (
                      <Image
                        src={blog.content.image}
                        alt={blog.content.title || ''}
                        width={800}
                        height={400}
                        className="rounded-md my-2"
                      />
                    )}
                    {Array.isArray(blog.content.description) && (
                      <div className="space-y-3">
                        {blog.content.description.map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* blog comments */}
              <div></div>
            </div>
          </div>

          {/* comment form */}
          <BlogReviewForm blogId={id} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
}
