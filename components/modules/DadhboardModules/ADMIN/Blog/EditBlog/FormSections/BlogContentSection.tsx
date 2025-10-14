"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StructuredContentEditor, { BlogContent } from "../StructuredContentEditor";

interface BlogContentSectionProps {
  content: BlogContent;
  onContentChange: (content: BlogContent) => void;
}

const BlogContentSection: React.FC<BlogContentSectionProps> = ({
  content,
  onContentChange,
}) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Content</CardTitle>
      </CardHeader>
      <CardContent>
        <StructuredContentEditor value={content} onChange={onContentChange} />
      </CardContent>
    </Card>
  );
};

export default BlogContentSection;
