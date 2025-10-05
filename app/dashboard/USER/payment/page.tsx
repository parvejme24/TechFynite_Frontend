import React from 'react';
import PaymentContainer from '@/components/modules/DadhboardModules/USER/Payment/PaymentContainer';

export default function PaymentPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment History</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View payment history, status, and manage payments
        </p>
      </div>
      <PaymentContainer />
    </div>
  );
}
