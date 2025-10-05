"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiSearch, FiRefreshCw, FiFilter, FiCalendar, FiUser, FiMail, FiHome, FiSend } from 'react-icons/fi';
import { toast } from 'sonner';
import EmailModal from './EmailModal';

// Skeleton Components
const ServiceRequestSkeleton = () => (
  <div className="min-h-screen py-8">
    <div className="container mx-auto max-w-7xl px-4">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-64 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded mb-2 animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
            <div className="h-4 w-80 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
            <div className="h-10 w-28 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="h-10 w-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
        </div>
        <div className="h-10 w-32 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
      </div>

      {/* Table Skeleton */}
      <Card className='bg-white dark:bg-[#1A1D37]'>
        <CardHeader>
          <div className="h-6 w-48 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {[...Array(7)].map((_, index) => (
                    <th key={index} className="text-left py-3 px-4">
                      <div className="h-4 w-16 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                    {[...Array(7)].map((_, cellIndex) => (
                      <td key={cellIndex} className="py-3 px-4">
                        <div className="h-4 w-20 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
    <style jsx>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .animate-shimmer { animation: shimmer 2s infinite; }
    `}</style>
  </div>
);

export default function ServiceRequestContainer() {
  const { data: serviceRequests, isLoading, error, refetch } = useQuery({
    queryKey: ['serviceRequests', 'all'],
    queryFn: async () => {
      const res = await apiClient.get('/service-requests');
      return Array.isArray(res.data) ? res.data : [];
    },
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [emailModal, setEmailModal] = useState<{
    isOpen: boolean;
    clientEmail: string;
    clientName: string;
    requestId?: string;
  }>({
    isOpen: false,
    clientEmail: '',
    clientName: '',
    requestId: ''
  });

  // Ensure serviceRequests is always an array
  const requests = Array.isArray(serviceRequests) ? serviceRequests : [];

  // Filter service requests based on search term and status
  const filteredRequests = requests.filter((request) => {
    const matchesSearch = 
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.projectType.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Handle both uppercase and lowercase status values
    const requestStatus = request.status?.toLowerCase() || 'pending';
    const filterStatusLower = filterStatus.toLowerCase();
    const matchesStatus = filterStatus === 'all' || requestStatus === filterStatusLower;
    
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = () => {
    refetch();
    toast.success('Service request list refreshed!');
  };

  const handleSendEmail = (clientEmail: string, clientName: string, requestId?: string) => {
    setEmailModal({
      isOpen: true,
      clientEmail,
      clientName,
      requestId
    });
  };

  const closeEmailModal = () => {
    setEmailModal({
      isOpen: false,
      clientEmail: '',
      clientName: '',
      requestId: ''
    });
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || 'pending';
    switch (statusLower) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in-progress':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLower = status?.toLowerCase() || 'pending';
    switch (statusLower) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  // Show skeleton while loading
  if (isLoading) {
    return <ServiceRequestSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">Error loading service requests</div>
            <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Service Requests
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and view all service requests from clients
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleRefresh} variant="outline" className="cursor-pointer">
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className='bg-white dark:bg-[#1A1D37]'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FiFilter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
            </CardContent>
          </Card>
          <Card className='bg-white dark:bg-[#1A1D37]'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <FiCalendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {requests.filter(r => r.status?.toLowerCase() === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card className='bg-white dark:bg-[#1A1D37]'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <FiFilter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {requests.filter(r => {
                  const status = r.status?.toLowerCase();
                  return status === 'in-progress' || status === 'in_progress';
                }).length}
              </div>
            </CardContent>
          </Card>
          <Card className='bg-white dark:bg-[#1A1D37]'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <FiFilter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status?.toLowerCase() === 'completed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, email, company, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Service Requests Table */}
        <Card className='bg-white dark:bg-[#1A1D37]'>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Service Request List ({filteredRequests.length} of {requests.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <FiFilter className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No service requests found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'No service requests yet'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Client Info</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Project Details</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Service Required</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Budget</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mr-3 flex items-center justify-center">
                              <FiUser className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{request.userName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center">
                                <FiMail className="w-3 h-3 mr-1" />
                                {request.userEmail}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center">
                                <FiHome className="w-3 h-3 mr-1" />
                                {request.company || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                              {request.description}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {request.projectType}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {request.budget}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(request.status || 'pending')}>
                            {getStatusLabel(request.status || 'pending')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            onClick={() => handleSendEmail(request.userEmail, request.userName, request.id)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                          >
                            <FiSend className="w-3 h-3 mr-1" />
                            Send Email
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={emailModal.isOpen}
        onClose={closeEmailModal}
        clientEmail={emailModal.clientEmail}
        clientName={emailModal.clientName}
        requestId={emailModal.requestId}
      />
    </div>
  );
}
