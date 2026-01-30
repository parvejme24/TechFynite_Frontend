"use client";

import TemplatesContainer from "@/components/modules/CommonModules/template/TemplateContainer";
import PageHeader from "@/components/shared/PageHeader/PageHeader";
import React, { Suspense } from "react";

export default function TemplatesPage() {
  return (
    <div>
      <PageHeader
        title="products available for purchase"
        subTitle="Explore the best premium themes and plugins available for sale. Our unique collection is hand-curated by experts. Find and buy the perfect premium theme."
        value="58000"
      />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      }>
        <TemplatesContainer />
      </Suspense>
    </div>
  );
}
