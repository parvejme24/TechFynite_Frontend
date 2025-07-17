"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { TopNavbar } from "./navbar/TopNavbar";
import { LogoComponent } from "./navbar/LogoComponent";
import { DesktopNavigation } from "./navbar/DesktopNavigation";
import { NavActions } from "./navbar/NavActions";
import { MobileNavigation } from "./navbar/MobileNavigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="relative">
      {/* top navbar  */}
      <TopNavbar />

      {/* main navbar  */}
      <div
        className={`bg-[#fff] dark:bg-[#0A0D21] transition-all duration-300 ${
          isSticky ? "fixed top-0 left-0 right-0 z-50 shadow-md" : "relative"
        }`}
      >
        <div className="container mx-auto max-w-7xl px-5 lg:px-0 flex justify-between items-center py-5">
          <LogoComponent />
          <DesktopNavigation pathname={pathname} />
          <NavActions isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>

      {/* mobile navigation / sidebar  */}
      <MobileNavigation
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        pathname={pathname}
      />
    </div>
  );
}
