"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface BlogTitleSectionProps {
  title: string;
  onTitleChange: (title: string) => void;
}

const BlogTitleSection: React.FC<BlogTitleSectionProps> = ({
  title,
  onTitleChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          name="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter blog title"
          required
          className="cursor-text"
        />
      </CardContent>
    </Card>
  );
};

export default BlogTitleSection;

