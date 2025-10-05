"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateBlog } from "@/hooks/useBlogApi";
import { useGetAllBlogCategories as useGetCategories } from "@/hooks/useBlogCategoryApi";
import { useContext } from "react";
import { AuthContext } from "@/Providers/AuthProvider";
import { toast } from "sonner";
import { Loader2, Upload, X, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

// Validation schema
const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.array(z.string()).min(1, "At least one description paragraph is required"),
  readingTime: z.number().min(1, "Reading time must be at least 1 minute").max(480, "Reading time must be less than 8 hours"),
  content: z.array(z.object({
    heading: z.string().min(1, "Heading is required"),
    description: z.array(z.string()).min(1, "At least one description paragraph is required"),
    imageUrl: z.string().optional(),
    order: z.number(),
  })).optional(),
  slug: z.string().optional(),
  isPublished: z.boolean(),
});

type CreateBlogFormData = z.infer<typeof createBlogSchema>;

interface CreateBlogFormProps {
  onSuccess?: () => void;
}

export default function CreateBlogForm({ onSuccess }: CreateBlogFormProps) {
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { user } = useContext(AuthContext) || {};
  const createBlogMutation = useCreateBlog();
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategories();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateBlogFormData>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      description: [""],
      readingTime: 5,
      content: [],
      slug: "",
      isPublished: false,
    },
  });

  const { fields: descriptionFields, append: appendDescription, remove: removeDescription } = useFieldArray({
    control,
    name: "description",
  });

  const { fields: contentFields, append: appendContent, remove: removeContent } = useFieldArray({
    control,
    name: "content" as const,
  });

  const watchedTitle = watch("title");

  // Auto-generate slug from title
  React.useEffect(() => {
    if (watchedTitle) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug);
    }
  }, [watchedTitle, setValue]);

  // Handle main image file selection
  const handleMainImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setMainImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setMainImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove main image
  const removeMainImage = () => {
    setMainImageFile(null);
    setMainImagePreview(null);
  };

  // Upload image to base64 (in production, use Cloudinary)
  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          resolve(base64);
        };
        reader.readAsDataURL(file);
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Add content block
  const addContentBlock = () => {
    appendContent({
      heading: "",
      description: [""],
      imageUrl: "",
      order: contentFields.length,
    });
  };

  // Add description paragraph
  const addDescriptionParagraph = () => {
    appendDescription("");
  };

  const onSubmit = async (data: CreateBlogFormData) => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      let imageUrl: string | undefined;

      // Upload main image if file is selected
      if (mainImageFile) {
        imageUrl = await uploadImage(mainImageFile);
      }

      // Process content blocks - filter out empty blocks and ensure proper structure
      const processedContent = data.content
        ?.filter(block => block.heading.trim() !== "" || block.description[0]?.trim() !== "")
        .map((block, index) => ({
          heading: block.heading.trim(),
          description: [block.description[0]?.trim() || ""].filter(d => d !== ""),
          imageUrl: block.imageUrl?.trim() || undefined,
          order: index,
        }));

      // Prepare the blog data
      const blogData = {
        title: data.title.trim(),
        categoryId: data.categoryId,
        description: data.description.filter(d => d.trim() !== ""),
        readingTime: data.readingTime,
        authorId: user.id,
        slug: data.slug?.trim() || undefined,
        imageUrl,
        isPublished: data.isPublished,
        ...(processedContent && processedContent.length > 0 && { content: processedContent }),
      };

      console.log("Sending blog data:", blogData);

      await createBlogMutation.mutateAsync(blogData);

      // Reset form
      reset();
      setMainImageFile(null);
      setMainImagePreview(null);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Blog Post</CardTitle>
        <CardDescription>
          Write and publish a new blog post with rich content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Blog Title *</Label>
              <Input
                id="title"
                placeholder="Enter blog title"
                {...register("title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setValue("categoryId", value)}>
                <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="" disabled>Loading categories...</SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-500">{errors.categoryId.message}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="blog-post-slug"
                {...register("slug")}
              />
              <p className="text-xs text-gray-500">
                URL-friendly version of the title (auto-generated)
              </p>
            </div>

            {/* Reading Time */}
            <div className="space-y-2">
              <Label htmlFor="readingTime">Reading Time (minutes) *</Label>
              <Input
                id="readingTime"
                type="number"
                min="1"
                max="480"
                {...register("readingTime", { valueAsNumber: true })}
                className={errors.readingTime ? "border-red-500" : ""}
              />
              {errors.readingTime && (
                <p className="text-sm text-red-500">{errors.readingTime.message}</p>
              )}
            </div>

            {/* Main Image */}
            <div className="space-y-2">
              <Label htmlFor="mainImage">Featured Image</Label>
              <div className="space-y-4">
                {mainImagePreview && (
                  <div className="relative inline-block">
                    <Image
                      src={mainImagePreview}
                      alt="Blog preview"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={removeMainImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("main-image-upload")?.click()}
                    disabled={isUploading}
                    className="flex items-center space-x-2"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    <span>{isUploading ? "Uploading..." : "Upload Featured Image"}</span>
                  </Button>
                  <input
                    id="main-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Description</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDescriptionParagraph}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Paragraph</span>
              </Button>
            </div>

            {descriptionFields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Paragraph {index + 1}</Label>
                  {descriptionFields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDescription(index)}
                      className="flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Remove</span>
                    </Button>
                  )}
                </div>
                <Textarea
                  placeholder="Enter description paragraph"
                  {...register(`description.${index}`)}
                  rows={3}
                />
              </div>
            ))}
          </div>

          {/* Content Blocks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Content Blocks (Optional)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addContentBlock}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Content Block</span>
              </Button>
            </div>

            {contentFields.map((field, blockIndex) => (
              <Card key={field.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Content Block {blockIndex + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeContent(blockIndex)}
                      className="flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Remove Block</span>
                    </Button>
                  </div>

                  {/* Heading */}
                  <div className="space-y-2">
                    <Label>Heading</Label>
                    <Input
                      placeholder="Enter heading"
                      {...register(`content.${blockIndex}.heading`)}
                    />
                  </div>

                  {/* Description paragraphs */}
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Enter content description"
                      {...register(`content.${blockIndex}.description.0`)}
                      rows={4}
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    <Label>Image URL (Optional)</Label>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...register(`content.${blockIndex}.imageUrl`)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Publish Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Publish Settings</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublished"
                {...register("isPublished")}
              />
              <Label htmlFor="isPublished">Publish immediately</Label>
            </div>
            <p className="text-sm text-gray-500">
              If unchecked, the blog will be saved as a draft
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={createBlogMutation.isPending || isUploading}
          >
            {createBlogMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Blog Post...
              </>
            ) : (
              "Create Blog Post"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 