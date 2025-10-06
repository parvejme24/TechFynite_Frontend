"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
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

  if (error) return <div>Error: {error}</div>;
  if (categoriesError) return <div>Error: {categoriesError}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-10">
        <motion.div 
          className="flex justify-end mb-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.span 
            className="w-[150px] bg-gradient-to-r from-[#BDD9FE] to-[#8AACDA] rounded-lg p-[2px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={"/dashboard/templates/create"}
              target="_blank"
              className="bg-gradient-to-r text-white from-[#0F59BC] to-[#0F35A7] w-[150px] h-full py-3 flex justify-center items-center rounded-lg"
            >
              Create Template
            </Link>
          </motion.span>
        </motion.div>
        <motion.h3 
          className="text-2xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{ 
            duration: 0.5, 
            delay: 0.2,
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
          className="flex flex-wrap gap-2 lg:justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            className={`px-6 py-3 rounded-full border text-sm font-semibold transition-colors duration-150 ${
              selectedCategory === "all"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white dark:bg-blue-900 text-gray-700 dark:text-white border-gray-300 dark:border-blue-800"
            }`}
            onClick={() => setSelectedCategory("all")}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            All
          </motion.button>
          {categories.map((cat: unknown, index) => {
            const category = cat as { id?: string; _id?: string; title: string };
            return (
              <motion.button
                key={category.id || category._id}
                className={`px-6 py-3 rounded-full border text-sm font-semibold transition-colors duration-150 ${
                  selectedCategory === (category.id || category._id)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white dark:bg-blue-900 text-gray-700 dark:text-white border-gray-300 dark:border-blue-800"
                }`}
                onClick={() => setSelectedCategory(category.id || category._id || "")}
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

        <motion.div 
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {(isLoading || categoriesLoading) ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: idx * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <DashboardPricingCardSkeleton />
                </motion.div>
              ))
            ) : paginatedTemplates.length > 0 ? (
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
                  <TemplateCard template={template as Template & { image: string }} />
                </motion.div>
              ))
            ) : (
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
            )}
          </AnimatePresence>
        </motion.div>
        {totalPages > 1 && !isLoading && !categoriesLoading && (
          <motion.div 
            className="flex justify-center mt-8 gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <motion.button
              className="cursor-pointer p-2 rounded-full border border-gray-300 dark:border-blue-800 bg-white dark:bg-blue-800 text-gray-700 dark:text-white disabled:opacity-50 flex items-center justify-center"
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
                className={`px-3 py-1 rounded-full border cursor-pointer transition-colors duration-150 ${
                  page === idx + 1
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white dark:bg-blue-900 text-gray-700 dark:text-white border-gray-300 dark:border-blue-800"
                }`}
                onClick={() => setPage(idx + 1)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + idx * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                {idx + 1}
              </motion.button>
            ))}
            <motion.button
              className="cursor-pointer p-2 rounded-full border border-gray-300 dark:border-blue-800 bg-white dark:bg-blue-800 text-gray-700 dark:text-white disabled:opacity-50 flex items-center justify-center"
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
