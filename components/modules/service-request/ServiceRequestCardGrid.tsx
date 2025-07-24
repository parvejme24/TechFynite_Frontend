import React from "react";
import { Contact } from "./ServiceRequestContainer";
import ServiceRequestCard from "./ServiceRequestCard";

interface ServiceRequestCardGridProps {
  contacts: Contact[];
}

export default function ServiceRequestCardGrid({ contacts }: ServiceRequestCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {contacts.map((c) => (
        <ServiceRequestCard key={c.id} contact={c} />
      ))}
    </div>
  );
}
