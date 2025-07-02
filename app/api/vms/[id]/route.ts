import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, cpu, memory, storage } = body
    const { id } = params

    const [vm] = await sql`
      UPDATE vms 
      SET 
        status = ${status},
        cpu = ${cpu || 0},
        memory = ${memory || 0},
        storage = ${storage || 0},
        updated_at = NOW()
      WHERE id = ${id}
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

    if (!vm) {
      return NextResponse.json({ error: "VM not found" }, { status: 404 })
    }

    return NextResponse.json(vm)
  } catch (error) {
    console.error("Error updating VM:", error)
    return NextResponse.json({ error: "Failed to update VM" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const [vm] = await sql`
      DELETE FROM vms 
      WHERE id = ${id}
      RETURNING id
    `

    if (!vm) {
      return NextResponse.json({ error: "VM not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "VM deleted successfully" })
  } catch (error) {
    console.error("Error deleting VM:", error)
    return NextResponse.json({ error: "Failed to delete VM" }, { status: 500 })
  }
}
