// app/api/paypal/create-order/route.ts
import { NextResponse } from 'next/server';

const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com'; // Use 'https://api-m.paypal.com' for production

export async function POST(request: Request) {
  try {
    const { cartItems, totalAmount } = await request.json();

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

    // Créer la commande PayPal
    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: totalAmount,
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: totalAmount,
                },
              },
            },
            items: cartItems.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              unit_amount: {
                currency_code: 'EUR',
                value: item.price,
              },
            })),
          },
        ],
        application_context: {
          return_url: 'http://localhost:3000/panier?success=true', // URL de redirection après paiement réussi
          cancel_url: 'http://localhost:3000/panier?cancel=true', // URL de redirection après annulation
        },
      }),
    });

    const orderData = await orderResponse.json();
    return NextResponse.json(orderData);

  } catch (error) {
    console.error('Erreur lors de la création de la commande PayPal:', error);
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
  }
} 