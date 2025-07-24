"use client"
import React, { useEffect, useState } from "react";
import ServiceRequestFilters from "./ServiceRequestFilters";
import ServiceRequestCardGrid from "./ServiceRequestCardGrid";
import ServiceRequestPagination from "./ServiceRequestPagination";

export type Contact = {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  serviceRequred: string;
  budget: string;
  createdAt?: string;
  projectDetails: string;
};

const PAGE_SIZE = 9;
const categories = [
  { value: "all", label: "All Categories" },
  { value: "web-development", label: "Web Development" },
  { value: "mobile-app", label: "Mobile App Development" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "seo", label: "SEO Services" },
  { value: "maintenance", label: "Website Maintenance" },
  { value: "consulting", label: "IT Consulting" },
];

export default function ServiceRequestContainer() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line
  }, [page, keyword, category, fromDate, toDate]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        pageSize: PAGE_SIZE,
        ...(keyword && { keyword }),
        ...(category && category !== "all" && { serviceRequred: category }),
        ...(fromDate && { fromDate }),
        ...(toDate && { toDate }),
      };
      const res = await fetch(
        `http://localhost:5000/api/v1/contact?${new URLSearchParams(params)}`
      );
      const data = await res.json();
      const contactsArr = Array.isArray(data)
        ? data
        : data.data || data.contacts || [];
      setContacts(contactsArr);
      setTotalPages(
        data.totalPages ||
          Math.ceil((data.total || contactsArr.length) / PAGE_SIZE) ||
          1
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [keyword, category, fromDate, toDate]);

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Service Requests</h2>
      <ServiceRequestFilters
        keyword={keyword}
        setKeyword={setKeyword}
        category={category}
        setCategory={setCategory}
        categories={categories}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
      />
      <div className="bg-white dark:bg-[#1A1D37] rounded shadow p-4 min-h-[300px]">
        {loading ? (
          <div>Loading...</div>
        ) : contacts.length === 0 ? (
          <div>No service requests found.</div>
        ) : (
          <ServiceRequestCardGrid contacts={contacts} />
        )}
      </div>
      <ServiceRequestPagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </div>
  );
}
