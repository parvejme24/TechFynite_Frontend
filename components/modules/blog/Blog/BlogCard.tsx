"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaRegComment } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    imageUrl?: string | null;
    description?: string;
    author?: { displayName: string; photoUrl?: string | null };
    category?: { title: string };
    createdAt?: string;
    readingTime?: number;
    likes?: number;
    reviews?: [];
  };
  onClick?: () => void;
  onEdit?: (blog: any) => void;
  onDelete?: (blog: any) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  onClick,
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close actions menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        setShowActions(false);
      }
    }
    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActions]);

  return (
    <Card className="p-2 dark:bg-[#1A1D37]">
      <CardHeader className="p-2">
        <Image
          src={blog.imageUrl || ""}
          alt={blog.title}
          width={100}
          height={100}
          className="w-full h-full object-cover rounded-md"
        />
      </CardHeader>
      <CardContent className="p-2 -mt-8">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-bold">{"Category"}</h3>
          <div ref={actionsRef} className="relative">
            <Button
              className="cursor-pointer bg-transparent hover:bg-transparent text-white text-4xl"
              onClick={() => setShowActions((prev) => !prev)}
            >
              <BsThreeDots />
            </Button>
            {showActions && (
              <div className="absolute right-0 mt-0 flex flex-col gap-2 rounded shadow z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer bg-gray-300 dark:bg-black text-black dark:text-white rounded-full p-2"
                  onClick={() => onEdit && onEdit(blog)}
                >
                  <FiEdit2 />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer bg-gray-300 dark:bg-red-500 text-black dark:text-white rounded-full p-2"
                  onClick={() => onDelete && onDelete(blog)}
                >
                  <FiTrash2 />
                </Button>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500">{blog.title}</p>
      </CardContent>
      <CardFooter className="p-2 grid grid-cols-2 gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => router.push(`/dashboard/blogs/${blog.id}`)}
        >
          View Details
        </Button>

        <div className="ml-auto flex items-center gap-1">
          <FaRegComment />
          {blog.reviews?.length ?? 0}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
