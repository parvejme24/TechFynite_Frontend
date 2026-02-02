"use client";
import { use } from "react";
import EditTemplateContainer from "@/components/modules/DadhboardModules/Templates/EditTemplateContainer";

export default function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <EditTemplateContainer templateId={id} />;
}
