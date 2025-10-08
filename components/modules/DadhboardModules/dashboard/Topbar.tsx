"use client";

import React, { useState, useEffect } from "react";
import { FiSearch, FiBell, FiSun, FiMoon, FiLogOut, FiUser, FiSettings, FiMenu, FiX } from "react-icons/fi";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/Providers/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export default function Topbar({ onMenuToggle, isMenuOpen = false }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(3); // Mock notification count
  const authContext = React.useContext(AuthContext);
  const { user: nextAuthUser, isAuthenticated } = useAuth();
  const user = nextAuthUser || authContext?.user;
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

  const getDisplayName = () => {
    if (!user) return 'User';
    
    // Check multiple possible name fields
    if (user.fullName) return user.fullName;
    if ((user as any).name) return (user as any).name;
    if ((user as any).displayName) return (user as any).displayName;
    
    // Fallback to email if no name is available
    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
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
    return !!(user && user.profile?.avatarUrl);
  };

  const getPhotoUrl = () => {
    if (user && user.profile?.avatarUrl) return user.profile.avatarUrl;
    return undefined;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  const handleNotificationClick = () => {
    // Implement notification functionality
    setNotifications(0);
  };

  const handleProfileClick = () => {
    router.push("/dashboard/profile");
  };

  const handleSettingsClick = () => {
    router.push("/dashboard/settings");
  };

  return (
    <div className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1D37] sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section - Menu Toggle & Date/Time */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            {isMenuOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </Button>

          {/* Date and Time */}
          <div className="hidden sm:block">
            <h1 className="text-sm lg:text-lg font-semibold text-gray-900 dark:text-white">
              {formatDate(currentTime)}
            </h1>
            <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
              {formatTime(currentTime)}
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search dashboard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-[#0F5BBD] focus:border-transparent dark:bg-[#010102] dark:text-white text-sm cursor-text"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400 w-4 h-4 cursor-pointer" />
          </form>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              {theme === "dark" ? (
                <FiSun className="w-4 h-4" />
              ) : (
                <FiMoon className="w-4 h-4" />
              )}
            </Button>
          )}

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNotificationClick}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 relative cursor-pointer"
          >
            <FiBell className="w-4 h-4" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {notifications > 9 ? "9+" : notifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu modal={false} open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center cursor-pointer">
                  {hasProfilePicture() ? (
                    <Image 
                      src={getPhotoUrl() || "/placeholder.jpg"} 
                      alt="User" 
                      width={32} 
                      height={32} 
                      className="rounded-full object-cover" 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials()}
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 bg-white dark:bg-[#1A1D37] border border-gray-200 dark:border-gray-800"
              sideOffset={8}
              avoidCollisions={true}
            >
              <DropdownMenuLabel className="px-4 py-2">
                <div className="font-semibold text-base text-gray-900 dark:text-white">
                  {getDisplayName()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {user?.email || "No email"}
                </div>
                {user?.role && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {user.role}
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                <FiUser className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                <FiSettings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20" 
                onClick={async () => {
                  await signOut({ callbackUrl: "/" });
                }}
              >
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