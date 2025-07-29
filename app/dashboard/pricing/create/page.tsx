"use client";

import React, { useState } from "react";
import { useCreatePricing } from "@/hooks/usePricingApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FiSave, FiRotateCcw, FiArrowLeft, FiPlus, FiX } from "react-icons/fi";
import Link from "next/link";
import { toast } from "sonner";
import { CreatePricingData } from "@/types/pricing";

export default function CreatePricingPage() {
  const createPricingMutation = useCreatePricing();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreatePricingData>({
    title: "",
    price: 0,
    license: "Standard",
    duration: "monthly",
    features: [""],
    recommended: false,
  });

  const handleInputChange = (field: keyof CreatePricingData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) => (i === index ? value : feature)),
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: 0,
      license: "Standard",
      duration: "monthly",
      features: [""],
      recommended: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
             // Validate required fields
       if (!formData.title.trim()) {
         toast.error("Plan title is required");
         return;
       }
       if (formData.price <= 0) {
         toast.error("Price must be greater than 0");
         return;
       }

       // Filter out empty features
       const filteredFeatures = formData.features.filter(feature => feature.trim());

       const pricingData = {
         ...formData,
         title: formData.title.trim(),
         features: filteredFeatures,
       };

      const result = await createPricingMutation.mutateAsync(pricingData);
      console.log("Pricing plan created successfully:", result);

      resetForm();
      toast.success("Pricing plan created successfully!");
    } catch (error: unknown) {
      console.error("Error creating pricing plan:", error);
      const errorMessage = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : "Failed to create pricing plan. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/dashboard/pricing">
            <Button variant="outline" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              <FiArrowLeft className="w-4 h-4" />
              Back to Pricing
            </Button>
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Pricing Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add a new pricing plan to your collection
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Information
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Essential details about your pricing plan
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                     Plan Title *
                   </Label>
                   <Input
                     id="title"
                     value={formData.title}
                     onChange={(e) => handleInputChange("title", e.target.value)}
                     placeholder="e.g., Basic Plan, Pro Plan"
                     required
                     className="border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="price" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                     Price *
                   </Label>
                   <Input
                     id="price"
                     type="number"
                     step="0.01"
                     min="0"
                     value={formData.price}
                     onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                     placeholder="0.00"
                     required
                     className="border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
                   />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="license" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                     License
                   </Label>
                   <Select value={formData.license} onValueChange={(value) => handleInputChange("license", value)}>
                     <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Standard">Standard</SelectItem>
                       <SelectItem value="Extended">Extended</SelectItem>
                       <SelectItem value="Commercial">Commercial</SelectItem>
                       <SelectItem value="Enterprise">Enterprise</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="duration" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                     Duration
                   </Label>
                   <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                     <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="monthly">Monthly</SelectItem>
                       <SelectItem value="yearly">Yearly</SelectItem>
                       <SelectItem value="lifetime">Lifetime</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Features
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                List the features included in this plan
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder={`Feature ${index + 1} (e.g., 10GB Storage)`}
                    className="flex-1 border-gray-300 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700 border-red-300 hover:border-red-500"
                  >
                    <FiX className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Settings
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure plan settings
              </CardDescription>
            </CardHeader>
                         <CardContent className="p-6 space-y-4">
               <div className="flex items-center space-x-2">
                 <Checkbox
                   id="recommended"
                   checked={formData.recommended}
                   onCheckedChange={(checked) => handleInputChange("recommended", checked)}
                 />
                 <Label htmlFor="recommended" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                   Mark as Recommended Plan
                 </Label>
               </div>
             </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FiRotateCcw className="w-4 h-4 mr-2" />
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createPricingMutation.isPending}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="w-4 h-4" />
              {isSubmitting || createPricingMutation.isPending ? "Creating..." : "Create Plan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 