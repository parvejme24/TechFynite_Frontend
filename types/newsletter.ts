// Newsletter Types based on backend interfaces

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

// API Response Types
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

// Form Types
export interface NewsletterFormData {
  email: string;
}

// Component Props Types
export interface NewsletterFormProps {
  onSubmit: (data: NewsletterFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  success?: boolean;
}

export interface NewsletterStatsProps {
  stats?: NewsletterStats;
  isLoading?: boolean;
  error?: string | null;
  period?: NewsletterStatsQuery['period'];
  onPeriodChange?: (period: NewsletterStatsQuery['period']) => void;
}

export interface NewsletterSubscribersListProps {
  subscribers: NewsletterSubscriber[];
  isLoading?: boolean;
  error?: string | null;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

// Hook Return Types
export interface UseNewsletterReturn {
  // Data
  subscribers: NewsletterSubscriber[];
  stats?: NewsletterStats;
  subscribersCount: number;
  
  // Loading states
  isLoading: boolean;
  isSubscribing: boolean;
  isDeleting: boolean;
  
  // Error states
  error: Error | null;
  subscribeError: Error | null;
  deleteError: Error | null;
  
  // Actions
  subscribe: (email: string) => Promise<SubscribeResponse>;
  deleteSubscriber: (id: string) => Promise<DeleteResponse>;
  getStats: (params?: NewsletterStatsQuery) => Promise<NewsletterStats | undefined>;
  
  // Mutation objects for advanced usage
  subscribeMutation: any;
  deleteMutation: any;
}