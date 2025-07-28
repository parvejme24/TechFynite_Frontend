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
import { Button } from "@/components/ui/button";

export default function PricingCard({ plan }: { plan: Pricing }) {
  return (
    <Card
      key={plan.id}
      className="bg-white dark:bg-[#1A1D37] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative"
    >
      <CardHeader>
        <div className="flex justify-center items-start">
          <div>
            <CardTitle className="text-xl text-center font-semibold text-gray-900 dark:text-white">
              {plan.title}
            </CardTitle>
            <CardDescription className="text-gray-600 text-center dark:text-gray-400 mt-1">
              License: {plan.license} • Duration: {plan.duration}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="">
          {/* Price */}
          <div className="flex justify-center items-center gap-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              ${plan.price}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 justify-center mt-2">
            <Badge variant="default">{plan.license}</Badge>
          </div>

          {/* Recommended */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            {plan.recommended && (
              <Badge variant="destructive" className="text-white bg-yellow-500 hover:bg-yellow-600">Recommended</Badge>
            )}
          </div>

          {/* Features */}
          <div className="space-y-2 mt-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Features:
            </h4>
            <ul className="space-y-1">
              {plan.features.map((feature, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Created Date */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
            <Button className="w-full bg-blue-700 hover:bg-blue-600 text-white cursor-pointer">
              Buy Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
