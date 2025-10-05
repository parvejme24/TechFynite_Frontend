import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Purchase, PurchaseStatus } from '@/types/purchase';
import { 
  Download, 
  Eye, 
  Calendar, 
  DollarSign,
  Key,
  ExternalLink,
  ShoppingCart
} from 'lucide-react';
import Image from 'next/image';

interface PurchaseListProps {
  purchases: Purchase[];
}

const PurchaseList: React.FC<PurchaseListProps> = ({ purchases }) => {
  const getStatusBadge = (status: PurchaseStatus) => {
    const statusConfig = {
      [PurchaseStatus.COMPLETED]: {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        label: 'Completed'
      },
      [PurchaseStatus.PENDING]: {
        variant: 'secondary' as const,
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
        label: 'Pending'
      },
      [PurchaseStatus.CANCELLED]: {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        label: 'Cancelled'
      },
      [PurchaseStatus.REFUNDED]: {
        variant: 'outline' as const,
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        label: 'Refunded'
      }
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = (purchase: Purchase) => {
    if (purchase.downloadUrl) {
      window.open(purchase.downloadUrl, '_blank');
    }
  };

  const handleViewDetails = (purchase: Purchase) => {
    // Navigate to purchase details page
    console.log('View details for purchase:', purchase.id);
  };

  if (purchases.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No purchases found</h3>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {purchases.map((purchase) => (
        <Card key={purchase.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Template Image */}
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={purchase.templateImage}
                    alt={purchase.templateName}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Purchase Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {purchase.templateName}
                      </h3>
                      {getStatusBadge(purchase.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>${purchase.templatePrice}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(purchase.purchaseDate)}</span>
                      </div>
                      {purchase.licenseKey && (
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          <span className="font-mono text-xs">{purchase.licenseKey}</span>
                        </div>
                      )}
                    </div>

                    {purchase.expiresAt && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        License expires: {formatDate(purchase.expiresAt)}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(purchase)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Details
                    </Button>
                    
                    {purchase.status === PurchaseStatus.COMPLETED && purchase.downloadUrl && (
                      <Button
                        size="sm"
                        onClick={() => handleDownload(purchase)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    )}
                    
                    {purchase.status === PurchaseStatus.PENDING && (
                      <Button
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Complete Payment
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

export default PurchaseList; 