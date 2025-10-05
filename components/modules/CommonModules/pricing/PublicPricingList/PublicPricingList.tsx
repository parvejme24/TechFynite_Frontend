"use client";

import React from "react";
import PricingCard from "./PricingCard/PricingCard";
import PricingCardSkeleton from "./PricingCard/PricingCardSkeleton";
// Mock pricing hook - in real app, this would be imported from your API hooks
const usePricing = () => {
  return {
    data: [], // Empty array for now
    isLoading: false,
    error: null,
  };
};
import { Pricing } from "@/types/pricing";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

export default function PublicPricingList() {
  const { data: pricingPlans = [], isLoading, error } = usePricing();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-14">
        <Swiper
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="pricing-swiper"
        >
          {[1, 2, 3].map((index) => (
            <SwiperSlide key={index}>
              <PricingCardSkeleton />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-16">
          <div className="text-lg text-red-600 mb-2">
            Error loading pricing plans
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#0F5BBD] text-white rounded-md hover:bg-[#0F5BBD]/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no plans are available, show a message
  if (pricingPlans.length === 0 && !isLoading && !error) {
    return (
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-16">
          <div className="text-gray-500 dark:text-gray-400">
            <h3 className="text-lg font-medium mb-2">
              No pricing plans available
            </h3>
            <p>Please check back later for our pricing options.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      {pricingPlans.length > 0 ? (
                 <Swiper
           modules={[Navigation]}
           spaceBetween={30}
           slidesPerView={1}
           navigation={true}
           breakpoints={{
             640: {
               slidesPerView: 2,
               spaceBetween: 20,
             },
             768: {
               slidesPerView: 2,
               spaceBetween: 30,
             },
             1024: {
               slidesPerView: 3,
               spaceBetween: 30,
             },
           }}
           className="pricing-swiper"
         >
          {pricingPlans.map((plan: Pricing) => (
            <SwiperSlide key={plan.id}>
              <PricingCard plan={plan} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <h3 className="text-lg font-medium mb-2">
              No pricing plans available
            </h3>
            <p>Please check back later for our pricing options.</p>
          </div>
        </div>
      )}
    </div>
  );
}
