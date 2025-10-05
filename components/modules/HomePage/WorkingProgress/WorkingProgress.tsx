"use client";

import React from "react";
import ArrowImage from "@/public/images/arrow.png";
import GlowGradiantDark from "@/public/images/glow-dark.png";
import GlowGradiantLight from "@/public/images/glow-light.png";
import Image from "next/image";
import { motion, cubicBezier } from "framer-motion";

interface WorkingStepsData {
  number: number;
  title: string;
  desc: string;
}

const steps: WorkingStepsData[] = [
  {
    number: 1,
    title: "Understanding",
    desc: "Create a new account to work hat strategy",
  },
  {
    number: 2,
    title: "Ideation",
    desc: "Create a new account to work hat strategy",
  },
  {
    number: 3,
    title: "Develop Idea",
    desc: "Create a new account to work hat strategy",
  },
  {
    number: 4,
    title: "User Testing",
    desc: "Create a new account to work hat strategy",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: cubicBezier(0.16, 1, 0.3, 1),
    },
  }),
};

export default function WorkingProcess() {
  return (
    <div className="py-14 dark:bg-[#000424] relative">
      <div className="absolute inset-0 backdrop-blur-[100px] bg-white/95 dark:bg-black/60"></div>

      <div className="relative z-20 container mx-auto max-w-7xl px-4 sm:px-5 lg:px-0">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-[34px] font-bold text-center"
        >
          Our Working Process
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-gray-700 dark:text-gray-200 mt-2 text-[14px]"
        >
          Every month we pick some best products for you.
        </motion.p>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-10 lg:gap-0 mt-14 w-full">
          {steps.map((step, idx) => (
            <React.Fragment key={step.number}>
              <motion.div
                custom={idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col items-center w-full max-w-xs"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] mx-auto border border-[#0F5BBD] dark:border-white rounded-full flex items-center justify-center"
                >
                  <span className="text-5xl md:text-6xl font-bold text-[#0F5BBD] dark:text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                    {step.number}
                  </span>
                </motion.div>
                <div className="text-center space-y-2 mt-3">
                  <h4 className="font-extrabold md:text-[14px]">
                    {step.title}
                  </h4>
                  <p className="text-sm md:text-[14px] font-light text-gray-600 dark:text-[#FFFFFF]">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
              {idx < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 + 0.3 }}
                  className="my-6 lg:my-0 lg:mx-2 flex-shrink-0"
                >
                  <Image
                    src={ArrowImage}
                    alt="Arrow Image"
                    className="my-8 lg:my-0 rotate-90 lg:rotate-0 mx-auto lg:mx-0"
                    draggable={false}
                  />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 z-10">
        <div className="container mx-auto max-w-7xl h-full">
          <Image
            src={GlowGradiantDark}
            alt="Glow Gradient"
            className="absolute top-[20%] md:top-[10%] lg:-top-20 left-0 lg:left-20 dark:block hidden"
          />
          <Image
            src={GlowGradiantDark}
            alt="Glow Gradient"
            className="absolute bottom-[20%] md:bottom-[10%] lg:bottom-0 lg:-top-20 right-0 dark:block hidden"
          />
          <Image
            src={GlowGradiantLight}
            alt="Glow Gradient"
            className="absolute top-[20%] md:top-[10%] lg:-top-20 left-0 lg:left-20 dark:hidden block"
          />
          <Image
            src={GlowGradiantLight}
            alt="Glow Gradient"
            className="absolute bottom-[20%] md:bottom-[10%] lg:bottom-0 lg:-top-20 right-0 lg:left-20 dark:hidden block"
          />
        </div>
      </div>
    </div>
  );
}
