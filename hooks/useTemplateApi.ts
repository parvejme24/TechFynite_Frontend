import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useApiBaseUrl from './useApiBaseUrl';

// TEMPLATE CATEGORIES
export function useTemplateCategories() {
  const apiBaseUrl = useApiBaseUrl();
  return useQuery({
    queryKey: ['template-categories'],
    queryFn: async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/template-categories`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`Failed to fetch template categories: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Template categories fetched:', data);
        return Array.isArray(data) ? data : data.data || [];
      } catch (error) {
        console.error('Error fetching template categories:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

export function useTemplateCategory(id: string) {
  const apiBaseUrl = useApiBaseUrl();
  return useQuery({
    queryKey: ['template-category', id],
    queryFn: async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/template-categories/${id}`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`Failed to fetch template category: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Template category fetched:', data);
        return data.data || data;
      } catch (error) {
        console.error('Error fetching template category:', error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

export function useCreateTemplateCategory() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        console.log('Creating template category with FormData:', {
          title: formData.get('title'),
          slug: formData.get('slug'),
          hasImage: formData.has('image'),
          imageName: formData.get('image') instanceof File ? (formData.get('image') as File).name : 'No file'
        });

        const res = await fetch(`${apiBaseUrl}/template-categories`, {
          method: 'POST',
          credentials: 'include',
          body: formData, // Don't set Content-Type header for FormData (multer handles it)
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Server error response:', errorData);
          throw new Error(`Failed to create template category: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        console.log('Template category created successfully:', result);
        return result;
      } catch (error) {
        console.error('Error creating template category:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Category creation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['template-categories'] });
    },
    onError: (error) => {
      console.error('Category creation failed:', error);
    },
  });
}

export function useUpdateTemplateCategory() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      try {
        console.log('Updating template category with FormData:', {
          id,
          title: formData.get('title'),
          slug: formData.get('slug'),
          hasImage: formData.has('image'),
          imageName: formData.get('image') instanceof File ? (formData.get('image') as File).name : 'No file'
        });

        const res = await fetch(`${apiBaseUrl}/template-categories/${id}`, {
          method: 'PUT',
          credentials: 'include',
          body: formData, // Don't set Content-Type header for FormData (multer handles it)
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Server error response:', errorData);
          throw new Error(`Failed to update template category: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        console.log('Template category updated successfully:', result);
        return result;
      } catch (error) {
        console.error('Error updating template category:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Category update successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['template-categories'] });
    },
    onError: (error) => {
      console.error('Category update failed:', error);
    },
  });
}

export function useDeleteTemplateCategory() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        console.log('Deleting template category with ID:', id);

        const res = await fetch(`${apiBaseUrl}/template-categories/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Server error response:', errorData);
          throw new Error(`Failed to delete template category: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        console.log('Template category deleted successfully:', result);
        return result;
      } catch (error) {
        console.error('Error deleting template category:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Category deletion successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['template-categories'] });
    },
    onError: (error) => {
      console.error('Category deletion failed:', error);
    },
  });
}

// TEMPLATES
export function useTemplates() {
  const apiBaseUrl = useApiBaseUrl();
  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/templates`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`Failed to fetch templates: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Templates fetched:', data);
        return Array.isArray(data) ? data : data.data || [];
      } catch (error) {
        console.error('Error fetching templates:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

export function useTemplate(id: string) {
  const apiBaseUrl = useApiBaseUrl();
  return useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/templates/${id}`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`Failed to fetch template: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Template fetched:', data);
        return data.data || data;
      } catch (error) {
        console.error('Error fetching template:', error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

export function useCreateTemplate() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        console.log('Creating template with FormData:', {
          title: formData.get('title'),
          price: formData.get('price'),
          categoryId: formData.get('categoryId'),
          hasCoverImage: formData.has('image'),
          screenshotsCount: formData.getAll('screenshots').length,
          coverImageName: formData.get('image') instanceof File ? (formData.get('image') as File).name : 'No file',
          description: formData.get('description'),
          whatsIncluded: formData.get('whatsIncluded'),
          keyFeatures: formData.get('keyFeatures'),
          sourceFiles: formData.get('sourceFiles')
        });

        console.log('API URL:', `${apiBaseUrl}/templates`);
        console.log('FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const res = await fetch(`${apiBaseUrl}/templates`, {
          method: 'POST',
          credentials: 'include',
          body: formData, // Don't set Content-Type header for FormData (multer handles it)
        });

        console.log('Response status:', res.status);
        console.log('Response headers:', Object.fromEntries(res.headers.entries()));

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Server error response:', errorData);
          throw new Error(`Failed to create template: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`);
        }

        const result = await res.json();
        console.log('Template created successfully:', result);
        return result;
      } catch (error) {
        console.error('Error creating template:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Template creation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
    onError: (error) => {
      console.error('Template creation failed:', error);
    },
  });
}

export function useUpdateTemplate() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: any) => {
      try {
        console.log('Updating template:', { id, payload });

        const res = await fetch(`${apiBaseUrl}/templates/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Server error response:', errorData);
          throw new Error(`Failed to update template: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        console.log('Template updated successfully:', result);
        return result;
      } catch (error) {
        console.error('Error updating template:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Template update successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
    onError: (error) => {
      console.error('Template update failed:', error);
    },
  });
}

export function useDeleteTemplate() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        console.log('Deleting template with ID:', id);

        const res = await fetch(`${apiBaseUrl}/templates/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Server error response:', errorData);
          throw new Error(`Failed to delete template: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        console.log('Template deleted successfully:', result);
        return result;
      } catch (error) {
        console.error('Error deleting template:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Template deletion successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
    onError: (error) => {
      console.error('Template deletion failed:', error);
    },
  });
} 