"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FiSearch,
  FiPlus,
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiImage,
  FiFileText,
} from "react-icons/fi";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Image from "next/image";
import {
  useGetAllBlogCategories,
  useGetAllBlogCategoriesForStats,
  useDeleteBlogCategory,
} from "@/hooks/useBlogCategoryApi";
import CreateBlogCategoryModal from "./CreateBlogCategoryModal";
import EditBlogCategoryModal from "./EditBlogCategoryModal";

export default function BlogCategoryContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const {
    data: categoriesData,
    isLoading,
    error,
    refetch,
  } = useGetAllBlogCategories(currentPage, pageSize);

  const {
    data: statsData,
    isLoading: isLoadingStats,
  } = useGetAllBlogCategoriesForStats();

  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteBlogCategory();

  // Filter categories based on search term
  const filteredCategories =
    categoriesData?.data?.filter(
      (category) =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Blog categories refreshed!");
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Failed to refresh categories");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${title}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteCategory(id);
      toast.success("Blog category deleted successfully!");
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(
        error?.message || "Failed to delete category. Please try again."
      );
    }
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading blog categories...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">
              Error loading blog categories
            </div>
            <div className="text-gray-600 dark:text-gray-400 mb-6">
              <p>Failed to load blog categories. Please try again.</p>
            </div>
            <Button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
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
          <div className="flex flex-col text-center md:text-left md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Blog Categories
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and organize your blog categories
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="cursor-pointer"
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
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
              className="pl-10 cursor-text"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-[#1A1D37]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Categories
              </CardTitle>
              <FiFileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsData?.data?.length || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#1A1D37]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
              <FiFileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {statsData?.data?.reduce(
                  (sum, cat) => sum + cat.blogCount,
                  0
                ) || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#1A1D37]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Images</CardTitle>
              <FiImage className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {statsData?.data?.filter((cat) => cat.imageUrl).length ||
                  0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? "No categories found" : "No blog categories yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Create your first blog category to get started"}
            </p>
            {!searchTerm && (
              <Button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Create First Category
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <Card
                key={category.id}
                className="bg-white dark:bg-[#1A1D37] hover:shadow-lg transition-shadow duration-200 relative"
              >
                {/* Action Menu - Positioned absolutely in top right */}
                <div className="absolute top-2 right-2 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                      >
                        <FiMoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleEdit(category)}
                        className="cursor-pointer"
                      >
                        <FiEdit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleDelete(category.id, category.title)
                        }
                        disabled={isDeleting}
                        className="text-red-600 cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <CardContent className="pt-4">
                  {/* Category Image */}
                  <div className="mb-4">
                    {category.imageUrl ? (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden">
                        <Image
                          src={category.imageUrl}
                          alt={category.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <FiImage className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <CardTitle className="text-lg text-center font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {category.title}
                    </CardTitle>
                  </div>

                  {/* Category Information */}
                  <div className="space-y-3 mt-4">
                    {/* Slug */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Slug:
                      </span>
                      <span className="text-sm text-gray-800 dark:text-gray-200 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {category.slug}
                      </span>
                    </div>

                    {/* Blog Count */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Blog Count:
                      </span>
                      <Badge variant="secondary" className="font-semibold">
                        {category.blogCount}
                      </Badge>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Created:
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(category.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {categoriesData?.pagination &&
          categoriesData.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center mt-8">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="cursor-pointer"
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from(
                    {
                      length: Math.min(5, categoriesData.pagination.totalPages),
                    },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(categoriesData.pagination.totalPages, prev + 1)
                    )
                  }
                  disabled={
                    currentPage === categoriesData.pagination.totalPages
                  }
                  className="cursor-pointer"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
      </div>

      {/* Create Category Modal */}
      <CreateBlogCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Category Modal */}
      <EditBlogCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />
    </div>
  );
}
