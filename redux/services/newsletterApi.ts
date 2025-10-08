import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types based on your backend interfaces
export interface NewsletterSubscriber {
  id: string;
  email: string;
  userId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  } | null;
}

export interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  inactiveSubscribers: number;
  periodData: {
    period: string;
    count: number;
    date: string;
  }[];
  growthRate: number;
  unsubscribeRate: number;
}

export interface NewsletterStatsQuery {
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate?: string;
  endDate?: string;
}

export interface SubscribeNewsletterData {
  email: string;
}

export interface NewsletterListResponse {
  success: boolean;
  message: string;
  data: NewsletterSubscriber[];
  count: number;
}

export interface NewsletterStatsResponse {
  success: boolean;
  message: string;
  data: NewsletterStats;
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
  data: NewsletterSubscriber;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tech-fynite-backend.vercel.app/api/v1';

export const newsletterApi = createApi({
  reducerPath: 'newsletterApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('nextAuthSecret');
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['NewsletterSubscriber', 'NewsletterStats'],
  endpoints: (builder) => ({
    // Subscribe to newsletter
    subscribeNewsletter: builder.mutation<SubscribeResponse, SubscribeNewsletterData>({
      query: (data) => ({
        url: '/newsletter',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['NewsletterSubscriber', 'NewsletterStats'],
    }),

    // Get all newsletter subscribers
    getNewsletterSubscribers: builder.query<NewsletterListResponse, void>({
      query: () => ({
        url: '/newsletter',
        method: 'GET',
      }),
      providesTags: ['NewsletterSubscriber'],
    }),

    // Get newsletter statistics
    getNewsletterStats: builder.query<NewsletterStatsResponse, NewsletterStatsQuery | void>({
      query: (params = {}) => ({
        url: '/newsletter/stats',
        method: 'GET',
        params,
      }),
      providesTags: ['NewsletterStats'],
    }),

    // Delete newsletter subscriber
    deleteNewsletterSubscriber: builder.mutation<DeleteResponse, string>({
      query: (id) => ({
        url: `/newsletter/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['NewsletterSubscriber', 'NewsletterStats'],
    }),
  }),
});

export const {
  useSubscribeNewsletterMutation,
  useGetNewsletterSubscribersQuery,
  useGetNewsletterStatsQuery,
  useDeleteNewsletterSubscriberMutation,
} = newsletterApi;
