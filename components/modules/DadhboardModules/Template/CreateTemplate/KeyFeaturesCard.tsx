"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FiStar, FiPlus, FiX } from "react-icons/fi";

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

interface KeyFeaturesCardProps {
  formData: TemplateFormData;
  onInputChange: (field: keyof TemplateFormData, value: any) => void;
  addKeyFeature: () => void;
  removeKeyFeature: (index: number) => void;
  newKeyFeature: string;
  setNewKeyFeature: (value: string) => void;
  newKeyFeatureDescription: string;
  setNewKeyFeatureDescription: (value: string) => void;
}

export default function KeyFeaturesCard({
  formData,
  onInputChange,
  addKeyFeature,
  removeKeyFeature,
  newKeyFeature,
  setNewKeyFeature,
  newKeyFeatureDescription,
  setNewKeyFeatureDescription,
}: KeyFeaturesCardProps) {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiStar className="w-5 h-5 text-gray-600" />
          Key Features
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Highlight the main features of your template
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FiStar className="w-4 h-4 text-gray-500" />
            Features
          </Label>
          <div className="space-y-4">
            {formData.keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="space-y-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg "
              >
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-3">
                    <div className="relative">
                      <Input
                        value={feature.feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.keyFeatures];
                          newFeatures[index] = {
                            ...newFeatures[index],
                            feature: e.target.value,
                          };
                          onInputChange("keyFeatures", newFeatures);
                        }}
                        placeholder="Feature name"
                        className="pl-10 border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
                      />
                      <FiStar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <Textarea
                      value={feature.featureDescription}
                      onChange={(e) => {
                        const newFeatures = [...formData.keyFeatures];
                        newFeatures[index] = {
                          ...newFeatures[index],
                          featureDescription: e.target.value,
                        };
                        onInputChange("keyFeatures", newFeatures);
                      }}
                      placeholder="Feature description"
                      rows={2}
                      className="border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeKeyFeature(index)}
                    className="text-red-500 hover:text-red-700 border-red-300 hover:border-red-500 cursor-pointer"
                  >
                    <FiX className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="space-y-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="relative">
                <Input
                  value={newKeyFeature}
                  onChange={(e) => setNewKeyFeature(e.target.value)}
                  placeholder="Feature name"
                  className="pl-10 border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
                />
                <FiStar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <Textarea
                value={newKeyFeatureDescription}
                onChange={(e) => setNewKeyFeatureDescription(e.target.value)}
                placeholder="Feature description"
                rows={2}
                className="border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addKeyFeature}
                disabled={!newKeyFeature.trim() || !newKeyFeatureDescription.trim()}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 