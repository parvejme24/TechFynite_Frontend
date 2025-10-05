"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
// Mock newsletter hook - in real app, this would be imported from your API hooks
const useSubscribeNewsletter = () => {
  return {
    mutateAsync: async ({ email }: { email: string }) => {
      // Mock implementation - in real app, this would call your backend API
      console.log("Mock newsletter subscription for:", email);
      return Promise.resolve({ success: true });
    },
    isPending: false,
  };
};
import { toast } from "sonner";

const NewsletterHeader = () => (
  <motion.div
    className="space-y-1"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <h4 className="text-xl md:text-[24px] text-center text-white">
      Join Our Weekly Newsletter
    </h4>
    <h2 className="text-2xl md:text-[34px] font-bold text-center text-white">
      Get new products, freebies, and news to your inbox.
    </h2>
  </motion.div>
);

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const subscribeMutation = useSubscribeNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await subscribeMutation.mutateAsync({ email: email.trim() });
      toast.success("Thank you for subscribing to our newsletter!");
      setEmail(""); // Clear the input after successful subscription
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex items-center relative mt-5 max-w-[700px] mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <input
        type="email"
        name="email"
        className="bg-white text-black w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F5BBD]"
        placeholder="Enter Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={subscribeMutation.isPending}
      />
      <input
        type="submit"
        value={subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
        className="absolute right-1 cursor-pointer text-white bg-[#0F5BBD] px-5 md:px-10 py-2 md:py-2.5 rounded-lg hover:bg-[#0d4da3] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={subscribeMutation.isPending}
      />
    </motion.form>
  );
};

export default function Newsletter() {
  return (
    <motion.div
      className="bg-gradient-to-r from-[#043CB2] to-[#043CB2]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto max-w-7xl px-5 lg:px-0 py-10">
        <NewsletterHeader />
        <NewsletterForm />
      </div>
    </motion.div>
  );
}
