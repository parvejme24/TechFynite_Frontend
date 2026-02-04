"use client";
import React, { useContext, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import BlogSidebar from "./BlogSidebar/BlogSidebar";
import BlogReviewForm from "./BlogReviewForm/BlogReviewForm";
import BlogSidebarSkeleton from "./BlogSidebar/BlogSidebarSkeleton";
import BlogDetailsSkeleton from "./BlogDetailsSkeleton";
import BlogReviewSkeleton from "./BlogReviewSkeleton";
import { useGetBlogById } from "@/hooks/useBlogApi";
import { useGetBlogReviews } from "@/hooks/useBlogReviewApi";
import { IBlog } from "@/types/blog";
import { BlogReview } from "@/types/blogReview";
import BlogReactions from "./BlogReactions/BlogReactions";
import BlogReviewActions, { BlogReviewEditForm } from "./BlogReviewActions/BlogReviewActions";
import { LuAlarmClockCheck, LuCalendarDays } from "react-icons/lu";
import { FaRegEye, FaHeart } from "react-icons/fa6";
import { AuthContext } from "@/Providers/AuthProvider";
import { toast } from "sonner";
import { useUpdateBlogReview } from "@/hooks/useBlogReviewApi";

// Simple date formatter
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export default function BlogDetailsContainer({ id }: { id: string }) {
  const { user } = useContext(AuthContext) || {};
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useGetBlogById(id);
  const blog: IBlog | undefined = data?.data;
  const [editingReviews, setEditingReviews] = useState<Map<string, { commentText: string; fullName: string; email: string }>>(new Map());
  const updateReviewMutation = useUpdateBlogReview();
  
  // Fetch reviews separately using the blog review API
  
  // Fetch reviews separately using the blog review API
  const { data: reviewsData, isLoading: isLoadingReviews, error: reviewsError } = useGetBlogReviews(id, {
    page: 1,
    limit: 50,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  if (isLoading)
    return (
      <div className="container mx-auto max-w-7xl px-4 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Blog Content Skeleton */}
          <div className="lg:col-span-2">
            <BlogDetailsSkeleton />
          </div>
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <BlogSidebarSkeleton />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto max-w-7xl px-4 py-14 lg:px-0">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">
            Error loading blog: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );

  if (!blog)
    return (
      <div className="container mx-auto max-w-7xl px-4 py-14 lg:px-0">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">No blog found.</p>
        </div>
      </div>
    );

  // Parse content if it's a string, otherwise use as-is
  let parsedContent: any = null;
  let htmlContent: string | null = null;
  
  if (blog.content) {
    try {
      parsedContent = typeof blog.content === "string" ? JSON.parse(blog.content) : blog.content;
      
      // Check if content has HTML format (rich-text editor format)
      if (parsedContent && typeof parsedContent === "object") {
        if (parsedContent.html && parsedContent.type === "rich-text") {
          htmlContent = parsedContent.html;
        } else if (parsedContent.html) {
          // Fallback: if html exists but type is not specified
          htmlContent = parsedContent.html;
        }
      }
    } catch (e) {
      // If parsing fails, treat as plain text
      parsedContent = { description: blog.content };
    }
  }

  // Parse description if it's a string
  const descriptionParagraphs = blog.description
    ? typeof blog.description === "string"
      ? blog.description.split("\n").filter((p) => p.trim())
      : Array.isArray(blog.description)
      ? blog.description
      : [blog.description]
    : [];

  // Get reviews from API or fallback to blog data
  // Filter out hidden reviews for non-admin users
  const userRole = (user as any)?.role;
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";
  
  // Get reviews from API or fallback to blog data
  // Check if we have valid reviews data (not placeholder/loading state)
  const isPlaceholderData = reviewsData?.success === false && reviewsData?.message === 'Loading reviews...';
  const hasValidApiResponse = reviewsData && 
                              reviewsData.success !== false && 
                              reviewsData.data && 
                              Array.isArray(reviewsData.data);
  
  let allReviews: BlogReview[] = [];
  
  if (hasValidApiResponse) {
    // Use API data if available and valid (even if empty array)
    allReviews = reviewsData.data as BlogReview[];
  } else if (!isLoadingReviews && !isPlaceholderData && blog?.reviews && Array.isArray(blog.reviews) && blog.reviews.length > 0) {
    // Fallback to blog data only if not loading, not placeholder, and blog has reviews
    allReviews = blog.reviews as BlogReview[];
  } else if (!isLoadingReviews && !isPlaceholderData && blog?.comments && Array.isArray(blog.comments) && blog.comments.length > 0) {
    // Fallback to blog comments if available
    allReviews = blog.comments as BlogReview[];
  }
  
  const reviews: BlogReview[] = isAdmin 
    ? allReviews 
    : allReviews.filter((review) => !review.isHidden);
  
  // Determine if we should show "No reviews" message
  // Only show if: not loading, not placeholder data, and we've confirmed there are no reviews from API
  const shouldShowNoReviews = !isLoadingReviews && 
                               !isPlaceholderData && 
                               reviews.length === 0 && 
                               hasValidApiResponse;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-14 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Blog Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1A1D37] rounded-lg overflow-hidden">
            {/* Featured Image */}
            {blog.featuredImageUrl && (
              <div className="relative w-full h-[400px]">
                <Image
                  src={blog.featuredImageUrl}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="p-6 lg:p-8">
              {/* Category */}
              {blog.category && (
                <span className="inline-block text-sm font-semibold text-[#0F59BC] bg-[#E9F2FF] dark:bg-[#132955] dark:text-[#9CC2FF] px-3 py-1 rounded mb-4">
                  {blog.category.title}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{blog.title}</h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                {blog.author && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">By {blog.author.fullName}</span>
                  </div>
                )}
                {blog.readingTime && (
                  <div className="flex items-center gap-2">
                    <LuAlarmClockCheck className="w-4 h-4" />
                    <span>{blog.readingTime} min read</span>
                  </div>
                )}
                {blog.viewCount !== undefined && (
                  <div className="flex items-center gap-2">
                    <FaRegEye className="w-4 h-4" />
                    <span>{blog.viewCount} views</span>
                  </div>
                )}
                {blog.reactCount !== undefined && (
                  <div className="flex items-center gap-2">
                    <FaHeart className="w-4 h-4" />
                    <span>{blog.reactCount} reactions</span>
                  </div>
                )}
                {blog.createdAt && (
                  <div className="flex items-center gap-2">
                    <LuCalendarDays className="w-4 h-4" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {descriptionParagraphs.length > 0 && (
                <div className="mt-4 mb-6 space-y-3">
                  {descriptionParagraphs.map((p, idx) => (
                    <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {/* Blog Content (Rich Content) */}
              {htmlContent ? (
                // Render HTML content from rich-text editor
                <div
                  className="mt-8 blog-content"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              ) : parsedContent ? (
                <div className="mt-8 space-y-6">
                  {Array.isArray(parsedContent) ? (
                    // If content is an array of content blocks
                    parsedContent.map((block: any, idx: number) => (
                      <div key={idx} className="space-y-4">
                        {block.heading && (
                          <h3 className="text-2xl font-bold">{block.heading}</h3>
                        )}
                        {block.subHeading && (
                          <h4 className="text-xl font-semibold">{block.subHeading}</h4>
                        )}
                        {block.imageUrl && (
                          <div className="relative w-full h-[300px] lg:h-[400px] my-4">
                            <Image
                              src={block.imageUrl}
                              alt={block.heading || `Content image ${idx + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                              className="object-cover rounded-lg"
                            />
                          </div>
                        )}
                        {block.description && (
                          <div className="space-y-3">
                            {Array.isArray(block.description) ? (
                              block.description.map((p: string, pIdx: number) => (
                                <p key={pIdx} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {p}
                                </p>
                              ))
                            ) : (
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {block.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : parsedContent.description ? (
                    // If content has a description field
                    <div className="space-y-3">
                      {Array.isArray(parsedContent.description) ? (
                        parsedContent.description.map((p: string, idx: number) => (
                          <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {p}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {parsedContent.description}
                        </p>
                      )}
                    </div>
                  ) : (
                    // Fallback: render content as string
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {JSON.stringify(parsedContent)}
                    </div>
                  )}
                </div>
              ) : null}

              {/* Screenshots */}
              {blog.screenshots && blog.screenshots.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-xl font-bold">Screenshots</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blog.screenshots.map((screenshot, idx) => (
                      <div key={idx} className="relative w-full h-[250px]">
                        <Image
                          src={screenshot}
                          alt={`Screenshot ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Blog Reactions Section */}
          <div className="bg-white dark:bg-[#1A1D37] rounded-lg p-6 lg:p-8 mt-8">
            <BlogReactions blogId={id} reactCount={blog.reactCount || 0} />
          </div>

          {/* Blog Reviews/Comments Section */}
          {/* Show skeleton while loading */}
          {isLoadingReviews && <BlogReviewSkeleton count={3} />}
          
          {/* Show reviews when loaded */}
          {!isLoadingReviews && reviews.length > 0 && (
            <div className="bg-white dark:bg-[#1A1D37] rounded-lg p-6 lg:p-8 mt-8">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Comments ({reviews.length})
              </h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="flex items-start gap-3">
                    {/* Avatar */}
                    {review.photoUrl ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={review.photoUrl}
                          alt={review.fullName}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm">
                        {review.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      {/* Comment Bubble or Edit Form */}
                      {editingReviews.has(review.id) ? (
                        <BlogReviewEditForm
                          review={review}
                          editData={editingReviews.get(review.id) || { commentText: review.commentText, fullName: review.fullName, email: review.email }}
                          onEditDataChange={(data) => {
                            setEditingReviews((prev) => {
                              const newMap = new Map(prev);
                              newMap.set(review.id, {
                                commentText: data.commentText || review.commentText,
                                fullName: data.fullName || review.fullName,
                                email: data.email || review.email,
                              });
                              return newMap;
                            });
                          }}
                          onSave={async () => {
                            const editData = editingReviews.get(review.id);
                            if (!editData?.commentText?.trim()) {
                              toast.error("Comment cannot be empty");
                              return;
                            }
                            
                            // Start the mutation immediately to show "Saving..." state
                            try {
                              // Optimistically update the cache before API call
                              queryClient.setQueryData(['blog-reviews', id], (oldData: any) => {
                                if (!oldData?.data) return oldData;
                                return {
                                  ...oldData,
                                  data: oldData.data.map((r: BlogReview) =>
                                    r.id === review.id
                                      ? { ...r, commentText: editData.commentText || r.commentText, fullName: editData.fullName || r.fullName, email: editData.email || r.email }
                                      : r
                                  ),
                                };
                              });

                              // Don't close edit form immediately - let isSaving state handle the UI
                              // The form will show "Saving..." button state

                              await updateReviewMutation.mutateAsync({
                                reviewId: review.id,
                                data: {
                                  commentText: editData.commentText,
                                  fullName: editData.fullName,
                                  email: editData.email,
                                },
                              });
                              
                              // Close edit form after successful save
                              setEditingReviews((prev) => {
                                const newMap = new Map(prev);
                                newMap.delete(review.id);
                                return newMap;
                              });
                              
                              toast.success("Review updated successfully!");
                              
                              // Invalidate to sync with server (but UI already updated optimistically)
                              queryClient.invalidateQueries({ queryKey: ['blog-reviews', id], exact: false });
                            } catch (error: any) {
                              // Revert optimistic update on error
                              queryClient.invalidateQueries({ queryKey: ['blog-reviews', id], exact: false });
                              toast.error(error?.response?.data?.message || "Failed to update review");
                            }
                          }}
                          onCancel={() => {
                            setEditingReviews((prev) => {
                              const newMap = new Map(prev);
                              newMap.delete(review.id);
                              return newMap;
                            });
                          }}
                          isSaving={updateReviewMutation.isPending}
                        />
                      ) : (
                        <div className={`rounded-2xl rounded-tl-sm px-4 py-2 inline-block max-w-full ${
                          review.isHidden 
                            ? 'bg-gray-300 dark:bg-gray-700 opacity-60' 
                            : 'bg-gray-100 dark:bg-[#0B1026]'
                        }`}>
                          <div className="mb-1">
                            <span className={`font-semibold text-sm mr-2 ${
                              review.isHidden 
                                ? 'text-gray-500 dark:text-gray-400' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {review.fullName}
                            </span>
                            {review.createdAt && (
                              <span className={`text-xs ${
                                review.isHidden 
                                  ? 'text-gray-400 dark:text-gray-500' 
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {formatDate(review.createdAt)}
                              </span>
                            )}
                            {review.isHidden && isAdmin && (
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 italic">
                                (Hidden)
                              </span>
                            )}
                          </div>
                          <p className={`text-sm leading-relaxed break-words ${
                            review.isHidden 
                              ? 'text-gray-500 dark:text-gray-400' 
                              : 'text-gray-800 dark:text-gray-200'
                          }`}>
                            {review.commentText}
                          </p>
                        </div>
                      )}
                      
                      {/* Actions Row */}
                      <div className="flex items-center gap-4 mt-1 ml-1">
                        {/* Review Actions (Edit/Delete/Hide) */}
                        {user && (
                          <BlogReviewActions 
                            review={review}
                            blogId={id}
                            isEditing={editingReviews.has(review.id)}
                            onEditStart={() => {
                              setEditingReviews((prev) => {
                                const newMap = new Map(prev);
                                newMap.set(review.id, {
                                  commentText: review.commentText,
                                  fullName: review.fullName,
                                  email: review.email,
                                });
                                return newMap;
                              });
                            }}
                            onEditCancel={() => {
                              setEditingReviews((prev) => {
                                const newMap = new Map(prev);
                                newMap.delete(review.id);
                                return newMap;
                              });
                            }}
                            onUpdated={() => {
                              queryClient.invalidateQueries({ queryKey: ['blog-reviews', id], exact: false });
                            }}
                            onDeleted={() => {
                              queryClient.invalidateQueries({ queryKey: ['blog-reviews', id], exact: false });
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show message if no reviews (only when we've confirmed there are truly no reviews) */}
          {shouldShowNoReviews && (
            <div className="bg-white dark:bg-[#1A1D37] rounded-lg p-6 lg:p-8 mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review!</p>
            </div>
          )}

          {/* Comment Form */}
          <BlogReviewForm blogId={id} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
}
