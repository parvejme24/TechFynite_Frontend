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
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const authContext = React.useContext(AuthContext);
  const user = authContext?.user;
  const logOut = authContext?.logOut;
  const router = useRouter();

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                  {user?.photoURL ? (
                    <Image src={user.photoURL} alt="User" width={32} height={32} className="rounded-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {(user?.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                    </span>
                  )}
                </div>
                {/* Remove name from topbar, only avatar shown */}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white dark:bg-[#1A1D37] border border-gray-200 dark:border-gray-800"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-4 py-2">
                <div className="font-semibold text-base text-gray-900 dark:text-white">
                  {user?.displayName || "User"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {user?.email || "No email"}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={async () => {
                if (logOut) {
                  await logOut();
                  localStorage.clear();
                  router.push("/login");
                }
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