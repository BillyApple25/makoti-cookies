'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { useProducts } from '@/hooks/useProducts';
import { ReviewService } from '@/services/firebase/reviewService';
import { FirebaseProduct } from '@/types/firebase';
import StarRating from '@/components/StarRating';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function MonthlySpecials() {
  const { addToCart } = useCart();
  const { newProducts, bestsellerProducts, loading, error } = useProducts();
  const [bestsellerProduct, setBestsellerProduct] = useState<FirebaseProduct | null>(null);
  const [newProduct, setNewProduct] = useState<FirebaseProduct | null>(null);
  const [bestsellerRating, setBestsellerRating] = useState<{ rating: number; reviewCount: number } | null>(null);
  const [newProductRating, setNewProductRating] = useState<{ rating: number; reviewCount: number } | null>(null);

  useEffect(() => {
    // Récupérer le premier produit bestseller et nouveau
    const bestseller = bestsellerProducts[0] || null;
    const newProd = newProducts[0] || null;
    
    setBestsellerProduct(bestseller);
    setNewProduct(newProd);

    // Charger les ratings dynamiques depuis Firebase
    const loadRatings = async () => {
      if (bestseller) {
        try {
          const rating = await ReviewService.getProductRating(bestseller.id);
          setBestsellerRating(rating);
        } catch (error) {
          console.error('Error loading bestseller rating:', error);
          setBestsellerRating({ rating: 0, reviewCount: 0 });
        }
      }
      
      if (newProd) {
        try {
          const rating = await ReviewService.getProductRating(newProd.id);
          setNewProductRating(rating);
        } catch (error) {
          console.error('Error loading new product rating:', error);
          setNewProductRating({ rating: 0, reviewCount: 0 });
        }
      }
    };

    loadRatings();
  }, [bestsellerProducts, newProducts]);

  const handleAddToCart = async (product: FirebaseProduct) => {
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl
      });
      console.log('Produit ajouté au panier avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" message="Chargement des spécialités..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Unsere 
            <span className="text-amber-600 font-pacifico"> Spezialitäten</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Entdecken Sie unsere besonderen Kreationen - handverlesen für Ihren Genuss
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Bestseller Cookie */}
          {bestsellerProduct && (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
              <div className="relative">
                <img 
                  src={bestsellerProduct.imageUrl} 
                  alt={bestsellerProduct.name}
                  className="w-full h-80 object-cover object-center"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://readdy.ai/api/search-image?query=${encodeURIComponent(bestsellerProduct.name + ' cookie bestseller')}&width=600&height=400&seq=${bestsellerProduct.id}&orientation=landscape`;
                  }}
                />
                <div className="absolute top-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-full font-semibold text-sm">
                  Sehr beliebt
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Bestseller des Monats</h3>
                  <p className="text-lg opacity-90">Der absolute Favorit unserer Kunden</p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-3xl font-bold text-gray-800 font-pacifico">{bestsellerProduct.name}</h4>
                  <span className="text-3xl font-bold text-amber-600">€{bestsellerProduct.price.toFixed(2)}</span>
                </div>
                
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {bestsellerProduct.description}
                </p>

                {/* Rating */}
                <div className="mb-6">
                  {bestsellerRating && bestsellerRating.reviewCount > 0 ? (
                    <StarRating 
                      rating={bestsellerRating.rating} 
                      reviewCount={bestsellerRating.reviewCount}
                      size="md"
                    />
                  ) : (
                    <p className="text-gray-500">Noch keine Bewertungen</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => handleAddToCart(bestsellerProduct)}
                    className="flex-1 bg-amber-600 text-white py-4 px-6 rounded-full hover:bg-amber-700 transition-colors font-semibold text-lg"
                  >
                    In den Warenkorb
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* New Cookie of the Month */}
          {newProduct && (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
              <div className="relative">
                <img 
                  src={newProduct.imageUrl} 
                  alt={newProduct.name}
                  className="w-full h-80 object-cover object-center"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://readdy.ai/api/search-image?query=${encodeURIComponent(newProduct.name + ' cookie new fresh')}&width=600&height=400&seq=${newProduct.id}&orientation=landscape`;
                  }}
                />
                <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full font-semibold text-sm animate-pulse">
                  Neu
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Neuer Cookie des Monats</h3>
                  <p className="text-lg opacity-90">Frisch kreiert für Ihre Geschmacksknospen</p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-3xl font-bold text-gray-800 font-pacifico">{newProduct.name}</h4>
                  <span className="text-3xl font-bold text-amber-600">€{newProduct.price.toFixed(2)}</span>
                </div>
                
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {newProduct.description}
                </p>

                {/* Rating */}
                <div className="mb-6">
                  {newProductRating && newProductRating.reviewCount > 0 ? (
                    <StarRating 
                      rating={newProductRating.rating} 
                      reviewCount={newProductRating.reviewCount}
                      size="md"
                    />
                  ) : (
                    <p className="text-gray-500">Noch keine Bewertungen</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => handleAddToCart(newProduct)}
                    className="flex-1 bg-green-600 text-white py-4 px-6 rounded-full hover:bg-green-700 transition-colors font-semibold text-lg"
                  >
                    Jetzt probieren
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Show message if no special products */}
        {!bestsellerProduct && !newProduct && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Keine besonderen Produkte verfügbar. Schauen Sie sich alle unsere Cookies an!
            </p>
            <Link 
              href="/produkt"
              className="inline-block mt-4 bg-amber-600 text-white px-8 py-3 rounded-full hover:bg-amber-700 transition-colors font-semibold"
            >
              Alle Produkte ansehen
            </Link>
          </div>
        )}
      </div>
    </section>
  );
} 