export enum ServiceRequestStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  ON_HOLD = "ON_HOLD"
}

export enum ServiceRequestPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT"
}

export enum ServiceRequestType {
  WEBSITE_DEVELOPMENT = "WEBSITE_DEVELOPMENT",
  MOBILE_APP = "MOBILE_APP",
  UI_UX_DESIGN = "UI_UX_DESIGN",
  CONSULTATION = "CONSULTATION",
  MAINTENANCE = "MAINTENANCE",
  OTHER = "OTHER"
}

export interface ServiceRequestReply {
  id: string;
  serviceRequestId: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  isAdminReply: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  company?: string;
  projectType: ServiceRequestType;
  projectName: string;
  description: string;
  budget?: string;
  timeline?: string;
  status: ServiceRequestStatus;
  priority: ServiceRequestPriority;
  assignedTo?: string;
  estimatedCompletion?: string;
  actualCompletion?: string;
  replies: ServiceRequestReply[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequestData {
  projectType: ServiceRequestType;
  projectName: string;
  description: string;
  budget?: string;
  timeline?: string;
  priority: ServiceRequestPriority;
  userPhone?: string;
  company?: string;
}

export interface UpdateServiceRequestData {
  projectType?: ServiceRequestType;
  projectName?: string;
  description?: string;
  budget?: string;
  timeline?: string;
  priority?: ServiceRequestPriority;
  userPhone?: string;
  company?: string;
}

export interface AddReplyData {
  serviceRequestId: string;
  message: string;
}

export interface ServiceRequestStats {
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  cancelledRequests: number;
} 