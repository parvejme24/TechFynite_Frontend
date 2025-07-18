import React from "react";
import Image from "next/image";
import g1 from "@/assets/support/g1.png";
import g2 from "@/assets/support/g2.png";
import g3 from "@/assets/support/g3.png";

export default function GuaranteesAndPayments() {
  return (
    <div className="container mx-auto max-w-7xl px-5 lg:px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-14 sm:mt-20 lg:mt-24">
        <div className="flex gap-4 p-4 rounded-lg hover:bg-[#EAF3FF] dark:hover:bg-[#1E2B4D] transition-colors duration-300">
          <div className="flex-shrink-0">
            <Image
              src={g1}
              alt="SSL Secure Payments"
              className="w-12 h-12 sm:w-14 sm:h-14"
            />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-2">
              SSL Secure Payments
            </h4>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              We use industry standard payment systems to facilitate online
              payments.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-4 rounded-lg hover:bg-[#EAF3FF] dark:hover:bg-[#1E2B4D] transition-colors duration-300">
          <div className="flex-shrink-0">
            <Image
              src={g2}
              alt="Money Back Guarantee"
              className="w-12 h-12 sm:w-14 sm:h-14"
            />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-2">
              Money Back Guarantee
            </h4>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              We offer a 30-day money-back guarantee for all our products.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-4 rounded-lg hover:bg-[#EAF3FF] dark:hover:bg-[#1E2B4D] transition-colors duration-300">
          <div className="flex-shrink-0">
            <Image
              src={g3}
              alt="Accepted Payment Methods"
              className="w-12 h-12 sm:w-14 sm:h-14"
            />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-2">
              Accepted Payment Methods
            </h4>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              We accept all major credit cards, PayPal, and other popular
              payment methods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
