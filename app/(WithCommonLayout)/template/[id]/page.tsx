import TemplateDetailsContainer from "@/components/modules/CommonModules/template/TemplateDetails/TemplateDetailsContainer";
import type { Metadata } from "next";
import React from "react";
import apiClient from "@/lib/api-client";

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const response = await apiClient.get(`/templates/${id}`);
    const template = response.data.data;

    if (template) {
      return {
        title: `${template.title} - TechFynite`,
        description: template.shortDescription || `Premium ${template.title} template available at TechFynite`,
        openGraph: {
          title: template.title,
          description: template.shortDescription || `Premium ${template.title} template`,
          images: template.imageUrl ? [template.imageUrl] : [],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: template.title,
          description: template.shortDescription || `Premium ${template.title} template`,
          images: template.imageUrl ? [template.imageUrl] : [],
        },
      };
    }
  } catch (error) {
    // Fallback metadata if template fetch fails
    return {
      title: "Template Details - TechFynite",
      description: "View template details and purchase premium templates",
    };
  }

  return {
    title: "Template Details - TechFynite",
    description: "View template details and purchase premium templates",
  };
}

export default async function TemplateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TemplateDetailsContainer id={id} />;
}
