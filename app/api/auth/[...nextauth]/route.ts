/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      checks: ["pkce", "state"],
      client: {
        clock_tolerance: 60 * 60 * 24 * 30, // 30 days tolerance
        http_options: {
          timeout: 10000, // 10 seconds timeout
        },
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow credentials login to proceed
      if (account?.provider === "credentials") {
        return true;
      }

      // Handle Google OAuth
      if (account?.provider === "google") {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (existingUser) {
            // User exists, check if they have a Google account linked
            const existingAccount = await prisma.account.findFirst({
              where: {
                userId: existingUser.id,
                provider: "google",
              },
            });

            if (!existingAccount) {
              // Link Google account to existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                },
              });
            }
            return true;
          } else {
            // Create new user with Google account
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || profile?.name || "",
                role: "DEALER", // Default role for Google signups
                companyName: null,
                address: null,
                password: null, // No password for OAuth users
                emailVerified: new Date(), // Google emails are verified
              },
            });

            // Create the account link
            await prisma.account.create({
              data: {
                userId: newUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });

            return true;
          }
        } catch (error) {
          console.error("Error in Google signIn callback:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.email = user.email; // ✅ ADD THIS - crucial for session validation
      }
      
      // Handle Google OAuth token
      if (account?.provider === "google") {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      
      return token;
    },

    async session({ session, token }) {
      // ✅ ADD THIS VALIDATION: Check if user still exists in database
      if (token?.email) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, email: true, name: true, role: true, isVerified: true }
          });
          
          if (!user) {
            // User doesn't exist anymore - return empty/invalid session
            return {
              ...session,
              user: {
                ...session.user,
                id: '',
                role: '',
                email: '',
                name: '',
              },
              isValid: false
            };
          }
          
          // User exists - populate session with fresh data
          if (session.user) {
            session.user.id = user.id;
            session.user.role = user.role;
            session.user.email = user.email;
            session.user.name = user.name;
          }
          
        } catch (error) {
          console.error('Session validation error:', error);
          // On error, treat as invalid session
          if (session.user) {
            session.user.id = '';
            session.user.role = '';
          }
        }
      } else {
        // No email in token - invalid session
        if (session.user) {
          session.user.id = '';
          session.user.role = '';
        }
      }
      
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/dealers/login",
    error: "/dealers/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };