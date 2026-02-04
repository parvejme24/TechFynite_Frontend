"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiClock, FiMessageCircle } from "react-icons/fi";
import { IBlog } from "@/types/blog";
import placeholderImage from "@/assets/common/placeholder.png";

export interface BlogCardProps {
  blog: IBlog;
  onClick?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onClick }) => {
  const router = useRouter();

  // Truncate text function
  const truncateText = (text: string, maxLength: number = 72) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const imageSrc = blog.featuredImageUrl || (placeholderImage as any);
  const categoryTitle = blog.category?.title || "";
  const description = typeof blog.description === 'string' 
    ? blog.description 
    : Array.isArray(blog.description)
    ? blog.description[0] || ""
    : "";

  // Handle view details
  const handleViewDetails = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/blogs/${blog.id}`);
    }
  };

  return (
    <div
      className="bg-white dark:bg-[#0B1026] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
      onClick={handleViewDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleViewDetails();
      }}
    >
      <div className="w-full h-48 flex-shrink-0 overflow-hidden">
        <Image
          src={imageSrc}
          alt={blog.title}
          width={640}
          height={360}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Image failed to load, will use placeholder
          }}
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {categoryTitle && (
          <span className="inline-block w-fit self-start text-xs font-medium text-[#0F59BC] bg-[#E9F2FF] dark:bg-[#132955] dark:text-[#9CC2FF] px-2 py-1 rounded mb-2 flex-shrink-0">
            {categoryTitle}
          </span>
        )}
        
        <Link
          href={`/blogs/${blog.id}`}
          className="mt-2 text-left text-lg font-semibold line-clamp-2 hover:text-[#0F59BC] dark:hover:text-[#9CC2FF] hover:underline cursor-pointer transition-colors"
          title={blog.title}
          onClick={(e) => {
            // Stop propagation to prevent card click
            e.stopPropagation();
          }}
        >
          {truncateText(blog.title, 72)}
        </Link>

        {description && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 flex-grow">
            {description.length > 75 ? description.slice(0, 75) + "......" : description}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
          <span className="inline-flex items-center gap-1">
            <FiClock className="w-4 h-4" />
            {blog.readingTime ? `${blog.readingTime} min read` : ""}
          </span>
          <span className="inline-flex items-center gap-1">
            <FiMessageCircle className="w-4 h-4" />
            {blog.comments?.length ?? blog.reviews?.length ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
