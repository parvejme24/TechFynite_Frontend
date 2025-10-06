"use client";

import React from "react";
import ArrowImage from "@/assets/images/arrow.png";
import GlowGradiantDark from "@/assets/images/glow-dark.png";
import GlowGradiantLight from "@/assets/images/glow-light.png";
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
    <motion.div
      className="py-14 dark:bg-[#000424] relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="absolute inset-0 backdrop-blur-[100px] bg-white/95 dark:bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      <div className="relative z-20 container mx-auto max-w-7xl px-4 sm:px-5 lg:px-0">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-[34px] font-bold text-center"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 0.5,
            backgroundPosition: {
              duration: 3,
              repeat: Infinity,
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
          Our Working Process
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-gray-700 dark:text-gray-200 mt-2 text-[14px]"
        >
          Every month we pick some best products for you.
        </motion.p>

        <motion.div
          className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-10 lg:gap-0 mt-14 w-full"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {steps.map((step, idx) => (
            <React.Fragment key={step.number}>
              <motion.div
                custom={idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col items-center w-full max-w-xs"
                whileHover={{
                  scale: 0.95,
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.div
                  whileHover={{
                    scale: 0.9,
                    rotate: 5,
                    transition: { duration: 0.2 },
                  }}
                  className="relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] mx-auto border border-[#0F5BBD] dark:border-white rounded-full flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(15, 91, 189, 0.4)",
                      "0 0 0 10px rgba(15, 91, 189, 0.1)",
                      "0 0 0 0 rgba(15, 91, 189, 0.4)",
                    ],
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <motion.span
                    className="text-5xl md:text-6xl font-bold text-[#0F5BBD] dark:text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: idx * 0.5,
                    }}
                  >
                    {step.number}
                  </motion.span>
                </motion.div>
                <motion.div
                  className="text-center space-y-2 mt-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                >
                  <motion.h4
                    className="font-extrabold md:text-[14px]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step.title}
                  </motion.h4>
                  <motion.p
                    className="text-sm md:text-[14px] font-light text-gray-600 dark:text-[#FFFFFF]"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step.desc}
                  </motion.p>
                </motion.div>
              </motion.div>
              {idx < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 + 0.3 }}
                  className="my-6 lg:my-0 lg:mx-2 flex-shrink-0"
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.2 },
                  }}
                >
                  <motion.div
                    animate={{
                      x: [0, 5, 0],
                      y: [0, -2, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: idx * 0.3,
                    }}
                  >
                    <Image
                      src={ArrowImage}
                      alt="Arrow Image"
                      className="my-8 lg:my-0 rotate-90 lg:rotate-0 mx-auto lg:mx-0"
                      draggable={false}
                    />
                  </motion.div>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="absolute inset-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="container mx-auto max-w-7xl h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Image
              src={GlowGradiantDark}
              alt="Glow Gradient"
              className="absolute top-[20%] md:top-[10%] lg:-top-20 left-0 lg:left-20 dark:block hidden"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Image
              src={GlowGradiantDark}
              alt="Glow Gradient"
              className="absolute bottom-[20%] md:bottom-[10%] lg:bottom-0 lg:-top-20 right-0 dark:block hidden"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Image
              src={GlowGradiantLight}
              alt="Glow Gradient"
              className="absolute top-[20%] md:top-[10%] lg:-top-20 left-0 lg:left-20 dark:hidden block"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Image
              src={GlowGradiantLight}
              alt="Glow Gradient"
              className="absolute bottom-[20%] md:bottom-[10%] lg:bottom-0 lg:-top-20 right-0 lg:left-20 dark:hidden block"
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
