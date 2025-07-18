"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUser,
  FiFileText,
  FiMail,
  FiUsers,
  FiBarChart2,
  FiMenu,
  FiX,
  FiShoppingBag,
  FiCreditCard,
  FiBell,
  FiSettings,
} from "react-icons/fi";

import LOGO from "@/assets/common/logo.png";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const adminNavigation = [
  { name: "Overview", href: "/dashboard", icon: FiHome },
  { name: "Profile", href: "/dashboard/profile", icon: FiUser },
  { name: "Templates", href: "/dashboard/templates", icon: FiFileText },
  { name: "Blogs", href: "/dashboard/blogs", icon: FiFileText },
  { name: "Newsletter", href: "/dashboard/newsletter", icon: FiMail },
  { name: "Users", href: "/dashboard/users", icon: FiUsers },
  { name: "Analytics", href: "/dashboard/analytics", icon: FiBarChart2 },
];

const userNavigation = [
  { name: "Profile", href: "/dashboard/profile", icon: FiUser },
  { name: "My Purchases", href: "/dashboard/purchases", icon: FiShoppingBag },
  { name: "Payment History", href: "/dashboard/payments", icon: FiCreditCard },
  { name: "Notifications", href: "/dashboard/notifications", icon: FiBell },
  { name: "Settings", href: "/dashboard/settings", icon: FiSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useCurrentUser();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <FiX className="h-6 w-6" />
        ) : (
          <FiMenu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:inset-auto lg:z-auto bg-white dark:bg-[#000424] border-r border-gray-200 dark:border-gray-800`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
            <Link
              href="/dashboard"
              className="text-xl lg:text-2xl font-bold text-[#0F5BBD] dark:text-white flex items-center gap-2"
            >
              <Image src={LOGO} alt="Techfynite Logo" className="w-7 lg:w-9" />
              TechFynite
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {(isAdmin ? adminNavigation : userNavigation).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#0F5BBD] text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#718096]"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 dark:text-gray-300"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
