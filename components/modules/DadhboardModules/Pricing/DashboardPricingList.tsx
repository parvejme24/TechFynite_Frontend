"use client";

import React from "react";
import { usePricing, useDeletePricing } from "@/hooks/usePricingApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiDollarSign,
  FiCalendar,
} from "react-icons/fi";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardPricingList() {
  const { data: pricingPlans = [], isLoading, error } = usePricing();
  const deletePricingMutation = useDeletePricing();

  const handleDeletePricing = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await deletePricingMutation.mutateAsync(id);
        toast.success("Pricing plan deleted successfully!");
      } catch (error) {
        console.error("Error deleting pricing plan:", error);
        toast.error("Failed to delete pricing plan. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading pricing plans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Error loading pricing plans</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Pricing Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your pricing plans and subscriptions
              </p>
            </div>
            <Link href="/dashboard/pricing/create">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <FiPlus className="w-4 h-4" />
                Create Pricing Plan
              </Button>
            </Link>
          </div>
        </div>

        {/* Pricing Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingPlans.length > 0 ? (
            pricingPlans.map((plan) => (
              <Card
                key={plan.id}
                className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        {plan.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                        License: {plan.license} • Duration: {plan.duration}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/pricing/edit/${plan.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        >
                          <FiEdit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePricing(plan.id, plan.title)}
                        disabled={deletePricingMutation.isPending}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {plan.duration}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{plan.license}</Badge>
                      {plan.recommended && (
                        <Badge variant="destructive">Recommended</Badge>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Features:
                      </h4>
                      <ul className="space-y-1">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                        {plan.features.length > 3 && (
                          <li className="text-sm text-gray-500">
                            +{plan.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiCalendar className="w-4 h-4" />
                      Created: {new Date(plan.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <FiDollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No pricing plans yet</h3>
                <p className="mb-6">Create your first pricing plan to get started.</p>
              </div>
              <Link href="/dashboard/pricing/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <FiPlus className="w-4 h-4 mr-2" />
                  Create First Plan
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 