// app/api/paypal/capture-order/route.ts
import { NextResponse } from 'next/server';

const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com'; // Use 'https://api-m.paypal.com' for production

export async function POST(request: Request) {
  try {
    const { orderID } = await request.json();

    // Remplacez par vos vraies clés API PayPal
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID';
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'YOUR_PAYPAL_CLIENT_SECRET';

    // Obtenir un jeton d'accès (access token)
    const authResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`,
      },
      body: 'grant_type=client_credentials',
    });

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Capturer la commande PayPal
    const captureResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const captureData = await captureResponse.json();
    return NextResponse.json(captureData);

  } catch (error) {
    console.error('Erreur lors de la capture de la commande PayPal:', error);
    return NextResponse.json({ error: 'Failed to capture PayPal order' }, { status: 500 });
  }
} 