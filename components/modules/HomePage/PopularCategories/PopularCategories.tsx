"use client";
import React from "react";
import { GoArrowRight } from "react-icons/go";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useRouter } from "next/navigation";

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
];

import Image from "next/image";

export default function Categories() {
  const router = useRouter();

  const handleExploreMore = () => {
    router.push("/products");
  };

  return (
    <div className="py-14 bg-gradient-to-b from-[#FAFCFF] dark:from-[#000424] to-[#FAFCFF] dark:to-[#000424]">
      <div className="container mx-auto max-w-7xl px-5 lg:px-0">
        <div className="flex justify-between items-center">
          <h2 className="md:text-[24px] font-bold dark:text-[#FFFFFF]">
            Popular Categories
          </h2>

          <button
            onClick={handleExploreMore}
            className="text-xs md:text-[16px] flex items-center gap-2 text-[#0F5BBD] cursor-pointer hover:underline duration-300"
          >
            Explore More <GoArrowRight className="md:text-2xl" />
          </button>
        </div>
        <div className="mt-5">
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
            {categories.map((item) => (
              <SwiperSlide key={item.id}>
                <div>
                  <div className="p-[1px] bg-gradient-to-t from-[#87A9D6] dark:from-[#04010B] to-[#ABCFFF] dark:to-[#16073F] rounded-xl">
                    <div className="cursor-pointer bg-[#F5F9FF] dark:bg-[#1A1D37] border border-[#ABCFFE] dark:border-[#16073E] rounded-xl px-6 py-10">
                      <div className="flex justify-center items-center">
                        <span className="bg-[#FFFFFF] dark:bg-[#000424] rounded-full p-4 text-3xl w-[67px] h-[67px] flex justify-center items-center">
                          <Image
                            src={item.icon}
                            alt="category image"
                            className="w-[40px] h-auto"
                          />
                        </span>
                      </div>
                      <div className="mt-3">
                        <h4 className="font-bold text-center text-lg">
                          {item.name}
                        </h4>
                        <p className="text-center font-semibold text-[16px]">
                          {item.count}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
