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
      
      // Log request data for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('Creating blog review:', { blogId, data });
      }
      
      try {
        const response = await apiClient.post(`/blog-reviews/${blogId}`, data);
        return response.data;
      } catch (error: any) {
        // Log detailed error information
        if (error.response) {
          console.error('Blog review creation failed:', {
            status: error.response.status,
            data: error.response.data,
            requestData: { blogId, ...data },
          });
        }
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Debug logging (development only)
      if (process.env.NODE_ENV === 'development') {
        console.log('Review created successfully:', {
          reviewData: data.data,
          blogId: variables.blogId,
        });
      }
      
      // Optimistically add the new review to the cache for all query variations
      queryClient.setQueriesData(
        { queryKey: ['blog-reviews', variables.blogId], exact: false },
        (oldData: any) => {
          if (!oldData?.data) {
            // If no data exists, create new structure
            const newData = {
              success: true,
              message: 'Reviews loaded',
              data: [data.data],
              pagination: {
                page: 1,
                limit: 50,
                total: 1,
                totalPages: 1,
                hasNext: false,
                hasPrev: false,
              },
            };
            if (process.env.NODE_ENV === 'development') {
              console.log('Optimistic update: Created new data structure', newData);
            }
            return newData;
          }
          
          // Add new review to existing data (prepend to show newest first)
          const updatedData = {
            ...oldData,
            data: [data.data, ...oldData.data],
            pagination: {
              ...oldData.pagination,
              total: (oldData.pagination?.total || 0) + 1,
            },
          };
          if (process.env.NODE_ENV === 'development') {
            console.log('Optimistic update: Added review to existing data', {
              oldCount: oldData.data.length,
              newCount: updatedData.data.length,
            });
          }
          return updatedData;
        }
      );
      
      // Invalidate and refetch to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ['blog', variables.blogId] });
      queryClient.invalidateQueries({ queryKey: ['blog-reviews', variables.blogId], exact: false });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      
      // Force refetch after a short delay to ensure server data is loaded
      // But don't let failed refetch overwrite optimistic update
      setTimeout(() => {
        queryClient.refetchQueries({ 
          queryKey: ['blog-reviews', variables.blogId], 
          exact: false,
        }).catch((error) => {
          // If refetch fails (e.g., 500 error), keep the optimistic update
          if (process.env.NODE_ENV === 'development') {
            console.warn('Refetch failed, keeping optimistic update:', error);
          }
        });
      }, 1000);
    },
  });
};

// Get reviews for a blog
export const useGetBlogReviews = (blogId: string, query?: BlogReviewQuery) => {
  const queryClient = useQueryClient();
  
  return useQuery<BlogReviewListResponse, Error>({
    queryKey: ['blog-reviews', blogId, query],
    queryFn: async ({ queryKey }) => {
      const params: Record<string, string> = {};
      if (query?.page) params.page = query.page.toString();
      if (query?.limit) params.limit = query.limit.toString();
      if (query?.userId) params.userId = query.userId;
      if (query?.rating) params.rating = query.rating.toString();
      if (query?.sortBy) params.sortBy = query.sortBy;
      if (query?.sortOrder) params.sortOrder = query.sortOrder;

      try {
        const response = await apiClient.get(`/blog-reviews/${blogId}`, { params });
        return response.data;
      } catch (error: any) {
        // Handle 500 errors (backend schema issue with UUID vs Int)
        // This is a known backend issue - gracefully handle it
        if (error.response?.status === 500) {
          // Try to get cached data from queryKey (using queryClient from closure)
          // Check both exact queryKey and related keys
          const cachedData = queryClient.getQueryData(queryKey) || 
                            queryClient.getQueryData(['blog-reviews', blogId]);
          
          if (cachedData) {
            // Return cached data to preserve optimistic updates and existing data
            // This ensures hide/unhide optimistic updates are preserved
            return cachedData as BlogReviewListResponse;
          }
          
          // Return empty data structure only if no cached data exists
          // This prevents UI crashes while backend issue is being resolved
          return {
            success: false,
            message: 'Unable to load reviews due to backend configuration issue.',
            data: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          };
        }
        // Re-throw other errors
        throw error;
      }
    },
    enabled: !!blogId,
    retry: false, // Don't retry on 500 errors - they're backend issues
    // Return empty data on error instead of throwing
    throwOnError: false,
    // Don't use placeholderData - it causes false "no reviews" messages
    // Instead, let the query handle loading state properly
    refetchOnWindowFocus: false, // Disable to prevent unnecessary refetches that hit 500 errors
    refetchOnMount: false, // Disable to prevent unnecessary refetches that hit 500 errors
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes to reduce refetches
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
  
  return useMutation<BlogReviewReplyResponse, Error, CreateBlogReviewReply & { blogId?: string }>({
    mutationFn: async (replyData) => {
      const { reviewId, blogId, ...data } = replyData;
      // Don't send blogId to backend, it's only for frontend cache invalidation
      const response = await apiClient.post(`/blog-reviews/reply/${reviewId}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate with blogId if provided for proper cache invalidation
      if (variables.blogId) {
        queryClient.invalidateQueries({ queryKey: ['blog-reviews', variables.blogId] });
      } else {
        // Fallback: invalidate all blog-reviews queries
        queryClient.invalidateQueries({ queryKey: ['blog-reviews'] });
      }
      queryClient.invalidateQueries({ queryKey: ['blog-reviews', 'review', variables.reviewId] });
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
    onError: (error: any, variables) => {
      // On error, still invalidate to ensure UI is in sync
      if (variables.blogId) {
        queryClient.invalidateQueries({ queryKey: ['blog-reviews', variables.blogId] });
      }
    },
  });
};

// Delete blog review
export const useDeleteBlogReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean; message: string }, Error, { reviewId: string; blogId?: string }>({
    mutationFn: async ({ reviewId }) => {
      const response = await apiClient.delete(`/blog-reviews/${reviewId}`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Optimistically remove the review from cache
      if (variables.blogId) {
        queryClient.setQueriesData(
          { queryKey: ['blog-reviews', variables.blogId], exact: false },
          (oldData: any) => {
            if (!oldData?.data) return oldData;
            return {
              ...oldData,
              data: oldData.data.filter((r: BlogReview) => r.id !== variables.reviewId),
              pagination: {
                ...oldData.pagination,
                total: Math.max(0, (oldData.pagination?.total || 0) - 1),
              },
            };
          }
        );
      }
      
      // Invalidate queries to ensure sync with server
      if (variables.blogId) {
        queryClient.invalidateQueries({ queryKey: ['blog-reviews', variables.blogId], exact: false });
      } else {
        queryClient.invalidateQueries({ queryKey: ['blog-reviews'], exact: false });
      }
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
  
  return useMutation<BlogReviewResponse, Error, { reviewId: string; blogId?: string }>({
    mutationFn: async ({ reviewId }) => {
      const response = await apiClient.patch(`/blog-reviews/${reviewId}/hide`);
      return response.data;
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      if (variables.blogId) {
        await queryClient.cancelQueries({ queryKey: ['blog-reviews', variables.blogId], exact: false });
      }
      
      // Snapshot the previous value
      const previousData = variables.blogId 
        ? queryClient.getQueriesData({ queryKey: ['blog-reviews', variables.blogId], exact: false })
        : null;
      
      // Optimistically update the cache BEFORE API call
      if (variables.blogId) {
        queryClient.setQueriesData(
          { queryKey: ['blog-reviews', variables.blogId], exact: false },
          (oldData: any) => {
            if (!oldData?.data) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((r: BlogReview) =>
                r.id === variables.reviewId ? { ...r, isHidden: true } : r
              ),
            };
          }
        );
      }
      
      // Return context with snapshot for potential rollback
      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousData && variables.blogId) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (data, variables) => {
      // Ensure cache is updated with hidden state (double-check optimistic update)
      if (variables.blogId) {
        queryClient.setQueriesData(
          { queryKey: ['blog-reviews', variables.blogId], exact: false },
          (oldData: any) => {
            if (!oldData?.data) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((r: BlogReview) =>
                r.id === variables.reviewId ? { ...r, isHidden: true } : r
              ),
            };
          }
        );
      }
      
      // Don't invalidate queries - optimistic update is already applied
      // Invalidating would trigger a refetch that might fail with 500 error
      // and overwrite our optimistic update. The cache is already correct.
    },
  });
};

// Unhide blog review (admin only)
export const useUnhideBlogReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BlogReviewResponse, Error, { reviewId: string; blogId?: string }>({
    mutationFn: async ({ reviewId }) => {
      const response = await apiClient.patch(`/blog-reviews/${reviewId}/unhide`);
      return response.data;
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      if (variables.blogId) {
        await queryClient.cancelQueries({ queryKey: ['blog-reviews', variables.blogId], exact: false });
      }
      
      // Snapshot the previous value
      const previousData = variables.blogId 
        ? queryClient.getQueriesData({ queryKey: ['blog-reviews', variables.blogId], exact: false })
        : null;
      
      // Optimistically update the cache BEFORE API call
      if (variables.blogId) {
        queryClient.setQueriesData(
          { queryKey: ['blog-reviews', variables.blogId], exact: false },
          (oldData: any) => {
            if (!oldData?.data) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((r: BlogReview) =>
                r.id === variables.reviewId ? { ...r, isHidden: false } : r
              ),
            };
          }
        );
      }
      
      // Return context with snapshot for potential rollback
      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousData && variables.blogId) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (data, variables) => {
      // Ensure cache is updated with unhidden state (double-check optimistic update)
      if (variables.blogId) {
        queryClient.setQueriesData(
          { queryKey: ['blog-reviews', variables.blogId], exact: false },
          (oldData: any) => {
            if (!oldData?.data) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((r: BlogReview) =>
                r.id === variables.reviewId ? { ...r, isHidden: false } : r
              ),
            };
          }
        );
      }
      
      // Don't invalidate queries - optimistic update is already applied
      // Invalidating would trigger a refetch that might fail with 500 error
      // and overwrite our optimistic update. The cache is already correct.
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
