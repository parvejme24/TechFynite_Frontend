import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface TemplateCategory {
  id: string;
  title: string;
  slug: string | null;
  image: string | null;
  templateCount: number;
  createdAt: string;
  updatedAt: string;
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

export interface CreateTemplateCategoryData {
  title: string;
  slug: string;
  imageFile?: File;
}

export interface UpdateTemplateCategoryData extends Partial<CreateTemplateCategoryData> {
  id: string;
}

// Get all template categories
export const useGetAllTemplateCategories = (page: number = 1, limit: number = 10) => {
  return useQuery<TemplateCategoryListResponse>({
    queryKey: ['templateCategories', 'all', page, limit],
    queryFn: async () => {
      const response = await apiClient.get(`/template-categories?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
};

// Get all template categories for stats (no pagination)
export const useGetAllTemplateCategoriesForStats = () => {
  return useQuery<TemplateCategoryListResponse>({
    queryKey: ['templateCategories', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get(`/template-categories?page=1&limit=1000`);
      return response.data;
    },
  });
};

// Get single template category
export const useTemplateCategory = (id: string) => {
  return useQuery<TemplateCategory>({
    queryKey: ['templateCategory', id],
    queryFn: async () => {
      const response = await apiClient.get(`/template-categories/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Get template category stats
export const useTemplateCategoryStats = () => {
  return useQuery({
    queryKey: ['templateCategories', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/template-categories/stats');
      return response.data;
    },
  });
};

// Create template category
export const useCreateTemplateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation<TemplateCategory, Error, CreateTemplateCategoryData>({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('slug', data.slug);
      
      if (data.imageFile) {
        formData.append('image', data.imageFile);
      }


      const response = await apiClient.post('/template-categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate all template category queries to ensure stats update
      queryClient.invalidateQueries({ queryKey: ['templateCategories'] });
      queryClient.invalidateQueries({ queryKey: ['templateCategory'] });
    },
  });
};

// Update template category
export const useUpdateTemplateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation<TemplateCategory, Error, UpdateTemplateCategoryData>({
    mutationFn: async ({ id, ...data }) => {
      const formData = new FormData();
      
      if (data.title) formData.append('title', data.title);
      if (data.slug) formData.append('slug', data.slug);
      if (data.imageFile) formData.append('image', data.imageFile);

      const response = await apiClient.put(`/template-categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalidate all template category queries to ensure stats update
      queryClient.invalidateQueries({ queryKey: ['templateCategories'] });
      queryClient.invalidateQueries({ queryKey: ['templateCategory'] });
      queryClient.invalidateQueries({ queryKey: ['templateCategory', data.id] });
    },
  });
};

// Delete template category
export const useDeleteTemplateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/template-categories/${id}`);
    },
    onSuccess: () => {
      // Invalidate all template category queries to ensure stats update
      queryClient.invalidateQueries({ queryKey: ['templateCategories'] });
      queryClient.invalidateQueries({ queryKey: ['templateCategory'] });
    },
  });
};
