import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("🔐 NextAuth - Missing credentials");
          return null;
        }

        console.log("🔐 NextAuth - Attempting credentials login for:", credentials.email);

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();
          console.log("🔐 NextAuth - Backend response:", data);

          if (data.success && data.data?.user) {
            const userData = {
              id: data.data.user.id,
              email: data.data.user.email,
              name: data.data.user.fullName,
              image: data.data.user.profile?.avatarUrl,
              nextAuthSecret: data.data.nextAuthSecret,
              expiresAt: data.data.expiresAt,
              role: data.data.user.role,
            };
            console.log("🔐 NextAuth - Returning user data:", userData);
            return userData;
          }
        } catch (error) {
          console.error("🔐 NextAuth - Auth error:", error);
        }

        console.log("🔐 NextAuth - Login failed");
        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔐 NextAuth - SignIn callback triggered");
      console.log("🔐 NextAuth - User:", user);
      console.log("🔐 NextAuth - Account:", account);
      console.log("🔐 NextAuth - Profile:", profile);

      if (account?.provider === "google") {
        console.log("🔐 NextAuth - Processing Google OAuth");
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email!,
              fullName: user.name!,
              providerId: user.id,
              avatarUrl: user.image, // Google profile picture
            }),
          });

          const data = await response.json();
          console.log("🔐 NextAuth - Google login backend response:", data);

          if (data.success && data.data?.user) {
            // Update user object with backend data
            user.id = data.data.user.id;
            user.role = data.data.user.role;
            user.nextAuthSecret = data.data.nextAuthSecret;
            user.expiresAt = data.data.expiresAt;
            console.log("🔐 NextAuth - Updated user object:", user);
            return true;
          }
        } catch (error) {
          console.error("🔐 NextAuth - Google auth error:", error);
        }
        console.log("🔐 NextAuth - Google login failed");
        return false;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      console.log("🔐 NextAuth - JWT callback triggered");
      console.log("🔐 NextAuth - Token:", token);
      console.log("🔐 NextAuth - User:", user);
      console.log("🔐 NextAuth - Account:", account);

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.nextAuthSecret = user.nextAuthSecret;
        token.expiresAt = user.expiresAt;
        console.log("🔐 NextAuth - Updated token with user data:", token);
      }
      return token;
    },
    async session({ session, token }) {
      console.log("🔐 NextAuth - Session callback triggered");
      console.log("🔐 NextAuth - Session:", session);
      console.log("🔐 NextAuth - Token:", token);

      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.nextAuthSecret = token.nextAuthSecret as string;
        session.user.expiresAt = token.expiresAt as string;
        console.log("🔐 NextAuth - Updated session with token data:", session);
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
