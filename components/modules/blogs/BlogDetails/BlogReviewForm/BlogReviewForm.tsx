"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";
import { useCreateBlogReview } from "@/hooks/useBlogReviewApi";
import { useUserData } from "@/Provider/UserDataProvider";
import { toast } from "sonner";

interface BlogReviewFormProps {
  blogId: string;
}

export default function BlogReviewForm({ blogId }: BlogReviewFormProps) {
  const { user, loading } = useUserData();
  const [formData, setFormData] = useState({
    fullName: "",
    commentText: "",
    email: "",
  });

  const createReviewMutation = useCreateBlogReview();

  // Debug: Log user data changes
  console.log("UserDataProvider state:", { user, loading });

  // Auto-populate user data when component mounts or userData changes
  useEffect(() => {
    console.log("useEffect triggered with user:", user);
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.displayName || "",
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

    // Debug: Log user state and token
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    console.log("=== SUBMIT DEBUG ===");
    console.log("User state:", user);
    console.log("Form data:", formData);
    console.log("Access token exists:", !!token);
    console.log("Token value:", token ? token.substring(0, 20) + "..." : "null");
    console.log("Loading state:", loading);

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
      console.log("Attempting to submit comment...");
      const result = await createReviewMutation.mutateAsync({
        blogId,
        fullName: formData.fullName,
        email: formData.email,
        commentText: formData.commentText,
      });
      console.log("Comment submitted successfully:", result);

      // Reset form (but keep user data)
      setFormData({
        fullName: user?.displayName || "",
        commentText: "",
        email: user?.email || "",
      });

      toast.success("Comment posted successfully!");
    } catch (error: any) {
      console.error("=== ERROR DEBUG ===");
      console.error("Error submitting comment:", error);
      console.error("Error message:", error?.message);
      console.error("Error status:", error?.status);
      console.error("Full error object:", error);
      
      if (error?.message?.includes("401")) {
        toast.error("Please log in to post a comment");
      } else {
        toast.error(error?.message || "Failed to post comment. Please try again.");
      }
    }
  };

  // Check if all fields are filled
  const isFormValid = formData.fullName.trim() && 
                     formData.commentText.trim() && 
                     formData.email.trim();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="p-4 mt-10">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login message if user is not authenticated
  if (!user && !loading) {
    // Check if access token exists in localStorage as fallback
    const hasToken = typeof window !== "undefined" && localStorage.getItem("accessToken");
    console.log("No user data, but token exists:", hasToken);
    
    if (!hasToken) {
      return (
        <div className="p-4 mt-10">
          <div className="text-center py-8">
            <h3 className="text-lg font-bold mb-2">Leave a comment</h3>
            <p className="text-gray-600 mb-4">
              You need to be logged in to post a comment.
            </p>
            <Button 
              onClick={() => window.location.href = '/login'}
              className="bg-blue-900 hover:bg-blue-900/80 text-white"
            >
              Log In
            </Button>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="p-4 mt-10">
      <h3 className="text-lg font-bold">Leave a comment</h3>
      <p>
        Your email address will not be published. Required fields are marked *
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
        <Textarea
          name="commentText"
          value={formData.commentText}
          onChange={handleInputChange}
          placeholder="Write your comment here..."
          className="bg-white border-none h-[100px]"
          required
        />
        <Input
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Full Name *"
          className="bg-white border-none"
          required
          readOnly
        />
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email *"
          className="bg-white border-none"
          required
          readOnly
        />
        <Button
          type="submit"
          disabled={createReviewMutation.isPending || !isFormValid}
          className="w-[130px] py-5 cursor-pointer bg-blue-900 hover:bg-blue-900/80 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createReviewMutation.isPending ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </div>
  );
}
