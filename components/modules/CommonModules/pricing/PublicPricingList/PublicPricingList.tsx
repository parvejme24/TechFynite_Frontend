"use client";
import React from "react";
import PricingCard from "./PricingCard/PricingCard";
import { motion } from "framer-motion";

const pricingList = [
  {
    id: 1,
    title: "Personal",
    description: "3 Website Licenses",
    price: "10",
    recommended: false,
    features: [
      "Access to All Templates",
      "SP Page Builder Pro",
      "Access to All Extensions",
      "Access to All Layout Bundles",
      "3 Websites License",
      "1 Year Support & Updates",
    ],
  },
  {
    id: 2,
    title: "Business",
    description: "10 Website Licenses",
    price: "199",
    recommended: true,
    features: [
      "Access to All Templates",
      "SP Page Builder Pro",
      "Access to All Extensions",
      "Access to All Layout Bundles",
      "10 Websites License",
      "1 Year Support & Updates",
    ],
  },
  {
    id: 3,
    title: "Agency",
    description: "Unlimited Website Licenses",
    price: "499",
    recommended: false,
    features: [
      "Access to All Templates",
      "SP Page Builder Pro",
      "Access to All Extensions",
      "Access to All Layout Bundles",
      "Unlimited Websites License",
      "1 Year Support & Updates",
    ],
  },
];

export default function PublicPricingList() {
  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  } as const;

  const cardsVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  } as const;

  const cardItemVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
  } as const;

  return (
    <div>
      <div className="container mx-auto max-w-7xl px-5 lg:px-0 py-14">
        <motion.div
          className="max-w-[700px] mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-3 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ 
              duration: 0.5, 
              delay: 0.2,
              backgroundPosition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            style={{
              background: "linear-gradient(90deg, #1f2937, #3b82f6, #8b5cf6, #1f2937)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Pricing Plans
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 dark:text-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ 
              scale: 1.01,
              transition: { duration: 0.2 }
            }}
          >
            Worried about choosing the right package? Choose from multiple
            pricing options and get your project off the bench with the pricing
            plan that works best for you.
          </motion.p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
          variants={cardsVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {pricingList.map((item) => (
            <motion.div
              key={item.id}
              className={item.recommended ? "relative" : "relative"}
              variants={cardItemVariants}
            >
              <PricingCard plan={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
