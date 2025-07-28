import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import g1 from "@/assets/pricing/g1.png";
import g2 from "@/assets/pricing/g1.png";
import g3 from "@/assets/pricing/g1.png";
import PayCards from "@/assets/pricing/pay-cards.png";

type Guarantee = {
  image: StaticImageData;
  title: string;
  description?: string;
  paymentImage?: StaticImageData;
  alt: string;
};

const guarantees: Guarantee[] = [
  {
    image: g1,
    title: "SSL Secure Payments",
    description:
      "We use industry standard payment systems to facilitate online payments.",
    alt: "SSL Secure Payments",
  },
  {
    image: g2,
    title: "Money Back Guarantee",
    description: "We offer a 30-day money-back guarantee for all our products.",
    alt: "Money Back Guarantee",
  },
  {
    image: g3,
    title: "Accepted Payment Methods",
    paymentImage: PayCards,
    alt: "Accepted Payment Methods",
  },
];

export default function GuaranteesAndPayments() {
  return (
    <div className="container mx-auto max-w-7xl px-5 lg:px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-14 sm:mt-20 lg:mt-24">
        {guarantees.map((guarantee, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 rounded-lg hover:bg-[#EAF3FF] dark:hover:bg-[#1E2B4D] transition-colors duration-300"
          >
            <div className="flex-shrink-0">
              <Image
                src={guarantee.image}
                alt={guarantee.alt}
                draggable={false}
                className="w-[60px] h-[60px] sm:w-14 sm:h-14"
              />
            </div>
            <div>
              <h4 className="text-[21px] sm:text-xl font-bold mb-2">
                {guarantee.title}
              </h4>
              {guarantee.description ? (
                <p className="text-[13px] font-light dark:text-gray-300">
                  {guarantee.description}
                </p>
              ) : (
                <div className="mt-2">
                  <Image
                    src={guarantee.paymentImage!}
                    alt="Payment Methods"
                    className="w-full max-w-[200px] h-auto"
                    draggable={false}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
