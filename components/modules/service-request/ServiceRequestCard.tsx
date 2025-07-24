import React from "react";
import { Contact } from "./ServiceRequestContainer";

interface ServiceRequestCardProps {
  contact: Contact;
}

export default function ServiceRequestCard({ contact }: ServiceRequestCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-5 flex flex-col gap-2">
      <div className="flex flex-col gap-1 mb-2">
        <span className="font-semibold text-lg">{contact.fullName}</span>
        <span className="text-xs text-gray-500 dark:text-gray-300">{contact.email}</span>
        <span className="text-xs text-gray-500 dark:text-gray-300">{contact.companyName}</span>
      </div>
      <div className="flex flex-wrap gap-2 text-xs mb-2">
        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">{contact.serviceRequred}</span>
        <span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">{contact.budget}</span>
        <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">{contact.createdAt ? new Date(contact.createdAt).toISOString().slice(0, 10) : ""}</span>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-200 line-clamp-5">
        {contact.projectDetails}
      </div>
    </div>
  );
}
