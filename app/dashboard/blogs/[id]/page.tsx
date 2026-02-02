"use client";
import { use } from "react";
import BlogDetailsContainer from "@/components/modules/DadhboardModules/Blog/BlogDetails/BlogDetailsContainer";

export default function BlogDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <div>
      <BlogDetailsContainer params={resolvedParams} />
    </div>
  );
}
