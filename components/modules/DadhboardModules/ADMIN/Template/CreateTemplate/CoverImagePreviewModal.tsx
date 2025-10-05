"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { FiX } from "react-icons/fi";
import Image from "next/image";

interface CoverImagePreviewModalProps {
  showCoverPreview: boolean;
  setShowCoverPreview: (show: boolean) => void;
  coverImage: File | null;
}

export default function CoverImagePreviewModal({
  showCoverPreview,
  setShowCoverPreview,
  coverImage,
}: CoverImagePreviewModalProps) {
  if (!showCoverPreview || !coverImage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cover Image Preview
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCoverPreview(false)}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FiX className="w-4 h-4" />
          </Button>
        </div>
        <div className="relative w-full h-96">
          <Image
            src={URL.createObjectURL(coverImage)}
            alt="Cover preview"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
} 