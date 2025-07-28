import React from "react";
import BlogDetailsContainer from "@/components/modules/blogs/BlogDetails/BlogDetailsContainer";

export default function BlogDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <BlogDetailsContainer id={params.id} />
    </div>
  );
}
