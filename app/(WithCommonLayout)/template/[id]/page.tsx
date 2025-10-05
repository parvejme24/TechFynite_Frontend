import TemplateDetailsContainer from "@/components/modules/CommonModules/template/TemplateDetails/TemplateDetailsContainer";
import React from "react";

export default function TemplateDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <TemplateDetailsContainer id={params.id} />
    </div>
  );
}
