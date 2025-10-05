import React from 'react';
import PurchasesContainer from '@/components/modules/DadhboardModules/USER/Purchases/PurchasesContainer';

export default function PurchasesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Purchases</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage your template purchases
        </p>
      </div>
      <PurchasesContainer />
    </div>
  );
}
