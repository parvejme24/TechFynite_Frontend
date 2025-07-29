"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FiEdit2, FiTrash2, FiMoreVertical } from "react-icons/fi";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaRegComment, FaRegHeart, FaHeart, FaClock, FaUser, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BlogCardProps {
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
  onEdit?: (blog: unknown) => void;
  onDelete?: (blog: unknown) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes || 0);
  const [isHovered, setIsHovered] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close actions menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        setShowActions(false);
      }
    }
    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActions]);

  // Format description
  const formatDescription = (description: string | string[] | undefined) => {
    if (!description) return "No description available";
    if (Array.isArray(description)) {
      return description.join(" ");
    }
    return description;
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle like toggle
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    toast.success(isLiked ? "Removed from likes" : "Added to likes");
  };

  // Handle edit
  const handleEdit = () => {
    setShowActions(false);
    if (onEdit) {
      onEdit(blog);
    }
  };

  // Handle delete
  const handleDelete = () => {
    setShowActions(false);
    if (onDelete) {
      onDelete(blog);
    }
  };

  // Handle view details
  const handleViewDetails = () => {
    router.push(`/blogs/${blog.id}`);
  };

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl dark:bg-[#1A1D37] border-0 shadow-lg ${
        isHovered ? 'ring-2 ring-blue-500' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <CardHeader className="p-0 relative">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={blog.imageUrl || "/placeholder-blog.jpg"}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-blog.jpg";
            }}
          />
          {/* Overlay on hover */}
          <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isHovered ? 'opacity-30' : 'opacity-0'
          }`} />
          
          {/* Category Badge */}
          {blog.category && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                {blog.category.title}
              </Badge>
            </div>
          )}

          {/* Reading Time Badge */}
          {blog.readingTime && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-white/90 text-gray-800">
                <FaClock className="w-3 h-3 mr-1" />
                {blog.readingTime} min read
              </Badge>
            </div>
          )}

          {/* Admin Actions Menu */}
          <div ref={actionsRef} className="absolute top-3 right-3 z-10">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2"
              onClick={() => setShowActions(!showActions)}
            >
              <FiMoreVertical className="w-4 h-4" />
            </Button>
            {showActions && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[120px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleEdit}
                >
                  <FiEdit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleDelete}
                >
                  <FiTrash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 transition-colors">
          {blog.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
          {formatDescription(blog.description)}
        </p>

        {/* Author and Date */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <FaUser className="w-3 h-3" />
            <span>{blog.author?.displayName || "Anonymous"}</span>
          </div>
          <span>{formatDate(blog.createdAt)}</span>
        </div>

        {/* Content Preview */}
        {blog.content && blog.content.length > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">Content sections:</span> {blog.content.length}
          </div>
        )}
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Like Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 transition-all duration-200 ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-500 hover:text-red-500'
              }`}
              onClick={handleLike}
            >
              {isLiked ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
              <span className="text-sm">{likeCount}</span>
            </Button>

            {/* Comments Button */}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <FaRegComment className="w-4 h-4" />
              <span className="text-sm">{blog.reviews?.length || 0}</span>
            </Button>
          </div>

          {/* View Details Button */}
          <Button
            onClick={handleViewDetails}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <FaEye className="w-4 h-4" />
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
