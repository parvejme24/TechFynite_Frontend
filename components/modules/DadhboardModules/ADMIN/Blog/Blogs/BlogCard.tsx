"use client";
import React, { useState } from "react";

import Image from "next/image";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Blog } from "@/types/blog";

export interface BlogCardProps {
  blog: Blog;
  onClick?: () => void;
  onEdit?: (blog: Blog) => void;
  onDelete?: (blog: Blog) => void;
}

import placeholderImage from "@/assets/common/placeholder.png";

const BlogCard: React.FC<BlogCardProps> = ({ blog, onEdit, onDelete }) => {
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(blog);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(blog);
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
          <div className="flex items-center gap-3">
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
            
            {/* Edit Button */}
            {onEdit && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                title="Edit blog"
              >
                <FiEdit3 className="w-4 h-4" />
              </button>
            )}
            
            {/* Delete Button */}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                title="Delete blog"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
