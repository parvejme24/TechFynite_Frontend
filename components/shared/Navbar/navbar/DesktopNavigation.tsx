import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  navigation,
  NavItem,
} from "@/components/shared/Navbar/navbar/constants";

interface DesktopNavigationProps {
  pathname: string;
}

export const DesktopNavigation = ({ pathname }: DesktopNavigationProps) => (
  <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex space-x-10 border  dark:border-[#0F5BBD] px-5 py-2.5 rounded-lg shadow-md"
    >
      {navigation.map((item: NavItem) => (
        <motion.div
          key={item.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Link
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-[#0F5BBD] dark:text-white/80 dark:hover:text-[#0F5BBD]",
              pathname === item.href
                ? "text-[#0F5BBD] dark:text-[#0F5BBD] font-bold"
                : "text-black dark:text-white/90"
            )}
          >
            {item.name}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  </div>
);
