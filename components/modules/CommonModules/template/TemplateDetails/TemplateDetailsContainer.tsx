"use client";
import React from "react";
import Image from "next/image";
import { useGetTemplateById } from "@/hooks/useTemplateApi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TemplateDetailsSkeleton from "./TemplateDetailsSkeleton";

export default function TemplateDetailsContainer({ id }: { id: string }) {
  const { 
    data: templateData, 
    isLoading, 
    error 
  } = useGetTemplateById(id);
  const router = useRouter();

  const template = templateData;

  // Debug logging
  console.log('Template Details - ID:', id);
  console.log('Template Details - Loading:', isLoading);
  console.log('Template Details - Error:', error);
  console.log('Template Details - Data:', templateData);

  if (isLoading) {
    return <TemplateDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Template
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {(error as Error).message || "Failed to load template data. Please try again."}
          </p>
          <Button onClick={() => router.push('/template')} className="cursor-pointer">
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Template Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The template you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/template')} className="cursor-pointer">
            Back to Templates
          </Button>
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
    createdAt,
  } = template;

  return (
    <div>
      <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Category:</span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded">
                {category?.title || 'React.JS'}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
              <span>Updated: {new Date(updatedAt).toLocaleDateString()}</span>
              <span>{pages} pages</span>
              <span>v{version}</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {title}
            </h1>
            
            <div className="mb-6">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                ${price}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{downloads} downloads</span>
                <span>{totalPurchase} purchases</span>
              </div>
            </div>
            
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              {shortDescription}
            </p>
            
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
                  disabled={!previewLink}
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
          
          <div>
            <Image
              src={imageUrl}
              alt={title}
              width={1000}
              height={1000}
              className="rounded-lg w-full h-80 object-cover shadow-lg"
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">What's Included</h3>
            <ul className="space-y-3">
              {whatsIncluded && whatsIncluded.length > 0 ? (
                whatsIncluded.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 dark:text-gray-400">No items included</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Key Features</h3>
            <div className="space-y-3">
              {keyFeatures && keyFeatures.length > 0 ? (
                keyFeatures.map((feature: { title: string; description: string }, idx: number) => (
                  <div
                    key={feature.title + idx}
                    className="bg-white dark:bg-[#1A1D37] border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 dark:text-gray-400">No key features available</div>
              )}
            </div>
          </div>
        </div>


        {screenshots && screenshots.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Screenshots</h3>
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
    </div>
  );
}
