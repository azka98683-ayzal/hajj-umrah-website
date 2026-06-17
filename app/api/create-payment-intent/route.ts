import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  
  const { bookingId } = await req.json()
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { package: true }
  })
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: booking.package.price,
    currency: "usd",
    metadata: { bookingId, userId: session.user.id }
  })
  
  await prisma.booking.update({
    where: { id: bookingId },
    data: { paymentIntentId: paymentIntent.id }
  })
  
  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}
