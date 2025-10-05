"use client"
import React, { useState } from 'react';
import PurchaseStats from './PurchaseStats';
import PurchaseFilters from './PurchaseFilters';
import PurchaseList from './PurchaseList';
import { Purchase, PurchaseStatus } from '@/types/purchase';

// Fake data for purchases
const fakePurchases: Purchase[] = [
  {
    id: '1',
    templateId: 'template-1',
    templateName: 'E-Commerce Dashboard',
    templateImage: '/assets/common/placeholder.png',
    templatePrice: 49.99,
    purchaseDate: '2024-01-15T10:30:00Z',
    status: PurchaseStatus.COMPLETED,
    paymentId: 'pay-1',
    userId: 'user-1',
    downloadUrl: 'https://example.com/download/template-1',
    licenseKey: 'LIC-123456789',
    expiresAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    templateId: 'template-2',
    templateName: 'Admin Panel Pro',
    templateImage: '/assets/common/placeholder.png',
    templatePrice: 79.99,
    purchaseDate: '2024-01-10T14:20:00Z',
    status: PurchaseStatus.PENDING,
    paymentId: 'pay-2',
    userId: 'user-1',
    downloadUrl: 'https://example.com/download/template-2',
    licenseKey: 'LIC-987654321',
    expiresAt: '2025-01-10T14:20:00Z'
  },
  {
    id: '3',
    templateId: 'template-3',
    templateName: 'Portfolio Website',
    templateImage: '/assets/common/placeholder.png',
    templatePrice: 29.99,
    purchaseDate: '2024-01-05T09:15:00Z',
    status: PurchaseStatus.COMPLETED,
    paymentId: 'pay-3',
    userId: 'user-1',
    downloadUrl: 'https://example.com/download/template-3',
    licenseKey: 'LIC-456789123',
    expiresAt: '2025-01-05T09:15:00Z'
  },
  {
    id: '4',
    templateId: 'template-4',
    templateName: 'Blog Template',
    templateImage: '/assets/common/placeholder.png',
    templatePrice: 39.99,
    purchaseDate: '2024-01-01T16:45:00Z',
    status: PurchaseStatus.CANCELLED,
    paymentId: 'pay-4',
    userId: 'user-1'
  }
];

const PurchasesContainer: React.FC = () => {
  const [purchases] = useState<Purchase[]>(fakePurchases);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>(fakePurchases);
  const [selectedStatus, setSelectedStatus] = useState<PurchaseStatus | 'ALL'>('ALL');

  const handleStatusFilter = (status: PurchaseStatus | 'ALL') => {
    setSelectedStatus(status);
    if (status === 'ALL') {
      setFilteredPurchases(purchases);
    } else {
      setFilteredPurchases(purchases.filter(purchase => purchase.status === status));
    }
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredPurchases(purchases);
      return;
    }
    
    const filtered = purchases.filter(purchase =>
      purchase.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPurchases(filtered);
  };

  return (
    <div className="space-y-6">
      <PurchaseStats purchases={purchases} />
      <PurchaseFilters 
        selectedStatus={selectedStatus}
        onStatusFilter={handleStatusFilter}
        onSearch={handleSearch}
      />
      <PurchaseList purchases={filteredPurchases} />
    </div>
  );
};

export default PurchasesContainer; 