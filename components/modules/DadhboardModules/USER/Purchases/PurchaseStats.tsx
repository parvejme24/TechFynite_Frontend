"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Purchase, PurchaseStatus } from '@/types/purchase';
import { 
  ShoppingCart, 
  DollarSign, 
  Key, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface PurchaseStatsProps {
  purchases: Purchase[];
}

const PurchaseStats: React.FC<PurchaseStatsProps> = ({ purchases }) => {
  const totalPurchases = purchases.length;
  const totalSpent = purchases
    .filter(p => p.status === PurchaseStatus.COMPLETED)
    .reduce((sum, p) => sum + p.templatePrice, 0);
  const activeLicenses = purchases
    .filter(p => p.status === PurchaseStatus.COMPLETED && p.licenseKey)
    .length;
  const pendingPayments = purchases
    .filter(p => p.status === PurchaseStatus.PENDING)
    .length;

  const stats = [
    {
      title: 'Total Purchases',
      value: totalPurchases,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Total Spent',
      value: `$${totalSpent.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Active Licenses',
      value: activeLicenses,
      icon: Key,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Pending Payments',
      value: pendingPayments,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {index === 1 ? 'Lifetime spending' : 
               index === 2 ? 'Valid licenses' : 
               index === 3 ? 'Awaiting payment' : 'All time'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PurchaseStats; 