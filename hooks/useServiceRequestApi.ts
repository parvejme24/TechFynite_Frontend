import { useQuery } from "@tanstack/react-query";
import useApiBaseUrl from "./useApiBaseUrl";

// Types
export interface ServiceRequest {
  id: string;
  projectDetails: string;
  budget: string;
  fullName: string;
  email: string;
  companyName: string;
  serviceRequred: string;
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt?: Date;
}

export interface ServiceRequestResponse {
  message: string;
  success: boolean;
}

// Get all service requests (Admin only)
export const useGetAllServiceRequests = () => {
  const apiBaseUrl = useApiBaseUrl();

  return useQuery({
    queryKey: ["service-requests"],
    queryFn: async (): Promise<ServiceRequest[]> => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        console.log("=== API DEBUG ===");
        console.log("Fetching all service requests");
        console.log("API Base URL:", apiBaseUrl);
        console.log("Token exists:", !!token);

        const headers = {
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        };

        const res = await fetch(`${apiBaseUrl}/contact`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        console.log("Response status:", res.status);
        console.log("Response status text:", res.statusText);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("API Error response:", errorData);
          throw new Error(`Failed to fetch service requests: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        console.log("Service requests fetched successfully:", result);
        return Array.isArray(result) ? result : result.data || result.contacts || [];
      } catch (error) {
        console.error("=== API ERROR DEBUG ===");
        console.error("Error fetching service requests:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Get service request by ID (Admin only)
export const useGetServiceRequestById = (requestId: string) => {
  const apiBaseUrl = useApiBaseUrl();

  return useQuery({
    queryKey: ["service-request", requestId],
    queryFn: async (): Promise<ServiceRequest> => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        console.log("=== API DEBUG ===");
        console.log("Fetching service request by ID:", requestId);
        console.log("API Base URL:", apiBaseUrl);
        console.log("Token exists:", !!token);

        const headers = {
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        };

        const res = await fetch(`${apiBaseUrl}/contact/${requestId}`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        console.log("Response status:", res.status);
        console.log("Response status text:", res.statusText);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("API Error response:", errorData);
          throw new Error(`Failed to fetch service request: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        console.log("Service request fetched successfully:", result);
        return result;
      } catch (error) {
        console.error("=== API ERROR DEBUG ===");
        console.error("Error fetching service request:", error);
        throw error;
      }
    },
    enabled: !!requestId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};