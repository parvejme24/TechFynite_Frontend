"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { FaPlus, FaImage, FaTrash, FaGripVertical } from "react-icons/fa";

interface ContentBlock {
  heading: string;
  description: string;
  image: File | null;
  imagePreview: string;
}

interface ContentBlocksEditorProps {
  contentBlocks: ContentBlock[];
  handleContentChange: (idx: number, field: "heading" | "description", value: string) => void;
  handleContentImageChange: (idx: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveContentImage: (idx: number) => void;
  addContentBlock: () => void;
  removeContentBlock: (idx: number) => void;
}

const ContentBlocksEditor: React.FC<ContentBlocksEditorProps> = ({
  contentBlocks,
  handleContentChange,
  handleContentImageChange,
  handleRemoveContentImage,
  addContentBlock,
  removeContentBlock,
}) => {
  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaGripVertical className="w-5 h-5 text-blue-500" />
          Content Blocks
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add multiple content sections to your blog
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {contentBlocks.map((block, idx) => (
          <Card key={idx} className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Content Block {idx + 1}
                  </h3>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => removeContentBlock(idx)}
                  disabled={contentBlocks.length === 1}
                >
                  <FaTrash className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Heading */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Heading
                </Label>
                <Input
                  type="text"
                  placeholder="Enter a compelling heading..."
                  value={block.heading}
                  onChange={(e) => handleContentChange(idx, "heading", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </Label>
                <Textarea
                  placeholder="Write detailed content for this section..."
                  value={block.description}
                  onChange={(e) => handleContentChange(idx, "description", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px] resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Image (Optional)
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaImage className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> content image
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleContentImageChange(idx, e)}
                    />
                  </label>
                </div>
                
                {/* Image Preview */}
                {block.imagePreview && (
                  <div className="relative inline-block mt-2">
                    <Image
                      src={block.imagePreview}
                      alt="Content preview"
                      width={200}
                      height={150}
                      className="rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200"
                      onClick={() => handleRemoveContentImage(idx)}
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Content Block Button */}
        <div className="flex justify-center pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={addContentBlock}
            className="px-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-200"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Add Content Block
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentBlocksEditor; 