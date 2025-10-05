"use client";
import React, { useState, useEffect } from "react";
import TemplateCard from "../../CommonModules/template/TemplateCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// TypeScript interface for template data
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

export default function NewProducts() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTab, setActiveTab] = useState("All Items");
  const [loading, setLoading] = useState(true);

  // Fetch templates data
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/templates.json");
        const data = await response.json();
        setTemplates(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Get unique categories from templates
  const categories = [
    "All Items",
    ...Array.from(new Set(templates.map((template) => template.category))),
  ];

  // Filter templates based on active tab
  const filteredTemplates =
    activeTab === "All Items"
      ? templates
      : templates.filter((template) => template.category === activeTab);

  const handleTabClick = (category: string) => {
    setActiveTab(category);
  };

  if (loading) {
    return (
      <div className="py-14 bg-gradient-to-b from-[#FAFCFF] dark:from-[#000424] to-[#FAFCFF] dark:to-[#000424]">
        <div className="container mx-auto max-w-7xl px-5 lg:px-0">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5BBD] mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading products...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-14 bg-gradient-to-b from-[#FAFCFF] dark:from-[#000424] to-[#FAFCFF] dark:to-[#000424]">
      <div className="container mx-auto max-w-7xl px-5 lg:px-0">
        <h2 className="text-[34px] font-bold text-center dark:text-white">
          New Arrival Products
        </h2>

        {/* Tab Navigation */}
        <div className="mt-8">
          <div className="flex justify-center overflow-x-auto gap-3 pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleTabClick(category)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  activeTab === category
                    ? "bg-[#0F5BBD] text-white shadow-lg"
                    : "border-2 border-[#BBD8FC] text-black dark:text-white hover:border-[#0F5BBD] hover:text-[#0F5BBD] dark:hover:text-[#0F5BBD]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Template grid here are i watn will be show by swipper slider */}
        <div className="mt-12">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No products found in this category.</p>
            </div>
          ) : (
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
              {filteredTemplates.map((template) => (
                <SwiperSlide key={template.id}>
                  <TemplateCard template={template} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}
