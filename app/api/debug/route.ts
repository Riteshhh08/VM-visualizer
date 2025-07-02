import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables
    const hasDbUrl = !!process.env.DATABASE_URL

    if (!hasDbUrl) {
      return NextResponse.json({
        status: "error",
        message: "DATABASE_URL environment variable is not set",
        env: {
          DATABASE_URL: "missing",
          NODE_ENV: process.env.NODE_ENV,
        },
      })
    }

    // Test database connection
    const sql = neon(process.env.DATABASE_URL!)

    // Simple connection test
    const testResult = await sql`SELECT NOW() as current_time, version() as db_version`

    // Check if vms table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'vms'
      ) as table_exists
    `

    // Count VMs if table exists
    let vmCount = 0
    if (tableCheck[0]?.table_exists) {
      const countResult = await sql`SELECT COUNT(*) as count FROM vms`
      vmCount = Number.parseInt(countResult[0]?.count || "0")
    }

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      database: {
        connected: true,
        currentTime: testResult[0]?.current_time,
        version: testResult[0]?.db_version,
        vmsTableExists: tableCheck[0]?.table_exists,
        vmCount: vmCount,
      },
      env: {
        DATABASE_URL: "configured",
        NODE_ENV: process.env.NODE_ENV,
      },
    })
  } catch (error) {
    console.error("Database debug error:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        env: {
          DATABASE_URL: process.env.DATABASE_URL ? "configured" : "missing",
          NODE_ENV: process.env.NODE_ENV,
        },
      },
      { status: 500 },
    )
  }
}
