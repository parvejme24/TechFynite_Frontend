import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { BlogReview, CreateBlogReview, CreateBlogReviewReply, BlogReviewQuery, UpdateBlogReview } from '@/types/blogReview';

// Response types
interface BlogReviewResponse {
  success: boolean;
  message: string;
  data: BlogReview;
}

interface BlogReviewListResponse {
  success: boolean;
  message: string;
  data: BlogReview[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface BlogReviewReplyResponse {
  success: boolean;
  message: string;
  data: any;
}

// Create blog review
export const useCreateBlogReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BlogReviewResponse, Error, CreateBlogReview>({
    mutationFn: async (reviewData) => {
      const { blogId, ...data } = reviewData;
      const response = await apiClient.post(`/blog-reviews/${blogId}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate blog queries to refresh blog data with updated reviews
      queryClient.invalidateQueries({ queryKey: ['blog', variables.blogId] });
      queryClient.invalidateQueries({ queryKey: ['blog-reviews', variables.blogId] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

// Get reviews for a blog
export const useGetBlogReviews = (blogId: string, query?: BlogReviewQuery) => {
  return useQuery<BlogReviewListResponse, Error>({
    queryKey: ['blog-reviews', blogId, query],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (query?.page) params.page = query.page.toString();
      if (query?.limit) params.limit = query.limit.toString();
      if (query?.userId) params.userId = query.userId;
      if (query?.rating) params.rating = query.rating.toString();
      if (query?.sortBy) params.sortBy = query.sortBy;
      if (query?.sortOrder) params.sortOrder = query.sortOrder;

      const response = await apiClient.get(`/blog-reviews/${blogId}`, { params });
      return response.data;
    },
    enabled: !!blogId,
    retry: 1,
    // Return empty data on error instead of throwing
    throwOnError: false,
    // Return empty data structure if query fails
    placeholderData: {
      success: false,
      message: 'Loading reviews...',
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    },
  });
};

// Get blog review by ID
export const useGetBlogReviewById = (reviewId: string) => {
  return useQuery<BlogReviewResponse, Error>({
    queryKey: ['blog-reviews', 'review', reviewId],
    queryFn: async () => {
      const response = await apiClient.get(`/blog-reviews/review/${reviewId}`);
      return response.data;
    },
    enabled: !!reviewId,
  });
};

// Create blog review reply
export const useCreateBlogReviewReply = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BlogReviewReplyResponse, Error, CreateBlogReviewReply>({
    mutationFn: async (replyData) => {
      const { reviewId, ...data } = replyData;
      const response = await apiClient.post(`/blog-reviews/reply/${reviewId}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blog-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['blog-reviews', 'review', variables.reviewId] });
    },
  });
};

// Delete blog review
export const useDeleteBlogReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (reviewId) => {
      const response = await apiClient.delete(`/blog-reviews/${reviewId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
};

// Update blog review
export const useUpdateBlogReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BlogReviewResponse, Error, { reviewId: string; data: UpdateBlogReview }>({
    mutationFn: async ({ reviewId, data }) => {
      const response = await apiClient.put(`/blog-reviews/${reviewId}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blog-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['blog-reviews', 'review', variables.reviewId] });
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
};

// Hide blog review (admin only)
export const useHideBlogReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BlogReviewResponse, Error, string>({
    mutationFn: async (reviewId) => {
      const response = await apiClient.patch(`/blog-reviews/${reviewId}/hide`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
};

// Unhide blog review (admin only)
export const useUnhideBlogReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BlogReviewResponse, Error, string>({
    mutationFn: async (reviewId) => {
      const response = await apiClient.patch(`/blog-reviews/${reviewId}/unhide`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
};

// Delete all reviews for a blog (admin only)
export const useDeleteAllBlogReviews = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean; message: string; data: { deletedCount: number } }, Error, string>({
    mutationFn: async (blogId) => {
      const response = await apiClient.delete(`/blog-reviews/blog/${blogId}/all`);
      return response.data;
    },
    onSuccess: (data, blogId) => {
      queryClient.invalidateQueries({ queryKey: ['blog-reviews', blogId] });
      queryClient.invalidateQueries({ queryKey: ['blog', blogId] });
      queryClient.invalidateQueries({ queryKey: ['blog-reviews'] });
    },
  });
};

// Delete blog review reply
export const useDeleteBlogReviewReply = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (replyId) => {
      const response = await apiClient.delete(`/blog-reviews/reply/${replyId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-reviews'] });
    },
  });
};
