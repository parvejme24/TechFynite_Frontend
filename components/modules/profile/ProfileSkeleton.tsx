import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto max-w-7xl py-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Profile Card Skeleton */}
        <div className="bg-white dark:bg-[#1A1D37] rounded-lg shadow p-6">
          <div className="flex flex-col items-center gap-2">
            {/* Edit Button Skeleton */}
            <div className="self-end mb-4">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            
            {/* Profile Image Skeleton */}
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mb-2"></div>
            
            {/* Name Skeleton */}
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            
            {/* Designation Skeleton */}
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

            {/* Profile Details Skeleton */}
            <div className="mt-4 space-y-2 w-full">
              {[...Array(7)].map((_, index) => (
                <div key={index}>
                  <div className="flex items-center gap-2 py-1">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 flex-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <hr className="w-full border-dashed border-gray-400 mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Edit Form Skeleton */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1D37] rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Image Upload Section Skeleton */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
              <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Form Fields Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            
            {/* Submit Button Skeleton */}
            <div className="flex justify-end">
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton; 