"use client";
import React, { useContext } from "react";
import { AuthContext } from "@/Provider/AuthProvider";
import { UserDataProvider } from "@/Provider/UserDataProvider";

import ProfileCard from "@/components/modules/profile/ProfileCard";
import ProfileEditForm from "@/components/modules/profile/ProfileEditForm";

export default function ProfilePage() {
  const { user } = useContext(AuthContext) || {};

  if (!user) {
    return <div>Please login to view your profile.</div>;
  }

  return (
    <UserDataProvider>
      <div className="container mx-auto max-w-7xl py-8">
        <h2 className="text-2xl font-bold mb-6">Profile Page</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Profile Card */}
          <ProfileCard />
          {/* Editable Form */}
          <ProfileEditForm />
        </div>
      </div>
    </UserDataProvider>
  );
}
