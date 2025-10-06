"use client";
import React from "react";
import { GoArrowRight } from "react-icons/go";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import FramerIcon from "@/assets/tech-icons/framer.png";
import FigmaIcon from "@/assets/tech-icons/figma.png";
import WebflowIcon from "@/assets/tech-icons/webflow.png";
import JsIcon from "@/assets/tech-icons/js.png";
import ReactIcon from "@/assets/tech-icons/react.png";
import PhpIcon from "@/assets/tech-icons/php.png";
import HtmlIcon from "@/assets/tech-icons/html.png";
import NodejsIcon from "@/assets/tech-icons/nodejs.png";
import CssIcon from "@/assets/tech-icons/css.png";
import BootstrapIcon from "@/assets/tech-icons/bootstrap.png";
import WordpressIcon from "@/assets/tech-icons/wordpress.png";

interface CategoriesData {
  id: string;
  name: string;
  icon: any;
  count: number;
}

const categories: CategoriesData[] = [
  {
    id: "figma",
    name: "Figma",
    icon: FigmaIcon,
    count: 24,
  },
  {
    id: "framer",
    name: "Framer",
    icon: FramerIcon,
    count: 24,
  },
  {
    id: "webflow",
    name: "WebFlow",
    icon: WebflowIcon,
    count: 18,
  },
  {
    id: "JS",
    name: "JS",
    icon: JsIcon,
    count: 32,
  },
  {
    id: "nodejs",
    name: "NodeJS",
    icon: NodejsIcon,
    count: 15,
  },
  {
    id: "bootstrap",
    name: "Bootstrap",
    icon: BootstrapIcon,
    count: 28,
  },
  {
    id: "html",
    name: "HTML",
    icon: HtmlIcon,
    count: 20,
  },
  {
    id: "css",
    name: "CSS",
    icon: CssIcon,
    count: 16,
  },
  {
    id: "wordpress",
    name: "WordPress",
    icon: WordpressIcon,
    count: 22,
  },
  {
    id: "react",
    name: "React",
    icon: ReactIcon,
    count: 22,
  },
  {
    id: "php",
    name: "PHP",
    icon: PhpIcon,
    count: 22,
  },
];

import Image from "next/image";

export default function Categories() {
  const router = useRouter();

  const handleExploreMore = () => {
    router.push("/template");
  };

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
            {categories.map((item, index) => (
              <SwiperSlide key={item.id}>
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
                    >
                      <motion.div
                        className="flex justify-center items-center"
                        whileHover={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.span
                          className="bg-[#FFFFFF] dark:bg-[#000424] rounded-full p-4 text-3xl w-[67px] h-[67px] flex justify-center items-center"
                          whileHover={{ rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Image
                            src={item.icon}
                            alt="category image"
                            className="w-[40px] h-auto"
                          />
                        </motion.span>
                      </motion.div>
                      <motion.div
                        className="mt-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      >
                        <motion.h4
                          className="font-bold text-center text-lg"
                          whileHover={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.name}
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
                          {item.count}
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
