export interface EmailTemplate {
  id: string;
  subject: string;
  body: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  admin?: User;
}

export interface CreateEmailTemplateData {
  subject: string;
  body: string;
}

export interface UpdateEmailTemplateData {
  id: string;
  subject?: string;
  body?: string;
}

export interface EmailTemplateResponse {
  success: boolean;
  message: string;
  data?: EmailTemplate | EmailTemplate[];
}

export interface User {
  id: string;
}