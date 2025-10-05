import React from 'react';
import UserServiceRequestContainer from '@/components/modules/DadhboardModules/USER/ServiceRequest/UserServiceRequestContainer';

export default function UserServiceRequestPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Service Requests</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage your service requests
        </p>
      </div>
      <UserServiceRequestContainer />
    </div>
  );
} 