import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set")
}

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("Attempting to fetch VMs from database...")

    // Test database connection first
    const testQuery = await sql`SELECT 1 as test`
    console.log("Database connection successful:", testQuery)

    const vms = await sql`
      SELECT 
        id,
        name,
        region,
        status,
        cpu,
        memory,
        storage,
        ip_address as "ipAddress",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM vms 
      ORDER BY created_at DESC
    `

    console.log("Fetched VMs:", vms.length)
    return NextResponse.json(vms)
  } catch (error) {
    console.error("Detailed error fetching VMs:", error)

    // Return more detailed error information
    return NextResponse.json(
      {
        error: "Failed to fetch VMs",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, region, status, cpu, memory, storage, ipAddress } = body

    // Validate required fields
    if (!name || !region || !status || !ipAddress) {
      return NextResponse.json({ error: "Missing required fields: name, region, status, ipAddress" }, { status: 400 })
    }

    const [vm] = await sql`
      INSERT INTO vms (name, region, status, cpu, memory, storage, ip_address)
      VALUES (${name}, ${region}, ${status}, ${cpu || 0}, ${memory || 0}, ${storage || 0}, ${ipAddress})
      RETURNING 
        id,
        name,
        region,
        status,
        cpu,
        memory,
        storage,
        ip_address as "ipAddress",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `

    return NextResponse.json(vm, { status: 201 })
  } catch (error) {
    console.error("Error creating VM:", error)
    return NextResponse.json(
      {
        error: "Failed to create VM",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
