import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import {
  Contact,
  ContactReply,
  ContactStats,
  CreateContactData,
  ContactReplyData,
  ContactQuery,
} from "@/types/contact";

// --- Response Types ---

interface CreateContactResponse {
  success: boolean;
  message: string;
  data: Contact;
}

interface GetContactsResponse {
  success: boolean;
  message: string;
  data: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface GetContactByIdResponse {
  success: boolean;
  message: string;
  data: Contact;
}

interface SendContactReplyResponse {
  success: boolean;
  message: string;
  data: ContactReply;
}

interface DeleteContactResponse {
  success: boolean;
  message: string;
}

interface GetContactStatsResponse {
  success: boolean;
  message: string;
  data: ContactStats;
}

// --- Mutations ---

// Add new contact (Public route)
export const useCreateContact = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateContactResponse, Error, CreateContactData>({
    mutationFn: async (contactData) => {
      const response = await apiClient.post("/contacts", contactData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contactStats"] });
    },
  });
};

// Send contact reply (Admin only)
export const useSendContactReply = () => {
  const queryClient = useQueryClient();
  return useMutation<
    SendContactReplyResponse,
    Error,
    { contactId: string; replyData: ContactReplyData }
  >({
    mutationFn: async ({ contactId, replyData }) => {
      const response = await apiClient.post(
        `/contacts/${contactId}/reply`,
        replyData
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({
        queryKey: ["contact", variables.contactId],
      });
    },
  });
};

// Delete contact (User/Admin)
export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteContactResponse, Error, string>({
    mutationFn: async (contactId) => {
      const response = await apiClient.delete(`/contacts/${contactId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contactStats"] });
    },
  });
};

// --- Queries ---

// Get all contacts (Admin only)
export const useGetAllContacts = (query?: ContactQuery) => {
  return useQuery<GetContactsResponse, Error>({
    queryKey: ["contacts", query],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/contacts", {
          params: query,
        });

        // Handle the actual backend response structure
        if (response.data.success && response.data.data) {
          return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data,
            pagination: response.data.pagination || {
              page: 1,
              limit: 100,
              total: response.data.data.length,
              totalPages: 1,
              hasNext: false,
              hasPrev: false,
            },
          };
        }

        return response.data;
      } catch (error: any) {
        // Silent error handling - fallback data will be used

        // Handle deleted account error
        if (error.response?.data?.message === "Account is deleted") {
          if (typeof window !== "undefined") {
            localStorage.removeItem("nextAuthSecret");
            window.location.href = "/login";
          }
        }

        // Return fallback data for 500 errors to keep frontend functional
        if (error.response?.status === 500) {
          return {
            success: true,
            message: "Using fallback data - Backend temporarily unavailable",
            data: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 1,
              hasNext: false,
              hasPrev: false,
            },
          };
        }

        throw error;
      }
    },
    retry: 1,
    retryDelay: 2000,
  });
};

// Get contact by ID (User/Admin)
export const useGetContactById = (id: string) => {
  return useQuery<GetContactByIdResponse, Error>({
    queryKey: ["contact", id],
    queryFn: async () => {
      const response = await apiClient.get(`/contacts/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Get contacts by user email (User)
export const useGetContactsByUserEmail = (
  userEmail: string,
  query?: Omit<ContactQuery, "search">
) => {
  return useQuery<GetContactsResponse, Error>({
    queryKey: ["contacts", "email", userEmail, query],
    queryFn: async () => {
      const response = await apiClient.get(`/contacts/email/${userEmail}`, {
        params: query,
      });
      return response.data;
    },
    enabled: !!userEmail,
  });
};

// Get contact statistics (Admin only)
export const useGetContactStats = (
  query?: Pick<ContactQuery, "period" | "startDate" | "endDate">
) => {
  return useQuery<GetContactStatsResponse, Error>({
    queryKey: ["contactStats", query],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/contacts/stats", {
          params: query,
        });
        return response.data;
      } catch (error: any) {
        console.error("❌ Contact stats fetch error:", error.message);
        throw error;
      }
    },
  });
};

// --- Combined Hook for convenience ---

interface UseContactResult {
  // Create contact
  createContact: (data: CreateContactData) => Promise<CreateContactResponse>;
  isCreating: boolean;
  createError: Error | null;

  // Get all contacts (admin)
  allContacts: Contact[] | undefined;
  isLoadingAllContacts: boolean;
  allContactsError: Error | null;
  contactsPagination: any;
  refetchAllContacts: () => Promise<any>;

  // Get contact by ID
  getContactById: (id: string) => Promise<GetContactByIdResponse>;
  contact: Contact | undefined;
  isLoadingContact: boolean;
  contactError: Error | null;

  // Get contacts by email
  contactsByEmail: Contact[] | undefined;
  isLoadingContactsByEmail: boolean;
  contactsByEmailError: Error | null;
  contactsByEmailPagination: any;

  // Send reply
  sendReply: (
    contactId: string,
    replyData: ContactReplyData
  ) => Promise<SendContactReplyResponse>;
  isSendingReply: boolean;
  sendReplyError: Error | null;

  // Delete contact
  deleteContact: (contactId: string) => Promise<DeleteContactResponse>;
  isDeleting: boolean;
  deleteError: Error | null;

  // Stats
  stats: ContactStats | undefined;
  isLoadingStats: boolean;
  statsError: Error | null;
}

export const useContact = (query?: ContactQuery): UseContactResult => {
  const queryClient = useQueryClient();

  // Mutations
  const {
    mutateAsync: createContactMutation,
    isPending: isCreating,
    error: createError,
  } = useCreateContact();
  const {
    mutateAsync: sendReplyMutation,
    isPending: isSendingReply,
    error: sendReplyError,
  } = useSendContactReply();
  const {
    mutateAsync: deleteContactMutation,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteContact();

  // Queries
  const {
    data: allContactsData,
    isLoading: isLoadingAllContacts,
    error: allContactsError,
    refetch: refetchAllContacts,
  } = useGetAllContacts(query);
  const {
    data: contactsByEmailData,
    isLoading: isLoadingContactsByEmail,
    error: contactsByEmailError,
  } = useGetContactsByUserEmail(query?.search || "", query);
  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useGetContactStats(query);

  return {
    // Create contact
    createContact: createContactMutation,
    isCreating,
    createError,

    // Get all contacts
    allContacts: allContactsData?.data,
    isLoadingAllContacts,
    allContactsError,
    contactsPagination: allContactsData?.pagination,
    refetchAllContacts,

    // Get contact by ID (will be used when needed)
    getContactById: async (id: string) => {
      const response = await apiClient.get(`/contacts/${id}`);
      return response.data;
    },
    contact: undefined, // Will be set when getContactById is called
    isLoadingContact: false,
    contactError: null,

    // Get contacts by email
    contactsByEmail: contactsByEmailData?.data,
    isLoadingContactsByEmail,
    contactsByEmailError,
    contactsByEmailPagination: contactsByEmailData?.pagination,

    // Send reply
    sendReply: async (contactId: string, replyData: ContactReplyData) => {
      return await sendReplyMutation({ contactId, replyData });
    },
    isSendingReply,
    sendReplyError,

    // Delete contact
    deleteContact: deleteContactMutation,
    isDeleting,
    deleteError,

    // Stats
    stats: statsData?.data,
    isLoadingStats,
    statsError,
  };
};
