import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Blog } from '@/types/blog';

export interface BlogListResponse {
  blogs: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateBlogData {
  title: string;
  categoryId: string;
  imageUrl?: string;
  description: string;
  content: any[];
  readingTime: number;
  image?: File;
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  id: string;
}

// Get all blogs
export const useGetAllBlogs = (page: number = 1, limit: number = 10) => {
  return useQuery<BlogListResponse>({
    queryKey: ['blogs', 'all', page, limit],
    queryFn: async () => {
      const response = await apiClient.get(`/blogs?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
};

// Get single blog
export const useBlog = (id: string) => {
  return useQuery<Blog>({
    queryKey: ['blog', id],
    queryFn: async () => {
      const response = await apiClient.get(`/blogs/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Create blog
export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Blog, Error, CreateBlogData>({
    mutationFn: async (data) => {
      const response = await apiClient.post('/blogs', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

// Update blog
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Blog, Error, UpdateBlogData>({
    mutationFn: async ({ id, ...data }) => {
      const response = await apiClient.put(`/blogs/${id}`, data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', data.id] });
    },
  });
};

// Delete blog
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/blogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};
