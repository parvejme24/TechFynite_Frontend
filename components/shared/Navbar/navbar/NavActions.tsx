import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useContext, useState, useEffect } from "react";
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
import placeholderImage from "@/assets/common/placeholder.png";
import useApiBaseUrl from "@/hooks/useApiBaseUrl";
import { useAuth } from "@/hooks/useAuth";

interface NavActionsProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const NavActions = ({ isOpen, setIsOpen }: NavActionsProps) => {
  const authContext = useContext(AuthContext);
  const { getCurrentUser } = useAuth();
  const authContextUser = authContext?.user;
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser().then((user) => {
      setCurrentUser(user);
    });
  }, [getCurrentUser]);

  const user = currentUser || authContextUser;
  const getPhotoUrl = () => {
    if (user && user.photoUrl) return user.photoUrl;
    if (user && user.photoURL) return user.photoURL;
    return undefined;
  };
  const getDisplayName = () => {
    if (user && user.displayName) return user.displayName;
    return 'User';
  };
  const logOut = authContext?.logOut;
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const API_BASE_URL = useApiBaseUrl();
  function getImageUrl(imageUrl?: string) {
    if (!imageUrl) return placeholderImage;
    if (imageUrl.startsWith('/uploads/')) {
      const baseUrl = API_BASE_URL.replace('/api/v1', '');
      return `${baseUrl}${imageUrl}`;
    }
    return imageUrl;
  }

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
              <Image
                src={getImageUrl(getPhotoUrl())}
                alt="User"
                width={36}
                height={36}
                className="rounded-full object-cover aspect-square min-h-[36px] min-w-[36px]"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white dark:bg-[#1A1D37] border border-gray-200 dark:border-gray-800"
          >
            <div className="flex flex-col items-center justify-center py-4">
              <Image
                src={getImageUrl(getPhotoUrl())}
                alt="User"
                width={56}
                height={56}
                className="rounded-full object-cover aspect-square min-h-[56px] min-w-[56px] mb-2"
              />
              <div className="font-semibold text-base text-gray-900 dark:text-white text-center">
                {getDisplayName()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300 text-center">
                {user.email || "No email"}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}
              className="cursor-pointer"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 cursor-pointer"
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
          className="hover:bg-[#0F5BBD]/10 cursor-pointer"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </motion.div>
    </div>
  );
};
