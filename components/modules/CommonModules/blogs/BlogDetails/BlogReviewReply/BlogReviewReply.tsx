"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useCreateBlogReviewReply } from "@/hooks/useBlogReviewApi";
import { AuthContext } from "@/Providers/AuthProvider";
import { useContext } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { BlogReviewReply as BlogReviewReplyType } from "@/types/blogReview";
import Image from "next/image";

// Simple date formatter
const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

interface BlogReviewReplyProps {
  reviewId: string;
  blogId?: string; // Add blogId prop for proper query invalidation
  replies?: BlogReviewReplyType[];
  onReplyAdded?: () => void;
  showButtonOnly?: boolean;
  showFormOnly?: boolean;
  onFormClose?: () => void;
}

export default function BlogReviewReply({ reviewId, blogId, replies = [], onReplyAdded, showButtonOnly = false, showFormOnly = false, onFormClose }: BlogReviewReplyProps) {
  const { user } = useContext(AuthContext) || {};
  const queryClient = useQueryClient();
  const createReplyMutation = useCreateBlogReviewReply();
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  // If showFormOnly is true, always show the form
  const isFormVisible = showFormOnly || showReplyForm;
  const [formData, setFormData] = useState({
    replyText: "",
    fullName: user?.fullName || "",
    email: user?.email || "",
  });

  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    if (!formData.fullName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      // Optimistically update the UI before API call
      const tempReplyId = `temp-${Date.now()}`;
      const newReply = {
        id: tempReplyId,
        reviewId,
        replyText: formData.replyText.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        userId: user?.id || null,
        photoUrl: (user as any)?.photoUrl || (user as any)?.avatarUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically add reply to cache if blogId is available
      if (blogId) {
        queryClient.setQueryData(['blog-reviews', blogId], (oldData: any) => {
          if (!oldData?.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((review: any) =>
              review.id === reviewId
                ? { ...review, replies: [...(review.replies || []), newReply] }
                : review
            ),
          };
        });
      }

      // Clear form immediately for better UX
      setFormData({
        replyText: "",
        fullName: user?.fullName || "",
        email: user?.email || "",
      });
      setShowReplyForm(false);
      if (onFormClose) {
        onFormClose();
      }
      
      // Make API call
      await createReplyMutation.mutateAsync({
        reviewId,
        blogId, // Pass blogId for proper query invalidation
        userId: user?.id,
        replyText: formData.replyText.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
      });

      toast.success("Reply posted successfully!");
      
      // Invalidate queries to refresh data with server response
      if (blogId) {
        queryClient.invalidateQueries({ queryKey: ['blog-reviews', blogId] });
      } else {
        // Fallback: invalidate all blog-reviews queries
        queryClient.invalidateQueries({ queryKey: ['blog-reviews'] });
      }
      onReplyAdded?.();
    } catch (error: any) {
      // Revert optimistic update on error
      if (blogId) {
        queryClient.invalidateQueries({ queryKey: ['blog-reviews', blogId] });
      }
      
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to post reply. Please try again.";
      console.error("Reply creation error:", error);
      toast.error(errorMessage);
    }
  };

  // If showButtonOnly is true, only show the button (for actions row)
  if (showButtonOnly) {
    return (
      <button
        onClick={() => setShowReplyForm(true)}
        className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition-colors cursor-pointer"
        title="Reply"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        Reply
      </button>
    );
  }

  return (
    <div>
      {/* Reply Button - Icon Only */}
      {!showReplyForm && !showFormOnly && (
        <button
          onClick={() => setShowReplyForm(true)}
          className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          title="Reply"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          Reply
        </button>
      )}

      {/* Existing Replies */}
      {replies && replies.length > 0 && (
        <div className="ml-12 mt-3 space-y-3">
          {replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-2">
              {reply.photoUrl ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={reply.photoUrl}
                    alt={reply.fullName || "Reply"}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-semibold flex-shrink-0 text-xs">
                  {(reply.fullName || "R").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="bg-gray-100 dark:bg-[#0B1026] rounded-2xl rounded-tl-sm px-3 py-1.5 inline-block max-w-full">
                  <div className="mb-0.5">
                    <span className="font-semibold text-xs text-gray-900 dark:text-white mr-2">
                      {reply.fullName || "Admin"}
                    </span>
                    {reply.createdAt && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(reply.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed break-words">
                    {reply.replyText}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {isFormVisible && (
        <div className="ml-12 mt-3">
          <div className="flex items-start gap-2 flex-row-reverse">
            {/* Avatar on the right side */}
            {(() => {
              const avatarUrl = (user as any)?.photoUrl || (user as any)?.avatarUrl || (user as any)?.profile?.avatarUrl || (user as any)?.image;
              if (avatarUrl) {
                return (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={avatarUrl}
                      alt={user?.fullName || "User"}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                );
              }
              if (user) {
                return (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0 text-xs">
                    {(user.fullName || "U").charAt(0).toUpperCase()}
                  </div>
                );
              }
              return (
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">?</span>
                </div>
              );
            })()}
            
            {/* Form content on the left */}
            <div className="flex-1">
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="bg-gray-100 dark:bg-[#0B1026] rounded-2xl rounded-tr-sm px-3 py-1.5">
                  <Textarea
                    name="replyText"
                    value={formData.replyText}
                    onChange={handleInputChange}
                    placeholder="Write a reply..."
                    className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[32px] max-h-[100px] text-xs text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    required
                    rows={1}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${Math.min(target.scrollHeight, 100)}px`;
                    }}
                  />
                </div>
                
                {!user && (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className="bg-gray-50 dark:bg-[#0B1026] border border-gray-200 dark:border-gray-700 text-xs h-8"
                      required
                    />
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email"
                      className="bg-gray-50 dark:bg-[#0B1026] border border-gray-200 dark:border-gray-700 text-xs h-8"
                      required
                    />
                  </div>
                )}
                
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowReplyForm(false);
                      setFormData({
                        replyText: "",
                        fullName: user?.fullName || "",
                        email: user?.email || "",
                      });
                      if (onFormClose) {
                        onFormClose();
                      }
                    }}
                    className="h-7 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!formData.replyText.trim() || createReplyMutation.isPending}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 h-7 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {createReplyMutation.isPending ? "Posting..." : "Reply"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
