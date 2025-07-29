"use client";

import React, { useState } from 'react';
import { useNewsletterSubscribers, useNewsletterCount } from '@/hooks/useNewsletterApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiMail, FiUsers, FiSearch, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'sonner';

// Skeleton Components
const StatsCardSkeleton = () => (
  <Card className='bg-white dark:bg-[#1A1D37]'>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 w-24 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
      <div className="h-4 w-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
    </CardHeader>
    <CardContent>
      <div className="h-8 w-16 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
    </CardContent>
  </Card>
);

const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100 dark:border-gray-800">
    <td className="py-3 px-4">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-full mr-3 animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
        <div className="h-4 w-32 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
      </div>
    </td>
    <td className="py-3 px-4">
      <div className="h-4 w-20 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-6 w-16 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-full animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-4 w-20 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-4 w-20 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
    </td>
  </tr>
);

const NewsletterSkeleton = () => (
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

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
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
                  <th className="text-left py-3 px-4">
                    <div className="h-4 w-16 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                  </th>
                  <th className="text-left py-3 px-4">
                    <div className="h-4 w-12 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                  </th>
                  <th className="text-left py-3 px-4">
                    <div className="h-4 w-16 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                  </th>
                  <th className="text-left py-3 px-4">
                    <div className="h-4 w-24 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                  </th>
                  <th className="text-left py-3 px-4">
                    <div className="h-4 w-20 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <TableRowSkeleton key={index} />
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

export default function NewsletterContainer() {
  const { data: subscribers = [], isLoading, error, refetch } = useNewsletterSubscribers();
  const { data: count } = useNewsletterCount();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter subscribers based on search term and status
  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (subscriber.name && subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || subscriber.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = () => {
    refetch();
    toast.success('Subscriber list refreshed!');
  };

  const handleExport = () => {
    const csvContent = [
      ['Email', 'Name', 'Status', 'Subscribed Date'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.name || 'Anonymous',
        sub.status,
        new Date(sub.subscribedAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Subscriber list exported!');
  };

  // Show skeleton while loading
  if (isLoading) {
    return <NewsletterSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">Error loading newsletter subscribers</div>
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
                Newsletter Subscribers
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and view all newsletter subscribers
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleRefresh} variant="outline" className="cursor-pointer">
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 cursor-pointer">
                <FiDownload className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className='bg-white dark:bg-[#1A1D37]'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <FiUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count?.total || 0}</div>
            </CardContent>
          </Card>
          <Card className='bg-white dark:bg-[#1A1D37]'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
              <FiMail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{count?.active || 0}</div>
            </CardContent>
          </Card>
          <Card className='bg-white dark:bg-[#1A1D37]'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Subscribers</CardTitle>
              <FiMail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{count?.inactive || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by email or name..."
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
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Subscribers Table */}
        <Card className='bg-white dark:bg-[#1A1D37]'>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Subscriber List ({filteredSubscribers.length} of {subscribers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSubscribers.length === 0 ? (
              <div className="text-center py-8">
                <FiMail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No subscribers found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'No newsletter subscribers yet'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Subscribed Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {subscriber.avatar_url ? (
                              <img 
                                src={subscriber.avatar_url} 
                                alt={subscriber.name || 'User'} 
                                className="w-8 h-8 rounded-full mr-3"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-3 flex items-center justify-center">
                                <FiMail className="w-4 h-4 text-gray-500" />
                              </div>
                            )}
                            <span className="font-medium text-gray-900 dark:text-white">{subscriber.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {subscriber.name || 'Anonymous'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={subscriber.status === 'subscribed' ? 'default' : 'secondary'}
                            className={
                              subscriber.status === 'subscribed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }
                          >
                            {subscriber.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {new Date(subscriber.lastChanged).toLocaleDateString()}
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
    </div>
  );
}
