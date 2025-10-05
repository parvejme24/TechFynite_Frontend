"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import { FaSearch } from "react-icons/fa";

import TemplatesImage from "@/assets/images/templates.png";
import FigmaLogo from "@/assets/images/figma.png";

// Using public image path strings to avoid missing asset imports

import { StatCard } from "../../common/StatCard/StatCard,";

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

const icons = [
  { id: 1, icon: FramerIcon },
  { id: 2, icon: FigmaIcon },
  { id: 3, icon: WebflowIcon },
  { id: 4, icon: JsIcon },
  { id: 5, icon: ReactIcon },
  { id: 6, icon: PhpIcon },
  { id: 7, icon: HtmlIcon },
  { id: 8, icon: NodejsIcon },
  { id: 9, icon: CssIcon },
  { id: 10, icon: WordpressIcon },
  { id: 11, icon: BootstrapIcon },
];

export default function Banner() {
  return (
    <div className="min-h-screen bg-gradient-to-tl from-[#FFFFFF] dark:to-[#000000] via-[#E9F0FF] dark:via-[#121B3B] to-[#FFFFFF] dark:from-[#000000] py-24 flex justify-center items-center relative">
      <div className="h-full before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(to_right,#0F5BBD_1px,transparent_1px),linear-gradient(to_bottom,#0F5BBD_1px,transparent_1px)] before:bg-[size:60px_60px] before:opacity-10">
        <div className="lg:mt-[-150px] container mx-auto max-w-7xl px-4 lg:px-0 py-10 flex flex-col-reverse md:flex-row md:grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="z-10">
            <h2 className="text-[30px] leading-tight lg:text-[64px] font-bold">
              2M+ Curated Digital Products
            </h2>
            <p className="mt-5 text-[14px] dark:text-[#FFFFFF]">
              Explore the best premium themes and plugins available for sale.
              Our unique collection is hand-curated by experts. Find and buy the
              perfect premium theme today.
            </p>
            <div className="flex items-center my-5">
              <Input
                type="text"
                className="px-5 py-6 border-none rounded-xl bg-white dark:bg-white text-black italic"
                placeholder="Search Theme, Template & More..."
              />
              <span className="-ml-12 bg-[#3273C7] rounded-full p-2 text-white inline-block">
                <FaSearch />
              </span>
            </div>

            {/* tech icons  */}
            <div className="flex items-center gap-2 flex-wrap">
              {icons.map((icon) => (
                <div
                  key={icon.id}
                  className="w-12 h-12 rounded-full bg-[#FFFFFF] dark:bg-gray-800 flex justify-center items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <Image
                    src={icon.icon}
                    alt={icon.id.toString()}
                    className="w-7 h-7 object-contain p-[1px]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* right side  */}
          <div className="relative flex items-center justify-center">
            <Image src={TemplatesImage} alt="Templates" />
            {/* this is will be animated every moment */}
            <Image
              src={FigmaLogo}
              alt="Figma"
              className="absolute top-10 right-5"
            />
            <StatCard
              index={0}
              count={"10K"}
              title="community user"
              className="top-1/2 transform -translate-y-1/2  bg-[#0F5BBD] text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
