"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/common/logo.png";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const socialLinks = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Youtube, label: "Youtube", href: "#" },
];

const companyLinks = [
  { label: "Template", href: "/template" },
  { label: "Support", href: "/support" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const helpLinks = [
  { label: "Customer Support", href: "/support" },
  { label: "Delivery Details", href: "/delivery" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

const SocialLinks = () => (
  <div className="flex space-x-4">
    {socialLinks.map(({ icon: Icon, label, href }) => (
      <motion.div
        key={label}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Link
          href={href}
          className="bg-[#2563EB] text-[#0A0D20] hover:text-white transition-colors duration-500 p-2 rounded-full shadow block"
          aria-label={label}
          target="_blank"
        >
          <Icon className="h-5 w-5" />
        </Link>
      </motion.div>
    ))}
  </div>
);

const FooterLinks = ({
  title,
  links,
}: {
  title: string;
  links: typeof companyLinks;
}) => (
  <div className="space-y-4">
    <h4 className="text-lg font-semibold uppercase tracking-widest">{title}</h4>
    <ul className="space-y-2">
      {links.map(({ label, href }) => (
        <li key={label}>
          <Link
            href={href}
            className="text-gray-400 hover:text-white transition-colors select-text"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const NewsletterSection = () => (
  <div className="space-y-4">
    <h4 className="text-lg font-semibold uppercase tracking-widest">
      Subscribe to Newsletter
    </h4>
    <div className="space-y-2">
      <Input
        type="email"
        placeholder="Enter your email"
        className="w-[70%] bg-[#0A0D20] border-[#E4E4E7] border-[2px] text-white placeholder:text-gray-400 h-11 px-4"
      />
      <Button className="bg-[#2563EB] hover:bg-[#2564ebc0] h-10 cursor-pointer">
        Subscribe
      </Button>
    </div>
  </div>
);

const GradientBackground = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute -bottom-[80%] -left-[40%] w-[800px] h-[800px] bg-gradient-to-br from-[#8448FA]/20 to-[#053CB2]/20 rounded-full blur-3xl" />
    <div className="absolute -top-[80%] -right-[40%] w-[800px] h-[800px] bg-gradient-to-br from-[#8448FA]/20 to-[#053CB2]/20 rounded-full blur-3xl" />
  </div>
);

export default function Footer() {
  return (
    <motion.footer
      className="bg-[#0B0D21] text-white py-16 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <GradientBackground />

      <div className="container mx-auto max-w-7xl px-5 lg:px-0 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <Image src={Logo} alt="TechFynite Logo" width={40} height={40} />
              <h2 className="text-xl font-bold">TechFynite</h2>
            </div>
            <p className="text-gray-400 text-sm select-text">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </p>
            <SocialLinks />
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FooterLinks title="Company" links={companyLinks} />
          </motion.div>

          {/* Help Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FooterLinks title="Help" links={helpLinks} />
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <NewsletterSection />
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="select-text">
            © {new Date().getFullYear()} TechFynite. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
