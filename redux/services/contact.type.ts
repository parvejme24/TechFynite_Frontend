import { z } from "zod";

// Contact form submission schema
export const contactFormSchema = z.object({
  projectDetails: z.string().min(10, "Project details must be at least 10 characters").max(1000, "Project details must not exceed 1000 characters"),
  budget: z.string().min(1, "Budget is required").max(50, "Budget must not exceed 50 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name must not exceed 100 characters"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  companyName: z.string().min(1, "Company name is required").max(100, "Company name must not exceed 100 characters"),
  serviceRequired: z.string().min(1, "Service required is required").max(100, "Service required must not exceed 100 characters"),
  userId: z.string().uuid().optional(),
});

// Contact reply schema
export const contactReplySchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200, "Subject must not exceed 200 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must not exceed 2000 characters"),
});

// Contact ID parameter schema
export const contactIdSchema = z.object({
  id: z.string().uuid("Invalid contact ID format"),
});

// Contact query parameters schema
export const contactQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  search: z.string().optional(),
});

// Types
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type ContactReplyInput = z.infer<typeof contactReplySchema>;
export type ContactIdParams = z.infer<typeof contactIdSchema>;
export type ContactQueryParams = z.infer<typeof contactQuerySchema>;

// Contact response types
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
