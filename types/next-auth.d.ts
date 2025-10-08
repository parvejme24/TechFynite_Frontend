import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      fullName: string;
      image?: string;
      role: string;
      profile?: any;
      nextAuthSecret?: string;
      expiresAt?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    fullName: string;
    image?: string;
    role: string;
    profile?: any;
    nextAuthSecret?: string;
    expiresAt?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    fullName: string;
    email: string;
    image?: string;
    role: string;
    profile?: any;
    nextAuthSecret?: string;
    expiresAt?: string;
  }
}


