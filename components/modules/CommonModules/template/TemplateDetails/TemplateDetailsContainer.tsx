"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetTemplateById } from "@/hooks/useTemplateApi";
import { Button } from "@/components/ui/button";
import TemplateDetailsSkeleton from "./TemplateDetailsSkeleton";
import {
  FiTag,
  FiCalendar,
  FiFileText,
  FiDownload,
  FiUsers,
  FiShoppingCart,
  FiExternalLink,
  FiAlertCircle,
  FiArrowLeft,
  FiStar,
  FiZap,
  FiCheckCircle,
} from "react-icons/fi";

export default function TemplateDetailsContainer({ id }: { id: string }) {
  const router = useRouter();
  const { data: templateData, isLoading, error, refetch } = useGetTemplateById(id);

  // Validate ID
  if (!id || id.trim() === '') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFCFF] dark:from-[#000424] to-[#FAFCFF] dark:to-[#000424] flex items-center justify-center">
        <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-10">
          <div className="bg-white dark:bg-[#1A1D37] rounded-2xl shadow-xl p-8 lg:p-10 text-center max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Invalid Template ID
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The template ID is missing or invalid.
            </p>
            <Button
              onClick={() => router.push("/template")}
              className="cursor-pointer"
            >
              Back to Templates
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Debug logging
  React.useEffect(() => {
    console.log("Template Details - ID:", id);
    console.log("Template Details - Loading:", isLoading);
    if (error) {
      console.error("Template Details Error:", error);
      console.error("Template ID:", id);
      console.error("Error Details:", {
        message: (error as any)?.message,
        response: (error as any)?.response,
        request: (error as any)?.request,
      });
    }
    if (templateData) {
      console.log("Template Details - Data loaded:", templateData);
    }
  }, [error, id, isLoading, templateData]);

  if (isLoading) {
    return <TemplateDetailsSkeleton />;
  }

  if (error) {
    // Extract error message from various error formats
    let errorMessage = "Failed to load template data. Please try again.";
    
    if ((error as any)?.message) {
      errorMessage = (error as any).message;
    } else if ((error as any)?.response?.data?.message) {
      errorMessage = (error as any).response.data.message;
    } else if ((error as any)?.response?.data?.error) {
      errorMessage = (error as any).response.data.error;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    const isNetworkError = errorMessage.toLowerCase().includes("network") || 
                          errorMessage.toLowerCase().includes("fetch") ||
                          errorMessage.toLowerCase().includes("timeout") ||
                          errorMessage.toLowerCase().includes("unable to connect");
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFCFF] dark:from-[#000424] to-[#FAFCFF] dark:to-[#000424] flex items-center justify-center">
        <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-10">
          <div className="bg-white dark:bg-[#1A1D37] rounded-2xl shadow-xl p-8 lg:p-10 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiExternalLink className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Template
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {errorMessage}
            </p>
            {isNetworkError && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                Please check your internet connection and try again.
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => refetch()}
                className="cursor-pointer bg-gradient-to-r from-[#0F35A7] to-[#0F59BC] hover:from-[#0F35A7]/90 hover:to-[#0F59BC]/90 text-white"
              >
                Try Again
              </Button>
              <Button
                onClick={() => router.push("/template")}
                variant="outline"
                className="cursor-pointer border-2 border-gray-300 dark:border-gray-600"
              >
                Back to Templates
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!templateData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFCFF] dark:from-[#000424] to-[#FAFCFF] dark:to-[#000424] flex items-center justify-center">
        <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-10">
          <div className="bg-white dark:bg-[#1A1D37] rounded-2xl shadow-xl p-8 lg:p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertCircle className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Template Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              The template you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button
              onClick={() => router.push("/template")}
              className="cursor-pointer bg-gradient-to-r from-[#0F35A7] to-[#0F59BC] hover:from-[#0F35A7]/90 hover:to-[#0F59BC]/90 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Back to Templates
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const {
    title,
    imageUrl,
    category,
    pages,
    price,
    previewLink,
    shortDescription,
    description,
    whatsIncluded,
    keyFeatures,
    screenshots,
    updatedAt,
    version,
    downloads,
    totalPurchase,
  } = templateData;

  // Handle description (can be string or array)
  const descriptionArray = Array.isArray(description)
    ? description
    : description
      ? [description]
      : [];

  return (
    <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-10">
      {/* Main Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column - Template Info */}
        <div>
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded">
              {category?.title || "React.JS"}
            </span>
          </div>

          {/* Metadata */}
          <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1.5">
              <FiCalendar className="w-4 h-4" />
              <span>Updated: {new Date(updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiFileText className="w-4 h-4" />
              <span>
                {pages} {pages === 1 ? "page" : "pages"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiTag className="w-4 h-4" />
              <span>v{version}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiDownload className="w-4 h-4" />
              <span>{downloads} downloads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiShoppingCart className="w-4 h-4" />
              <span>{totalPurchase} purchases</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {title}
          </h1>

          {/* Short Description */}
          <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            {shortDescription}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push(`/checkout/${id}`)}
              className="cursor-pointer bg-[#0F35A7] hover:bg-[#0F35A7]/80 text-white w-full h-[45px] text-lg font-semibold"
            >
              Buy Now - ${price}
            </Button>
            <div className="w-full grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="cursor-pointer h-[45px] border border-[#0F35A7] bg-transparent hover:bg-[#0F35A7]/10"
                disabled={!previewLink || previewLink === null}
              >
                {previewLink ? (
                  <Link
                    href={previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full"
                  >
                    Preview
                  </Link>
                ) : (
                  "Preview"
                )}
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer h-[45px] border border-[#0F35A7] bg-transparent hover:bg-[#0F35A7]/10"
              >
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Template Image */}
        <div>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              width={1000}
              height={1000}
              className="rounded-lg w-full h-80 object-cover shadow-lg"
            />
          ) : (
            <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500">No Image</span>
            </div>
          )}
        </div>
      </div>

      {/* Full Description Section */}
      {descriptionArray.length > 0 && (
        <div className="mt-10">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            About This Template
          </h2>
          <div className="space-y-4">
            {descriptionArray.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* What's Included */}
        <div>
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            What&apos;s Included
          </h3>
          {whatsIncluded && whatsIncluded.length > 0 ? (
            <div className="space-y-3">
              {whatsIncluded.map((item: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 bg-white dark:bg-[#1A1D37] border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-400 dark:hover:border-green-600 hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-green-500 dark:group-hover:bg-green-600 transition-colors">
                    <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No items included
            </div>
          )}
        </div>

        {/* Key Features */}
        <div>
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Key Features
          </h3>
          {keyFeatures && keyFeatures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keyFeatures.map((feature, idx: number) => (
                <div
                  key={feature.title + idx}
                  className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <FiZap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiCheckCircle className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No key features available
            </div>
          )}
        </div>
      </div>

      {/* Screenshots Section */}
      {screenshots && screenshots.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Screenshots
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {screenshots.map((url: string, idx: number) => (
              <Image
                key={url + idx}
                src={url}
                alt={`Screenshot ${idx + 1}`}
                width={300}
                height={200}
                className="rounded-lg border border-gray-200 dark:border-gray-700 w-full h-48 object-cover"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
