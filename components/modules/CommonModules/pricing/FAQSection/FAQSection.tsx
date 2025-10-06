"use client";
import React, { useState } from "react";
import { FaQuestion } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  name: string;
  faqs: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    id: "general",
    name: "General",
    faqs: [
      {
        question: "What is TechFynite?",
        answer:
          "TechFynite is a platform that provides high-quality templates and digital products for developers and designers. We offer a wide range of solutions to help you build and grow your digital presence.",
      },
      {
        question: "How do I get started?",
        answer:
          "Getting started is easy! Simply create an account, browse our collection of templates and products, and choose what best fits your needs. You can preview items before purchasing and get immediate access after payment.",
      },
      {
        question: "Do you offer technical support?",
        answer:
          "Yes, we provide comprehensive technical support for all our products. Our support team is available 24/7 to help you with any questions or issues you may encounter.",
      },
      {
        question: "Can I modify the templates?",
        answer:
          "Absolutely! All our templates are fully customizable. You can modify colors, layouts, content, and functionality to match your specific requirements. We also provide detailed documentation to help you with customization.",
      },
    ],
  },
  {
    id: "payment",
    name: "Payment",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and other popular payment methods. All transactions are secure and encrypted.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Yes, we use industry-standard SSL encryption to protect your payment information. We never store your full credit card details on our servers.",
      },
      {
        question: "Do you offer any discounts?",
        answer:
          "Yes, we regularly offer discounts and special promotions. Subscribe to our newsletter to stay updated on the latest deals and offers.",
      },
      {
        question: "Can I get an invoice for my purchase?",
        answer:
          "Yes, you can download an invoice for any purchase from your account dashboard. We also send a receipt to your registered email address after each transaction.",
      },
    ],
  },
  {
    id: "support",
    name: "Support",
    faqs: [
      {
        question: "How can I get support?",
        answer:
          "You can reach our support team through multiple channels: email, live chat, or by submitting a ticket through your account dashboard. We aim to respond to all queries within 24 hours.",
      },
      {
        question: "What are your support hours?",
        answer:
          "Our support team is available 24/7 to assist you with any questions or issues. We have team members across different time zones to ensure prompt assistance.",
      },
      {
        question: "Do you offer installation support?",
        answer:
          "Yes, we provide detailed installation guides and documentation for all products. If you need additional help, our support team can assist you with the installation process.",
      },
      {
        question: "How do I report a bug?",
        answer:
          "You can report bugs through your account dashboard or by contacting our support team. Please include as much detail as possible about the issue, including screenshots and steps to reproduce.",
      },
    ],
  },
  {
    id: "refund",
    name: "Refund Policy",
    faqs: [
      {
        question: "What is your refund policy?",
        answer:
          "We offer a 30-day money-back guarantee for all our products. If you're not satisfied with your purchase, you can request a full refund within 30 days.",
      },
      {
        question: "How do I request a refund?",
        answer:
          "To request a refund, contact our support team through your account dashboard or email. Please include your order number and reason for the refund request.",
      },
      {
        question: "Are there any conditions for refunds?",
        answer:
          "Refunds are available for unused products or if you encounter technical issues that we cannot resolve. Customized or modified products may not be eligible for refunds.",
      },
      {
        question: "How long does it take to process a refund?",
        answer:
          "Refunds are typically processed within 5-7 business days. The time it takes for the refund to appear in your account depends on your payment provider.",
      },
    ],
  },
];

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState("general");

  const activeCategoryData = faqData.find(
    (category) => category.id === activeCategory
  );

  return (
    <motion.div 
      className="container mx-auto max-w-7xl px-5 lg:px-0 py-14"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.div 
          className="md:col-span-1 border border-[#bababad7] dark:border-[#ffffff28] rounded-xl bg-gradient-to-b from-[#FFFFFF] dark:from-[#0B0E20] to-[#EBF3FF] dark:to-[#0B0E20] py-10 w-full md:w-[270px]"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="">
            <motion.h3 
              className="text-[35px] leading-tight font-bold mb-4 px-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Questions & Answers
            </motion.h3>
            <div className="space-y-2 mt-8">
              {faqData.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`cursor-pointer text-[15px] w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                    activeCategory === category.id
                      ? "bg-[#0F59BC] text-white px-10 font-bold"
                      : "hover:bg-[#EAF3FF] dark:hover:bg-[#1E2B4D] px-10"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    x: 5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="space-x-2">
                    <motion.span 
                      className="bg-white py-2 px-3.5 rounded text-[#0F5BBD] font-extrabold border-1 border-black"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {category.name[0]}
                    </motion.span>
                    <span>{category.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* FAQ Content */}
        <motion.div 
          className="md:col-span-3 md:pl-14 lg:px-0"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {activeCategoryData?.faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-transparent hover:bg-white dark:hover:bg-[#1A1D37] rounded-lg p-6 hover:shadow-sm duration-300"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  layout
                >
                  <div className="flex gap-3">
                    <motion.div
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 10,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <motion.span 
                        className="bg-[#ACD0FF] rounded-full text-black flex justify-center items-center w-[30px] h-[30px] mt-1"
                        animate={{
                          scale: [1, 1.05, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <FaQuestion />
                      </motion.span>
                    </motion.div>
                    <div>
                      <motion.h4 
                        className="text-[24px] font-semibold flex items-center gap-2"
                        whileHover={{ 
                          scale: 1.02,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {faq.question}
                      </motion.h4>
                      <motion.p 
                        className="text-[14px] text-gray-600 dark:text-gray-300"
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        whileHover={{ 
                          scale: 1.01,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {faq.answer}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
