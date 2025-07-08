"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show theme toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`flex justify-end mb-4 mr-5 -mt-[20px] ${className}`}>
        <button className="p-2.5 rounded-full bg-[#3273C7] hover:bg-[#3272c7de] text-white transition-colors">
          <FiSun className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex justify-end mb-4 mr-5 -mt-[20px] ${className}`}>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2.5 rounded-full bg-[#3273C7] hover:bg-[#3272c7de] text-white transition-colors"
      >
        {theme === "dark" ? (
          <FiSun className="w-5 h-5" />
        ) : (
          <FiMoon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};
