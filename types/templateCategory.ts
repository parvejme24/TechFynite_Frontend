export interface TemplateCategory {
  id: string;
  title: string;
  imageUrl?: string;
  templateCount: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  templates?: Template[];
}

export interface Template { id: string; }