"use client";
import React, { useContext } from "react";
import { AuthContext } from "@/Providers/AuthProvider";

import ProfileCard from "@/components/modules/DadhboardModules/profile/ProfileCard";
import ProfileEditForm from "@/components/modules/DadhboardModules/profile/ProfileEditForm";

export default function ProfilePage() {
  const { user, loading } = useContext(AuthContext) || {};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <div>Please login to view your profile.</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Profile Card - Takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <ProfileCard />
        </div>
        
        {/* Editable Form - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <ProfileEditForm />
        </div>
      </div>
    </div>
  );
}
