export enum Duration {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  HALFYEARLY = 'HALFYEARLY',
}

export interface Pricing {
  id: string;
  title: string;
  price: number;
  license: string;
  recommended: boolean;
  duration: Duration;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePricingData {
  title: string;
  price: number;
  license: string;
  recommended?: boolean;
  duration: string;
  features: string[];
}

export interface UpdatePricingData extends Partial<CreatePricingData> {
  id: string;
} 