"use client";
import React from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const items = [
  {
    id: 1,
    heading: "Got a Project in Mind? Let's Build It Together.",
    desc: "From eye-catching designs to powerful code — we specialize in turning your ideas into high-performing digital experiences. Whether you're looking for a sleek website, an intuitive user interface, or a fully custom-built platform, Techfynite is ready to make it real.",
    image: "https://i.ibb.co.com/fRzDkF9/frame.png",
    features: [
      {
        feature: "Web Design",
        featureDescription:
          " Crafting visually stunning websites that reflect your   brand and engage your audience.",
      },
      {
        feature: "UI/UX Design",
        featureDescription:
          "Designing smooth, intuitive interfaces focused on user experience and functionality.",
      },
      {
        feature: "Web Development",
        featureDescription:
          "Building fast, scalable, and secure websites using modern technologies and clean code.",
      },
    ],
  },
  {
    id: 2,
    heading: "Have an Idea? Let's Turn It Into Reality.",
    desc: "Bringing innovative concepts to life with expert coding and seamless design. Whether you need a dynamic app, custom software, or enhanced web presence, Techfynite is your partner from concept to launch.",
    image: "https://i.ibb.co.com/xqGPgP2R/1.png",
    features: [
      {
        feature: "Mobile Apps",
        featureDescription:
          "Developing intuitive and responsive mobile applications tailored to your business needs.",
      },
      {
        feature: "Product Design",
        featureDescription:
          "Creating user-centered designs that balance aesthetics and functionality effectively.",
      },
      {
        feature: "Software Engineering",
        featureDescription:
          "Engineering reliable and maintainable software solutions with best coding practices.",
      },
    ],
  },
  {
    id: 3,
    heading: "Ready to Transform Your Digital Presence?",
    desc: "Delivering innovative solutions that combine sleek aesthetics with cutting-edge technology. Whether it’s a responsive site, an engaging app, or a complete platform overhaul, Techfynite is here to elevate your brand.",
    image: "https://i.ibb.co.com/20dLH3kn/2.png",
    features: [
      {
        feature: "Responsive Design",
        featureDescription:
          "Building adaptable layouts that provide seamless experiences across all devices.",
      },
      {
        feature: "Interactive UI",
        featureDescription:
          "Crafting engaging interfaces that keep users connected and improve usability.",
      },
      {
        feature: "Full-Stack Development",
        featureDescription:
          "Delivering end-to-end development from frontend visuals to backend functionality.",
      },
    ],
  },
  {
    id: 4,
    heading: "Looking to Innovate? Let's Code Your Vision.",
    desc: "We specialize in converting your creative ideas into robust digital solutions. Whether you want a custom web solution, engaging mobile app, or digital marketing platform, Techfynite is ready to innovate with you.",
    image: "https://i.ibb.co.com/d4gndrj5/3.png",
    features: [
      {
        feature: "Custom Web Solutions",
        featureDescription:
          "Tailoring web applications to meet your specific business challenges and goals.",
      },
      {
        feature: "Mobile Experience",
        featureDescription:
          "Designing mobile apps that deliver smooth performance and delightful experiences.",
      },
      {
        feature: "Digital Platforms",
        featureDescription:
          "Building scalable and flexible platforms that support your growing business needs.",
      },
    ],
  },
];

export default function BuildWithUs() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.4,
  });

  const total = items.length;
  const indexFromProgress = useMemo(
    () => (p: number) => {
      if (total <= 1) return 0;
      const idx = Math.round(p * (total - 1));
      return Math.max(0, Math.min(total - 1, idx));
    },
    [total]
  );

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (p) => {
      setActiveIndex(indexFromProgress(p));
    });
    return () => unsubscribe();
  }, [smoothProgress, indexFromProgress]);

  const current = items[activeIndex];

  // Parallax + subtle transform for the image
  const imageY = useTransform(smoothProgress, [0, 1], [40, -40]);
  const imageScale = useTransform(smoothProgress, [0, 0.5, 1], [0.98, 1, 0.98]);
  const imageRotate = useTransform(smoothProgress, [0, 1], [-1.5, 1.5]);

  // Background accent parallax
  const bgScale = useTransform(smoothProgress, [0, 1], [0.9, 1.08]);
  const bgOpacity = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [0.15, 0.25, 0.15]
  );

  // Variants for staggered feature reveal
  const listVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.06, delayChildren: 0.06 },
    },
    exit: { opacity: 0, y: -16 },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 12 },
  } as const;

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${Math.max(1, total) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center">
        {/* Background accent */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
          style={{ opacity: bgOpacity }}
        >
          <motion.div
            className="w-[60vw] h-[60vw] max-w-[720px] max-h-[720px] rounded-full bg-gradient-to-br from-[#0F5BBD33] to-[#00D4FF22] blur-3xl"
            style={{ scale: bgScale }}
          />
        </motion.div>
        <div className="container mx-auto max-w-7xl px-4 lg:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* left side */}
            <div>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={`left-${current.id}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <h2 className="text-[34px] leading-tight font-bold">
                    {current.heading}
                  </h2>
                  <p className="text-[14px] mt-2 text-gray-600 dark:text-[#FFFFFF]">
                    {current.desc}
                  </p>
                  <motion.div
                    className="flex flex-col gap-2 mt-5"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {current.features.map((feature) => (
                      <motion.div
                        key={feature.feature}
                        className="flex items-center gap-2 text-[14px]"
                        variants={itemVariants}
                      >
                        <IoMdCheckmarkCircle className="text-[#0F5BBD] text-3xl -mt-4" />
                        <p className="text-[14px] font-bold">
                          {feature.feature} -{" "}
                          <span className="font-normal">
                            {feature.featureDescription}
                          </span>
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* right side */}
            <div className="flex justify-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={`img-${current.id}`}
                  src={current.image}
                  alt={current.heading}
                  initial={{ opacity: 0, scale: 0.96, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.98, rotate: 2 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{ y: imageY, scale: imageScale, rotate: imageRotate }}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* dots / step indicator */}
          {total > 1 && (
            <div className="mt-8 flex items-center gap-2">
              {items.map((it, i) => (
                <span
                  key={it.id}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "bg-[#0F5BBD] w-8"
                      : "bg-gray-300 dark:bg-gray-600 w-2"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
