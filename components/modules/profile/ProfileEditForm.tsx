"use client";
import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { UserProfile } from "@/types/user";
import { useUserApi } from "@/hooks/useUserApi";
import { useUserData } from "@/Provider/UserDataProvider";
import { Camera, X } from "lucide-react";
import Image from "next/image";



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

const ProfileEditForm: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const { user, loading: authLoading, refreshUser } = useUserData();
  const {
    updateUserProfile,
    loading: updateLoading,
    error,
  } = useUserApi();

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: user?.displayName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      city: user?.city || "",
      country: user?.country || "",
      designation: user?.designation || "",
      stateOrRegion: user?.stateOrRegion || "",
      postCode: user?.postCode || "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.displayName || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        country: user.country || "",
        designation: user.designation || "",
        stateOrRegion: user.stateOrRegion || "",
        postCode: user.postCode || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setRemoveExistingImage(true);
  };

  const handleUpdate = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      const updateData = {
        displayName: values.fullName,
        email: values.email,
        phone: values.phone,
        city: values.city,
        country: values.country,
        designation: values.designation,
        stateOrRegion: values.stateOrRegion,
        postCode: values.postCode,
        ...(selectedImage && { photo: selectedImage }),
        ...(removeExistingImage && { removePhoto: true }),
      };

      const updatedUser = await updateUserProfile(user.id, updateData);

      if (updatedUser) {
        // Refresh user data in context
        await refreshUser();
        toast.success("Profile updated successfully!");

        // Clear image selection after successful update
        setSelectedImage(null);
        setPreviewUrl(null);
        setRemoveExistingImage(false);


      } else {
        toast.error(error || "Profile update failed!");
      }
    } catch (err) {
      toast.error("Profile update failed!");
    }
  };

  // Show loading state while fetching user data
  if (authLoading) {
    return (
      <div className="lg:col-span-2 -lg shadow p-6 flex-1 bg-white dark:bg-[#1A1D37] rounded-md">
        <div className="space-y-6">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if user data couldn't be fetched
  if (!user) {
    return (
      <div className="lg:col-span-2 -lg shadow p-6 flex-1 bg-white dark:bg-[#1A1D37] rounded-md">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 text-center">Failed to load user data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 -lg shadow p-6 flex-1 bg-white dark:bg-[#1A1D37] rounded-md">
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(handleUpdate)}
        >
          {/* Image Upload Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Profile preview"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                                 ) : user?.photoUrl && !removeExistingImage ? (
                   <Image
                     src={user.photoUrl}
                     alt="Current profile"
                     width={128}
                     height={128}
                     className="w-full h-full object-cover"
                   />
                 ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <Camera className="w-12 h-12 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

                             {/* Remove Button */}
               {(previewUrl || (user?.photoUrl && !removeExistingImage)) && (
                 <button
                   type="button"
                   onClick={removeImage}
                   className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full cursor-pointer hover:bg-red-600 transition-colors"
                 >
                   <X className="w-3 h-3" />
                 </button>
               )}
            </div>

            <p className="text-sm text-gray-500 text-center">
              Click the camera icon to upload a new profile picture
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                             disabled={(!form.formState.isDirty && !selectedImage && !removeExistingImage) || updateLoading}
            >
              {updateLoading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileEditForm;
