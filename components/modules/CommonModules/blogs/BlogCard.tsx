"use client";
import React, { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiClock, FiMessageCircle } from "react-icons/fi";
import { toast } from "sonner";

export interface BlogCardProps {
  blog: {
    id: string | number;
    title: string;
    category: string;
    image?: string;
    description?: string | string[];
    readingTime?: number | string;
    likes?: number;
    comments?: unknown[];
  };
  onClick?: () => void;
}

import placeholderImage from "@/assets/common/placeholder.png";

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(blog.likes || 0);
  const router = useRouter();

  // Truncate text function
  const truncateText = (text: string, maxLength: number = 45) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const imageSrc = (blog.image as string) || (placeholderImage as any);
  const categoryTitle = blog.category;
  const snippet = Array.isArray(blog.description)
    ? blog.description[0] || ""
    : (blog.description as string) || "";

  // Handle view details
  const handleViewDetails = () => {
    router.push(`/blogs/${blog.id}`);
  };

  // Handle like toggle
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    toast.success(!isLiked ? "Added to likes" : "Removed from likes");
  };

  return (
    <div
      className="bg-white dark:bg-[#0B1026] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleViewDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleViewDetails();
      }}
    >
      <Image
        src={imageSrc}
        alt={blog.title}
        width={640}
        height={360}
        className="w-full h-60 object-cover"
      />

      <div className="p-5">
        {categoryTitle && (
          <span className="inline-block text-xs font-medium text-[#0F59BC] bg-[#E9F2FF] dark:bg-[#132955] dark:text-[#9CC2FF] px-2 py-1 rounded">
            {categoryTitle}
          </span>
        )}
        <div
          className="mt-2 text-left text- font-semibold"
          title={blog.title}
        >
          {truncateText(blog.title, 72)}
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1">
            <FiClock className="w-4 h-4" />
            {blog.readingTime ? `${blog.readingTime} min read` : ""}
          </span>
          <span className="inline-flex items-center gap-1">
            <FiMessageCircle className="w-4 h-4" />
            {blog.comments?.length ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
