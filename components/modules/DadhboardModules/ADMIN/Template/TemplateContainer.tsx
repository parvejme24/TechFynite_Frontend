"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-10">
        <motion.h3 
          className="text-3xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{ 
            duration: 0.5, 
            delay: 0.1,
            backgroundPosition: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          style={{
            background: "linear-gradient(90deg, #1f2937, #3b82f6, #8b5cf6, #1f2937)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          New Arrival Product
        </motion.h3>

        {/* Category Tabs */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="flex justify-center overflow-x-auto gap-3 pb-2 scrollbar-hide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.button
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 text-base ${
                selectedCategory === "all"
                  ? "bg-[#0F5BBD] text-white shadow-lg"
                  : "border-2 border-[#BBD8FC] text-black dark:text-white hover:border-[#0F5BBD] hover:text-[#0F5BBD] dark:hover:text-[#0F5BBD]"
              }`}
              onClick={() => setSelectedCategory("all")}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              All Items
            </motion.button>
            {categories.map((cat: unknown, index) => {
              const category = cat as { title: string };
              return (
                <motion.button
                  key={category.title}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 text-base ${
                    selectedCategory === category.title
                      ? "bg-[#0F5BBD] text-white shadow-lg"
                      : "border-2 border-[#BBD8FC] text-black dark:text-white hover:border-[#0F5BBD] hover:text-[#0F5BBD] dark:hover:text-[#0F5BBD]"
                  }`}
                  onClick={() => setSelectedCategory(category.title)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.title}
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {!isLoading && paginatedTemplates.length > 0 ? (
              paginatedTemplates.map((template: unknown, index) => (
                <motion.div
                  key={(template as Template).id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  layout
                >
                  <TemplateCard template={template as Template} />
                </motion.div>
              ))
            ) : !isLoading ? (
              <motion.div 
                className="col-span-full text-center py-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
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
                  <p className="text-gray-500 text-lg">
                    No templates found matching your criteria.
                  </p>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        {totalPages > 1 && !isLoading && (
          <motion.div 
            className="flex justify-center mt-8 gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.button
              className="cursor-pointer p-2 rounded-md border border-gray-300 dark:border-blue-800 bg-white dark:bg-blue-800 text-gray-700 dark:text-white disabled:opacity-50 flex items-center justify-center"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiChevronLeft size={20} />
            </motion.button>
            {[...Array(totalPages)].map((_, idx) => (
              <motion.button
                key={idx}
                className={`px-3 py-1 rounded-md border cursor-pointer transition-colors duration-150 ${
                  page === idx + 1
                    ? "bg-[#0F43AF] text-white border-blue-500"
                    : "bg-transparent text-gray-700 dark:text-white border-[#0F5BBD] dark:border-[#0F5BBD]"
                }`}
                onClick={() => setPage(idx + 1)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + idx * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                {idx + 1}
              </motion.button>
            ))}
            <motion.button
              className="cursor-pointer p-2 rounded-md border border-gray-300 dark:border-blue-800 bg-white dark:bg-blue-800 text-gray-700 dark:text-white disabled:opacity-50 flex items-center justify-center"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiChevronRight size={20} />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
