import ContactForm from "@/components/modules/contact/ContactForm/ContactForm";
import ContactOptions from "@/components/modules/contact/ContactOptions/ContactOptions";
import Newsletter from "@/components/shared/Newsletter/Newsletter";
import PageHeader from "@/components/shared/PageHeader/PageHeadere";
import React from "react";

export default function page() {
  return (
    <div>
      <PageHeader
        title={"Have a project idea in mind? Let's get started"}
        subTitle={"Stay in Touch with us "}
      />

      <div className="container mx-auto max-w-7xl px-5 lg:px-0 space-y-16">
        <ContactOptions />
        <ContactForm />
      </div>

      <Newsletter />
    </div>
  );
}
