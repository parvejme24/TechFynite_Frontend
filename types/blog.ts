// Base Blog interface
export interface IBlog {
  id: string;
  title: string;
  categoryId: string;
  featuredImageUrl?: string | null;
  description: string; // String field for multiple paragraphs
  readingTime: number;
  authorId: string;
  slug?: string | null;
  isPublished: boolean;
  viewCount: number;
  reactCount: number;
  createdAt: Date;
  updatedAt: Date;
  content?: any; // JSON field for rich text editor
  screenshots?: string[]; // Array of image URLs
  author?: {
    id: string;
    fullName: string;
    email: string;
  };
  category?: {
    id: string;
    title: string;
    slug: string;
  };
  blogLikes?: any[];
  reactions?: IBlogReaction[];
  reviews?: any[];
  comments?: any[]; // Alias for reviews
}

// Blog creation interface
export interface ICreateBlog {
  title: string;
  categoryId: string;
  featuredImageUrl?: string;
  description: string; // String field
  readingTime: number;
  authorId: string;
  slug?: string;
  isPublished?: boolean;
  content?: any; // JSON field for rich text editor
  screenshots?: string[]; // Array of image URLs
}

// Blog update interface
export interface IUpdateBlog {
  title?: string;
  categoryId?: string;
  featuredImageUrl?: string;
  description?: string; // String field
  readingTime?: number;
  slug?: string;
  isPublished?: boolean;
  content?: any; // JSON field for rich text editor
  screenshots?: string[]; // Array of image URLs
}

// Blog query interface
export interface IBlogQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  authorId?: string;
  isPublished?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'reactCount' | 'viewCount' | 'readingTime';
  sortOrder?: 'asc' | 'desc';
}

// Blog reaction interface
export interface IBlogReaction {
  id: string;
  blogId: string;
  userId: string;
  reactionType: 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';
  createdAt: Date;
  user?: {
    id: string;
    fullName: string;
    email: string;
    profile?: {
      avatarUrl?: string;
    };
  };
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
  totalReactions: number;
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