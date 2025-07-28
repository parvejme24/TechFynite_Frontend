import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useApiBaseUrl from './useApiBaseUrl';
import { toast } from 'sonner';

// BLOGS
export function useBlogs() {
  const apiBaseUrl = useApiBaseUrl();
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/blogs`);
      if (!res.ok) throw new Error('Failed to fetch blogs');
      const data = await res.json();
      const blogs = Array.isArray(data) ? data : data.data || data.blogs || [];
      
      // Fix imageUrl for each blog and its category
      return blogs.map((blog: any) => ({
        ...blog,
        imageUrl: constructImageUrl(blog.imageUrl, apiBaseUrl),
        category: blog.category ? {
          ...blog.category,
          imageUrl: constructImageUrl(blog.category.imageUrl, apiBaseUrl)
        } : blog.category
      }));
    },
  });
}

export function useBlog(id: string) {
  const apiBaseUrl = useApiBaseUrl();
  return useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/blogs/${id}`);
      if (!res.ok) throw new Error('Failed to fetch blog');
      const data = await res.json();
      const blog = data.data || data;
      
      // Fix imageUrl for the blog and its category
      return {
        ...blog,
        imageUrl: constructImageUrl(blog.imageUrl, apiBaseUrl),
        category: blog.category ? {
          ...blog.category,
          imageUrl: constructImageUrl(blog.category.imageUrl, apiBaseUrl)
        } : blog.category
      };
    },
    enabled: !!id,
  });
}

// Helper function to construct full image URL
const constructImageUrl = (imageUrl: string | null, apiBaseUrl: string): string | null => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  // Remove /api/v1 from base URL and append imageUrl
  const baseUrl = apiBaseUrl.replace('/api/v1', '');
  return `${baseUrl}${imageUrl}`;
};

// BLOG CATEGORIES
export function useBlogCategories() {
  const apiBaseUrl = useApiBaseUrl();
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/blog-categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      const categories = Array.isArray(data) ? data : data.data || [];
      
      // Fix imageUrl for each category
      return categories.map((category: any) => ({
        ...category,
        imageUrl: constructImageUrl(category.imageUrl, apiBaseUrl)
      }));
    },
  });
}

export function useBlogCategory(id: string) {
  const apiBaseUrl = useApiBaseUrl();
  return useQuery({
    queryKey: ['blog-category', id],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/blog-categories/${id}`);
      if (!res.ok) throw new Error('Failed to fetch category');
      const data = await res.json();
      const category = data.data || data;
      
      // Fix imageUrl for the category
      return {
        ...category,
        imageUrl: constructImageUrl(category.imageUrl, apiBaseUrl)
      };
    },
    enabled: !!id,
  });
}

// BLOG REVIEWS
export function useBlogReviews(blogId: string) {
  const apiBaseUrl = useApiBaseUrl();
  return useQuery({
    queryKey: ['blog-reviews', blogId],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/blog-review/${blogId}`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      return Array.isArray(data) ? data : data.data || [];
    },
    enabled: !!blogId,
  });
}

export function useBlogReview(reviewId: string) {
  const apiBaseUrl = useApiBaseUrl();
  return useQuery({
    queryKey: ['blog-review', reviewId],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/blog-review/review/${reviewId}`);
      if (!res.ok) throw new Error('Failed to fetch review');
      const data = await res.json();
      return data.data || data;
    },
    enabled: !!reviewId,
  });
}

// MUTATIONS
export function useCreateBlog() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append basic fields
      formData.append("title", payload.title);
      formData.append("description", payload.description);
      formData.append("categoryId", payload.categoryId);
      formData.append("readingTime", payload.readingTime);
      
      // Append main image if exists
      if (payload.image && payload.image instanceof File) {
        formData.append("image", payload.image);
      }
      
      // Append content blocks as JSON string
      if (payload.content && Array.isArray(payload.content)) {
        // Clean content blocks - remove File objects for JSON serialization
        const cleanContent = payload.content.map((block: any) => ({
          heading: block.heading,
          description: block.description,
          // Don't include image File object in JSON
        }));
        formData.append("content", JSON.stringify(cleanContent));
      }
      
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const res = await fetch(`${apiBaseUrl}/blogs`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          // Do NOT set Content-Type for FormData - browser will set it automatically
        },
        body: formData,
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Blog creation error:', res.status, errorText);
        throw new Error(`Failed to create blog: ${res.status} ${errorText}`);
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create blog: ${error.message}`);
    },
  });
}

export function useUpdateBlog() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: any) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      
      const res = await fetch(`${apiBaseUrl}/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update blog: ${res.status} ${errorText}`);
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update blog: ${error.message}`);
    },
  });
}

export function useDeleteBlog() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      
      const res = await fetch(`${apiBaseUrl}/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete blog: ${res.status} ${errorText}`);
      }
      
      // Handle cases where backend returns empty response (e.g., 204 No Content)
      try {
        return await res.json();
      } catch (error) {
        // If response is empty or not JSON, return null
        return null;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog deleted successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to delete blog: ${error.message}`);
    },
  });
}

export function useLikeBlog() {
  const apiBaseUrl = useApiBaseUrl();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiBaseUrl}/blogs/${id}/like`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to like blog');
      return res.json();
    },
  });
}

export function useUnlikeBlog() {
  const apiBaseUrl = useApiBaseUrl();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiBaseUrl}/blogs/${id}/unlike`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to unlike blog');
      return res.json();
    },
  });
}

// BLOG CATEGORY MUTATIONS
export function useCreateBlogCategory() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      
      // Check if payload has imageFile (File object)
      if (payload.imageFile) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('slug', payload.slug);
        formData.append('image', payload.imageFile); // Backend expects 'image' field name
        
        const res = await fetch(`${apiBaseUrl}/blog-categories`, {
          method: 'POST',
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            // Do NOT set Content-Type for FormData
          },
          body: formData,
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to create category: ${res.status} ${errorText}`);
        }
        
        return res.json();
      } else {
        // Use JSON for non-file data
        const res = await fetch(`${apiBaseUrl}/blog-categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to create category: ${res.status} ${errorText}`);
        }
        
        return res.json();
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast.success('Category created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create category: ${error.message}`);
    },
  });
}

export function useUpdateBlogCategory() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: any) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      
      // Check if payload has imageFile (File object)
      if (payload.imageFile) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('slug', payload.slug);
        formData.append('image', payload.imageFile);
        
        const res = await fetch(`${apiBaseUrl}/blog-categories/${id}`, {
          method: 'PUT',
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: formData,
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to update category: ${res.status} ${errorText}`);
        }
        
        return res.json();
      } else {
        // Use JSON for non-file data
        const res = await fetch(`${apiBaseUrl}/blog-categories/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to update category: ${res.status} ${errorText}`);
        }
        
        return res.json();
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast.success('Category updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update category: ${error.message}`);
    },
  });
}

export function useDeleteBlogCategory() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const res = await fetch(`${apiBaseUrl}/blog-categories/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        if (res.status === 403) {
          // Permission error
          throw new Error("permission-denied");
        }
        const errorText = await res.text();
        throw new Error(`Failed to delete category: ${res.status} ${errorText}`);
      }
      // Try to parse JSON, but if empty, just return true
      try {
        return await res.json();
      } catch {
        return true;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast.success('Category deleted successfully!');
    },
    onError: (error) => {
      if (error.message === "permission-denied") {
        toast.error("You do not have permission to delete this category!");
        // If you want SweetAlert instead, import Swal and use:
        // Swal.fire("Permission Denied", "You do not have permission to delete this category!", "error");
      } else {
        toast.error(`Failed to delete category: ${error.message}`);
      }
    },
  });
}

// BLOG REVIEW MUTATIONS
export function useCreateBlogReview() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch(`${apiBaseUrl}/blog-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create review');
      return res.json();
    },
    onSuccess: (_data, variables) => {
      if (variables.blogId) {
        queryClient.invalidateQueries({ queryKey: ['blog-reviews', variables.blogId] });
      }
    },
  });
}

export function useUpdateBlogReview() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, ...payload }: any) => {
      const res = await fetch(`${apiBaseUrl}/blog-review/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update review');
      return res.json();
    },
    onSuccess: (_data, variables) => {
      if (variables.blogId) {
        queryClient.invalidateQueries({ queryKey: ['blog-reviews', variables.blogId] });
      }
    },
  });
}

export function useDeleteBlogReview() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, blogId }: { reviewId: string, blogId: string }) => {
      const res = await fetch(`${apiBaseUrl}/blog-review/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete review');
      return res.json();
    },
    onSuccess: (_data, variables) => {
      if (variables.blogId) {
        queryClient.invalidateQueries({ queryKey: ['blog-reviews', variables.blogId] });
      }
    },
  });
}

// Add more hooks for reply, etc. as needed 