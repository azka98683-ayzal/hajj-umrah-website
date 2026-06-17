import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with mock key if not available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

export async function POST(req: Request) {
  try {
    const { amount, currency = 'usd', packageId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // If Stripe is not configured, return mock response
    if (!stripe) {
      return NextResponse.json({
        clientSecret: 'mock_secret_' + Date.now(),
        paymentIntentId: 'mock_pi_' + Date.now(),
        mock: true,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: {
        packageId: packageId || 'unknown',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

