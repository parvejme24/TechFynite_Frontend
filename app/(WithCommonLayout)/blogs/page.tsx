import BlogContainer from "@/components/modules/blogs/BlogContainer";
import Newsletter from "@/components/shared/Newsletter/Newsletter";
import PageHeader from "@/components/shared/PageHeader/PageHeader";
import React from "react";

export default function BlogPage() {
  return (
    <div>
      <PageHeader title="Trending Blog Post " subTitle="Home > Blog" value="" />
      <BlogContainer />
      <Newsletter />
    </div>
  );
}
