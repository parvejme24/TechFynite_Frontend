"use client";

import React from "react";
import { ThemeToggle } from "@/components/modules/common/ThemeToggle/ThemeToggle";
import RegisterForm from "@/components/modules/auth/Register/RegisterForm";
import { AuthBanner } from "@/components/modules/common/AuthBanner/AuthBanner";

export default function RegisterPage() {
  return (
    <div className="dark:bg-[#000424] grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-screen">
      <AuthBanner />
      <div>
        <ThemeToggle />
        <div className="mt-[20px]">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
