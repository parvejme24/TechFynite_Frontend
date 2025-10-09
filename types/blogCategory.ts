export interface BlogCategory {
  id: string;
  title: string;
  slug?: string | null;
  imageUrl?: string | null;
  blogCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: Pagination;
}

export interface Blog { id: string; }