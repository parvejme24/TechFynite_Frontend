"use client";
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem, SelectContent } from "@/components/ui/select";
import { FiX } from "react-icons/fi";

const API_BASE_URL = "http://localhost:5000/api/v1";

export default function CreateBlogContainer() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [category, setCategory] = useState("__placeholder__");
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [content, setContent] = useState<
    { text: string; paragraph: string; image: string }[]
  >([{ text: "", paragraph: "", image: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch categories on mount
  React.useEffect(() => {
    fetch(`${API_BASE_URL}/blog-categories`)
      .then((res) => res.json())
      .then((data) =>
        setCategories(Array.isArray(data) ? data : data.data || [])
      )
      .catch(() => setCategories([]));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newCategory }),
      });
      if (!res.ok) throw new Error("Failed to create category");
      const data = await res.json();
      setCategories((prev) => [...prev, data]);
      setCategory(data.id || data._id || "");
      setNewCategory("");
    } catch (err: any) {
      setError(err.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleAddContentContainer = () => {
    setContent((prev) => [...prev, { text: "", paragraph: "", image: "" }]);
  };

  const handleRemoveContentContainer = (idx: number) => {
    setContent((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleContentFieldChange = (
    idx: number,
    field: "text" | "paragraph" | "image",
    value: string
  ) => {
    setContent((prev) =>
      prev.map((block, i) => (i === idx ? { ...block, [field]: value } : block))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("categoryId", category);
      formData.append("content", JSON.stringify(content));
      if (image) formData.append("image", image);
      const res = await fetch(`${API_BASE_URL}/blogs`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create blog");
      setSuccess("Blog created successfully!");
      setTitle("");
      setDescription("");
      setCategory("__placeholder__");
      setContent([]);
      setImage(null);
      setImagePreview(null);
    } catch (err: any) {
      setError(err.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Create New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div>
          <label className="block mb-1 font-medium">Image</label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-40 h-40 object-cover rounded"
            />
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Blog Category</label>
          <div className="flex gap-2">
            <Select value={category} onValueChange={setCategory} required>
              <SelectContent>
                <SelectItem value="__placeholder__" disabled>
                  Select blog category
                </SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id || cat._id} value={cat.id || cat._id}>
                    <span className="flex items-center gap-2">
                      <img
                        src={cat.imageUrl || "/assets/common/templates.png"}
                        alt={cat.title}
                        className="w-6 h-6 object-cover rounded-full bg-gray-200"
                        onError={(e) =>
                          (e.currentTarget.src = "/assets/common/templates.png")
                        }
                      />
                      <span>{cat.title}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-40"
            />
            <Button
              type="button"
              onClick={handleAddCategory}
              disabled={loading || !newCategory.trim()}
            >
              Add
            </Button>
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Blog Content</label>
          <div className="space-y-6">
            {content.map((block, idx) => (
              <div
                key={idx}
                className="border rounded p-4 relative bg-gray-50 dark:bg-gray-900"
              >
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Text (e.g. heading or label)"
                    value={block.text}
                    onChange={(e) =>
                      handleContentFieldChange(idx, "text", e.target.value)
                    }
                  />
                  <Textarea
                    placeholder="Paragraph"
                    value={block.paragraph}
                    onChange={(e) =>
                      handleContentFieldChange(idx, "paragraph", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Image URL"
                    value={block.image}
                    onChange={(e) =>
                      handleContentFieldChange(idx, "image", e.target.value)
                    }
                  />
                </div>
                <button
                  type="button"
                  className="cursor-pointer absolute top-1 right-1 text-gray-500 hover:text-red-500"
                  onClick={() => handleRemoveContentContainer(idx)}
                  disabled={content.length === 1}
                  aria-label="Remove content block"
                >
                  <FiX size={20} />
                </button>
              </div>
            ))}
            <div className="flex justify-center mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddContentContainer}
              >
                + Add Content Block
              </Button>
            </div>
          </div>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Blog"}
        </Button>
      </form>
    </div>
  );
}
