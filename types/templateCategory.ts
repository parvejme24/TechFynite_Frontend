export interface TemplateCategory {
  id: string;
  title: string;
  slug: string | null;
  image: string | null;
  templateCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateCategoryData {
  title: string;
  slug: string;
  imageFile?: File;
}

export interface UpdateTemplateCategoryData extends Partial<CreateTemplateCategoryData> {
  id: string;
}

export interface TemplateCategoryListResponse {
  success: boolean;
  message: string;
  data: TemplateCategory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}