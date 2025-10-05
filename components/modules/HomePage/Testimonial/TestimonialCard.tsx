"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import QuoteIcon from "./QuoteIcon";
import dynamic from "next/dynamic";

// Dynamically import StarRatings with no SSR
const StarRatings = dynamic(() => import("react-star-ratings"), {
  ssr: false,
});

interface TestimonialCardProps {
  id: number;
  content: string;
  author: string;
  avatar: {
    src: string;
    alt: string;
  };
}

export default function TestimonialCard({
  id,
  content,
  author,
  avatar,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: id * 0.1 }}
      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative bg-white dark:bg-gray-800 p-6">
        <div className="w-full p-5">
          <QuoteIcon />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-4">
              <StarRatings
                rating={5}
                starRatedColor="#E1AB20"
                starEmptyColor="#E4E4E7"
                starDimension="16px"
                starSpacing="2px"
                numberOfStars={5}
                name={`rating-${id}`}
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              {content}
            </p>
            <div className="flex items-center justify-center">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={avatar.src}
                  alt={avatar.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {author}
                </h4>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 