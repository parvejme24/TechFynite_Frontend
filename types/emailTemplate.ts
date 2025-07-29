export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmailTemplateData {
  name: string;
  subject: string;
  body: string;
}

export interface UpdateEmailTemplateData {
  id: string;
  name?: string;
  subject?: string;
  body?: string;
}

export interface EmailTemplateResponse {
  message: string;
  success: boolean;
  data?: EmailTemplate | EmailTemplate[];
}