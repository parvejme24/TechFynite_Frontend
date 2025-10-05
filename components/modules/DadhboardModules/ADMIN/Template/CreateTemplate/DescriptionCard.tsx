"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FiEdit3 } from "react-icons/fi";

// Use the unified KeyFeature interface from CreateTemplateContainer
interface KeyFeature {
  feature: string;
  featureDescription: string;
}
interface TemplateFormData {
  title: string;
  price: number;
  categoryId: string;
  version: number;
  previewLink: string;
  sourceFiles: string[];
  shortDescription: string;
  description: string[];
  whatsIncluded: string[];
  keyFeatures: KeyFeature[];
  screenshots: File[];
  coverImage: File | null;
}

interface DescriptionCardProps {
  formData: TemplateFormData;
  onInputChange: (field: keyof TemplateFormData, value: unknown) => void;
}

export default function DescriptionCard({
  formData,
  onInputChange,
}: DescriptionCardProps) {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiEdit3 className="w-5 h-5 text-gray-600" />
          Description
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Detailed description of your template features. Press Enter to create
          new paragraphs.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FiEdit3 className="w-4 h-4 text-gray-500" />
            Description
          </Label>
          <Textarea
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="Enter detailed description of your template. Press Enter for new paragraphs."
            rows={6}
            className="resize-none border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
          />
        </div>
      </CardContent>
    </Card>
  );
} 