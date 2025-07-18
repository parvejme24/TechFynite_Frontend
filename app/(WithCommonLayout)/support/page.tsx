import SupportOption from "@/components/modules/support/SupportOptions/SupportOptions";
import FAQSection from "@/components/modules/support/FAQSection/FAQSection";
import GuaranteesAndPayments from "@/components/modules/support/GuaranteesAndPayments/GuaranteesAndPayments";
import PageHeader from "@/components/shared/PageHeader/PageHeadere";
import React from "react";

export default function page() {
  return (
    <div>
      <PageHeader
        title="We’d love or hear from you"
        subTitle="Stay in Touch with us "
      />

      <div className="container mx-auto max-w-7xl px-5 lg:px-0">
        <SupportOption />
        <GuaranteesAndPayments />
        <FAQSection />
      </div>
    </div>
  );
}
