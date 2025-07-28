import React from "react";
import BlogCard from "./BlogCard";
import BlogCardSkeleton from "./BlogCardSkeleton";

interface BlogListProps {
  blogs: Array<any>;
  onBlogClick?: (blog: any) => void;
  onEdit?: (blog: any) => void;
  onDelete?: (blog: any) => void;
  loading?: boolean;
}

const BlogList: React.FC<BlogListProps> = ({
  blogs,
  onBlogClick,
  onEdit,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          onClick={() => onBlogClick?.(blog)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BlogList;
