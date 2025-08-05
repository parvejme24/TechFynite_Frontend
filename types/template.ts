export interface Template {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  version: number;
  downloads: number;
  pages: number;
  views: number;
  totalPurchase: number;
  previewLink?: string;
  shortDescription: string;
  description: string[];
  whatsIncluded: string[];
  keyFeatures: any[];
  screenshots: string[];
  createdAt: string;
  updatedAt: string;
  orders?: OrderInvoice[];
  category?: TemplateCategory;
  purchasedBy?: User[];
}

export interface OrderInvoice { id: string; }
export interface TemplateCategory { id: string; }
export interface User { id: string; }