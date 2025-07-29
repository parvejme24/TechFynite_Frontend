import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useApiBaseUrl from "./useApiBaseUrl";

// Types
export interface BlogReview {
  id: string;
  blogId: string;
  userId: string;
  fullName: string;
  email: string;
  photoUrl?: string | null;
  commentText: string;
  reply?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBlogReviewData {
  blogId: string;
  fullName: string;
  email: string;
  commentText: string;
  photoUrl?: string;
}

export interface UpdateBlogReviewData {
  commentText: string;
  photoUrl?: string;
}

export interface ReplyToReviewData {
  reply: any;
}

// Hooks
export const useBlogReviewsByBlogId = (blogId: string) => {
  const apiBaseUrl = useApiBaseUrl();
  
  return useQuery({
    queryKey: ["blog-reviews", blogId],
    queryFn: async (): Promise<BlogReview[]> => {
      try {
        console.log(`Fetching blog reviews for blogId: ${blogId}`);
        const res = await fetch(`${apiBaseUrl}/blog-review/${blogId}`, {
          credentials: "include",
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`Failed to fetch blog reviews: ${res.status} ${res.statusText}`);
        }
        
        const result = await res.json();
        console.log("Blog reviews fetched successfully:", result);
        return result;
      } catch (error) {
        console.error("Error fetching blog reviews:", error);
        throw error;
      }
    },
    enabled: !!blogId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useBlogReviewById = (reviewId: string) => {
  const apiBaseUrl = useApiBaseUrl();
  
  return useQuery({
    queryKey: ["blog-review", reviewId],
    queryFn: async (): Promise<BlogReview> => {
      try {
        console.log(`Fetching blog review: ${reviewId}`);
        const res = await fetch(`${apiBaseUrl}/blog-review/review/${reviewId}`, {
          credentials: "include",
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`Failed to fetch blog review: ${res.status} ${res.statusText}`);
        }
        
        const result = await res.json();
        console.log("Blog review fetched successfully:", result);
        return result;
      } catch (error) {
        console.error("Error fetching blog review:", error);
        throw error;
      }
    },
    enabled: !!reviewId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useCreateBlogReview = () => {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateBlogReviewData): Promise<BlogReview> => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        console.log("=== API DEBUG ===");
        console.log("Creating blog review:", data);
        console.log("API Base URL:", apiBaseUrl);
        console.log("Token exists:", !!token);
        console.log("Token preview:", token ? token.substring(0, 20) + "..." : "null");
        
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        };
        console.log("Request headers:", headers);
        
        const res = await fetch(`${apiBaseUrl}/blog-review`, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(data),
        });
        
        console.log("Response status:", res.status);
        console.log("Response status text:", res.statusText);
        console.log("Response headers:", Object.fromEntries(res.headers.entries()));
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("API Error response:", errorData);
          throw new Error(`Failed to create blog review: ${res.status} ${res.statusText}`);
        }
        
        const result = await res.json();
        console.log("Blog review created successfully:", result);
        return result;
      } catch (error) {
        console.error("=== API ERROR DEBUG ===");
        console.error("Error creating blog review:", error);
        console.error("Error type:", typeof error);
        console.error("Error constructor:", error?.constructor?.name);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Blog review created, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["blog-reviews", data.blogId] });
    },
    onError: (error) => {
      console.error("Error in create blog review mutation:", error);
    },
  });
};

export const useUpdateBlogReview = () => {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reviewId, data }: { reviewId: string; data: UpdateBlogReviewData }): Promise<BlogReview> => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        console.log(`Updating blog review ${reviewId}:`, data);
        const res = await fetch(`${apiBaseUrl}/blog-review/${reviewId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`Failed to update blog review: ${res.status} ${res.statusText}`);
        }
        
        const result = await res.json();
        console.log("Blog review updated successfully:", result);
        return result;
      } catch (error) {
        console.error("Error updating blog review:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Blog review updated, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["blog-review", data.id] });
      queryClient.invalidateQueries({ queryKey: ["blog-reviews", data.blogId] });
    },
    onError: (error) => {
      console.error("Error in update blog review mutation:", error);
    },
  });
};

export const useDeleteBlogReview = () => {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reviewId, blogId }: { reviewId: string; blogId: string }): Promise<void> => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        console.log(`Deleting blog review ${reviewId}`);
        const res = await fetch(`${apiBaseUrl}/blog-review/${reviewId}`, {
          method: "DELETE",
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`Failed to delete blog review: ${res.status} ${res.statusText}`);
        }
        
        console.log("Blog review deleted successfully");
      } catch (error) {
        console.error("Error deleting blog review:", error);
        throw error;
      }
    },
    onSuccess: (_, { blogId }) => {
      console.log("Blog review deleted, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["blog-reviews", blogId] });
    },
    onError: (error) => {
      console.error("Error in delete blog review mutation:", error);
    },
  });
};

export const useReplyToBlogReview = () => {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reviewId, data }: { reviewId: string; data: ReplyToReviewData }): Promise<BlogReview> => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        console.log(`Replying to blog review ${reviewId}:`, data);
        const res = await fetch(`${apiBaseUrl}/blog-review/${reviewId}/reply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`Failed to reply to blog review: ${res.status} ${res.statusText}`);
        }
        
        const result = await res.json();
        console.log("Reply to blog review created successfully:", result);
        return result;
      } catch (error) {
        console.error("Error replying to blog review:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Reply created, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["blog-review", data.id] });
      queryClient.invalidateQueries({ queryKey: ["blog-reviews", data.blogId] });
    },
    onError: (error) => {
      console.error("Error in reply to blog review mutation:", error);
    },
  });
};

export const useUpdateBlogReviewReply = () => {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reviewId, data }: { reviewId: string; data: ReplyToReviewData }): Promise<BlogReview> => {
      try {
        console.log(`Updating reply to blog review ${reviewId}:`, data);
        const res = await fetch(`${apiBaseUrl}/blog-review/${reviewId}/reply`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`Failed to update reply to blog review: ${res.status} ${res.statusText}`);
        }
        
        const result = await res.json();
        console.log("Reply to blog review updated successfully:", result);
        return result;
      } catch (error) {
        console.error("Error updating reply to blog review:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Reply updated, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["blog-review", data.id] });
      queryClient.invalidateQueries({ queryKey: ["blog-reviews", data.blogId] });
    },
    onError: (error) => {
      console.error("Error in update reply to blog review mutation:", error);
    },
  });
};