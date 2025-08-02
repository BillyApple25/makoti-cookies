// app/api/stripe/create-payment-intent/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil', // Utilisez la version d'API la plus récente ou celle que vous utilisez
});

export async function POST(request: Request) {
  try {
    const { totalAmount, currency } = await request.json();

    // Créez une intention de paiement avec le montant et la devise
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe attend le montant en centimes
      currency: currency || 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Erreur lors de la création de l\'intention de paiement Stripe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 