"use client";
import { use } from "react";
import EditBlogContainer from "@/components/modules/DadhboardModules/Blog/EditBlog/EditBlogContainer";

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = use(params);
  return <EditBlogContainer blogId={id} />;
} 