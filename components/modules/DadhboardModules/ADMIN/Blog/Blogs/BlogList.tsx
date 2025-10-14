import React from "react";
import BlogCardSkeleton from "./BlogCardSkeleton";
import BlogCard from "./BlogCard";
import { IBlog } from "@/types/blog";
import Link from "next/link";
import { FiEdit3, FiPlus, FiBookOpen } from "react-icons/fi";

interface BlogListProps {
  blogs: IBlog[];
  onBlogClick?: (blog: IBlog) => void;
  onEdit?: (blog: IBlog) => void;
  onDelete?: (blog: IBlog) => void;
  loading?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
}

const BlogList: React.FC<BlogListProps> = ({
  blogs,
  onBlogClick,
  onEdit,
  onDelete,
  loading = false,
  canDelete = false,
  canEdit = true,
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
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-6">
            <FiBookOpen className="w-12 h-12 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <FiEdit3 className="w-4 h-4 text-yellow-800" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No blogs found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md">
          Start your blogging journey by creating your first blog post. Share your thoughts, ideas, and expertise with the world!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {blogs.map((blog) => (
        <div key={blog.id} onClick={() => onBlogClick?.(blog)}>
          <BlogCard
            blog={blog}
            onEdit={onEdit}
            onDelete={onDelete}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default BlogList;
