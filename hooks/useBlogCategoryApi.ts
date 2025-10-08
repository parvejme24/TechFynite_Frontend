import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { BlogCategory } from '@/types/blogCategory';

export interface BlogCategoryListResponse {
  categories: BlogCategory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateBlogCategoryData {
  title: string;
  imageUrl?: string;
  slug: string;
  imageFile?: File;
}

export interface UpdateBlogCategoryData extends Partial<CreateBlogCategoryData> {
  id: string;
}

// Get all blog categories
export const useGetAllBlogCategories = (page: number = 1, limit: number = 10) => {
  return useQuery<BlogCategoryListResponse>({
    queryKey: ['blogCategories', 'all', page, limit],
    queryFn: async () => {
      const response = await apiClient.get(`/blog-categories?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
};

// Get single blog category
export const useBlogCategory = (id: string) => {
  return useQuery<BlogCategory>({
    queryKey: ['blogCategory', id],
    queryFn: async () => {
      const response = await apiClient.get(`/blog-categories/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Create blog category
export const useCreateBlogCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BlogCategory, Error, CreateBlogCategoryData>({
    mutationFn: async (data) => {
      const response = await apiClient.post('/blog-categories', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogCategories'] });
    },
  });
};

// Update blog category
export const useUpdateBlogCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BlogCategory, Error, UpdateBlogCategoryData>({
    mutationFn: async ({ id, ...data }) => {
      const response = await apiClient.put(`/blog-categories/${id}`, data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogCategories'] });
      queryClient.invalidateQueries({ queryKey: ['blogCategory', data.id] });
    },
  });
};

// Delete blog category
export const useDeleteBlogCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/blog-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogCategories'] });
    },
  });
};
