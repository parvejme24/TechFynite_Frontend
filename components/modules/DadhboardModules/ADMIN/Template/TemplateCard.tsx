import Link from "next/link";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Template {
  id: string;
  title: string;
  category: string;
  price: string;
  image: string;
  previewLink: string;
}

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="p-3 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-[#1A1D37]">
      <Image
        src={template.image}
        alt={template.title}
        width={400}
        height={300}
        className="w-full h-[250px] object-cover rounded-lg"
      />
      <div>
        <div className="flex justify-between items-center py-3">
          <motion.h3 
            className="text-[14px] font-semibold mb-2 dark:text-gray-300"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {template.title}
          </motion.h3>
          <motion.span 
            className="text-lg font-bold text-primary"
            animate={{
              color: ["#1e40af", "#3b82f6", "#1e40af"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
          >
            ${template.price}
          </motion.span>
        </div>

        <div className="grid grid-cols-2 gap-5 border-t border-[#c5c5c5] dark:border-[#686868] pt-5">
          <motion.span 
            className="w-full bg-gradient-to-r from-[#BDD9FE] to-[#8AACDA] rounded-lg p-[2px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={`/template/${template.id}`}
              className="bg-white dark:bg-[#1A1D37] w-full h-full py-2 rounded-md text-center flex justify-center items-center"
            >
              View Details
            </Link>
          </motion.span>
          <motion.span 
            className="w-full bg-gradient-to-r from-[#BDD9FE] to-[#8AACDA] rounded-lg p-[2px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={template.previewLink}
              target="_blank"
              className="bg-gradient-to-r text-white from-[#0F59BC] to-[#0F35A7] w-full h-full py-2 flex justify-center items-center rounded-lg"
            >
              Live Demo
            </Link>
          </motion.span>
        </div>
      </div>
    </div>
  );
}
