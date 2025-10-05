export interface CheckoutOrder {
  orderId: string;
  templateId: string;
  templateName: string;
  templateImage: string;
  category: string;
  price: number;
  discount: number;
  couponCode?: string;
  payableAmount: number;
  currency: string;
}

export interface CheckoutUser {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  valid: boolean;
  message?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
}

export interface CheckoutFormData {
  order: CheckoutOrder;
  user: CheckoutUser;
  couponCode: string;
  paymentMethod: string;
  termsAccepted: boolean;
} 