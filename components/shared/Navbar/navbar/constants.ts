export interface NavItem {
  name: string;
  href: string;
}

export const navigation: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Template", href: "/template" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blogs" },
  { name: "Contact", href: "/contact" },
];

export const menuVariants = {
  closed: {
    opacity: 0,
    x: "-100%",
    transition: { duration: 0.3, ease: "easeInOut" as const },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeInOut" as const },
  },
};

export const menuItemVariants = {
  closed: { opacity: 0, x: -20 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

export const backdropVariants = {
  closed: { opacity: 0, transition: { duration: 0.3 } },
  open: { opacity: 1, transition: { duration: 0.3 } },
}; 