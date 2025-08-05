export enum NotificationType {
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  TEMPLATE_DELIVERED = 'TEMPLATE_DELIVERED',
  BLOG_COMMENT = 'BLOG_COMMENT',
  ACCOUNT_UPDATE = 'ACCOUNT_UPDATE',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface User { id: string; }