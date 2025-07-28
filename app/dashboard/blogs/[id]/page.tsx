import BlogDetailsContainer from "@/components/modules/DadhboardModules/Blog/BlogDetails/BlogDetailsContainer";
import React from "react";

export default function BlogDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <BlogDetailsContainer params={params} />
    </div>
  );
}
