"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useCreateBlog,
  useDeleteBlog,
  useGetBlogById,
  useUpdateBlog,
} from "@/hooks/useBlogApi";
import { useGetAllBlogCategoriesForStats } from "@/hooks/useBlogCategoryApi";
import { useAuth } from "@/hooks/useAuth";

// Import organized components
import BlogTitleSection from "./FormSections/BlogTitleSection";
import BlogSlugSection from "./FormSections/BlogSlugSection";
import BlogDescriptionSection from "./FormSections/BlogDescriptionSection";
import BlogContentSection from "./FormSections/BlogContentSection";
import PublishSettingsSection from "./Sidebar/PublishSettingsSection";
import CategorySection from "./Sidebar/CategorySection";
import ReadingTimeSection from "./Sidebar/ReadingTimeSection";
import FeaturedImageSection from "./Sidebar/FeaturedImageSection";
import ActionButtonsSection from "./Sidebar/ActionButtonsSection";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { BlogContent, generateHTML } from "./StructuredContentEditor";

interface EditBlogContainerProps {
  blogId?: string;
}

export default function EditBlogContainer({
  blogId,
}: EditBlogContainerProps = {}) {
  const router = useRouter();
  const { user } = useAuth();
  const { mutateAsync: createBlog, isPending: isCreating } = useCreateBlog();
  const { mutateAsync: updateBlog, isPending: isUpdating } = useUpdateBlog();
  const { mutateAsync: deleteBlog, isPending: isDeleting } = useDeleteBlog();
  const { data: categoriesData } = useGetAllBlogCategoriesForStats();

  // Fetch blog data for editing
  const {
    data: blogData,
    isLoading: isLoadingBlog,
    error: blogError,
  } = useGetBlogById(blogId || "");

  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    description: "",
    readingTime: 5,
    slug: "",
    isPublished: false,
  });

  const [content, setContent] = useState<BlogContent>({
    title: "",
    sections: [],
    metadata: {
      wordCount: 0,
      readingTime: 0,
      lastModified: new Date().toISOString(),
    },
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [descriptionArray, setDescriptionArray] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
        .substring(0, 200); // Ensure it doesn't exceed backend limit
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title]);

  // Convert description string to array
  useEffect(() => {
    if (formData.description) {
      const lines = formData.description
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      setDescriptionArray(lines);
    }
  }, [formData.description]);

  // Populate form when blog data is loaded (for editing)
  useEffect(() => {
    if (blogData?.data && blogId && categoriesData?.data) {
      const blog = blogData.data;


      // Update form data
      setFormData({
        title: blog.title || "",
        categoryId: blog.categoryId || "",
        description: Array.isArray(blog.description)
          ? blog.description.join("\n")
          : blog.description || "",
        readingTime: blog.readingTime || 5,
        slug: blog.slug || "",
        isPublished: blog.isPublished || false,
      });

      // Update content if it exists
      if (blog.content) {
        setContent(blog.content);
      }

      // Set description array
      if (Array.isArray(blog.description)) {
        setDescriptionArray(blog.description);
      }

      // Set image preview if blog has an image
      if (blog.imageUrl) {
        setPreviewUrl(blog.imageUrl);
        // Don't set selectedImage for existing images - only for new uploads
        setSelectedImage(null);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [blogData, blogId, categoriesData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
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
    toast.success("Featured image uploaded successfully!");
  };

  const handleFeaturedImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      processImageFile(imageFiles[0]); // Use first image for featured image
    } else {
      toast.error("Please drop only image files");
    }
  };

  const handleFeaturedImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setSelectedImage(null);
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

    // Description is optional according to backend schema
    // if (!formData.description.trim()) {
    //   toast.error("Description is required");
    //   return;
    // }

    // Content is optional according to backend schema, but we'll validate it for better UX
    if (!content.sections || content.sections.length === 0) {
      toast.error("Content is required");
      return;
    }

    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      // Generate HTML for dangerouslySetInnerHTML
      const generatedHTML = generateHTML(content);

      // Create a simplified content object for backend
      const contentObject = {
        title: formData.title.trim(),
        content: content,
        html: generatedHTML,
        type: "structured",
      };


      const blogData = {
        title: formData.title.trim(),
        categoryId: formData.categoryId,
        description: descriptionArray.length > 0 ? descriptionArray : undefined, // Optional field
        readingTime: Number(formData.readingTime), // Ensure it's a number
        authorId: user.id,
        slug: formData.slug.trim(),
        isPublished: Boolean(formData.isPublished), // Ensure it's a boolean
        content: content, // Send the BlogContent object directly
        image: selectedImage || undefined, // File for upload (only if new image selected)
        // For editing, always preserve existing image URL if no new image is selected
        ...(blogId && !selectedImage && previewUrl && { imageUrl: previewUrl }),
      };


      if (blogId) {
        // Update existing blog - filter out null values
        const updateData = { ...blogData };
        if (updateData.imageUrl === null) {
          delete updateData.imageUrl;
        }
        await updateBlog({ id: blogId, ...updateData });
        toast.success("Blog updated successfully!");
      } else {
        // Create new blog
      await createBlog(blogData);
      toast.success("Blog created successfully!");
      }

      router.push("/dashboard/blogs");
    } catch (error: any) {
      console.error("Create blog error:", error);
      toast.error(error?.message || "Failed to create blog. Please try again.");
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim() || !formData.categoryId || !user?.id) {
      toast.error("Title and category are required for draft");
      return;
    }

    try {
      // Generate HTML for dangerouslySetInnerHTML
      const generatedHTML = generateHTML(content);

      // Create a structured content object
      const contentObject = {
        title: formData.title.trim(),
        content: content || { sections: [], metadata: {} },
        html: generatedHTML,
        type: "structured",
      };


      const draftData = {
        title: formData.title.trim(),
        categoryId: formData.categoryId,
        description:
          descriptionArray.length > 0
            ? descriptionArray
            : [formData.description], // Will be JSON.stringify'd in the hook
        readingTime: Number(formData.readingTime), // Ensure it's a number
        authorId: user.id,
        slug: formData.slug.trim(),
        isPublished: false,
        content: content, // Will be JSON.stringify'd in the hook
        image: selectedImage || undefined, // File for upload
        // For editing, always preserve existing image URL if no new image is selected
        ...(blogId && !selectedImage && previewUrl && { imageUrl: previewUrl }),
      };


      if (blogId) {
        // Update existing blog as draft - filter out null values
        const updateDraftData = { ...draftData };
        if (updateDraftData.imageUrl === null) {
          delete updateDraftData.imageUrl;
        }
        await updateBlog({ id: blogId, ...updateDraftData });
        toast.success("Draft updated successfully!");
      } else {
        // Create new draft
      await createBlog(draftData);
      toast.success("Draft saved successfully!");
      }

      router.push("/dashboard/blogs");
    } catch (error: any) {
      console.error("Save draft error:", error);
      toast.error(error?.message || "Failed to save draft. Please try again.");
    }
  };

  const handleDeleteBlog = async () => {
    if (!blogId) {
      toast.info(
        "Delete functionality is only available when editing existing blogs"
      );
      setShowDeleteModal(false);
      return;
    }

    try {
      await deleteBlog(blogId);
      toast.success("Blog deleted successfully!");
      router.push("/dashboard/blogs");
    } catch (error: any) {
      console.error("Delete blog error:", error);
      toast.error(error?.message || "Failed to delete blog. Please try again.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Show loading state when fetching blog data
  if (blogId && isLoadingBlog) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading blog data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if blog fetch failed
  if (blogId && blogError) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Error Loading Blog
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Failed to load the blog data. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {blogId ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {blogId
              ? "Update your blog post"
              : "Write and publish your blog post"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <BlogTitleSection
                title={formData.title}
                onTitleChange={(title) =>
                  setFormData((prev) => ({ ...prev, title }))
                }
              />

              <BlogSlugSection
                slug={formData.slug}
                onSlugChange={(slug) =>
                  setFormData((prev) => ({ ...prev, slug }))
                }
              />

              <BlogDescriptionSection
                description={formData.description}
                onDescriptionChange={(description) =>
                  setFormData((prev) => ({ ...prev, description }))
                }
              />

              <BlogContentSection
                content={content}
                onContentChange={setContent}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <PublishSettingsSection
                isPublished={formData.isPublished}
                onPublishChange={(isPublished) =>
                  setFormData((prev) => ({ ...prev, isPublished }))
                }
              />

              <CategorySection
                categoryId={formData.categoryId}
                onCategoryChange={(categoryId) =>
                  setFormData((prev) => ({ ...prev, categoryId }))
                }
                categories={categoriesData?.data || []}
              />

              <ReadingTimeSection
                readingTime={formData.readingTime}
                onReadingTimeChange={(readingTime) =>
                  setFormData((prev) => ({ ...prev, readingTime }))
                }
              />

              <FeaturedImageSection
                selectedImage={selectedImage}
                previewUrl={previewUrl}
                onImageChange={handleImageChange}
                onImageDrop={handleFeaturedImageDrop}
                onImageDragOver={handleFeaturedImageDragOver}
                onRemoveImage={removeImage}
              />

              <ActionButtonsSection
                isCreating={isCreating || isUpdating}
                isPublished={formData.isPublished}
                onSubmit={handleSubmit}
                onSaveDraft={handleSaveDraft}
                onDelete={() => setShowDeleteModal(true)}
                isEditMode={!!blogId}
              />
            </div>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteBlog}
          blogTitle={formData.title || "Untitled Blog"}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
