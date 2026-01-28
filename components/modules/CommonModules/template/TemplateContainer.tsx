"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TemplateCard from "./TemplateCard";
import { FiLayers } from "react-icons/fi";
import { toast } from "sonner";
import { useGetAllTemplates } from "@/hooks/useTemplateApi";
import { useGetAllTemplateCategoriesForStats } from "@/hooks/useTemplateCategoryApi";
import { Template, TemplateQuery } from "@/types/template";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function TemplatesContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize category filter from URL parameter
  useEffect(() => {
    const categoryIdFromUrl = searchParams.get('categoryId');
    if (categoryIdFromUrl) {
      setSelectedCategoryId(categoryIdFromUrl);
    }
  }, [searchParams]);

  // Fetch categories for filter tabs
  const { data: categoriesData } = useGetAllTemplateCategoriesForStats();
  
  // Template query
  const templateQuery: TemplateQuery = {
    page: currentPage,
    limit: 10,
    categoryId: selectedCategoryId || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  // Fetch templates data
  const {
    data: templatesData,
    isLoading,
    error,
    refetch,
  } = useGetAllTemplates(templateQuery);

  const templates = templatesData?.templates || [];
  const pagination = templatesData?.pagination;

  // Filter categories to only show those that have templates (templateCount > 0)
  const categories = useMemo(() => {
    const allCategories = categoriesData?.data || [];
    return allCategories.filter((category) => category.templateCount > 0);
  }, [categoriesData]);

  const handleCreateTemplate = () => {
    router.push("/dashboard/templates/create");
  };


  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Templates refreshed!");
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Failed to refresh templates");
    }
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1); // Reset to first page when changing category
    
    // Update URL without page reload
    if (categoryId) {
      router.push(`/template?categoryId=${categoryId}`, { scroll: false });
    } else {
      router.push('/template', { scroll: false });
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <motion.div 
        className="min-h-screen py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto max-w-7xl px-4">
          {/* Category Filter Skeleton */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Card Grid Skeleton */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.3 + i * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <motion.div 
                    className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"
                    animate={{
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <div className="space-y-3">
                    <motion.div 
                      className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"
                      animate={{
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.1
                      }}
                    />
                    <motion.div 
                      className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"
                      animate={{
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.1 + 0.2
                      }}
                    />
                    <div className="flex justify-between items-center">
                      <motion.div 
                        className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"
                        animate={{
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.1 + 0.4
                        }}
                      />
                      <motion.div 
                        className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"
                        animate={{
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.1 + 0.6
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <motion.div 
                        className="h-8 bg-gray-200 dark:bg-gray-700 rounded"
                        animate={{
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.1 + 0.8
                        }}
                      />
                      <motion.div 
                        className="h-8 bg-gray-200 dark:bg-gray-700 rounded"
                        animate={{
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.1 + 1.0
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Category Filter Tabs - Only show if there are templates */}
        {templates.length > 0 && categories.length > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex justify-center flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCategoryFilter(null)}
                    className={`rounded-full capitalize cursor-pointer px-5 py-5 ${
                      selectedCategoryId === null
                        ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white border-blue-600 hover:from-blue-700 hover:to-blue-900 hover:text-white"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    All
                  </Button>
                </motion.div>
              </motion.div>
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCategoryFilter(category.id)}
                      className={`rounded-full capitalize cursor-pointer px-5 py-5 ${
                        selectedCategoryId === category.id
                          ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white border-blue-600 hover:from-blue-700 hover:to-blue-900 hover:text-white"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {category.title}
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Templates Grid */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {templates.length === 0 ? (
              <motion.div 
                key="empty-state"
                className="flex items-center justify-center min-h-[60vh]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="text-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <FiLayers className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-lg font-medium mb-2 dark:text-white">No templates found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {selectedCategoryId
                      ? "No templates found in this category"
                      : "No templates have been created yet"}
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="templates-grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {templates.map((template: Template, index) => (
                  <motion.div 
                    key={template.id} 
                    className="relative group h-full"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      scale: 0.95,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <TemplateCard
                      template={template}
                    />

                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
