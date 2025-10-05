import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import { FaSearch } from "react-icons/fa";

import TemplatesImage from "@/public/images/templates.png";
import FigmaLogo from "@/public/images/figma.png";

import Framer from "@/public/icons/framer.png";
import Figma from "@/public/icons/figma.png";
import Webflow from "@/public/icons/nodejs.png";
import Bootstrap from "@/public/icons/bootstrap.png";
import NodeJS from "@/public/icons/nodejs.png";
import CSS from "@/public/icons/css.png";
import HTML from "@/public/icons/html.png";
import JavaScript from "@/public/icons/js.png";
import ReactIcon from "@/public/icons/react.png";
import WordPress from "@/public/icons/wordpress.png";

import { StatCard } from "../../common/StatCard/StatCard,";

const icons = [
  {
    id: 1,
    icon: Framer,
  },
  {
    id: 2,
    icon: Figma,
  },
  {
    id: 3,
    icon: Webflow,
  },
  {
    id: 4,
    icon: ReactIcon,
  },
  {
    id: 5,
    icon: Bootstrap,
  },
  {
    id: 6,
    icon: JavaScript,
  },
  {
    id: 7,
    icon: HTML,
  },
  {
    id: 8,
    icon: CSS,
  },
  {
    id: 9,
    icon: WordPress,
  },
  {
    id: 10,
    icon: NodeJS,
  },
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
