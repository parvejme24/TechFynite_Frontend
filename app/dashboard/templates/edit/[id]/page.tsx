import EditTemplateContainer from "@/components/modules/DadhboardModules/Templates/EditTemplateContainer";
import React from "react";

export default function EditTemplatePage({ params }: { params: { id: string } }) {
  return <EditTemplateContainer templateId={params.id} />;
}
