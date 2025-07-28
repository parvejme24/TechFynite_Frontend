import TemplateDetailsContainer from "@/components/modules/DadhboardModules/Template/TemplateDetails/TemplateDetailsContainer";
import PageHeader from "@/components/shared/PageHeader/PageHeader";
import React from "react";

export default function TemplateDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      {/* <PageHeader
        title="products available for purchase"
        subTitle="Explore the best premium themes and plugins available for sale. Our unique collection is hand-curated by experts. Find and buy the perfect premium theme."
        value="58000"
      /> */}
      <TemplateDetailsContainer id={params.id} />
    </div>
  );
}
