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
import { FiUpload, FiX, FiFileText, FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateBlog } from "@/hooks/useBlogApi";
import { useGetAllBlogCategoriesForStats } from "@/hooks/useBlogCategoryApi";
import { useAuth } from "@/hooks/useAuth";

// Content structure for JSON storage
interface BlogContent {
  title?: string;
  sections?: ContentSection[];
  metadata?: {
    wordCount?: number;
    readingTime?: number;
    lastModified?: string;
  };
}

interface ContentSection {
  id: string;
  type: "heading" | "subheading" | "paragraph" | "image" | "list" | "numbered-list";
  content: string;
  items?: string[]; // For lists
  html?: string; // Generated HTML for dangerouslySetInnerHTML
}

// Generate HTML from content for dangerouslySetInnerHTML
const generateHTML = (content: BlogContent): string => {
  if (!content.sections) return "";
  
  return content.sections.map(section => {
    switch (section.type) {
      case "heading":
        return `<h1 class="text-3xl font-bold mb-4">${section.content}</h1>`;
      case "subheading":
        return `<h2 class="text-2xl font-semibold mb-3">${section.content}</h2>`;
      case "paragraph":
        return `<p class="mb-4">${section.content}</p>`;
      case "image":
        return `<img src="${section.content}" alt="Content image" class="w-full h-auto mb-4 rounded-lg" />`;
      case "list":
        return `<ul class="list-disc list-inside mb-4">${section.items?.map(item => `<li>${item}</li>`).join("")}</ul>`;
      case "numbered-list":
        return `<ol class="list-decimal list-inside mb-4">${section.items?.map(item => `<li>${item}</li>`).join("")}</ol>`;
      default:
        return "";
    }
  }).join("");
};

// Structured content editor component
const StructuredContentEditor = ({
  value,
  onChange,
}: {
  value: BlogContent;
  onChange: (value: BlogContent) => void;
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const addElement = (type: ContentSection["type"]) => {
    const newSection: ContentSection = {
      id: Date.now().toString(),
      type,
      content: "",
      items: type === "list" || type === "numbered-list" ? [""] : undefined,
    };
    
    const updatedContent: BlogContent = {
      ...value,
      sections: [...(value.sections || []), newSection],
      metadata: {
        ...value.metadata,
        lastModified: new Date().toISOString(),
      }
    };
    onChange(updatedContent);
  };

  const updateElement = (id: string, updates: Partial<ContentSection>) => {
    const updatedContent: BlogContent = {
      ...value,
      sections: value.sections?.map((section) => 
        section.id === id ? { ...section, ...updates } : section
      ) || [],
      metadata: {
        ...value.metadata,
        lastModified: new Date().toISOString(),
      }
    };
    onChange(updatedContent);
  };

  const removeElement = (id: string) => {
    const updatedContent: BlogContent = {
      ...value,
      sections: value.sections?.filter((section) => section.id !== id) || [],
      metadata: {
        ...value.metadata,
        lastModified: new Date().toISOString(),
      }
    };
    onChange(updatedContent);
  };

  const addListItem = (elementId: string) => {
    const updatedContent: BlogContent = {
      ...value,
      sections: value.sections?.map((section) =>
        section.id === elementId 
          ? { ...section, items: [...(section.items || []), ""] }
          : section
      ) || [],
      metadata: {
        ...value.metadata,
        lastModified: new Date().toISOString(),
      }
    };
    onChange(updatedContent);
  };

  const updateListItem = (
    elementId: string,
    itemIndex: number,
    content: string
  ) => {
    const updatedContent: BlogContent = {
      ...value,
      sections: value.sections?.map((section) =>
        section.id === elementId
          ? {
              ...section,
              items: section.items?.map((item, index) =>
                index === itemIndex ? content : item
              ),
            }
          : section
      ) || [],
      metadata: {
        ...value.metadata,
        lastModified: new Date().toISOString(),
      }
    };
    onChange(updatedContent);
  };

  const removeListItem = (elementId: string, itemIndex: number) => {
    const updatedContent: BlogContent = {
      ...value,
      sections: value.sections?.map((section) =>
        section.id === elementId
          ? {
              ...section,
              items: section.items?.filter((_, index) => index !== itemIndex),
            }
          : section
      ) || [],
      metadata: {
        ...value.metadata,
        lastModified: new Date().toISOString(),
      }
    };
    onChange(updatedContent);
  };

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const imageUrl = result.url;

        const newSection: ContentSection = {
          id: Date.now().toString(),
          type: "image",
          content: imageUrl,
        };
        
        const updatedContent: BlogContent = {
          ...value,
          sections: [...(value.sections || []), newSection],
          metadata: {
            ...value.metadata,
            lastModified: new Date().toISOString(),
          }
        };
        onChange(updatedContent);

        setUploadedImages((prev) => [...prev, imageUrl]);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          type="button"
          onClick={() => addElement("heading")}
          className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
          title="Add Heading"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => addElement("subheading")}
          className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
          title="Add Subheading"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => addElement("paragraph")}
          className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
          title="Add Paragraph"
        >
          📝 Paragraph
        </button>
        <button
          type="button"
          onClick={() => addElement("list")}
          className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
          title="Add List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => addElement("numbered-list")}
          className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
          title="Add Numbered List"
        >
          1. List
        </button>
        <div className="border-l border-gray-300 dark:border-gray-600 mx-1"></div>
        <Label
          htmlFor="content-image-upload"
          className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center gap-1"
          title="Upload Image"
        >
          <FiFileText className="w-4 h-4" />
          Image
        </Label>
        <Input
          id="content-image-upload"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
          }}
          className="hidden"
        />
      </div>

      {/* Content Elements */}
      <div className="p-4 space-y-4 min-h-[400px]">
        {!value.sections || value.sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <FiFileText className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">Click the buttons above to add content elements</p>
          </div>
        ) : (
          value.sections.map((section, index) => (
            <div
              key={section.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {section.type === "heading" && "Heading 1"}
                  {section.type === "subheading" && "Heading 2"}
                  {section.type === "paragraph" && "Paragraph"}
                  {section.type === "list" && "Bullet List"}
                  {section.type === "numbered-list" && "Numbered List"}
                  {section.type === "image" && "Image"}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeElement(section.id)}
                  className="text-red-600 hover:text-red-700 cursor-pointer"
                >
                  <FiX className="w-4 h-4" />
                </Button>
              </div>

              {section.type === "heading" && (
                <Input
                  value={section.content}
                  onChange={(e) =>
                    updateElement(section.id, { content: e.target.value })
                  }
                  placeholder="Enter heading text..."
                  className="text-xl font-bold"
                />
              )}

              {section.type === "subheading" && (
                <Input
                  value={section.content}
                  onChange={(e) =>
                    updateElement(section.id, { content: e.target.value })
                  }
                  placeholder="Enter subheading text..."
                  className="text-lg font-semibold"
                />
              )}

              {section.type === "paragraph" && (
                <Textarea
                  value={section.content}
                  onChange={(e) =>
                    updateElement(section.id, { content: e.target.value })
                  }
                  placeholder="Enter paragraph text..."
                  rows={3}
                />
              )}

              {section.type === "image" && (
                <div className="space-y-3">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <img
                      src={section.content}
                      alt="Content image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Input
                    value={section.content}
                    onChange={(e) =>
                      updateElement(section.id, { content: e.target.value })
                    }
                    placeholder="Image URL..."
                    className="text-sm"
                  />
                </div>
              )}

              {(section.type === "list" ||
                section.type === "numbered-list") && (
                <div className="space-y-2">
                  {section.items?.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 w-6">
                        {section.type === "list" ? "•" : `${itemIndex + 1}.`}
                      </span>
                      <Input
                        value={item}
                        onChange={(e) =>
                          updateListItem(section.id, itemIndex, e.target.value)
                        }
                        placeholder={`List item ${itemIndex + 1}...`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeListItem(section.id, itemIndex)}
                        className="text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        <FiX className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addListItem(section.id)}
                    className="cursor-pointer"
                  >
                    + Add Item
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

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

  const [content, setContent] = useState<BlogContent>({
    title: "",
    sections: [],
    metadata: {
      wordCount: 0,
      readingTime: 0,
      lastModified: new Date().toISOString(),
    }
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [descriptionArray, setDescriptionArray] = useState<string[]>([]);

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

      // Log all data being sent
      console.log("🚀 Publishing Blog - All Data:");
      console.log("📝 Form Data:", {
        title: formData.title.trim(),
        categoryId: formData.categoryId,
        description: formData.description,
        readingTime: formData.readingTime,
        slug: formData.slug.trim(),
        isPublished: formData.isPublished,
      });
      console.log("📄 Description Array:", descriptionArray);
      console.log("📋 Content JSON:", content);
      console.log("🖼️ Selected Image:", selectedImage ? {
        name: selectedImage.name,
        size: selectedImage.size,
        type: selectedImage.type
      } : "No image");
      console.log("👤 User ID:", user.id);
      console.log("📦 Content Object:", contentObject);
      console.log("🌐 Generated HTML:", generatedHTML);

      const blogData = {
        title: formData.title.trim(),
        categoryId: formData.categoryId,
        description: descriptionArray.length > 0 ? descriptionArray : undefined, // Optional field
        readingTime: Number(formData.readingTime), // Ensure it's a number
        authorId: user.id,
        slug: formData.slug.trim(),
        isPublished: Boolean(formData.isPublished), // Ensure it's a boolean
        content: content, // Send the BlogContent object directly
        image: selectedImage || undefined, // File for upload
      };

      console.log("📤 Final Blog Data Being Sent:", blogData);

      await createBlog(blogData);

      toast.success("Blog created successfully!");
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

      // Log all data being sent for draft
      console.log("💾 Saving Draft - All Data:");
      console.log("📝 Form Data:", {
        title: formData.title.trim(),
        categoryId: formData.categoryId,
        description: formData.description,
        readingTime: formData.readingTime,
        slug: formData.slug.trim(),
        isPublished: false,
      });
      console.log("📄 Description Array:", descriptionArray.length > 0 ? descriptionArray : [formData.description]);
      console.log("📋 Content JSON:", content);
      console.log("🖼️ Selected Image:", selectedImage ? {
        name: selectedImage.name,
        size: selectedImage.size,
        type: selectedImage.type
      } : "No image");
      console.log("👤 User ID:", user.id);
      console.log("📦 Content Object:", contentObject);
      console.log("🌐 Generated HTML:", generatedHTML);

      const draftData = {
        title: formData.title.trim(),
        categoryId: formData.categoryId,
        description: descriptionArray.length > 0
          ? descriptionArray
          : [formData.description], // Will be JSON.stringify'd in the hook
        readingTime: Number(formData.readingTime), // Ensure it's a number
        authorId: user.id,
        slug: formData.slug.trim(),
        isPublished: false,
        content: content, // Will be JSON.stringify'd in the hook
        image: selectedImage || undefined, // File for upload
      };

      console.log("📤 Final Draft Data Being Sent:", draftData);

      await createBlog(draftData);

      toast.success("Draft saved successfully!");
      router.push("/dashboard/blogs");
    } catch (error: any) {
      console.error("Save draft error:", error);
      toast.error(error?.message || "Failed to save draft. Please try again.");
    }
  };

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
                    placeholder="Enter blog description (each line will be a separate paragraph)"
                    rows={4}
                    required
                    className="cursor-text"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Each line will become a separate paragraph in the
                    description array
                  </p>
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Blog Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <StructuredContentEditor
                    value={content}
                    onChange={setContent}
                  />
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
                      {/* Image Preview with Perfect Aspect Ratio */}
                      <div
                        className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-pointer"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                        onDrop={handleFeaturedImageDrop}
                        onDragOver={handleFeaturedImageDragOver}
                      >
                        <img
                          src={previewUrl}
                          alt="Featured Image Preview"
                          className="w-full h-full object-contain"
                        />
                        {/* Overlay with image info */}
                        <div className="absolute inset-0 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs">
                            Click to change or drag new image
                          </div>
                        </div>
                      </div>

                      {/* Image Details */}
                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        <p>Recommended: 1200x630px (16:9 ratio)</p>
                        <p>Max size: 5MB</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Label
                          htmlFor="image-upload"
                          className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm inline-flex items-center justify-center gap-2"
                        >
                          <FiUpload className="w-4 h-4" />
                          Change Image
                        </Label>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeImage}
                          className="cursor-pointer"
                        >
                          <FiX className="w-4 h-4" />
                        </Button>
                      </div>

                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Upload Area */}
                      <div
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200 cursor-pointer"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                        onDrop={handleFeaturedImageDrop}
                        onDragOver={handleFeaturedImageDragOver}
                      >
                        <div className="space-y-3">
                          <FiFileText className="w-12 h-12 mx-auto text-gray-400" />
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
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
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
