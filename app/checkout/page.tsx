'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/components/CartProvider';
import { useAuthContext } from '@/components/AuthProvider';
import { OrderService } from '@/services/firebase/orderService';
import { PaymentMethod, Address } from '@/types/firebase';

export default function Checkout() {
  const router = useRouter();
  const { items, clearCart, totalPrice } = useCart();
  const { user, isAuthenticated } = useAuthContext();
  
  // Étapes du checkout
  const [currentStep, setCurrentStep] = useState<'address' | 'payment'>('address');
  
  // Données du formulaire d'adresse
  const [addressData, setAddressData] = useState<Address>({
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Deutschland'
  });

  // Données de paiement
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Méthodes de paiement disponibles
  const paymentMethods = [
    { id: 'paypal' as PaymentMethod, name: 'PayPal', icon: '💰', description: 'Bezahlen Sie sicher mit PayPal' },
    { id: 'stripe' as PaymentMethod, name: 'Kreditkarte', icon: '💳', description: 'Visa, Mastercard, American Express' },
    { id: 'cash' as PaymentMethod, name: 'Barzahlung bei Abholung', icon: '💵', description: 'Zahlen Sie bei der Abholung' }
  ];

  // Redirection si pas connecté ou panier vide
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (items.length === 0) {
      router.push('/panier');
      return;
    }
  }, [isAuthenticated, items, router]);

  // Gestion du formulaire d'adresse
  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateAddress = (): boolean => {
    return !!(
      addressData.name.trim() &&
      addressData.street.trim() &&
      addressData.city.trim() &&
      addressData.postalCode.trim() &&
      addressData.country.trim()
    );
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      setCurrentStep('payment');
    } else {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
    }
  };

  // Gestion du paiement
  const handlePaymentSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const handleFinalCheckout = async () => {
    if (!paymentMethod || !user) {
      alert('Bitte wählen Sie eine Zahlungsmethode aus.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        userId: user.uid,
        userEmail: user.email || '',
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        })),
        total: totalPrice,
        status: 'pending' as const,
        paymentMethod: paymentMethod,
        shippingAddress: addressData,
        billingAddress: addressData, // Même adresse pour la livraison et facturation
        notes: ''
      };

      const orderId = await OrderService.addOrder(orderData);
      console.log('✅ Commande créée avec succès:', orderId);

      // Vider le panier
      await clearCart();

      // Rediriger vers la page de confirmation
      router.push(`/commandes?success=true&orderId=${orderId}`);

    } catch (error) {
      console.error('❌ Erreur lors de la création de la commande:', error);
      alert('Erreur lors de la création de votre commande. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep === 'address' ? 'text-amber-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'address' ? 'bg-amber-600 text-white' : 'bg-green-600 text-white'}`}>
                {currentStep === 'payment' ? '✓' : '1'}
              </div>
              <span className="font-medium">Lieferadresse</span>
            </div>
            
            <div className={`w-12 h-px ${currentStep === 'payment' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center space-x-2 ${currentStep === 'payment' ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' ? 'bg-amber-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
              <span className="font-medium">Zahlungsmethode</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            {currentStep === 'address' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📍 Lieferadresse</h2>
                
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Vollständiger Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={addressData.name}
                      onChange={(e) => handleAddressChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Max Mustermann"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                      Straße und Hausnummer *
                    </label>
                    <input
                      type="text"
                      id="street"
                      value={addressData.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Musterstraße 123"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postleitzahl *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        value={addressData.postalCode}
                        onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="12345"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        Stadt *
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={addressData.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Berlin"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Land *
                    </label>
                    <select
                      id="country"
                      value={addressData.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    >
                      <option value="Deutschland">Deutschland</option>
                      <option value="Österreich">Österreich</option>
                      <option value="Schweiz">Schweiz</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                    >
                      Weiter zur Zahlung →
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">💳 Zahlungsmethode</h2>
                  <button
                    onClick={() => setCurrentStep('address')}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    ← Adresse ändern
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => handlePaymentSelect(method.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{method.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          paymentMethod === method.id
                            ? 'border-amber-500 bg-amber-500'
                            : 'border-gray-300'
                        }`}>
                          {paymentMethod === method.id && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleFinalCheckout}
                  disabled={!paymentMethod || isProcessing}
                  className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Bestellung wird verarbeitet...</span>
                    </div>
                  ) : (
                    `Jetzt bestellen (€${totalPrice.toFixed(2)})`
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Bestellübersicht</h3>
              
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://readdy.ai/api/search-image?query=${encodeURIComponent(item.name + ' cookie')}&width=100&height=100&seq=${item.productId}&orientation=square`;
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-gray-600 text-xs">{item.quantity}x €{item.price.toFixed(2)}</p>
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      €{(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Zwischensumme</span>
                  <span className="font-semibold">€{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Versandkosten</span>
                  <span className="font-semibold text-green-600">Kostenlos</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Gesamtsumme</span>
                    <span className="text-xl font-bold text-amber-600">€{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {currentStep === 'payment' && addressData.name && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 text-sm mb-2">📍 Lieferadresse</h4>
                  <div className="text-xs text-gray-600">
                    <p>{addressData.name}</p>
                    <p>{addressData.street}</p>
                    <p>{addressData.postalCode} {addressData.city}</p>
                    <p>{addressData.country}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 