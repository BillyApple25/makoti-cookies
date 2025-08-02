'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { useAuthContext } from './AuthProvider';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user, isAuthenticated } = useAuthContext();
  if (!isOpen) return null;

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      await updateQuantity(productId, quantity);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Warenkorb</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <i className="ri-shopping-cart-line text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-500">Ihr Warenkorb ist leer</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-amber-600 font-bold">€{item.price}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button 
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded cursor-pointer"
                        >
                          <i className="ri-subtract-line text-sm"></i>
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded cursor-pointer"
                        >
                          <i className="ri-add-line text-sm"></i>
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(item.productId)}
                      className="w-8 h-8 flex items-center justify-center text-red-500 cursor-pointer"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Gesamt:</span>
                <span className="text-xl font-bold text-amber-600">€{totalPrice.toFixed(2)}</span>
              </div>
              {isAuthenticated ? (
                <Link 
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full bg-amber-600 text-white py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors text-center whitespace-nowrap cursor-pointer"
                >
                  Zur Kasse
                </Link>
              ) : (
                <Link 
                  href="/login"
                  onClick={onClose}
                  className="block w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors text-center whitespace-nowrap cursor-pointer"
                >
                  Anmelden für Bestellung
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}