"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { FaRegComment, FaRegHeart, FaHeart, FaClock, FaUser, FaCalendar, FaEye, FaShare, FaBookmark } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useBlog } from "@/hooks/useBlogApi";
import { toast } from "sonner";
import Link from "next/link";

export default function BlogDetailsContainer({ id }: { id: string }) {
  const { data: blog, isLoading, error } = useBlog(id);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog?.likes || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comment, setComment] = useState("");

  if (isLoading) return (
    <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-96 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-8">
      <div className="text-red-500 text-center">{(error as Error).message}</div>
    </div>
  );
  
  if (!blog) return (
    <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-8">
      <div className="text-center">No blog found.</div>
    </div>
  );

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
      month: "long",
      day: "numeric",
    });
  };

  // Handle like toggle
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    toast.success(isLiked ? "Removed from likes" : "Added to likes");
  };

  // Handle bookmark toggle
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: formatDescription(blog.description),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Handle comment submit
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    toast.success("Comment submitted successfully!");
    setComment("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/blogs">
          <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <IoArrowBack className="w-4 h-4" />
            Back to Blogs
          </Button>
        </Link>
      </div>

      {/* Main Blog Card */}
      <div className="bg-white dark:bg-[#1A1D37] rounded-xl shadow-lg overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-96 overflow-hidden">
          <Image
            src={blog.imageUrl || "/placeholder-blog.jpg"}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Content on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            {/* Category Badge */}
            {blog.category && (
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0 mb-4">
                {blog.category.title}
              </Badge>
            )}
            
            {/* Title */}
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {blog.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex items-center gap-6 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <FaUser className="w-4 h-4" />
                <span>{blog.author?.displayName || "Anonymous"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar className="w-4 h-4" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
              {blog.readingTime && (
                <div className="flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  <span>{blog.readingTime} min read</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="p-8">
          {/* Description */}
          <div className="mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {formatDescription(blog.description)}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 transition-all duration-200 ${
                  isLiked 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-600 hover:text-red-500'
                }`}
                onClick={handleLike}
              >
                {isLiked ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                <span>{likeCount} likes</span>
              </Button>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FaRegComment className="w-4 h-4" />
                <span>{blog.reviews?.length || 0} comments</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                onClick={handleShare}
              >
                <FaShare className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 transition-all duration-200 ${
                  isBookmarked 
                    ? 'text-yellow-500 hover:text-yellow-600' 
                    : 'text-gray-600 hover:text-yellow-500'
                }`}
                onClick={handleBookmark}
              >
                <FaBookmark className="w-4 h-4" />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>

          {/* Content Sections */}
          {blog.content && blog.content.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Content Sections
              </h2>
              
              {blog.content.map((item: any, index: number) => (
                <div key={item.id || index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {item.heading}
                    </h3>
                  </div>

                  {/* Section Description */}
                  <div className="mb-4">
                    {Array.isArray(item.description) ? (
                      item.description.map((desc: string, descIndex: number) => (
                        <p key={descIndex} className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                          {desc}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Section Image */}
                  {item.imageUrl && (
                    <div className="mt-6">
                      <Image
                        src={item.imageUrl}
                        alt={item.heading}
                        width={800}
                        height={400}
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8 bg-white dark:bg-[#1A1D37] rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Comments ({blog.reviews?.length || 0})
        </h3>
        
        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-8">
          <Textarea
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-4 min-h-[100px] resize-none"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Post Comment
          </Button>
        </form>
        
        {/* Comments List */}
        {blog.reviews && blog.reviews.length > 0 ? (
          <div className="space-y-4">
            {blog.reviews.map((review: any, index: number) => (
              <div key={review.id || index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <FaUser className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {review.userName || review.author?.displayName || "Anonymous"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(review.commentDate || review.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 ml-11">
                  {review.commentText || review.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FaRegComment className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}
