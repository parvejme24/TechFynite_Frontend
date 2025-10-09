"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateContact } from "@/hooks/useContactApi";
import { useAuth } from "@/hooks/useAuth";
import Swal from "sweetalert2";

type FormValues = {
  projectDetails: string;
  budget: string;
  fullName: string;
  email: string;
  companyName: string;
  serviceRequired: string;
};

export default function ContactForm() {
  const { user } = useAuth();
  const {
    register,
    handleSubmit: submitForm,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { mutateAsync: createContact, isPending: isCreating } = useCreateContact();

  const onSubmit = async (data: FormValues) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Submit Service Request?',
      html: `
        <div class="text-left">
          <p><strong>Name:</strong> ${data.fullName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.companyName}</p>
          <p><strong>Service:</strong> ${data.serviceRequired.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</p>
          <p><strong>Budget:</strong> ${data.budget}</p>
          <hr class="my-3">
          <p><strong>Project Details:</strong></p>
          <p class="text-sm text-gray-600">${data.projectDetails.substring(0, 100)}${data.projectDetails.length > 100 ? '...' : ''}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0F58BB',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Submit Request',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
      width: '500px'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const contactData = {
        ...data,
        userId: user?.id, // Include user ID if logged in
      };
      
      await createContact(contactData);
      
      // Show success alert
      Swal.fire({
        title: 'Request Submitted Successfully!',
        html: `
          <div class="text-center">
            <p class="mb-3">Thank you <strong>${data.fullName}</strong>!</p>
            <p class="mb-3">We've received your service request and will get back to you within 24 hours.</p>
            <p class="text-sm text-gray-600">A confirmation email has been sent to <strong>${data.email}</strong></p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#10B981',
        confirmButtonText: 'Great!',
        width: '450px'
      });
      
      reset();
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      
      // Show error alert
      Swal.fire({
        title: 'Submission Failed',
        html: `
          <div class="text-center">
            <p class="mb-3">Sorry <strong>${data.fullName}</strong>, we couldn't send your message right now.</p>
            <p class="text-sm text-gray-600">Please try again or contact us directly at <strong>support@techfynite.com</strong></p>
          </div>
        `,
        icon: 'error',
        confirmButtonColor: '#EF4444',
        confirmButtonText: 'Try Again',
        width: '450px'
      });
    }
  };

  return (
    <div>
      <div className="bg-[#FFFFFF] dark:bg-[#1A1D37] p-6 md:px-14 md:py-10 rounded-lg mb-20">
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
          onSubmit={submitForm(onSubmit)}
        >
          {/* left side  */}
          <div>
            <h2 className="space-x-2 mb-5">
              <span className="bg-[#0F58BB] text-white p-2.5 rounded-full text-[15px] font-bold w-[34px] h-[34px]">
                01
              </span>
              <span className="text-black dark:text-white font-bold text-base">
                Tell us about your projects
              </span>
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[#718096] dark:text-gray-300 font-bold text-sm">
                  Project Details *
                </label>
                <textarea
                  {...register("projectDetails", { required: true })}
                  rows={10}
                  placeholder="Start Typing"
                  className="w-full p-2 rounded-lg bg-[#F7FAFC] dark:bg-[#0B0E20] border border-[#D1D9E3] dark:border-0 dark:border-t dark:border-[#39415D] text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm placeholder:italic focus:outline-none focus:border-[#0F58BB] dark:focus:border-[#4A90E2]"
                ></textarea>
                {errors.projectDetails && (
                  <span className="text-red-500 text-sm">
                    Project details are required.
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[#718096] dark:text-gray-300 font-bold text-sm">
                  Select Your Budget *
                </label>
                <select
                  {...register("budget", { required: true })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#F7FAFC] dark:bg-[#0B0E20] border border-[#D1D9E3] dark:border-0 dark:border-t dark:border-[#39415D] text-black dark:text-white text-sm focus:outline-none focus:border-[#0F58BB] dark:focus:border-[#4A90E2] appearance-none pr-10"
                >
                  <option value="" className="italic">
                    Select Your Budget
                  </option>
                  <option value="500-1000">$1,000 - $5,000</option>
                  <option value="1000-5000">$1,000 - $5,000</option>
                  <option value="5000-10000">$5,000 - $10,000</option>
                  <option value="10000-25000">$10,000 - $25,000</option>
                  <option value="25000-50000">$25,000 - $50,000</option>
                  <option value="50000+">$50,000+</option>
                </select>
                {errors.budget && (
                  <span className="text-red-500 text-sm">
                    Budget is required.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* right side  */}
          <div>
            <h2 className="space-x-2 mb-5">
              <span className="bg-[#0F58BB] text-white p-2.5 rounded-full text-[15px] font-bold w-[34px] h-[34px]">
                02
              </span>
              <span className="text-black dark:text-white font-bold text-base">
                Personal Information
              </span>
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[#718096] dark:text-gray-300 font-bold text-sm">
                  Full Name *
                </label>
                <input
                  {...register("fullName", { required: true })}
                  placeholder="Type Your Name"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#F7FAFC] dark:bg-[#0B0E20] border border-[#D1D9E3] dark:border-0 dark:border-t dark:border-[#39415D] text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm placeholder:italic focus:outline-none focus:border-[#0F58BB] dark:focus:border-[#4A90E2]"
                />
                {errors.fullName && (
                  <span className="text-red-500 text-sm">
                    Full name is required.
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[#718096] dark:text-gray-300 font-bold text-sm">
                  Email *
                </label>
                <input
                  {...register("email", { required: true })}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#F7FAFC] dark:bg-[#0B0E20] border border-[#D1D9E3] dark:border-0 dark:border-t dark:border-[#39415D] text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm placeholder:italic focus:outline-none focus:border-[#0F58BB] dark:focus:border-[#4A90E2]"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    Email is required.
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[#718096] dark:text-gray-300 font-bold text-sm">
                  Company Name *
                </label>
                <input
                  {...register("companyName", { required: true })}
                  placeholder="Type Your Company Name"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#F7FAFC] dark:bg-[#0B0E20] border border-[#D1D9E3] dark:border-0 dark:border-t dark:border-[#39415D] text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm placeholder:italic focus:outline-none focus:border-[#0F58BB] dark:focus:border-[#4A90E2]"
                />
                {errors.companyName && (
                  <span className="text-red-500 text-sm">
                    Company name is required.
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[#718096] dark:text-gray-300 font-bold text-sm">
                  Service required *
                </label>
                <select
                  {...register("serviceRequired", { required: true })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#F7FAFC] dark:bg-[#0B0E20] border border-[#D1D9E3] dark:border-0 dark:border-t dark:border-[#39415D] text-black dark:text-white text-sm focus:outline-none focus:border-[#0F58BB] dark:focus:border-[#4A90E2] appearance-none pr-10"
                >
                  <option value="" className="italic">
                    Select Your Service
                  </option>
                  <option value="web-development">Web Development</option>
                  <option value="mobile-app">Mobile App Development</option>
                  <option value="ui-ux-design">UI/UX Design</option>
                  <option value="digital-marketing">Digital Marketing</option>
                  <option value="seo">SEO Services</option>
                  <option value="maintenance">Website Maintenance</option>
                  <option value="consulting">IT Consulting</option>
                </select>
                {errors.serviceRequired && (
                  <span className="text-red-500 text-sm">
                    Service is required.
                  </span>
                )}
              </div>

              <input
                type="submit"
                value={isCreating ? "Submitting..." : "Submit"}
                className="text-center w-full bg-gradient-to-bl from-[#0F35A7] to-[#0F5BBD] rounded-lg px-4 py-3 text-white font-light cursor-pointer hover:bg-[#0F57BA]/90 border border-[#BDD9FE] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCreating}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
