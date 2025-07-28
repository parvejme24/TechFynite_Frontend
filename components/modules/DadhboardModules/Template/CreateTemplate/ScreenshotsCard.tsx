"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FiMonitor, FiImage, FiX } from "react-icons/fi";
import Image from "next/image";

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
  keyFeatures: any[];
  screenshots: File[];
  coverImage: File | null;
}

interface ScreenshotsCardProps {
  formData: TemplateFormData;
  onInputChange: (field: keyof TemplateFormData, value: any) => void;
  handleScreenshotChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeScreenshot: (index: number) => void;
}

export default function ScreenshotsCard({
  formData,
  onInputChange,
  handleScreenshotChange,
  removeScreenshot,
}: ScreenshotsCardProps) {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiMonitor className="w-5 h-5 text-gray-600" />
          Screenshots
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Upload template screenshots
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FiMonitor className="w-4 h-4 text-gray-500" />
            Screenshots
          </Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleScreenshotChange}
            className="mb-4 border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.screenshots.map((screenshot, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full h-32 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <Image
                    src={URL.createObjectURL(screenshot)}
                    alt={`Screenshot ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 text-gray-800 hover:bg-white cursor-pointer"
                    onClick={() => {
                      // Open screenshot in new tab for preview
                      const url = URL.createObjectURL(screenshot);
                      window.open(url, '_blank');
                    }}
                  >
                    <FiImage className="w-3 h-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeScreenshot(index)}
                    className="cursor-pointer"
                  >
                    <FiX className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 