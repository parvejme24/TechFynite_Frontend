"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBlog, useUpdateBlog } from "@/hooks/useBlogApi";
import { useGetAllBlogCategories as useBlogCategories, useCreateBlogCategory, useUpdateBlogCategory, useDeleteBlogCategory } from "@/hooks/useBlogCategoryApi";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaPlus, FaImage, FaTrash, FaSave, FaEdit, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EditBlogContainerProps {
  blogId: string;
}

export default function EditBlogContainer({ blogId }: EditBlogContainerProps) {
  const { data: categoriesResponse } = useBlogCategories();
  const categories = categoriesResponse?.categories || [];
  const { data: blog, isLoading: blogLoading, error: blogError } = useBlog(blogId);
  const { mutate: createCategory, isPending: createCategoryLoading } = useCreateBlogCategory();
  const { mutate: updateCategory, isPending: updateCategoryLoading } = useUpdateBlogCategory();
  const { mutate: deleteCategory, isPending: deleteCategoryLoading } = useDeleteBlogCategory();
  const { mutate: updateBlog, isPending: updateBlogLoading } = useUpdateBlog();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [contentBlocks, setContentBlocks] = useState([
    { heading: "", description: "", image: null as File | null, imagePreview: "" },
  ]);

  // Category management states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<unknown>(null);
  const [categoryForm, setCategoryForm] = useState({
    title: "",
    slug: "",
    imageFile: null as File | null,
    imagePreview: ""
  });

  // Load blog data when available
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setDescription("");
      setReadingTime(blog.readingTime?.toString() || "");
      setSelectedCategory(blog.category?.id || "");
      setMainImagePreview(blog.imageUrl || "");
      
      // Initialize with empty content blocks
      setContentBlocks([{ heading: "", description: "", image: null, imagePreview: "" }]);
    }
  }, [blog]);

  // Category image change handler
  const handleCategoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryForm(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCategoryForm(prev => ({ ...prev, imagePreview: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Category form submit handler
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryForm.title.trim()) {
      toast.error('Please enter a category title');
      return;
    }
    if (!categoryForm.slug.trim()) {
      toast.error('Please enter a category slug');
      return;
    }
    if (!categoryForm.imageFile && !editingCategory) {
      toast.error('Please select a category image');
      return;
    }

    const payload = {
      title: categoryForm.title.trim(),
      slug: categoryForm.slug.trim(),
      imageFile: categoryForm.imageFile || new File([], "placeholder.jpg")
    };

    if (editingCategory) {
      updateCategory({ id: (editingCategory as { id: string }).id, ...payload });
    } else {
      createCategory(payload);
    }

    // Reset form
    setCategoryForm({ title: "", slug: "", imageFile: null, imagePreview: "" });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  // Category management handlers
  const handleEditCategory = (category: unknown) => {
    setEditingCategory(category);
    setCategoryForm({
      title: (category as { title: string }).title,
      slug: (category as { slug: string }).slug,
      imageFile: null,
      imagePreview: (category as { imageUrl: string }).imageUrl || ""
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (category: unknown) => {
    deleteCategory((category as { id: string }).id);
  };

  const handleCancelCategoryForm = () => {
    setCategoryForm({ title: "", slug: "", imageFile: null, imagePreview: "" });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  // Main image change handler
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setMainImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
      toast.success(`Image "${file.name}" selected successfully!`);
    }
  };
  
  const handleRemoveMainImage = () => {
    setMainImage(null);
    setMainImagePreview("");
    toast.info('Main image removed');
  };

  // Content block handlers
  const handleContentChange = (idx: number, field: "heading" | "description", value: string) => {
    setContentBlocks((prev) =>
      prev.map((block, i) => (i === idx ? { ...block, [field]: value } : block))
    );
  };
  
  const handleContentImageChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setContentBlocks((prev) =>
          prev.map((block, i) =>
            i === idx ? { ...block, image: file, imagePreview: ev.target?.result as string } : block
          )
        );
      };
      reader.readAsDataURL(file);
      toast.success(`Content image "${file.name}" selected successfully!`);
    }
  };
  
  const handleRemoveContentImage = (idx: number) => {
    setContentBlocks((prev) =>
      prev.map((block, i) => (i === idx ? { ...block, image: null, imagePreview: "" } : block))
    );
    toast.info('Content image removed');
  };
  
  const addContentBlock = () => {
    setContentBlocks((prev) => [
      ...prev,
      { heading: "", description: "", image: null, imagePreview: "" },
    ]);
    toast.success('New content block added');
  };
  
  const removeContentBlock = (idx: number) => {
    setContentBlocks((prev) => prev.filter((_, i) => i !== idx));
    toast.info('Content block removed');
  };

  // Blog update handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      toast.error('Please enter a blog title');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a blog description');
      return;
    }
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }
    
    // Prepare content blocks
    const content = contentBlocks.map(({ heading, description, image }) => ({ 
      heading, 
      description, 
      image 
    }));
    
    // Prepare payload
    const payload: {
      title: string;
      description: string;
      categoryId: string;
      readingTime: number;
      content: { heading: string; description: string; image: File | null }[];
      image?: File;
    } = {
      title: title.trim(),
      description: description.trim(),
      categoryId: selectedCategory,
      readingTime: readingTime ? parseInt(readingTime) : 5,
      content,
    };

    // Add image if new one is selected
    if (mainImage) {
      payload.image = mainImage;
    }
    
    // Show loading toast
    toast.loading('Updating blog...');
    updateBlog({ id: blogId, ...payload }, {
      onSuccess: () => {
        router.push('/dashboard/blogs');
      }
    });
  };

  if (blogLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto max-w-4xl px-4 lg:px-0">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (blogError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto max-w-4xl px-4 lg:px-0">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">Error loading blog: {(blogError as Error).message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-4xl px-4 lg:px-0">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your blog content and settings
          </p>
        </div>

        {/* Category Management Card */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Category Management
              </CardTitle>
              <Button
                type="button"
                onClick={() => setShowCategoryForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showCategoryForm ? (
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category Title *
                    </Label>
                    <Input
                      type="text"
                      value={categoryForm.title}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter category title"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category Slug *
                    </Label>
                    <Input
                      type="text"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="Enter category slug"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category Image *
                  </Label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaImage className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleCategoryImageChange}
                      />
                    </label>
                  </div>
                  
                  {categoryForm.imagePreview && (
                    <div className="relative inline-block mt-2">
                      <Image
                        src={categoryForm.imagePreview}
                        alt="Category preview"
                        width={100}
                        height={100}
                        className="rounded object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                        onClick={() => setCategoryForm(prev => ({ ...prev, imageFile: null, imagePreview: "" }))}
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={createCategoryLoading || updateCategoryLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  >
                    {editingCategory ? 'Update Category' : 'Add Category'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelCategoryForm}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                {categories.map((category: { id: string; title: string; imageUrl?: string }) => (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {category.imageUrl && (
                        <Image
                          src={category.imageUrl}
                          alt={category.title}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">{category.title}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        <FaEdit className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category)}
                        className="text-red-600 hover:text-red-700 cursor-pointer"
                        disabled={deleteCategoryLoading}
                      >
                        <FaTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Blog Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title *
                </Label>
                <Input
                  type="text"
                  placeholder="Enter a compelling title for your blog..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description *
                </Label>
                <Textarea
                  placeholder="Write a compelling description that summarizes your blog..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px] resize-none"
                />
              </div>

              {/* Category and Reading Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category *
                  </Label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category: { id: string; title: string }) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reading Time (minutes)
                  </Label>
                  <Input
                    type="number"
                    placeholder="Estimated reading time"
                    value={readingTime}
                    onChange={e => setReadingTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Image Card */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Main Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaImage className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleMainImageChange}
                    />
                  </label>
                </div>
                
                {mainImagePreview && (
                  <div className="relative inline-block">
                    <Image
                      src={mainImagePreview}
                      alt="Main image preview"
                      width={300}
                      height={200}
                      className="rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 cursor-pointer"
                      onClick={handleRemoveMainImage}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Blocks */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Content Blocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {contentBlocks.map((block, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Block {index + 1}
                      </h3>
                      {contentBlocks.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContentBlock(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTrash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Heading
                        </Label>
                        <Input
                          type="text"
                          value={block.heading}
                          onChange={(e) => handleContentChange(index, "heading", e.target.value)}
                          placeholder="Enter block heading"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </Label>
                        <Textarea
                          value={block.description}
                          onChange={(e) => handleContentChange(index, "description", e.target.value)}
                          placeholder="Enter block description"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px] resize-none"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Image (Optional)
                        </Label>
                        <div className="mt-2">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FaImage className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400" />
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleContentImageChange(index, e)}
                            />
                          </label>
                        </div>
                        
                        {block.imagePreview && (
                          <div className="relative inline-block mt-2">
                            <Image
                              src={block.imagePreview}
                              alt="Content preview"
                              width={100}
                              height={100}
                              className="rounded object-cover"
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                              onClick={() => handleRemoveContentImage(index)}
                            >
                              <FaTimes className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addContentBlock}
                  className="w-full border-dashed border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FaPlus className="w-4 h-4 mr-2" />
                  Add Content Block
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={updateBlogLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {updateBlogLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  Update Blog
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 