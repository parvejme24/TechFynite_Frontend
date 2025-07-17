import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/common/logo.png";
import { menuVariants, backdropVariants } from "./constants";
import { MobileSearch } from "./MobileSearch";
import { MobileNavItems } from "./MobileNavItems";

interface MobileNavigationProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  pathname: string;
}

export const MobileNavigation = ({
  isOpen,
  setIsOpen,
  searchQuery,
  setSearchQuery,
  handleSearch,
  pathname,
}: MobileNavigationProps) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={backdropVariants}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-[98] md:hidden left-0"
        />

        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="md:hidden fixed top-0 left-0 w-[280px] h-screen bg-[#F7FAFF] dark:bg-[#000424] backdrop-blur z-[99] shadow-xl"
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-end p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="hover:bg-[#0F5BBD]/10"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex items-center px-5">
              <Image src={Logo} alt="Techfyite Logo" className="w-8" />
              <h3 className="font-extrabold text-xl">TechFynite</h3>
            </div>

            <MobileSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />

            <MobileNavItems pathname={pathname} setIsOpen={setIsOpen} />

            <div className="p-4 border-t dark:border-[#1A1D37]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href={"/register"}>
                  <Button className="w-full justify-center bg-[#0F5BBD] hover:bg-[#0F5BBD]/90 text-white">
                    Register
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
