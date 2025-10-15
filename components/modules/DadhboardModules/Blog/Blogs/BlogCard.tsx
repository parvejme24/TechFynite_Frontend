"use client";
import React, { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiClock,
  FiMessageCircle,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { IBlog } from "@/types/blog";

export interface BlogCardProps {
  blog: IBlog;
  onClick?: () => void;
  onEdit?: (blog: IBlog) => void;
  onDelete?: (blog: IBlog) => void;
  canDelete?: boolean;
  canEdit?: boolean;
}

import placeholderImage from "@/assets/common/placeholder.png";

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  onEdit,
  onDelete,
  canDelete = false,
  canEdit = true,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(blog.likes || 0);
  const router = useRouter();


  // Truncate text function
  const truncateText = (text: string, maxLength: number = 45) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const imageSrc = (blog.imageUrl as string) || (placeholderImage as any);
  const categoryTitle = blog.category?.title;
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
        onError={(e) => {
          // Image failed to load, will use placeholder
        }}
        onLoad={() => {
          // Image loaded successfully
        }}
      />

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          {categoryTitle ? (
            <span className="inline-block text-xs font-medium text-[#0F59BC] bg-[#E9F2FF] dark:bg-[#132955] dark:text-[#9CC2FF] px-2 py-1 rounded">
              {categoryTitle}
            </span>
          ) : (
            <span className="inline-block text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 px-2 py-1 rounded">
              No Category
            </span>
          )}

          {/* Three dots dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <FiMoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Blog Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {canEdit && onEdit && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(blog);
                  }}
                  className="cursor-pointer"
                >
                  <FiEdit className="mr-2 h-4 w-4" />
                  Edit Blog
                </DropdownMenuItem>
              )}
              {canDelete && onDelete && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(blog);
                  }}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <FiTrash2 className="mr-2 h-4 w-4" />
                  Delete Blog
                </DropdownMenuItem>
              )}
              {!canEdit && !canDelete && (
                <DropdownMenuItem disabled>
                  No actions available
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          className="mt-2 text-left text-lg font-semibold"
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
