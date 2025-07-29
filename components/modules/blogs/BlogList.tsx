import React from "react";
import BlogCard from "./BlogCard";
import type { BlogCardProps } from "./BlogCard";
import BlogCardSkeleton from "./BlogCardSkeleton";

interface BlogListProps {
  blogs: Array<BlogCardProps['blog']>;
  onBlogClick?: (blog: BlogCardProps['blog']) => void;
  loading?: boolean;
}

const BlogList: React.FC<BlogListProps> = ({
  blogs,
  onBlogClick,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <BlogCardSkeleton key={index} delay={index * 100} />
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg">No blogs found.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          onClick={() => onBlogClick?.(blog)}
        />
      ))}
    </div>
  );
};

export default BlogList;
