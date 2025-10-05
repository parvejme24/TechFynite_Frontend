"use client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { ServiceRequest } from "@/types/serviceRequest";

export function useGetAllServiceRequests(): UseQueryResult<ServiceRequest[], unknown> {
  return useQuery({
    queryKey: ["serviceRequests", "all"],
    queryFn: async () => {
      const res = await apiClient.get<ServiceRequest[]>("/service-requests");
      return Array.isArray(res.data) ? res.data : [];
    },
  });
}


