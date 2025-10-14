import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { IBlog, ICreateBlog, IUpdateBlog, IBlogQuery, IBlogResponse, IBlogStats } from '@/types/blog';

// --- Response Types ---

interface BlogListResponse {
  success: boolean;
  message: string;
  data: IBlog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface BlogStatsResponse {
  success: boolean;
  message: string;
  data: IBlogStats;
}

interface BlogResponse {
  success: boolean;
  message: string;
  data: IBlog;
}

interface BlogLikeResponse {
  success: boolean;
  message: string;
  data: {
    isLiked: boolean;
    totalLikes: number;
  };
}

// --- Queries ---

// Get all blogs
export const useGetAllBlogs = (query?: IBlogQuery) => {
  return useQuery<BlogListResponse, Error>({
    queryKey: ['blogs', 'all', query],
    queryFn: async () => {
      const response = await apiClient.get('/blogs', { params: query });
      return response.data;
    },
  });
};

// Get published blogs
export const useGetPublishedBlogs = (query?: IBlogQuery) => {
  return useQuery<BlogListResponse, Error>({
    queryKey: ['blogs', 'published', query],
    queryFn: async () => {
      const response = await apiClient.get('/blogs/published', { params: query });
      return response.data;
    },
  });
};

// Get draft blogs
export const useGetDraftBlogs = (query?: IBlogQuery) => {
  return useQuery<BlogListResponse, Error>({
    queryKey: ['blogs', 'drafts', query],
    queryFn: async () => {
      const response = await apiClient.get('/blogs/drafts', { params: query });
      return response.data;
    },
  });
};

// Get blog by ID
export const useGetBlogById = (id: string) => {
  return useQuery<BlogResponse, Error>({
    queryKey: ['blog', id],
    queryFn: async () => {
      const response = await apiClient.get(`/blogs/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Get blogs by category
export const useGetBlogsByCategory = (categoryId: string, query?: IBlogQuery) => {
  return useQuery<BlogListResponse, Error>({
    queryKey: ['blogs', 'category', categoryId, query],
    queryFn: async () => {
      const response = await apiClient.get(`/blogs/category/${categoryId}`, { params: query });
      return response.data;
    },
    enabled: !!categoryId,
  });
};

// Get blogs by author
export const useGetBlogsByAuthor = (authorId: string, query?: IBlogQuery) => {
  return useQuery<BlogListResponse, Error>({
    queryKey: ['blogs', 'author', authorId, query],
    queryFn: async () => {
      const response = await apiClient.get(`/blogs/author/${authorId}`, { params: query });
      return response.data;
    },
    enabled: !!authorId,
  });
};

// Get blog stats
export const useGetBlogStats = () => {
  return useQuery<BlogStatsResponse, Error>({
    queryKey: ['blogs', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/blogs/stats');
      return response.data;
    },
  });
};

// --- Mutations ---

// Create blog
export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BlogResponse, Error, ICreateBlog & { image?: File }>({
    mutationFn: async (blogData) => {
      console.log("🔧 useBlogApi - Creating FormData from:", blogData);
      
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('categoryId', blogData.categoryId);
      if (blogData.description) {
        formData.append('description', JSON.stringify(blogData.description));
      }
      formData.append('readingTime', blogData.readingTime.toString());
      formData.append('authorId', blogData.authorId);
      
      if (blogData.slug) {
        formData.append('slug', blogData.slug);
      }
      
      if (blogData.isPublished !== undefined) {
        formData.append('isPublished', blogData.isPublished ? 'true' : 'false');
      }
      
      if (blogData.content) {
        formData.append('content', JSON.stringify(blogData.content));
      }
      
      if (blogData.image) {
        formData.append('image', blogData.image);
        console.log("📸 Image file details:", {
          name: blogData.image.name,
          size: blogData.image.size,
          type: blogData.image.type,
          lastModified: blogData.image.lastModified
        });
      }

      // Log FormData contents
      console.log("📦 FormData Contents:");
      for (let [key, value] of formData.entries()) {
        if (key === 'image') {
          console.log(`${key}:`, {
            name: (value as File).name,
            size: (value as File).size,
            type: (value as File).type
          });
        } else {
          console.log(`${key}:`, value);
        }
      }

      // Log the raw request data for debugging
      console.log("🔍 Raw request data being sent:");
      console.log("- Content-Type: multipart/form-data");
      console.log("- Fields:", Object.fromEntries(formData.entries()));

      console.log("🌐 Sending request to:", '/blogs');
      try {
        const response = await apiClient.post('/blogs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log("✅ Response received:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("❌ Backend Error Details:");
        console.error("Status:", error.response?.status);
        console.error("Status Text:", error.response?.statusText);
        console.error("Error Data:", error.response?.data);
        console.error("Error Message:", error.message);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
};

// Update blog
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BlogResponse, Error, { id: string } & IUpdateBlog & { image?: File }>({
    mutationFn: async ({ id, ...blogData }) => {
      const formData = new FormData();
      
      if (blogData.title) formData.append('title', blogData.title);
      if (blogData.categoryId) formData.append('categoryId', blogData.categoryId);
      if (blogData.description) formData.append('description', JSON.stringify(blogData.description));
      if (blogData.readingTime) formData.append('readingTime', blogData.readingTime.toString());
      if (blogData.slug) formData.append('slug', blogData.slug);
      if (blogData.isPublished !== undefined) formData.append('isPublished', blogData.isPublished.toString());
      if (blogData.content) formData.append('content', JSON.stringify(blogData.content));
      if (blogData.image) formData.append('image', blogData.image);

      const response = await apiClient.put(`/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', variables.id] });
    },
  });
};

// Delete blog
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`/blogs/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
};

// Toggle blog like
export const useToggleBlogLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BlogLikeResponse, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.post(`/blogs/${id}/toggle-like`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
    },
  });
};

// Toggle blog publish status
export const useToggleBlogPublish = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BlogResponse, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.patch(`/blogs/${id}/toggle-publish`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
    },
  });
};

// --- Combined Hook for convenience ---

interface UseBlogResult {
  // Queries
  allBlogs: IBlog[] | undefined;
  isLoadingAllBlogs: boolean;
  allBlogsError: Error | null;
  allBlogsPagination: any;
  refetchAllBlogs: () => Promise<any>;

  publishedBlogs: IBlog[] | undefined;
  isLoadingPublishedBlogs: boolean;
  publishedBlogsError: Error | null;
  publishedBlogsPagination: any;

  draftBlogs: IBlog[] | undefined;
  isLoadingDraftBlogs: boolean;
  draftBlogsError: Error | null;
  draftBlogsPagination: any;

  blog: IBlog | undefined;
  isLoadingBlog: boolean;
  blogError: Error | null;

  blogsByCategory: IBlog[] | undefined;
  isLoadingBlogsByCategory: boolean;
  blogsByCategoryError: Error | null;
  blogsByCategoryPagination: any;

  blogsByAuthor: IBlog[] | undefined;
  isLoadingBlogsByAuthor: boolean;
  blogsByAuthorError: Error | null;
  blogsByAuthorPagination: any;

  stats: IBlogStats | undefined;
  isLoadingStats: boolean;
  statsError: Error | null;

  // Mutations
  createBlog: (data: ICreateBlog & { image?: File }) => Promise<BlogResponse>;
  isCreating: boolean;
  createError: Error | null;

  updateBlog: (data: { id: string } & IUpdateBlog & { image?: File }) => Promise<BlogResponse>;
  isUpdating: boolean;
  updateError: Error | null;

  deleteBlog: (id: string) => Promise<{ success: boolean; message: string }>;
  isDeleting: boolean;
  deleteError: Error | null;

  toggleLike: (id: string) => Promise<BlogLikeResponse>;
  isTogglingLike: boolean;
  toggleLikeError: Error | null;

  togglePublish: (id: string) => Promise<BlogResponse>;
  isTogglingPublish: boolean;
  togglePublishError: Error | null;
}

export const useBlog = (query?: IBlogQuery): UseBlogResult => {
  const queryClient = useQueryClient();

  // Queries
  const {
    data: allBlogsData,
    isLoading: isLoadingAllBlogs,
    error: allBlogsError,
    refetch: refetchAllBlogs,
  } = useGetAllBlogs(query);

  const {
    data: publishedBlogsData,
    isLoading: isLoadingPublishedBlogs,
    error: publishedBlogsError,
  } = useGetPublishedBlogs(query);

  const {
    data: draftBlogsData,
    isLoading: isLoadingDraftBlogs,
    error: draftBlogsError,
  } = useGetDraftBlogs(query);

  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useGetBlogStats();

  // Mutations
  const {
    mutateAsync: createBlogMutation,
    isPending: isCreating,
    error: createError,
  } = useCreateBlog();

  const {
    mutateAsync: updateBlogMutation,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateBlog();

  const {
    mutateAsync: deleteBlogMutation,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteBlog();

  const {
    mutateAsync: toggleLikeMutation,
    isPending: isTogglingLike,
    error: toggleLikeError,
  } = useToggleBlogLike();

  const {
    mutateAsync: togglePublishMutation,
    isPending: isTogglingPublish,
    error: togglePublishError,
  } = useToggleBlogPublish();

  return {
    // Queries
    allBlogs: allBlogsData?.data,
    isLoadingAllBlogs,
    allBlogsError,
    allBlogsPagination: allBlogsData?.pagination,
    refetchAllBlogs,

    publishedBlogs: publishedBlogsData?.data,
    isLoadingPublishedBlogs,
    publishedBlogsError,
    publishedBlogsPagination: publishedBlogsData?.pagination,

    draftBlogs: draftBlogsData?.data,
    isLoadingDraftBlogs,
    draftBlogsError,
    draftBlogsPagination: draftBlogsData?.pagination,

    blog: undefined, // Will be set when getBlogById is called
    isLoadingBlog: false,
    blogError: null,

    blogsByCategory: undefined, // Will be set when getBlogsByCategory is called
    isLoadingBlogsByCategory: false,
    blogsByCategoryError: null,
    blogsByCategoryPagination: undefined,

    blogsByAuthor: undefined, // Will be set when getBlogsByAuthor is called
    isLoadingBlogsByAuthor: false,
    blogsByAuthorError: null,
    blogsByAuthorPagination: undefined,

    stats: statsData?.data,
    isLoadingStats,
    statsError,

    // Mutations
    createBlog: createBlogMutation,
    isCreating,
    createError,

    updateBlog: updateBlogMutation,
    isUpdating,
    updateError,

    deleteBlog: deleteBlogMutation,
    isDeleting,
    deleteError,

    toggleLike: toggleLikeMutation,
    isTogglingLike,
    toggleLikeError,

    togglePublish: togglePublishMutation,
    isTogglingPublish,
    togglePublishError,
  };
};