"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

import TemplatesImage from "@/assets/images/templates.png";
import FigmaLogo from "@/assets/images/figma.png";

// Using public image path strings to avoid missing asset imports

import StatImage from "@/assets/common/stat.png";

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
    <div className="min-h-screen lg:h-[80vh] bg-gradient-to-tl from-[#FFFFFF] dark:to-[#000000] via-[#E9F0FF] dark:via-[#121B3B] to-[#FFFFFF] dark:from-[#000000] py-8 sm:py-16 lg:py-24 flex justify-center items-center relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-300 dark:bg-blue-800 rounded-full opacity-40 dark:opacity-20"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-purple-300 dark:bg-purple-800 rounded-lg opacity-40 dark:opacity-20"
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-12 h-12 bg-green-300 dark:bg-green-800 rounded-full opacity-40 dark:opacity-20"
          animate={{
            y: [0, -25, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-1/3 w-14 h-14 bg-yellow-300 dark:bg-yellow-800 rounded-lg opacity-40 dark:opacity-20"
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-5 w-8 h-8 bg-pink-300 dark:bg-pink-800 rounded-full opacity-40 dark:opacity-20"
          animate={{
            y: [0, -15, 0],
            x: [0, 25, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
        <motion.div
          className="absolute top-1/3 right-10 w-10 h-10 bg-indigo-300 dark:bg-indigo-800 rounded-lg opacity-40 dark:opacity-20"
          animate={{
            y: [0, 20, 0],
            x: [0, -20, 0],
            rotate: [0, -90, -180, -270, -360],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "linear",
            delay: 3,
          }}
        />

        {/* Animated particles */}
        {[...Array(15)].map((_, i) => {
          // Use fixed positions to avoid hydration mismatch
          const positions = [
            { left: 10, top: 20 }, { left: 25, top: 15 }, { left: 40, top: 30 },
            { left: 60, top: 10 }, { left: 80, top: 25 }, { left: 15, top: 45 },
            { left: 35, top: 60 }, { left: 55, top: 50 }, { left: 75, top: 40 },
            { left: 90, top: 60 }, { left: 20, top: 75 }, { left: 45, top: 80 },
            { left: 65, top: 70 }, { left: 85, top: 85 }, { left: 5, top: 50 }
          ];
          const pos = positions[i] || { left: 50, top: 50 };
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-500 dark:bg-blue-300 rounded-full opacity-80 dark:opacity-60"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + (i * 0.2),
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Interactive floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-blue-400/30 to-purple-400/30 dark:from-blue-600/20 dark:to-purple-600/20 rounded-full blur-xl"
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.3, 0.6, 0.4, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-pink-400/30 to-yellow-400/30 dark:from-pink-600/20 dark:to-yellow-600/20 rounded-full blur-lg"
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 25, -15, 0],
            scale: [1, 0.7, 1.3, 1],
            opacity: [0.2, 0.5, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Animated gradient waves */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
          }}
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 60%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 60%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating tech icons */}
        <motion.div
          className="absolute top-10 right-1/4 w-8 h-8 bg-white/20 dark:bg-white/10 rounded-lg flex items-center justify-center"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-1/5 w-6 h-6 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center"
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
            rotate: [0, -90, -180],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-10 w-7 h-7 bg-white/20 dark:bg-white/10 rounded-lg flex items-center justify-center"
          animate={{
            y: [0, -10, 0],
            x: [0, -15, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
            delay: 2,
          }}
        >
          <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
        </motion.div>

        {/* Animated grid pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15, 91, 189, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 91, 189, 0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "50px 50px"],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      <div className="h-full before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(to_right,#0F5BBD_1px,transparent_1px),linear-gradient(to_bottom,#0F5BBD_1px,transparent_1px)] before:bg-[size:60px_60px] before:opacity-10">
        <div className="mt-[30px] container mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 py-4 sm:py-6 lg:py-10 flex flex-col-reverse md:flex-row md:grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* Left side content with animations */}
          <motion.div
            className="z-10 px-10 md:px-0 w-[400px] md:w-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main heading with gradient text animation */}
            <motion.h2
              className="text-[24px] sm:text-[30px] md:text-[40px] lg:text-[50px] xl:text-[64px] leading-tight font-bold text-center md:text-left"
              initial={{ opacity: 0, y: -30 }}
              animate={{
                opacity: 1,
                y: 0,
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 0.6,
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
              2M+ Curated Digital Products
            </motion.h2>
            {/* Description paragraph with hover effect */}
            <motion.p
              className="mt-3 sm:mt-4 lg:mt-5 text-[12px] sm:text-[14px] md:text-[16px] dark:text-[#FFFFFF] text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              Explore the best premium themes and plugins available for sale.
              Our unique collection is hand-curated by experts. Find and buy the
              perfect premium theme today.
            </motion.p>
            {/* Search field container with animations */}
            <motion.div
              className="flex items-center my-3 sm:my-4 lg:my-5 w-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {/* Search input with hover effects */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
              <Input
                type="text"
                  className="px-3 sm:px-4 lg:px-5 py-3 sm:py-4 lg:py-6 border-none rounded-xl bg-white dark:bg-white text-black italic text-sm sm:text-base"
                placeholder="Search Theme, Template & More..."
              />
              </motion.div>
              {/* Search button with pulsing animation */}
              <motion.span
                className="-ml-8 sm:-ml-10 lg:-ml-12 bg-[#3273C7] rounded-full p-1.5 sm:p-2 text-white inline-block z-10"
                whileHover={{
                  scale: 1.05,
                  rotate: 3,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(50, 115, 199, 0.4)",
                    "0 0 0 8px rgba(50, 115, 199, 0.1)",
                    "0 0 0 0 rgba(50, 115, 199, 0.4)",
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <FaSearch />
              </motion.span>
            </motion.div>

            {/* Tech stack icons marquee - continuous scrolling animation */}
            <div className="relative overflow-hidden mt-4 sm:mt-6 lg:mt-8">
              <motion.div
                className="flex items-center gap-2 sm:gap-3 lg:gap-4 whitespace-nowrap"
                animate={{
                  x: [0, -100 * icons.length],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {/* First set of tech icons */}
              {icons.map((icon) => (
                  <motion.div
                  key={icon.id}
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-[#FFFFFF] dark:bg-gray-800 flex justify-center items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer flex-shrink-0"
                    whileHover={{
                      scale: 1.1,
                      y: -5,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Image
                      src={icon.icon}
                      alt={icon.id.toString()}
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 object-contain p-[1px]"
                    />
                  </motion.div>
                ))}
                {/* Duplicate set for seamless infinite loop */}
                {icons.map((icon) => (
                  <motion.div
                    key={`duplicate-${icon.id}`}
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-[#FFFFFF] dark:bg-gray-800 flex justify-center items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer flex-shrink-0"
                    whileHover={{
                      scale: 1.1,
                      y: -5,
                      transition: { duration: 0.2 },
                    }}
                >
                  <Image
                    src={icon.icon}
                    alt={icon.id.toString()}
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 object-contain p-[1px]"
                  />
                  </motion.div>
              ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - hero image and floating elements */}
          <div className="relative flex items-center justify-center w-full">
            <Image
              src={TemplatesImage}
              alt="Templates"
              className="w-[90%] md:w-full"
            />
            {/* Floating Figma logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 0.6, 
                delay: 1,
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                rotate: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{ 
                scale: 1.1,
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="absolute top-10 right-5"
            >
              <Image
                src={FigmaLogo}
                alt="Figma"
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                draggable={false}
              />
            </motion.div>
            {/* Community stats card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 0.8, 
                delay: 1.2,
                type: "spring",
                stiffness: 100,
                damping: 15,
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Image
                src={StatImage}
                alt="Stat"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-[110px] md:h-[110px]"
                draggable={false}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
