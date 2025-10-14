"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FiPlus,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiPause,
  FiMessageSquare,
  FiSend,
  FiEye,
} from "react-icons/fi";
import { toast } from "sonner";
import Swal from "sweetalert2";
import {
  ServiceRequest,
  ServiceRequestStatus,
  ServiceRequestPriority,
  ServiceRequestType,
  CreateServiceRequestData,
} from "@/types/serviceRequest";

// Mock data for user's service requests
const mockUserRequests: ServiceRequest[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    userPhone: "+1234567890",
    company: "Tech Corp",
    projectType: ServiceRequestType.WEBSITE_DEVELOPMENT,
    projectName: "E-commerce Website",
    description: "Need a modern e-commerce website with payment integration, user authentication, and inventory management system",
    budget: "$10,000 - $15,000",
    timeline: "3-4 months",
    status: ServiceRequestStatus.PENDING,
    priority: ServiceRequestPriority.HIGH,
    assignedTo: "admin1",
    estimatedCompletion: "2024-06-01",
    replies: [
      {
        id: "reply1",
        serviceRequestId: "1",
        userId: "admin1",
        userName: "Admin User",
        userEmail: "admin@techfynite.com",
        message: "Thank you for your service request. We'll review it and get back to you within 24 hours.",
        isAdminReply: true,
        createdAt: "2024-01-16T10:00:00Z",
        updatedAt: "2024-01-16T10:00:00Z",
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    userPhone: "+1234567890",
    company: "Tech Corp",
    projectType: ServiceRequestType.UI_UX_DESIGN,
    projectName: "Mobile App Design",
    description: "UI/UX design for a mobile banking application with modern interface, user-friendly navigation, and accessibility features",
    budget: "$5,000 - $8,000",
    timeline: "2-3 months",
    status: ServiceRequestStatus.IN_PROGRESS,
    priority: ServiceRequestPriority.MEDIUM,
    assignedTo: "admin2",
    estimatedCompletion: "2024-05-01",
    replies: [],
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
  },
];

export default function UserServiceRequestContainer() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userRequests, setUserRequests] = useState<ServiceRequest[]>(mockUserRequests);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateServiceRequestData>({
    projectType: ServiceRequestType.WEBSITE_DEVELOPMENT,
    projectName: "",
    description: "",
    budget: "",
    timeline: "",
    priority: ServiceRequestPriority.MEDIUM,
    userPhone: "",
    company: "",
  });

  const handleInputChange = (field: keyof CreateServiceRequestData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newRequest: ServiceRequest = {
        id: Date.now().toString(),
        userId: "user1",
        userName: "John Doe",
        userEmail: "john@example.com",
        userPhone: formData.userPhone,
        company: formData.company,
        projectType: formData.projectType,
        projectName: formData.projectName,
        description: formData.description,
        budget: formData.budget,
        timeline: formData.timeline,
        status: ServiceRequestStatus.PENDING,
        priority: formData.priority,
        replies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUserRequests(prev => [newRequest, ...prev]);
      setFormData({
        projectType: ServiceRequestType.WEBSITE_DEVELOPMENT,
        projectName: "",
        description: "",
        budget: "",
        timeline: "",
        priority: ServiceRequestPriority.MEDIUM,
        userPhone: "",
        company: "",
      });
      setShowCreateForm(false);

      toast.success("Service request submitted successfully!");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit service request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: ServiceRequestStatus) => {
    const statusConfig = {
      [ServiceRequestStatus.PENDING]: {
        icon: FiClock,
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        label: "Pending",
      },
      [ServiceRequestStatus.IN_PROGRESS]: {
        icon: FiAlertCircle,
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        label: "In Progress",
      },
      [ServiceRequestStatus.COMPLETED]: {
        icon: FiCheckCircle,
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        label: "Completed",
      },
      [ServiceRequestStatus.CANCELLED]: {
        icon: FiXCircle,
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        label: "Cancelled",
      },
      [ServiceRequestStatus.ON_HOLD]: {
        icon: FiPause,
        className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
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
      [ServiceRequestPriority.LOW]: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      [ServiceRequestPriority.MEDIUM]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      [ServiceRequestPriority.HIGH]: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      [ServiceRequestPriority.URGENT]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return (
      <Badge className={priorityConfig[priority]}>
        {priority}
      </Badge>
    );
  };

  const getProjectTypeBadge = (type: ServiceRequestType) => {
    const typeConfig = {
      [ServiceRequestType.WEBSITE_DEVELOPMENT]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      [ServiceRequestType.MOBILE_APP]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      [ServiceRequestType.UI_UX_DESIGN]: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      [ServiceRequestType.CONSULTATION]: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      [ServiceRequestType.MAINTENANCE]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      [ServiceRequestType.OTHER]: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };

    return (
      <Badge className={typeConfig[type]}>
        {type.replace(/_/g, " ")}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Service Requests
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track and manage your service requests
              </p>
            </div>
              <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
              <FiPlus className="w-4 h-4 mr-2" />
              New Request
              </Button>
          </div>
        </div>

        {/* Create Request Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Create New Service Request</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Project Type *
                      </label>
                      <Select
                        value={formData.projectType}
                        onValueChange={(value) => handleInputChange("projectType", value as ServiceRequestType)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ServiceRequestType.WEBSITE_DEVELOPMENT}>
                            Website Development
                          </SelectItem>
                          <SelectItem value={ServiceRequestType.MOBILE_APP}>
                            Mobile App
                          </SelectItem>
                          <SelectItem value={ServiceRequestType.UI_UX_DESIGN}>
                            UI/UX Design
                          </SelectItem>
                          <SelectItem value={ServiceRequestType.CONSULTATION}>
                            Consultation
                          </SelectItem>
                          <SelectItem value={ServiceRequestType.MAINTENANCE}>
                            Maintenance
                          </SelectItem>
                          <SelectItem value={ServiceRequestType.OTHER}>
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Priority *
                      </label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => handleInputChange("priority", value as ServiceRequestPriority)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ServiceRequestPriority.LOW}>Low</SelectItem>
                          <SelectItem value={ServiceRequestPriority.MEDIUM}>Medium</SelectItem>
                          <SelectItem value={ServiceRequestPriority.HIGH}>High</SelectItem>
                          <SelectItem value={ServiceRequestPriority.URGENT}>Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Project Name *
                    </label>
                    <Input
                      value={formData.projectName}
                      onChange={(e) => handleInputChange("projectName", e.target.value)}
                      placeholder="Enter project name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description *
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe your project requirements in detail"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Budget
                      </label>
                      <Input
                        value={formData.budget}
                        onChange={(e) => handleInputChange("budget", e.target.value)}
                        placeholder="e.g., $5,000 - $10,000"
                      />
              </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Timeline
                      </label>
                      <Input
                        value={formData.timeline}
                        onChange={(e) => handleInputChange("timeline", e.target.value)}
                        placeholder="e.g., 2-3 months"
                      />
              </div>
              </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone Number
                      </label>
                      <Input
                        value={formData.userPhone}
                        onChange={(e) => handleInputChange("userPhone", e.target.value)}
                        placeholder="+1234567890"
                        type="tel"
                      />
        </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Company
                      </label>
            <Input
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Your company name"
            />
          </div>
        </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.projectName || !formData.description}
                      className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <FiClock className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FiSend className="w-4 h-4 mr-2" />
                          Submit Request
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      className="cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Service Requests List */}
        <div className="space-y-6">
          {userRequests.length === 0 ? (
        <Card className="bg-white dark:bg-[#1A1D37]">
              <CardContent className="text-center py-12">
                <FiMessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No service requests yet</h3>
                <p className="text-gray-500 mb-4">
                  Submit your first service request to get started
                </p>
                  <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                  <FiPlus className="w-4 h-4 mr-2" />
                  Create First Request
                  </Button>
              </CardContent>
            </Card>
          ) : (
            userRequests.map((request) => (
              <Card key={request.id} className="bg-white dark:bg-[#1A1D37]">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-xl">{request.projectName}</CardTitle>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {request.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(request.status)}
                      {getPriorityBadge(request.priority)}
                      {getProjectTypeBadge(request.projectType)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Budget</label>
                      <p className="text-gray-900 dark:text-white">
                        {request.budget || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Timeline</label>
                      <p className="text-gray-900 dark:text-white">
                        {request.timeline || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Replies Section */}
                  {request.replies && request.replies.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3 flex items-center">
                        <FiMessageSquare className="w-4 h-4 mr-2" />
                        Admin Replies ({request.replies.length})
                      </h4>
                      <div className="space-y-3">
                        {request.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className={`p-3 rounded-lg ${
                              reply.isAdminReply
                                ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                                : "bg-gray-50 dark:bg-gray-800/50"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <span className="font-medium text-sm">
                                  {reply.userName}
                                </span>
                                {reply.isAdminReply && (
                                  <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                                    Admin
                                  </Badge>
                )}
              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {reply.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                            <Button
                      variant="outline"
                              size="sm"
                              onClick={() => {
                        Swal.fire({
                          title: "Service Request Details",
                          html: `
                            <div class="text-left">
                              <table class="w-full border-collapse border border-gray-300 dark:border-gray-600">
                                <tr class="border-b border-gray-200 dark:border-gray-700">
                                  <td class="p-3 font-semibold bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600">Client Name</td>
                                  <td class="p-3">${request.userName}</td>
                                </tr>
                                <tr class="border-b border-gray-200 dark:border-gray-700">
                                  <td class="p-3 font-semibold bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600">Email</td>
                                  <td class="p-3">${request.userEmail}</td>
                                </tr>
                                <tr class="border-b border-gray-200 dark:border-gray-700">
                                  <td class="p-3 font-semibold bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600">Company Name</td>
                                  <td class="p-3">${request.company || 'Not provided'}</td>
                                </tr>
                                <tr class="border-b border-gray-200 dark:border-gray-700">
                                  <td class="p-3 font-semibold bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600">Budget</td>
                                  <td class="p-3">${request.budget || 'Not specified'}</td>
                                </tr>
                                <tr class="border-b border-gray-200 dark:border-gray-700">
                                  <td class="p-3 font-semibold bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600">Service Required</td>
                                  <td class="p-3">${request.projectType.replace(/_/g, ' ')}</td>
                                </tr>
                                <tr>
                                  <td class="p-3 font-semibold bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 align-top">Project Details</td>
                                  <td class="p-3">${request.description}</td>
                                </tr>
                              </table>
                            </div>
                          `,
                          width: "800px",
                          confirmButtonText: "Close",
                        });
                      }}
                      className="cursor-pointer"
                    >
                      <FiEye className="w-4 h-4 mr-2" />
                      View Details
                            </Button>
                          </div>
          </CardContent>
        </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}