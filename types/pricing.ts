export interface Pricing {
  id: string;
  title: string;
  price: number;
  license: string;
  recommended: boolean;
  duration: string; // Duration enum from Prisma
  features: string[];
  createdAt: Date;
  updatedAt: Date;
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