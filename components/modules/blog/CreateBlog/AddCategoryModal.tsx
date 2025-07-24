import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string, slug: string, imageUrl: string) => void;
  loading: boolean;
  error: string;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ open, onClose, onAdd, loading, error }) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(title, slug, imageUrl);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Add New Category</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <Input
            placeholder="Slug"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            required
          />
          <Input
            placeholder="Image URL"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            required
          />
          <div className="flex gap-2 mt-4">
            <Button type="submit" disabled={loading || !title.trim() || !slug.trim() || !imageUrl.trim()}>
              {loading ? "Adding..." : "Add Category"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal; 