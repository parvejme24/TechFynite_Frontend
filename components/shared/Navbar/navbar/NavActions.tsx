import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface NavActionsProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const NavActions = ({ isOpen, setIsOpen }: NavActionsProps) => (
  <div className="flex items-center space-x-4">
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative z-[102]"
    >
      <ModeToggle />
    </motion.div>

    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="hidden md:inline-flex"
    >
      <Link
        href={"/login"}
        className="cursor-pointer border border-[#0f5abd85] rounded-md px-4 py-2 shadow"
      >
        Login
      </Link>
    </motion.div>

    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="hidden md:inline-flex"
    >
      <Link href={"/pricing"} className="cursor-pointer">
        <Button className="bg-[#0F5BBD] hover:bg-[#0F5BBD]/90 text-white h-11 cursor-pointer shadow">
          Get Started
        </Button>
      </Link>
    </motion.div>

    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="md:hidden"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="hover:bg-[#0F5BBD]/10"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </motion.div>
  </div>
);
