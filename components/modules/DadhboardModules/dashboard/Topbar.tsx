"use client";

import React, { useState, useEffect } from "react";
import { FiSearch, FiBell, FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/Provider/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const authContext = React.useContext(AuthContext);
  const { user: nextAuthUser, isAuthenticated } = useAuth();
  const user = nextAuthUser || authContext?.user;
  const router = useRouter();

  // Console log user data when user changes
  React.useEffect(() => {
    if (user) {
      console.log("🔐 Topbar - User Data:", {
        id: user.id,
        fullName: user.fullName,
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        provider: user.provider,
        image: user.image,
        photoUrl: user.photoUrl,
        isAuthenticated,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt
      });
    } else {
      console.log("🔐 Topbar - No user data");
    }
  }, [user, isAuthenticated]);

  // Only show theme toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDisplayName = () => {
    if (user && user.fullName) return user.fullName;
    if (user && user.displayName) return user.displayName;
    if (user && user.name) return user.name;
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
    return !!(user && (user.photoUrl || user.photoURL || user.image));
  };

  const getPhotoUrl = () => {
    if (user && user.photoUrl) return user.photoUrl;
    if (user && user.photoURL) return user.photoURL;
    if (user && user.image) return user.image;
    return undefined;
  };

  return (
    <div className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1D37]">
      <div className="flex items-center justify-between h-full px-6">
        <div className="pl-10 lg:pl-0">
          <h1 className="text-xs md:text-xl font-semibold text-gray-900 dark:text-white">
            {formatDate(currentTime)}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatTime(currentTime)}
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-48 lg:w-64 px-4 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-[#0F5BBD] focus:border-transparent dark:bg-[#010102] dark:text-white"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {theme === "dark" ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Notifications */}
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative">
            <FiBell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
                     <DropdownMenu modal={false} open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                  {hasProfilePicture() ? (
                    <Image src={getPhotoUrl()} alt="User" width={32} height={32} className="rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials()}
                    </div>
                  )}
                </div>
                {/* Remove name from topbar, only avatar shown */}
              </button>
            </DropdownMenuTrigger>
                         <DropdownMenuContent
               align="end"
               className="w-56 bg-white dark:bg-[#1A1D37] border border-gray-200 dark:border-gray-800"
               sideOffset={8}
               avoidCollisions={true}
             >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-4 py-2">
                <div className="font-semibold text-base text-gray-900 dark:text-white">
                  {getDisplayName()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {user?.email || "No email"}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={async () => {
                await signOut({ callbackUrl: "/" });
              }}>
                <FiLogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
} 