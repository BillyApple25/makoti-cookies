
'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/components/CartProvider';
import { useAuthContext } from '@/components/AuthProvider';

export default function Panier() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user, isAuthenticated } = useAuthContext();

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, quantity);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🛒 Ihr Warenkorb
          </h1>
          <p className="text-gray-600 text-lg">
            Überprüfen Sie Ihre Auswahl vor der Bestellung
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍪</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Ihr Warenkorb ist leer
            </h2>
            <p className="text-gray-600 mb-8">
              Entdecken Sie unsere leckeren Cookies und fügen Sie sie zu Ihrem Warenkorb hinzu.
            </p>
            <Link 
              href="/produkt"
              className="inline-block bg-amber-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Jetzt einkaufen
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Produits dans le panier */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://readdy.ai/api/search-image?query=${encodeURIComponent(item.name + ' cookie')}&width=200&height=200&seq=${item.productId}&orientation=square`;
                      }}
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-amber-600 font-bold text-lg">€{item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        €{(item.quantity * item.price).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-500 hover:text-red-700 text-sm mt-1"
                      >
                        Entfernen
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé de la commande */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Bestellübersicht</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zwischensumme</span>
                    <span className="font-semibold">€{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Versandkosten</span>
                    <span className="font-semibold text-green-600">Kostenlos</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Gesamtsumme</span>
                      <span className="text-2xl font-bold text-amber-600">€{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {isAuthenticated ? (
                    <Link 
                      href="/checkout"
                      className="block w-full bg-amber-600 text-white py-4 rounded-full text-lg font-semibold hover:bg-amber-700 transition-colors text-center"
                    >
                      Zur Kasse
                    </Link>
                  ) : (
                    <div className="space-y-2">
                      <Link 
                        href="/login"
                        className="block w-full bg-amber-600 text-white py-4 rounded-full text-lg font-semibold hover:bg-amber-700 transition-colors text-center"
                      >
                        Anmelden für Bestellung
                      </Link>
                      <p className="text-xs text-gray-500 text-center">
                        Sie müssen sich anmelden, um eine Bestellung aufzugeben
                      </p>
                    </div>
                  )}
                  
                  <Link 
                    href="/produkt"
                    className="block w-full bg-gray-100 text-gray-700 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors text-center"
                  >
                    Weiter einkaufen
                  </Link>
                  
                  <button
                    onClick={clearCart}
                    className="w-full text-red-500 hover:text-red-700 text-sm py-2"
                  >
                    Warenkorb leeren
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Sichere Zahlung mit SSL-Verschlüsselung
                  </p>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <span className="text-green-500">🔒</span>
                    <span className="text-xs text-green-600">256-bit SSL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
