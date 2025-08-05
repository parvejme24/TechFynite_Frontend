"use client";
import React from "react";
import Image from "next/image";
import { useTemplate } from "@/hooks/useTemplateApi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TemplateDetailsSkeleton from "./TemplateDetailsSkeleton";

export default function TemplateDetailsContainer({ id }: { id: string }) {
  const { data: template, isLoading, error } = useTemplate(id);

  if (isLoading) return <TemplateDetailsSkeleton />;
  if (error)
    return <div className="text-red-500">{(error as Error).message}</div>;
  if (!template) return <div>No template found.</div>;

  const {
    title,
    imageUrl,
    categoryId,
    pages,
    views,
    previewLink,
    shortDescription,
    description,
    whatsIncluded,
    keyFeatures,
    screenshots,
    updatedAt,
  } = template;

  return (
    <div>
      <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-500 mb-2">
              Category: {categoryId}
            </h2>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Updated: {new Date(updatedAt).toLocaleDateString()}</span>
              <span>{pages} pages</span>
              <span>{views} views</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {shortDescription}
            </p>
            <div className="space-y-2">
              <Button className="cursor-pointer bg-[#0F35A7] hover:bg-[#0F35A7]/80 text-white w-full h-[45px]">
                Buy Now
              </Button>
              <div className="w-full grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="cursor-pointer h-[45px] border border-[#0F35A7] bg-transparent"
                >
                  <Link
                    href={previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer h-[45px] border border-[#0F35A7] bg-transparent"
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
              className="rounded-lg w-full h-80 object-cover"
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h4 className="text-xl font-semibold mb-2">Description</h4>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              {description}
            </p>

            <h4 className="text-xl font-semibold mb-2">What&apos;s Included</h4>
            <ul className="list-disc list-inside mb-6">
              {whatsIncluded.map((item: string, idx: number) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-2">Key Features</h4>
            <ul className="space-y-2">
              {keyFeatures.map((item: unknown, idx: number) => {
                const feature = (item as { feature: string }).feature;
                return (
                  <li
                    key={feature + idx}
                    className="bg-white dark:bg-[#1A1D37] text-gray-700 dark:text-gray-300 px-4 py-3 rounded"
                  >
                    {feature}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2">Screenshots</h4>
          <div className="flex flex-wrap gap-4">
            {screenshots.map((url: string, idx: number) => (
              <Image
                key={url + idx}
                src={url}
                alt={`Screenshot ${idx + 1}`}
                width={200}
                height={120}
                className="rounded border w-48 h-32 object-cover"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
