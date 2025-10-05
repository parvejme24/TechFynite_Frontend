"use client";
import { useMutation, useQuery, UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export interface BlogCategoryItem {
  id: string;
  title: string;
  slug?: string;
  imageUrl?: string;
}

type CreateCategoryPayload = { title: string; slug: string; imageFile: File };
type UpdateCategoryPayload = { id: string } & Partial<CreateCategoryPayload>;

export function useGetAllBlogCategories(): UseQueryResult<BlogCategoryItem[], unknown> {
  return useQuery({
    queryKey: ["blogCategories", "all"],
    queryFn: async () => {
      const response = await apiClient.get<BlogCategoryItem[]>("/blog-categories");
      return response.data ?? [];
    },
  });
}

export function useCreateBlogCategory(): UseMutationResult<unknown, unknown, CreateCategoryPayload> {
  return useMutation({
    mutationKey: ["blogCategories", "create"],
    mutationFn: async (payload: CreateCategoryPayload) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("slug", payload.slug);
      formData.append("image", payload.imageFile);
      const response = await apiClient.post("/blog-categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
  });
}

export function useUpdateBlogCategory(): UseMutationResult<unknown, unknown, UpdateCategoryPayload> {
  return useMutation({
    mutationKey: ["blogCategories", "update"],
    mutationFn: async ({ id, ...rest }: UpdateCategoryPayload) => {
      const response = await apiClient.put(`/blog-categories/${id}`, rest);
      return response.data;
    },
  });
}

export function useDeleteBlogCategory(): UseMutationResult<unknown, unknown, string> {
  return useMutation({
    mutationKey: ["blogCategories", "delete"],
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/blog-categories/${id}`);
      return response.data;
    },
  });
}


