"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Template {
  id: string;
  title: string;
  image: string;
  price: string;
  category: string;
  version: string;
  downloads: string;
  publishedDate: string;
  pages: string;
  views: string;
  previewLink: string;
  shortDescription: string;
  description: string;
  whatsIncluded: string[];
  keyFeatures: Array<{
    feature: string;
    featureDescription: string;
  }>;
  screenshots: string[];
}

const useTemplates = () => {
  const [data, setData] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | { message: string }>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetch("/templates.json")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = (await res.json()) as Template[];
        if (!isMounted) return;
        setData(Array.isArray(raw) ? raw : []);
        setIsLoading(false);
      })
      .catch((e: unknown) => {
        if (!isMounted) return;
        setError({ message: (e as Error).message });
        setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
};

const useTemplateCategories = (templates: Template[]) => {
  const categories = useMemo(() => {
    const unique = new Set<string>();
    templates.forEach((t) => {
      if (t.category) unique.add(t.category);
    });
    return Array.from(unique.values()).map((title) => ({ title }));
  }, [templates]);
  return {
    data: categories,
    isLoading: false,
    error: null as null | { message: string },
  };
};
import TemplateCard from "./TemplateCard";

const TEMPLATES_PER_PAGE = 9;

// Types moved above to share with mock data

export default function TemplateContainer() {
  const { data: templates = [], isLoading, error } = useTemplates();
  const { data: categories = [] } = useTemplateCategories(templates);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter templates by selected category
  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter(
          (t: unknown) =>
            (t as { category: string }).category === selectedCategory
        );

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

  return (
    <div>
      <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-10">
        <h3 className="text-2xl font-bold text-center mb-6">
          New Arrival Product
        </h3>

        {/* Category Tabs */}
        <div className="mt-8">
          <div className="flex justify-center overflow-x-auto gap-3 pb-2 scrollbar-hide">
            <button
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                selectedCategory === "all"
                  ? "bg-[#0F5BBD] text-white shadow-lg"
                  : "border-2 border-[#BBD8FC] text-black dark:text-white hover:border-[#0F5BBD] hover:text-[#0F5BBD] dark:hover:text-[#0F5BBD]"
              }`}
              onClick={() => setSelectedCategory("all")}
            >
              All
            </button>
            {categories.map((cat: unknown) => {
              const category = cat as { title: string };
              return (
                <button
                  key={category.title}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category.title
                      ? "bg-[#0F5BBD] text-white shadow-lg"
                      : "border-2 border-[#BBD8FC] text-black dark:text-white hover:border-[#0F5BBD] hover:text-[#0F5BBD] dark:hover:text-[#0F5BBD]"
                  }`}
                  onClick={() => setSelectedCategory(category.title)}
                >
                  {category.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!isLoading &&
            paginatedTemplates.map((template: unknown) => (
              <TemplateCard
                key={(template as Template).id}
                template={template as Template}
              />
            ))}
        </div>

        {totalPages > 1 && !isLoading && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              className="cursor-pointer p-2 rounded-md border border-gray-300 dark:border-blue-800 bg-white dark:bg-blue-800 text-gray-700 dark:text-white disabled:opacity-50 flex items-center justify-center"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <FiChevronLeft size={20} />
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`px-3 py-1 rounded-md border cursor-pointer transition-colors duration-150 ${
                  page === idx + 1
                    ? "bg-[#0F43AF] text-white border-blue-500"
                    : "bg-transparent text-gray-700 dark:text-white border-[#0F5BBD] dark:border-[#0F5BBD]"
                }`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="cursor-pointer p-2 rounded-md border border-gray-300 dark:border-blue-800 bg-white dark:bg-blue-800 text-gray-700 dark:text-white disabled:opacity-50 flex items-center justify-center"
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
