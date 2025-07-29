import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApiBaseUrl from "./useApiBaseUrl";

// Types
export interface EmailData {
  to: string;
  subject: string;
  message: string;
  clientName?: string;
  requestId?: string;
}

export interface EmailResponse {
  message: string;
  success: boolean;
}

// Send email (Admin only)
export const useSendEmail = () => {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EmailData): Promise<EmailResponse> => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        console.log("=== API DEBUG ===");
        console.log("Sending email:", data);
        console.log("API Base URL:", apiBaseUrl);
        console.log("Token exists:", !!token);

        const headers = {
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        };

        const res = await fetch(`${apiBaseUrl}/email/send`, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(data),
        });

        console.log("Response status:", res.status);
        console.log("Response status text:", res.statusText);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("API Error response:", errorData);
          throw new Error(`Failed to send email: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        console.log("Email sent successfully:", result);
        return result;
      } catch (error) {
        console.error("=== API ERROR DEBUG ===");
        console.error("Error sending email:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Email sent successfully, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
    },
    onError: (error) => {
      console.error("Error in send email mutation:", error);
    },
  });
};