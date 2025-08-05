export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  STRIPE = 'STRIPE',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum DeliveryMethod {
  DOWNLOAD = 'DOWNLOAD',
  EMAIL = 'EMAIL',
}

export interface OrderInvoice {
  id: string;
  orderId: string;
  userId: string;
  templateId: string;
  templateName: string;
  templateThumbnail?: string;
  templatePrice: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  status: OrderStatus;
  isDelivered: boolean;
  deliveryMethod: DeliveryMethod;
  deliveryUrl?: string;
  invoiceNumber: string;
  invoiceDate: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
  template?: Template;
  user?: User;
}

export interface Template { id: string; }
export interface User { id: string; }