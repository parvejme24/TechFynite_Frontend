"use client";
import React, { useMemo } from "react";
import { GoArrowRight } from "react-icons/go";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useGetAllTemplateCategoriesForStats } from "@/hooks/useTemplateCategoryApi";

export default function Categories() {
  const router = useRouter();

  // Fetch dynamic categories from API
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useGetAllTemplateCategoriesForStats();

  // Get categories sorted by template count (most popular first) and limit to top 12
  // Show all categories, but prioritize those with templates
  const categories = useMemo(() => {
    if (!categoriesData?.data) return [];
    return categoriesData.data
      .sort((a, b) => {
        // First sort by template count (categories with templates first)
        if (b.templateCount !== a.templateCount) {
          return b.templateCount - a.templateCount;
        }
        // Then sort by creation date (newest first)
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      .slice(0, 12); // Limit to top 12 categories
  }, [categoriesData]);

  const handleExploreMore = () => {
    router.push("/template");
  };

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/template?categoryId=${categoryId}`);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <motion.div
        className="py-14 bg-gradient-to-b from-[#FAFCFF] dark:from-[#000424] to-[#FAFCFF] dark:to-[#000424]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto max-w-7xl px-5 lg:px-0">
          <motion.div
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </motion.div>
          <div className="mt-5">
            <Swiper
              spaceBetween={20}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 6 },
              }}
              className="categories-swiper"
            >
              {[...Array(6)].map((_, index) => (
                <SwiperSlide key={index}>
                  <div className="p-[1px] bg-gradient-to-t from-[#87A9D6] dark:from-[#04010B] to-[#ABCFFF] dark:to-[#16073F] rounded-xl">
                    <div className="bg-[#F5F9FF] dark:bg-[#1A1D37] border border-[#ABCFFE] dark:border-[#16073E] rounded-xl px-6 py-10">
                      <div className="flex justify-center items-center">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-[67px] h-[67px] animate-pulse" />
                      </div>
                      <div className="mt-3">
                        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse" />
                        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        className="py-14 bg-gradient-to-b from-[#FAFCFF] dark:from-[#000424] to-[#FAFCFF] dark:to-[#000424]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto max-w-7xl px-5 lg:px-0">
          <div className="text-center text-red-500">
            Failed to load categories. Please try again later.
          </div>
        </div>
      </motion.div>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="py-14 bg-gradient-to-b from-[#FAFCFF] dark:from-[#000424] to-[#FAFCFF] dark:to-[#000424]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto max-w-7xl px-5 lg:px-0">
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.h2
            className="md:text-[24px] font-bold dark:text-[#FFFFFF]"
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              backgroundPosition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            style={{
              background:
                "linear-gradient(90deg, #1f2937, #3b82f6, #8b5cf6, #1f2937)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Popular Categories
          </motion.h2>

          <motion.button
            onClick={handleExploreMore}
            className="text-xs md:text-[16px] flex items-center gap-2 text-[#0F5BBD] cursor-pointer hover:underline duration-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore More <GoArrowRight className="md:text-2xl" />
          </motion.button>
        </motion.div>
        <motion.div
          className="mt-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Swiper
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 6,
              },
            }}
            className="categories-swiper"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={category.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.5 + index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: 0.95,
                    y: 5,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="p-[1px] bg-gradient-to-t from-[#87A9D6] dark:from-[#04010B] to-[#ABCFFF] dark:to-[#16073F] rounded-xl">
                    <motion.div
                      className="cursor-pointer bg-[#F5F9FF] dark:bg-[#1A1D37] border border-[#ABCFFE] dark:border-[#16073E] rounded-xl px-6 py-10"
                      whileHover={{
                        scale: 0.98,
                        transition: { duration: 0.2 },
                      }}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <motion.div
                        className="flex justify-center items-center"
                        whileHover={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.span
                          className="bg-[#FFFFFF] dark:bg-[#000424] rounded-full p-4 text-3xl w-[67px] h-[67px] flex justify-center items-center overflow-hidden"
                          whileHover={{ rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.title}
                              width={40}
                              height={40}
                              className="w-[40px] h-[40px] object-contain"
                              onError={(e) => {
                                // Fallback to initial if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const fallback =
                                  target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = "flex";
                              }}
                            />
                          ) : null}
                        </motion.span>
                      </motion.div>
                      <motion.div
                        className="mt-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      >
                        <motion.h4
                          className="font-bold text-center text-lg dark:text-white"
                          whileHover={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          {category.title}
                        </motion.h4>
                        <motion.p
                          className="text-center font-semibold text-[16px]"
                          animate={{
                            color: ["#1e40af", "#3b82f6", "#1e40af"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            scale: { duration: 0.2 },
                          }}
                          whileHover={{ scale: 0.9 }}
                        >
                          {category.templateCount}
                        </motion.p>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </motion.div>
  );
}
