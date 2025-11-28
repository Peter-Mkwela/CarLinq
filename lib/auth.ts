/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

// Dynamic NEXTAUTH_URL - handles both local and production automatically
const getAuthUrl = () => {
  // Use VERCEL_URL for preview deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Use NEXTAUTH_URL if explicitly set
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // Default to localhost for development
  return 'http://localhost:3000';
};

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (user && user.password && await bcrypt.compare(credentials.password, user.password)) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // ✅ ADD THIS VALIDATION - Check if user still exists in database
      if (token?.email) {
        const user = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, email: true, name: true, role: true } // Only select needed fields
        });
        
        if (!user) {
          // User doesn't exist anymore - return empty session
          return {
            ...session,
            user: {
              ...session.user,
              id: '',
              role: '',
            }
          };
        }
        
        // User exists - populate session with fresh data
        session.user.id = user.id;
        session.user.role = user.role;
      } else {
        // No email in token - invalid session
        session.user.id = '';
        session.user.role = '';
      }
      
      return session;
    }
  },
  pages: {
    signIn: "/dealers/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};