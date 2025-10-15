import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Template, CreateTemplateInput, UpdateTemplateInput, TemplateQuery, PaginatedTemplates, TemplateStats } from '@/types/template';

// Get all templates
export const useGetAllTemplates = (query: TemplateQuery) => {
  return useQuery<PaginatedTemplates>({
    queryKey: ['templates', 'all', query],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', query.page.toString());
      params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);
      if (query.categoryId) params.append('categoryId', query.categoryId);
      params.append('sortBy', query.sortBy);
      params.append('sortOrder', query.sortOrder);
      if (query.minPrice) params.append('minPrice', query.minPrice.toString());
      if (query.maxPrice) params.append('maxPrice', query.maxPrice.toString());

      const response = await apiClient.get(`/templates?${params.toString()}`);
      return response.data;
    },
  });
};

// Get template by ID
export const useGetTemplateById = (id: string) => {
  return useQuery<Template>({
    queryKey: ['template', id],
    queryFn: async () => {
      const response = await apiClient.get(`/templates/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Get template statistics
export const useGetTemplateStats = () => {
  return useQuery<TemplateStats>({
    queryKey: ['templates', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/templates/stats');
      return response.data.data;
    },
  });
};

// Create template
export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Template, Error, CreateTemplateInput>({
    mutationFn: async (data) => {
      const formData = new FormData();
      
      // Append basic fields
      formData.append('title', data.title);
      formData.append('price', data.price.toString());
      formData.append('shortDescription', data.shortDescription);
      formData.append('categoryId', data.categoryId);
      
      if (data.lemonsqueezyProductId) formData.append('lemonsqueezyProductId', data.lemonsqueezyProductId);
      if (data.lemonsqueezyVariantId) formData.append('lemonsqueezyVariantId', data.lemonsqueezyVariantId);
      if (data.lemonsqueezyPermalink) formData.append('lemonsqueezyPermalink', data.lemonsqueezyPermalink);
      if (data.imageUrl) formData.append('imageUrl', data.imageUrl);
      if (data.previewLink) formData.append('previewLink', data.previewLink);
      if (data.checkoutUrl) formData.append('checkoutUrl', data.checkoutUrl);
      if (data.version) formData.append('version', data.version.toString());
      if (data.pages) formData.append('pages', data.pages.toString());
      
      // Append arrays
      if (data.screenshots) {
        data.screenshots.forEach((screenshot, index) => {
          formData.append(`screenshots[${index}]`, screenshot);
        });
      }
      
      if (data.description) {
        data.description.forEach((desc, index) => {
          formData.append(`description[${index}]`, desc);
        });
      }
      
      if (data.whatsIncluded) {
        data.whatsIncluded.forEach((item, index) => {
          formData.append(`whatsIncluded[${index}]`, item);
        });
      }
      
      if (data.keyFeatures) {
        formData.append('keyFeatures', JSON.stringify(data.keyFeatures));
      }

      // Append image file
      if (data.image) {
        formData.append('image', data.image);
      }

      // Append source files
      if (data.sourceFiles) {
        data.sourceFiles.forEach((file, index) => {
          formData.append(`sourceFiles[${index}]`, file);
        });
      }

      const response = await apiClient.post('/templates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['templates', 'stats'] });
    },
  });
};

// Update template
export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Template, Error, { id: string; data: UpdateTemplateInput }>({
    mutationFn: async ({ id, data }) => {
      const formData = new FormData();
      
      // Append only provided fields
      if (data.title) formData.append('title', data.title);
      if (data.price !== undefined) formData.append('price', data.price.toString());
      if (data.shortDescription) formData.append('shortDescription', data.shortDescription);
      if (data.categoryId) formData.append('categoryId', data.categoryId);
      if (data.lemonsqueezyProductId) formData.append('lemonsqueezyProductId', data.lemonsqueezyProductId);
      if (data.lemonsqueezyVariantId) formData.append('lemonsqueezyVariantId', data.lemonsqueezyVariantId);
      if (data.lemonsqueezyPermalink) formData.append('lemonsqueezyPermalink', data.lemonsqueezyPermalink);
      if (data.imageUrl) formData.append('imageUrl', data.imageUrl);
      if (data.previewLink) formData.append('previewLink', data.previewLink);
      if (data.checkoutUrl) formData.append('checkoutUrl', data.checkoutUrl);
      if (data.version !== undefined) formData.append('version', data.version.toString());
      if (data.pages !== undefined) formData.append('pages', data.pages.toString());
      
      // Append arrays
      if (data.screenshots) {
        data.screenshots.forEach((screenshot, index) => {
          formData.append(`screenshots[${index}]`, screenshot);
        });
      }
      
      if (data.description) {
        data.description.forEach((desc, index) => {
          formData.append(`description[${index}]`, desc);
        });
      }
      
      if (data.whatsIncluded) {
        data.whatsIncluded.forEach((item, index) => {
          formData.append(`whatsIncluded[${index}]`, item);
        });
      }
      
      if (data.keyFeatures) {
        formData.append('keyFeatures', JSON.stringify(data.keyFeatures));
      }

      // Append image file
      if (data.image) {
        formData.append('image', data.image);
      }

      // Append source files
      if (data.sourceFiles) {
        data.sourceFiles.forEach((file, index) => {
          formData.append(`sourceFiles[${index}]`, file);
        });
      }

      const response = await apiClient.put(`/templates/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['template', data.id] });
      queryClient.invalidateQueries({ queryKey: ['templates', 'stats'] });
    },
  });
};

// Delete template
export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['templates', 'stats'] });
    },
  });
};

// Download source file
export const useDownloadSourceFile = () => {
  return useMutation<string, Error, { templateId: string; fileIndex: number }>({
    mutationFn: async ({ templateId, fileIndex }) => {
      const response = await apiClient.get(`/templates/${templateId}/download/${fileIndex}`, {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `template-${templateId}-file-${fileIndex}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return url;
    },
  });
};

// Template API hook for easy access
export const useTemplateApi = () => {
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();
  const downloadSourceFile = useDownloadSourceFile();

  return {
    createTemplate: createTemplate.mutateAsync,
    updateTemplate: updateTemplate.mutateAsync,
    deleteTemplate: deleteTemplate.mutateAsync,
    downloadSourceFile: downloadSourceFile.mutateAsync,
    isCreating: createTemplate.isPending,
    isUpdating: updateTemplate.isPending,
    isDeleting: deleteTemplate.isPending,
    isDownloading: downloadSourceFile.isPending,
  };
};

