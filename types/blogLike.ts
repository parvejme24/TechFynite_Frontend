export interface BlogLike {
  id: string;
  blogId: string;
  userId: string;
  createdAt: string;
  blog?: Blog;
  user?: User;
}

export interface Blog { id: string; }
export interface User { id: string; }