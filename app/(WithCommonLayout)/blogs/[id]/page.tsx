import React from "react";
import BlogDetailsContainer from "@/components/modules/blogs/BlogDetails/BlogDetailsContainer";
import Newsletter from "@/components/shared/Newsletter/Newsletter";

export default async function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <BlogDetailsContainer id={id} />
      <Newsletter />
    </div>
  );
}
