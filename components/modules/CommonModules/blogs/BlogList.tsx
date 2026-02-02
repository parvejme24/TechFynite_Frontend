import React from "react";
import BlogCard from "./BlogCard";
import BlogCardSkeleton from "./BlogCardSkeleton";
import { IBlog } from "@/types/blog";

interface BlogListProps {
  blogs: IBlog[];
  onBlogClick?: (blog: IBlog) => void;
  loading?: boolean;
}

const BlogList: React.FC<BlogListProps> = ({
  blogs,
  onBlogClick,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <BlogCardSkeleton key={index} delay={index * 100} />
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
          No blogs found.
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-sm text-center">
          Check back later for new blog posts!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {blogs.map((blog) => (
        <div key={blog.id} className="h-full">
          <BlogCard
            blog={blog}
            onClick={() => onBlogClick?.(blog)}
          />
        </div>
      ))}
    </div>
  );
};

export default BlogList;
