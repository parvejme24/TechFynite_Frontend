export interface BlogReview {
  id: string;
  blogId: string;
  userId?: string | null;
  rating?: number | null;
  commentText: string;
  fullName: string;
  email: string;
  photoUrl?: string | null;
  isHidden: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  replies?: BlogReviewReply[];
  blog?: Blog;
  user?: User;
}

export interface BlogReviewReply {
  id: string;
  reviewId: string;
  replyText: string;
  userId?: string | null;
  adminId?: string | null;
  fullName?: string | null;
  email?: string | null;
  photoUrl?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateBlogReview {
  blogId: string;
  userId?: string;
  rating?: number;
  commentText: string;
  fullName: string;
  email: string;
  photoUrl?: string;
}

export interface CreateBlogReviewReply {
  reviewId: string;
  userId?: string;
  replyText: string;
  fullName: string;
  email: string;
  photoUrl?: string;
}

export interface UpdateBlogReview {
  rating?: number;
  commentText?: string;
  fullName?: string;
  email?: string;
  photoUrl?: string | null;
}

export interface BlogReviewQuery {
  page?: number;
  limit?: number;
  blogId?: string;
  userId?: string;
  rating?: number;
  sortBy?: 'createdAt' | 'rating' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface Blog { id: string; }
export interface User { id: string; }