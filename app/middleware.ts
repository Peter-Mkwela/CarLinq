// middleware.ts (simple version)
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Protect routes - user existence is validated in auth.ts session callback
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dealers/dashboard/:path*",
    "/api/dealers/:path*"
  ]
};