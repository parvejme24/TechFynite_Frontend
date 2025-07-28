import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useApiBaseUrl from './useApiBaseUrl';
import { Pricing, CreatePricingData, UpdatePricingData } from '@/types/pricing';

// PRICING
export function usePricing() {
  const apiBaseUrl = useApiBaseUrl();
  return useQuery({
    queryKey: ['pricing'],
    queryFn: async (): Promise<Pricing[]> => {
      try {
        const res = await fetch(`${apiBaseUrl}/pricing`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`Failed to fetch pricing: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Pricing fetched:', data);
        return Array.isArray(data) ? data : data.data || [];
      } catch (error) {
        console.error('Error fetching pricing:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

export function usePricingById(id: string) {
  const apiBaseUrl = useApiBaseUrl();
  return useQuery({
    queryKey: ['pricing', id],
    queryFn: async (): Promise<Pricing> => {
      try {
        const res = await fetch(`${apiBaseUrl}/pricing/${id}`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`Failed to fetch pricing: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Pricing fetched:', data);
        return data.data || data;
      } catch (error) {
        console.error('Error fetching pricing:', error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

export function useCreatePricing() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pricingData: CreatePricingData) => {
      try {
        console.log('Creating pricing with data:', pricingData);

        const res = await fetch(`${apiBaseUrl}/pricing`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(pricingData),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Server error response:', errorData);
          throw new Error(`Failed to create pricing: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`);
        }

        const result = await res.json();
        console.log('Pricing created successfully:', result);
        return result;
      } catch (error) {
        console.error('Error creating pricing:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Pricing creation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
    },
    onError: (error) => {
      console.error('Pricing creation failed:', error);
    },
  });
}

export function useUpdatePricing() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...pricingData }: UpdatePricingData) => {
      try {
        console.log('Updating pricing:', { id, pricingData });

        const res = await fetch(`${apiBaseUrl}/pricing/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(pricingData),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Server error response:', errorData);
          throw new Error(`Failed to update pricing: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`);
        }

        const result = await res.json();
        console.log('Pricing updated successfully:', result);
        return result;
      } catch (error) {
        console.error('Error updating pricing:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Pricing update successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
    },
    onError: (error) => {
      console.error('Pricing update failed:', error);
    },
  });
}

export function useDeletePricing() {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        console.log('Deleting pricing with ID:', id);

        const res = await fetch(`${apiBaseUrl}/pricing/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Server error response:', errorData);
          throw new Error(`Failed to delete pricing: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`);
        }

        const result = await res.json();
        console.log('Pricing deleted successfully:', result);
        return result;
      } catch (error) {
        console.error('Error deleting pricing:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Pricing deletion successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
    },
    onError: (error) => {
      console.error('Pricing deletion failed:', error);
    },
  });
} 