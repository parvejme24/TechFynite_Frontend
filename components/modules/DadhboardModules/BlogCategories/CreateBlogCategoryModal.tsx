"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiX, FiTag, FiImage, FiUpload } from "react-icons/fi";
import { toast } from "sonner";
import { useCreateBlogCategory } from "@/hooks/useBlogCategoryApi";

interface CreateBlogCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface BlogCategoryFormData {
  title: string;
  slug: string;
  imageUrl?: string;
}

export default function CreateBlogCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateBlogCategoryModalProps) {
  const [formData, setFormData] = useState<BlogCategoryFormData>({
    title: "",
    slug: "",
    imageUrl: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const createCategoryMutation = useCreateBlogCategory();

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSlugChange = (slug: string) => {
    setFormData(prev => ({
      ...prev,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, ""),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFormData(prev => ({ ...prev, imageUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const categoryData = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || undefined, // Backend will auto-generate if empty
        imageFile: selectedImage || undefined,
      };

      await createCategoryMutation.mutateAsync(categoryData);
      
      toast.success("Blog category created successfully!");
      onSuccess?.();
      onClose();
      
      // Reset form
      setFormData({
        title: "",
        slug: "",
        imageUrl: "",
      });
      setSelectedImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Create category error:", error);
      toast.error("Failed to create category. Please try again.");
    }
  };

  const handleClose = () => {
    if (!createCategoryMutation.isPending) {
      onClose();
      // Reset form when closing
      setFormData({
        title: "",
        slug: "",
        imageUrl: "",
      });
      setSelectedImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FiTag className="w-5 h-5" />
            Create Blog Category
          </DialogTitle>
          <DialogDescription>
            Add a new category to organize your blog posts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Category Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Technology, Lifestyle, Business"
              required
              disabled={createCategoryMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="e.g., technology, lifestyle, business"
              required
              disabled={createCategoryMutation.isPending}
            />
            <p className="text-xs text-gray-500">
              URL-friendly version of the title. Will be used in URLs.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Category Image (Optional)</Label>
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Category preview"
                  className="w-full h-32 object-contain rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="absolute top-2 right-2 cursor-pointer"
                >
                  <FiX className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <FiImage className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500 mb-2">Upload category image</p>
                <Label
                  htmlFor="category-image"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  <FiUpload className="w-4 h-4" />
                  Choose Image
                </Label>
                <Input
                  id="category-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createCategoryMutation.isPending}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCategoryMutation.isPending || !formData.title.trim() || !formData.slug.trim()}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
