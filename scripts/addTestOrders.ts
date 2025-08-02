import { OrderService } from '../services/firebase/orderService';
import { Order } from '../types/firebase';

async function addTestOrders() {
  try {
    console.log('Adding test orders...');

    // Test order 1
    const testOrder1 = {
      userId: 'test-user-123', // You should replace this with your actual user ID
      userEmail: 'test@example.com',
      items: [
        {
          productId: 'prod-1',
          name: 'Chocolate Chip Cookies',
          price: 8.50,
          quantity: 2,
          imageUrl: '/cookie1.jpg'
        },
        {
          productId: 'prod-2',
          name: 'Oatmeal Cookies',
          price: 7.00,
          quantity: 1,
          imageUrl: '/cookie2.jpg'
        }
      ],
      total: 24.00,
      status: 'delivered' as const,
      paymentMethod: 'paypal' as const,
      shippingAddress: {
        name: 'Max Mustermann',
        street: 'Musterstraße 123',
        city: 'Berlin',
        postalCode: '10115',
        country: 'Deutschland'
      },
      billingAddress: {
        name: 'Max Mustermann',
        street: 'Musterstraße 123',
        city: 'Berlin',
        postalCode: '10115',
        country: 'Deutschland'
      },
      notes: 'Test order - please handle with care'
    };

    // Test order 2
    const testOrder2 = {
      userId: 'test-user-123',
      userEmail: 'test@example.com',
      items: [
        {
          productId: 'prod-3',
          name: 'Sugar Cookies',
          price: 6.50,
          quantity: 3,
          imageUrl: '/cookie3.jpg'
        }
      ],
      total: 19.50,
      status: 'shipped' as const,
      paymentMethod: 'stripe' as const,
      shippingAddress: {
        name: 'Max Mustermann',
        street: 'Musterstraße 123',
        city: 'Berlin',
        postalCode: '10115',
        country: 'Deutschland'
      },
      billingAddress: {
        name: 'Max Mustermann',
        street: 'Musterstraße 123',
        city: 'Berlin',
        postalCode: '10115',
        country: 'Deutschland'
      },
      notes: 'Second test order'
    };

    // Test order 3
    const testOrder3 = {
      userId: 'test-user-123',
      userEmail: 'test@example.com',
      items: [
        {
          productId: 'prod-4',
          name: 'Gingerbread Cookies',
          price: 9.00,
          quantity: 1,
          imageUrl: '/cookie4.jpg'
        },
        {
          productId: 'prod-5',
          name: 'Peanut Butter Cookies',
          price: 8.00,
          quantity: 2,
          imageUrl: '/cookie5.jpg'
        }
      ],
      total: 25.00,
      status: 'pending' as const,
      paymentMethod: 'cash' as const,
      shippingAddress: {
        name: 'Max Mustermann',
        street: 'Musterstraße 123',
        city: 'Berlin',
        postalCode: '10115',
        country: 'Deutschland'
      },
      billingAddress: {
        name: 'Max Mustermann',
        street: 'Musterstraße 123',
        city: 'Berlin',
        postalCode: '10115',
        country: 'Deutschland'
      },
      notes: 'Third test order - pending payment'
    };

    const orderId1 = await OrderService.addOrder(testOrder1);
    console.log('Test order 1 added with ID:', orderId1);

    const orderId2 = await OrderService.addOrder(testOrder2);
    console.log('Test order 2 added with ID:', orderId2);

    const orderId3 = await OrderService.addOrder(testOrder3);
    console.log('Test order 3 added with ID:', orderId3);

    console.log('All test orders added successfully!');

    // Test retrieving orders
    console.log('\nTesting order retrieval...');
    const orders = await OrderService.getOrdersByUserId('test-user-123');
    console.log('Retrieved orders:', orders.length);
    orders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`, {
        id: order.id,
        total: order.total,
        status: order.status,
        itemCount: order.items.length
      });
    });

  } catch (error) {
    console.error('Error adding test orders:', error);
  }
}

addTestOrders(); 