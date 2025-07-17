"use client";

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/Provider/AuthProvider";
import Sidebar from "@/components/modules/dashboard/Sidebar";
import Topbar from "@/components/modules/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (authContext && !authContext.user && !authContext.loading) {
      router.replace("/login");
    }
  }, [authContext, router]);

  if (authContext?.loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authContext?.user) {
    // Optionally, you can return null or a spinner here
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#1A1D37]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-[#000000]">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
