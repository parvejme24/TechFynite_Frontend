import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://tech-fynite-backend.vercel.app/api/v1',
  prepareHeaders: (headers, { getState }) => {
    // Get token from localStorage - check for nextAuthSecret first
    const token = localStorage.getItem('nextAuthSecret') ||
                  localStorage.getItem('token') || 
                  localStorage.getItem('accessToken') ||
                  localStorage.getItem('authToken');
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const serviceRequestApi = createApi({
  reducerPath: 'serviceRequestApi',
  baseQuery,
  tagTypes: ['ServiceRequest'],
  endpoints: (builder) => ({
    // Get all contacts (Admin route)
    getAllContacts: builder.query({
      query: ({ page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' }) => {
        const params = { page, limit, search, sortBy, sortOrder };
        return {
          url: '/contacts',
          method: 'GET',
          params,
        };
      },
      providesTags: ['ServiceRequest'],
    }),
    
    // Test endpoint without auth (for debugging)
    testContacts: builder.query({
      query: () => ({
        url: '/contacts',
        method: 'GET',
        // Don't send auth header for this test
      }),
      providesTags: ['ServiceRequest'],
    }),
    
    // Test with different auth approach
    testContactsWithAuth: builder.query({
      query: () => {
        const token = localStorage.getItem('nextAuthSecret');
        console.log('🔑 Test token:', token ? 'Present' : 'Missing');
        return {
          url: '/contacts',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        };
      },
      providesTags: ['ServiceRequest'],
    }),
    
    // Get contact by ID
    getContactById: builder.query({
      query: (id) => `/contacts/${id}`,
      providesTags: (result, error, id) => [{ type: 'ServiceRequest', id }],
    }),
    
    // Get contacts by user email
    getContactsByUserEmail: builder.query({
      query: ({ userEmail, page = 1, limit = 10 }) => ({
        url: `/contacts/email/${userEmail}`,
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['ServiceRequest'],
    }),
    
    // Create new contact
    createContact: builder.mutation({
      query: (contactData) => ({
        url: '/contacts',
        method: 'POST',
        body: contactData,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),
    
    // Update contact
    updateContact: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/contacts/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ServiceRequest', id },
      ],
    }),
    
    // Send contact reply
    sendContactReply: builder.mutation({
      query: ({ contactId, replyData }) => ({
        url: `/contacts/${contactId}/reply`,
        method: 'POST',
        body: replyData,
      }),
      invalidatesTags: (result, error, { contactId }) => [
        { type: 'ServiceRequest', id: contactId },
      ],
    }),

    // Get contact replies
    getContactReplies: builder.query({
      query: (contactId) => `/contacts/${contactId}/replies`,
      providesTags: (result, error, contactId) => [
        { type: 'ServiceRequest', id: contactId },
      ],
    }),
    
    // Delete contact
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ServiceRequest'],
    }),
    
    // Get contact stats
    getContactStats: builder.query({
      query: ({ period, startDate, endDate } = {}) => ({
        url: '/contacts/stats',
        method: 'GET',
        params: { period, startDate, endDate },
      }),
      providesTags: ['ServiceRequest'],
    }),
  }),
});

export const {
  useGetAllContactsQuery,
  useGetContactByIdQuery,
  useGetContactsByUserEmailQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useSendContactReplyMutation,
  useGetContactRepliesQuery,
  useDeleteContactMutation,
  useGetContactStatsQuery,
  useTestContactsQuery,
  useTestContactsWithAuthQuery,
} = serviceRequestApi;
