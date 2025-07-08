import { motion } from "framer-motion";
import Image from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";

interface AnimatedDotProps {
  src: string | StaticImport;
  alt: string;
  className: string;
}

export const AnimatedDots = ({ src, alt, className }: AnimatedDotProps) => (
  <motion.div
    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full ${className}`}
    animate={{
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <Image
      src={src}
      alt={alt}
      className="w-full h-full object-contain"
      draggable={false}
    />
  </motion.div>
);
