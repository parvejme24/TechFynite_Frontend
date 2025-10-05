"use client";

import React from "react";
import CardBgD from "@/public/images/analytics-bg-d.png";
import CardBgL from "@/public/images/analytics-bg-l.png";
import CountUp from "react-countup";

interface AnaliticsData {
  title: string;
  count: number;
};

const analitics: AnaliticsData[] = [
  {
    title: "Total Product",
    count: 100,
  },
  {
    title: "Email Subscription",
    count: 1200,
  },
  {
    title: "Total Download",
    count: 5000,
  },
  {
    title: "Monthly Visitor",
    count: 100000,
  },
];

const AnalyticsCard = ({ title, count }: { title: string; count: number }) => (
  <div className="md:min-h-[200px] bg-[#F5F9FF] dark:bg-[#1A1D37] border border-[#ABCFFE] dark:border-[#16073E] rounded-xl p-6 lg:py-14 flex flex-col justify-center items-center text-center relative">
    <div
      className="absolute inset-0 rounded-xl transition-opacity duration-300 dark:opacity-0"
      style={{
        backgroundImage: `url(${CardBgL.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
    <div
      className="absolute inset-0 rounded-xl opacity-0 dark:opacity-100 transition-opacity duration-300"
      style={{
        backgroundImage: `url(${CardBgD.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
    <div className="relative z-10">
      <h3 className="text-xl font-extrabold md:text-3xl text-white">
        <CountUp
          end={count}
          duration={2.5}
          enableScrollSpy
          scrollSpyOnce
          suffix="+"
        />
      </h3>
      <p className="text-sm md:text-lg text-gray-200 dark:text-gray-300 mt-2">
        {title}
      </p>
    </div>
  </div>
);

export default function Analytcis() {
  return (
    <section className="bg-gradient-to-b from-[#FFFFFF] dark:from-[#010212] to-[#EAF2FF] dark:to-[#010422] py-20">
      <div className="container mx-auto max-w-7xl px-5 lg:px-0">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-[34px] font-bold">Results & Analytcis</h3>
          <p className="text-xl md:text-[24px] font-light">
            Performance Insight & Analytics Overview
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {analitics.map((item) => (
            <AnalyticsCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
