"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Layout,
  Code2,
  Figma,
  Globe,
  Layers,
  Database,
} from "lucide-react";

const servicesData = [
  {
    id: 1,
    icon: <Layout className="w-8 h-8" />,
    title: "UI/UX Design",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    icon: <Code2 className="w-8 h-8" />,
    title: "React Development",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 3,
    icon: <Figma className="w-8 h-8" />,
    title: "Framer Motion",
    color: "from-pink-500 to-pink-600",
  },
  {
    id: 4,
    icon: <Globe className="w-8 h-8" />,
    title: "WordPress Development",
    color: "from-green-500 to-green-600",
  },
  {
    id: 5,
    icon: <Layers className="w-8 h-8" />,
    title: "Full Stack Development",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 6,
    icon: <Database className="w-8 h-8" />,
    title: "Webflow Development",
    color: "from-red-500 to-red-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Services() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center md:items-center gap-5"
        >
          {servicesData.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group relative bg-[#EAF3FF] dark:bg-[#1A1D37] rounded-xl shadow transition-all duration-300 md:w-[270px] md:h-[170px] md:flex md:flex-col md:justify-center md:items-center p-6 md:p-0"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}
              />
              <div className="relative z-10">
                <div className="flex justify-center">
                  <div
                    className={`inline-block p-3 rounded-lg bg-gradient-to-r ${service.color} text-white mb-4`}
                  >
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-sm md:text-xl font-semibold mb-2 text-center">
                  {service.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
