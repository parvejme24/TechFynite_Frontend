"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  FiTag,
  FiLayers,
} from "react-icons/fi";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useGetAllTemplateCategoriesForStats, useDeleteTemplateCategory } from "@/hooks/useTemplateCategoryApi";
import { TemplateCategory } from "@/types/templateCategory";
import CreateTemplateCategoryModal from "./CreateTemplateCategoryModal";
import EditTemplateCategoryModal from "./EditTemplateCategoryModal";

export default function TemplateCategoriesContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | null>(null);

  // Fetch categories data
  const {
    data: categoriesData,
    isLoading,
    error,
    refetch,
  } = useGetAllTemplateCategoriesForStats();

  const deleteCategoryMutation = useDeleteTemplateCategory();

  const categories = categoriesData?.data || [];

  // Filter categories based on search term
  const filteredCategories = categories.filter((category: TemplateCategory) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.slug && category.slug.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateCategory = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditCategory = (category: TemplateCategory) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCreateSuccess = () => {
    // Cache invalidation is handled automatically by the hook
    // No need to manually refetch - React Query will update automatically
  };

  const handleEditSuccess = () => {
    // Cache invalidation is handled automatically by the hook
    // No need to manually refetch - React Query will update automatically
  };

  const handleDeleteCategory = async (category: TemplateCategory) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the category "${category.title}". This action cannot be undone!`,
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
      setActionLoading(category.id);
      try {
        await deleteCategoryMutation.mutateAsync(category.id);
        toast.success("Category deleted successfully!");
      } catch (error) {
        console.error("Delete category error:", error);
        toast.error("Failed to delete category. Please try again.");
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Categories refreshed!");
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Failed to refresh categories");
    }
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

          {/* Table Skeleton */}
          <Card className="bg-white dark:bg-[#1A1D37]">
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
                Template Categories
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and organize your template categories
              </p>
            </div>
            <Button
              onClick={handleCreateCategory}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              Create Category
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories Table */}
        <Card className="bg-white dark:bg-[#1A1D37]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiLayers className="w-5 h-5" />
              Template Categories ({filteredCategories.length} total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <FiLayers className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">
                  No categories found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "No template categories have been created yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Templates Count</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category: TemplateCategory) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.title}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  // Fallback to initial if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className={`w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm ${category.image ? 'hidden' : ''}`}
                            >
                              {category.title.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {category.title}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {category.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <FiLayers className="w-4 h-4" />
                            {category.templateCount || 0}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={actionLoading === category.id}
                                className="cursor-pointer"
                              >
                                <FiMoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Category Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleEditCategory(category)}
                                className="cursor-pointer"
                              >
                                <FiEdit className="w-4 h-4 mr-2" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteCategory(category)}
                                disabled={actionLoading === category.id}
                                className="text-red-600 cursor-pointer"
                              >
                                <FiTrash2 className="w-4 h-4 mr-2" />
                                Delete Category
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Category Modal */}
      <CreateTemplateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Category Modal */}
      <EditTemplateCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
