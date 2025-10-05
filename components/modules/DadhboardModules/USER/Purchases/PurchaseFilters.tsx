import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PurchaseStatus } from '@/types/purchase';
import { Search, Filter } from 'lucide-react';

interface PurchaseFiltersProps {
  selectedStatus: PurchaseStatus | 'ALL';
  onStatusFilter: (status: PurchaseStatus | 'ALL') => void;
  onSearch: (searchTerm: string) => void;
}

const PurchaseFilters: React.FC<PurchaseFiltersProps> = ({
  selectedStatus,
  onStatusFilter,
  onSearch
}) => {
  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: PurchaseStatus.COMPLETED, label: 'Completed' },
    { value: PurchaseStatus.PENDING, label: 'Pending' },
    { value: PurchaseStatus.CANCELLED, label: 'Cancelled' },
    { value: PurchaseStatus.REFUNDED, label: 'Refunded' }
  ];

  const getStatusColor = (status: PurchaseStatus) => {
    switch (status) {
      case PurchaseStatus.COMPLETED:
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case PurchaseStatus.PENDING:
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case PurchaseStatus.CANCELLED:
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case PurchaseStatus.REFUNDED:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search purchases..."
              className="pl-10"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={selectedStatus} onValueChange={(value) => onStatusFilter(value as PurchaseStatus | 'ALL')}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.value !== 'ALL' && (
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(option.value as PurchaseStatus).split(' ')[0]}`} />
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

export default PurchaseFilters; 