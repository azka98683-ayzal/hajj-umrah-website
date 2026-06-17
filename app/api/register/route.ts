import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const { name, email, password } = await req.json()
  const hashed = await bcrypt.hash(password, 10)
  try {
    await prisma.user.create({ data: { name, email, password: hashed } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Email exists" }, { status: 400 })
  }
}
