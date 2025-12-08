/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/debug-auth/route.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    return Response.json({
      success: true,
      session,
      environment: {
        hasAuthOptions: !!authOptions,
        providers: authOptions.providers?.map(p => p.id) || [],
        env: {
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✓ Set" : "✗ Missing",
          NEXTAUTH_URL: process.env.NEXTAUTH_URL || "Not set",
          DATABASE_URL: process.env.DATABASE_URL ? "✓ Set" : "✗ Missing",
        }
      }
    })
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}