"use client"
import React, { useState } from 'react';
import PaymentStats from './PaymentStats';
import PaymentFilters from './PaymentFilters';
import PaymentList from './PaymentList';
import { Payment, PaymentStatus, PaymentMethod } from '@/types/purchase';

// Fake data for payments
const fakePayments: Payment[] = [
  {
    id: '1',
    purchaseId: '1',
    amount: 49.99,
    currency: 'USD',
    method: PaymentMethod.CREDIT_CARD,
    status: PaymentStatus.COMPLETED,
    transactionId: 'TXN-123456789',
    paymentDate: '2024-01-15T10:30:00Z',
    description: 'Payment for E-Commerce Dashboard template',
    receiptUrl: 'https://example.com/receipt/1'
  },
  {
    id: '2',
    purchaseId: '2',
    amount: 79.99,
    currency: 'USD',
    method: PaymentMethod.PAYPAL,
    status: PaymentStatus.PENDING,
    transactionId: 'TXN-987654321',
    paymentDate: '2024-01-10T14:20:00Z',
    description: 'Payment for Admin Panel Pro template'
  },
  {
    id: '3',
    purchaseId: '3',
    amount: 29.99,
    currency: 'USD',
    method: PaymentMethod.DEBIT_CARD,
    status: PaymentStatus.COMPLETED,
    transactionId: 'TXN-456789123',
    paymentDate: '2024-01-05T09:15:00Z',
    description: 'Payment for Portfolio Website template',
    receiptUrl: 'https://example.com/receipt/3'
  },
  {
    id: '4',
    purchaseId: '4',
    amount: 39.99,
    currency: 'USD',
    method: PaymentMethod.BANK_TRANSFER,
    status: PaymentStatus.FAILED,
    transactionId: 'TXN-789123456',
    paymentDate: '2024-01-01T16:45:00Z',
    description: 'Payment for Blog Template'
  },
  {
    id: '5',
    purchaseId: '5',
    amount: 99.99,
    currency: 'USD',
    method: PaymentMethod.CRYPTO,
    status: PaymentStatus.REFUNDED,
    transactionId: 'TXN-321654987',
    paymentDate: '2023-12-20T11:30:00Z',
    description: 'Payment for Premium Template Bundle'
  }
];

const PaymentContainer: React.FC = () => {
  const [payments] = useState<Payment[]>(fakePayments);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(fakePayments);
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | 'ALL'>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | 'ALL'>('ALL');

  const handleStatusFilter = (status: PaymentStatus | 'ALL') => {
    setSelectedStatus(status);
    applyFilters(status, selectedMethod);
  };

  const handleMethodFilter = (method: PaymentMethod | 'ALL') => {
    setSelectedMethod(method);
    applyFilters(selectedStatus, method);
  };

  const applyFilters = (status: PaymentStatus | 'ALL', method: PaymentMethod | 'ALL') => {
    let filtered = payments;
    
    if (status !== 'ALL') {
      filtered = filtered.filter(payment => payment.status === status);
    }
    
    if (method !== 'ALL') {
      filtered = filtered.filter(payment => payment.method === method);
    }
    
    setFilteredPayments(filtered);
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      applyFilters(selectedStatus, selectedMethod);
      return;
    }
    
    const filtered = payments.filter(payment =>
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPayments(filtered);
  };

  const handleMakePayment = (payment: Payment) => {
    // Handle payment completion logic
    console.log('Completing payment:', payment.id);
  };

  return (
    <div className="space-y-6">
      <PaymentStats payments={payments} />
      <PaymentFilters 
        selectedStatus={selectedStatus}
        selectedMethod={selectedMethod}
        onStatusFilter={handleStatusFilter}
        onMethodFilter={handleMethodFilter}
        onSearch={handleSearch}
      />
      <PaymentList 
        payments={filteredPayments} 
        onMakePayment={handleMakePayment}
      />
    </div>
  );
};

export default PaymentContainer; 