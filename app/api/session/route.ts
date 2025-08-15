import { type NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    console.log("Session API called")

    // Get token from cookies
    const token = req.cookies.get("CHURCH_TOKEN")?.value
    console.log("Token found:", !!token)

    if (!token) {
      console.log("No token in cookies")
      return NextResponse.json({
        user: null,
        error: "No authentication token found",
      })
    }

    // Verify JWT
    let payload
    try {
      payload = verifyJwt(token)
      console.log("JWT payload:", payload)
    } catch (jwtError) {
      console.log("JWT verification failed:", jwtError)
      return NextResponse.json({
        user: null,
        error: "Invalid authentication token",
      })
    }

    if (!payload || !payload.userId) {
      console.log("Invalid payload structure:", payload)
      return NextResponse.json({
        user: null,
        error: "Invalid token payload",
      })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { 
        id: true, 
        email: true, 
        role: true, 
        name: true, 
        dateOfBirth: true,
        phone: true,
        title: true,
        address: true,
        image: true,
       },
    })

    if (!user) {
      console.log("User not found in database:", payload.userId)
      return NextResponse.json({
        user: null,
        error: "User not found",
      })
    }

    console.log("Session verified successfully for user:", user.email)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        dateOfBirth: user.dateOfBirth,
      },
    })
  } catch (error) {
    console.error("Session verification error:", error)
    return NextResponse.json(
      {
        user: null,
        error: "Session verification failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
