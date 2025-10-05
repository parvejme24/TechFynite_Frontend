"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
// Mock template hooks - in real app, these would be imported from your API hooks
const useTemplates = () => {
  return {
    data: [], // Empty array for now
    isLoading: false,
    error: null,
  };
};

const useTemplateCategories = () => {
  return {
    data: [], // Empty array for now
    isLoading: false,
    error: null,
  };
};
import TemplateCard from "./TemplateCard";
import DashboardPricingCardSkeleton from "@/components/modules/CommonModules/pricing/pricingList/DashboardPricingCardSkeleton";

const TEMPLATES_PER_PAGE = 6;

interface KeyFeature {
  feature: string;
  featureDescription: string;
}
interface Template {
  id: string;
  title: string;
  category: string;
  author: string;
  publishedDate: string;
  price: string;
  imageUrl: string;
  mainImage: string;
  shortDescription: string;
  description: string;
  previewLink: string;
  weIncludes: string[];
  keyFeatures: KeyFeature[]; // Now uses featureDescription
  demos: string[];
}

export default function TemplateContainer() {
  const { data: templates = [], isLoading, error } = useTemplates();
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useTemplateCategories();
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter templates by selected category
  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((t: unknown) => (t as { categoryId: string }).categoryId === selectedCategory);

  // Pagination logic
  const totalPages = Math.ceil(filteredTemplates.length / TEMPLATES_PER_PAGE);
  const paginatedTemplates = filteredTemplates.slice(
    (page - 1) * TEMPLATES_PER_PAGE,
    page * TEMPLATES_PER_PAGE
  );

  // Reset to page 1 when category changes
  React.useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  if (error) return <div>Error: {error.message}</div>;
  if (categoriesError) return <div>Error: {categoriesError.message}</div>;

  return (
    <div>
      <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-10">
        <div className="flex justify-end mb-6">
          <span className="w-[150px] bg-gradient-to-r from-[#BDD9FE] to-[#8AACDA] rounded-lg p-[2px]">
            <Link
              href={"/dashboard/ADMIN/templates/create"}
              target="_blank"
              className="bg-gradient-to-r text-white from-[#0F59BC] to-[#0F35A7] w-[150px] h-full py-3 flex justify-center items-center rounded-lg"
            >
              Create Template
            </Link>
          </span>
        </div>
        <h3 className="text-2xl font-bold text-center mb-6">
          New Arrival Product
        </h3>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors duration-150 ${
              selectedCategory === "all"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white dark:bg-blue-900 text-gray-700 dark:text-white border-gray-300 dark:border-blue-800"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            All
          </button>
          {categories.map((cat: unknown) => {
            const category = cat as { id?: string; _id?: string; title: string };
            return (
              <button
                key={category.id || category._id}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors duration-150 ${
                  selectedCategory === (category.id || category._id)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white dark:bg-blue-900 text-gray-700 dark:text-white border-gray-300 dark:border-blue-800"
                }`}
                onClick={() => setSelectedCategory(category.id || category._id || "")}
              >
                {category.title}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(isLoading || categoriesLoading)
            ? Array.from({ length: 6 }).map((_, idx) => (
                <DashboardPricingCardSkeleton key={idx} />
              ))
            : paginatedTemplates.map((template: unknown) => (
                <TemplateCard key={(template as Template).id} template={template as Template} />
              ))}
        </div>
        {totalPages > 1 && !isLoading && !categoriesLoading && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              className="cursor-pointer p-2 rounded-full border border-gray-300 dark:border-blue-800 bg-white dark:bg-blue-800 text-gray-700 dark:text-white disabled:opacity-50 flex items-center justify-center"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <FiChevronLeft size={20} />
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`px-3 py-1 rounded-full border cursor-pointer transition-colors duration-150 ${
                  page === idx + 1
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white dark:bg-blue-900 text-gray-700 dark:text-white border-gray-300 dark:border-blue-800"
                }`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="cursor-pointer p-2 rounded-full border border-gray-300 dark:border-blue-800 bg-white dark:bg-blue-800 text-gray-700 dark:text-white disabled:opacity-50 flex items-center justify-center"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
