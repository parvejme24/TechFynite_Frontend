"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";
import { AuthContext } from "@/Providers/AuthProvider";
import { useContext } from "react";
import { toast } from "sonner";

interface BlogReviewFormProps {
  blogId: string;
}

export default function BlogReviewForm({ blogId }: BlogReviewFormProps) {
  const { user, loading } = useContext(AuthContext) || {};
  const [formData, setFormData] = useState({
    fullName: "",
    commentText: "",
    email: "",
  });

  // No hook/API dependency

  console.log("AuthContext state:", { user, loading });

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

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    console.log("Form data:", formData);
    console.log("Access token exists:", !!token);
    console.log(
      "Token value:",
      token ? token.substring(0, 20) + "..." : "null"
    );
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

    // Simulate success (no API hook)
    setFormData({
      fullName: user?.fullName || "",
      commentText: "",
      email: user?.email || "",
    });
    toast.success("Comment posted successfully!");
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

  // Show login message if user is not authenticated
  if (!user && !loading) {
    // Check if access token exists in localStorage as fallback
    const hasToken =
      typeof window !== "undefined" && localStorage.getItem("accessToken");
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
              onClick={() => (window.location.href = "/login")}
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
          disabled={!isFormValid}
          className="w-[130px] py-5 cursor-pointer bg-blue-900 hover:bg-blue-900/80 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Post Comment
        </Button>
      </form>
    </div>
  );
}
