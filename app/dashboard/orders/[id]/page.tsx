"use client";

import { AuthContext } from "@/Providers/AuthProvider";
import { UserRole } from "@/types/user";
import React, { useContext } from "react";
import OrderDetailsContainer from "@/components/modules/DadhboardModules/Orders/OrderDetailsContainer";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { user } = useContext(AuthContext) || {};
  const role = (user as { role?: UserRole })?.role;
  const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
  const isUser = role === UserRole.USER;

  // Handle async params for Next.js 15
  const [orderId, setOrderId] = React.useState<string>("");

  React.useEffect(() => {
    if (params instanceof Promise) {
      params.then((resolvedParams) => {
        setOrderId(resolvedParams.id);
      });
    } else {
      setOrderId(params.id);
    }
  }, [params]);

  if (!orderId) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#0F5BBD] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      {isAdmin || isUser ? (
        <OrderDetailsContainer orderId={orderId} />
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
