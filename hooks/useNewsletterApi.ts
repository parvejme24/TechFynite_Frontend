import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

// Types based on your backend interfaces
export interface NewsletterSubscriber {
  id: string;
  email: string;
  userId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  } | null;
}

export interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  inactiveSubscribers: number;
  periodData: {
    period: string;
    count: number;
    date: string;
  }[];
  growthRate: number;
  unsubscribeRate: number;
}

export interface NewsletterStatsQuery {
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate?: string;
  endDate?: string;
}

export interface SubscribeNewsletterData {
  email: string;
}

export interface NewsletterListResponse {
  success: boolean;
  message: string;
  data: NewsletterSubscriber[];
  count: number;
}

export interface NewsletterStatsResponse {
  success: boolean;
  message: string;
  data: NewsletterStats;
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
  data: NewsletterSubscriber;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

// Hook for subscribing to newsletter
export const useSubscribeNewsletter = () => {
  const queryClient = useQueryClient();
  
  return useMutation<SubscribeResponse, Error, SubscribeNewsletterData>({
    mutationFn: async (data) => {
      try {
        console.log('Newsletter subscription request:', data);
        const response = await apiClient.post('/newsletter', data);
        console.log('Newsletter subscription response:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('Newsletter subscription error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data,
            headers: error.config?.headers
          }
        });
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate newsletter queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['newsletterSubscribers'] });
      queryClient.invalidateQueries({ queryKey: ['newsletterStats'] });
    },
  });
};

// Hook for getting all newsletter subscribers
export const useGetNewsletterSubscribers = () => {
  return useQuery<NewsletterListResponse, Error>({
    queryKey: ['newsletterSubscribers'],
    queryFn: async () => {
      const response = await apiClient.get('/newsletter');
      return response.data;
    },
  });
};

// Hook for getting newsletter statistics
export const useGetNewsletterStats = (params?: NewsletterStatsQuery) => {
  return useQuery<NewsletterStatsResponse, Error>({
    queryKey: ['newsletterStats', params],
    queryFn: async () => {
      const response = await apiClient.get('/newsletter/stats', {
        params,
      });
      return response.data;
    },
  });
};

// Hook for deleting newsletter subscriber
export const useDeleteNewsletterSubscriber = () => {
  const queryClient = useQueryClient();
  
  return useMutation<DeleteResponse, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`/newsletter/${id}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate newsletter queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['newsletterSubscribers'] });
      queryClient.invalidateQueries({ queryKey: ['newsletterStats'] });
    },
  });
};

// Combined hook for newsletter management
export const useNewsletter = () => {
  const subscribeMutation = useSubscribeNewsletter();
  const deleteMutation = useDeleteNewsletterSubscriber();
  const { data: subscribers, isLoading: subscribersLoading, error: subscribersError } = useGetNewsletterSubscribers();
  const { data: stats, isLoading: statsLoading, error: statsError } = useGetNewsletterStats();

  const subscribe = async (email: string) => {
    try {
      const result = await subscribeMutation.mutateAsync({ email });
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteSubscriber = async (id: string) => {
    try {
      const result = await deleteMutation.mutateAsync(id);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getStats = async (params?: NewsletterStatsQuery) => {
    // This would typically be handled by the query, but you can refetch if needed
    return stats;
  };

  return {
    // Data
    subscribers: subscribers?.data || [],
    stats: stats?.data,
    subscribersCount: subscribers?.count || 0,
    
    // Loading states
    isLoading: subscribersLoading || statsLoading,
    isSubscribing: subscribeMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Error states
    error: subscribersError || statsError,
    subscribeError: subscribeMutation.error,
    deleteError: deleteMutation.error,
    
    // Actions
    subscribe,
    deleteSubscriber,
    getStats,
    
    // Mutation objects for advanced usage
    subscribeMutation,
    deleteMutation,
  };
};

// Hook for newsletter statistics with custom parameters
export const useNewsletterStats = (params?: NewsletterStatsQuery) => {
  return useQuery<NewsletterStatsResponse, Error>({
    queryKey: ['newsletterStats', params],
    queryFn: async () => {
      const response = await apiClient.get('/newsletter/stats', {
        params,
      });
      return response.data;
    },
    enabled: true, // Always enabled, but you can add conditions
  });
};

// Hook for newsletter subscription status check
export const useNewsletterSubscriptionStatus = (email?: string) => {
  return useQuery<boolean, Error>({
    queryKey: ['newsletterSubscriptionStatus', email],
    queryFn: async () => {
      if (!email) return false;
      
      const response = await apiClient.get('/newsletter');
      const subscribers = response.data.data;
      
      const subscriber = subscribers.find((sub: NewsletterSubscriber) => 
        sub.email.toLowerCase() === email.toLowerCase() && sub.isActive
      );
      
      return !!subscriber;
    },
    enabled: !!email,
  });
};
