export interface BlogContent {
  id: string;
  blogId: string;
  heading: string;
  description: string[];
  imageUrl?: string;
  createdAt: string;
  blog?: Blog;
}

export interface Blog { id: string; }