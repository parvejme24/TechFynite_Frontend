import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/Providers/AuthProvider";
import { useAuth, useCurrentUser } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
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

interface NavActionsProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const NavActions = ({ isOpen, setIsOpen }: NavActionsProps) => {
  const authContext = useContext(AuthContext);
  const { user: nextAuthUser, isAuthenticated } = useAuth();
  const { data: currentUserData } = useCurrentUser();
  
  // Prioritize fresh API data over cached data
  const user = currentUserData?.data?.user || nextAuthUser || authContext?.user;
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const getPhotoUrl = () => {
    if (user && (user as any).avatarUrl) return (user as any).avatarUrl;
    if (user && user.profile?.avatarUrl) return user.profile.avatarUrl;
    return undefined;
  };

  const getDisplayName = () => {
    if (user && user.fullName) return user.fullName;
    if (user && (user as any).name) return (user as any).name;
    return 'User';
  };

  const getInitials = () => {
    const displayName = getDisplayName();
    if (displayName && displayName !== 'User') {
      const names = displayName.trim().split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return displayName[0].toUpperCase();
    }
    return 'U';
  };

  const hasProfilePicture = () => {
    return !!(user && ((user as any).avatarUrl || user.profile?.avatarUrl));
  };

  function getImageUrl(imageUrl?: string) {
    if (!imageUrl) return placeholderImage;
    // For now, return the image URL as-is or use placeholder
    return imageUrl || placeholderImage;
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

      {(user || isAuthenticated) ? (
                   <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen} modal={false}>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center cursor-pointer">
              {hasProfilePicture() ? (
                <Image
                  src={getImageUrl(getPhotoUrl())}
                  alt="User"
                  width={36}
                  height={36}
                  className="rounded-full object-cover aspect-square min-h-[36px] min-w-[36px]"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials()}
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
                     <DropdownMenuContent
             align="end"
             className="w-56 bg-white dark:bg-[#1A1D37] border border-gray-200 dark:border-gray-800"
             sideOffset={8}
             avoidCollisions={true}
           >
            <div className="flex flex-col items-center justify-center py-4">
              {hasProfilePicture() ? (
                <Image
                  src={getImageUrl(getPhotoUrl())}
                  alt="User"
                  width={56}
                  height={56}
                  className="rounded-full object-cover aspect-square min-h-[56px] min-w-[56px] mb-2"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg mb-2">
                  {getInitials()}
                </div>
              )}
              <div className="font-semibold text-base text-gray-900 dark:text-white text-center">
                {getDisplayName()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300 text-center">
                {user?.email || "No email"}
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
                await signOut({ callbackUrl: "/" });
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
