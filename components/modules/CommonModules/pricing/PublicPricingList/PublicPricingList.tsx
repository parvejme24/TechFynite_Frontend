import React from "react";
import PricingCard from "./PricingCard/PricingCard";

const pricingList = [
  {
    id: 1,
    title: "Personal",
    description: "3 Website Licenses",
    price: "10",
    recommended: false,
    features: [
      "Access to All Templates",
      "SP Page Builder Pro",
      "Access to All Extensions",
      "Access to All Layout Bundles",
      "3 Websites License",
      "1 Year Support & Updates",
    ],
  },
  {
    id: 2,
    title: "Business",
    description: "10 Website Licenses",
    price: "199",
    recommended: true,
    features: [
      "Access to All Templates",
      "SP Page Builder Pro",
      "Access to All Extensions",
      "Access to All Layout Bundles",
      "10 Websites License",
      "1 Year Support & Updates",
    ],
  },
  {
    id: 3,
    title: "Agency",
    description: "Unlimited Website Licenses",
    price: "499",
    recommended: false,
    features: [
      "Access to All Templates",
      "SP Page Builder Pro",
      "Access to All Extensions",
      "Access to All Layout Bundles",
      "Unlimited Websites License",
      "1 Year Support & Updates",
    ],
  },
];

export default function PublicPricingList() {
  return (
    <div>
      <div className="container mx-auto max-w-7xl px-5 lg:px-0 py-14">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 dark:text-white">
            Pricing Plans
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Worried about choosing the right package? Choose from multiple
            pricing options and get your project off the bench with the pricing
            plan that works best for you.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {pricingList.map((item) => (
            <div
              key={item.id}
              className={item.recommended ? "relative" : "relative"}
            >
              <PricingCard plan={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
