"use client";
import EditBlogContainer from "@/components/modules/DadhboardModules/ADMIN/Blog/EditBlog/EditBlogContainer";

interface EditBlogPageProps {
  params: {
    id: string;
  };
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  return <EditBlogContainer blogId={params.id} />;
} 