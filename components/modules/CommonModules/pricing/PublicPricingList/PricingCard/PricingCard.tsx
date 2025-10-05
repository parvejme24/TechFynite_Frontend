import { Badge } from "@/components/ui/badge";
import React from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

interface Pricing {
  id: number;
  title: string;
  description: string;
  price: string;
  recommended: boolean;
  features: string[];
}

export default function PricingCard({ plan }: { plan: Pricing }) {
  const featureVariants = {
    hidden: { opacity: 0, x: -8 },
    show: { opacity: 1, x: 0 },
  } as const;

  return (
    <motion.div
      className={`relative rounded-lg border ${
        plan.recommended
          ? "border-[#0F59BC] shadow-lg"
          : "border-gray-200 dark:border-gray-700"
      } bg-white dark:bg-[#0B1026]`}
      whileHover={{ y: -8, boxShadow: plan.recommended ? "0 20px 40px rgba(15,89,188,0.25)" : "0 16px 28px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge
            variant="outline"
            className="border-blue-600 text-blue-600 bg-white"
          >
            Recommended
          </Badge>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-center text-[#0F59BC] dark:text-[#71A1FF]">
          {plan.title}
        </h3>
        <p className="text-center mt-2 text-gray-600 dark:text-gray-300">
          {plan.description}
        </p>
        <p className="text-center text-4xl font-bold py-5 dark:text-white">
          ${plan.price}
        </p>
      </div>
      <hr />
      <motion.ul className="p-6 space-y-2" initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ staggerChildren: 0.06 }}>
        {plan.features.map((feature) => (
          <motion.li
            key={feature}
            className="flex items-center gap-2 text-gray-800 dark:text-gray-200"
            variants={featureVariants}
          >
            <FaCheck className="text-green-500 text-lg" /> {feature}
          </motion.li>
        ))}
      </motion.ul>

      <div className="p-6 w-full">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            className={`cursor-pointer w-full py-5 ${
            plan.recommended
              ? "bg-gradient-to-b from-[#0F59BC] to-[#0F35A7] text-white"
              : "bg-transparent border-2 border-[#0F5BBD] text-[#0F5BBD] dark:text-[#71A1FF] dark:border-[#284F99] hover:bg-gradient-to-b from-[#0F59BC] to-[#0F35A7] hover:text-white duration-300"
            }`}
          >
            Buy Now
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
