"use client";
import { useMutation, useQuery, UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

// Types inferred from component usage
export interface BlogListResponse {
  id: string;
  title: string;
  imageUrl?: string;
  readingTime: number;
  likes?: number;
  category?: { id?: string; title: string; imageUrl?: string };
}

type CreateBlogPayload = {
  title: string;
  description: string;
  categoryId: string;
  readingTime: number;
  content: { heading: string; description: string; image: File | null }[];
  image: File;
};

type UpdateBlogPayload = Partial<CreateBlogPayload> & { id: string };

export function useGetAllBlogs(): UseQueryResult<BlogListResponse[], unknown> {
  return useQuery({
    queryKey: ["blogs", "all"],
    queryFn: async () => {
      const response = await apiClient.get<BlogListResponse[]>("/blogs");
      return response.data ?? [];
    },
  });
}

export function useBlog(id?: string): UseQueryResult<BlogListResponse, unknown> {
  return useQuery({
    queryKey: ["blogs", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await apiClient.get<BlogListResponse>(`/blogs/${id}`);
      return response.data;
    },
  });
}

export function useCreateBlog(): UseMutationResult<unknown, unknown, CreateBlogPayload> {
  return useMutation({
    mutationKey: ["blogs", "create"],
    mutationFn: async (payload: CreateBlogPayload) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("description", payload.description);
      formData.append("categoryId", payload.categoryId);
      formData.append("readingTime", String(payload.readingTime));
      formData.append("image", payload.image);
      formData.append("content", JSON.stringify(payload.content.map(c => ({ heading: c.heading, description: c.description }))));

      const response = await apiClient.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
  });
}

export function useUpdateBlog(): UseMutationResult<unknown, unknown, UpdateBlogPayload> {
  return useMutation({
    mutationKey: ["blogs", "update"],
    mutationFn: async (payload: UpdateBlogPayload) => {
      const { id, ...rest } = payload;
      const response = await apiClient.put(`/blogs/${id}`, rest);
      return response.data;
    },
  });
}

export function useDeleteBlog(): UseMutationResult<unknown, unknown, string> {
  return useMutation({
    mutationKey: ["blogs", "delete"],
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/blogs/${id}`);
      return response.data;
    },
  });
}


