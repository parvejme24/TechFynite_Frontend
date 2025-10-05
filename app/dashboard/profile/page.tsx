"use client";
import React, { useContext } from "react";
import { AuthContext } from "@/Provider/AuthProvider";

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
    <div className="container mx-auto max-w-7xl py-8">
      <h2 className="text-2xl font-bold mb-6">Profile Page</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Profile Card */}
        <ProfileCard />
        {/* Editable Form */}
        <ProfileEditForm />
      </div>
    </div>
  );
}
