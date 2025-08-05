import React from "react";
import ServiceRequestCard from "./ServiceRequestCard";

// Define a minimal Contact type for this component
type Contact = {
  id: string;
  name: string;
  email: string;
  // Add other fields as needed
};

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
