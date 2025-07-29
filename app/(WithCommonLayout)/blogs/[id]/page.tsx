import React from "react";
import BlogDetailsContainer from "@/components/modules/blogs/BlogDetails/BlogDetailsContainer";
import Newsletter from "@/components/shared/Newsletter/Newsletter";

interface BlogDetailsPageProps {
  params: { id: string };
}

export default function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  return (
    <div>
      <BlogDetailsContainer id={params.id} />
      <Newsletter />
    </div>
  );
}
