"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiSave, FiRotateCcw, FiArrowLeft } from "react-icons/fi";
import { toast } from "sonner";
import {
  useTemplateCategories,
  useCreateTemplate,
  useCreateTemplateCategory,
  useUpdateTemplateCategory,
  useDeleteTemplateCategory,
} from "@/hooks/useTemplateApi";
import Link from "next/link";
import BasicInformationCard from "./BasicInformationCard";
import DescriptionCard from "./DescriptionCard";
import WhatsIncludedCard from "./WhatsIncludedCard";
import KeyFeaturesCard from "./KeyFeaturesCard";
import ScreenshotsCard from "./ScreenshotsCard";
import CoverImagePreviewModal from "./CoverImagePreviewModal";

// Unified KeyFeature interface for all create/edit template components
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

export default function CreateTemplateContainer() {
  const { data: categories = [], isLoading: categoriesLoading } =
    useTemplateCategories();
  const createTemplateMutation = useCreateTemplate();
  const createCategoryMutation = useCreateTemplateCategory();
  const updateCategoryMutation = useUpdateTemplateCategory();
  const deleteCategoryMutation = useDeleteTemplateCategory();

  const [formData, setFormData] = useState<TemplateFormData>({
    title: "",
    price: 0,
    categoryId: "",
    version: 1,
    previewLink: "",
    sourceFiles: [],
    shortDescription: "",
    description: [""],
    whatsIncluded: [""],
    keyFeatures: [{ feature: "", featureDescription: "" }],
    screenshots: [],
    coverImage: null,
  });

  const [showCoverPreview, setShowCoverPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newKeyFeature, setNewKeyFeature] = useState("");
  const [newKeyFeatureDescription, setNewKeyFeatureDescription] = useState("");

  const handleCreateCategory = async (categoryData: {
    title: string;
    slug: string;
    imageFile?: File | null;
  }) => {
    try {
      const formData = new FormData();
      formData.append("title", categoryData.title);
      formData.append("slug", categoryData.slug);
      if (categoryData.imageFile) {
        formData.append("image", categoryData.imageFile); // Changed from "imageFile" to "image"
      }

      const result = await createCategoryMutation.mutateAsync(formData);
      console.log("Category created successfully:", result);
      toast.success("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category. Please try again.");
    }
  };

  const handleUpdateCategory = async (
    id: string,
    categoryData: { title: string; slug: string; imageFile?: File | null }
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", categoryData.title);
      formData.append("slug", categoryData.slug);
      if (categoryData.imageFile) {
        formData.append("image", categoryData.imageFile); // Changed from "imageFile" to "image"
      }

      const result = await updateCategoryMutation.mutateAsync({ id, formData });
      console.log("Category updated successfully:", result);
      toast.success("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category. Please try again.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      console.log("Attempting to delete category with ID:", id);
      const result = await deleteCategoryMutation.mutateAsync(id);
      console.log("Category deleted successfully:", result);
      toast.success("Category deleted successfully!");
      // Clear category selection if the deleted category was selected
      if (formData.categoryId === id) {
        handleInputChange("categoryId", "");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category. Please try again.");
    }
  };

  const handleInputChange = (field: keyof TemplateFormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addKeyFeature = () => {
    if (newKeyFeature.trim() && newKeyFeatureDescription.trim()) {
      setFormData((prev) => ({
        ...prev,
        keyFeatures: [
          ...prev.keyFeatures,
          {
            feature: newKeyFeature.trim(),
            featureDescription: newKeyFeatureDescription.trim(),
          },
        ],
      }));
      setNewKeyFeature("");
      setNewKeyFeatureDescription("");
    }
  };

  const removeKeyFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        coverImage: file,
      }));
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      screenshots: [...prev.screenshots, ...files],
    }));
  };

  const removeScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
  };

  const addWhatsIncluded = () => {
    setFormData((prev) => ({
      ...prev,
      whatsIncluded: [...prev.whatsIncluded, ""],
    }));
  };

  const removeWhatsIncluded = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      whatsIncluded: prev.whatsIncluded.filter((_, i) => i !== index),
    }));
  };

  const updateWhatsIncluded = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      whatsIncluded: prev.whatsIncluded.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: 0,
      categoryId: "",
      version: 1,
      previewLink: "",
      sourceFiles: [],
      shortDescription: "",
      description: [""],
      whatsIncluded: [""],
      keyFeatures: [{ feature: "", featureDescription: "" }],
      screenshots: [],
      coverImage: null,
    });
    setNewKeyFeature("");
    setNewKeyFeatureDescription("");
    setShowCoverPreview(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Starting template creation with data:", formData);
      
      // Validate required fields
      if (!formData.title.trim()) {
        toast.error("Template title is required");
        return;
      }
      if (!formData.categoryId) {
        toast.error("Please select a category");
        return;
      }
      if (formData.price <= 0) {
        toast.error("Price must be greater than 0");
        return;
      }
      
      // Create FormData for file uploads
      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("version", formData.version.toString());
      formDataToSend.append("previewLink", formData.previewLink);
      formDataToSend.append("shortDescription", formData.shortDescription.trim());

      // Add arrays as JSON strings
      formDataToSend.append(
        "description",
        JSON.stringify(formData.description.filter(d => d.trim()))
      );
      formDataToSend.append(
        "whatsIncluded",
        JSON.stringify(formData.whatsIncluded.filter(w => w.trim()))
      );
      formDataToSend.append(
        "keyFeatures",
        JSON.stringify(formData.keyFeatures.filter(k => k.feature.trim() && k.featureDescription.trim()))
      );
      formDataToSend.append(
        "sourceFiles",
        JSON.stringify(formData.sourceFiles.filter(s => s.trim()))
      );

      // Add files with proper field names
      if (formData.coverImage) {
        formDataToSend.append("image", formData.coverImage);
      }

      formData.screenshots.forEach((screenshot) => {
        formDataToSend.append("screenshots", screenshot);
      });

      console.log("FormData contents:");
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      // Call the mutation
      const result = await createTemplateMutation.mutateAsync(formDataToSend);
      console.log("Template creation result:", result);

      // Reset form on success
      resetForm();

      // Success notification
      toast.success("Template created successfully!");
    } catch (error: unknown) {
      console.error("Error creating template:", error);
      const errorMessage =
        typeof error === "object" && error && "message" in error
          ? (error as { message: string }).message
          : "Failed to create template. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/dashboard/templates">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white cursor-pointer"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Templates
            </Button>
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Template
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add a new template to your collection
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInformationCard
            formData={formData}
            categories={categories}
            onInputChange={handleInputChange}
            onCoverImageChange={handleCoverImageChange}
            showCoverPreview={showCoverPreview}
            setShowCoverPreview={setShowCoverPreview}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            isCreatingCategory={createCategoryMutation.isPending}
            isUpdatingCategory={updateCategoryMutation.isPending}
            isDeletingCategory={deleteCategoryMutation.isPending}
          />

          <DescriptionCard
            formData={formData}
            onInputChange={handleInputChange}
          />

          <WhatsIncludedCard
            formData={formData}
            addWhatsIncluded={addWhatsIncluded}
            removeWhatsIncluded={removeWhatsIncluded}
            updateWhatsIncluded={updateWhatsIncluded}
          />

          <KeyFeaturesCard
            formData={formData}
            onInputChange={handleInputChange}
            addKeyFeature={addKeyFeature}
            removeKeyFeature={removeKeyFeature}
            newKeyFeature={newKeyFeature}
            setNewKeyFeature={setNewKeyFeature}
            newKeyFeatureDescription={newKeyFeatureDescription}
            setNewKeyFeatureDescription={setNewKeyFeatureDescription}
          />

          {/* Source Files Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Source Files
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Add links to source files (GitHub, ZIP files, etc.)
              </p>
                  </div>
            <div className="p-6">
              <div className="space-y-4">
                {formData.sourceFiles.map((file, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={file}
                              onChange={(e) => {
                        const newSourceFiles = [...formData.sourceFiles];
                        newSourceFiles[index] = e.target.value;
                        handleInputChange("sourceFiles", newSourceFiles);
                      }}
                      placeholder={`Source file link ${index + 1} (e.g., https://github.com/username/repo)`}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newSourceFiles = formData.sourceFiles.filter((_, i) => i !== index);
                        handleInputChange("sourceFiles", newSourceFiles);
                      }}
                      className="px-3 py-2 text-red-600 hover:text-red-700 border border-red-300 hover:border-red-500 rounded-md cursor-pointer"
                    >
                      Remove
                    </button>
                    </div>
                  ))}
                <button
                      type="button"
                  onClick={() => {
                    handleInputChange("sourceFiles", [...formData.sourceFiles, ""]);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                >
                  + Add Source File Link
                </button>
                  </div>
                </div>
              </div>

          <ScreenshotsCard
            formData={formData}
            handleScreenshotChange={handleScreenshotChange}
            removeScreenshot={removeScreenshot}
          />

          <CoverImagePreviewModal
            showCoverPreview={showCoverPreview}
            setShowCoverPreview={setShowCoverPreview}
            coverImage={formData.coverImage}
          />

          {/* Submit Buttons */}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
            >
              <FiRotateCcw className="w-4 h-4 mr-2" />
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createTemplateMutation.isPending}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="w-4 h-4" />
              {isSubmitting || createTemplateMutation.isPending
                ? "Creating..."
                : "Create Template"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
