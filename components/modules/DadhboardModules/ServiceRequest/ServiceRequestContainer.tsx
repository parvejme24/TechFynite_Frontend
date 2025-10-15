"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FiUsers,
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiTrash2,
  FiMessageSquare,
  FiMoreVertical,
  FiEye,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiPause,
} from "react-icons/fi";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ServiceRequest,
  ServiceRequestStatus,
  ServiceRequestPriority,
  ServiceRequestType,
} from "@/types/serviceRequest";
import { useContactApi } from "@/hooks/useContactApi";

// Calculate stats from API data
const calculateStats = (requests: any[]) => {
  return {
    totalRequests: requests.length,
    pendingRequests: requests.filter((r) => r.status === "PENDING").length,
    inProgressRequests: requests.filter((r) => r.status === "IN_PROGRESS")
      .length,
    completedRequests: requests.filter((r) => r.status === "COMPLETED").length,
    cancelledRequests: requests.filter((r) => r.status === "CANCELLED").length,
  };
};

export default function ServiceRequestContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Use contact API hook
  const contactApi = useContactApi();

  // Get mutations
  const [deleteContact] = contactApi.deleteContact();

  // Fetch data from API
  const {
    data: apiData,
    isLoading,
    error,
    refetch,
  } = contactApi.getAllContacts({
    page: currentPage,
    limit: 10,
    search: debouncedSearchTerm,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Transform contact data to service request format
  const transformedRequests = (apiData?.data || []).map((contact: any) => ({
    id: contact.id,
    clientName: contact.fullName,
    clientEmail: contact.email,
    company: contact.companyName,
    serviceType: contact.serviceRequired,
    budget: contact.budget,
    description: contact.projectDetails,
    status: contact.status || "PENDING",
    createdAt: contact.createdAt,
  }));

  const pagination = apiData?.pagination;

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Use transformed requests from API
  const filteredRequests = transformedRequests;
  const stats = calculateStats(transformedRequests);

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Service requests refreshed!");
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Failed to refresh service requests");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    setActionLoading(id);
    try {
      // Use the new API
      const result = await deleteContact(id).unwrap();

      if (result.success) {
        Swal.fire({
          title: "Deleted!",
          text: "The service request has been deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        // Refresh the data
        refetch();
      } else {
        throw new Error(result.message || "Failed to delete contact");
      }
    } catch (error: any) {
      console.error("Delete error:", error);

      Swal.fire({
        title: "Error!",
        text:
          error?.data?.message ||
          error?.message ||
          "Failed to delete service request. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReply = async (message: string) => {
    // Reply functionality disabled - backend endpoint not working
    toast.info("Reply functionality is currently disabled.");
  };

  const handleExport = () => {
    const csvContent = [
      [
        "Client Name",
        "Email",
        "Company",
        "Project Type",
        "Project Name",
        "Budget",
        "Timeline",
        "Status",
        "Priority",
        "Date",
      ],
      ...filteredRequests.map((request: any) => [
        request.clientName,
        request.clientEmail,
        request.company || "",
        request.serviceType,
        request.description,
        request.budget || "",
        "",
        "",
        "",
        "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `service-requests-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Service requests exported successfully!");
  };

  const getStatusBadge = (status: ServiceRequestStatus) => {
    const statusConfig = {
      [ServiceRequestStatus.PENDING]: {
        icon: FiClock,
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        label: "Pending",
      },
      [ServiceRequestStatus.IN_PROGRESS]: {
        icon: FiAlertCircle,
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        label: "In Progress",
      },
      [ServiceRequestStatus.COMPLETED]: {
        icon: FiCheckCircle,
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        label: "Completed",
      },
      [ServiceRequestStatus.CANCELLED]: {
        icon: FiXCircle,
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        label: "Cancelled",
      },
      [ServiceRequestStatus.ON_HOLD]: {
        icon: FiPause,
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
        label: "On Hold",
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: ServiceRequestPriority) => {
    const priorityConfig = {
      [ServiceRequestPriority.LOW]:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      [ServiceRequestPriority.MEDIUM]:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      [ServiceRequestPriority.HIGH]:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      [ServiceRequestPriority.URGENT]:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return <Badge className={priorityConfig[priority]}>{priority}</Badge>;
  };

  const getProjectTypeBadge = (type: ServiceRequestType) => {
    const typeConfig = {
      [ServiceRequestType.WEBSITE_DEVELOPMENT]:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      [ServiceRequestType.MOBILE_APP]:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      [ServiceRequestType.UI_UX_DESIGN]:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      [ServiceRequestType.CONSULTATION]:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      [ServiceRequestType.MAINTENANCE]:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      [ServiceRequestType.OTHER]:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };

    return (
      <Badge className={typeConfig[type]}>{type.replace(/_/g, " ")}</Badge>
    );
  };

  const ServiceDetailsModal = () => {
    if (!selectedRequest) return null;

    const serviceDetails = [
      { label: "Client Name", value: selectedRequest.clientName },
      { label: "Email", value: selectedRequest.clientEmail },
      { label: "Company", value: selectedRequest.company },
      { label: "Service Type", value: selectedRequest.serviceType },
      { label: "Budget", value: selectedRequest.budget },
      { label: "Project Details", value: selectedRequest.description },
    ];

    return (
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Service Request Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Field</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceDetails.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-semibold bg-gray-50 dark:bg-gray-800">
                      {detail.label}
                    </TableCell>
                    <TableCell className="whitespace-pre-wrap">
                      {detail.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-white dark:bg-[#1A1D37]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Skeleton */}
        <div className="mb-6">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <Card className="bg-white dark:bg-[#1A1D37]">
          <CardHeader>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Show loading skeleton
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Show warning for API errors
  const showApiWarning = error;

  return (
    <div className="min-h-screen py-8">
      <ServiceDetailsModal />
      <div className="container mx-auto max-w-7xl px-4">
        {/* API Warning Banner */}
        {showApiWarning && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  API Connection Issue
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Unable to fetch real data.
                  {(error as any)?.status === 401 &&
                    " Please login to access real data."}
                </p>
              </div>
              <div className="ml-auto">
                <Button
                  onClick={() => refetch()}
                  size="sm"
                  variant="outline"
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                >
                  <FiRefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Service Requests
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and track all service requests from clients
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="cursor-pointer"
                disabled={isLoading}
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                onClick={handleExport}
                className="bg-green-600 hover:bg-green-700 cursor-pointer"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white dark:bg-[#1A1D37]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requests
              </CardTitle>
              <FiUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRequests}</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#1A1D37]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <FiClock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingRequests}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#1A1D37]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <FiAlertCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.inProgressRequests}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#1A1D37]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <FiCheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.completedRequests}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#1A1D37]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <FiXCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.cancelledRequests}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, email, company, project name, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Service Requests Table */}
        <Card className="bg-white dark:bg-[#1A1D37]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Service Requests ({filteredRequests.length} total)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <FiMessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">
                  No service requests found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "No service requests have been submitted yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Client
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Company
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Service Type
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Budget
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Project Details
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request: any) => (
                      <tr
                        key={request.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mr-3 flex items-center justify-center text-white font-semibold text-sm">
                              {request.clientName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {request.clientName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {request.clientEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-700 dark:text-gray-300">
                            {request.company}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {request.serviceType}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {request.budget}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {request.description}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={actionLoading === request.id}
                                className="cursor-pointer"
                              >
                                <FiMoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>
                                Request Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsDetailsModalOpen(true);
                                }}
                                className="cursor-pointer"
                              >
                                <FiEye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(request.id)}
                                disabled={actionLoading === request.id}
                                className="text-red-600 cursor-pointer"
                              >
                                <FiTrash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
