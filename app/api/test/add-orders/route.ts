import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/services/firebase/orderService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userEmail } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('Adding test orders for user:', userId);

    const testOrders = [
      {
        userId,
        userEmail: userEmail || 'test@example.com',
        items: [
          {
            productId: 'cookie-001',
            name: 'Makoti Special Cookies',
            price: 12.50,
            quantity: 2,
            imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200'
          },
          {
            productId: 'cookie-002',
            name: 'Chocolate Delight',
            price: 9.00,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200'
          }
        ],
        total: 34.00,
        status: 'delivered' as const,
        paymentMethod: 'paypal' as const,
        shippingAddress: {
          name: 'Max Mustermann',
          street: 'Beispielstraße 123',
          city: 'München',
          postalCode: '80331',
          country: 'Deutschland'
        },
        billingAddress: {
          name: 'Max Mustermann',
          street: 'Beispielstraße 123',
          city: 'München',
          postalCode: '80331',
          country: 'Deutschland'
        },
        notes: 'Erste Testbestellung - vielen Dank!'
      },
      {
        userId,
        userEmail: userEmail || 'test@example.com',
        items: [
          {
            productId: 'cookie-003',
            name: 'Butter Cookies Klassik',
            price: 8.50,
            quantity: 3,
            imageUrl: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=200'
          }
        ],
        total: 25.50,
        status: 'shipped' as const,
        paymentMethod: 'stripe' as const,
        shippingAddress: {
          name: 'Max Mustermann',
          street: 'Teststraße 456',
          city: 'Hamburg',
          postalCode: '20095',
          country: 'Deutschland'
        },
        billingAddress: {
          name: 'Max Mustermann',
          street: 'Teststraße 456',
          city: 'Hamburg',
          postalCode: '20095',
          country: 'Deutschland'
        },
        notes: 'Zweite Bestellung - Express-Versand bitte'
      },
      {
        userId,
        userEmail: userEmail || 'test@example.com',
        items: [
          {
            productId: 'cookie-004',
            name: 'Lebkuchen Spezial',
            price: 15.00,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=200'
          },
          {
            productId: 'cookie-005',
            name: 'Vanille Cookies',
            price: 7.50,
            quantity: 2,
            imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=200'
          }
        ],
        total: 30.00,
        status: 'confirmed' as const,
        paymentMethod: 'cash' as const,
        shippingAddress: {
          name: 'Max Mustermann',
          street: 'Musterweg 789',
          city: 'Berlin',
          postalCode: '10115',
          country: 'Deutschland'
        },
        billingAddress: {
          name: 'Max Mustermann',
          street: 'Musterweg 789',
          city: 'Berlin',
          postalCode: '10115',
          country: 'Deutschland'
        },
        notes: 'Aktuelle Bestellung - Barzahlung bei Lieferung'
      }
    ];

    const orderIds = [];
    for (const testOrder of testOrders) {
      const orderId = await OrderService.addOrder(testOrder);
      orderIds.push(orderId);
      console.log('Test order added with ID:', orderId);
    }

    return NextResponse.json({
      success: true,
      message: `${orderIds.length} test orders added successfully`,
      orderIds
    });

  } catch (error) {
    console.error('Error adding test orders:', error);
    return NextResponse.json(
      { 
        error: 'Failed to add test orders',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 