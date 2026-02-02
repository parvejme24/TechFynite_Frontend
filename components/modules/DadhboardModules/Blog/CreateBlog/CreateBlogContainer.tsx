"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FiUpload, FiX, FiSave, FiImage } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateBlog } from "@/hooks/useBlogApi";
import { useGetAllBlogCategoriesForStats } from "@/hooks/useBlogCategoryApi";
import { useAuth } from "@/hooks/useAuth";
import RichTextEditor from "./RichTextEditor";

export default function CreateBlogContainer() {
  const router = useRouter();
  const { user } = useAuth();
  const { mutateAsync: createBlog, isPending: isCreating } = useCreateBlog();
  const { data: categoriesData } = useGetAllBlogCategoriesForStats();

  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    description: "",
    readingTime: 5,
    slug: "",
    isPublished: false,
  });

  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
        .substring(0, 200);
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title]);


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublished: checked }));
  };

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFeaturedImage(file);
    }
  };

  const processFeaturedImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setFeaturedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    toast.success("Featured image selected!");
  };

  const handleFeaturedImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      processFeaturedImage(imageFiles[0]);
    } else {
      toast.error("Please drop only image files");
    }
  };

  const handleFeaturedImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFeaturedImage = () => {
    setFeaturedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Category is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      // Parse content HTML to JSON structure for backend
      const contentObject = {
        html: content,
        type: "rich-text",
        version: "1.0",
      };

      const blogData = {
        title: formData.title.trim(),
        categoryId: formData.categoryId,
        description: formData.description.trim(), // String field
        readingTime: Number(formData.readingTime),
        authorId: user.id,
        slug: formData.slug.trim() || undefined,
        isPublished: Boolean(formData.isPublished),
        content: contentObject, // JSON object
        featuredImage: featuredImage || undefined,
      };

      await createBlog(blogData);

      toast.success(
        formData.isPublished
          ? "Blog published successfully!"
          : "Draft saved successfully!"
      );
      router.push("/dashboard/blogs");
    } catch (error: any) {
      console.error("Create blog error:", error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create blog. Please try again."
      );
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim() || !formData.categoryId || !user?.id) {
      toast.error("Title and category are required for draft");
      return;
    }

    try {
      const contentObject = {
        html: content || "",
        type: "rich-text",
        version: "1.0",
      };

      const draftData = {
        title: formData.title.trim(),
        categoryId: formData.categoryId,
        description: formData.description.trim() || "",
        readingTime: Number(formData.readingTime),
        authorId: user.id,
        slug: formData.slug.trim() || undefined,
        isPublished: false,
        content: contentObject,
        featuredImage: featuredImage || undefined,
      };

      await createBlog(draftData);

      toast.success("Draft saved successfully!");
      router.push("/dashboard/blogs");
    } catch (error: any) {
      console.error("Save draft error:", error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save draft. Please try again."
      );
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Blog Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Write and publish your blog post
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <Card>
                <CardHeader>
                  <CardTitle>Blog Title</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter blog title"
                    required
                    className="cursor-text"
                  />
                </CardContent>
              </Card>

              {/* Slug */}
              <Card>
                <CardHeader>
                  <CardTitle>URL Slug</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="url-friendly-slug"
                    className="cursor-text font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-generated from title (editable)
                  </p>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter blog description (this will be displayed as a summary)"
                    rows={4}
                    required
                    className="cursor-text"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    A brief summary of your blog post
                  </p>
                </CardContent>
              </Card>

              {/* Content - Rich Text Editor */}
              <Card>
                <CardHeader>
                  <CardTitle>Blog Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichTextEditor content={content} onChange={setContent} />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Publish Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="isPublished" className="cursor-pointer">
                      Publish immediately
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      handleSelectChange("categoryId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesData?.data?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Reading Time */}
              <Card>
                <CardHeader>
                  <CardTitle>Reading Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    name="readingTime"
                    type="number"
                    value={formData.readingTime}
                    onChange={handleInputChange}
                    min="1"
                    max="60"
                    className="cursor-text"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Estimated reading time in minutes
                  </p>
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  {previewUrl ? (
                    <div className="space-y-3">
                      <div
                        className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-pointer"
                        onClick={() =>
                          document.getElementById("featured-image-upload")?.click()
                        }
                        onDrop={handleFeaturedImageDrop}
                        onDragOver={handleFeaturedImageDragOver}
                      >
                        <img
                          src={previewUrl}
                          alt="Featured Image Preview"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs">
                            Click to change or drag new image
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        <p>Recommended: 1200x630px (16:9 ratio)</p>
                        <p>Max size: 5MB</p>
                      </div>

                      <div className="flex gap-2">
                        <Label
                          htmlFor="featured-image-upload"
                          className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm inline-flex items-center justify-center gap-2"
                        >
                          <FiUpload className="w-4 h-4" />
                          Change Image
                        </Label>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeFeaturedImage}
                          className="cursor-pointer"
                        >
                          <FiX className="w-4 h-4" />
                        </Button>
                      </div>

                      <Input
                        id="featured-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFeaturedImageChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200 cursor-pointer"
                        onClick={() =>
                          document.getElementById("featured-image-upload")?.click()
                        }
                        onDrop={handleFeaturedImageDrop}
                        onDragOver={handleFeaturedImageDragOver}
                      >
                        <div className="space-y-3">
                          <FiImage className="w-12 h-12 mx-auto text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Upload Featured Image
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Drag & drop or click to browse
                            </p>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                            <p>Recommended: 1200x630px (16:9 ratio)</p>
                            <p>Supports: JPG, PNG, WebP</p>
                            <p>Max size: 5MB</p>
                          </div>
                        </div>
                      </div>

                      <Input
                        id="featured-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFeaturedImageChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      disabled={isCreating}
                      className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700"
                    >
                      <FiSave className="w-4 h-4 mr-2" />
                      {isCreating
                        ? "Creating..."
                        : formData.isPublished
                        ? "Publish Blog"
                        : "Save as Draft"}
                    </Button>

                    {!formData.isPublished && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSaveDraft}
                        disabled={isCreating}
                        className="w-full cursor-pointer"
                      >
                        <FiSave className="w-4 h-4 mr-2" />
                        Save Draft
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
