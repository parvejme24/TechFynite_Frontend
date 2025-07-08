import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const statData = [
  {
    title: "Community user",
    count: 10,
    style: {
      className:
        "top-24 sm:top-32 lg:top-48 left-12 sm:left-24 lg:left-48 border-[#FFFFFF] bg-[#0F5BBD] text-white p-3 sm:p-4 md:p-5 z-20",
    },
  },
  {
    title: "Active Visitor",
    count: 6,
    style: {
      className:
        "top-8 sm:top-12 md:top-16 right-4 sm:-right-6 md:-right-10 border-[#126BCF] bg-white text-[#126BCF] px-3 sm:px-4 md:px-5 py-4 sm:py-6 md:py-8 z-20",
      animationDelay: 1,
    },
  },
];

const useCountAnimation = (targetValue: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const currentCount = Math.floor(progress * targetValue);
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, duration]);

  return count;
};

interface StatCardProps {
  index: number;
  className?: string;
  animationDelay?: number;
  width?: string;
  height?: string;
}

export const StatCard = ({
  index,
  className,
  animationDelay,
  width = "110px",
  height = "110px",
}: StatCardProps) => {
  const count = useCountAnimation(statData[index].count);
  const defaultStyle = statData[index].style;

  return (
    <motion.div
      className={`absolute border shadow-2xl rounded-xl text-center inline-block ${
        className || defaultStyle.className
      }`}
      style={{ width, height }}
      animate={{ y: [0, -15, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: animationDelay || defaultStyle.animationDelay || 0,
      }}
    >
      <div className="h-full flex flex-col justify-center items-center">
        <h2 className="text-[35px] font-extrabold">
          {count.toLocaleString()}K
        </h2>
        <p className="text-[13px]">{statData[index].title}</p>
      </div>
    </motion.div>
  );
};
