"use client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export interface SendEmailPayload {
  to: string;
  subject: string;
  message: string;
  clientName?: string;
  requestId?: string;
}

export function useSendEmail(): UseMutationResult<unknown, unknown, SendEmailPayload> {
  return useMutation({
    mutationKey: ["emails", "send"],
    mutationFn: async (payload: SendEmailPayload) => {
      const response = await apiClient.post("/emails/send", payload);
      return response.data;
    },
  });
}


