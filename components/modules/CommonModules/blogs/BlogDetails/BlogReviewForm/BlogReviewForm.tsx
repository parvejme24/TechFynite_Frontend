"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";
import { AuthContext } from "@/Providers/AuthProvider";
import { useContext } from "react";
import { toast } from "sonner";
import { useCreateBlogReview } from "@/hooks/useBlogReviewApi";
import Image from "next/image";

interface BlogReviewFormProps {
  blogId: string;
}

export default function BlogReviewForm({ blogId }: BlogReviewFormProps) {
  const { user, loading } = useContext(AuthContext) || {};
  const createReviewMutation = useCreateBlogReview();
  const [formData, setFormData] = useState({
    fullName: "",
    commentText: "",
    email: "",
  });

  // Auto-populate user data when component mounts or userData changes
  useEffect(() => {
    console.log("useEffect triggered with user:", user);
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

    // Validation
    if (!formData.fullName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const result = await createReviewMutation.mutateAsync({
        blogId,
        userId: user?.id, // Optional - allow public reviews
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        commentText: formData.commentText.trim(),
        // Rating is optional, not sending it
      });

      // Reset form
      setFormData({
        fullName: user?.fullName || "",
        commentText: "",
        email: user?.email || "",
      });
      toast.success("Review posted successfully!");
    } catch (error: any) {
      console.error("Review creation error:", error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to post review. Please try again.";
      
      // Handle duplicate review error
      if (errorMessage.toLowerCase().includes("already reviewed") || 
          errorMessage.toLowerCase().includes("duplicate") ||
          errorMessage.toLowerCase().includes("already exists")) {
        toast.error("You have already reviewed this blog. You can only submit one review per blog.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Check if all fields are filled
  const isFormValid =
    formData.fullName.trim() &&
    formData.commentText.trim() &&
    formData.email.trim();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="p-4 mt-10">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
          <div className="mt-4 space-y-3">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
            <div className="h-20 w-full bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Allow public reviews - no need to require login

  return (
    <div className="mt-8 bg-white dark:bg-[#1A1D37] rounded-lg p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Comment Input - Facebook Style */}
        <div className="flex items-start gap-3">
          {/* User Avatar */}
          {(() => {
            const avatarUrl = (user as any)?.photoUrl || (user as any)?.avatarUrl || (user as any)?.profile?.avatarUrl || (user as any)?.image;
            if (avatarUrl) {
              return (
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={avatarUrl}
                    alt={user?.fullName || "User"}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              );
            }
            if (user) {
              return (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm">
                  {(user.fullName || "U").charAt(0).toUpperCase()}
                </div>
              );
            }
            return (
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 dark:text-gray-400 text-sm">?</span>
              </div>
            );
          })()}
          
          {/* Input Container */}
          <div className="flex-1">
            <div className="bg-gray-100 dark:bg-[#0B1026] rounded-2xl px-4 py-2">
              <Textarea
                name="commentText"
                value={formData.commentText}
                onChange={handleInputChange}
                placeholder="Write a comment..."
                className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[40px] max-h-[120px] text-sm text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                required
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
            </div>
            
            {/* Name and Email Fields (Hidden when logged in) */}
            {!user && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="bg-gray-50 dark:bg-[#0B1026] border border-gray-200 dark:border-gray-700 text-sm h-9"
                  required
                />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  className="bg-gray-50 dark:bg-[#0B1026] border border-gray-200 dark:border-gray-700 text-sm h-9"
                  required
                />
              </div>
            )}
            
            {/* Submit Button */}
            <div className="flex justify-end mt-2">
              <Button
                type="submit"
                disabled={!isFormValid || createReviewMutation.isPending}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 h-8 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createReviewMutation.isPending ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
