"use client";

import { AuthContext } from "@/Providers/AuthProvider";
import { UserRole } from "@/types/user";
import React, { useContext } from "react";
import { useContactApi } from "@/hooks/useContactApi";
import ServiceRequestContainer from "@/components/modules/DadhboardModules/ADMIN/ServiceRequest/ServiceRequestContainer";
import UserServiceRequestContainer from "@/components/modules/DadhboardModules/USER/ServiceRequest/UserServiceRequestContainer";

export default function ServiceRequestPage() {
  const { user } = useContext(AuthContext) || {};
  const role = (user as { role?: UserRole })?.role;
  const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
  const isUser = role === UserRole.USER;

  const contactApi = useContactApi();
  const { data, isLoading } = contactApi.getAllContacts({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <div>
      {isAdmin ? (
        <ServiceRequestContainer />
      ) : isUser ? (
        <UserServiceRequestContainer />
      ) : (
        <div className="min-h-screen py-8">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-gray-600 dark:text-gray-400">
                You don't have permission to access this page.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
