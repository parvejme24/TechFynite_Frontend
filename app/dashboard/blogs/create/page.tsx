"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import CreateBlogContainer to ensure client-side only
const CreateBlogContainer = dynamic(
  () => import("@/components/modules/DadhboardModules/Blog/CreateBlog/CreateBlogContainer"),
  { ssr: false }
);

export default function CreateBlogPage() {
  return (
    <div>
      <CreateBlogContainer />
    </div>
  );
}
