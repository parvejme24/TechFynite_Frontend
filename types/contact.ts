export interface Contact {
  id: string;
  projectDetails: string;
  budget: string;
  fullName: string;
  email: string;
  companyName: string;
  serviceRequired: string;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    profile?: {
      avatarUrl: string | null;
    } | null;
  } | null;
  replies?: ContactReply[];
}

export interface ContactReply {
  id: string;
  subject: string;
  message: string;
  contactId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  contact?: Contact | null;
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    profile?: {
      avatarUrl: string | null;
    } | null;
  } | null;
}

export interface ContactStats {
  totalContacts: number;
  pendingContacts: number;
  inProgressContacts: number;
  completedContacts: number;
  recentContacts: Contact[];
  monthlyGrowth: number;
  periodData?: {
    period: string;
    count: number;
  }[];
}

export interface PaginatedContacts {
  contacts: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateContactData {
  projectDetails: string;
  budget: string;
  fullName: string;
  email: string;
  companyName: string;
  serviceRequired: string;
  userId?: string;
}

export interface ContactReplyData {
  subject: string;
  message: string;
}

export interface ContactQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate?: string;
  endDate?: string;
}