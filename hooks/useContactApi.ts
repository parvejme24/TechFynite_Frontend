import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useApiBaseUrl from "./useApiBaseUrl";

// Types
export interface ContactFormData {
  projectDetails: string;
  budget: string;
  fullName: string;
  email: string;
  companyName: string;
  serviceRequred: string;
}

export interface Contact {
  id: string;
  projectDetails: string;
  budget: string;
  fullName: string;
  email: string;
  companyName: string;
  serviceRequred: string;
  createdAt: Date;
}

export interface ContactResponse {
  message: string;
  success: boolean;
}

// Submit contact form (Public route)
export const useSubmitContactForm = () => {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ContactFormData): Promise<ContactResponse> => {
      try {
        console.log("=== API DEBUG ===");
        console.log("Submitting contact form:", data);
        console.log("API Base URL:", apiBaseUrl);

        const res = await fetch(`${apiBaseUrl}/contact`, {
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
          throw new Error(`Failed to submit contact form: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        console.log("Contact form submitted successfully:", result);
        return result;
      } catch (error) {
        console.error("=== API ERROR DEBUG ===");
        console.error("Error submitting contact form:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Contact form submitted successfully, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: (error) => {
      console.error("Error in submit contact form mutation:", error);
    },
  });
};

// Get all contacts (Admin only)
export const useGetAllContacts = () => {
  const apiBaseUrl = useApiBaseUrl();

  return useQuery({
    queryKey: ["contacts"],
    queryFn: async (): Promise<Contact[]> => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        console.log("=== API DEBUG ===");
        console.log("Fetching all contacts");
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
          throw new Error(`Failed to fetch contacts: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        console.log("Contacts fetched successfully:", result);
        return Array.isArray(result) ? result : result.data || result.contacts || [];
      } catch (error) {
        console.error("=== API ERROR DEBUG ===");
        console.error("Error fetching contacts:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};