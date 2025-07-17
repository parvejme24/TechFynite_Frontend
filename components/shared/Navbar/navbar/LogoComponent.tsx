import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Logo from "@/assets/common/logo.png";

export const LogoComponent = () => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="flex items-center"
  >
    <Link href="/" className="flex items-center space-x-2">
      <Image src={Logo} alt="TechFynite Logo" className="h-8 w-auto" />
      <span className="text-xl font-bold dark:text-white">TechFynite</span>
    </Link>
  </motion.div>
); 