import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pricing } from "@/types/pricing";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { FiCalendar, FiDollarSign } from "react-icons/fi";

export default function PricingCard({ plan }: { plan: Pricing }) {
  return (
    <Card
      key={plan.id}
      className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative"
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
          </div>

          {/* Recommended */}
          <div className="flex items-center gap-2 absolute top-0">
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
