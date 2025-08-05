export interface Blog {
  id: string;
  title: string;
  categoryId: string;
  imageUrl?: string;
  description: string[];
  likes: number;
  readingTime: number;
  authorId: string;
  content: BlogContent[];
  createdAt: string;
  updatedAt: string;
  blogLikes?: BlogLike[];
  reviews?: BlogReview[];
  author?: User;
  category?: BlogCategory;
}

export interface BlogContent { id: string; }
export interface BlogLike { id: string; }
export interface BlogReview { id: string; }
export interface User { id: string; }
export interface BlogCategory { id: string; }