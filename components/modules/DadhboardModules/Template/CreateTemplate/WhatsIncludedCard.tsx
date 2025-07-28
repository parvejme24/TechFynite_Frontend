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
import { FiList, FiPlus, FiX } from "react-icons/fi";

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

interface WhatsIncludedCardProps {
  formData: TemplateFormData;
  onInputChange: (field: keyof TemplateFormData, value: any) => void;
  addWhatsIncluded: () => void;
  removeWhatsIncluded: (index: number) => void;
  updateWhatsIncluded: (index: number, value: string) => void;
}

export default function WhatsIncludedCard({
  formData,
  onInputChange,
  addWhatsIncluded,
  removeWhatsIncluded,
  updateWhatsIncluded,
}: WhatsIncludedCardProps) {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiList className="w-5 h-5 text-gray-600" />
          What's Included
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Add multiple items that are included with this template
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FiList className="w-4 h-4 text-gray-500" />
            Included Items
          </Label>
          {formData.whatsIncluded.map((item, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="relative flex-1">
                <Input
                  value={item}
                  onChange={(e) => updateWhatsIncluded(index, e.target.value)}
                  placeholder={`Item ${
                    index + 1
                  } (e.g., Source Code, Documentation, Assets)`}
                  className="pl-10 border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
                />
                <FiList className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {formData.whatsIncluded.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeWhatsIncluded(index)}
                  className="text-red-500 hover:text-red-700 border-red-300 hover:border-red-500 cursor-pointer"
                >
                  <FiX className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addWhatsIncluded}
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Another Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 