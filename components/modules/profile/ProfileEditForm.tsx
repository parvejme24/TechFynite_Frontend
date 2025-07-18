"use client";
import React, { useEffect } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { UserProfile } from "@/types/user";

interface ProfileEditFormProps {
  dbUser: { user: UserProfile } | null;
  setDbUser: (user: { user: UserProfile }) => void;
  setLoading: (loading: boolean) => void;
}

interface ProfileFormValues {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  designation: string;
  stateOrRegion: string;
  postCode: string;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  dbUser,
  setDbUser,
  setLoading,
}) => {
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: dbUser?.user?.displayName || "",
      email: dbUser?.user?.email || "",
      phone: dbUser?.user?.phone || "",
      city: dbUser?.user?.city || "",
      country: dbUser?.user?.country || "",
      designation: dbUser?.user?.designation || "",
      stateOrRegion: dbUser?.user?.stateOrRegion || "",
      postCode: dbUser?.user?.postCode || "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (dbUser?.user) {
      form.reset({
        fullName: dbUser.user.displayName || "",
        email: dbUser.user.email || "",
        phone: dbUser.user.phone || "",
        city: dbUser.user.city || "",
        country: dbUser.user.country || "",
        designation: dbUser.user.designation || "",
        stateOrRegion: dbUser.user.stateOrRegion || "",
        postCode: dbUser.user.postCode || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbUser]);

  const handleUpdate = async (values: ProfileFormValues) => {
    if (!dbUser?.user) return;
    const payload = {
      displayName: values.fullName,
      email: values.email,
      phone: values.phone,
      city: values.city,
      country: values.country,
      designation: values.designation,
      stateOrRegion: values.stateOrRegion,
      postCode: values.postCode,
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
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDbUser(res.data);

      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Profile update failed!", {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:col-span-2 -lg shadow p-6 flex-1 bg-white dark:bg-[#1A1D37] rounded-md">
      <Form {...form}>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          onSubmit={form.handleSubmit(handleUpdate)}
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    {...field}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="Designation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stateOrRegion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Region</FormLabel>
                <FormControl>
                  <Input placeholder="State or Region" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Code</FormLabel>
                <FormControl>
                  <Input placeholder="Post Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:col-span-2 flex justify-end mt-2">
            <Button
              type="submit"
              className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              disabled={!form.formState.isDirty}
            >
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileEditForm;
