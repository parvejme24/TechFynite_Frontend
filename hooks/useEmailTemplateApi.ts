import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useApiBaseUrl from "./useApiBaseUrl";
import {
  EmailTemplate,
  CreateEmailTemplateData,
  UpdateEmailTemplateData,
  EmailTemplateResponse,
} from "../types/emailTemplate";

// Get all email templates
export const useGetAllEmailTemplates = () => {
  const apiBaseUrl = useApiBaseUrl();
  return useQuery<EmailTemplate[]>({
    queryKey: ["email-templates"],
    queryFn: async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${apiBaseUrl}/email-templates`, {
        method: "GET",
        headers,
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to fetch email templates: ${res.status} ${res.statusText}`);
      }
      const result = await res.json();
      return Array.isArray(result) ? result : result.data || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Get email template by ID
export const useGetEmailTemplateById = (id: string) => {
  const apiBaseUrl = useApiBaseUrl();
  return useQuery<EmailTemplate>({
    queryKey: ["email-template", id],
    queryFn: async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${apiBaseUrl}/email-templates/${id}`, {
        method: "GET",
        headers,
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to fetch email template: ${res.status} ${res.statusText}`);
      }
      const result = await res.json();
      return result.data || result;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Create email template
export const useCreateEmailTemplate = () => {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation<EmailTemplateResponse, Error, CreateEmailTemplateData>({
    mutationFn: async (data) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${apiBaseUrl}/email-templates`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to create email template: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
    },
  });
};

// Update email template
export const useUpdateEmailTemplate = () => {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation<EmailTemplateResponse, Error, UpdateEmailTemplateData>({
    mutationFn: async ({ id, ...data }) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${apiBaseUrl}/email-templates/${id}`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to update email template: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
    },
  });
};

// Delete email template
export const useDeleteEmailTemplate = () => {
  const apiBaseUrl = useApiBaseUrl();
  const queryClient = useQueryClient();
  return useMutation<EmailTemplateResponse, Error, string>({
    mutationFn: async (id) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${apiBaseUrl}/email-templates/${id}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to delete email template: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
    },
  });
};