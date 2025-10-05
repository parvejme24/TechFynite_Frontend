"use client";
import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import g1 from "@/assets/pricing/g1.png";
import g2 from "@/assets/pricing/g1.png";
import g3 from "@/assets/pricing/g1.png";
import PayCards from "@/assets/pricing/pay-cards.png";
import { motion } from "framer-motion";

type Guarantee = {
  image: StaticImageData;
  title: string;
  description?: string;
  paymentImage?: StaticImageData;
  alt: string;
};

const guarantees: Guarantee[] = [
  {
    image: g1,
    title: "SSL Secure Payments",
    description:
      "We use industry standard payment systems to facilitate online payments.",
    alt: "SSL Secure Payments",
  },
  {
    image: g2,
    title: "Money Back Guarantee",
    description: "We offer a 30-day money-back guarantee for all our products.",
    alt: "Money Back Guarantee",
  },
  {
    image: g3,
    title: "Accepted Payment Methods",
    paymentImage: PayCards,
    alt: "Accepted Payment Methods",
  },
];

export default function GuaranteesAndPayments() {
  const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  } as const;
  const itemVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
  } as const;
  return (
    <div className="container mx-auto max-w-7xl px-5 lg:px-0">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-14 sm:mt-20 lg:mt-24"
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {guarantees.map((guarantee, index) => (
          <motion.div
            key={index}
            className="flex gap-4 p-4 rounded-lg hover:bg-[#EAF3FF] dark:hover:bg-[#1E2B4D] transition-colors duration-300"
            variants={itemVariants}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <motion.div className="flex-shrink-0" whileHover={{ rotate: 3, scale: 1.05 }}>
              <Image
                src={guarantee.image}
                alt={guarantee.alt}
                draggable={false}
                className="w-[60px] h-[60px] sm:w-14 sm:h-14"
              />
            </motion.div>
            <div>
              <h4 className="text-[21px] sm:text-xl font-bold mb-2">
                {guarantee.title}
              </h4>
              {guarantee.description ? (
                <motion.p className="text-[13px] font-light dark:text-gray-300" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                  {guarantee.description}
                </motion.p>
              ) : (
                <motion.div className="mt-2" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                  <Image
                    src={guarantee.paymentImage!}
                    alt="Payment Methods"
                    className="w-full max-w-[200px] h-auto"
                    draggable={false}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
