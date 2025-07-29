"use client";
import React, { useState } from "react";

import Image from "next/image";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    imageUrl?: string | null;
    description?: string | string[];
    author?: { displayName: string; photoUrl?: string | null };
    category?: { title: string; imageUrl?: string };
    createdAt?: string;
    readingTime?: number;
    likes?: number;
    reviews?: unknown[];
    content?: unknown[];
  };
  onClick?: () => void;
}

import placeholderImage from "@/assets/common/placeholder.png";

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes || 0);
  const router = useRouter();

  // Truncate text function
  const truncateText = (text: string, maxLength: number = 45) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Handle like toggle
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    toast.success(isLiked ? "Removed from likes" : "Added to likes");
  };

  // Handle view details
  const handleViewDetails = () => {
    router.push(`/blogs/${blog.id}`);
  };

  return (
    <div className="bg-white dark:bg-[#1A1D37] rounded-lg shadow">
      <div className="p-0">
        <Image
          src={blog.imageUrl || placeholderImage}
          alt={blog.title}
          width={100}
          height={100}
          className="w-full h-[200px] object-cover rounded-lg"
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg">{blog.category?.title}</h3>
                  <button
            onClick={handleViewDetails}
            className="text-xl text-left hover:underline mt-1 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            title={blog.title}
          >
            {truncateText(blog.title)}
          </button>
        <div className="mt-8 flex justify-between items-center gap-2">
          <p>{blog.readingTime} min read</p>
          <button
            onClick={handleLike}
            className="flex items-center gap-2 hover:text-red-500 transition-colors duration-200 cursor-pointer"
          >
            {isLiked ? (
              <FaHeart className="w-4 h-4 text-red-500" />
            ) : (
              <FaRegHeart className="w-4 h-4" />
            )}
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
