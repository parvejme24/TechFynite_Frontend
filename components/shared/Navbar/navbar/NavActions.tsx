import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useContext, useState } from "react";
import { AuthContext } from "@/Provider/AuthProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavActionsProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const NavActions = ({ isOpen, setIsOpen }: NavActionsProps) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const logOut = authContext?.logOut;
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex items-center space-x-4">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative z-[102]"
      >
        <ModeToggle />
      </motion.div>

      {user ? (
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center cursor-pointer">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="User"
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-gray-700 dark:text-gray-200">
                  {(
                    user.displayName?.[0] ||
                    user.email?.[0] ||
                    "U"
                  ).toUpperCase()}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white dark:bg-[#1A1D37] border border-gray-200 dark:border-gray-800"
          >
            <div className="flex flex-col items-center justify-center py-4">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="User"
                  width={56}
                  height={56}
                  className="rounded-full object-cover mb-2"
                />
              ) : (
                <span className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">
                  {(
                    user.displayName?.[0] ||
                    user.email?.[0] ||
                    "U"
                  ).toUpperCase()}
                </span>
              )}
              <div className="font-semibold text-base text-gray-900 dark:text-white text-center">
                {user.displayName || "User"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300 text-center">
                {user.email || "No email"}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400"
              onClick={async () => {
                if (logOut) {
                  await logOut();
                  localStorage.clear();
                  router.push("/login");
                }
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
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
        </>
      )}

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
};
