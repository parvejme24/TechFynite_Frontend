"use client";
import Image from "next/image";
import React from "react";
import BlogCard from "./BlogCard";

type Blog = {
  id: number;
  title: string;
  category: string;
  description: string[];
  image: string;
  comments?: unknown[];
  readingTime?: number | string;
};

export default function BlogContainer() {
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    fetch("/blogs.json")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as any[];
        if (!active) return;
        const mapped: Blog[] = (data || []).map((b) => {
          const descArr = Array.isArray(b.description) ? b.description : [];
          const wordCount = descArr.join(" ").trim().split(/\s+/).filter(Boolean).length;
          const readingTime = Math.max(1, Math.round(wordCount / 200));
          return {
            id: Number(b.id),
            title: String(b.title || ""),
            category: String(b.category || ""),
            description: descArr,
            image: String(b.image || ""),
            comments: Array.isArray(b.comments) ? b.comments : [],
            readingTime: b.readingTime ?? readingTime,
          };
        });
        setBlogs(mapped);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError((e as Error).message);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-5 lg:px-0 py-10">
        Failed to load blogs.
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-5 lg:px-0 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {!loading && blogs.map((b) => <BlogCard key={b.id} blog={b} />)}
      </div>
    </div>
  );
}
