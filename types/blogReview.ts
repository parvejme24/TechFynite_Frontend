export interface BlogReview {
  id: string;
  blogId: string;
  userId: string;
  fullName: string;
  email: string;
  photoUrl?: string;
  commentText: string;
  reply?: any;
  createdAt: string;
  updatedAt: string;
  blog?: Blog;
  user?: User;
}

export interface Blog { id: string; }
export interface User { id: string; }