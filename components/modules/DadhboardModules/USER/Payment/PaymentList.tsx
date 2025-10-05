import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Payment, PaymentStatus, PaymentMethod } from '@/types/purchase';
import { 
  CreditCard, 
  Eye, 
  Calendar, 
  DollarSign,
  Receipt,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

interface PaymentListProps {
  payments: Payment[];
  onMakePayment: (payment: Payment) => void;
}

const PaymentList: React.FC<PaymentListProps> = ({ payments, onMakePayment }) => {
  const getStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      [PaymentStatus.COMPLETED]: {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        label: 'Completed',
        icon: CheckCircle
      },
      [PaymentStatus.PENDING]: {
        variant: 'secondary' as const,
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
        label: 'Pending',
        icon: Clock
      },
      [PaymentStatus.FAILED]: {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        label: 'Failed',
        icon: AlertCircle
      },
      [PaymentStatus.REFUNDED]: {
        variant: 'outline' as const,
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        label: 'Refunded',
        icon: RefreshCw
      }
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.className}>
        <config.icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
        return '💳';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewReceipt = (payment: Payment) => {
    if (payment.receiptUrl) {
      window.open(payment.receiptUrl, '_blank');
    }
  };

  const handleViewDetails = (payment: Payment) => {
    // Navigate to payment details page
    console.log('View details for payment:', payment.id);
  };

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No payments found</h3>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Payment Method Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl">
                  {getMethodIcon(payment.method)}
                </div>
              </div>

              {/* Payment Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {payment.description}
                      </h3>
                      {getStatusBadge(payment.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{payment.currency} {payment.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(payment.paymentDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-mono text-xs">{payment.transactionId}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Payment ID: {payment.id} | Purchase ID: {payment.purchaseId}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(payment)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Details
                    </Button>
                    
                    {payment.status === PaymentStatus.COMPLETED && payment.receiptUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReceipt(payment)}
                        className="flex items-center gap-2"
                      >
                        <Receipt className="h-4 w-4" />
                        Receipt
                      </Button>
                    )}
                    
                    {payment.status === PaymentStatus.PENDING && (
                      <Button
                        size="sm"
                        onClick={() => onMakePayment(payment)}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Complete Payment
                      </Button>
                    )}
                    
                    {payment.status === PaymentStatus.FAILED && (
                      <Button
                        size="sm"
                        onClick={() => onMakePayment(payment)}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Retry Payment
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PaymentList; 