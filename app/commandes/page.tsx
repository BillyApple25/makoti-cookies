'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthContext } from '@/components/AuthProvider';
import { OrderService } from '@/services/firebase/orderService';
import { ReviewService } from '@/services/firebase/reviewService';
import ReviewModal from '@/components/ReviewModal';
import { Order, FirebaseProduct } from '@/types/firebase';

export default function MeinBestellungen() {
  const { user, isAuthenticated } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{id: string, name: string} | null>(null);
  const [userReviewedProducts, setUserReviewedProducts] = useState<string[]>([]);

  useEffect(() => {
    const loadOrdersAndReviews = async () => {
      console.log('🔄 Chargement des commandes...');
      console.log('✨ Utilisateur connecté:', isAuthenticated);
      console.log('👤 User ID:', user?.uid);
      
      if (!isAuthenticated || !user) {
        console.log('❌ Utilisateur non connecté - arrêt du chargement');
        setLoading(false);
        return;
      }

      try {
        console.log('📞 Appel du service pour récupérer les commandes...');
        const userOrders = await OrderService.getOrdersByUserId(user.uid);
        console.log('🎉 Succès ! Commandes récupérées:', userOrders);
        setOrders(userOrders);
        
        // Récupérer la liste des produits déjà reviewés par l'utilisateur
        const userReviews = await ReviewService.getReviewsByUserId(user.uid);
        const reviewedProductIds = userReviews.map(review => review.productId);
        setUserReviewedProducts(reviewedProductIds);
        console.log('📝 Produits déjà reviewés:', reviewedProductIds);
        
        setError('');
      } catch (error) {
        console.error('💥 Erreur lors du chargement des commandes:', error);
        setError('Erreur lors du chargement des commandes');
      } finally {
        setLoading(false);
        console.log('🏁 Chargement terminé');
      }
    };

    loadOrdersAndReviews();
  }, [isAuthenticated, user]);

  // Fonction pour recharger manuellement
  const reloadOrders = async () => {
    if (!user) return;
    
    console.log('🔄 Rechargement manuel des commandes...');
    setLoading(true);
    setError('');
    
    try {
      const userOrders = await OrderService.getOrdersByUserId(user.uid);
      setOrders(userOrders);
      
      const userReviews = await ReviewService.getReviewsByUserId(user.uid);
      const reviewedProductIds = userReviews.map(review => review.productId);
      setUserReviewedProducts(reviewedProductIds);
      
      console.log('✅ Rechargement réussi:', userOrders.length, 'commandes');
    } catch (error) {
      console.error('❌ Erreur lors du rechargement:', error);
      setError('Erreur lors du rechargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ausstehend';
      case 'confirmed': return 'Bestätigt';
      case 'processing': return 'In Bearbeitung';
      case 'shipped': return 'Versandt';
      case 'delivered': return 'Geliefert';
      case 'cancelled': return 'Storniert';
      default: return status;
    }
  };

  const handleReviewProduct = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setReviewModalOpen(true);
  };

  const handleReviewSubmitted = async () => {
    setReviewModalOpen(false);
    setSelectedProduct(null);
    
    // Recharger la liste des produits reviewés
    if (user) {
      try {
        const userReviews = await ReviewService.getReviewsByUserId(user.uid);
        const reviewedProductIds = userReviews.map(review => review.productId);
        setUserReviewedProducts(reviewedProductIds);
      } catch (error) {
        console.error('Erreur lors du rechargement des reviews:', error);
      }
    }
  };

  const canReviewProduct = (productId: string, orderStatus: string) => {
    return orderStatus === 'delivered' && !userReviewedProducts.includes(productId);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unbekannt';
    
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Meine Bestellungen
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Sie müssen sich anmelden, um Ihre Bestellungen zu sehen.
          </p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Jetzt anmelden
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Bestellungen werden geladen...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🛍️ Meine Bestellungen
          </h1>
          <p className="text-gray-600 text-lg">
            Hier finden Sie alle Ihre bisherigen Bestellungen
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            ⚠️ {error}
            <div className="mt-2">
              <button 
                onClick={reloadOrders}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Noch keine Bestellungen
            </h2>
            <p className="text-gray-600 mb-8">
              Sie haben noch keine Bestellungen aufgegeben.
            </p>
            <div className="space-x-4">
              <Link
                href="/produkt"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Jetzt einkaufen
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-2 md:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        📋 Bestellung #{order.id.substring(0, 8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Bestellt am {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        {order.total.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Bestellte Artikel:</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://readdy.ai/api/search-image?query=${encodeURIComponent(item.name + ' cookie')}&width=100&height=100&seq=${item.productId}&orientation=square`;
                            }}
                          />
                          <div>
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="text-gray-600 ml-2">({item.quantity}x)</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-gray-900">
                            {(item.quantity * item.price).toFixed(2)} €
                          </span>
                          
                          {/* Bouton de review si la commande est livrée et pas encore reviewée */}
                          {canReviewProduct(item.productId, order.status) && (
                            <button
                              onClick={() => handleReviewProduct(item.productId, item.name)}
                              className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
                            >
                              ⭐ Bewerten
                            </button>
                          )}
                          
                          {/* Indicateur si déjà reviewé */}
                          {order.status === 'delivered' && userReviewedProducts.includes(item.productId) && (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              ✅ Bewertet
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message informatif pour les commandes livrées */}
                  {order.status === 'delivered' && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">
                        🎉 <strong>Bestellung geliefert!</strong> Sie können jetzt Bewertungen zu Ihren Cookies hinterlassen, um anderen Kunden zu helfen.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedProduct && (
        <ReviewModal
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedProduct(null);
          }}
          onReviewSubmitted={handleReviewSubmitted}
          userId={user?.uid || ''}
          userName={user?.displayName || user?.email || 'Anonyme'}
        />
      )}

      <Footer />
    </div>
  );
} 