"use client";
import EditBlogContainer from "@/components/modules/DadhboardModules/Blog/EditBlog/EditBlogContainer";

interface EditBlogPageProps {
  params: {
    id: string;
  };
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  return <EditBlogContainer blogId={params.id} />;
} 