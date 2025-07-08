import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const statData = [
  {
    count: 12,
    title: "Projects",
    style: { className: "bg-blue-100 text-blue-800", animationDelay: 0 },
  },
  {
    count: 34,
    title: "Clients",
    style: { className: "bg-green-100 text-green-800", animationDelay: 0.2 },
  },
  {
    count: 56,
    title: "Awards",
    style: { className: "bg-yellow-100 text-yellow-800", animationDelay: 0.4 },
  },
  {
    count: 78,
    title: "Partners",
    style: { className: "bg-purple-100 text-purple-800", animationDelay: 0.6 },
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
