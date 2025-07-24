"use client";
import React, { useEffect, useState } from "react";
import BlogList from "./BlogList";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

export default function BlogContainer() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/blogs`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        // If the response is an array, use it directly
        setBlogs(Array.isArray(data) ? data : data.data || data.blogs || []);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleEditBlog = (blog: any) => {
    alert(`Edit blog: ${blog.title}`);
    // Implement edit logic/modal here
  };

  const handleDeleteBlog = (blog: any) => {
    if (confirm(`Are you sure you want to delete blog: ${blog.title}?`)) {
      // Implement delete API call here
      alert(`Deleted blog: ${blog.title}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blogs</h2>
        <Link href="/dashboard/blogs/create">
          <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow">
            Create New Blog
          </button>
        </Link>
      </div>
      <div className="">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : blogs.length === 0 ? (
          <div>No blogs found.</div>
        ) : (
          <BlogList
            blogs={blogs}
            onEdit={handleEditBlog}
            onDelete={handleDeleteBlog}
          />
        )}
      </div>
    </div>
  );
}
