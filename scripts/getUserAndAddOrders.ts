import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { OrderService } from '../services/firebase/orderService';
import { auth } from '../lib/firebase/config';

async function getCurrentUserAndAddOrders() {
  console.log('Checking authentication state...');
  
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Stop listening
      
      if (user) {
        console.log('Current user:', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        });

        try {
          // Add test orders for the current user
          const testOrders = [
            {
              userId: user.uid,
              userEmail: user.email || 'unknown@example.com',
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
                name: user.displayName || 'Kunde',
                street: 'Beispielstraße 123',
                city: 'München',
                postalCode: '80331',
                country: 'Deutschland'
              },
              billingAddress: {
                name: user.displayName || 'Kunde',
                street: 'Beispielstraße 123',
                city: 'München',
                postalCode: '80331',
                country: 'Deutschland'
              },
              notes: 'Erste Testbestellung - vielen Dank!'
            },
            {
              userId: user.uid,
              userEmail: user.email || 'unknown@example.com',
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
                name: user.displayName || 'Kunde',
                street: 'Teststraße 456',
                city: 'Hamburg',
                postalCode: '20095',
                country: 'Deutschland'
              },
              billingAddress: {
                name: user.displayName || 'Kunde',
                street: 'Teststraße 456',
                city: 'Hamburg',
                postalCode: '20095',
                country: 'Deutschland'
              },
              notes: 'Zweite Bestellung - Express-Versand bitte'
            },
            {
              userId: user.uid,
              userEmail: user.email || 'unknown@example.com',
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
                name: user.displayName || 'Kunde',
                street: 'Musterweg 789',
                city: 'Berlin',
                postalCode: '10115',
                country: 'Deutschland'
              },
              billingAddress: {
                name: user.displayName || 'Kunde',
                street: 'Musterweg 789',
                city: 'Berlin',
                postalCode: '10115',
                country: 'Deutschland'
              },
              notes: 'Aktuelle Bestellung - Barzahlung bei Lieferung'
            }
          ];

          console.log('Adding test orders for user:', user.uid);

          for (let i = 0; i < testOrders.length; i++) {
            const orderId = await OrderService.addOrder(testOrders[i]);
            console.log(`Test order ${i + 1} added with ID:`, orderId);
          }

          console.log('All test orders added successfully!');

          // Test retrieving orders
          console.log('\nTesting order retrieval...');
          const orders = await OrderService.getOrdersByUserId(user.uid);
          console.log('Retrieved orders:', orders.length);
          orders.forEach((order, index) => {
            console.log(`Order ${index + 1}:`, {
              id: order.id,
              total: order.total,
              status: order.status,
              itemCount: order.items.length
            });
          });

          resolve('Success');
        } catch (error) {
          console.error('Error adding test orders:', error);
          reject(error);
        }
      } else {
        console.log('No user is currently signed in');
        console.log('Please sign in first at http://localhost:3000/login');
        resolve('No user signed in');
      }
    });
  });
}

getCurrentUserAndAddOrders()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 