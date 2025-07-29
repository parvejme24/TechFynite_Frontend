import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useDeletePricing } from "@/hooks/usePricingApi";
import { Pricing } from "@/types/pricing";
import Link from "next/link";
import React from "react";
import { FiCalendar, FiDollarSign, FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

export default function PricingCard({ plan }: { plan: Pricing }) {
  const deletePricingMutation = useDeletePricing();

  const handleDeletePricing = async (id: string, title: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      await deletePricingMutation.mutateAsync(id);
      toast.success(`${title} has been deleted successfully.`);
    }
  };

  return (
    <Card
      key={plan.id}
      className="bg-white dark:bg-[#1A1D37] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
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
                className="cursor-pointer text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <FiEdit className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeletePricing(plan.id, plan.title)}
              disabled={deletePricingMutation.isPending}
              className="cursor-pointer text-red-600 border-red-300 hover:bg-red-50"
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
  );
}
