'use client';

import React, { useState } from 'react';
import { useAuthContext } from '@/components/AuthProvider';

export default function TestOrders() {
  const { user, isAuthenticated } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addTestOrders = async () => {
    if (!isAuthenticated || !user) {
      setMessage('Please sign in first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/test/add-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Success! ${data.message}`);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding test orders:', error);
      setMessage('❌ Failed to add test orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Test Orders</h1>
          
          {!isAuthenticated ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                You need to be signed in to add test orders.
              </p>
              <a 
                href="/login"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Sign In
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="font-semibold text-blue-900 mb-2">Current User</h2>
                <p className="text-blue-700">
                  <strong>Email:</strong> {user?.email}<br />
                  <strong>UID:</strong> {user?.uid}
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add Test Orders
                </h2>
                <p className="text-gray-600">
                  This will add 3 test orders to your account for testing the orders page.
                </p>
                
                <button
                  onClick={addTestOrders}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding Orders...' : 'Add Test Orders'}
                </button>

                {message && (
                  <div className={`p-4 rounded-lg ${
                    message.includes('✅') 
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    {message}
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Next Steps</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    1. Click "Add Test Orders" above
                  </p>
                  <p className="text-gray-600">
                    2. Go to <a href="/commandes" className="text-blue-600 hover:underline">Meine Bestellungen</a> to see your orders
                  </p>
                  <p className="text-gray-600">
                    3. The test orders will have different statuses: delivered, shipped, and confirmed
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 