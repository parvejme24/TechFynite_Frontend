import { Blog, BlogCategory, User, BlogLike, BlogReview } from "@prisma/client";

// Base Blog interface
export interface IBlog extends Blog {
  author?: User;
  category?: BlogCategory;
  blogLikes?: BlogLike[];
  reviews?: BlogReview[];
}

// Blog creation interface
export interface ICreateBlog {
  title: string;
  categoryId: string;
  imageUrl?: string;
  description: any; // JSON field
  readingTime: number;
  authorId: string;
  slug?: string;
  isPublished?: boolean;
  content?: any; // JSON field
}

// Blog update interface
export interface IUpdateBlog {
  title?: string;
  categoryId?: string;
  imageUrl?: string;
  description?: any;
  readingTime?: number;
  slug?: string;
  isPublished?: boolean;
  content?: any;
}

// Blog query interface
export interface IBlogQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  authorId?: string;
  isPublished?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'likes' | 'viewCount' | 'readingTime';
  sortOrder?: 'asc' | 'desc';
}

// Blog response interface
export interface IBlogResponse {
  success: boolean;
  message: string;
  data?: IBlog | IBlog[] | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Blog stats interface
export interface IBlogStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalViews: number;
  totalLikes: number;
  averageReadingTime: number;
  blogsByCategory: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
  }>;
  blogsByAuthor: Array<{
    authorId: string;
    authorName: string;
    count: number;
  }>;
}