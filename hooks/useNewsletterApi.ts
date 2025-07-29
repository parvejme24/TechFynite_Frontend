import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useApiBaseUrl from "./useApiBaseUrl";

// Types
export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  status: string;
  subscribedAt: Date;
  lastChanged: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubscribeNewsletterData {
  email: string;
}

export interface NewsletterCount {
  total: number;
  active: number;
  inactive: number;
}

// Subscribe to newsletter (Public route)
export const useSubscribeNewsletter = () => {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubscribeNewsletterData): Promise<{ message: string }> => {
      try {
        console.log("=== API DEBUG ===");
        console.log("Subscribing to newsletter:", data);
        console.log("API Base URL:", apiBaseUrl);

        const res = await fetch(`${apiBaseUrl}/newsletter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        console.log("Response status:", res.status);
        console.log("Response status text:", res.statusText);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("API Error response:", errorData);
          throw new Error(`Failed to subscribe to newsletter: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        console.log("Newsletter subscription successful:", result);
        return result;
      } catch (error) {
        console.error("=== API ERROR DEBUG ===");
        console.error("Error subscribing to newsletter:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Newsletter subscription successful, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["newsletter-count"] });
      queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
    },
    onError: (error) => {
      console.error("Error in subscribe newsletter mutation:", error);
    },
  });
};

// Get all newsletter subscribers (Admin only)
export const useNewsletterSubscribers = () => {
  const apiBaseUrl = useApiBaseUrl();

  return useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: async (): Promise<NewsletterSubscriber[]> => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        console.log("=== API DEBUG ===");
        console.log("Fetching newsletter subscribers");
        console.log("API Base URL:", apiBaseUrl);
        console.log("Token exists:", !!token);

        const headers = {
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        };

        const res = await fetch(`${apiBaseUrl}/newsletter/subscribers`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        console.log("Response status:", res.status);
        console.log("Response status text:", res.statusText);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("API Error response:", errorData);
          throw new Error(`Failed to fetch newsletter subscribers: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        console.log("Newsletter subscribers fetched successfully:", result);
        return Array.isArray(result) ? result : result.data || result.subscribers || [];
      } catch (error) {
        console.error("=== API ERROR DEBUG ===");
        console.error("Error fetching newsletter subscribers:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Get newsletter subscriber count (Admin only)
export const useNewsletterCount = () => {
  const apiBaseUrl = useApiBaseUrl();

  return useQuery({
    queryKey: ["newsletter-count"],
    queryFn: async (): Promise<NewsletterCount> => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        console.log("=== API DEBUG ===");
        console.log("Fetching newsletter count");
        console.log("API Base URL:", apiBaseUrl);
        console.log("Token exists:", !!token);

        const headers = {
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        };

        const res = await fetch(`${apiBaseUrl}/newsletter/count`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        console.log("Response status:", res.status);
        console.log("Response status text:", res.statusText);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("API Error response:", errorData);
          throw new Error(`Failed to fetch newsletter count: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        console.log("Newsletter count fetched successfully:", result);
        return result;
      } catch (error) {
        console.error("=== API ERROR DEBUG ===");
        console.error("Error fetching newsletter count:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

// Get subscribers with Axios (Admin only)
export const useSubscribersWithAxios = () => {
  const apiBaseUrl = useApiBaseUrl();

  return useQuery({
    queryKey: ["subscribers-axios"],
    queryFn: async (): Promise<NewsletterSubscriber[]> => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        console.log("=== API DEBUG ===");
        console.log("Fetching subscribers with Axios");
        console.log("API Base URL:", apiBaseUrl);
        console.log("Token exists:", !!token);

        const headers = {
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        };

        const res = await fetch(`${apiBaseUrl}/subscribers`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        console.log("Response status:", res.status);
        console.log("Response status text:", res.statusText);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("API Error response:", errorData);
          throw new Error(`Failed to fetch subscribers: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        console.log("Subscribers fetched successfully:", result);
        return Array.isArray(result) ? result : result.data || result.subscribers || [];
      } catch (error) {
        console.error("=== API ERROR DEBUG ===");
        console.error("Error fetching subscribers:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};