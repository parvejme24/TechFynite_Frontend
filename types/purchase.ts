export enum PurchaseStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED"
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  PAYPAL = "PAYPAL",
  BANK_TRANSFER = "BANK_TRANSFER",
  CRYPTO = "CRYPTO"
}

export interface Purchase {
  id: string;
  templateId: string;
  templateName: string;
  templateImage: string;
  templatePrice: number;
  purchaseDate: string;
  status: PurchaseStatus;
  paymentId: string;
  userId: string;
  downloadUrl?: string;
  licenseKey?: string;
  expiresAt?: string;
}

export interface Payment {
  id: string;
  purchaseId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string;
  paymentDate: string;
  description: string;
  receiptUrl?: string;
}

export interface PurchaseStats {
  totalPurchases: number;
  totalSpent: number;
  activeLicenses: number;
  pendingPayments: number;
} 