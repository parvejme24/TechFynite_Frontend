import React from "react";
import { Button } from "@/components/ui/button";

interface ServiceRequestPaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export default function ServiceRequestPagination({ page, setPage, totalPages }: ServiceRequestPaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1];
    if (page > 4) pages.push(-1);
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 3) pages.push(-2);
    pages.push(totalPages);
    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex justify-center mt-4 gap-2">
      {pages.map((p, idx) =>
        p === -1 || p === -2 ? (
          <span key={p + idx} className="px-2 text-gray-400">...</span>
        ) : (
          <Button
            key={p}
            variant={page === p ? "default" : "outline"}
            onClick={() => setPage(p)}
            disabled={page === p}
            className="px-3 py-1"
          >
            {p}
          </Button>
        )
      )}
    </div>
  );
}
