import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/services/firebase/orderService';
import { AuthService } from '@/services/firebase/authService';
import { Order, OrderItem, PaymentMethod } from '@/types/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      items, 
      total, 
      shippingAddress, 
      billingAddress, 
      paymentMethod, 
      notes,
      userToken 
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    if (!total || typeof total !== 'number' || total <= 0) {
      return NextResponse.json(
        { error: 'Valid total amount is required' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    if (!paymentMethod || !['paypal', 'stripe', 'cash'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Valid payment method is required' },
        { status: 400 }
      );
    }

    // Get user information (for authenticated users)
    let userId = 'guest';
    let userEmail = body.userEmail || '';

    if (userToken) {
      // In a real implementation, you would verify the Firebase token here
      // For now, we'll use the provided user info
      userId = body.userId || 'guest';
      userEmail = body.userEmail || '';
    }

    // Validate and format order items
    const orderItems: OrderItem[] = items.map((item: any) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl || ''
    }));

    // Calculate total to verify client-side calculation
    const calculatedTotal = orderItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );

    if (Math.abs(calculatedTotal - total) > 0.01) {
      return NextResponse.json(
        { error: 'Total amount mismatch' },
        { status: 400 }
      );
    }

    // Create order data
    const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      userEmail,
      items: orderItems,
      total,
      status: 'pending',
      paymentMethod: paymentMethod as PaymentMethod,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      notes
    };

    // Create order in Firestore
    const orderId = await OrderService.addOrder(orderData);

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET method to retrieve order by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await OrderService.getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 