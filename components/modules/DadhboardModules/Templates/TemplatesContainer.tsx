"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TemplateCard from "./TemplateCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FiPlus,
  FiSearch,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiLayers,
  FiRefreshCw,
  FiFilter,
  FiChevronDown,
} from "react-icons/fi";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useGetAllTemplates, useTemplateApi } from "@/hooks/useTemplateApi";
import { useGetAllTemplateCategoriesForStats } from "@/hooks/useTemplateCategoryApi";
import { Template, TemplateQuery } from "@/types/template";
import { useRouter } from "next/navigation";

export default function TemplatesContainer() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Template query - remove search and categoryId to prevent API refetch
  const templateQuery: TemplateQuery = {
    page: currentPage,
    limit: 10,
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

  // Fetch template categories for filter
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
  } = useGetAllTemplateCategoriesForStats();

  const { deleteTemplate } = useTemplateApi();

  const templates = templatesData?.data || [];
  const pagination = templatesData?.pagination;
  const categories = categoriesData?.data || [];

  // Filter templates based on search term and category using useMemo for performance
  const filteredTemplates = useMemo(() => {
    return templates.filter((template: Template) => {
      const matchesSearch = searchTerm === "" || 
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "" || template.categoryId === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchTerm, selectedCategory]);

  const handleCreateTemplate = () => {
    router.push("/dashboard/templates/create");
  };

  const handleEditTemplate = (template: Template) => {
    router.push(`/dashboard/templates/edit/${template.id}`);
  };

  const handleDeleteTemplate = async (template: Template) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the template "${template.title}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      setActionLoading(template.id);
      try {
        await deleteTemplate(template.id);
        toast.success("Template deleted successfully!");
        refetch();
      } catch (error) {
        console.error("Delete template error:", error);
        toast.error("Failed to delete template. Please try again.");
      } finally {
        setActionLoading(null);
      }
    }
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="w-full md:w-auto">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>
          </div>

          {/* Card Grid Skeleton */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Templates
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and organize your templates ({filteredTemplates.length}{" "}
                {searchTerm || selectedCategory ? "filtered" : "total"})
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="cursor-pointer"
                disabled={isLoading}
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                onClick={handleCreateTemplate}
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 cursor-pointer"
              >
                <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                Create Template
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter Dropdown */}
            <div className="flex items-center gap-2">
              <FiFilter className="w-4 h-4 text-gray-500" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="min-w-[200px] justify-between"
                    disabled={categoriesLoading}
                  >
                    {selectedCategory 
                      ? categories.find(cat => cat.id === selectedCategory)?.title || "Select Category"
                      : "All Categories"
                    }
                    <FiChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setSelectedCategory("")}
                    className="cursor-pointer"
                  >
                    All Categories
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className="cursor-pointer"
                    >
                      {category.title}
                      <span className="ml-auto text-xs text-gray-500">
                        ({category.templateCount})
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Clear Filters Button */}
              {(searchTerm || selectedCategory) && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <FiLayers className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Template Gallery</h2>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FiLayers className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No templates have been created yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template: Template) => (
                <div key={template.id} className="relative group">
                  <TemplateCard
                    template={{
                      id: template.id,
                      title: template.title,
                      category: template.category.title,
                      price: template.price.toString(),
                      image: template.imageUrl || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDIyNVYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE5NSAxNDVIMjA1VjE1NUgxOTVWMTQ1WiIgZmlsbD0iI0YzRjRGNiIvPgo8L3N2Zz4K",
                      previewLink: template.previewLink || "#",
                    }}
                  />

                  {/* Admin Actions Overlay */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={actionLoading === template.id}
                          className="cursor-pointer bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg"
                        >
                          <FiMoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Template Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleEditTemplate(template)}
                          className="cursor-pointer"
                        >
                          <FiEdit className="w-4 h-4 mr-2" />
                          Edit Template
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteTemplate(template)}
                          disabled={actionLoading === template.id}
                          className="text-red-600 cursor-pointer"
                        >
                          <FiTrash2 className="w-4 h-4 mr-2" />
                          Delete Template
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
