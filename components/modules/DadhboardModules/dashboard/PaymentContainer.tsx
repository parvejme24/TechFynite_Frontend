"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FiSearch, FiDollarSign, FiCalendar, FiCheckCircle, FiClock } from "react-icons/fi";

type PaymentStatus = "completed" | "pending" | "failed";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  templateTitle: string;
  gateway: string;
  status: PaymentStatus;
  paidAt: string;
}

export default function PaymentContainer() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | PaymentStatus>("all");

  useEffect(() => {
    // In a real app, fetch from API here
    const mock: Payment[] = [
      {
        id: "pay_1",
        amount: 55,
        currency: "USD",
        templateTitle: "Eduleb - Education & LMS React Next.js Template",
        gateway: "LemonSqueezy",
        status: "completed",
        paidAt: new Date().toISOString(),
      },
      {
        id: "pay_2",
        amount: 45,
        currency: "USD",
        templateTitle: "Modern Portfolio - React Next.js Template",
        gateway: "LemonSqueezy",
        status: "pending",
        paidAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    setPayments(mock);
    setLoading(false);
  }, []);

  const filtered = payments.filter((p) => {
    const matchText = (
      p.templateTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.gateway.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchText && matchStatus;
  });

  const statusBadge = (status: PaymentStatus) => {
    if (status === "completed") {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          Completed
        </Badge>
      );
    }
    if (status === "pending") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          Pending
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Failed</Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{payments.length}</p>
              </div>
              <FiDollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {payments.filter((p) => p.status === "completed").length}
                </p>
              </div>
              <FiCheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {payments.filter((p) => p.status === "pending").length}
                </p>
              </div>
              <FiClock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${payments.reduce((sum, p) => sum + p.amount, 0)}
                </p>
              </div>
              <FiDollarSign className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-600 dark:text-gray-400">
            No payments found
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Card key={p.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold line-clamp-2">
                  {p.templateTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FiDollarSign className="w-4 h-4" /> ${p.amount} {p.currency}
                  </span>
                  {statusBadge(p.status)}
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" />
                  {new Date(p.paidAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">Gateway: {p.gateway}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}



