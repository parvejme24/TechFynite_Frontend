export interface BlogCategory {
  id: string;
  title: string;
  imageUrl?: string;
  blogCount: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  blogs?: Blog[];
}

export interface Blog { id: string; }