import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentStatus, PaymentMethod } from '@/types/purchase';
import { Search, Filter, CreditCard } from 'lucide-react';

interface PaymentFiltersProps {
  selectedStatus: PaymentStatus | 'ALL';
  selectedMethod: PaymentMethod | 'ALL';
  onStatusFilter: (status: PaymentStatus | 'ALL') => void;
  onMethodFilter: (method: PaymentMethod | 'ALL') => void;
  onSearch: (searchTerm: string) => void;
}

const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  selectedStatus,
  selectedMethod,
  onStatusFilter,
  onMethodFilter,
  onSearch
}) => {
  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: PaymentStatus.COMPLETED, label: 'Completed' },
    { value: PaymentStatus.PENDING, label: 'Pending' },
    { value: PaymentStatus.FAILED, label: 'Failed' },
    { value: PaymentStatus.REFUNDED, label: 'Refunded' }
  ];

  const methodOptions = [
    { value: 'ALL', label: 'All Methods' },
    { value: PaymentMethod.CREDIT_CARD, label: 'Credit Card' },
    { value: PaymentMethod.DEBIT_CARD, label: 'Debit Card' },
    { value: PaymentMethod.PAYPAL, label: 'PayPal' },
    { value: PaymentMethod.BANK_TRANSFER, label: 'Bank Transfer' },
    { value: PaymentMethod.CRYPTO, label: 'Cryptocurrency' }
  ];

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case PaymentStatus.PENDING:
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case PaymentStatus.FAILED:
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case PaymentStatus.REFUNDED:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
      case PaymentMethod.DEBIT_CARD:
        return '💳';
      case PaymentMethod.PAYPAL:
        return '🔵';
      case PaymentMethod.BANK_TRANSFER:
        return '🏦';
      case PaymentMethod.CRYPTO:
        return '₿';
      default:
        return '💳';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search payments..."
              className="pl-10"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={selectedStatus} onValueChange={(value) => onStatusFilter(value as PaymentStatus | 'ALL')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.value !== 'ALL' && (
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(option.value as PaymentStatus).split(' ')[0]}`} />
                      )}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-400" />
            <Select value={selectedMethod} onValueChange={(value) => onMethodFilter(value as PaymentMethod | 'ALL')}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                {methodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.value !== 'ALL' && (
                        <span className="text-sm">{getMethodIcon(option.value as PaymentMethod)}</span>
                      )}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              onStatusFilter('ALL');
              onMethodFilter('ALL');
              onSearch('');
            }}
            className="whitespace-nowrap"
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentFilters; 