import FAQSection from "@/components/modules/pricing/FAQSection/FAQSection";
import GuaranteesAndPayments from "@/components/modules/pricing/GuaranteesAndPayments/GuaranteesAndPayments";
import PublicPricingList from "@/components/modules/pricing/PublicPricingList/PublicPricingList";

import PageHeader from "@/components/shared/PageHeader/PageHeader";
import React from "react";

export default function page() {
  return (
    <div>
      <PageHeader
        title=" Premium Template Collections"
        subTitle="Choose from our curated collection of high-quality templates. All templates include lifetime updates and support."
      />

      <div className="container mx-auto max-w-7xl px-5 lg:px-0">
        <PublicPricingList />
        <GuaranteesAndPayments />
        <FAQSection />
      </div>
    </div>
  );
}
