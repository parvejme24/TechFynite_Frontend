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
  FiDollarSign,
} from "react-icons/fi";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";

import LOGO from "@/assets/common/logo.png";
import Image from "next/image";
import { AuthContext } from "@/Providers/AuthProvider";
import { useContext } from "react";

const adminNavigation = [
  { name: "Overview", href: "/dashboard/ADMIN", icon: FiHome },
  { name: "Profile", href: "/dashboard/profile", icon: FiUser },
  { name: "Templates", href: "/dashboard/ADMIN/templates", icon: FiFileText },
  { name: "Blogs", href: "/dashboard/ADMIN/blogs", icon: FiFileText },
  { name: "Pricing", href: "/dashboard/ADMIN/pricing", icon: FiDollarSign },
  { name: "Newsletter", href: "/dashboard/ADMIN/newsletter", icon: FiMail },
  { name: "Users", href: "/dashboard/ADMIN/users", icon: FiUsers },
  { name: "Analytics", href: "/dashboard/ADMIN/analytics", icon: FiBarChart2 },
  {
    name: "Service Request",
    href: "/dashboard/ADMIN/service-request",
    icon: VscGitPullRequestGoToChanges,
  },
];

const userNavigation = [
  { name: "Profile", href: "/dashboard/profile", icon: FiUser },
  { name: "My Purchases", href: "/dashboard/USER/purchases", icon: FiShoppingBag },
  { name: "Payment History", href: "/dashboard/USER/payment", icon: FiCreditCard },
  { name: "Service Request", href: "/dashboard/USER/service-request", icon: VscGitPullRequestGoToChanges },
  { name: "Notifications", href: "/dashboard/notifications", icon: FiBell },
  { name: "Settings", href: "/dashboard/settings", icon: FiSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useContext(AuthContext) || {};
  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";

  return (
    <>
      {/* Mobile menu button */}
      {loading ? (
        <div className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md animate-pulse">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      ) : (
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
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:inset-auto lg:z-auto bg-white dark:bg-[#000424] border-r border-gray-200 dark:border-gray-800`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-7 lg:w-9 h-7 lg:h-9 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-6 lg:h-8 w-24 lg:w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" style={{ animationDelay: '200ms' }}></div>
              </div>
            ) : (
              <Link
                href="/dashboard"
                className="text-xl lg:text-2xl font-bold text-[#0F5BBD] dark:text-white flex items-center gap-2"
              >
                <Image src={LOGO} alt="Techfynite Logo" className="w-7 lg:w-9" />
                TechFynite
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {loading ? (
              // Skeleton loading for navigation items
              <>
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center px-4 py-3 rounded-lg"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded mr-3 animate-pulse"></div>
                    <div 
                      className={`h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse ${
                        index === 0 ? 'w-20' : 
                        index === 1 ? 'w-16' : 
                        index === 2 ? 'w-24' : 
                        index === 3 ? 'w-12' : 
                        index === 4 ? 'w-28' : 'w-20'
                      }`}
                    ></div>
                  </div>
                ))}
              </>
            ) : (
              (isAdmin ? adminNavigation : isUser ? userNavigation : []).map(
                (item) => {
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
                }
              )
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
