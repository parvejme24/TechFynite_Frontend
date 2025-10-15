"use client";
import React, { useState, useMemo } from "react";
import TemplateCard from "../../CommonModules/template/TemplateCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllTemplates } from "@/hooks/useTemplateApi";
import { Template } from "@/types/template";

export default function NewProducts() {
  const [activeTab, setActiveTab] = useState("All Items");

  // Fetch templates data from API
  const { data: templatesData, isLoading: loading, error } = useGetAllTemplates({
    page: 1,
    limit: 50, // Get more templates for the home page
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  const templates = templatesData?.data || [];

  // Get unique categories from templates
  const categories = useMemo(() => {
    const categoryNames = templates.map((template) => template.category?.title || template.categoryId);
    return [
      "All Items",
      ...Array.from(new Set(categoryNames.filter(Boolean))),
    ];
  }, [templates]);

  // Filter templates based on active tab
  const filteredTemplates = useMemo(() => {
    if (activeTab === "All Items") {
      return templates;
    }
    return templates.filter((template) => 
      template.category?.title === activeTab || template.categoryId === activeTab
    );
  }, [templates, activeTab]);

  const handleTabClick = (category: string) => {
    setActiveTab(category);
  };

  if (loading) {
    return (
      <motion.div 
        className="py-14 bg-gradient-to-b from-[#FAFCFF] dark:from-[#000424] to-[#FAFCFF] dark:to-[#000424]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto max-w-7xl px-5 lg:px-0">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5BBD] mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p 
              className="mt-4 text-gray-600 dark:text-gray-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading products...
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="py-14 bg-gradient-to-b from-[#FAFCFF] dark:from-[#000424] to-[#FAFCFF] dark:to-[#000424]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto max-w-7xl px-5 lg:px-0">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
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
              <p className="text-red-500 text-lg">
                Error loading products. Please try again later.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="py-14 bg-gradient-to-b from-[#FAFCFF] dark:from-[#000424] to-[#FAFCFF] dark:to-[#000424]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto max-w-7xl px-5 lg:px-0">
        <motion.h2 
          className="text-[34px] font-bold text-center dark:text-white"
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
          New Arrival Products
        </motion.h2>

        {/* Tab Navigation */}
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
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => handleTabClick(category)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  activeTab === category
                    ? "bg-[#0F5BBD] text-white shadow-lg"
                    : "border-2 border-[#BBD8FC] text-black dark:text-white hover:border-[#0F5BBD] hover:text-[#0F5BBD] dark:hover:text-[#0F5BBD]"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Template grid here are i watn will be show by swipper slider */}
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {filteredTemplates.length === 0 ? (
              <motion.div 
                className="text-center py-12"
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
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No products found in this category.
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Swiper
                  spaceBetween={20}
                  slidesPerView={1}
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 3,
                    },
                  }}
                  className="templates-swiper"
                >
                  {filteredTemplates.map((template, index) => (
                    <SwiperSlide key={template.id}>
                      <motion.div
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
                        <TemplateCard template={template} />
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/template"
              className="block w-[180px] text-center mx-auto bg-gradient-to-bl from-[#0F5BBD] to-[#0F35A7] border border-[#BDD9FE] text-xs md:text-[16px] px-8 py-3 rounded-lg text-white cursor-pointer"
            >
              Explore More
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
