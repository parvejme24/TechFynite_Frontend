"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FiFileText,
  FiDollarSign,
  FiTag,
  FiLink,
  FiCamera,
  FiEdit3,
  FiImage,
  FiX,
  FiPlus,
  FiEdit,
} from "react-icons/fi";
import Image from "next/image";

interface KeyFeature {
  feature: string;
  featureDescription: string;
}

interface TemplateFormData {
  title: string;
  price: number;
  categoryId: string;
  version: number;
  previewLink: string;
  sourceFiles: string[];
  shortDescription: string;
  description: string[];
  whatsIncluded: string[];
  keyFeatures: KeyFeature[];
  screenshots: File[];
  coverImage: File | null;
}

type Category = {
  id: string;
  title: string;
  imageUrl?: string;
  slug?: string;
};

interface BasicInformationCardProps {
  formData: TemplateFormData;
  categories: Category[];
  onInputChange: (field: keyof TemplateFormData, value: unknown) => void;
  onCoverImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowCoverPreview: (show: boolean) => void;
  onCreateCategory: (categoryData: { title: string; slug: string; imageFile?: File | null }) => void;
  onUpdateCategory: (id: string, categoryData: { title: string; slug: string; imageFile?: File | null }) => void;
  onDeleteCategory: (id: string) => void;
  isCreatingCategory: boolean;
  isUpdatingCategory: boolean;
  isDeletingCategory: boolean;
}

export default function BasicInformationCard({
  formData,
  categories,
  onInputChange,
  onCoverImageChange,
  setShowCoverPreview,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  isCreatingCategory,
  isUpdatingCategory,
  isDeletingCategory,
}: BasicInformationCardProps) {
  // Helper function to get proper image URL
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return null;
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // If it's a relative path starting with /uploads, use the base URL without /api/v1
    if (imageUrl.startsWith('/uploads/')) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
      // Remove /api/v1 from the base URL for uploads
      const uploadBaseUrl = baseUrl.replace('/api/v1', '');
      return `${uploadBaseUrl}${imageUrl}`;
    }
    // For other relative paths, prepend the full base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
    return `${baseUrl}${imageUrl}`;
  };

  // Debug: Log categories to see what we're getting
  console.log("Categories received:", categories);
  console.log("Categories with images:", categories?.filter((cat: Category) => cat.imageUrl));
  console.log("Full category data:", categories?.map((cat: Category) => ({
    id: cat.id,
    title: cat.title,
    imageUrl: cat.imageUrl,
    processedImageUrl: cat.imageUrl ? getImageUrl(cat.imageUrl) : null,
    slug: cat.slug
  })));
  
  // Debug: Log selected category
  const selectedCategory = categories.find((cat) => cat.id === formData.categoryId);
  if (selectedCategory) {
    console.log("Selected category:", {
      id: selectedCategory.id,
      title: selectedCategory.title,
      imageUrl: selectedCategory.imageUrl,
      processedImageUrl: getImageUrl(selectedCategory.imageUrl || "")
    });
  }
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);

  const handleCreateCategory = async () => {
    if (newCategoryTitle.trim() && newCategorySlug.trim()) {
      try {
        await onCreateCategory({
          title: newCategoryTitle.trim(),
          slug: newCategorySlug.trim(),
          imageFile: newCategoryImage,
        });
        setNewCategoryTitle("");
        setNewCategorySlug("");
        setNewCategoryImage(null);
        setShowCategoryModal(false);
      } catch (error) {
        console.error("Error in handleCreateCategory:", error);
        // Error handling is done in the parent component
      }
    }
  };

  const handleUpdateCategory = async () => {
    if (editingCategory && newCategoryTitle.trim() && newCategorySlug.trim()) {
      try {
        await onUpdateCategory(editingCategory.id, {
          title: newCategoryTitle.trim(),
          slug: newCategorySlug.trim(),
          imageFile: newCategoryImage,
        });
        setNewCategoryTitle("");
        setNewCategorySlug("");
        setNewCategoryImage(null);
        setEditingCategory(null);
        setShowCategoryModal(false);
      } catch (error) {
        console.error("Error in handleUpdateCategory:", error);
        // Error handling is done in the parent component
      }
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryTitle(category.title);
    setNewCategorySlug(category.slug || "");
    setNewCategoryImage(null); // Reset new image selection
    setShowCategoryModal(true);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setNewCategoryTitle("");
    setNewCategorySlug("");
    setNewCategoryImage(null);
    setShowCategoryModal(true);
  };

  const handleCategoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewCategoryImage(file);
    }
  };
  return (
    <>
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiFileText className="w-5 h-5 text-gray-600" />
          Basic Information
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Essential details about your template
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <FiFileText className="w-4 h-4 text-gray-500" />
              Template Title *
            </Label>
            <div className="relative">
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => onInputChange("title", e.target.value)}
                placeholder="Enter template title"
                required
                className="pl-10 border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
              />
              <FiFileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="price"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <FiDollarSign className="w-4 h-4 text-gray-500" />
              Price ($) *
            </Label>
            <div className="relative">
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  onInputChange("price", parseFloat(e.target.value) || 0)
                }
                placeholder="0.00"
                required
                className="pl-10 border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
              />
              <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
             <Label
               htmlFor="category"
               className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
             >
               <FiTag className="w-4 h-4 text-gray-500" />
               Category *
             </Label>
             <div className="space-y-2">
                               <Select
                  value={formData.categoryId}
                  onValueChange={(value) => onInputChange("categoryId", value)}
                >
                  <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500">
                    <SelectValue placeholder="Select a category">
                      {(() => {
                        const selectedCategory = categories.find((cat) => cat.id === formData.categoryId);
                        return selectedCategory ? (
                          <div className="flex items-center gap-3">
                                                         {selectedCategory && selectedCategory.imageUrl && (
                               <div className="relative w-5 h-5 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                                 <Image
                                   src={getImageUrl(selectedCategory.imageUrl) || selectedCategory.imageUrl}
                                   alt={selectedCategory.title}
                                   fill
                                   className="object-cover"
                                   onError={(e) => {
                                     console.error("Failed to load selected image:", selectedCategory.imageUrl);
                                     e.currentTarget.style.display = 'none';
                                   }}
                                 />
                               </div>
                             )}
                            <span>{selectedCategory?.title}</span>
                          </div>
                        ) : null;
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                                   <SelectContent>
                    {categories && categories.length > 0 ? (
                      categories.map((category: Category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-3">
                                                         {category.imageUrl && (
                               <div className="relative w-6 h-6 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                                 <Image
                                   src={getImageUrl(category.imageUrl) || category.imageUrl}
                                   alt={category.title}
                                   fill
                                   className="object-cover"
                                   onError={(e) => {
                                     console.error("Failed to load image:", category.imageUrl);
                                     e.currentTarget.style.display = 'none';
                                   }}
                                 />
                               </div>
                             )}
                            <span className="font-medium">{category.title}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1 text-sm text-gray-500">
                        No categories available
                      </div>
                    )}
                  </SelectContent>
               </Select>
                               <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openCreateModal}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Create New Category
                  </Button>
                  {formData.categoryId && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const selectedCategory = categories.find((cat) => cat.id === formData.categoryId);
                          if (selectedCategory) {
                            openEditModal(selectedCategory);
                          }
                        }}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <FiEdit className="w-4 h-4" />
                      </Button>
                                             <Button
                         type="button"
                         variant="outline"
                         size="sm"
                         onClick={async () => {
                           const selectedCategory = categories.find((cat) => cat.id === formData.categoryId);
                           const categoryName = selectedCategory?.title || 'this category';
                           if (confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
                             try {
                               console.log("Deleting category:", selectedCategory);
                               if (selectedCategory) {
                                 await onDeleteCategory(selectedCategory.id);
                               }
                             } catch (error) {
                               console.error("Error deleting category:", error);
                             }
                           }
                         }}
                         disabled={isDeletingCategory}
                         className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer disabled:opacity-50"
                       >
                         <FiX className="w-4 h-4" />
                       </Button>
                    </>
                  )}
                </div>
             </div>
           </div>
          <div className="space-y-2">
            <Label
              htmlFor="version"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <FiTag className="w-4 h-4 text-gray-500" />
              Version *
            </Label>
            <div className="relative">
              <Input
                id="version"
                type="number"
                step="0.1"
                min="1"
                value={formData.version}
                onChange={(e) =>
                  onInputChange("version", parseFloat(e.target.value) || 1)
                }
                placeholder="1.0"
                required
                className="pl-10 border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
              />
              <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="previewLink"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <FiLink className="w-4 h-4 text-gray-500" />
              Preview Link
            </Label>
            <div className="relative">
              <Input
                id="previewLink"
                type="url"
                value={formData.previewLink}
                onChange={(e) => onInputChange("previewLink", e.target.value)}
                placeholder="https://example.com/preview"
                className="pl-10 border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
              />
              <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="coverImage"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <FiCamera className="w-4 h-4 text-gray-500" />
              Cover Image
            </Label>
            <div className="space-y-3">
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={onCoverImageChange}
                className="border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
              />
              {formData.coverImage && (
                <div className="space-y-2">
                  <div className="relative w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <Image
                      src={URL.createObjectURL(formData.coverImage)}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCoverPreview(true)}
                      className="text-blue-600 border-blue-300 hover:bg-blue-50 cursor-pointer"
                    >
                      <FiImage className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onInputChange("coverImage", null);
                        setShowCoverPreview(false);
                      }}
                      className="text-red-600 border-red-300 hover:bg-red-50 cursor-pointer"
                    >
                      <FiX className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="shortDescription"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <FiEdit3 className="w-4 h-4 text-gray-500" />
            Short Description *
          </Label>
          <Textarea
            id="shortDescription"
            value={formData.shortDescription}
            onChange={(e) => onInputChange("shortDescription", e.target.value)}
            placeholder="Brief description of your template"
            rows={3}
            required
            className="border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
          />
        </div>
      </CardContent>
    </Card>

     {/* Category Modal */}
     {showCategoryModal && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
               {editingCategory ? "Edit Category" : "Create New Category"}
             </h3>
             <Button
               type="button"
               variant="ghost"
               size="sm"
               onClick={() => setShowCategoryModal(false)}
               className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
             >
               <FiX className="w-4 h-4" />
             </Button>
           </div>
           
           <div className="space-y-4">
             <div className="space-y-2">
               <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                 Category Title *
               </Label>
               <Input
                 value={newCategoryTitle}
                 onChange={(e) => setNewCategoryTitle(e.target.value)}
                 placeholder="Enter category title"
                 className="border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
               />
             </div>
             
                           <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category Slug *
                </Label>
                <Input
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  placeholder="enter-category-slug"
                  className="border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
              
                             <div className="space-y-2">
                 <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                   Category Image/Icon
                 </Label>
                 <Input
                   type="file"
                   accept="image/*"
                   onChange={handleCategoryImageChange}
                   className="border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
                 />
                 
                 {/* Show existing image when editing */}
                 {editingCategory && editingCategory.imageUrl && !newCategoryImage && (
                   <div className="flex items-center gap-2 mt-2">
                     <div className="relative w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                       <Image
                         src={getImageUrl(editingCategory.imageUrl) || editingCategory.imageUrl}
                         alt="Current category image"
                         fill
                         className="object-cover"
                         onError={(e) => {
                           console.error("Failed to load existing image:", editingCategory.imageUrl);
                           e.currentTarget.style.display = 'none';
                         }}
                       />
                     </div>
                     <span className="text-sm text-gray-600 dark:text-gray-400">
                       Current image
                     </span>
                   </div>
                 )}
                 
                 {/* Show new image preview */}
                 {newCategoryImage && (
                   <div className="flex items-center gap-2 mt-2">
                     <div className="relative w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                       <Image
                         src={URL.createObjectURL(newCategoryImage)}
                         alt="New category preview"
                         fill
                         className="object-cover"
                       />
                     </div>
                     <span className="text-sm text-gray-600 dark:text-gray-400">
                       {newCategoryImage.name}
                     </span>
                   </div>
                 )}
               </div>
             
                           <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Cancel
                </Button>
                                 <Button
                   type="button"
                   onClick={async () => {
                     if (editingCategory) {
                       await handleUpdateCategory();
                     } else {
                       await handleCreateCategory();
                     }
                   }}
                   disabled={!newCategoryTitle.trim() || !newCategorySlug.trim() || isCreatingCategory || isUpdatingCategory}
                   className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                 >
                   {isCreatingCategory || isUpdatingCategory ? (
                     "Saving..."
                   ) : editingCategory ? (
                     "Update Category"
                   ) : (
                     "Create Category"
                   )}
                 </Button>
                                 {editingCategory && (
                   <Button
                     type="button"
                     variant="outline"
                     onClick={async () => {
                       if (confirm("Are you sure you want to delete this category?")) {
                         try {
                           await onDeleteCategory(editingCategory.id);
                           setShowCategoryModal(false);
                         } catch (error) {
                           console.error("Error in modal delete:", error);
                         }
                       }
                     }}
                     disabled={isDeletingCategory}
                     className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer disabled:opacity-50"
                   >
                     {isDeletingCategory ? "Deleting..." : "Delete"}
                   </Button>
                 )}
              </div>
           </div>
         </div>
       </div>
     )}
   </>
 );
}
