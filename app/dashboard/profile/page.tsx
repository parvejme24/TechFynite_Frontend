"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/Provider/AuthProvider";
import axios from "axios";

import { useForm } from "react-hook-form";
import ProfileCard from "@/components/modules/profile/ProfileCard";
import ProfileEditForm from "@/components/modules/profile/ProfileEditForm";
import { UserProfile } from "@/types/user";

export default function ProfilePage() {
  const { user } = useContext(AuthContext) || {};
  const [dbUser, setDbUser] = useState<{ user: UserProfile } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDbUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:5000/api/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDbUser(res.data);
      } catch (err) {
        setDbUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDbUser();
  }, []);

  if (!user) {
    return <div>Please login to view your profile.</div>;
  }

  const form = useForm({
    defaultValues: {
      fullName: dbUser?.user?.displayName || "",
      phone: dbUser?.user?.phone || "",
      city: dbUser?.user?.city || "",
      country: dbUser?.user?.country || "",
      designation: dbUser?.user?.designation || "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    // Update form values when dbUser changes
    if (dbUser?.user) {
      form.reset({
        fullName: dbUser.user.displayName || "",
        phone: dbUser.user.phone || "",
        city: dbUser.user.city || "",
        country: dbUser.user.country || "",
        designation: dbUser.user.designation || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbUser]);

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <h2 className="text-2xl font-bold mb-4">Profile Page</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Profile Card */}
        <ProfileCard dbUser={dbUser} />
        {/* Editable Form */}
        <ProfileEditForm
          dbUser={dbUser}
          setDbUser={setDbUser}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}
