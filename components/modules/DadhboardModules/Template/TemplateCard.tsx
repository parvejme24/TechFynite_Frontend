import Link from "next/link";
import React from "react";
import Image from "next/image";

interface KeyFeature {
  feature: string;
  featureDescription: string;
}

interface Template {
  id: string;
  title: string;
  category: string;
  author: string;
  publishedDate: string;
  price: string;
  imageUrl: string;
  mainImage: string;
  shortDescription: string;
  description: string;
  previewLink: string;
  weIncludes: string[];
  keyFeatures: KeyFeature[];
  demos: string[];
}

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="p-5 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-[#1A1D37]">
      <Image
        src={template.imageUrl}
        alt={template.title}
        width={400}
        height={300}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div>
        <div className="flex justify-between items-center py-3">
          <h3 className="text-xl font-semibold mb-2 dark:text-gray-300">1{template.title}</h3>
          <span className="text-lg font-bold text-primary">
            {template.price}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-5 border-t border-[#c5c5c5] dark:border-[#686868] pt-5">
          <span className="w-full bg-gradient-to-r from-[#BDD9FE] to-[#8AACDA] rounded-lg p-[2px]">
            <Link
              href={`/template/${template.id}`}
              className="bg-white dark:bg-[#1A1D37] w-full h-full py-2 rounded-md text-center flex justify-center items-center"
            >
              View Details
            </Link>
          </span>
          <span className="w-full bg-gradient-to-r from-[#BDD9FE] to-[#8AACDA] rounded-lg p-[2px]">
            <Link
              href={template.previewLink}
              target="_blank"
              className="bg-gradient-to-r text-white from-[#0F59BC] to-[#0F35A7] w-full h-full py-2 flex justify-center items-center rounded-lg"
            >
              Live Demo
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
