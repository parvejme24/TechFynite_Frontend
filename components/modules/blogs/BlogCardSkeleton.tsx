import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface BlogCardSkeletonProps {
  delay?: number;
}

const BlogCardSkeleton: React.FC<BlogCardSkeletonProps> = ({ delay = 0 }) => {
  return (
    <Card className="p-2 dark:bg-[#1A1D37]">
      <CardHeader className="p-2">
        <div 
          className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"
          style={{ animationDelay: `${delay}ms` }}
        ></div>
      </CardHeader>
      <CardContent className="p-2 -mt-8">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div 
            className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"
            style={{ animationDelay: `${delay + 100}ms` }}
          ></div>
        </div>
        <div 
          className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-1"
          style={{ animationDelay: `${delay + 200}ms` }}
        ></div>
        <div 
          className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"
          style={{ animationDelay: `${delay + 250}ms` }}
        ></div>
      </CardContent>
      <CardFooter className="p-2">
        <div 
          className="h-10 w-full bg-gray-300 dark:bg-gray-600 rounded animate-pulse"
          style={{ animationDelay: `${delay + 300}ms` }}
        ></div>
      </CardFooter>
    </Card>
  );
};

export default BlogCardSkeleton; 