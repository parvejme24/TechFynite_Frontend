"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FiMail,
  FiUsers,
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiTrash2,
  FiMessageSquare,
  FiTrendingUp,
  FiTrendingDown,
  FiMoreVertical,
  FiEye,
  FiSend,
} from "react-icons/fi";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Image from "next/image";
import { useContact } from "@/hooks/useContactApi";

export default function ContactContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const {
    allContacts = [],
    isLoadingAllContacts,
    allContactsError,
    deleteContact,
    isDeleting,
    stats,
    sendReply,
    isSendingReply,
    isLoadingStats,
    refetchAllContacts,
    contactsPagination,
  } = useContact({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchTerm,
  });

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Use allContacts directly since search is now handled server-side
  const filteredContacts = allContacts;

  const handleRefresh = async () => {
    try {
      await refetchAllContacts();
      toast.success("Contact list refreshed!");
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Failed to refresh contacts");
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
      await deleteContact(id);

      Swal.fire({
        title: "Deleted!",
        text: "The contact has been deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error("Delete error:", error);

      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to delete contact. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = () => {
    const csvContent = [
      [
        "Name",
        "Email",
        "Company",
        "Service",
        "Budget",
        "Project Details",
        "Date",
      ],
      ...filteredContacts.map((contact) => [
        contact.fullName,
        contact.email,
        contact.companyName,
        contact.serviceRequired,
        contact.budget,
        contact.projectDetails.replace(/,/g, ";"), // Replace commas to avoid CSV issues
        new Date(contact.createdAt).toLocaleDateString(),
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

  const getServiceBadge = (service: string) => {
    const colors = {
      "web-development":
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "mobile-app":
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "ui-ux-design":
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "digital-marketing":
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      seo: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      maintenance: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      consulting:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    };
    return (
      <Badge
        className={
          colors[service as keyof typeof colors] || colors["web-development"]
        }
      >
        {service.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </Badge>
    );
  };

  // Show loading state
  if (isLoadingAllContacts || isLoadingStats) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading contacts...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (allContactsError && (!allContacts || allContacts.length === 0)) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">
              Error loading service requests
            </div>
            <div className="text-gray-600 dark:text-gray-400 mb-6">
              <p>Failed to load service requests. Please try again.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Service Requests
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and view all service requests from clients
              </p>
              {allContactsError && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md">
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Service requests temporarily unavailable
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="cursor-pointer"
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Refresh
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-[#1A1D37]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requests
              </CardTitle>
              <FiUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalContacts || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#1A1D37]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <FiMail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats?.recentContacts?.length || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#1A1D37]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              {stats?.monthlyGrowth && stats.monthlyGrowth >= 0 ? (
                <FiTrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <FiTrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  stats?.monthlyGrowth && stats.monthlyGrowth >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stats?.monthlyGrowth
                  ? `${stats.monthlyGrowth.toFixed(1)}%`
                  : "0%"}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#1A1D37]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Requests
              </CardTitle>
              <FiMessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {
                  filteredContacts.filter((contact) => {
                    const contactDate = new Date(contact.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return contactDate > weekAgo;
                  }).length
                }
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
        </div>

        {/* Contacts Table */}
        <Card className="bg-white dark:bg-[#1A1D37]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Service Requests (
                {contactsPagination?.total || filteredContacts.length} total)
                {contactsPagination && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Page {currentPage} of {contactsPagination.totalPages})
                  </span>
                )}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredContacts.length === 0 ? (
              <div className="text-center py-8">
                <FiMail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">
                  {allContactsError 
                    ? "Service temporarily unavailable" 
                    : "No service requests found"
                  }
                </h3>
                <p className="text-gray-500">
                  {allContactsError 
                    ? "Please try again later"
                    : searchTerm
                    ? "Try adjusting your search terms"
                    : "No service requests have been submitted yet"
                  }
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
                        Service
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Budget
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Company
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {contact.user?.profile?.avatarUrl ? (
                              <Image
                                src={contact.user.profile.avatarUrl}
                                alt={contact.fullName}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full mr-3 object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mr-3 flex items-center justify-center text-white font-semibold text-sm">
                                {contact.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {contact.fullName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {contact.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getServiceBadge(contact.serviceRequired)}
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {contact.budget}
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {contact.companyName}
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={actionLoading === contact.id}
                                className="cursor-pointer"
                              >
                                {actionLoading === contact.id ? (
                                  <FiRefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <FiMoreVertical className="w-4 h-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>
                                Contact Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  // View contact details
                                  Swal.fire({
                                    title: "Contact Details",
                                    html: `
                                      <div class="text-left">
                                        <p><strong>Name:</strong> ${
                                          contact.fullName
                                        }</p>
                                        <p><strong>Email:</strong> ${
                                          contact.email
                                        }</p>
                                        <p><strong>Company:</strong> ${
                                          contact.companyName
                                        }</p>
                                        <p><strong>Service:</strong> ${
                                          contact.serviceRequired
                                        }</p>
                                        <p><strong>Budget:</strong> ${
                                          contact.budget
                                        }</p>
                                        <p><strong>Date:</strong> ${new Date(
                                          contact.createdAt
                                        ).toLocaleDateString()}</p>
                                        <hr class="my-3">
                                        <p><strong>Project Details:</strong></p>
                                        <p class="text-sm text-gray-600">${
                                          contact.projectDetails
                                        }</p>
                                      </div>
                                    `,
                                    width: "600px",
                                    confirmButtonText: "Close",
                                  });
                                }}
                                className="cursor-pointer"
                              >
                                <FiEye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  // Reply to contact
                                  Swal.fire({
                                    title: "Reply to Contact",
                                    html: `
                                      <div class="text-left">
                                        <p class="mb-3">Replying to: <strong>${
                                          contact.fullName
                                        }</strong> (${contact.email})</p>
                                        <input id="reply-subject" class="swal2-input" placeholder="Subject" value="Re: ${contact.projectDetails.substring(
                                          0,
                                          50
                                        )}..." style="margin-bottom: 10px;">
                                        <textarea id="reply-message" class="swal2-textarea" placeholder="Your message..." style="margin-bottom: 10px; height: 100px;"></textarea>
                                      </div>
                                    `,
                                    focusConfirm: false,
                                    showCancelButton: true,
                                    confirmButtonText: "Send Reply",
                                    cancelButtonText: "Cancel",
                                    preConfirm: () => {
                                      const subject = (
                                        document.getElementById(
                                          "reply-subject"
                                        ) as HTMLInputElement
                                      )?.value;
                                      const message = (
                                        document.getElementById(
                                          "reply-message"
                                        ) as HTMLTextAreaElement
                                      )?.value;

                                      if (!subject || !message) {
                                        Swal.showValidationMessage(
                                          "Please fill in both subject and message"
                                        );
                                        return false;
                                      }

                                      return { subject, message };
                                    },
                                  }).then(async (result) => {
                                    if (result.isConfirmed) {
                                      try {
                                        await sendReply(
                                          contact.id,
                                          result.value
                                        );
                                        Swal.fire({
                                          title: "Reply Sent!",
                                          text: "Your reply has been sent successfully.",
                                          icon: "success",
                                          timer: 2000,
                                          showConfirmButton: false,
                                        });
                                      } catch (error: any) {
                                        console.error("Reply error:", error);
                                        Swal.fire({
                                          title: "Error!",
                                          text:
                                            error?.message ||
                                            "Failed to send reply. Please try again.",
                                          icon: "error",
                                          confirmButtonText: "OK",
                                        });
                                      }
                                    }
                                  });
                                }}
                                className="cursor-pointer"
                              >
                                <FiSend className="w-4 h-4 mr-2" />
                                Reply
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(contact.id)}
                                disabled={actionLoading === contact.id}
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

            {/* Pagination Controls */}
            {contactsPagination && contactsPagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, contactsPagination.total)}{" "}
                  of {contactsPagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="cursor-pointer"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.min(5, contactsPagination.totalPages) },
                      (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={
                              currentPage === pageNum ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(contactsPagination.totalPages, prev + 1)
                      )
                    }
                    disabled={currentPage === contactsPagination.totalPages}
                    className="cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
