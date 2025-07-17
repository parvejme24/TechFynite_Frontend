import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { navigation, menuItemVariants } from "./constants";

interface MobileNavItemsProps {
  pathname: string;
  setIsOpen: (value: boolean) => void;
}

export const MobileNavItems = ({ pathname, setIsOpen }: MobileNavItemsProps) => (
  <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
    {navigation.map((item, i) => (
      <motion.div
        key={item.name}
        custom={i}
        variants={menuItemVariants}
        initial="closed"
        animate="open"
        exit="closed"
        className="relative"
      >
        <Link
          href={item.href}
          className={cn(
            "block px-3 py-3 text-base font-medium transition-colors relative z-10 rounded-lg",
            pathname === item.href
              ? "bg-[#0F5BBD]/30 text-[#0F5BBD] dark:bg-[#0F5BBD]/20 dark:text-[#0F5BBD] font-semibold"
              : "text-foreground/60 dark:text-white/60 hover:bg-[#0F5BBD]/5 hover:text-[#0F5BBD] dark:hover:bg-[#0F5BBD]/10"
          )}
          onClick={() => setIsOpen(false)}
        >
          {item.name}
        </Link>
      </motion.div>
    ))}
  </div>
); 