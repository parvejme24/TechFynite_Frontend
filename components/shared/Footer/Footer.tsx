"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/common/logo.png";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNewsletter } from "@/hooks/useNewsletterApi";

// Link underline sweep animation
function UnderlineText({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <span>{children}</span>
      <motion.span
        className="absolute left-0 -bottom-0.5 h-[2px] bg-current"
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
    </span>
  );
}

// Animated per-character hover text with underline sweep
function MotionLinkText({ text }: { text: string }) {
  const [hovered, setHovered] = React.useState(false);
  const letters = React.useMemo(() => text.split("") , [text]);
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ whiteSpace: "nowrap" }}
    >
      {letters.map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          className="inline-block"
          initial={false}
          animate={{
            y: hovered ? -2 : 0,
            x: hovered ? i * 0.6 : 0,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
      <motion.span
        className="absolute left-0 -bottom-0.5 h-[2px] bg-current"
        initial={{ width: 0, opacity: 0.7 }}
        animate={{ width: hovered ? "100%" : 0, opacity: hovered ? 1 : 0.7 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </span>
  );
}


const socialLinks = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Youtube, label: "Youtube", href: "#" },
];

const companyLinks = [
  { label: "Template", href: "/template" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blogs", href: "/blogs" },
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
            <MotionLinkText text={label} />
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const { subscribe, isSubscribing, subscribeError } = useNewsletter();

  const handleSubscribe = async (e: React.FormEvent) => {
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
      const result = await subscribe(email.trim());
      if (result.success) {
        toast.success("Successfully subscribed to newsletter!");
        setEmail(""); // Clear the input after successful subscription
      } else {
        toast.error(result.message || "Failed to subscribe. Please try again.");
      }
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      
      // Handle specific error messages based on response
      if (error?.response?.data?.message) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes("already subscribed")) {
          toast.error("This email is already subscribed to our newsletter.");
        } else if (errorMessage.includes("Invalid email")) {
          toast.error("Please enter a valid email address.");
        } else {
          toast.error(errorMessage);
        }
      } else if (error?.response?.status === 400) {
        toast.error("Invalid request. Please check your email and try again.");
      } else if (error?.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (error?.message?.includes("Network Error")) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold uppercase tracking-widest">
        Subscribe to Newsletter
      </h4>
      <form onSubmit={handleSubscribe} className="space-y-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-[70%] bg-[#0A0D20] border-[#E4E4E7] border-[2px] text-white placeholder:text-gray-400 h-11 px-4"
          disabled={isSubscribing}
        />
        <Button 
          type="submit"
          className="bg-[#2563EB] hover:bg-[#2564ebc0] h-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubscribing}
        >
          {isSubscribing ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </div>
  );
};

const GradientBackground = ({
  styleTop,
  styleBottom,
}: {
  styleTop?: React.CSSProperties | any;
  styleBottom?: React.CSSProperties | any;
}) => (
  <div className="absolute inset-0 pointer-events-none">
    <motion.div
      className="absolute -bottom-[80%] -left-[40%] w-[800px] h-[800px] bg-gradient-to-br from-[#8448FA]/20 to-[#053CB2]/20 rounded-full blur-3xl"
      style={styleBottom}
    />
    <motion.div
      className="absolute -top-[80%] -right-[40%] w-[800px] h-[800px] bg-gradient-to-br from-[#8448FA]/20 to-[#053CB2]/20 rounded-full blur-3xl"
      style={styleTop}
    />
  </div>
);

export default function Footer() {
  const footerRef = React.useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ["start 80%", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.4 });

  // Parallax + subtle background dynamics
  const topY = useTransform(smooth, [0, 1], [40, -30]);
  const bottomY = useTransform(smooth, [0, 1], [-40, 30]);
  const bgOpacity = useTransform(smooth, [0, 0.5, 1], [0.15, 0.25, 0.18]);
  const bgScale = useTransform(smooth, [0, 1], [0.95, 1.05]);

  // Staggered reveal for columns
  const containerVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  } as const;

  return (
    <motion.footer
      ref={footerRef}
      className="bg-[#0B0D21] text-white py-16 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <GradientBackground styleTop={{ y: topY, opacity: bgOpacity, scale: bgScale }} styleBottom={{ y: bottomY, opacity: bgOpacity, scale: bgScale }} />

      <div className="container mx-auto max-w-7xl px-5 lg:px-0 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Company Info */}
          <motion.div
            className="space-y-4"
            variants={itemVariants}
          >
            <Tilt>
              <div className="flex items-center space-x-2">
                <Image src={Logo} alt="TechFynite Logo" width={40} height={40} />
                <h2 className="text-4xl font-bold">TechFynite</h2>
              </div>
              <p className="text-gray-400 mt-4 mb-8 text-sm select-text">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                amet sint. Velit officia consequat duis enim velit mollit.
              </p>
              <SocialLinks />
            </Tilt>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants}>
            <Tilt>
              <FooterLinks title="Company" links={companyLinks} />
            </Tilt>
          </motion.div>

          {/* Help Links */}
          <motion.div variants={itemVariants}>
            <Tilt>
              <FooterLinks title="Help" links={helpLinks} />
            </Tilt>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <Tilt>
              <NewsletterSection />
            </Tilt>
          </motion.div>
        </motion.div>

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

// Subtle 3D tilt wrapper for interactivity
function Tilt({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = React.useState(false);
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1
    setCoords({ x, y });
  };

  const rotateX = (0.5 - coords.y) * (hovered ? 6 : 0);
  const rotateY = (coords.x - 0.5) * (hovered ? 6 : 0);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMouseMove}
      style={{
        transformStyle: "preserve-3d",
      }}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.6 }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}


