"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "@/Provider/AuthProvider";
import axios from "axios";

import { useForm } from "react-hook-form";
import ProfileCard from "@/components/modules/profile/ProfileCard";
import ProfileEditForm from "@/components/modules/profile/ProfileEditForm";

export default function ProfilePage() {
  const { user } = useContext(AuthContext) || {};
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

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

  const handleUpdate = async (values: any) => {
    if (!dbUser?.user) return;
    const payload = {
      displayName: values.fullName,
      phone: values.phone,
      city: values.city,
      country: values.country,
      designation: values.designation,
    };
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:5000/api/v1/users/${dbUser.user.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Optionally, refetch user data
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDbUser(res.data);
      window.alert("Profile updated successfully!");
    } catch (err) {
      // handle error (show toast, etc)
    } finally {
      setLoading(false);
    }
  };

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
