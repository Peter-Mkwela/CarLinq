// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
    };
    accessToken?: string;
  }

  interface User extends DefaultUser {
    id: string;
    role?: string; // <-- add role here
  }

  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
  }
}
