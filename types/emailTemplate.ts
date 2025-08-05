export interface EmailTemplate {
  id: string;
  subject: string;
  body: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  admin?: User;
}

export interface User {
  id: string;
}